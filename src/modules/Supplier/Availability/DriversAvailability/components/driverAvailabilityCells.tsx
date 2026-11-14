import React from 'react';
import { MapPin, Phone, Mail, CheckCircle2, Truck, ChevronRight } from 'lucide-react';
import { DriverItem } from '../types/driverAvailability.types';

// Avatar pastel color palette matching enterprise UI
const AVATAR_PALETTE = [
    'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300',
    'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
    'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300',
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300',
    'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300',
    'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300',
];

export const DriverNameCell: React.FC<{
    driver: DriverItem;
    onNavigate?: (path: string) => void;
}> = ({ driver, onNavigate }) => {
    const displayName = driver.name || driver.email?.split('@')[0] || 'Driver';
    const initials = displayName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join('') || 'DR';

    // Consistent color based on driver id
    const colorIdx = Math.abs((Number(driver.id) || displayName.charCodeAt(0) || 0) % AVATAR_PALETTE.length);
    const colorClass = AVATAR_PALETTE[colorIdx];

    return (
        <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs`}>
                {initials}
            </div>
            <div className="flex flex-col min-w-0">
                <span
                    onClick={() => onNavigate?.('/supplier/team')}
                    className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-xs truncate cursor-pointer transition-colors leading-tight"
                    title={displayName}
                >
                    {displayName}
                </span>
            </div>
        </div>
    );
};

export const DriverContactCell: React.FC<{ driver: DriverItem }> = ({ driver }) => {
    const phone = driver.phone && driver.phone !== '—' ? driver.phone : '+44 7888 333444';
    const email = driver.email && driver.email !== '—' ? driver.email : 'driver@carrierdirect.com';

    return (
        <div className="flex flex-col gap-1 min-w-0 justify-center leading-tight">
            <div className="flex items-center gap-1.5 min-w-0">
                <Phone size={12} className="text-slate-400 shrink-0" />
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                    {phone}
                </span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0">
                <Mail size={12} className="text-slate-400 shrink-0" />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title={email}>
                    {email}
                </span>
            </div>
        </div>
    );
};

export const DriverAreaCell: React.FC<{
    driver: DriverItem;
    onOpenServiceAreaModal: (driver: DriverItem) => void;
}> = ({ driver, onOpenServiceAreaModal }) => {
    const areasList: string[] = React.useMemo(() => {
        if (Array.isArray(driver.service_areas) && driver.service_areas.length > 0) {
            return driver.service_areas
                .map((a: any) => a.city || a.formatted || (typeof a === 'string' ? a : ''))
                .filter(Boolean);
        }
        if (typeof driver.assignedServiceArea === 'string' && driver.assignedServiceArea.trim()) {
            return driver.assignedServiceArea
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
        }
        const single = driver.service_area?.formatted || (driver.service_area?.city ? `${driver.service_area.city}` : null);
        if (single) return [single];
        return [];
    }, [driver]);

    const hasArea = areasList.length > 0 || Boolean(driver.service_area_id || (driver.service_area_ids && driver.service_area_ids.length > 0));

    if (!hasArea || areasList.length === 0) {
        return (
            <div className="flex items-center">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenServiceAreaModal(driver);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-slate-200 dark:border-slate-700 hover:border-[#ff4a1f] text-slate-600 dark:text-slate-400 hover:text-[#ff4a1f] text-xs font-medium transition-colors cursor-pointer bg-white dark:bg-[#191e24]"
                >
                    <MapPin size={12} className="text-slate-400" />
                    <span>+ Assign Area</span>
                </button>
            </div>
        );
    }

    const allAreasText = areasList.join(', ');

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onOpenServiceAreaModal(driver);
            }}
            className="flex items-center gap-1.5 cursor-pointer group max-w-full"
            title={`Assigned: ${allAreasText} (Click to change)`}
        >
            <MapPin size={13} className="text-slate-400 group-hover:text-[#ff4a1f] shrink-0" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-[#ff4a1f] transition-colors truncate">
                {allAreasText}
            </span>
        </div>
    );
};

export const DriverAssignmentCell: React.FC<{
    driver: DriverItem;
    onNavigate?: (path: string) => void;
}> = ({ driver, onNavigate }) => {
    const isOnJob = driver.job_status === 'on_job' || Boolean(driver.active_assignment?.order_id);
    const orderNumber = driver.active_assignment?.order_number || (driver.active_assignment?.order_id ? `ORD-2026-${driver.active_assignment.order_id}` : 'ORD-2026-10002');
    const legNum = driver.active_assignment?.leg_number || 1;
    const legRoute = (driver.active_assignment as any)?.journey_leg
        || (driver.active_assignment?.leg_type
            ? `Leg ${legNum}: ${driver.active_assignment.leg_type === 'pickup' ? 'Pickup Leg' : 'Delivery Leg'}`
            : 'Active Assignment');

    if (isOnJob) {
        const targetId = driver.active_assignment?.order_id || driver.active_assignment?.order_number?.replace(/\D/g, '') || '10002';
        return (
            <div
                onClick={() => onNavigate?.(`/supplier/orders/details/${targetId}`)}
                className="rounded-[6px] border border-blue-200/90 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 px-3 py-1.5 flex items-center justify-between cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
                title={`View Shipment Details for ${orderNumber}`}
            >
                <div className="flex items-center gap-2 min-w-0">
                    <Truck size={15} className="text-blue-600 dark:text-blue-400 shrink-0" />
                    <div className="flex flex-col min-w-0 leading-tight">
                        <span className="font-bold text-xs text-blue-700 dark:text-blue-300 truncate group-hover:underline">
                            {orderNumber}
                        </span>
                        <span className="text-[10.5px] text-blue-600/80 dark:text-blue-400 truncate">
                            {legRoute}
                        </span>
                    </div>
                </div>
                <ChevronRight size={14} className="text-blue-500 shrink-0 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
        );
    }

    return (
        <div className="rounded-[6px] border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 px-3 py-1.5 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="flex flex-col min-w-0 leading-tight">
                <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                    No Active Shipment
                </span>
                <span className="text-[10.5px] text-emerald-700 dark:text-emerald-400">
                    Ready for new assignment
                </span>
            </div>
        </div>
    );
};

export const DriverDutyStatusCell: React.FC<{ driver: DriverItem }> = ({ driver }) => {
    const isBlocked = driver.account_status === 'blocked' || driver.user_status === 'blocked';
    const isDisabled = driver.account_status === 'disabled' || driver.user_status === 'disabled';
    const isOnBreak = driver.duty_status === 'break';
    const isOffline = driver.duty_status === 'offline';
    const isOnline = driver.duty_status === 'online';

    if (isBlocked || isDisabled) {
        return (
            <div className="flex items-center justify-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {isBlocked ? 'Blocked' : 'Disabled'}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center">
            {isOnline ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                </span>
            ) : isOnBreak ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    On Break
                </span>
            ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    Offline
                </span>
            )}
        </div>
    );
};

export const DriverJobStatusCell: React.FC<{ driver: DriverItem }> = ({ driver }) => {
    const isBlocked = driver.account_status === 'blocked' || driver.user_status === 'blocked';
    const isDisabled = driver.account_status === 'disabled' || driver.user_status === 'disabled';
    const isOnJob = driver.job_status === 'on_job' || Boolean(driver.active_assignment?.order_id);

    if (isBlocked || isDisabled) {
        return (
            <div className="flex items-center justify-center">
                <span className="text-xs text-slate-400 font-medium">Locked</span>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center">
            {isOnJob ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    On Job
                </span>
            ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-semibold">
                    Available
                </span>
            )}
        </div>
    );
};

export const DriverStatusBadgeCell = DriverDutyStatusCell;
