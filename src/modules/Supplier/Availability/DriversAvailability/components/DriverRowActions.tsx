import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Truck, Eye } from 'lucide-react';
import { DriverItem } from '../types/driverAvailability.types';
import { DriverActionsDropdown } from './DriverActionsDropdown';

interface DriverRowActionsProps {
    row: DriverItem;
    onAssignVehicle: (driver: DriverItem) => void;
    onAssignServiceArea: (driver: DriverItem) => void;
    onDutyStatusChange?: (driver: DriverItem, newDutyStatus: 'online' | 'offline' | 'break') => void;
    onAccountStatusChange?: (driver: DriverItem, newAccountStatus: 'active' | 'disabled' | 'blocked') => void;
    onViewHistory?: (driver: DriverItem) => void;
    onViewActiveJob?: (driver: DriverItem) => void;
    onStatusChange?: (driver: DriverItem, newStatus: 'Available' | 'On Job' | 'Unavailable') => void;
    onRemoveVehicle?: (driver: DriverItem) => void;
    onRemoveServiceArea?: (driver: DriverItem) => void;
}

export const DriverRowActions: React.FC<DriverRowActionsProps> = ({
    row,
    onAssignVehicle,
    onAssignServiceArea,
    onDutyStatusChange,
    onAccountStatusChange,
    onViewHistory,
    onViewActiveJob,
    onRemoveVehicle,
    onRemoveServiceArea,
}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleClose = useCallback(() => setIsOpen(false), []);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const menuWidth = 230;
            const menuHeight = 310;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const left = Math.max(8, Math.min(rect.right - menuWidth, viewportWidth - menuWidth - 8));
            const spaceBelow = viewportHeight - rect.bottom;
            const top = spaceBelow < menuHeight && rect.top > menuHeight
                ? rect.top - menuHeight - 4
                : rect.bottom + 4;

            setDropdownPos({
                top: Math.max(8, top),
                left: Math.max(8, left),
            });
            setIsOpen(true);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        const handleScroll = () => handleClose();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen, handleClose]);

    const isOnJob = row.job_status === 'on_job' || Boolean(row.active_assignment?.order_id) || row.status === 'On Job';
    const isAvailable = !isOnJob && (row.status === 'Available' || row.job_status === 'available');

    return (
        <div className="relative flex items-center justify-end gap-1.5 w-full min-h-[28px]">
            {isOnJob ? (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onViewActiveJob) {
                            onViewActiveJob(row);
                        } else {
                            const orderId = row.active_assignment?.order_id || row.active_assignment?.order_number?.replace(/\D/g, '') || '';
                            navigate(orderId ? `/supplier/orders/details/${orderId}` : '/supplier/orders/active-jobs');
                        }
                    }}
                    className="h-7 px-2.5 rounded-[4px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1f26] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                    title="View active shipment dispatch"
                >
                    <Eye size={13} className="text-slate-500 dark:text-slate-400" />
                    <span>View</span>
                </button>
            ) : (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/supplier/orders');
                    }}
                    className="h-7 px-2.5 rounded-[4px] border border-orange-200 dark:border-orange-800/60 bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-[#ff4a1f] font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                    title="Assign to shipment"
                >
                    <Truck size={13} className="text-[#ff4a1f]" />
                    <span>Assign</span>
                </button>
            )}

            <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
                className={`h-7 w-7 rounded-[4px] border transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                    isOpen
                        ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1f26] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="More Actions"
            >
                <MoreVertical size={14} />
            </button>

            <DriverActionsDropdown
                isOpen={isOpen}
                row={row}
                dropdownPos={dropdownPos}
                onClose={handleClose}
                onAssignVehicle={onAssignVehicle}
                onAssignServiceArea={onAssignServiceArea}
                onDutyStatusChange={onDutyStatusChange}
                onAccountStatusChange={onAccountStatusChange}
                onViewHistory={onViewHistory}
                onRemoveVehicle={onRemoveVehicle}
                onRemoveServiceArea={onRemoveServiceArea}
            />
        </div>
    );
};

export default DriverRowActions;
