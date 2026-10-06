import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Truck, X, Loader2, Check, Trash2, Sparkles } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import FormLabel from '@/components/ui/label';
import { useToastStore } from '@/stores/useToastStore';
import apiClient from '@/lib/axios';
import { DriverItem } from '../index';

interface AssignVehicleModalProps {
    isOpen: boolean;
    driver: DriverItem | null;
    onClose: () => void;
    onSuccess: (updatedDriver: DriverItem) => void;
}

const VEHICLE_TYPES = [
    'Van',
    'Box Truck',
    'Semi Trailer',
    'Flatbed Truck',
    'Pickup Truck',
    'Cargo Van',
    'Covered Van (20ft)',
    'Refrigerated Truck',
];

const PRESET_VEHICLES = [
    { name: 'Mercedes Sprinter', type: 'Van', plate: 'UK-AB12CD', capacity: '1,200 kg' },
    { name: 'Volvo FH16', type: 'Semi Trailer', plate: 'FR-XY342T', capacity: '24,000 kg' },
    { name: 'Renault Master', type: 'Van', plate: 'DE-RT56YU', capacity: '1,500 kg' },
    { name: 'Scania R450', type: 'Semi Trailer', plate: 'BE-KL78MN', capacity: '20,000 kg' },
    { name: 'MAN TGX', type: 'Flatbed Truck', plate: 'DE-KL456M', capacity: '18,000 kg' },
    { name: 'Iveco Daily', type: 'Box Truck', plate: 'NL-PQ90RS', capacity: '3,500 kg' },
];

export const AssignVehicleModal: React.FC<AssignVehicleModalProps> = ({
    isOpen,
    driver,
    onClose,
    onSuccess,
}) => {
    const showToast = useToastStore((state) => state.showToast);
    const [vehicleName, setVehicleName] = useState('');
    const [vehicleType, setVehicleType] = useState('Van');
    const [isCustomType, setIsCustomType] = useState(false);
    const [customType, setCustomType] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [capacity, setCapacity] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

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

    if (!isOpen || !driver) return null;

    const hasAssignedVehicle = Boolean(driver.assignedVehicle || driver.vehicle?.plate);

    const applyPreset = (preset: typeof PRESET_VEHICLES[0]) => {
        setVehicleName(preset.name);
        setVehicleType(preset.type);
        setIsCustomType(false);
        setCustomType('');
        setVehiclePlate(preset.plate);
        setCapacity(preset.capacity);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                showToast(`Vehicle assigned to ${driver.name} successfully!`, 'success');
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
        if (!window.confirm(`Are you sure you want to remove the assigned vehicle from ${driver.name}?`)) {
            return;
        }

        setIsRemoving(true);
        try {
            const res = await apiClient.delete(`/supplier/availability/drivers/${driver.id}/remove-vehicle`);
            const isSuccess = res?.success ?? res?.data?.success ?? true;
            const updatedDriver = res?.data?.data || res?.data || res;
            if (isSuccess && updatedDriver) {
                showToast(`Vehicle removed from ${driver.name} successfully.`, 'success');
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
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Assign Vehicle
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Driver: <strong className="text-slate-800 dark:text-slate-200">{driver.name}</strong>
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
                    {/* Presets Quick Picker */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                <Sparkles size={12} className="text-amber-500" />
                                Quick Select Fleet Preset:
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {PRESET_VEHICLES.map((p) => {
                                const isCurrent = vehiclePlate === p.plate;
                                return (
                                    <button
                                        key={p.plate}
                                        type="button"
                                        onClick={() => applyPreset(p)}
                                        className={`text-[11px] px-2 py-1 rounded-[4px] border transition-all cursor-pointer ${
                                            isCurrent
                                                ? 'bg-orange-50 dark:bg-orange-950/30 border-[#ff4a1f] text-[#ff4a1f] font-bold'
                                                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                                        }`}
                                    >
                                        {p.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Vehicle Model / Name <span className="text-rose-500">*</span>
                            </FormLabel>
                            <Input
                                type="text"
                                required
                                placeholder="e.g. Mercedes Sprinter, Volvo FH16"
                                value={vehicleName}
                                onChange={(e) => setVehicleName(e.target.value)}
                                className="text-xs h-9 mt-1 rounded-[4px]"
                                disabled={isSubmitting || isRemoving}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <div className="flex items-center justify-between">
                                    <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Vehicle Type <span className="text-rose-500">*</span>
                                    </FormLabel>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isCustomType) {
                                                setIsCustomType(false);
                                                setVehicleType(VEHICLE_TYPES[0]);
                                            } else {
                                                setIsCustomType(true);
                                                setCustomType(vehicleType && !VEHICLE_TYPES.includes(vehicleType) ? vehicleType : '');
                                            }
                                        }}
                                        className="text-[10.5px] text-[#ff4a1f] hover:underline font-semibold cursor-pointer"
                                    >
                                        {isCustomType ? 'From list' : '+ Custom'}
                                    </button>
                                </div>
                                <div className="mt-1">
                                    {isCustomType ? (
                                        <Input
                                            type="text"
                                            required
                                            placeholder="e.g. Tipper, Tanker"
                                            value={customType}
                                            onChange={(e) => {
                                                setCustomType(e.target.value);
                                                setVehicleType(e.target.value);
                                            }}
                                            className="text-xs h-9 rounded-[4px]"
                                            disabled={isSubmitting || isRemoving}
                                            autoFocus
                                        />
                                    ) : (
                                        <Select
                                            value={vehicleType}
                                            onChange={(val: any) => {
                                                const v = val?.target?.value !== undefined ? val.target.value : val;
                                                if (v === '__custom__') {
                                                    setIsCustomType(true);
                                                    setCustomType('');
                                                } else {
                                                    setVehicleType(v);
                                                }
                                            }}
                                            disabled={isSubmitting || isRemoving}
                                            options={[
                                                ...VEHICLE_TYPES.map((t) => ({ id: t, name: t })),
                                                { id: '__custom__', name: '+ Custom / Other...' },
                                            ]}
                                            placeholder="Select vehicle type..."
                                        />
                                    )}
                                </div>
                            </div>

                            <div>
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Registration / Plate <span className="text-rose-500">*</span>
                                </FormLabel>
                                <Input
                                    type="text"
                                    required
                                    placeholder="e.g. UK-AB12CD"
                                    value={vehiclePlate}
                                    onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                                    className="text-xs h-9 mt-1 rounded-[4px] font-mono uppercase tracking-wider"
                                    disabled={isSubmitting || isRemoving}
                                />
                            </div>
                        </div>

                        <div>
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Payload Capacity
                            </FormLabel>
                            <Input
                                type="text"
                                placeholder="e.g. 1,200 kg or 24,000 kg"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                className="text-xs h-9 mt-1 rounded-[4px]"
                                disabled={isSubmitting || isRemoving}
                            />
                        </div>
                    </div>

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
