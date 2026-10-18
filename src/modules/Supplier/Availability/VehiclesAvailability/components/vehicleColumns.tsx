import React from 'react';
import { Truck } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { VehicleItem } from '../types/vehicleAvailability.types';

export function getVehicleColumns(
    onAssignDriver?: (vehicle: VehicleItem) => void
): Column<VehicleItem>[] {
    return [
        {
            id: 'index',
            label: '#',
            className: 'w-[50px] min-w-[50px] text-slate-400 font-mono text-xs',
            render: (row, index) => (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {(index !== undefined ? index + 1 : (row as any).id) || 1}
                </span>
            ),
            skeleton: () => (
                <div className="flex items-center min-h-[26px]">
                    <Skeleton className="h-3.5 w-4 rounded" />
                </div>
            ),
        },
        {
            id: 'name',
            label: 'Vehicle',
            sortable: true,
            className: 'w-[220px] min-w-[200px]',
            render: (row) => (
                <div className="flex items-center gap-2.5 min-h-[26px]">
                    <div className="w-9 h-7 rounded-[4px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                        <Truck size={16} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate">
                        {row.name}
                    </span>
                </div>
            ),
            skeleton: () => (
                <div className="flex items-center gap-2.5 min-h-[26px]">
                    <Skeleton className="w-9 h-7 rounded shrink-0" />
                    <Skeleton className="h-3.5 w-28 rounded" />
                </div>
            ),
        },
        {
            id: 'typeAndCapacity',
            label: 'Type & Capacity',
            sortable: true,
            className: 'w-[200px] min-w-[180px]',
            render: (row) => (
                <div className="flex flex-col min-h-[26px] justify-center leading-tight">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {row.type || 'Van (3.5t)'}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {row.capacity || '1,200 kg'}
                    </span>
                </div>
            ),
            skeleton: () => (
                <div className="flex flex-col gap-1 min-h-[26px] justify-center">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-2.5 w-16 rounded" />
                </div>
            ),
        },
        {
            id: 'registration',
            label: 'Registration',
            sortable: true,
            className: 'w-[160px] min-w-[140px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100 tracking-wider">
                        {row.registrationNo || row.registration_no}
                    </span>
                </div>
            ),
            skeleton: () => (
                <div className="flex items-center min-h-[26px]">
                    <Skeleton className="h-3.5 w-20 rounded" />
                </div>
            ),
        },
        {
            id: 'assignedDriver',
            label: 'Assigned Driver',
            sortable: true,
            className: 'w-[200px] min-w-[180px]',
            render: (row) => {
                const driverName = row.assignedDriver || row.assigned_driver;
                const hasDriver = Boolean(driverName && driverName !== 'Unassigned');

                if (!hasDriver) {
                    return (
                        <div className="flex items-center min-h-[26px]">
                            <button
                                type="button"
                                onClick={() => onAssignDriver?.(row)}
                                className="text-xs text-slate-400 hover:text-[#ff4a1f] italic cursor-pointer"
                            >
                                + Assign Driver
                            </button>
                        </div>
                    );
                }

                const initials = driverName
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase() || 'DR';

                return (
                    <div className="flex items-center gap-2 min-h-[26px]">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {initials}
                        </div>
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                            {driverName}
                        </span>
                    </div>
                );
            },
            skeleton: () => (
                <div className="flex items-center gap-2 min-h-[26px]">
                    <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                    <Skeleton className="h-3.5 w-24 rounded" />
                </div>
            ),
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            className: 'w-[130px] min-w-[120px] text-center',
            render: (row) => {
                const s = String(row.status || '').toLowerCase();
                const isActive = s === 'active' || s === 'available' || s === 'on job';
                const isMaintenance = s === 'maintenance';

                return (
                    <div className="flex justify-center min-h-[26px]">
                        <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-[11px] font-semibold border ${
                                isActive
                                    ? 'bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 border-[#a7f3d0] dark:border-emerald-800/60'
                                    : isMaintenance
                                    ? 'bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-400 border-[#fde68a] dark:border-amber-800/60'
                                    : 'bg-[#fef2f2] dark:bg-rose-950/40 text-[#dc2626] dark:text-rose-400 border-[#fecaca] dark:border-rose-800/60'
                            }`}
                        >
                            {row.status}
                        </span>
                    </div>
                );
            },
            skeleton: () => (
                <div className="flex items-center justify-center min-h-[26px]">
                    <Skeleton className="h-5 w-16 rounded-[4px] !bg-emerald-100/60 dark:!bg-emerald-950/40" />
                </div>
            ),
        },
    ];
}

export default getVehicleColumns;
