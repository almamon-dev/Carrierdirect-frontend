/**
 * Notification Columns Definition
 * Matching CarrierDirect Supplier table standards with type icons and status indicators.
 */

import React from 'react';
import { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import { HeaderNotification } from '@/hooks/useHeaderNotifications';
import { 
    FileText, Truck, MessageSquare, Euro, AlertTriangle, Clock
} from 'lucide-react';

export const getCategoryConfig = (type: string) => {
    const t = (type || '').toLowerCase();
    if (t.includes('quote')) {
        return { icon: FileText, bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-[#ff4a1f]', label: 'Quote' };
    }
    if (t.includes('order')) {
        return { icon: Truck, bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', label: 'Order' };
    }
    if (t.includes('message')) {
        return { icon: MessageSquare, bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', label: 'Message' };
    }
    if (t.includes('finance')) {
        return { icon: Euro, bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', label: 'Finance' };
    }
    return { icon: AlertTriangle, bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', label: 'System' };
};

export const getNotificationColumns = (): Column<HeaderNotification>[] => [
    {
        id: 'type',
        label: 'Category',
        className: 'w-[130px]',
        render: (row) => {
            const config = getCategoryConfig(row.type);
            const Icon = config.icon;
            return (
                <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-[3px] ${config.bg} ${config.text} flex items-center justify-center shrink-0`}>
                        <Icon size={14} strokeWidth={2.2} />
                    </div>
                    <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 capitalize">{config.label}</span>
                </div>
            );
        }
    },
    {
        id: 'title',
        label: 'Notification Detail',
        className: 'min-w-[320px]',
        render: (row) => (
            <div className="py-0.5">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[13px] ${row.unread ? 'font-bold text-slate-900 dark:text-slate-100' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                        {row.title}
                    </span>
                    {row.unread && (
                        <Badge className="bg-[#ff4a1f] text-white text-[9px] font-black px-1.5 py-0.2 rounded-[3px] border-none shadow-2xs">
                            NEW
                        </Badge>
                    )}
                </div>
                <p className={`text-[12px] leading-relaxed line-clamp-1 ${row.unread ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                    {row.desc}
                </p>
            </div>
        )
    },
    {
        id: 'time',
        label: 'Time',
        className: 'w-[130px]',
        render: (row) => (
            <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                <Clock size={12} className="text-slate-400" />
                <span>{row.time}</span>
            </div>
        )
    },
    {
        id: 'status',
        label: 'Status',
        className: 'w-[100px]',
        render: (row) => (
            row.unread ? (
                <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#ff4a1f] bg-orange-50 dark:bg-[#ff4a1f]/15 px-2 py-0.5 rounded-[3px] border border-orange-200/60 dark:border-orange-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f]" />
                    Unread
                </span>
            ) : (
                <span className="text-[11.5px] text-slate-400 dark:text-slate-500 font-medium">
                    Read
                </span>
            )
        )
    }
];
