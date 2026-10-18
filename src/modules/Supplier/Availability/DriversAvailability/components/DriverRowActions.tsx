import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, ArrowUpRight, Truck, MapPin } from 'lucide-react';
import Button from '@/components/ui/button';
import { DriverItem } from '../types/driverAvailability.types';
import { DriverActionsDropdown } from './DriverActionsDropdown';

interface DriverRowActionsProps {
    row: DriverItem;
    onAssignVehicle: (driver: DriverItem) => void;
    onAssignServiceArea: (driver: DriverItem) => void;
    onStatusChange?: (driver: DriverItem, newStatus: 'Available' | 'On Job' | 'Unavailable') => void;
    onRemoveVehicle?: (driver: DriverItem) => void;
    onRemoveServiceArea?: (driver: DriverItem) => void;
}

export const DriverRowActions: React.FC<DriverRowActionsProps> = ({
    row,
    onAssignVehicle,
    onAssignServiceArea,
    onStatusChange,
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
            const menuWidth = 224;
            const menuHeight = 280;
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

    const hasVehicle = Boolean(row.assignedVehicle || row.vehicle?.plate);
    const hasArea = Boolean(
        row.assignedServiceArea ||
        row.service_area_id ||
        (Array.isArray(row.service_area_ids) && row.service_area_ids.length > 0) ||
        (Array.isArray(row.service_areas) && row.service_areas.length > 0)
    );

    return (
        <div className="relative flex items-center justify-end gap-1.5 w-full min-h-[26px]">
            {row.status === 'On Job' ? (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/supplier/orders');
                    }}
                    className="text-xs font-semibold text-[#f97316] hover:underline cursor-pointer flex items-center gap-0.5 shrink-0 mr-0.5"
                    title="View active driver orders"
                >
                    <span>Orders</span>
                    <ArrowUpRight size={12} />
                </button>
            ) : !hasVehicle ? (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAssignVehicle(row);
                    }}
                    className="h-6 px-2 text-[11px] font-semibold text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 rounded-[3px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    title="Quick assign vehicle"
                >
                    <Truck size={11} />
                    <span>Assign</span>
                </button>
            ) : !hasArea ? (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAssignServiceArea(row);
                    }}
                    className="h-6 px-2 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-[3px] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    title="Quick assign service area"
                >
                    <MapPin size={11} />
                    <span>Area</span>
                </button>
            ) : null}

            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="h-[26px] w-[26px] p-0 rounded-[3px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleToggle}
                title="Driver Actions"
            >
                <MoreVertical size={14} />
            </Button>

            <DriverActionsDropdown
                isOpen={isOpen}
                row={row}
                dropdownPos={dropdownPos}
                onClose={handleClose}
                onAssignVehicle={onAssignVehicle}
                onAssignServiceArea={onAssignServiceArea}
                onStatusChange={onStatusChange}
                onRemoveVehicle={onRemoveVehicle}
                onRemoveServiceArea={onRemoveServiceArea}
            />
        </div>
    );
};

export default DriverRowActions;
