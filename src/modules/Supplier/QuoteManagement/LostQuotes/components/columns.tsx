import React from 'react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Skeleton from '@/components/ui/skeleton';
import { LostQuoteItem } from '../types';

export const getLostQuoteColumns = (navigate: (path: string) => void): Column<LostQuoteItem>[] => [
    {
        id: 'id',
        label: 'ID',
        sortable: true,
        className: 'w-[70px]',
        render: (row) => (
            <div className="flex items-center h-5">
                <button
                    type="button"
                    onClick={() => navigate(`/supplier/quotes/requests/${row.slug}`)}
                    className="font-bold text-slate-700 dark:text-slate-300 hover:text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-xs leading-none"
                >
                    {row.id}
                </button>
            </div>
        ),
        skeleton: () => <div className="flex items-center h-5"><Skeleton className="h-4 w-14 rounded-[2px] !bg-slate-200/80 dark:!bg-slate-800" /></div>,
    },
    {
        id: 'customer',
        label: 'Customer',
        sortable: true,
        className: 'w-[130px]',
        render: (row) => (
            <div className="flex items-center gap-2 whitespace-nowrap min-w-0 h-5">
                {row.customerAvatar ? (
                    <img
                        src={row.customerAvatar} alt={row.customer}
                        className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs grayscale"
                        onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {row.customer ? row.customer.charAt(0).toUpperCase() : 'C'}
                    </div>
                )}
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[100px] leading-none" title={row.customer}>{row.customer}</span>
            </div>
        ),
        skeleton: () => <div className="flex items-center gap-2 whitespace-nowrap min-w-0 h-5"><Skeleton className="w-5 h-5 rounded-full shrink-0" /><Skeleton className="h-3.5 w-24 rounded-[2px]" /></div>,
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        className: 'min-w-0',
        render: (row) => (
            <div className="flex items-center min-w-0 pr-1 h-5" title={row.pickup}>
                <span className="font-medium text-slate-700 dark:text-slate-300 text-xs truncate whitespace-nowrap leading-none">{row.pickup}</span>
            </div>
        ),
        skeleton: () => <div className="flex items-center min-w-0 pr-1 h-5"><Skeleton className="h-3.5 w-32 max-w-full rounded-[2px]" /></div>,
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        className: 'min-w-0',
        render: (row) => (
            <div className="flex items-center min-w-0 pr-1 h-5" title={row.delivery}>
                <span className="font-medium text-slate-700 dark:text-slate-300 text-xs truncate whitespace-nowrap leading-none">{row.delivery}</span>
            </div>
        ),
        skeleton: () => <div className="flex items-center min-w-0 pr-1 h-5"><Skeleton className="h-3.5 w-32 max-w-full rounded-[2px]" /></div>,
    },
    {
        id: 'distance',
        label: 'Distance',
        sortable: true,
        className: 'w-[75px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-slate-500 dark:text-slate-400 text-xs font-semibold leading-none">{row.distance}</span>
            </div>
        ),
        skeleton: () => <div className="flex items-center justify-center h-5"><Skeleton className="h-3.5 w-14 rounded-[2px]" /></div>,
    },
    {
        id: 'budget',
        label: 'Budget',
        sortable: true,
        className: 'w-[90px]',
        render: (row) => (
            <div className="flex items-center h-5">
                <span className="whitespace-nowrap font-medium text-slate-500 dark:text-slate-400 text-xs leading-none">{row.budget}</span>
            </div>
        ),
        skeleton: () => <div className="flex items-center h-5"><Skeleton className="h-4 w-14 rounded-[2px]" /></div>,
    },
    {
        id: 'priority',
        label: 'Priority',
        sortable: true,
        className: 'w-[80px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <Badge variant="secondary" className="whitespace-nowrap text-[10.5px] font-semibold border bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400">{row.priority || 'Normal'}</Badge>
            </div>
        ),
        skeleton: () => <div className="flex items-center justify-center h-5"><Skeleton className="h-4 w-14 rounded-[2px]" /></div>,
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[105px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <Badge variant="secondary" className="whitespace-nowrap text-[10.5px] font-semibold border bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300">{row.status}</Badge>
            </div>
        ),
        skeleton: () => <div className="flex items-center justify-center h-5"><Skeleton className="h-5 w-16 rounded-[2px] !bg-rose-100/70 dark:!bg-rose-950/40" /></div>,
    },
    {
        id: 'requestDate',
        label: 'Date',
        sortable: true,
        className: 'w-[110px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">{row.requestDate}</span>
            </div>
        ),
        skeleton: () => <div className="flex items-center justify-center h-5"><Skeleton className="h-3.5 w-20 rounded-[2px]" /></div>,
    },
];
