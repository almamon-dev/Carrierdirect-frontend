import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    Truck,
    MapPin,
    Users,
    CheckCircle2,
    Clock,
    XCircle,
    Trash2,
    ArrowUpRight,
} from 'lucide-react';
import { DriverItem } from '../types/driverAvailability.types';

interface DriverActionsDropdownProps {
    isOpen: boolean;
    row: DriverItem;
    dropdownPos: { top: number; left: number };
    onClose: () => void;
    onAssignVehicle: (driver: DriverItem) => void;
    onAssignServiceArea: (driver: DriverItem) => void;
    onStatusChange?: (driver: DriverItem, newStatus: 'Available' | 'On Job' | 'Unavailable') => void;
    onRemoveVehicle?: (driver: DriverItem) => void;
    onRemoveServiceArea?: (driver: DriverItem) => void;
}

export const DriverActionsDropdown: React.FC<DriverActionsDropdownProps> = ({
    isOpen,
    row,
    dropdownPos,
    onClose,
    onAssignVehicle,
    onAssignServiceArea,
    onStatusChange,
    onRemoveVehicle,
    onRemoveServiceArea,
}) => {
    const navigate = useNavigate();

    if (!isOpen || typeof document === 'undefined') return null;

    const hasVehicle = Boolean(row.assignedVehicle || row.vehicle?.plate);
    const hasArea = Boolean(
        row.assignedServiceArea ||
        row.service_area_id ||
        (Array.isArray(row.service_area_ids) && row.service_area_ids.length > 0) ||
        (Array.isArray(row.service_areas) && row.service_areas.length > 0)
    );

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            />
            <div
                className="fixed w-56 bg-white dark:bg-[#1e2329] rounded-[6px] shadow-2xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Driver Management</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate text-xs mt-0.5">
                        {row.name || 'Driver'} {row.employee_id ? `(#${row.employee_id.replace(/^#/, '')})` : ''}
                    </p>
                </div>

                {/* Assign / Change Vehicle */}
                <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-orange-50/60 dark:hover:bg-orange-950/20 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={() => {
                        onClose();
                        onAssignVehicle(row);
                    }}
                >
                    <Truck size={14} className="text-[#ff4a1f] shrink-0" />
                    <span>{hasVehicle ? 'Change Assigned Vehicle' : 'Assign Vehicle'}</span>
                </button>

                {/* Assign / Change Service Area */}
                <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50/60 dark:hover:bg-blue-950/20 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                    onClick={() => {
                        onClose();
                        onAssignServiceArea(row);
                    }}
                >
                    <MapPin size={14} className="text-blue-500 shrink-0" />
                    <span>{hasArea ? 'Change Service Area(s)' : 'Assign Service Area'}</span>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                {/* Quick Status Toggles */}
                <div className="px-3 py-1">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Set Availability</p>
                </div>

                <button
                    type="button"
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        row.status === 'Available'
                            ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/50 dark:bg-emerald-950/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => {
                        onClose();
                        onStatusChange?.(row, 'Available');
                    }}
                >
                    <span className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                        <span>Available</span>
                    </span>
                    {row.status === 'Available' && <span className="text-[10px] uppercase font-bold text-emerald-600">Active</span>}
                </button>

                <button
                    type="button"
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        row.status === 'On Job'
                            ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => {
                        onClose();
                        onStatusChange?.(row, 'On Job');
                    }}
                >
                    <span className="flex items-center gap-2">
                        <Clock size={13} className="text-blue-500 shrink-0" />
                        <span>On Job</span>
                    </span>
                    {row.status === 'On Job' && <span className="text-[10px] uppercase font-bold text-blue-600">Active</span>}
                </button>

                <button
                    type="button"
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        row.status === 'Unavailable'
                            ? 'text-rose-600 dark:text-rose-400 font-bold bg-rose-50/50 dark:bg-rose-950/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => {
                        onClose();
                        onStatusChange?.(row, 'Unavailable');
                    }}
                >
                    <span className="flex items-center gap-2">
                        <XCircle size={13} className="text-rose-500 shrink-0" />
                        <span>Unavailable</span>
                    </span>
                    {row.status === 'Unavailable' && <span className="text-[10px] uppercase font-bold text-rose-600">Active</span>}
                </button>

                {(hasVehicle || hasArea) && (
                    <>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                        {hasVehicle && onRemoveVehicle && (
                            <button
                                type="button"
                                className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 transition-colors cursor-pointer"
                                onClick={() => {
                                    onClose();
                                    onRemoveVehicle(row);
                                }}
                            >
                                <Trash2 size={13} />
                                <span>Unassign Vehicle</span>
                            </button>
                        )}
                        {hasArea && onRemoveServiceArea && (
                            <button
                                type="button"
                                className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2 transition-colors cursor-pointer"
                                onClick={() => {
                                    onClose();
                                    onRemoveServiceArea(row);
                                }}
                            >
                                <Trash2 size={13} />
                                <span>Unassign Service Area</span>
                            </button>
                        )}
                    </>
                )}

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                {/* Links */}
                {/* Assign Driver to Job — when eligible */}
                {row.status === 'Available' && (
                    <button
                        type="button"
                        className="w-full text-left px-3 py-1.5 text-xs text-[#ff4a1f] hover:bg-orange-50/60 dark:hover:bg-orange-950/20 flex items-center gap-2 transition-colors cursor-pointer font-bold"
                        onClick={() => {
                            onClose();
                            navigate('/supplier/orders/active-jobs');
                        }}
                    >
                        <ArrowUpRight size={13} className="text-[#ff4a1f] shrink-0" />
                        <span>Assign Driver to Job</span>
                    </button>
                )}
                {row.status === 'On Job' && (
                    <button
                        type="button"
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                        onClick={() => {
                            onClose();
                            navigate('/supplier/orders');
                        }}
                    >
                        <ArrowUpRight size={13} className="text-amber-500 shrink-0" />
                        <span>View Assigned Jobs</span>
                    </button>
                )}

                <button
                    type="button"
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                    onClick={() => {
                        onClose();
                        navigate('/supplier/team-management');
                    }}
                >
                    <Users size={13} className="text-slate-400 shrink-0" />
                    <span>View Driver Profile</span>
                </button>
            </div>
        </>,
        document.body
    );
};

export default DriverActionsDropdown;
