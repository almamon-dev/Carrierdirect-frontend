import React from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
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

    if (!driver) return null;

    const hasAssignedArea = Boolean(
        (driver.service_area_ids && driver.service_area_ids.length > 0) ||
        driver.assignedServiceArea ||
        driver.service_area_id
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            title="Assign Service Areas"
            description={`Configure operating coverage areas for ${driver.name || 'Driver'}`}
            footer={
                <div className="flex items-center justify-between w-full">
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
                            type="button"
                            size="sm"
                            onClick={(e) => handleSubmit(e as any)}
                            disabled={isSubmitting || isRemoving}
                            className="text-xs bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-semibold rounded-[4px] gap-1.5 cursor-pointer shadow-xs"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={13} className="animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>Save Changes</span>
                            )}
                        </Button>
                    </div>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="p-4 sm:p-5">
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
            </form>
        </Modal>
    );
};

export default AssignServiceAreaModal;
