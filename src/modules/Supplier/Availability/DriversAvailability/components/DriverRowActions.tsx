import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    MoreVertical,
    Truck,
    MapPin,
    ArrowUpRight,
    Users,
    CheckCircle2,
    Clock,
    XCircle,
} from 'lucide-react';
import Button from '@/components/ui/button';
import { DriverItem } from '../index';

interface DriverRowActionsProps {
    row: DriverItem;
    onAssignVehicle: (driver: DriverItem) => void;
    onAssignServiceArea: (driver: DriverItem) => void;
    onStatusChange?: (driver: DriverItem, newStatus: 'Available' | 'On Job' | 'Unavailable') => void;
}

export const DriverRowActions: React.FC<DriverRowActionsProps> = ({
    row,
    onAssignVehicle,
    onAssignServiceArea,
    onStatusChange,
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
            const menuWidth = 210;
            const menuHeight = 240;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const left = Math.max(8, Math.min(rect.right - menuWidth, viewportWidth - menuWidth - 8));
            const spaceBelow = viewportHeight - rect.bottom;
            const top = spaceBelow < menuHeight && rect.top > menuHeight
                ? rect.top - menuHeight - 4
                : rect.bottom + 4;

            setDropdownPos({
                top: Math.max(8, top),
                left: Math.max(8, left)
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

    return (
        <div className="relative flex items-center justify-end gap-1.5 w-full min-h-[24px]">
            {row.status === 'On Job' && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/supplier/orders');
                    }}
                    className="text-xs font-semibold text-[#f97316] hover:underline cursor-pointer flex items-center gap-0.5 shrink-0 mr-1"
                >
                    <span>View Orders</span>
                    <ArrowUpRight size={12} />
                </button>
            )}

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

            {isOpen && typeof document !== 'undefined' && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                    />
                    <div
                        className="fixed w-52 bg-white dark:bg-[#1e2329] rounded-[6px] shadow-2xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Driver Assignment</p>
                            <p className="font-bold text-slate-800 dark:text-slate-200 truncate text-xs mt-0.5">
                                {row.name}
                            </p>
                        </div>

                        {/* Assign Vehicle */}
                        <button
                            type="button"
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-orange-50/60 dark:hover:bg-orange-950/20 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                onAssignVehicle(row);
                            }}
                        >
                            <Truck size={14} className="text-[#ff4a1f] shrink-0" />
                            <span>{row.vehicle?.plate ? 'Change Assigned Vehicle' : 'Assign Vehicle'}</span>
                        </button>

                        {/* Assign Service Area */}
                        <button
                            type="button"
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50/60 dark:hover:bg-blue-950/20 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                onAssignServiceArea(row);
                            }}
                        >
                            <MapPin size={14} className="text-blue-500 shrink-0" />
                            <span>{row.service_area_id ? 'Change Service Area' : 'Assign Service Area'}</span>
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        {/* Status Toggle Options */}
                        <div className="px-3 py-1">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase">Set Status</p>
                        </div>

                        <button
                            type="button"
                            className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                                row.status === 'Available'
                                    ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/50 dark:bg-emerald-950/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                            onClick={() => {
                                handleClose();
                                onStatusChange?.(row, 'Available');
                            }}
                        >
                            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                            <span>Available</span>
                        </button>

                        <button
                            type="button"
                            className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                                row.status === 'On Job'
                                    ? 'text-amber-600 dark:text-amber-400 font-bold bg-amber-50/50 dark:bg-amber-950/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                            onClick={() => {
                                handleClose();
                                onStatusChange?.(row, 'On Job');
                            }}
                        >
                            <Clock size={13} className="text-amber-500 shrink-0" />
                            <span>On Job</span>
                        </button>

                        <button
                            type="button"
                            className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                                row.status === 'Unavailable'
                                    ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50/50 dark:bg-rose-950/20'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                            onClick={() => {
                                handleClose();
                                onStatusChange?.(row, 'Unavailable');
                            }}
                        >
                            <XCircle size={13} className="text-rose-500 shrink-0" />
                            <span>Unavailable</span>
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        {/* Team Management Link */}
                        <button
                            type="button"
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigate('/supplier/team-management');
                            }}
                        >
                            <Users size={13} className="text-slate-400 shrink-0" />
                            <span>View in Team</span>
                        </button>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};

export default DriverRowActions;
