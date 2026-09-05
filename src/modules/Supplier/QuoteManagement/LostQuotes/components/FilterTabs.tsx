/**
 * FilterTabs Component
 * Dedicated tab navigation for Expired Quotes: All and Today.
 */

import React, { useMemo } from 'react';
import { LostQuoteItem, LostFilterTab } from '../types';

interface FilterTabsProps {
    quotes: LostQuoteItem[];
    activeTab: LostFilterTab;
    onSelectTab: (tab: LostFilterTab) => void;
    stats?: { total?: number; all?: number; today?: number };
}

export function isLostItemToday(item: LostQuoteItem): boolean {
    if (item.isToday !== undefined) return item.isToday;
    const dStr = (item.pickupDateRaw || item.pickupDate || item.requestDate || '').toLowerCase();
    if (dStr.includes('today')) return true;

    try {
        const today = new Date();
        const todayIso = today.toISOString().split('T')[0];
        if (item.pickupDateRaw && item.pickupDateRaw.startsWith(todayIso)) return true;

        const itemDate = new Date(item.pickupDateRaw || item.pickupDate || item.requestDate);
        if (!isNaN(itemDate.getTime())) {
            return (
                itemDate.getFullYear() === today.getFullYear() &&
                itemDate.getMonth() === today.getMonth() &&
                itemDate.getDate() === today.getDate()
            );
        }
    } catch {}
    return false;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
    quotes,
    activeTab,
    onSelectTab,
    stats,
}) => {
    const tabs = useMemo(() => {
        if (stats && (stats.total !== undefined || stats.all !== undefined)) {
            return [
                { id: 'all' as LostFilterTab, label: 'All', count: stats.all ?? stats.total ?? quotes.length },
                { id: 'today' as LostFilterTab, label: 'Today', count: stats.today ?? 0 },
            ];
        }

        let todayCount = 0;
        quotes.forEach((q) => {
            if (isLostItemToday(q)) todayCount++;
        });

        return [
            { id: 'all' as LostFilterTab, label: 'All', count: quotes.length },
            { id: 'today' as LostFilterTab, label: 'Today', count: todayCount },
        ];
    }, [quotes, stats]);

    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab.toLowerCase() === tab.id.toLowerCase();
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${
                            isActive
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? 'font-bold text-[#ff4a1f]' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
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
