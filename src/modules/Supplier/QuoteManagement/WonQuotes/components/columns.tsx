import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { encryptId } from '@/lib/encryption';
import { WonQuoteItem } from '../types';
import {
    SupplierAddressCell,
    SupplierDistanceCell,
    SupplierPriorityBadgeCell,
    SupplierStatusBadgeCell,
    SupplierDateCell,
} from '../../QuoteRequests/components/SupplierQuoteRequestCells';

export const getWonQuoteColumns = (navigate: (path: string) => void): Column<WonQuoteItem>[] => [
    {
        id: 'id',
        label: 'Request ID',
        sortable: true,
        className: 'w-[95px] min-w-[90px]',
        render: (row) => {
            const rawId = String(row.rawId || row.slug || row.id).replace('REQ-', '').trim();
            const reqText = row.id ? (String(row.id).startsWith('REQ-') ? row.id : `REQ-${String(row.id).padStart(4, '0')}`) : 'REQ-0000';
            return (
                <div className="flex items-center min-h-[26px]">
                    <button
                        type="button"
                        onClick={() => navigate(`/supplier/quotes/requests/${encryptId(rawId)}`)}
                        className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] text-left whitespace-nowrap cursor-pointer text-[13.5px] tracking-tight transition-colors leading-none"
                    >
                        {reqText}
                    </button>
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-16 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
            </div>
        )
    },
    {
        id: 'customer',
        label: 'Customer',
        sortable: true,
        className: 'w-[140px] min-w-[130px] max-w-[170px]',
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
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-[13px] truncate block max-w-full leading-normal">
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
        id: 'pickup',
        label: 'Pickup Address',
        className: 'w-[18%] min-w-[130px] max-w-[190px]',
        render: (row) => <SupplierAddressCell address={row.pickup} />,
        skeleton: () => (
            <div className="flex items-center min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        className: 'w-[18%] min-w-[130px] max-w-[190px]',
        render: (row) => <SupplierAddressCell address={row.delivery} />,
        skeleton: () => (
            <div className="flex items-center min-w-0 pr-1 min-h-[22px]">
                <Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'distance',
        label: 'Distance',
        sortable: true,
        className: 'w-[90px] min-w-[85px] text-center',
        render: (row) => <SupplierDistanceCell distance={row.distance} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-3.5 w-14 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'budget',
        label: 'Won Amount',
        sortable: true,
        className: 'w-[115px] min-w-[105px]',
        render: (row) => {
            const rawStr = String(row.budget || '').trim();
            const num = parseFloat(rawStr.replace(/[^0-9.]/g, ''));
            const formatted = !isNaN(num) && num > 0 ? `€${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : rawStr;
            return (
                <div className="flex items-center min-h-[26px]">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap text-[13.5px]">
                        {formatted} <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400">EUR</span>
                    </span>
                </div>
            );
        },
        skeleton: () => (
            <div className="flex items-center min-h-[22px]">
                <Skeleton className="h-4 w-20 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/40" />
            </div>
        )
    },
    {
        id: 'priority',
        label: 'Priority',
        sortable: true,
        className: 'w-[85px] min-w-[80px] text-center',
        render: (row) => <SupplierPriorityBadgeCell priority={row.priority} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-14 rounded-[3px] !bg-amber-100/70 dark:!bg-amber-950/50" />
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[95px] min-w-[90px] text-center',
        render: (row) => <SupplierStatusBadgeCell status={row.status || 'Won'} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-5 w-18 rounded-[3px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
            </div>
        )
    },
    {
        id: 'requestDate',
        label: 'Date',
        sortable: true,
        className: 'w-[105px] min-w-[100px] text-center',
        render: (row) => <SupplierDateCell row={row as any} />,
        skeleton: () => (
            <div className="flex items-center justify-center min-h-[22px]">
                <Skeleton className="h-3.5 w-16 rounded-[3px]" />
            </div>
        )
    }
];
