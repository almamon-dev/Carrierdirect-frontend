import React from 'react';
import { Column } from '@/components/tables/data-table';
import { Clock } from 'lucide-react';
import { encryptId } from '@/lib/encryption';
import { formatDisplayDate } from '@/lib/utils';
import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import { MyQuoteItem } from '../hooks/useSupplierMyQuotes';

interface MyQuoteColumnsOptions {
    onNavigate: (path: string, state?: any) => void;
}

function getRemainingTimeString(paymentExpiresAt?: string | null): string | null {
    if (!paymentExpiresAt) return null;
    const expTime = new Date(paymentExpiresAt).getTime();
    if (isNaN(expTime)) return null;
    const diffMs = expTime - Date.now();
    if (diffMs <= 0) return 'Time expired';
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0) {
        return `${hours}h ${mins}m left`;
    }
    return `${mins}m left`;
}

export const getMyQuoteColumns = ({ onNavigate }: MyQuoteColumnsOptions): Column<MyQuoteItem>[] => [
    {
        id: 'quoteId',
        label: 'Quote ID',
        sortable: true,
        className: 'w-[110px] whitespace-nowrap',
        render: (row) => {
            const rawQuoteId = String(row.quoteRawId || row.rawId || row.id).replace('QT-', '').replace('REQ-', '').trim();
            const quoteText = row.quoteId || (row.id ? `QT-${String(row.id).padStart(4, '0')}` : 'QT-0000');
            const reqText = row.id ? (String(row.id).startsWith('REQ-') ? row.id : `REQ-${String(row.id).padStart(4, '0')}`) : 'REQ-0000';
            const rawReqId = String(row.rawId || row.slug || row.id).replace('REQ-', '').trim();
            const dateVal = row.requestDate || (row as any).date || (row as any).created_at;

            return (
                <div className="flex flex-col justify-center min-h-[26px]">
                    <button
                        type="button"
                        onClick={() => onNavigate(`/supplier/quotes/my-quotes/${encryptId(rawQuoteId)}`, { from: 'my-quotes' })}
                        className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13.5px] tracking-tight transition-colors leading-none"
                    >
                        {quoteText}
                    </button>
                    <div className="flex items-center gap-1 mt-1 leading-none">
                        <button
                            type="button"
                            onClick={() => onNavigate(`/supplier/quotes/requests/${encryptId(rawReqId)}`)}
                            className="text-[11px] font-semibold text-slate-500 hover:text-[#ff4a1f] dark:text-slate-400 dark:hover:text-[#ff4a1f] whitespace-nowrap cursor-pointer"
                        >
                            {reqText}
                        </button>
                        {dateVal && (
                            <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap">
                                • {formatDisplayDate(dateVal)}
                            </span>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        id: 'customer',
        label: 'Customer',
        sortable: true,
        className: 'w-[22%] min-w-[170px]',
        render: (row) => (
            <div className="flex items-center gap-2 min-w-0 pr-1 min-h-[26px]" title={row.customer}>
                {row.customerAvatar ? (
                    <img
                        src={row.customerAvatar}
                        alt={row.customer}
                        className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full object-cover shrink-0 aspect-square border border-slate-200 dark:border-slate-700 shadow-2xs"
                        onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square">
                        {row.customer ? row.customer.charAt(0).toUpperCase() : 'C'}
                    </div>
                )}
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px] truncate">
                    {row.customer}
                </span>
            </div>
        ),
    },
    {
        id: 'route',
        label: 'Route',
        className: 'w-[40%] min-w-[320px]',
        render: (row) => <StandardRouteCell row={row} />,
    },
    {
        id: 'budget',
        label: 'Quoted Amount',
        sortable: true,
        className: 'w-[135px] whitespace-nowrap',
        render: (row) => {
            const offerVal = row.my_quote?.amount ?? row.myQuote?.amount ?? row.amount;
            const revVal = row.revisedAmount;
            return (
                <div className="flex flex-col justify-center min-h-[26px]">
                    {offerVal ? (
                        <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap text-[13.5px] leading-tight">
                            €{Number(offerVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">EUR</span>
                        </span>
                    ) : (
                        <span className="whitespace-nowrap font-semibold text-[13px] text-slate-500 dark:text-slate-400">
                            {row.budget || 'Negotiable'}
                        </span>
                    )}
                    {revVal && (
                        <span className="text-[10.5px] text-orange-600 dark:text-orange-400 font-semibold leading-tight mt-0.5">
                            Counter: €{Number(revVal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[125px] text-center whitespace-nowrap',
        render: (row) => {
            const st = (row.supplierStatus || row.status || 'submitted').toLowerCase();
            const isAwaiting = Boolean(row.isAwaitingPayment || st === 'awaiting_payment' || (st === 'accepted' && !row.isPaid));
            const timeLeft = isAwaiting ? getRemainingTimeString(row.paymentExpiresAt) : null;

            let colorClasses = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
            let label = 'Submitted';

            if (isAwaiting) {
                colorClasses = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
                label = 'Awaiting Payment';
            } else if (st === 'negotiation' || st === 'negotiating') {
                colorClasses = 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
                label = 'Negotiation';
            } else if (st === 'completed') {
                colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
                label = 'Completed';
            } else if (st === 'booked' || st === 'won') {
                colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
                label = 'Booked';
            } else if (st === 'accepted') {
                colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
                label = 'Accepted';
            } else if (st === 'rejected' || st === 'lost' || st === 'declined' || st === 'cancelled') {
                colorClasses = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
                label = 'Rejected';
            } else if (st === 'expired' || row.isExpired) {
                colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
                label = 'Expired';
            }

            return (
                <div className="flex flex-col items-center justify-center min-h-[26px]">
                    <span className={`inline-flex items-center gap-1 text-[11.5px] px-2 py-0.5 rounded-[2px] font-semibold whitespace-nowrap border ${colorClasses}`}>
                        {isAwaiting && <Clock size={11} className="text-amber-600 dark:text-amber-400 shrink-0" />}
                        {label}
                    </span>
                    {isAwaiting && timeLeft && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium leading-none mt-0.5 whitespace-nowrap">
                            {timeLeft}
                        </span>
                    )}
                </div>
            );
        },
    },
];

