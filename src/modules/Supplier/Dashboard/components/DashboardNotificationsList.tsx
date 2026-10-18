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
        <div className="bg-white dark:bg-[#1e2329] p-2.5 sm:p-3 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1.5 -mx-2.5 px-2.5">
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                    <h3 className="text-xs sm:text-[12.5px] font-bold text-slate-800 dark:text-slate-200">
                        Notifications
                    </h3>
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/supplier/notifications')}
                    className="text-[11px] font-bold text-brand hover:underline focus:outline-none transition-colors cursor-pointer"
                >
                    See All
                </button>
            </div>
            <div className="flex flex-col text-xs text-slate-500 dark:text-slate-400 justify-start">
                {isLoading ? (
                    <div className="space-y-2 py-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800 last:border-0">
                                <div className="flex items-center gap-2 flex-1">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700/60 shrink-0 animate-pulse" />
                                    <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                                </div>
                                <div className="h-2.5 w-8 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="py-4 flex flex-col items-center justify-center text-center">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-1">
                            <BellOff size={14} />
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
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
                                className="flex items-center justify-between gap-2 py-1.5 border-b border-dashed border-slate-200 dark:border-slate-800/80 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 -mx-1 px-1 rounded transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <div className={`w-5.5 h-5.5 rounded-full ${notification.bg} dark:bg-slate-800 flex items-center justify-center shrink-0`}>
                                        <Icon size={11} className={notification.color} />
                                    </div>
                                    <span className="truncate text-slate-700 dark:text-slate-300 text-[11px]">
                                        {notification.text}
                                    </span>
                                </div>
                                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 shrink-0">
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
