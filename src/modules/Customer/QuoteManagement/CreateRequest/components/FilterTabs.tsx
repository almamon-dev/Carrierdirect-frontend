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
    // Calculate counts for each status category
    const counts = useMemo(() => ({
        all: requestData.length,
        active: requestData.filter(r => r.status === 'Active' || r.status === 'Bidding Active' || r.status === 'active').length,
        waiting: requestData.filter(r => r.quotesReceived === 0 || r.status === 'Draft' || r.status === 'pending').length,
        review: requestData.filter(r => r.quotesReceived > 0 || r.status === 'Negotiating').length,
        accepted: requestData.filter(r => r.status === 'Accepted' || r.status === 'completed').length,
    }), [requestData]);

    const tabs: { id: FilterTabId; label: string; count: number }[] = [
        { id: 'All', label: 'All', count: counts.all },
        { id: 'Active', label: 'Active', count: counts.active },
        { id: 'Waiting', label: 'Waiting Quotes', count: counts.waiting },
        { id: 'Review', label: 'To Review', count: counts.review },
        { id: 'Accepted', label: 'Accepted', count: counts.accepted },
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
                        className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
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
