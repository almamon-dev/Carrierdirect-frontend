/**
 * Supplier Negotiation Table Columns
 * Matches QuoteRequests column headers, avatar badges, MapPin routes, and styling standards.
 */

import React from 'react';
import { MapPin, User } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import { encryptId } from '@/lib/encryption';
import { NegotiationItem } from '../types';
import { getStatusBadgeClass } from '../../utils/statusStyles';

export const getNegotiationColumns = (navigate: (path: string) => void): Column<NegotiationItem>[] => [
    {
        id: 'id',
        label: 'ID',
        sortable: true,
        className: 'w-[75px] min-w-[75px]',
        render: (row) => (
            <div className="flex items-center h-5">
                <button
                    type="button"
                    onClick={() => {
                        const encId = encryptId(row.rawId || row.id);
                        const sKey = row.sessionKey || `ses-${row.rawId || row.id}`;
                        navigate(`/supplier/quotes/negotiation/conversation/${encId}/${sKey}`);
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
        className: 'w-[140px] min-w-[140px]',
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
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[105px] leading-none" title={row.customer}>
                    {row.customer}
                </span>
            </div>
        )
    },
    {
        id: 'pickup',
        label: 'Pickup Address',
        className: 'min-w-[170px]',
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
        className: 'min-w-[170px]',
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
        className: 'w-[85px] min-w-[85px] text-center',
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
        className: 'w-[95px] min-w-[95px]',
        render: (row) => (
            <div className="flex items-center h-5">
                <span className="whitespace-nowrap font-bold text-slate-900 dark:text-slate-100 text-xs leading-none">
                    {row.budget ? (String(row.budget).includes('€') ? row.budget : `€ ${row.budget}`) : '€ 0'}
                </span>
            </div>
        )
    },
    {
        id: 'priority',
        label: 'Priority',
        sortable: true,
        className: 'w-[90px] min-w-[90px] text-center',
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
        )
    },
    {
        id: 'status',
        label: 'Status',
        sortable: true,
        className: 'w-[110px] min-w-[110px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${getStatusBadgeClass(row.status)}`}>
                    {row.status}
                </Badge>
            </div>
        )
    },
    {
        id: 'requestDate',
        label: 'Date',
        sortable: true,
        className: 'w-[125px] min-w-[125px] text-center',
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                    {row.requestDate}
                </span>
            </div>
        )
    },
];
