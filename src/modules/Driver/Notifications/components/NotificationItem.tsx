import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, MessageSquare, DollarSign, ShieldCheck, AlertTriangle, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { HeaderNotification, normalizeNotifLink } from '@/hooks/useHeaderNotifications';
import { getCategoryConfig } from './columns';

interface Props {
    notification: HeaderNotification;
    onMarkRead: (id: string | number) => void;
    onMarkUnread?: (id: string | number) => void;
}

export const NotificationItem: React.FC<Props> = ({ notification, onMarkRead }) => {
    const config = getCategoryConfig(notification.type);
    const Icon = config.icon;

    return (
        <div
            className={`p-3.5 rounded-[4px] border transition-all flex flex-col justify-between gap-3 h-full ${
                notification.unread
                    ? 'bg-white dark:bg-[#161a22] border-orange-200/80 dark:border-orange-950/60 shadow-2xs'
                    : 'bg-white/80 dark:bg-[#12161c] border-slate-200/80 dark:border-slate-800/80'
            }`}
        >
            <div className="flex items-start gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 ${config.bg} ${config.text}`}>
                    <Icon size={16} strokeWidth={2.2} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {config.label}
                        </span>
                        <span className="text-[10.5px] text-slate-400 font-medium whitespace-nowrap">
                            {notification.time}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className={`text-[12.5px] leading-tight ${
                            notification.unread 
                                ? 'font-bold text-slate-900 dark:text-slate-100' 
                                : 'font-semibold text-slate-700 dark:text-slate-300'
                        }`}>
                            {notification.title}
                        </h3>
                        {notification.unread && (
                            <span className="shrink-0 inline-flex items-center justify-center bg-[#ff4a1f] text-white text-[8.5px] font-black px-1.5 py-0.2 rounded-[2px] leading-none uppercase">
                                NEW
                            </span>
                        )}
                        {notification.amount && (
                            <span className="shrink-0 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                {notification.amount}
                            </span>
                        )}
                    </div>

                    <p className={`text-[11.5px] leading-snug mt-1 line-clamp-2 ${
                        notification.unread 
                            ? 'text-slate-700 dark:text-slate-300 font-medium' 
                            : 'text-slate-500 dark:text-slate-400'
                    }`}>
                        {notification.desc}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                {notification.link ? (
                    <Link
                        to={normalizeNotifLink(notification.link, 'driver')}
                        onClick={() => {
                            if (notification.unread) onMarkRead(notification.id);
                        }}
                        className="font-bold text-[#FF4A1F] hover:text-[#E03E15] flex items-center gap-1 transition-colors"
                    >
                        <span>View Details</span>
                        <ExternalLink size={11} />
                    </Link>
                ) : (
                    <span />
                )}

                {notification.unread ? (
                    <button
                        type="button"
                        onClick={() => onMarkRead(notification.id)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                        <Check size={12} className="text-emerald-500" />
                        <span>Mark as read</span>
                    </button>
                ) : (
                    <span className="text-[10px] text-slate-400 font-medium">Read</span>
                )}
            </div>
        </div>
    );
};
