/**
 * FilterTabs Component
 * Dynamic tab navigation with automatic status extraction and dynamic count calculation.
 */

import React, { useMemo } from 'react';
import { LostQuoteItem, LostFilterTab } from '../types';

interface FilterTabsProps {
    quotes: LostQuoteItem[];
    activeTab: LostFilterTab;
    onSelectTab: (tab: LostFilterTab) => void;
}

const DEFAULT_STATUSES: string[] = ['Expired', 'Declined', 'Lost'];

export const FilterTabs: React.FC<FilterTabsProps> = ({
    quotes,
    activeTab,
    onSelectTab,
}) => {
    // Dynamically calculate tabs and counts from incoming quotes
    const tabs = useMemo(() => {
        const countsByStatus: Record<string, number> = {};

        // Aggregate counts by status
        quotes.forEach((q) => {
            if (q.status) {
                const normalized = q.status.trim();
                countsByStatus[normalized] = (countsByStatus[normalized] || 0) + 1;
            }
        });

        // Use dynamically extracted statuses, or fallback to defaults if list is empty
        const foundStatuses = Object.keys(countsByStatus);
        const statusList = foundStatuses.length > 0 
            ? Array.from(new Set([...foundStatuses]))
            : DEFAULT_STATUSES;

        return [
            { id: 'All', label: 'All', count: quotes.length },
            ...statusList.map((status) => ({
                id: status,
                label: status,
                count: countsByStatus[status] || 0,
            })),
        ];
    }, [quotes]);

    return (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab.toLowerCase() === tab.id.toLowerCase();
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
                        <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${
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
