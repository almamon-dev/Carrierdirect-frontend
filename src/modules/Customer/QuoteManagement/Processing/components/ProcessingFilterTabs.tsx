/**
 * Customer Processing Filter Tabs Component
 * Dynamic tabs with live counts for All, In Progress, Processing, Completed, Cancelled requests.
 */

import React, { useMemo } from 'react';

export type ProcessingFilterTabId = 'all' | 'in_progress' | 'pending' | 'completed' | 'cancelled';

interface ProcessingFilterTabsProps {
    requests: any[];
    activeFilterTab: string;
    setActiveFilterTab: (tab: string) => void;
}

export const ProcessingFilterTabs: React.FC<ProcessingFilterTabsProps> = ({
    requests,
    activeFilterTab,
    setActiveFilterTab,
}) => {
    const counts = useMemo(() => {
        let inProgress = 0;
        let processing = 0;
        let completed = 0;
        let cancelled = 0;

        (requests || []).forEach((r) => {
            const s = String(r.rawStatus || r.status || '').toLowerCase();
            if (s === 'completed' || s === 'accepted' || s === 'won' || r.hasAcceptedQuote) {
                completed++;
            } else if (s === 'cancelled' || s === 'expired' || s === 'closed' || s === 'rejected') {
                cancelled++;
            } else if (s === 'pending' || s === 'processing' || s === 'draft') {
                processing++;
            } else {
                inProgress++;
            }
        });

        return {
            all: requests.length,
            inProgress,
            processing,
            completed,
            cancelled,
        };
    }, [requests]);

    const tabs = [
        { id: 'all', label: 'All Requests', count: counts.all },
        { id: 'in_progress', label: 'In Progress', count: counts.inProgress },
        { id: 'pending', label: 'Processing', count: counts.processing },
        { id: 'completed', label: 'Completed', count: counts.completed },
        { id: 'cancelled', label: 'Cancelled', count: counts.cancelled },
    ];

    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeFilterTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveFilterTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b transition-colors whitespace-nowrap cursor-pointer px-1 ${
                            isActive
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
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
