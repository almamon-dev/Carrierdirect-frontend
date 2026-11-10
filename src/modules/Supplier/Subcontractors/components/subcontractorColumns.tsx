import { StatusBadge } from '@/components/common/StatusBadge';
import { Column } from '@/components/tables/data-table';
import { Users } from 'lucide-react';
import { Subcontractor } from '../types';

interface GetSubcontractorColumnsProps {
    onViewDrivers: (sub: Subcontractor) => void;
    onEdit: (sub: Subcontractor) => void;
}

export function getSubcontractorColumns({
    onViewDrivers,
    onEdit,
}: GetSubcontractorColumnsProps): Column<Subcontractor>[] {
    return [
        {
            id: 'id',
            label: 'ID',
            className: 'w-[90px]',
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
            className: 'w-[220px] min-w-[220px]',
            render: (row) => (
                <div className="flex items-center gap-2.5 whitespace-nowrap min-w-0 min-h-[26px]">
                    <div className="w-6 h-6 min-w-6 min-h-6 aspect-square rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200/80 dark:border-orange-800/80 flex items-center justify-center text-[10.5px] font-extrabold shrink-0 shadow-2xs">
                        {row.name ? row.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <button
                        type="button"
                        onClick={() => onEdit(row)}
                        className="font-bold text-slate-900 dark:text-slate-100 text-xs hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] transition-colors truncate max-w-[170px] text-left cursor-pointer"
                        title={row.name}
                    >
                        {row.name}
                    </button>
                </div>
            ),
        },
        {
            id: 'contact_name',
            label: 'Contact Person',
            className: 'w-[150px] min-w-[150px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]" title={row.contact_name || '-'}>
                    <span className="font-medium text-slate-700 dark:text-slate-300 text-xs truncate">
                        {row.contact_name || '—'}
                    </span>
                </div>
            ),
        },
        {
            id: 'phone',
            label: 'Phone',
            className: 'w-[130px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    {row.phone ? (
                        <a
                            href={`tel:${row.phone}`}
                            className="whitespace-nowrap text-slate-700 dark:text-slate-300 text-xs font-mono hover:text-[#ff4a1f] transition-colors"
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
            className: 'min-w-[150px]',
            render: (row) => (
                <div className="flex items-center min-w-0 min-h-[26px]" title={row.email || '-'}>
                    {row.email ? (
                        <a
                            href={`mailto:${row.email}`}
                            className="font-normal text-slate-700 dark:text-slate-300 text-xs truncate hover:text-[#ff4a1f] transition-colors"
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
            className: 'w-[130px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="whitespace-nowrap font-mono text-slate-600 dark:text-slate-400 text-xs">
                        {row.vat_number || row.company_registration || '—'}
                    </span>
                </div>
            ),
        },
        {
            id: 'drivers',
            label: 'Drivers',
            className: 'w-[110px] text-center',
            render: (row) => {
                const count = row.drivers?.length ?? row.drivers_count ?? 0;
                return (
                    <div className="flex items-center justify-center min-h-[26px]">
                        <button
                            type="button"
                            onClick={() => onViewDrivers(row)}
                            className="px-2 py-0.5 rounded-[4px] text-[10.5px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100 flex items-center gap-1 cursor-pointer transition-colors"
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

export default getSubcontractorColumns;
