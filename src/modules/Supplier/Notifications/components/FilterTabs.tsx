/**
 * FilterTabs Component
 * Category tab navigation with dynamic counts and underline active indicator.
 */

import React, { useMemo } from 'react';
import { HeaderNotification } from '@/hooks/useHeaderNotifications';

export type NotificationFilterTab = 'all' | 'unread' | 'quote' | 'order' | 'message' | 'finance' | 'system';

interface FilterTabsProps {
    notifications: HeaderNotification[];
    activeTab: NotificationFilterTab;
    onSelectTab: (tab: NotificationFilterTab) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
    notifications,
    activeTab,
    onSelectTab,
}) => {
    const tabs = useMemo(() => {
        const counts: Record<string, number> = {
            all: notifications.length,
            unread: notifications.filter(n => n.unread).length,
            quote: notifications.filter(n => n.type === 'quote').length,
            order: notifications.filter(n => n.type === 'order').length,
            message: notifications.filter(n => n.type === 'message').length,
            finance: notifications.filter(n => n.type === 'finance').length,
            system: notifications.filter(n => n.type === 'system').length,
        };

        return [
            { id: 'all' as NotificationFilterTab, label: 'All', count: counts.all },
            { id: 'unread' as NotificationFilterTab, label: 'Unread', count: counts.unread },
            { id: 'quote' as NotificationFilterTab, label: 'Quotes', count: counts.quote },
            { id: 'order' as NotificationFilterTab, label: 'Orders', count: counts.order },
            { id: 'message' as NotificationFilterTab, label: 'Messages', count: counts.message },
            { id: 'finance' as NotificationFilterTab, label: 'Finance', count: counts.finance },
            { id: 'system' as NotificationFilterTab, label: 'System', count: counts.system },
        ].filter(tab => tab.id === 'all' || tab.id === 'unread' || tab.count > 0);
    }, [notifications]);

    return (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                            isActive
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className={`text-[13.5px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[11.5px] font-medium px-2 py-0.5 rounded-full ${
                                isActive
                                    ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
