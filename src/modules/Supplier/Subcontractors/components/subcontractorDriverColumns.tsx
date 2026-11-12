import { StatusBadge } from '@/components/common/StatusBadge';
import { Column } from '@/components/tables/data-table';
import { Building2, Mail, ShieldCheck, ShieldAlert, Eye } from 'lucide-react';
import { SubcontractorDriver } from '../types';

interface GetSubcontractorDriverColumnsProps {
    subcontractorsMap: Record<string | number, string>;
    onEdit: (driver: SubcontractorDriver) => void;
    onToggleStatus?: (driver: SubcontractorDriver) => void;
    onVerify?: (driver: SubcontractorDriver, action: 'verify' | 'reject') => void;
    onViewCompliance?: (driver: SubcontractorDriver) => void;
}

export function getSubcontractorDriverColumns({
    subcontractorsMap,
    onEdit,
    onToggleStatus,
    onVerify,
    onViewCompliance,
}: GetSubcontractorDriverColumnsProps): Column<SubcontractorDriver>[] {
    return [
        {
            id: 'id',
            label: 'ID',
            className: 'w-[75px] min-w-[75px]',
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
            className: 'w-[18%] min-w-[170px]',
            render: (row) => (
                <div className="flex items-center gap-2 min-w-0 min-h-[26px]">
                    <div className="w-6 h-6 min-w-6 min-h-6 aspect-square rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900/60 flex items-center justify-center text-[10.5px] font-bold shrink-0 shadow-2xs">
                        {row.name ? row.name.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="font-bold text-slate-900 dark:text-slate-100 text-xs hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors truncate text-left cursor-pointer min-w-0"
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
            className: 'w-[18%] min-w-[170px]',
            render: (row) => {
                const companyName =
                    subcontractorsMap[row.subcontractor_id] ||
                    (row as any).subcontractor?.name ||
                    `Contractor #${row.subcontractor_id}`;
                return (
                    <div className="flex items-center gap-1.5 min-w-0 min-h-[26px]">
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
            className: 'w-[20%] min-w-[180px]',
            render: (row) => (
                <div className="flex items-center gap-1.5 min-w-0 min-h-[26px]">
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
            className: 'w-[13%] min-w-[130px]',
            render: (row) => (
                <div className="flex items-center min-w-0 min-h-[26px]">
                    <span className="truncate text-slate-700 dark:text-slate-300 text-xs font-mono">
                        {row.phone || '—'}
                    </span>
                </div>
            ),
        },
        {
            id: 'compliance',
            label: 'Compliance',
            className: 'w-[13%] min-w-[155px]',
            render: (row) => {
                const isVerified = Boolean(row.is_verified);
                const isLicExpired = row.license_status === 'expired';
                const isInsExpired = row.insurance_status === 'expired';

                const badgeElement = (isLicExpired || isInsExpired) ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900 cursor-pointer hover:bg-rose-100 transition-colors whitespace-nowrap">
                        <ShieldAlert size={12} className="shrink-0" />
                        <span>Expired</span>
                    </span>
                ) : isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900 cursor-pointer hover:bg-emerald-100 transition-colors whitespace-nowrap">
                        <ShieldCheck size={12} className="shrink-0" />
                        <span>Verified</span>
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900 cursor-pointer hover:bg-amber-100 transition-colors whitespace-nowrap">
                        Pending
                    </span>
                );

                return (
                    <div className="flex items-center min-w-0">
                        <button
                            type="button"
                            onClick={() => onViewCompliance?.(row)}
                            className="cursor-pointer focus:outline-none"
                            title="Click to view driver compliance documents"
                        >
                            {badgeElement}
                        </button>
                    </div>
                );
            },
        },
        {
            id: 'status',
            label: 'Status',
            className: 'w-[8%] min-w-[85px] text-center',
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
