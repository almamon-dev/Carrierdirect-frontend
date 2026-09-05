import React from 'react';

interface ProcessingFilterTabsProps {
    stats: {
        total: number;
        withQuotes: number;
        awaitingQuotes: number;
        highPriority: number;
    };
    activeFilterTab: string;
    setActiveFilterTab: (tab: string) => void;
}

export const ProcessingFilterTabs: React.FC<ProcessingFilterTabsProps> = ({
    stats,
    activeFilterTab,
    setActiveFilterTab,
}) => {
    const tabs = [
        { id: 'all', label: 'All Requests', count: stats.total },
        { id: 'has_bids', label: 'With Quotes', count: stats.withQuotes },
        { id: 'awaiting', label: 'Awaiting Bids', count: stats.awaitingQuotes },
        { id: 'high_priority', label: 'High Priority', count: stats.highPriority },
    ];

    return (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeFilterTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveFilterTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${
                            isActive
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]'
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
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
