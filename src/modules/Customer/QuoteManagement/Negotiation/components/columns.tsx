import React from 'react';
import { Column } from '@/components/tables/data-table';
import Skeleton from '@/components/ui/skeleton';
import { encryptId } from '@/lib/encryption';
import { CustomerNegotiationItem } from '../types';
import { SupplierCell, PriorityCell, StatusCell } from './NegotiationCells';

export const getNegotiationColumns = (navigate: (path: string) => void): Column<CustomerNegotiationItem>[] => [
    {
        id: 'id',
        label: 'Quote ID',
        sortable: true,
        className: 'w-[85px] min-w-[85px]',
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/customer/quotes/negotiation/conversation/${encryptId(row.rawId || row.id)}`);
                    }}
                    className="font-bold text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-xs"
                >
                    {row.quoteId || row.id}
                </button>
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center min-h-[26px]">
                <Skeleton className="h-4 w-14 rounded-[3px] !bg-orange-100/70 dark:!bg-orange-950/40" />
            </div>
        )
    },
    {
        id: 'requestId',
        label: 'Requested ID',
        sortable: true,
        className: 'w-[100px] min-w-[100px]',
        render: (row) => {
            const rawReq = row.requestId ? String(row.requestId).replace('REQ-', '') : '';
            return (
                <div className="flex items-center min-h-[26px]">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (rawReq) navigate(`/customer/quotes/create/view/${rawReq}`);
                        }}
                        className="font-semibold text-slate-700 dark:text-slate-300 hover:text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-xs"
                    >
                        {row.requestId || 'REQ-0000'}
                    </button>
                </div>
            );
        },
        skeleton: () => <div className="flex items-center min-h-[26px]"><Skeleton className="h-4 w-16 rounded-[3px]" /></div>
    },
    {
        id: 'customer',
        label: 'Supplier',
        sortable: true,
        className: 'w-[140px] min-w-[140px]',
        render: (row) => <SupplierCell row={row} />,
        skeleton: () => (
            <div className="flex items-center gap-2 min-h-[26px]">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-20 rounded-[3px]" />
            </div>
        )
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        className: 'min-w-0',
        render: (row) => (
            <div className="flex items-center min-w-0 pr-1 min-h-[26px]" title={row.pickup}>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate whitespace-nowrap">{row.pickup}</span>
            </div>
        ),
        skeleton: () => <div className="flex items-center min-w-0 pr-1 min-h-[26px]"><Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" /></div>
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        className: 'min-w-0',
        render: (row) => (
            <div className="flex items-center min-w-0 pr-1 min-h-[26px]" title={row.delivery}>
                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate whitespace-nowrap">{row.delivery}</span>
            </div>
        ),
        skeleton: () => <div className="flex items-center min-w-0 pr-1 min-h-[26px]"><Skeleton className="h-3.5 w-32 max-w-full rounded-[3px]" /></div>
    },
    {
        id: 'distance',
        label: 'Distance',
        sortable: true,
        className: 'w-[85px] min-w-[85px] text-center',
        render: (row) => <div className="flex items-center justify-center min-h-[26px]"><span className="whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs font-semibold">{row.distance}</span></div>,
        skeleton: () => <div className="flex items-center justify-center min-h-[26px]"><Skeleton className="h-3.5 w-12 rounded-[3px]" /></div>
    },
    {
        id: 'budget',
        label: 'Budget',
        sortable: true,
        className: 'w-[95px] min-w-[95px]',
        render: (row) => (
            <div className="flex items-center min-h-[26px]">
                <span className="whitespace-nowrap font-bold text-slate-900 dark:text-slate-100 text-xs">
                    {row.budget ? (String(row.budget).includes('€') ? row.budget : `€ ${row.budget}`) : '€ 0'}
                </span>
            </div>
        ),
        skeleton: () => <div className="flex items-center min-h-[26px]"><Skeleton className="h-4 w-16 rounded-[3px]" /></div>
    },
    {
        id: 'priority',
        label: 'Priority',
        sortable: true,
        className: 'w-[90px] min-w-[90px] text-center',
        render: (row) => <PriorityCell priority={row.priority} />,
        skeleton: () => <div className="flex items-center justify-center min-h-[26px]"><Skeleton className="h-5 w-14 rounded-[3px]" /></div>
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[110px] min-w-[110px] text-center',
        render: (row) => <StatusCell status={row.status} />,
        skeleton: () => <div className="flex items-center justify-center min-h-[26px]"><Skeleton className="h-5 w-18 rounded-[3px]" /></div>
    },
    {
        id: 'requestDate',
        label: 'Date',
        sortable: true,
        className: 'w-[115px] min-w-[115px] text-center',
        render: (row) => <div className="flex items-center justify-center min-h-[26px]"><span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium">{row.requestDate}</span></div>,
        skeleton: () => <div className="flex items-center justify-center min-h-[26px]"><Skeleton className="h-3.5 w-16 rounded-[3px]" /></div>
    }
];

export const getCustomerNegotiationColumns = getNegotiationColumns;
