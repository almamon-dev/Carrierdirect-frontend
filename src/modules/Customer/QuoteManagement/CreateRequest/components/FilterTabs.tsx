/**
 * Customer Quote Requests Filter Tabs Component
 * Renders tab navigation with dynamic counts for Active, Waiting, Review, and Accepted requests.
 */

import React, { useMemo } from 'react';
import { CustomerQuoteRequestItem, FilterTabId } from '../types';

interface FilterTabsProps {
    requestData: CustomerQuoteRequestItem[];
    activeTab: FilterTabId;
    onSelectTab: (tabId: FilterTabId) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({
    requestData,
    activeTab,
    onSelectTab,
}) => {
    // Calculate counts for canonical status categories
    const counts = useMemo(() => ({
        all: requestData.length,
        inProgress: requestData.filter(r => r.status === 'In Progress' || r.rawStatus === 'in_progress' || r.status === 'Active' || r.status === 'active').length,
        processing: requestData.filter(r => r.status === 'Processing' || r.rawStatus === 'pending' || r.status === 'Draft' || r.status === 'pending' || (r.quotesReceived === 0 && r.status !== 'Completed' && r.status !== 'Accepted')).length,
        completed: requestData.filter(r => r.status === 'Completed' || r.rawStatus === 'completed' || r.status === 'Accepted' || r.hasAcceptedQuote).length,
        cancelled: requestData.filter(r => r.status === 'Cancelled' || r.rawStatus === 'cancelled' || r.status === 'Expired' || r.status === 'rejected').length,
    }), [requestData]);

    const tabs: { id: FilterTabId; label: string; count: number }[] = [
        { id: 'All', label: 'All', count: counts.all },
        { id: 'In Progress', label: 'In Progress', count: counts.inProgress },
        { id: 'Processing', label: 'Processing', count: counts.processing },
        { id: 'Completed', label: 'Completed', count: counts.completed },
        { id: 'Cancelled', label: 'Cancelled', count: counts.cancelled },
    ];

    return (
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button 
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b transition-colors whitespace-nowrap cursor-pointer ${
                            isActive 
                                ? 'border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]' 
                                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                            {tab.label}
                        </span>
                        <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${
                            isActive 
                                ? 'bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};
