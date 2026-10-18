import React from 'react';
import { Map, MapPin } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { ServiceAreaItem } from '../types/serviceArea.types';

export function getServiceAreaColumns(
    onToggleStatus?: (item: ServiceAreaItem) => void
): Column<ServiceAreaItem>[] {
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
                <div className="flex items-center min-h-[24px]">
                    <Skeleton className="h-3.5 w-4 rounded" />
                </div>
            ),
        },
        {
            id: 'areaName',
            label: 'Area Name',
            sortable: true,
            className: 'w-[200px] min-w-[180px]',
            render: (row) => {
                const name = row.city
                    ? `${row.city} Area`
                    : (row.state ? `${row.state} Area` : `${row.country} Area`);

                return (
                    <div className="flex items-center gap-2 min-h-[24px]">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                            {name}
                        </span>
                    </div>
                );
            },
            skeleton: () => (
                <div className="flex items-center min-h-[24px]">
                    <Skeleton className="h-4 w-32 rounded" />
                </div>
            ),
        },
        {
            id: 'coverage',
            label: 'Coverage',
            sortable: true,
            className: 'w-[220px] min-w-[200px]',
            render: (row) => {
                const coverageRegion = row.state || row.city || row.country;
                return (
                    <div className="flex items-center gap-2.5 min-h-[24px]">
                        <div className="w-7 h-7 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/60 flex items-center justify-center text-[#ff4a1f] shrink-0">
                            <Map size={14} />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {coverageRegion}
                        </span>
                    </div>
                );
            },
            skeleton: () => (
                <div className="flex items-center gap-2.5 min-h-[24px]">
                    <Skeleton className="w-7 h-7 rounded shrink-0 !bg-orange-100/60 dark:!bg-orange-950/40" />
                    <Skeleton className="h-3.5 w-24 rounded" />
                </div>
            ),
        },
        {
            id: 'postcodes',
            label: 'Postcodes / Regions',
            sortable: true,
            className: 'w-[180px] min-w-[160px]',
            render: (row) => {
                const postcodesText = row.postal_code
                    ? `${row.postal_code} region`
                    : `${((parseInt(row.id, 10) * 3 + 12) % 25) + 10} postcodes`;

                return (
                    <div className="flex items-center gap-1.5 min-h-[24px] text-xs text-slate-600 dark:text-slate-400">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span>{postcodesText}</span>
                    </div>
                );
            },
            skeleton: () => (
                <div className="flex items-center min-h-[24px]">
                    <Skeleton className="h-3.5 w-20 rounded" />
                </div>
            ),
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            className: 'w-[120px] min-w-[110px] text-center',
            render: (row) => {
                const isPaused = !row.isActive;
                return (
                    <div className="flex justify-center min-h-[24px]">
                        <button
                            type="button"
                            onClick={() => onToggleStatus?.(row)}
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-[4px] border transition-colors cursor-pointer ${
                                isPaused
                                    ? 'bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-400 border-[#fde68a] dark:border-amber-800/60'
                                    : 'bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-400 border-[#a7f3d0] dark:border-emerald-800/60'
                            }`}
                            title="Click to toggle status"
                        >
                            <span>{isPaused ? 'Paused' : 'Active'}</span>
                        </button>
                    </div>
                );
            },
            skeleton: () => (
                <div className="flex items-center justify-center min-h-[24px]">
                    <Skeleton className="h-5 w-16 rounded-[4px] !bg-emerald-100/60 dark:!bg-emerald-950/40" />
                </div>
            ),
        },
    ];
}

export default getServiceAreaColumns;
