import React from 'react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import { encryptId } from '@/lib/encryption';
import { NegotiationItem } from '../types';
import { getStatusBadgeClass } from '../../utils/statusStyles';

const getPriorityClass = (p: string) => {
    if (p === 'Urgent') return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300';
    if (p === 'High') return 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300';
    return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
};

export const getNegotiationColumns = (navigate: (path: string) => void): Column<NegotiationItem>[] => [
    {
        id: 'id', label: 'Quote ID', sortable: true, className: 'w-[80px] min-w-[80px]',
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
                    {row.quoteId || row.id}
                </button>
            </div>
        )
    },
    {
        id: 'requestId', label: 'Requested ID', sortable: true, className: 'w-[100px] min-w-[100px]',
        render: (row) => {
            const rawReq = row.requestId ? String(row.requestId).replace('REQ-', '') : '';
            return (
                <div className="flex items-center h-5">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); if (rawReq) navigate(`/supplier/quotes/requests/view/${rawReq}`); }}
                        className="font-semibold text-slate-700 dark:text-slate-300 hover:text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-xs leading-none"
                    >
                        {row.requestId || 'REQ-0000'}
                    </button>
                </div>
            );
        }
    },
    {
        id: 'customer', label: 'Customer', sortable: true, className: 'w-[140px] min-w-[140px]',
        render: (row) => (
            <div className="flex items-center gap-2 whitespace-nowrap min-w-0 h-5">
                {row.customerAvatar ? (
                    <img src={row.customerAvatar} alt={row.customer} className="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-2xs" onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }} />
                ) : (
                    <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 text-[#ff4a1f] flex items-center justify-center text-[10px] font-bold shrink-0">
                        {row.customer ? row.customer.charAt(0).toUpperCase() : 'C'}
                    </div>
                )}
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[105px] leading-none" title={row.customer}>{row.customer}</span>
            </div>
        )
    },
    {
        id: 'pickup', label: 'Pickup Address', className: 'min-w-0',
        render: (row) => <div className="flex items-center min-w-0 pr-1 h-5" title={row.pickup}><span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">{row.pickup}</span></div>
    },
    {
        id: 'delivery', label: 'Delivery Address', className: 'min-w-0',
        render: (row) => <div className="flex items-center min-w-0 pr-1 h-5" title={row.delivery}><span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate leading-normal">{row.delivery}</span></div>
    },
    {
        id: 'distance', label: 'Distance', sortable: true, className: 'w-[85px] min-w-[85px] text-center',
        render: (row) => <div className="flex items-center justify-center h-5"><span className="whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs font-semibold leading-none">{row.distance}</span></div>
    },
    {
        id: 'budget', label: 'Budget', sortable: true, className: 'w-[95px] min-w-[95px]',
        render: (row) => <div className="flex items-center h-5"><span className="whitespace-nowrap font-bold text-slate-900 dark:text-slate-100 text-xs leading-none">{row.budget ? (String(row.budget).includes('€') ? row.budget : `€ ${row.budget}`) : '€ 0'}</span></div>
    },
    {
        id: 'priority', label: 'Priority', sortable: true, className: 'w-[90px] min-w-[90px] text-center',
        render: (row) => <div className="flex items-center justify-center h-5"><Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${getPriorityClass(row.priority)}`}>{row.priority}</Badge></div>
    },
    {
        id: 'status', label: 'Status', sortable: true, className: 'w-[110px] min-w-[110px] text-center',
        render: (row) => <div className="flex items-center justify-center h-5"><Badge variant="secondary" className={`whitespace-nowrap text-[10.5px] font-semibold border ${getStatusBadgeClass(row.status)}`}>{row.status}</Badge></div>
    },
    {
        id: 'requestDate', label: 'Date', sortable: true, className: 'w-[125px] min-w-[125px] text-center',
        render: (row) => <div className="flex items-center justify-center h-5"><span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">{row.requestDate}</span></div>
    },
];
