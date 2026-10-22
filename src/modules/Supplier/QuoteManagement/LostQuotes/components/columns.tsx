import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { encryptId } from '@/lib/encryption';
import { formatDisplayDate } from '@/lib/utils';
import { StandardRouteCell } from '@/components/common/StandardRouteCell';
import { LostQuoteItem } from '../types';
import {
    SupplierStatusBadgeCell,
} from '../../QuoteRequests/components/SupplierQuoteRequestCells';

export const getLostQuoteColumns = (navigate: (path: string) => void): Column<LostQuoteItem>[] => [
    {
        id: 'id',
        label: 'Request ID',
        sortable: true,
        className: 'w-[110px] whitespace-nowrap',
        render: (row) => {
            const rawId = String(row.rawId || row.slug || row.id).replace('REQ-', '').trim();
            const reqText = row.id ? (String(row.id).startsWith('REQ-') ? row.id : `REQ-${String(row.id).padStart(4, '0')}`) : 'REQ-0000';
            const rawDate = row.requestDate || (row as any).date || (row as any).created_at;

            return (
                <div className="flex flex-col justify-center min-h-[26px]">
                    <button
                        type="button"
                        onClick={() => navigate(`/supplier/quotes/requests/${encryptId(rawId)}`)}
                        className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13.5px] tracking-tight transition-colors leading-none"
                    >
                        {reqText}
                    </button>
                    {rawDate && (
                        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 leading-none whitespace-nowrap">
                            {formatDisplayDate(rawDate)}
                        </span>
                    )}
                </div>
            );
        },
        skeleton: () => (
            <div className="flex flex-col gap-1 min-h-[22px]">
                <Skeleton className="h-4 w-16 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
                <Skeleton className="h-2.5 w-12 rounded-[2px]" />
            </div>
        )
    },
    {
        id: 'customer',
        label: 'Customer',
        sortable: true,
        className: 'w-[24%] min-w-[180px]',
        render: (row) => (
            <div className="flex items-center gap-2 min-w-0 pr-1 min-h-[26px]" title={row.customer}>
                {row.customerAvatar ? (
                    <img
                        src={row.customerAvatar}
                        alt={row.customer}
                        className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full object-cover shrink-0 aspect-square border border-slate-200 dark:border-slate-700 shadow-2xs grayscale"
                        onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-5 h-5 min-w-[20px] min-h-[20px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-bold shrink-0 aspect-square">
                        {row.customer ? row.customer.charAt(0).toUpperCase() : 'C'}
                    </div>
                )}
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[13px] truncate block max-w-full leading-normal">
                    {row.customer}
                </span>
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center gap-2 min-h-[22px]">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-24 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'route',
        label: 'Route',
        className: 'w-[42%] min-w-[320px]',
        render: (row) => <StandardRouteCell row={row} />,
        skeleton: () => (
            <div className="flex flex-col gap-1 min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-40 max-w-full rounded-[3px]" />
                <Skeleton className="h-2.5 w-20 rounded-[2px]" />
            </div>
        )
    },
    {
        id: 'budget',
        label: 'Budget',
        sortable: true,
        className: 'w-[125px] whitespace-nowrap',
        render: (row) => {
            const rawStr = String(row.budget || '').trim();
            const num = parseFloat(rawStr.replace(/[^0-9.]/g, ''));
            const isNegotiable = !row.budget || rawStr === 'Negotiable' || rawStr === '0' || rawStr === '0.00' || rawStr === '€0.00' || rawStr === '€0' || num === 0;

            if (isNegotiable) {
                return (
                    <div className="flex items-center min-h-[26px]">
                        <span className="whitespace-nowrap font-semibold text-[13px] text-slate-500 dark:text-slate-400">
                            Negotiable
                        </span>
                    </div>
                );
            }

            const formattedNum = isNaN(num) ? rawStr : `€${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            return (
                <div className="flex items-center min-h-[26px]">
                    <span className="font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap text-[13.5px]">
                        {formattedNum} <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400">EUR</span>
                    </span>
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-16 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[115px] text-center whitespace-nowrap',
        render: (row) => <SupplierStatusBadgeCell status={row.status || 'Expired'} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px] !bg-rose-100/70 dark:!bg-rose-950/50" />
            </div>
        )
    }
];

