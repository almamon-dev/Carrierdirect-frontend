/**
 * Won Quotes Table Columns
 * Matches QuoteRequests column structure exactly (ID, Customer, Pickup, Delivery, Distance, Budget, Priority, Status, Date).
 */

import React from 'react';
import { MapPin, User } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Skeleton from '@/components/ui/skeleton';
import { WonQuoteItem } from '../types';

export const getWonQuoteColumns = (navigate: (path: string) => void): Column<WonQuoteItem>[] => [
    {
        id: 'id',
        label: 'ID',
        className: 'w-[70px]',
        render: (row) => (
            <div className="flex items-center h-5">
                <button
                    type="button"
                    onClick={() => navigate(`/supplier/quotes/requests/${row.slug}`)}
                    className="font-bold text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-xs leading-none"
                >
                    {row.id}
                </button>
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center h-5">
                <Skeleton className="h-4 w-14 rounded-[2px] !bg-orange-100/70 dark:!bg-orange-950/40" />
            </div>
        ),
    },
    {
        id: 'customer',
        label: 'Customer',
        className: 'w-[130px]',
        render: (row) => (
            <div className="flex items-center gap-2 whitespace-nowrap min-w-0 h-5">
                {row.customerAvatar ? (
                    <img
                        src={row.customerAvatar}
                        alt={row.customer}
                        className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs"
                        onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:border-orange-500/20 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0">
                        {row.customer ? row.customer.charAt(0).toUpperCase() : <User size={11} />}
                    </div>
                )}
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[100px] leading-none" title={row.customer}>
                    {row.customer}
                </span>
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center gap-2 whitespace-nowrap min-w-0 h-5">
                <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-24 rounded-[2px]" />
            </div>
        ),
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        className: 'min-w-0',
        render: (row) => (
            <div className="flex items-center gap-1.5 min-w-0 pr-1 h-5" title={row.pickup}>
                <MapPin size={13} className="text-emerald-500 shrink-0" />
                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate whitespace-nowrap leading-none">
                    {row.pickup}
                </span>
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center gap-1.5 min-w-0 pr-1 h-5">
                <MapPin size={13} className="text-emerald-500 shrink-0 opacity-60" />
                <Skeleton className="h-3.5 w-32 max-w-full rounded-[2px]" />
            </div>
        ),
    },
    {
        id: 'delivery',
        label: 'Delivery Address',
        className: 'min-w-0',
        render: (row) => (
            <div className="flex items-center gap-1.5 min-w-0 pr-1 h-5" title={row.delivery}>
                <MapPin size={13} className="text-red-500 shrink-0" />
                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate whitespace-nowrap leading-none">
                    {row.delivery}
                </span>
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center gap-1.5 min-w-0 pr-1 h-5">
                <MapPin size={13} className="text-red-500 shrink-0 opacity-60" />
                <Skeleton className="h-3.5 w-32 max-w-full rounded-[2px]" />
            </div>
        ),
    },
    {
        id: 'distance',
        label: 'Distance',
        className: 'w-[75px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs font-semibold leading-none">
                    {row.distance}
                </span>
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center justify-center h-5">
                <Skeleton className="h-3.5 w-14 rounded-[2px]" />
            </div>
        ),
    },
    {
        id: 'budget',
        label: 'Budget',
        className: 'w-[90px]',
        render: (row) => (
            <div className="flex items-center h-5">
                <span className="whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400 text-xs leading-none">
                    {row.budget}
                </span>
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center h-5">
                <Skeleton className="h-4 w-16 rounded-[2px] !bg-emerald-100/70 dark:!bg-emerald-950/40" />
            </div>
        ),
    },
    {
        id: 'priority',
        label: 'Priority',
        className: 'w-[80px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${
                    row.priority === 'Urgent' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60' :
                    row.priority === 'High' ? 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60' :
                    'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                }`}>
                    {row.priority}
                </Badge>
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center justify-center h-5">
                <Skeleton className="h-4 w-14 rounded-[2px]" />
            </div>
        ),
    },
    {
        id: 'status',
        label: 'Status',
        className: 'w-[105px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${
                    row.status === 'Won' || row.status === 'Accepted' || row.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                        : row.status === 'In Transit'
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60'
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                }`}>
                    {row.status}
                </Badge>
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center justify-center h-5">
                <Skeleton className="h-5 w-20 rounded-[2px] !bg-emerald-100/70 dark:!bg-emerald-950/50" />
            </div>
        ),
    },
    {
        id: 'requestDate',
        label: 'Date',
        className: 'w-[110px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                    {row.requestDate}
                </span>
            </div>
        ),
        skeleton: () => (
            <div className="flex items-center justify-center h-5">
                <Skeleton className="h-3.5 w-20 rounded-[2px]" />
            </div>
        ),
    },
];
