import { StatusBadge } from '@/components/common/StatusBadge';
import { Column } from '@/components/tables/data-table';
import { Users, ShieldCheck, ShieldAlert, AlertTriangle, Eye } from 'lucide-react';
import { Subcontractor } from '../types';

interface GetSubcontractorColumnsProps {
    onViewDrivers: (sub: Subcontractor) => void;
    onEdit: (sub: Subcontractor) => void;
    onVerify?: (sub: Subcontractor, action: 'verify' | 'reject') => void;
    onViewCompliance?: (sub: Subcontractor) => void;
}

export function getSubcontractorColumns({
    onViewDrivers,
    onEdit,
    onVerify,
    onViewCompliance,
}: GetSubcontractorColumnsProps): Column<Subcontractor>[] {
    return [
        {
            id: 'id',
            label: 'ID',
            className: 'w-[75px] min-w-[75px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                        #SUB-{String(row.id).padStart(3, '0')}
                    </span>
                </div>
            ),
        },
        {
            id: 'name',
            label: 'Company Name',
            className: 'w-[18%] min-w-[180px]',
            render: (row) => (
                <div className="flex items-center gap-2.5 min-w-0 min-h-[26px]">
                    <div className="w-6 h-6 min-w-6 min-h-6 aspect-square rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200/80 dark:border-orange-800/80 flex items-center justify-center text-[10.5px] font-extrabold shrink-0 shadow-2xs">
                        {row.name ? row.name.charAt(0).toUpperCase() : 'C'}
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
            id: 'compliance',
            label: 'Compliance',
            className: 'w-[14%] min-w-[160px]',
            render: (row) => {
                const isVerified = Boolean(row.is_verified);
                const isInsExpired = row.insurance_status === 'expired';
                const isLicExpired = row.operating_license_status === 'expired';
                const isAnyExpired = isInsExpired || isLicExpired;

                const badgeElement = isAnyExpired ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900 cursor-pointer hover:bg-rose-100 transition-colors whitespace-nowrap">
                        <ShieldAlert size={12} className="shrink-0" />
                        <span>Expired Doc</span>
                    </span>
                ) : isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900 cursor-pointer hover:bg-emerald-100 transition-colors whitespace-nowrap">
                        <ShieldCheck size={12} className="shrink-0" />
                        <span>Verified</span>
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200/80 dark:border-amber-900 cursor-pointer hover:bg-amber-100 transition-colors whitespace-nowrap">
                        Pending Review
                    </span>
                );

                return (
                    <div className="flex items-center min-w-0">
                        <button
                            type="button"
                            onClick={() => onViewCompliance?.(row)}
                            className="cursor-pointer focus:outline-none"
                            title="Click to view compliance documents"
                        >
                            {badgeElement}
                        </button>
                    </div>
                );
            },
        },
        {
            id: 'contact_name',
            label: 'Contact Person',
            className: 'w-[13%] min-w-[140px]',
            render: (row) => (
                <div className="flex items-center min-w-0 min-h-[26px]" title={row.contact_name || '-'}>
                    <span className="font-medium text-slate-700 dark:text-slate-300 text-xs truncate">
                        {row.contact_name || '—'}
                    </span>
                </div>
            ),
        },
        {
            id: 'phone',
            label: 'Phone',
            className: 'w-[12%] min-w-[130px]',
            render: (row) => (
                <div className="flex items-center min-w-0 min-h-[26px]">
                    {row.phone ? (
                        <a
                            href={`tel:${row.phone}`}
                            className="truncate text-slate-700 dark:text-slate-300 text-xs font-mono hover:text-[#ff4a1f] transition-colors"
                            title={row.phone}
                        >
                            {row.phone}
                        </a>
                    ) : (
                        <span className="text-slate-400 text-xs">—</span>
                    )}
                </div>
            ),
        },
        {
            id: 'email',
            label: 'Email',
            className: 'w-[16%] min-w-[160px]',
            render: (row) => (
                <div className="flex items-center min-w-0 min-h-[26px]" title={row.email || '-'}>
                    {row.email ? (
                        <a
                            href={`mailto:${row.email}`}
                            className="font-medium text-slate-700 dark:text-slate-300 text-xs truncate hover:text-[#ff4a1f] transition-colors"
                        >
                            {row.email}
                        </a>
                    ) : (
                        <span className="text-slate-400 text-xs">—</span>
                    )}
                </div>
            ),
        },
        {
            id: 'vat_number',
            label: 'VAT / Tax No',
            className: 'w-[11%] min-w-[120px]',
            render: (row) => (
                <div className="flex items-center min-w-0 min-h-[26px]" title={row.vat_number || row.company_registration || ''}>
                    <span className="truncate font-mono text-slate-600 dark:text-slate-400 text-xs">
                        {row.vat_number || row.company_registration || '—'}
                    </span>
                </div>
            ),
        },
        {
            id: 'drivers',
            label: 'Drivers',
            className: 'w-[8%] min-w-[95px] text-center',
            render: (row) => {
                const count = row.drivers?.length ?? row.drivers_count ?? 0;
                return (
                    <div className="flex items-center justify-center min-h-[26px]">
                        <button
                            type="button"
                            onClick={() => onViewDrivers(row)}
                            className="px-2 py-0.5 rounded-[4px] text-[10.5px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shadow-2xs"
                            title="View drivers under this contractor"
                        >
                            <Users size={11} />
                            <span>{count} {count === 1 ? 'Driver' : 'Drivers'}</span>
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

export default getSubcontractorColumns;
