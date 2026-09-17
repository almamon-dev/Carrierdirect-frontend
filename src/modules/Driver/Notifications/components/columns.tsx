/**
 * Driver Notification Columns Definition (Ultra-Compact)
 * Matching CarrierDirect compact standards with tight padding, clean non-wrapping badges, and sharp typography.
 */

import React from 'react';
import { Column } from '@/components/tables/data-table';
import { HeaderNotification } from '@/hooks/useHeaderNotifications';
import { 
    Truck, MessageSquare, Euro, AlertTriangle, Clock, ShieldCheck
} from 'lucide-react';

export const getCategoryConfig = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('order') || t.includes('trip') || t.includes('job') || t.includes('load')) {
        return { icon: Truck, bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', label: 'Trip / Load' };
    }
    if (t.includes('message') || t.includes('chat') || t.includes('dispatch')) {
        return { icon: MessageSquare, bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', label: 'Dispatch Chat' };
    }
    if (t.includes('finance') || t.includes('payout') || t.includes('salary') || t.includes('earning')) {
        return { icon: Euro, bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', label: 'Payout' };
    }
    if (t.includes('safety') || t.includes('compliance') || t.includes('inspection')) {
        return { icon: ShieldCheck, bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', label: 'Safety' };
    }
    return { icon: AlertTriangle, bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300', label: 'System' };
};

export const getNotificationColumns = (): Column<HeaderNotification>[] => [
    {
        id: 'type',
        label: 'Category',
        className: 'w-[125px]',
        render: (row) => {
            const config = getCategoryConfig(row.type);
            const Icon = config.icon;
            return (
                <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-[3px] ${config.bg} ${config.text} flex items-center justify-center shrink-0`}>
                        <Icon size={12.5} strokeWidth={2.2} />
                    </div>
                    <span className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300 capitalize truncate">{config.label}</span>
                </div>
            );
        }
    },
    {
        id: 'title',
        label: 'Notification Detail',
        className: 'min-w-[320px]',
        render: (row) => (
            <div className="py-0.5 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-nowrap min-w-0">
                    <span className={`text-[12px] leading-tight truncate ${row.unread ? 'font-bold text-slate-900 dark:text-slate-100' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                        {row.title}
                    </span>
                    {row.unread && (
                        <span className="shrink-0 inline-flex items-center justify-center bg-[#ff4a1f] text-white text-[9px] font-black px-1.5 py-0.5 rounded-[2px] leading-none uppercase shadow-2xs">
                            NEW
                        </span>
                    )}
                    {row.amount && (
                        <span className="shrink-0 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400">
                            {row.amount}
                        </span>
                    )}
                </div>
                <p className={`text-[11px] leading-snug line-clamp-1 ${row.unread ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                    {row.desc}
                </p>
            </div>
        )
    },
    {
        id: 'time',
        label: 'Time',
        className: 'w-[105px]',
        render: (row) => (
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                <Clock size={11} className="text-slate-400 shrink-0" />
                <span>{row.time}</span>
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        className: 'w-[95px]',
        render: (row) => (
            row.unread ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#ff4a1f] bg-orange-50 dark:bg-[#ff4a1f]/15 px-2 py-0.5 rounded-[2px] border border-orange-200/60 dark:border-orange-500/20 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] shrink-0" />
                    Unread
                </span>
            ) : (
                <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">
                    Read
                </span>
            )
        )
    }
];
