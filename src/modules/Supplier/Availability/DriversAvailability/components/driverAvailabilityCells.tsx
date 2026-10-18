import React from 'react';
import { MapPin } from 'lucide-react';
import { DriverItem } from '../types/driverAvailability.types';

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
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'DR';

    return (
        <div className="flex items-center gap-2.5 min-w-0 min-h-[26px]">
            <div className="w-7 h-7 min-w-[28px] min-h-[28px] rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                {initials}
            </div>
            <span
                onClick={() => onNavigate?.('/supplier/team')}
                className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-xs truncate cursor-pointer transition-colors leading-none"
                title={displayName}
            >
                {displayName}
            </span>
        </div>
    );
};

export const DriverContactCell: React.FC<{ driver: DriverItem }> = ({ driver }) => {
    const phone = driver.phone && driver.phone !== '—' ? driver.phone : '+44 7123 456789';
    const email = driver.email && driver.email !== '—' ? driver.email : 'driver@example.com';

    return (
        <div className="flex flex-col min-w-0 min-h-[26px] justify-center leading-tight">
            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                {phone}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate" title={email}>
                {email}
            </span>
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
            <div className="flex items-center min-h-[26px]">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenServiceAreaModal(driver);
                    }}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#ff4a1f] text-slate-500 hover:text-[#ff4a1f] text-xs font-medium transition-colors cursor-pointer"
                >
                    <MapPin size={11} />
                    <span>+ Assign Area</span>
                </button>
            </div>
        );
    }

    const visibleAreas = areasList.slice(0, 3);
    const moreCount = Math.max(0, areasList.length - 3);
    const allAreasText = areasList.join(', ');

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                onOpenServiceAreaModal(driver);
            }}
            className="flex items-center gap-1.5 min-h-[26px] cursor-pointer group max-w-full"
            title={`Assigned: ${allAreasText} (Click to change)`}
        >
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-[#ff4a1f] transition-colors truncate">
                {visibleAreas.join(', ')}
            </span>
            {moreCount > 0 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 text-[10px] font-bold shrink-0">
                    +{moreCount} more
                </span>
            )}
        </div>
    );
};

export const DriverStatusBadgeCell: React.FC<{
    driver: DriverItem;
    onStatusChange?: (driver: DriverItem, newStatus: 'Available' | 'On Job' | 'Unavailable') => void;
}> = ({ driver, onStatusChange }) => {
    const s = String(driver.status || '').toLowerCase();
    const isActive = s === 'active' || s === 'available';
    const isOnLeave = s === 'on leave' || s === 'on_leave';

    const label = isActive ? 'Active' : isOnLeave ? 'On Leave' : (driver.status === 'Unavailable' ? 'On Leave' : driver.status);

    return (
        <div className="flex items-center justify-center min-h-[26px]">
            <button
                type="button"
                onClick={() => onStatusChange?.(driver, isActive ? 'Unavailable' : 'Available')}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-[11px] font-semibold border transition-colors cursor-pointer ${
                    isActive
                        ? 'bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 border-[#a7f3d0] dark:border-emerald-800/60'
                        : 'bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-400 border-[#fde68a] dark:border-amber-800/60'
                }`}
                title="Click to toggle status"
            >
                {label}
            </button>
        </div>
    );
};
