import Button from '@/components/ui/button';
import { Check, Loader2, Trash2, X } from 'lucide-react';
import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAssignServiceArea } from '../hooks/useAssignServiceArea';
import { DriverItem } from '../types/driverAvailability.types';
import { AssignServiceAreaFormFields } from './AssignServiceAreaFormFields';

interface AssignServiceAreaModalProps {
    isOpen: boolean;
    driver: DriverItem | null;
    onClose: () => void;
    onSuccess: (updatedDriver: DriverItem) => void;
}

export const AssignServiceAreaModal: React.FC<AssignServiceAreaModalProps> = ({
    isOpen,
    driver,
    onClose,
    onSuccess,
}) => {
    const navigate = useNavigate();
    const {
        serviceAreas,
        selectedAreaIds,
        setSelectedAreaIds,
        isLoadingAreas,
        isSubmitting,
        isRemoving,
        handleSubmit,
        handleRemove,
    } = useAssignServiceArea(driver, isOpen, onSuccess, onClose);

    if (!isOpen || !driver) return null;

    const hasAssignedArea = Boolean(
        (driver.service_area_ids && driver.service_area_ids.length > 0) ||
        driver.assignedServiceArea ||
        driver.service_area_id
    );

    return typeof document !== 'undefined' ? createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white dark:bg-[#18202a] w-full max-w-2xl rounded-[4px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden font-sans">
                {/* Header */}
                <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
                    <div className="flex items-center gap-2.5">

                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assign Service Areas</h3>

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
                    <AssignServiceAreaFormFields
                        isLoadingAreas={isLoadingAreas}
                        serviceAreas={serviceAreas}
                        selectedAreaIds={selectedAreaIds}
                        setSelectedAreaIds={setSelectedAreaIds}
                        disabled={isSubmitting || isRemoving}
                        onNavigateToRoutes={() => {
                            onClose();
                            navigate('/supplier/availability/routes');
                        }}
                    />

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
                                <span>Unassign All</span>
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
                                        <span>Confirm Service Area{selectedAreaIds.length > 1 ? `s (${selectedAreaIds.length})` : ''}</span>
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
