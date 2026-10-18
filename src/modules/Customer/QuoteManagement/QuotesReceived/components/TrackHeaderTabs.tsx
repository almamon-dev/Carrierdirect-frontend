import React from 'react';

export interface TrackHeaderTabsProps {
    activeTab: 'all' | 'new' | 'negotiation' | 'accepted' | 'rejected';
    onTabChange: (tab: 'all' | 'new' | 'negotiation' | 'accepted' | 'rejected') => void;
    tabCounts: {
        all: number;
        new: number;
        negotiation: number;
        accepted: number;
        rejected: number;
    };
}

export const TrackHeaderTabs: React.FC<TrackHeaderTabsProps> = ({
    activeTab,
    onTabChange,
    tabCounts,
}) => {
    const tabs: Array<{ id: 'all' | 'new' | 'negotiation' | 'accepted' | 'rejected'; label: string; count: number }> = [
        { id: 'all', label: 'All Offers', count: tabCounts.all },
        { id: 'new', label: 'Pending Review', count: tabCounts.new },
        { id: 'negotiation', label: 'Negotiating', count: tabCounts.negotiation },
        { id: 'accepted', label: 'Accepted', count: tabCounts.accepted },
        { id: 'rejected', label: 'Declined', count: tabCounts.rejected },
    ];

    return (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b transition-colors whitespace-nowrap cursor-pointer ${
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
