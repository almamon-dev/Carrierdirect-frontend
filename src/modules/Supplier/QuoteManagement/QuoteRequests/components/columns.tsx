/**
 * Supplier Quote Requests Table Columns
 * Configures column headers, avatar badges, MapPin routes, and badges for available quote requests.
 */

import React from 'react';
import { MapPin, User } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { getStatusBadgeClass } from '../../utils/statusStyles';
import { formatDisplayDate } from '@/lib/utils';

import { encryptId } from '@/lib/encryption';

export const getSupplierColumns = (navigate: (path: string) => void): Column<QuoteRequest>[] => [
    {
        id: 'id',
        label: 'ID',
        sortable: true,
        className: 'w-[70px]',
        render: (row) => (
            <div className="flex items-center h-5">
                <button
                    type="button"
                    onClick={() => {
                        const rawId = String(row.rawId || row.slug || row.id).replace('REQ-', '').trim();
                        try {
                            sessionStorage.setItem('carrierdirect_last_quote_session_id', rawId);
                        } catch {}
                        navigate(`/supplier/quotes/requests/${encryptId(rawId)}`);
                    }}
                    className="font-bold text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-xs leading-none"
                >
                    {row.id}
                </button>
            </div>
        )
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
        )
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
        )
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
        )
    },
    {
        id: 'distance',
        label: 'Distance',
        sortable: true,
        className: 'w-[75px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs font-semibold leading-none">
                    {row.distance}
                </span>
            </div>
        )
    },
    {
        id: 'budget',
        label: 'Budget',
        sortable: true,
        className: 'w-[90px]',
        render: (row) => (
            <div className="flex items-center h-5">
                <span className="whitespace-nowrap font-bold text-slate-900 dark:text-slate-100 text-xs leading-none">
                    {row.budget ? (String(row.budget).includes('€') ? row.budget : `€ ${row.budget}`) : 'Negotiable'}
                </span>
            </div>
        )
    },
    {
        id: 'priority',
        label: 'Priority',
        sortable: true,
        className: 'w-[80px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${row.priority === 'Urgent' ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60' :
                        row.priority === 'High' ? 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60' :
                            'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}>
                    {row.priority}
                </Badge>
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[115px] text-center',
        render: (row) => {
            const rawStatus = (row.status || 'New').toLowerCase();
            return (
                <div className="flex items-center justify-center h-5">
                    <Badge 
                        variant="secondary" 
                        className={`whitespace-nowrap text-[10.5px] font-semibold border flex items-center gap-1 px-2 py-0.5 ${getStatusBadgeClass(row.status)}`}
                    >
                        {rawStatus === 'new' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />}
                        {rawStatus === 'viewed' && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />}
                        {rawStatus === 'quoted' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
                        {rawStatus === 'booked' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />}
                        {rawStatus === 'expired' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />}
                        <span>{row.status || 'New'}</span>
                    </Badge>
                </div>
            );
        }
    },
    {
        id: 'requestDate',
        label: 'Date',
        sortable: true,
        className: 'w-[110px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                    {row.requestDate && row.requestDate !== 'N/A' && row.requestDate !== 'null' ? row.requestDate : formatDisplayDate(row.pickupDate || (row as any).date || (row as any).created_at || (row as any).requested_date || row.requestDate)}
                </span>
            </div>
        )
    },
];
