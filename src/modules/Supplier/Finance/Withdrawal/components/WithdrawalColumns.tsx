import React from 'react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import { Building2, Eye, ExternalLink } from 'lucide-react';
import { WithdrawalItem } from '../index';

export const getWithdrawalColumns = (
    onViewDetails: (item: WithdrawalItem) => void
): Column<WithdrawalItem>[] => [
    {
        id: 'id',
        label: 'Transaction ID',
        sortable: true,
        className: 'w-[120px] min-w-[110px]',
        render: (row) => (
            <button
                type="button"
                onClick={() => onViewDetails(row)}
                className="font-bold text-[#ff4a1f] hover:underline text-left cursor-pointer text-xs leading-none"
            >
                {row.id}
            </button>
        ),
    },
    {
        id: 'date',
        label: 'Date',
        sortable: true,
        className: 'w-[110px] min-w-[100px]',
        render: (row) => (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {row.date}
            </span>
        ),
    },
    {
        id: 'reference',
        label: 'Reference',
        sortable: true,
        className: 'w-[140px] min-w-[130px]',
        render: (row) => (
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium truncate block max-w-[130px]" title={row.reference}>
                {row.reference}
            </span>
        ),
    },
    {
        id: 'method',
        label: 'Destination',
        sortable: true,
        className: 'w-[160px] min-w-[150px]',
        render: (row) => (
            <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5 h-5 rounded-md bg-[#635bff]/10 text-[#635bff] flex items-center justify-center shrink-0">
                    <Building2 size={12} />
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight" title={row.method}>
                    {row.method}
                </span>
            </div>
        ),
    },
    {
        id: 'amount',
        label: 'Gross Amount',
        sortable: true,
        className: 'w-[110px] min-w-[100px]',
        render: (row) => (
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {row.amount}
            </span>
        ),
    },
    {
        id: 'fee',
        label: 'Platform Fee',
        sortable: true,
        className: 'w-[95px] min-w-[90px]',
        render: (row) => (
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                -{row.fee}
            </span>
        ),
    },
    {
        id: 'netAmount',
        label: 'Net Payout',
        sortable: true,
        className: 'w-[115px] min-w-[105px]',
        render: (row) => (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {row.netAmount}
            </span>
        ),
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[110px] min-w-[100px] text-center',
        render: (row) => {
            const s = row.status;
            return (
                <div className="flex items-center justify-center">
                    <Badge
                        variant="secondary"
                        className={`whitespace-nowrap text-[10.5px] font-semibold border ${
                            s === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50'
                                : s === 'Processing'
                                ? 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50'
                                : 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50'
                        }`}
                    >
                        {s}
                    </Badge>
                </div>
            );
        },
    },
    {
        id: 'actions',
        label: 'Action',
        className: 'w-[80px] min-w-[70px] text-right',
        render: (row) => (
            <div className="flex items-center justify-end">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(row);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="View Settlement Details"
                >
                    <Eye size={14} />
                </button>
            </div>
        ),
    },
];
