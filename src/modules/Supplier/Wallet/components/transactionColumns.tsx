import React from 'react';
import { Column } from '@/components/tables/data-table';
import { formatDisplayDate } from '@/lib/utils';
import { ArrowDownLeft, ArrowUpRight, Check, Copy, Percent } from 'lucide-react';
import { TransactionRow } from '../types/transaction.types';

interface GetTransactionColumnsOptions {
    copiedRef: string | null;
    handleCopy: (refText: string) => void;
}

export function getTransactionColumns({ copiedRef, handleCopy }: GetTransactionColumnsOptions): Column<TransactionRow>[] {
    return [
        {
            id: 'date',
            label: 'Date',
            sortable: true,
            className: 'w-[130px] whitespace-nowrap',
            render: (row) => (
                <div className="flex items-center min-h-[22px]">
                    <span className="whitespace-nowrap text-[12px] text-slate-500 dark:text-slate-400 font-normal">
                        {formatDisplayDate(row.date_time || row.date)}
                    </span>
                </div>
            ),
        },
        {
            id: 'amount',
            label: 'Amount',
            sortable: true,
            className: 'w-[130px] whitespace-nowrap',
            render: (row) => {
                const rawAmt = typeof row.raw_amount === 'number'
                    ? Math.abs(row.raw_amount)
                    : Math.abs(parseFloat(String(row.amount || '').replace(/[^0-9.-]/g, '')) || 0);
                const isPositive = row.amount?.startsWith('+') || row.raw_type === 'earning';
                const formatted = rawAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                const cur = (row.currency || 'EUR').toUpperCase();
                return (
                    <div className="flex items-center min-h-[22px]">
                        <span className={`font-bold text-[13px] whitespace-nowrap ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                            {isPositive ? '+' : '-'}€{formatted} <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">{cur}</span>
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            className: 'w-[125px] whitespace-nowrap',
            render: (row) => {
                const st = (row.raw_status || row.status || '').toLowerCase();
                if (st === 'completed' || st === 'paid' || st === 'succeeded' || st === 'cleared') {
                    return (
                        <div className="flex items-center min-h-[22px]">
                            <span className="inline-flex items-center gap-1 bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                                Paid
                            </span>
                        </div>
                    );
                }
                if (st === 'payout' || st === 'in_escrow' || st === 'processing') {
                    return (
                        <div className="flex items-center min-h-[22px]">
                            <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                                Processing
                            </span>
                        </div>
                    );
                }
                if (st === 'failed') {
                    return (
                        <div className="flex items-center min-h-[22px]">
                            <span className="inline-flex items-center gap-1 bg-[#fff1f2] dark:bg-rose-950/40 text-[#e11d48] dark:text-rose-300 border border-[#fecdd3] dark:border-rose-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                                Failed
                            </span>
                        </div>
                    );
                }
                return (
                    <div className="flex items-center min-h-[22px]">
                        <span className="inline-flex items-center gap-1 bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-300 border border-[#fde68a] dark:border-amber-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                            Pending
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'transaction_id',
            label: 'Transaction #',
            sortable: true,
            className: 'w-[125px] whitespace-nowrap',
            render: (row) => {
                const num = row.transaction_id
                    ? (row.transaction_id.startsWith('TXN') ? row.transaction_id : `TXN-${String(row.transaction_id).padStart(4, '0')}`)
                    : `#${row.id}`;
                return (
                    <div className="flex items-center min-h-[22px]">
                        <span className="font-medium text-[12.5px] text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] whitespace-nowrap">
                            {num}
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'type',
            label: 'Type',
            sortable: true,
            className: 'w-[150px] whitespace-nowrap',
            render: (row) => {
                const rawType = (row.raw_type || '').toLowerCase();
                const typeText = row.type || 'Transaction';

                if (rawType === 'earning' || typeText.toLowerCase().includes('order') || typeText.toLowerCase().includes('earning')) {
                    return (
                        <div className="flex items-center min-h-[22px]">
                            <span className="inline-flex items-center gap-1 bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60 text-[11px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                                <ArrowDownLeft size={11} className="text-[#059669] dark:text-emerald-400" />
                                Order Payment
                            </span>
                        </div>
                    );
                }
                if (rawType === 'fee' || typeText.toLowerCase().includes('fee') || typeText.toLowerCase().includes('commission')) {
                    return (
                        <div className="flex items-center min-h-[22px]">
                            <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] px-2 py-0.5 rounded-[4px] font-medium whitespace-nowrap">
                                <Percent size={10} className="text-slate-500" />
                                Platform Fee
                            </span>
                        </div>
                    );
                }
                if (rawType === 'payout' || rawType === 'withdrawal' || typeText.toLowerCase().includes('payout') || typeText.toLowerCase().includes('withdraw')) {
                    return (
                        <div className="flex items-center min-h-[22px]">
                            <span className="inline-flex items-center gap-1 bg-[#fff7ed] dark:bg-orange-950/40 text-[#ea580c] dark:text-orange-300 border border-[#fed7aa] dark:border-orange-800/60 text-[11px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                                <ArrowUpRight size={11} className="text-[#ea580c] dark:text-orange-400" />
                                Payout to Stripe
                            </span>
                        </div>
                    );
                }
                if (rawType === 'refund' || typeText.toLowerCase().includes('refund')) {
                    return (
                        <div className="flex items-center min-h-[22px]">
                            <span className="inline-flex items-center gap-1 bg-[#fff1f2] dark:bg-rose-950/40 text-[#e11d48] dark:text-rose-300 border border-[#fecdd3] dark:border-rose-800/60 text-[11px] px-2 py-0.5 rounded-[4px] font-medium whitespace-nowrap">
                                Refund
                            </span>
                        </div>
                    );
                }
                return (
                    <div className="flex items-center min-h-[22px]">
                        <span className="text-[12px] font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                            {typeText}
                        </span>
                    </div>
                );
            },
        },
        {
            id: 'description',
            label: 'Description',
            sortable: true,
            className: 'min-w-[170px] max-w-[280px]',
            render: (row) => (
                <div className="flex items-center min-h-[22px]">
                    <span className="text-[12.5px] font-normal text-slate-700 dark:text-slate-300 truncate" title={row.description}>
                        {row.description}
                    </span>
                </div>
            ),
        },
        {
            id: 'reference',
            label: 'Reference',
            sortable: true,
            className: 'w-[145px] whitespace-nowrap',
            render: (row) => {
                const ref = row.reference || row.raw_reference;
                if (!ref) return <span className="text-slate-400 text-xs">—</span>;
                const isCopied = copiedRef === (row.raw_reference || ref);
                return (
                    <div className="flex items-center gap-1.5 min-h-[22px]">
                        <span className="font-mono text-[11.5px] text-slate-600 dark:text-slate-300">
                            {ref}
                        </span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(row.raw_reference || ref);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Copy reference"
                        >
                            {isCopied ? <Check size={11.5} className="text-emerald-500" /> : <Copy size={11.5} />}
                        </button>
                    </div>
                );
            },
        },
    ];
}
