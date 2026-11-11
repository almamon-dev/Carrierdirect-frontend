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
    const validTabs: DriverFilterStatus[] = ['All', 'Available', 'On Job', 'On Break', 'Offline', 'Blocked', 'Unavailable'];
    const [filterStatus, setFilterStatusState] = useState<DriverFilterStatus>(
        validTabs.includes(initialTab) ? initialTab : 'All'
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
        break: 0,
        offline: 0,
        blocked: 0,
    });

    // Detailed filter drawer state
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [vehicleFilter, setVehicleFilter] = useState<string>('all');
    const [areaFilter, setAreaFilter] = useState<string>('all');

    const [vehicleModalDriver, setVehicleModalDriver] = useState<DriverItem | null>(null);
    const [serviceAreaModalDriver, setServiceAreaModalDriver] = useState<DriverItem | null>(null);
    const [historyModalDriver, setHistoryModalDriver] = useState<DriverItem | null>(null);

    const computeCounts = useCallback((list: DriverItem[]) => {
        return {
            all: list.length,
            available: list.filter((d) => d.status === 'Available').length,
            on_job: list.filter((d) => d.status === 'On Job').length,
            break: list.filter((d) => d.status === 'On Break' || d.duty_status === 'break').length,
            offline: list.filter((d) => d.status === 'Offline' || d.duty_status === 'offline').length,
            blocked: list.filter((d) => ['Blocked', 'Disabled'].includes(d.status) || ['blocked', 'disabled'].includes(String(d.account_status))).length,
            unavailable: list.filter((d) => ['Offline', 'On Break', 'Disabled', 'Blocked', 'Unavailable'].includes(d.status)).length,
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

    const handleDutyStatusChange = async (driver: DriverItem, newDutyStatus: 'online' | 'offline' | 'break') => {
        try {
            const res = await apiClient.patch(`/supplier/availability/drivers/${driver.id}/duty-status`, {
                duty_status: newDutyStatus,
            });
            const isSuccess = res?.data?.success ?? true;
            const updated = res?.data?.data?.driver || res?.data?.data || res?.data;

            if (isSuccess && updated) {
                const formattedDuty = newDutyStatus === 'online' ? 'Online' : newDutyStatus === 'break' ? 'On Break' : 'Offline';
                showToast(`Duty status updated to ${formattedDuty} for ${driver.name || 'Driver'}`, 'success');
                handleDriverUpdated({
                    ...driver,
                    duty_status: newDutyStatus,
                    status: newDutyStatus === 'online' ? (driver.job_status === 'on_job' ? 'On Job' : 'Available') : newDutyStatus === 'break' ? 'On Break' : 'Offline',
                    ...updated,
                });
            } else {
                showToast(res?.data?.message || 'Failed to update duty status', 'error');
            }
        } catch (err: any) {
            console.error('Duty status update error:', err);
            const msg = err.response?.data?.message || err.message || 'Failed to update duty status';
            showToast(msg, 'error');
        }
    };

    const handleAccountStatusChange = async (driver: DriverItem, newAccountStatus: 'active' | 'disabled' | 'blocked') => {
        const actionLabel = newAccountStatus === 'active' ? 'reactivate' : newAccountStatus === 'blocked' ? 'block' : 'disable';
        if (!window.confirm(`Are you sure you want to ${actionLabel} the account for ${driver.name || 'this driver'}?`)) {
            return;
        }

        try {
            const res = await apiClient.patch(`/supplier/availability/drivers/${driver.id}/account-status`, {
                account_status: newAccountStatus,
                reason: `Account ${actionLabel}d via Supplier Dashboard`,
            });
            const isSuccess = res?.data?.success ?? true;
            const updated = res?.data?.data?.driver || res?.data?.data || res?.data;

            if (isSuccess && updated) {
                showToast(`Account successfully ${actionLabel}d for ${driver.name || 'Driver'}`, 'success');
                handleDriverUpdated({
                    ...driver,
                    account_status: newAccountStatus,
                    status: newAccountStatus === 'active' ? (driver.duty_status === 'online' ? (driver.job_status === 'on_job' ? 'On Job' : 'Available') : 'Offline') : (newAccountStatus === 'blocked' ? 'Blocked' : 'Disabled'),
                    ...updated,
                });
            } else {
                showToast(res?.data?.message || 'Failed to update account status', 'error');
            }
        } catch (err: any) {
            console.error('Account status update error:', err);
            const msg = err.response?.data?.message || err.message || 'Failed to update account status';
            showToast(msg, 'error');
        }
    };

    const handleStatusChange = async (driver: DriverItem, newStatus: 'Available' | 'On Job' | 'Unavailable') => {
        if (newStatus === 'On Job') {
            showToast('Job Status is system-controlled by active shipment assignments.', 'info');
            return;
        }

        const dutyTarget: 'online' | 'offline' = newStatus === 'Available' ? 'online' : 'offline';
        await handleDutyStatusChange(driver, dutyTarget);
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
            if (filterStatus === 'Available') {
                if (d.status !== 'Available') return false;
            } else if (filterStatus === 'On Job') {
                if (d.status !== 'On Job') return false;
            } else if (filterStatus === 'On Break') {
                if (d.status !== 'On Break' && d.duty_status !== 'break') return false;
            } else if (filterStatus === 'Offline') {
                if (d.status !== 'Offline' && d.duty_status !== 'offline') return false;
            } else if (filterStatus === 'Blocked') {
                const isBlocked = ['Blocked', 'Disabled'].includes(d.status) || ['blocked', 'disabled'].includes(String(d.account_status));
                if (!isBlocked) return false;
            } else if (filterStatus === 'Unavailable') {
                const isUnavail = ['Offline', 'On Break', 'Disabled', 'Blocked', 'Unavailable'].includes(d.status);
                if (!isUnavail) return false;
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
        historyModalDriver,
        setHistoryModalDriver,
        handleDriverUpdated,
        handleDutyStatusChange,
        handleAccountStatusChange,
        handleStatusChange,
        handleRemoveVehicle,
        handleRemoveServiceArea,
    };
}

export default useDriversAvailability;
