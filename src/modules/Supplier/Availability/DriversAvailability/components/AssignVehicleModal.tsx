import React from 'react';
import { Loader2, Check, Trash2 } from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import { DriverItem } from '../types/driverAvailability.types';
import { AssignVehicleFormFields } from './AssignVehicleFormFields';
import { useAssignVehicle } from '../hooks/useAssignVehicle';

interface AssignVehicleModalProps {
    isOpen: boolean;
    driver: DriverItem | null;
    onClose: () => void;
    onSuccess: (updatedDriver: DriverItem) => void;
}

export const AssignVehicleModal: React.FC<AssignVehicleModalProps> = ({
    isOpen,
    driver,
    onClose,
    onSuccess,
}) => {
    const {
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
    } = useAssignVehicle(driver, isOpen, onSuccess, onClose);

    if (!driver) return null;

    const hasAssignedVehicle = Boolean(driver.assignedVehicle || driver.vehicle?.plate);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            title="Assign Fleet Vehicle"
            description={`Assign a company vehicle to ${driver.name || 'Driver'}`}
            footer={
                <div className="flex items-center justify-between w-full">
                    {hasAssignedVehicle ? (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemove}
                            disabled={isSubmitting || isRemoving}
                            className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1.5 rounded-[4px] cursor-pointer"
                        >
                            {isRemoving ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                            <span>Unassign Vehicle</span>
                        </Button>
                    ) : <div />}

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            disabled={isSubmitting || isRemoving}
                            className="text-xs rounded-[4px] cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={(e) => handleSubmit(e as any)}
                            disabled={isSubmitting || isRemoving}
                            className="text-xs bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-semibold rounded-[4px] gap-1.5 cursor-pointer shadow-xs"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={13} className="animate-spin" />
                                    <span>Assigning...</span>
                                </>
                            ) : (
                                <>
                                    <Check size={14} />
                                    <span>Confirm Assignment</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="p-4 sm:p-5">
                <AssignVehicleFormFields
                    fleetVehicles={fleetVehicles}
                    isLoadingFleet={isLoadingFleet}
                    vehicleName={vehicleName}
                    setVehicleName={setVehicleName}
                    vehicleType={vehicleType}
                    setVehicleType={setVehicleType}
                    isCustomType={isCustomType}
                    setIsCustomType={setIsCustomType}
                    customType={customType}
                    setCustomType={setCustomType}
                    vehiclePlate={vehiclePlate}
                    setVehiclePlate={setVehiclePlate}
                    capacity={capacity}
                    setCapacity={setCapacity}
                    disabled={isSubmitting || isRemoving}
                    onSelectVehicle={applyVehicle}
                />
            </form>
        </Modal>
    );
};

export default AssignVehicleModal;
