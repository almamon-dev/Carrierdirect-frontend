import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { DriverItem } from '../types/driverAvailability.types';
import { VEHICLE_TYPES, PRESET_VEHICLES } from '../components/AssignVehicleFormFields';

export type FleetVehicleOption = {
    id: string;
    name: string;
    type: string;
    registration_no: string;
    capacity: string;
    status?: string;
    assigned_driver?: string | null;
};

export function useAssignVehicle(
    driver: DriverItem | null,
    isOpen: boolean,
    onSuccess: (updatedDriver: DriverItem) => void,
    onClose: () => void
) {
    const showToast = useToastStore((state) => state.showToast);
    const [fleetVehicles, setFleetVehicles] = useState<FleetVehicleOption[]>([]);
    const [isLoadingFleet, setIsLoadingFleet] = useState(false);
    const [vehicleName, setVehicleName] = useState('');
    const [vehicleType, setVehicleType] = useState('Van');
    const [isCustomType, setIsCustomType] = useState(false);
    const [customType, setCustomType] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [capacity, setCapacity] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    // Load company fleet vehicles dynamically
    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        async function fetchFleet() {
            setIsLoadingFleet(true);
            try {
                const res = await apiClient.get('/supplier/availability/vehicles');
                const list = res.data?.data?.vehicles || res.data?.vehicles || res.data?.data || res.data || [];
                if (Array.isArray(list) && isMounted) {
                    setFleetVehicles(
                        list.map((v: any) => ({
                            id: String(v.id),
                            name: v.name || v.model || 'Fleet Vehicle',
                            type: v.type || 'Van',
                            registration_no: v.registration_no || v.plate || '',
                            capacity: v.capacity || '',
                            status: v.status,
                            assigned_driver: v.assigned_driver,
                        }))
                    );
                }
            } catch (err) {
                console.warn('Could not load company fleet vehicles:', err);
            } finally {
                if (isMounted) setIsLoadingFleet(false);
            }
        }

        fetchFleet();
        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    useEffect(() => {
        if (driver && isOpen) {
            setVehicleName(driver.vehicle?.name || driver.vehicle?.model || '');
            const existingType = driver.vehicle?.type || 'Van';
            if (VEHICLE_TYPES.includes(existingType)) {
                setVehicleType(existingType);
                setIsCustomType(false);
                setCustomType('');
            } else if (existingType) {
                setVehicleType(existingType);
                setIsCustomType(true);
                setCustomType(existingType);
            } else {
                setVehicleType('Van');
                setIsCustomType(false);
                setCustomType('');
            }
            setVehiclePlate(driver.vehicle?.plate || driver.vehicle?.registration_no || '');
            setCapacity(driver.vehicle?.capacity || '');
        }
    }, [driver, isOpen]);

    const applyVehicle = (v: { name: string; type: string; plate?: string; registration_no?: string; capacity?: string }) => {
        setVehicleName(v.name);
        const t = v.type || 'Van';
        if (VEHICLE_TYPES.includes(t)) {
            setVehicleType(t);
            setIsCustomType(false);
            setCustomType('');
        } else {
            setVehicleType(t);
            setIsCustomType(true);
            setCustomType(t);
        }
        setVehiclePlate(v.plate || v.registration_no || '');
        setCapacity(v.capacity || '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!driver) return;
        const selectedType = (isCustomType ? customType : vehicleType).trim();

        if (!vehicleName.trim() && !vehiclePlate.trim()) {
            showToast('Please provide a vehicle model or registration plate.', 'error');
            return;
        }

        if (!selectedType) {
            showToast('Please specify a vehicle type.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiClient.post(`/supplier/availability/drivers/${driver.id}/assign-vehicle`, {
                vehicle_name: vehicleName.trim(),
                vehicle_type: selectedType,
                vehicle_plate: vehiclePlate.trim(),
                capacity: capacity.trim(),
            });

            const isSuccess = res?.success ?? res?.data?.success ?? true;
            const updatedDriver = res?.data?.data || res?.data || res;
            if (isSuccess && updatedDriver) {
                showToast(`Vehicle assigned to ${driver.name || 'driver'} successfully!`, 'success');
                onSuccess(updatedDriver);
                onClose();
            } else {
                showToast(res?.message || res?.data?.message || 'Failed to assign vehicle.', 'error');
            }
        } catch (err: any) {
            console.error('Assign vehicle error:', err);
            showToast(err.response?.data?.message || 'Failed to assign vehicle.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemove = async () => {
        if (!driver) return;
        if (!window.confirm(`Are you sure you want to remove the assigned vehicle from ${driver.name || 'this driver'}?`)) {
            return;
        }

        setIsRemoving(true);
        try {
            const res = await apiClient.delete(`/supplier/availability/drivers/${driver.id}/remove-vehicle`);
            const isSuccess = res?.success ?? res?.data?.success ?? true;
            const updatedDriver = res?.data?.data || res?.data || res;
            if (isSuccess && updatedDriver) {
                showToast(`Vehicle removed from ${driver.name || 'driver'} successfully.`, 'success');
                onSuccess(updatedDriver);
                onClose();
            } else {
                showToast(res?.message || res?.data?.message || 'Failed to remove vehicle.', 'error');
            }
        } catch (err: any) {
            console.error('Remove vehicle error:', err);
            showToast(err.response?.data?.message || 'Failed to remove vehicle.', 'error');
        } finally {
            setIsRemoving(false);
        }
    };

    return {
        fleetVehicles,
        isLoadingFleet,
        vehicleName,
        setVehicleName,
        vehicleType,
        setVehicleType,
        isCustomType,
        setIsCustomType,
        customType,
        setCustomType,
        vehiclePlate,
        setVehiclePlate,
        capacity,
        setCapacity,
        isSubmitting,
        isRemoving,
        applyVehicle,
        handleSubmit,
        handleRemove,
    };
}

export default useAssignVehicle;
