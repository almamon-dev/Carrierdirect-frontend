import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MapPin, X, Loader2, Check, Trash2, ExternalLink, Globe2 } from 'lucide-react';
import Button from '@/components/ui/button';
import FormLabel from '@/components/ui/label';
import { useToastStore } from '@/stores/useToastStore';
import apiClient from '@/lib/axios';
import { DriverItem } from '../index';

interface AssignServiceAreaModalProps {
    isOpen: boolean;
    driver: DriverItem | null;
    onClose: () => void;
    onSuccess: (updatedDriver: DriverItem) => void;
}

export type ServiceAreaOption = {
    id: number;
    country: string;
    state?: string;
    city?: string;
    postal_code?: string;
    radius_km?: number;
    formatted: string;
    is_active: boolean;
};

export const AssignServiceAreaModal: React.FC<AssignServiceAreaModalProps> = ({
    isOpen,
    driver,
    onClose,
    onSuccess,
}) => {
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);
    const [serviceAreas, setServiceAreas] = useState<ServiceAreaOption[]>([]);
    const [selectedAreaId, setSelectedAreaId] = useState<string>('');
    const [isLoadingAreas, setIsLoadingAreas] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    // Fetch supplier's service areas
    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        async function fetchServiceAreas() {
            setIsLoadingAreas(true);
            try {
                const res = await apiClient.get('/supplier/service-areas');
                const rawList = res.data?.data || res.data || [];
                if (Array.isArray(rawList) && isMounted) {
                    const mapped: ServiceAreaOption[] = rawList.map((item: any) => {
                        const parts = [item.city, item.state, item.country].filter(Boolean);
                        let formatted = parts.length > 0 ? parts.join(', ') : `Whole Country (${item.country})`;
                        if (item.postal_code) {
                            formatted += ` (${item.postal_code})`;
                        }
                        return {
                            id: item.id,
                            country: item.country || 'Unknown',
                            state: item.state,
                            city: item.city,
                            postal_code: item.postal_code,
                            radius_km: item.radius_km,
                            formatted,
                            is_active: Boolean(item.is_active ?? true),
                        };
                    });
                    setServiceAreas(mapped);

                    // Set initial selection from driver
                    if (driver?.service_area_id) {
                        setSelectedAreaId(String(driver.service_area_id));
                    } else if (mapped.length > 0) {
                        setSelectedAreaId(String(mapped[0].id));
                    }
                }
            } catch (err) {
                console.error('Failed to load service areas:', err);
            } finally {
                if (isMounted) setIsLoadingAreas(false);
            }
        }

        fetchServiceAreas();
        return () => { isMounted = false; };
    }, [isOpen, driver]);

    if (!isOpen || !driver) return null;

    const hasAssignedArea = Boolean(driver.assignedServiceArea || driver.service_area_id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAreaId) {
            showToast('Please select a service area to assign.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiClient.post(`/supplier/availability/drivers/${driver.id}/assign-service-area`, {
                service_area_id: Number(selectedAreaId),
            });

            const isSuccess = res?.success ?? res?.data?.success ?? true;
            const updatedDriver = res?.data?.data || res?.data || res;
            if (isSuccess && updatedDriver) {
                showToast(`Service area assigned to ${driver.name} successfully!`, 'success');
                onSuccess(updatedDriver);
                onClose();
            } else {
                showToast(res?.message || res?.data?.message || 'Failed to assign service area.', 'error');
            }
        } catch (err: any) {
            console.error('Assign service area error:', err);
            showToast(err.response?.data?.message || 'Failed to assign service area.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemove = async () => {
        if (!window.confirm(`Are you sure you want to remove the assigned service area from ${driver.name}?`)) {
            return;
        }

        setIsRemoving(true);
        try {
            const res = await apiClient.delete(`/supplier/availability/drivers/${driver.id}/remove-service-area`);
            const isSuccess = res?.success ?? res?.data?.success ?? true;
            const updatedDriver = res?.data?.data || res?.data || res;
            if (isSuccess && updatedDriver) {
                showToast(`Service area removed from ${driver.name} successfully.`, 'success');
                onSuccess(updatedDriver);
                onClose();
            } else {
                showToast(res?.message || res?.data?.message || 'Failed to remove service area.', 'error');
            }
        } catch (err: any) {
            console.error('Remove service area error:', err);
            showToast(err.response?.data?.message || 'Failed to remove service area.', 'error');
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
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <MapPin size={17} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                Assign Service Area
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
                    {isLoadingAreas ? (
                        <div className="py-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                            <Loader2 size={18} className="animate-spin text-[#ff4a1f]" />
                            <span>Loading company service areas...</span>
                        </div>
                    ) : serviceAreas.length === 0 ? (
                        <div className="p-4 rounded-[4px] bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs space-y-2">
                            <p className="font-semibold text-amber-800 dark:text-amber-300">
                                No Service Areas Configured Yet
                            </p>
                            <p className="text-amber-700 dark:text-amber-400 text-[11px]">
                                You need to define coverage regions or routes first before assigning them to your drivers.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    navigate('/supplier/availability/routes');
                                }}
                                className="mt-1 text-xs font-bold text-[#ff4a1f] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <span>Manage Service Areas / Routes</span>
                                <ExternalLink size={12} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div>
                                <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Select Operating Service Area <span className="text-rose-500">*</span>
                                </FormLabel>
                                <select
                                    value={selectedAreaId}
                                    onChange={(e) => setSelectedAreaId(e.target.value)}
                                    disabled={isSubmitting || isRemoving}
                                    className="w-full h-9 px-2.5 mt-1 text-xs bg-slate-50 dark:bg-[#12161c] border border-slate-200 dark:border-slate-700 rounded-[4px] text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-[#ff4a1f]"
                                >
                                    <option value="" disabled>Choose a service area...</option>
                                    {serviceAreas.map((area) => (
                                        <option key={area.id} value={String(area.id)}>
                                            {area.formatted} {area.radius_km ? `(${area.radius_km} km radius)` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Service Area Quick Details */}
                            {selectedAreaId && (() => {
                                const selected = serviceAreas.find(a => String(a.id) === selectedAreaId);
                                if (!selected) return null;
                                return (
                                    <div className="p-3 rounded-[4px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
                                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                                            <Globe2 size={13} className="text-[#ff4a1f]" />
                                            <span>{selected.formatted}</span>
                                        </div>
                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 grid grid-cols-2 gap-1">
                                            <span>Country: <strong>{selected.country}</strong></span>
                                            {selected.city && <span>City: <strong>{selected.city}</strong></span>}
                                            {selected.postal_code && <span>Postal Code: <strong>{selected.postal_code}</strong></span>}
                                            {selected.radius_km && <span>Coverage Radius: <strong>{selected.radius_km} km</strong></span>}
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                <span>Need to add another area?</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        navigate('/supplier/availability/routes');
                                    }}
                                    className="text-[#ff4a1f] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                    <span>Routes Settings</span>
                                    <ExternalLink size={11} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-3.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                        {hasAssignedArea ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemove}
                                disabled={isSubmitting || isRemoving}
                                className="text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1.5 rounded-[4px] cursor-pointer"
                            >
                                {isRemoving ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                <span>Unassign Area</span>
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
                                disabled={isSubmitting || isRemoving || serviceAreas.length === 0}
                                className="text-xs bg-[#FF4A1F] hover:bg-[#e03e15] text-white font-bold rounded-[4px] gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={13} className="animate-spin" />
                                        <span>Assigning...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={14} />
                                        <span>Confirm Service Area</span>
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

export default AssignServiceAreaModal;
