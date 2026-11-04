import React from 'react';
import { Column } from '@/components/tables/data-table';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Building2, Truck, User } from 'lucide-react';
import { SubcontractorDriver } from '../types';

interface GetSubcontractorDriverColumnsProps {
    subcontractorsMap: Record<string | number, string>;
    onEdit: (driver: SubcontractorDriver) => void;
}

export function getSubcontractorDriverColumns({
    subcontractorsMap,
    onEdit,
}: GetSubcontractorDriverColumnsProps): Column<SubcontractorDriver>[] {
    return [
        {
            id: 'id',
            label: 'ID',
            className: 'w-[85px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                        #DRV-{String(row.id).padStart(3, '0')}
                    </span>
                </div>
            ),
        },
        {
            id: 'name',
            label: 'Driver Name',
            className: 'w-[180px] min-w-[180px]',
            render: (row) => (
                <div className="flex items-center gap-2 whitespace-nowrap min-w-0 min-h-[26px]">
                    <div className="w-6.5 h-6.5 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-center text-[10.5px] font-bold shrink-0 shadow-2xs">
                        {row.name ? row.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="font-bold text-slate-900 dark:text-slate-100 text-xs hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors truncate max-w-[130px] text-left cursor-pointer"
                        title={row.name}
                    >
                        {row.name}
                    </button>
                </div>
            ),
        },
        {
            id: 'subcontractor',
            label: 'Contractor Company',
            className: 'w-[180px] min-w-[180px]',
            render: (row) => {
                const companyName =
                    subcontractorsMap[row.subcontractor_id] ||
                    (row as any).subcontractor?.name ||
                    `Contractor #${row.subcontractor_id}`;
                return (
                    <div className="flex items-center gap-1.5 min-h-[26px]">
                        <Building2 size={12} className="text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate" title={companyName}>
                            {companyName}
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'phone',
            label: 'Phone (App Login)',
            className: 'w-[145px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="whitespace-nowrap text-slate-700 dark:text-slate-300 text-xs font-mono font-medium">
                        {row.phone}
                    </span>
                </div>
            ),
        },
        {
            id: 'vehicle_plate',
            label: 'Vehicle Plate',
            className: 'w-[140px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    {row.vehicle_plate ? (
                        <span className="font-mono text-xs font-bold text-[#ff4a1f] bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/60 px-1.5 py-0.5 rounded-[4px] tracking-wide">
                            {row.vehicle_plate}
                        </span>
                    ) : (
                        <span className="text-slate-400 text-xs">—</span>
                    )}
                </div>
            ),
        },
        {
            id: 'vehicle_type',
            label: 'Vehicle Type',
            className: 'w-[140px]',
            render: (row) => (
                <div className="flex items-center gap-1.5 min-h-[26px]">
                    {row.vehicle_type ? (
                        <span className="text-slate-600 dark:text-slate-400 text-xs truncate" title={row.vehicle_type}>
                            {row.vehicle_type}
                        </span>
                    ) : (
                        <span className="text-slate-400 text-xs">—</span>
                    )}
                </div>
            ),
        },
        {
            id: 'license',
            label: 'License No',
            className: 'w-[120px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="font-mono text-slate-600 dark:text-slate-400 text-xs">
                        {row.driver_license_number || '—'}
                    </span>
                </div>
            ),
        },
        {
            id: 'status',
            label: 'Status',
            className: 'w-[95px] text-center',
            render: (row) => {
                const isActive = row.status === 'active';
                return (
                    <div className="flex items-center justify-center min-h-[26px]">
                        <StatusBadge
                            status={isActive ? 'Active' : 'Inactive'}
                            category={isActive ? 'success' : 'neutral'}
                        />
                    </div>
                );
            },
        },
    ];
}

export default getSubcontractorDriverColumns;
