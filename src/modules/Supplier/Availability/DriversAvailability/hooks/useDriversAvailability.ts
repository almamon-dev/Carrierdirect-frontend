import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { DriverItem, DriverCounts, DriverFilterStatus } from '../types/driverAvailability.types';
import { DEFAULT_SEED_DRIVERS } from '../utils/driverAvailabilitySeeds';

export function useDriversAvailability() {
    const [searchParams, setSearchParams] = useSearchParams();
    const showToast = useToastStore((state) => state.showToast);

    const initialTab = (searchParams.get('tab') as DriverFilterStatus) || 'All';
    const [filterStatus, setFilterStatusState] = useState<DriverFilterStatus>(
        ['All', 'Available', 'On Job', 'Unavailable'].includes(initialTab) ? initialTab : 'All'
    );

    const setFilterStatus = (tab: DriverFilterStatus) => {
        setFilterStatusState(tab);
        if (tab === 'All') {
            searchParams.delete('tab');
            setSearchParams(searchParams);
        } else {
            searchParams.set('tab', tab);
            setSearchParams(searchParams);
        }
    };

    const [drivers, setDrivers] = useState<DriverItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [counts, setCounts] = useState<DriverCounts>({
        all: 0,
        available: 0,
        unavailable: 0,
        on_job: 0,
    });

    // Detailed filter drawer state
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [vehicleFilter, setVehicleFilter] = useState<string>('all');
    const [areaFilter, setAreaFilter] = useState<string>('all');

    const [vehicleModalDriver, setVehicleModalDriver] = useState<DriverItem | null>(null);
    const [serviceAreaModalDriver, setServiceAreaModalDriver] = useState<DriverItem | null>(null);

    const computeCounts = useCallback((list: DriverItem[]) => {
        return {
            all: list.length,
            available: list.filter((d) => d.status === 'Available').length,
            on_job: list.filter((d) => d.status === 'On Job').length,
            unavailable: list.filter((d) => d.status === 'Unavailable').length,
        };
    }, []);

    const fetchDrivers = useCallback(async (isSilent = false) => {
        if (!isSilent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            let list: DriverItem[] = [];
            let fetchedCounts: DriverCounts | null = null;

            try {
                const res = await apiClient.get('/supplier/availability/drivers');
                const isSuccess = res?.success ?? res?.data?.success ?? true;
                const payload = res?.data?.data || res?.data || res;
                if (isSuccess && payload?.drivers && Array.isArray(payload.drivers) && payload.drivers.length > 0) {
                    list = payload.drivers;
                    if (payload.counts) {
                        fetchedCounts = payload.counts;
                    }
                }
            } catch (apiErr) {
                console.warn('Driver availability endpoint error, falling back to team:', apiErr);
            }

            if (list.length === 0) {
                try {
                    const teamRes = await apiClient.get('/supplier/team/members');
                    const teamList = teamRes?.data?.data?.members || teamRes?.data?.data || teamRes?.data || [];
                    if (Array.isArray(teamList) && teamList.length > 0) {
                        const rawDrivers = teamList.filter((m: any) => {
                            const roleName = String(m.role?.name || m.role || '').toLowerCase();
                            const desig = String(m.designation || '').toLowerCase();
                            return roleName.includes('driver') || desig.includes('driver') || m.is_driver;
                        });
                        const source = rawDrivers.length > 0 ? rawDrivers : teamList;
                        list = source.map((m: any) => ({
                            id: String(m.id || m.employee_id),
                            user_id: m.user_id || m.id,
                            employee_id: m.employee_id || (m.id ? `EMP-${m.id}` : undefined),
                            name: m.name || `${m.first_name || ''} ${m.last_name || ''}`.trim() || 'Driver',
                            email: m.email || '',
                            phone: m.phone || m.phone_number || '',
                            role: m.role?.name || m.role || 'Driver',
                            status: (m.availability_status || (m.status === 'active' || m.status === 'Active' ? 'Available' : 'Unavailable')) as 'Available' | 'On Job' | 'Unavailable',
                            currentLocation: m.current_location || m.city || 'London, UK',
                            assignedVehicle: m.assigned_vehicle || m.vehicle?.name || (m.vehicle?.plate ? `${m.vehicle.name || 'Vehicle'} (${m.vehicle.plate})` : null),
                            vehicle: m.vehicle || (m.assigned_vehicle ? { name: m.assigned_vehicle, plate: m.vehicle_plate } : null),
                            assignedServiceArea: m.assigned_service_area || m.service_area?.formatted || (m.service_area?.city ? `${m.service_area.city}, ${m.service_area.country}` : null),
                            service_area: m.service_area || null,
                            service_area_id: m.service_area_id || m.service_area?.id || null,
                            is_verified: m.is_verified ?? true,
                        }));
                    }
                } catch {
                    // Fallback to default seeds if totally empty
                }
            }

            if (list.length === 0) {
                list = DEFAULT_SEED_DRIVERS;
            }

            setDrivers(list);
            setCounts(fetchedCounts || computeCounts(list));
        } catch (err: any) {
            console.error('Failed to load drivers availability:', err);
            setDrivers(DEFAULT_SEED_DRIVERS);
            setCounts(computeCounts(DEFAULT_SEED_DRIVERS));
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [computeCounts]);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    const handleDriverUpdated = (updatedDriver: DriverItem) => {
        setDrivers((prev) => {
            const next = prev.map((d) => (String(d.id) === String(updatedDriver.id) ? { ...d, ...updatedDriver } : d));
            setCounts(computeCounts(next));
            return next;
        });
    };

    const handleStatusChange = async (driver: DriverItem, newStatus: 'Available' | 'On Job' | 'Unavailable') => {
        const prevStatus = driver.status;
        setDrivers((prev) => {
            const next = prev.map((d) => (d.id === driver.id ? { ...d, status: newStatus } : d));
            setCounts(computeCounts(next));
            return next;
        });

        try {
            const res = await apiClient.post(`/supplier/availability/drivers/${driver.id}/status`, {
                status: newStatus,
            });
            const isSuccess = res?.success ?? res?.data?.success ?? true;
            const updatedDriver = res?.data?.data || res?.data || res;

            if (isSuccess && updatedDriver?.id) {
                showToast(`Status updated to ${newStatus} for ${driver.name || 'Driver'}`, 'success');
                handleDriverUpdated(updatedDriver);
            } else {
                setDrivers((prev) => {
                    const next = prev.map((d) => (d.id === driver.id ? { ...d, status: prevStatus } : d));
                    setCounts(computeCounts(next));
                    return next;
                });
                showToast(res?.message || res?.data?.message || 'Failed to update status', 'error');
            }
        } catch (err: any) {
            setDrivers((prev) => {
                const next = prev.map((d) => (d.id === driver.id ? { ...d, status: prevStatus } : d));
                setCounts(computeCounts(next));
                return next;
            });
            console.error('Status change error:', err);
            showToast('Failed to update status on server.', 'error');
        }
    };

    const handleRemoveVehicle = async (driver: DriverItem) => {
        if (!window.confirm(`Are you sure you want to remove the assigned vehicle from ${driver.name || 'this driver'}?`)) {
            return;
        }

        try {
            const res = await apiClient.delete(`/supplier/availability/drivers/${driver.id}/remove-vehicle`);
            const isSuccess = res?.success ?? res?.data?.success ?? true;
            const updatedDriver = res?.data?.data || res?.data || res;

            if (isSuccess && updatedDriver) {
                showToast(`Vehicle removed from ${driver.name || 'driver'} successfully.`, 'success');
                handleDriverUpdated(updatedDriver);
            } else {
                showToast(res?.message || res?.data?.message || 'Failed to remove vehicle.', 'error');
            }
        } catch (err: any) {
            console.error('Remove vehicle error:', err);
            showToast(err.response?.data?.message || 'Failed to remove vehicle.', 'error');
        }
    };

    const handleRemoveServiceArea = async (driver: DriverItem) => {
        if (!window.confirm(`Are you sure you want to remove the assigned service area from ${driver.name || 'this driver'}?`)) {
            return;
        }

        try {
            const res = await apiClient.delete(`/supplier/availability/drivers/${driver.id}/remove-service-area`);
            const isSuccess = res?.success ?? res?.data?.success ?? true;
            const updatedDriver = res?.data?.data || res?.data || res;

            if (isSuccess && updatedDriver) {
                showToast(`Service area removed from ${driver.name || 'driver'} successfully.`, 'success');
                handleDriverUpdated(updatedDriver);
            } else {
                showToast(res?.message || res?.data?.message || 'Failed to remove service area.', 'error');
            }
        } catch (err: any) {
            console.error('Remove service area error:', err);
            showToast(err.response?.data?.message || 'Failed to remove service area.', 'error');
        }
    };

    const handleResetFilters = () => {
        setStatusFilter('all');
        setVehicleFilter('all');
        setAreaFilter('all');
    };

    const filteredDrivers = useMemo(() => {
        return drivers.filter((d) => {
            // 1. Tab filter
            if (filterStatus !== 'All' && d.status !== filterStatus) {
                return false;
            }

            // 2. Extra status filter from drawer
            if (statusFilter !== 'all' && d.status !== statusFilter) {
                return false;
            }

            // 3. Vehicle filter
            const hasVehicle = Boolean(d.assignedVehicle || d.vehicle?.plate);
            if (vehicleFilter === 'assigned' && !hasVehicle) return false;
            if (vehicleFilter === 'unassigned' && hasVehicle) return false;

            // 4. Area filter
            const hasArea = Boolean(d.assignedServiceArea || d.service_area_id);
            if (areaFilter === 'assigned' && !hasArea) return false;
            if (areaFilter === 'unassigned' && hasArea) return false;

            return true;
        });
    }, [drivers, filterStatus, statusFilter, vehicleFilter, areaFilter]);

    return {
        drivers,
        filteredDrivers,
        isLoading,
        isRefreshing,
        counts,
        filterStatus,
        setFilterStatus,
        statusFilter,
        setStatusFilter,
        vehicleFilter,
        setVehicleFilter,
        areaFilter,
        setAreaFilter,
        handleResetFilters,
        fetchDrivers,
        vehicleModalDriver,
        setVehicleModalDriver,
        serviceAreaModalDriver,
        setServiceAreaModalDriver,
        handleDriverUpdated,
        handleStatusChange,
        handleRemoveVehicle,
        handleRemoveServiceArea,
    };
}

export default useDriversAvailability;
