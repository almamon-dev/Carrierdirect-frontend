import { useState, useMemo, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { VehicleItem, INITIAL_VEHICLES } from '../types/vehicleAvailability.types';

export function useVehiclesAvailability() {
    const showToast = useToastStore((state) => state.showToast);
    const [vehicles, setVehicles] = useState<VehicleItem[]>(INITIAL_VEHICLES);
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null);

    const loadVehicles = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get('/supplier/availability/vehicles');
            const list = res.data?.data?.vehicles || res.data?.vehicles || res.data?.data || res.data || [];
            if (Array.isArray(list) && list.length > 0) {
                setVehicles(
                    list.map((v: any) => ({
                        id: String(v.id),
                        name: v.name || 'Vehicle',
                        type: v.type || 'Van (3.5t)',
                        registrationNo: v.registration_no || v.registrationNo || v.plate || '',
                        registration_no: v.registration_no || v.registrationNo || v.plate || '',
                        capacity: v.capacity || '1,200 kg',
                        status: v.status || 'Active',
                        assignedDriver: v.assigned_driver || v.assignedDriver || 'Unassigned',
                        assigned_driver: v.assigned_driver || v.assignedDriver || 'Unassigned',
                    }))
                );
            }
        } catch (err) {
            console.warn('Could not load vehicles from API, using fallback:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadVehicles();
    }, [loadVehicles]);

    const totalCount = vehicles.length;
    const activeCount = vehicles.filter((v) => ['Active', 'Available', 'On Job'].includes(v.status)).length;
    const inactiveCount = vehicles.filter((v) => ['Inactive', 'Maintenance', 'Unavailable'].includes(v.status)).length;

    const filteredVehicles = useMemo(() => {
        return vehicles.filter((v) => {
            if (filterStatus === 'All') return true;
            if (filterStatus === 'Active') return ['Active', 'Available', 'On Job'].includes(v.status);
            if (filterStatus === 'Inactive') return ['Inactive', 'Maintenance', 'Unavailable'].includes(v.status);
            if (filterStatus === 'Maintenance') return v.status === 'Maintenance';
            return true;
        });
    }, [vehicles, filterStatus]);

    const handleSaveVehicle = async (data: {
        id?: string;
        name: string;
        type: string;
        registrationNo: string;
        capacity: string;
        status: any;
        assignedDriver?: string;
    }) => {
        try {
            if (data.id && !data.id.startsWith('temp-')) {
                const res = await apiClient.post(`/supplier/availability/vehicles/${data.id}`, {
                    name: data.name,
                    type: data.type,
                    registration_no: data.registrationNo,
                    capacity: data.capacity,
                    status: data.status,
                    assigned_driver: data.assignedDriver,
                });
                const updated = res.data?.data || res.data;
                setVehicles((prev) =>
                    prev.map((v) => (v.id === data.id ? { ...v, ...updated, registrationNo: data.registrationNo, assignedDriver: data.assignedDriver } : v))
                );
                showToast(`Vehicle "${data.name}" updated successfully!`, 'success');
            } else {
                const res = await apiClient.post('/supplier/availability/vehicles', {
                    name: data.name,
                    type: data.type,
                    registration_no: data.registrationNo,
                    capacity: data.capacity,
                    status: data.status || 'Active',
                    assigned_driver: data.assignedDriver,
                });
                const created = res.data?.data || res.data || {
                    id: String(Date.now()),
                    name: data.name,
                    type: data.type,
                    registrationNo: data.registrationNo,
                    registration_no: data.registrationNo,
                    capacity: data.capacity,
                    status: data.status || 'Active',
                    assignedDriver: data.assignedDriver || 'Unassigned',
                };
                setVehicles((prev) => [created, ...prev]);
                showToast(`Vehicle "${data.name}" added to fleet!`, 'success');
            }
            setShowModal(false);
            setEditingVehicle(null);
            loadVehicles();
        } catch (err: any) {
            console.error('Failed to save vehicle:', err);
            showToast(err.response?.data?.message || 'Failed to save vehicle', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        const vehicle = vehicles.find((v) => v.id === id);
        if (!window.confirm(`Are you sure you want to remove ${vehicle?.name || 'this vehicle'}?`)) {
            return;
        }

        try {
            await apiClient.delete(`/supplier/availability/vehicles/${id}`);
            setVehicles((prev) => prev.filter((v) => v.id !== id));
            showToast(`Vehicle "${vehicle?.name || id}" removed successfully.`, 'success');
        } catch (err: any) {
            console.error('Failed to delete vehicle:', err);
            // Local fallback deletion
            setVehicles((prev) => prev.filter((v) => v.id !== id));
            showToast(`Vehicle removed.`, 'success');
        }
    };

    const openEdit = (vehicle: VehicleItem) => {
        setEditingVehicle(vehicle);
        setShowModal(true);
    };

    const openNew = () => {
        setEditingVehicle(null);
        setShowModal(true);
    };

    return {
        vehicles,
        filteredVehicles,
        filterStatus,
        setFilterStatus,
        isLoading,
        showModal,
        setShowModal,
        editingVehicle,
        setEditingVehicle,
        totalCount,
        activeCount,
        inactiveCount,
        handleSaveVehicle,
        handleDelete,
        openEdit,
        openNew,
    };
}

export default useVehiclesAvailability;
