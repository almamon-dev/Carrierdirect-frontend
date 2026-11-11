import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    Truck,
    MapPin,
    History,
    ShieldAlert,
    ShieldCheck,
    Coffee,
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    Power,
    Check,
} from 'lucide-react';
import { DriverItem } from '../types/driverAvailability.types';

interface DriverActionsDropdownProps {
    isOpen: boolean;
    row: DriverItem;
    dropdownPos: { top: number; left: number };
    onClose: () => void;
    onAssignVehicle: (driver: DriverItem) => void;
    onAssignServiceArea: (driver: DriverItem) => void;
    onDutyStatusChange?: (driver: DriverItem, newDutyStatus: 'online' | 'offline' | 'break') => void;
    onAccountStatusChange?: (driver: DriverItem, newAccountStatus: 'active' | 'disabled' | 'blocked') => void;
    onViewHistory?: (driver: DriverItem) => void;
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
    onDutyStatusChange,
    onAccountStatusChange,
    onViewHistory,
}) => {
    const navigate = useNavigate();
    const [showDutySubmenu, setShowDutySubmenu] = useState(false);

    if (!isOpen || typeof document === 'undefined') return null;

    const isOnJob = row.job_status === 'on_job' || Boolean(row.active_assignment?.order_id) || row.status === 'On Job';
    const dutyStatus = String(row.duty_status || 'online').toLowerCase();
    const accountStatus = String(row.account_status || row.user_status || 'active').toLowerCase();
    const isAccountActive = accountStatus === 'active';
    const isAccountBlocked = accountStatus === 'blocked';
    const isAccountDisabled = accountStatus === 'disabled';

    const empId = row.employee_id || (row.id ? `EMP-${String(row.id).padStart(4, '0')}` : null);
    const headerTitle = `${row.name || 'Driver'}${empId ? ` (${empId})` : ''}`;

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
                className="fixed w-[230px] bg-white dark:bg-[#1a1f26] rounded-[8px] shadow-2xl border border-slate-200/90 dark:border-slate-800 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans text-xs"
                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header: Driver Name (EMP-XXXX) */}
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate text-xs leading-tight">
                        {headerTitle}
                    </p>
                </div>

                <div className="py-1">
                    {/* 1. Assign to Shipment */}
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            if (isOnJob) {
                                const orderId = row.active_assignment?.order_id || row.active_assignment?.order_number?.replace(/\D/g, '') || '';
                                navigate(orderId ? `/supplier/orders/details/${orderId}` : '/supplier/orders/active-jobs');
                            } else {
                                navigate('/supplier/orders/assign-driver');
                            }
                        }}
                        className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 bg-orange-50/70 dark:bg-orange-950/30 text-[#ff4a1f] font-medium hover:bg-orange-100/70 dark:hover:bg-orange-900/40 transition-colors cursor-pointer"
                    >
                        <Truck size={14} className="text-[#ff4a1f] shrink-0" />
                        <span>{isOnJob ? 'View Active Shipment' : 'Assign to Shipment'}</span>
                    </button>

                    {/* 2. Change Duty Status */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowDutySubmenu(!showDutySubmenu)}
                            className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between transition-colors cursor-pointer"
                        >
                            <span className="flex items-center gap-2.5">
                                <Coffee size={14} className="text-slate-500 shrink-0" />
                                <span>Change Duty Status</span>
                            </span>
                            {showDutySubmenu ? (
                                <ChevronDown size={14} className="text-slate-400 shrink-0" />
                            ) : (
                                <ChevronRight size={14} className="text-slate-400 shrink-0" />
                            )}
                        </button>

                        {/* Duty Status Inline Submenu */}
                        {showDutySubmenu && (
                            <div className="bg-slate-50/80 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/80 py-1 pl-6 pr-3 space-y-0.5">
                                {/* Online */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        onDutyStatusChange?.(row, 'online');
                                    }}
                                    className={`w-full text-left py-1 px-2 rounded text-[11px] flex items-center justify-between cursor-pointer ${
                                        dutyStatus === 'online'
                                            ? 'text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100/60 dark:bg-emerald-950/40'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                        <span>Online</span>
                                    </span>
                                    {dutyStatus === 'online' && <Check size={12} className="text-emerald-600" />}
                                </button>

                                {/* On Break */}
                                <button
                                    type="button"
                                    disabled={isOnJob}
                                    onClick={() => {
                                        if (isOnJob) return;
                                        onClose();
                                        onDutyStatusChange?.(row, 'break');
                                    }}
                                    title={isOnJob ? 'Cannot set On Break while driver is on an active assignment' : ''}
                                    className={`w-full text-left py-1 px-2 rounded text-[11px] flex items-center justify-between ${
                                        isOnJob
                                            ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                                            : dutyStatus === 'break'
                                            ? 'text-amber-700 dark:text-amber-400 font-bold bg-amber-100/60 dark:bg-amber-950/40 cursor-pointer'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Coffee size={12} className="text-amber-500" />
                                        <span>On Break</span>
                                    </span>
                                    {dutyStatus === 'break' && <Check size={12} className="text-amber-600" />}
                                    {isOnJob && <span className="text-[9px] text-slate-400 italic">On Job</span>}
                                </button>

                                {/* Offline */}
                                <button
                                    type="button"
                                    disabled={isOnJob}
                                    onClick={() => {
                                        if (isOnJob) return;
                                        onClose();
                                        onDutyStatusChange?.(row, 'offline');
                                    }}
                                    title={isOnJob ? 'Cannot set Offline while driver is on an active assignment' : ''}
                                    className={`w-full text-left py-1 px-2 rounded text-[11px] flex items-center justify-between ${
                                        isOnJob
                                            ? 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                                            : dutyStatus === 'offline'
                                            ? 'text-slate-800 dark:text-slate-200 font-bold bg-slate-200/60 dark:bg-slate-800 cursor-pointer'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                                    }`}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Power size={12} className="text-slate-400" />
                                        <span>Offline</span>
                                    </span>
                                    {dutyStatus === 'offline' && <Check size={12} className="text-slate-600" />}
                                    {isOnJob && <span className="text-[9px] text-slate-400 italic">On Job</span>}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 3. View Availability History */}
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onViewHistory?.(row);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                        <History size={14} className="text-slate-500 shrink-0" />
                        <span>View Availability History</span>
                    </button>

                    {/* 4. Change Vehicle */}
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onAssignVehicle(row);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                        <Truck size={14} className="text-slate-500 shrink-0" />
                        <span>Change Vehicle</span>
                    </button>

                    {/* 5. Manage Service Area(s) */}
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onAssignServiceArea(row);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                        <MapPin size={14} className="text-slate-500 shrink-0" />
                        <span>Manage Service Area(s)</span>
                    </button>

                    {/* 6. Disable Driver */}
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onAccountStatusChange?.(row, isAccountDisabled ? 'active' : 'disabled');
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                        {isAccountDisabled ? (
                            <>
                                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                                <span>Enable Driver</span>
                            </>
                        ) : (
                            <>
                                <ShieldAlert size={14} className="text-slate-500 shrink-0" />
                                <span>Disable Driver</span>
                            </>
                        )}
                    </button>

                    {/* 7. Block Driver */}
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onAccountStatusChange?.(row, isAccountBlocked ? 'active' : 'blocked');
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50/60 dark:hover:bg-rose-950/20 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                        <ShieldAlert size={14} className="text-rose-500 shrink-0" />
                        <span>{isAccountBlocked ? 'Unblock Driver' : 'Block Driver'}</span>
                    </button>
                </div>
            </div>
        </>,
        document.body
    );
};

export default DriverActionsDropdown;
