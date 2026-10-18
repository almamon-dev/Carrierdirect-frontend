import React, { useState, useEffect } from 'react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import { useToastStore } from '@/stores/useToastStore';
import { VehicleItem } from '../types/vehicleAvailability.types';
import { VehicleModalFields, STANDARD_TYPES } from './VehicleModalFields';

interface VehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    editingVehicle: VehicleItem | null;
    onSave: (savedVehicle: {
        id?: string;
        name: string;
        type: string;
        registrationNo: string;
        capacity: string;
        status: 'Active' | 'Maintenance' | 'Inactive' | string;
        assignedDriver?: string;
    }) => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
    isOpen,
    onClose,
    editingVehicle,
    onSave,
}) => {
    const showToast = useToastStore((state) => state.showToast);
    const [name, setName] = useState('');
    const [type, setType] = useState('Van (3.5t)');
    const [isCustomType, setIsCustomType] = useState(false);
    const [customType, setCustomType] = useState('');
    const [registrationNo, setRegistrationNo] = useState('');
    const [capacity, setCapacity] = useState('');
    const [assignedDriver, setAssignedDriver] = useState('');
    const [status, setStatus] = useState<'Active' | 'Maintenance' | 'Inactive'>('Active');

    useEffect(() => {
        if (editingVehicle) {
            setName(editingVehicle.name);
            if (STANDARD_TYPES.includes(editingVehicle.type)) {
                setType(editingVehicle.type);
                setIsCustomType(false);
                setCustomType('');
            } else {
                setType(editingVehicle.type);
                setIsCustomType(true);
                setCustomType(editingVehicle.type);
            }
            setRegistrationNo(editingVehicle.registrationNo || editingVehicle.registration_no || '');
            setCapacity(editingVehicle.capacity || '');
            setAssignedDriver(editingVehicle.assignedDriver || editingVehicle.assigned_driver || '');
            
            const rawStatus = editingVehicle.status;
            if (rawStatus === 'Maintenance') {
                setStatus('Maintenance');
            } else if (rawStatus === 'Inactive' || rawStatus === 'Unavailable') {
                setStatus('Inactive');
            } else {
                setStatus('Active');
            }
        } else {
            setName('');
            setType('Van (3.5t)');
            setIsCustomType(false);
            setCustomType('');
            setRegistrationNo('');
            setCapacity('');
            setAssignedDriver('');
            setStatus('Active');
        }
    }, [editingVehicle, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedReg = registrationNo.trim();
        const effectiveType = (isCustomType ? customType : type).trim();

        if (!trimmedName || !trimmedReg) {
            showToast('Please provide both vehicle name and registration plate.', 'error');
            return;
        }

        if (!effectiveType) {
            showToast('Please specify a vehicle type.', 'error');
            return;
        }

        const formattedCapacity = capacity.trim()
            ? (capacity.toLowerCase().includes('kg') ? capacity.trim() : `${capacity.trim()} kg`)
            : '1,200 kg';

        onSave({
            id: editingVehicle?.id,
            name: trimmedName,
            type: effectiveType,
            registrationNo: trimmedReg,
            capacity: formattedCapacity,
            status,
            assignedDriver: assignedDriver.trim() || undefined,
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingVehicle ? 'Edit Fleet Vehicle' : 'Add New Vehicle'}
            description={
                editingVehicle
                    ? 'Update vehicle model, type, registration plate and operational availability status.'
                    : 'Register a new fleet vehicle to dispatch with drivers across your coverage areas.'
            }
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <VehicleModalFields
                    name={name}
                    setName={setName}
                    type={type}
                    setType={setType}
                    isCustomType={isCustomType}
                    setIsCustomType={setIsCustomType}
                    customType={customType}
                    setCustomType={setCustomType}
                    registrationNo={registrationNo}
                    setRegistrationNo={setRegistrationNo}
                    capacity={capacity}
                    setCapacity={setCapacity}
                    status={status}
                    setStatus={setStatus}
                    assignedDriver={assignedDriver}
                    setAssignedDriver={setAssignedDriver}
                />

                <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="text-xs rounded-[4px] cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        className="text-xs bg-[#FF4A1F] hover:bg-[#e03e15] text-white font-bold rounded-[4px] cursor-pointer shadow-xs"
                    >
                        {editingVehicle ? 'Save Changes' : 'Add Vehicle'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
