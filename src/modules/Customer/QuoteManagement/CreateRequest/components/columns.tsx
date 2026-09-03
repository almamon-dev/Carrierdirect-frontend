import { buildSecureQuoteUrl } from '@/utils/urlSecurity';
/**
 * Customer Quote Request Table Columns
 * Configures the table columns, visual badges, and cell formatters for Customer Quote Requests.
 */

import React from 'react';
import { MapPin } from 'lucide-react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import { CustomerQuoteRequestItem } from '../types';
import { formatDisplayDate } from '@/lib/utils';

export const getCustomerColumns = (navigate: (path: string) => void): Column<CustomerQuoteRequestItem>[] => [
    { 
        id: 'id', 
        label: 'ID', 
        className: 'w-[70px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center h-5">
                <button
                    type="button"
                    onClick={() => navigate(`/customer/quotes/create/view/${row.rawId || String(row.id).replace('REQ-', '')}`)}
                    className="font-bold text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-xs flex items-center gap-1.5 leading-none"
                >
                    {row.id}
                </button>
            </div>
        ) 
    },
    { 
        id: 'pickup', 
        label: 'Pickup Address', 
        className: 'min-w-0',
        render: (row) => (
            <div className="flex items-center gap-1.5 min-w-0 pr-1" title={row.pickup}>
                <MapPin size={13} className="text-emerald-500 shrink-0" />
                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">
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
            <div className="flex items-center gap-1.5 min-w-0 pr-1" title={row.delivery}>
                <MapPin size={13} className="text-red-500 shrink-0" />
                <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">
                    {row.delivery}
                </span>
            </div>
        ) 
    },
    { 
        id: 'distance', 
        label: 'Distance', 
        className: 'w-[75px] text-center',
        sortable: true,
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
        className: 'w-[90px]',
        sortable: true,
        render: (row) => (
            <div className="flex items-center h-5">
                <span className="whitespace-nowrap font-bold text-slate-900 dark:text-slate-100 text-xs leading-none">
                    {row.budget}
                </span>
            </div>
        )
    },
    { 
        id: 'quotesReceived', 
        label: 'Quotes', 
        className: 'w-[75px] text-center',
        sortable: true,
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className={`whitespace-nowrap text-xs font-bold leading-none ${row.quotesReceived > 0 ? 'text-[#ff4a1f]' : 'text-slate-400 dark:text-slate-500'}`}>
                    {row.quotesReceived} {row.quotesReceived === 1 ? 'Quote' : 'Quotes'}
                </span>
            </div>
        ) 
    },
    { 
        id: 'priority', 
        label: 'Priority', 
        className: 'w-[80px] text-center',
        sortable: true,
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
        className: 'w-[105px] text-center',
        sortable: true,
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${
                    row.status === 'Active' || row.status === 'Bidding Active' || row.status === 'Negotiating' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60' 
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                }`}>
                    {row.status}
                </Badge>
            </div>
        ) 
    },
    { 
        id: 'date', 
        label: 'Date', 
        className: 'w-[110px] text-center',
        sortable: true,
        render: (row) => (
            <div className="flex items-center justify-center h-5">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">
                    {row.date && row.date !== 'N/A' && row.date !== 'null' ? row.date : formatDisplayDate((row as any).created_at || (row as any).requested_date || (row as any).pickup_date || row.date)}
                </span>
            </div>
        )
    }
];
