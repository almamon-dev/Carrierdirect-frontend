import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BellOff } from 'lucide-react';

export interface DashboardNotificationRow {
    icon: React.ElementType;
    text: string;
    bg: string;
    color: string;
    time: string;
}

interface DashboardNotificationsListProps {
    notifications: DashboardNotificationRow[];
    isLoading?: boolean;
}

export const DashboardNotificationsList: React.FC<DashboardNotificationsListProps> = ({
    notifications,
    isLoading = false,
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 -mx-4 px-4">
                <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                    Notifications
                </h3>
                <button
                    type="button"
                    onClick={() => navigate('/supplier/notifications')}
                    className="text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors cursor-pointer"
                >
                    See All
                </button>
            </div>
            <div className="flex flex-col text-[13px] text-slate-500 dark:text-slate-400 flex-1 justify-center min-h-[140px]">
                {isLoading ? (
                    <div className="space-y-3 py-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between gap-3 py-2 border-b border-dashed border-slate-200 dark:border-slate-800 last:border-0">
                                <div className="flex items-center gap-2.5 flex-1">
                                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700/60 shrink-0 animate-pulse" />
                                    <div className="h-3.5 w-3/4 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                </div>
                                <div className="h-3 w-10 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-2">
                            <BellOff size={18} />
                        </div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            No new notifications
                        </p>
                    </div>
                ) : (
                    notifications.slice(0, 4).map((notification, idx) => {
                        const Icon = notification.icon;
                        return (
                            <div
                                key={idx}
                                onClick={() => navigate('/supplier/notifications')}
                                className="flex items-center justify-between gap-3 py-2.5 border-b border-dashed border-slate-300 dark:border-slate-800 last:border-0 last:pb-0 first:pt-0 cursor-pointer"
                            >
                                <div className="flex items-center gap-2.5 truncate">
                                    <div className={`w-7 h-7 rounded-full ${notification.bg} dark:bg-slate-800 flex items-center justify-center shrink-0`}>
                                        <Icon size={13} className={notification.color} />
                                    </div>
                                    <span className="truncate text-slate-700 dark:text-slate-300">
                                        {notification.text}
                                    </span>
                                </div>
                                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
                                    {notification.time}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
