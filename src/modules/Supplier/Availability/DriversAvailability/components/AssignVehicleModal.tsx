import React from 'react';
import { createPortal } from 'react-dom';
import { Truck, X, Loader2, Check, Trash2 } from 'lucide-react';
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

    if (!isOpen || !driver) return null;

    const hasAssignedVehicle = Boolean(driver.assignedVehicle || driver.vehicle?.plate);

    return typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-[#18202a] w-full max-w-md rounded-[6px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden font-sans">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[#ff4a1f]">
                            <Truck size={17} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assign Vehicle</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Driver: <strong className="text-slate-800 dark:text-slate-200">{driver.name || 'Driver'}</strong>
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting || isRemoving}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[3px] cursor-pointer disabled:opacity-50"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
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

                    {/* Footer Actions */}
                    <div className="pt-3.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
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
                                type="submit"
                                size="sm"
                                disabled={isSubmitting || isRemoving}
                                className="text-xs bg-[#FF4A1F] hover:bg-[#e03e15] text-white font-bold rounded-[4px] gap-1.5 cursor-pointer shadow-xs"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={13} className="animate-spin" />
                                        <span>Assigning...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={14} />
                                        <span>Confirm Vehicle</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    ) : null;
};

export default AssignVehicleModal;
