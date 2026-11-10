import { StatusBadge } from '@/components/common/StatusBadge';
import { Column } from '@/components/tables/data-table';
import { Building2, Mail } from 'lucide-react';
import { SubcontractorDriver } from '../types';

interface GetSubcontractorDriverColumnsProps {
    subcontractorsMap: Record<string | number, string>;
    onEdit: (driver: SubcontractorDriver) => void;
    onToggleStatus?: (driver: SubcontractorDriver) => void;
}

export function getSubcontractorDriverColumns({
    subcontractorsMap,
    onEdit,
    onToggleStatus,
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
            className: 'w-[190px] min-w-[190px]',
            render: (row) => (
                <div className="flex items-center gap-2 whitespace-nowrap min-w-0 min-h-[26px]">
                    <div className="w-6 h-6 min-w-6 min-h-6 aspect-square rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-center text-[10.5px] font-bold shrink-0 shadow-2xs">
                        {row.name ? row.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="font-bold text-slate-900 dark:text-slate-100 text-xs hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors truncate max-w-[140px] text-left cursor-pointer"
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
            className: 'w-[190px] min-w-[190px]',
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
            id: 'email',
            label: 'Email (App Login)',
            className: 'w-[200px] min-w-[200px]',
            render: (row) => (
                <div className="flex items-center gap-1.5 min-h-[26px]">
                    <Mail size={12} className="text-slate-400 shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 text-xs font-medium truncate" title={row.email || ''}>
                        {row.email || '—'}
                    </span>
                </div>
            ),
        },
        {
            id: 'phone',
            label: 'Phone',
            className: 'w-[140px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="whitespace-nowrap text-slate-700 dark:text-slate-300 text-xs font-mono">
                        {row.phone || '—'}
                    </span>
                </div>
            ),
        },
        {
            id: 'license',
            label: 'License No',
            className: 'w-[130px]',
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
                        <button
                            type="button"
                            onClick={() => onToggleStatus?.(row)}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            title={`Status: ${isActive ? 'Active' : 'Inactive'} (Click to toggle)`}
                        >
                            <StatusBadge
                                status={isActive ? 'Active' : 'Inactive'}
                                category={isActive ? 'success' : 'neutral'}
                            />
                        </button>
                    </div>
                );
            },
        },
    ];
}
