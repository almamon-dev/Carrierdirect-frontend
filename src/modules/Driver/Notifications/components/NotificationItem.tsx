import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Truck, AlertTriangle, ShieldCheck, DollarSign, ArrowRight, Check } from 'lucide-react';
import { DriverNotification } from '../../types';

interface Props {
    notification: DriverNotification;
    onMarkRead: (id: string) => void;
}

export const NotificationItem: React.FC<Props> = ({ notification, onMarkRead }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'trip_assigned':
                return {
                    icon: Truck,
                    color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
                };
            case 'route_update':
                return {
                    icon: AlertTriangle,
                    color: 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
                };
            case 'payout':
                return {
                    icon: DollarSign,
                    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
                };
            case 'safety_alert':
            default:
                return {
                    icon: ShieldCheck,
                    color: 'bg-orange-100 text-[#FF4A1F] dark:bg-orange-950/40 dark:text-orange-400',
                };
        }
    };

    const { icon: Icon, color } = getIcon();

    return (
        <div
            className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                notification.isRead
                    ? 'bg-white dark:bg-[#12161c] border-slate-200/70 dark:border-slate-800/80 opacity-80'
                    : 'bg-orange-50/40 dark:bg-[#161b22] border-orange-200/70 dark:border-orange-900/40 shadow-xs'
            }`}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={20} />
            </div>

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {notification.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {notification.timestamp}
                    </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {notification.message}
                </p>

                <div className="flex items-center gap-3 pt-2">
                    {notification.actionUrl && (
                        <Link
                            to={notification.actionUrl}
                            className="text-xs font-bold text-[#FF4A1F] hover:underline flex items-center gap-1"
                        >
                            <span>View Details</span>
                            <ArrowRight size={13} />
                        </Link>
                    )}

                    {!notification.isRead && (
                        <button
                            onClick={() => onMarkRead(notification.id)}
                            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                        >
                            <Check size={12} />
                            <span>Mark as read</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
