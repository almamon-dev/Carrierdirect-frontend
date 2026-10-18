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
    // Exact spec: Pending | Quotes Received | Negotiation | Won | Expired
    const counts = useMemo(() => {
        let all = 0;
        let draft = 0;
        let pending = 0;
        let quotesReceived = 0;
        let negotiation = 0;
        let booked = 0;
        let expired = 0;

        (requestData || []).forEach((r: any) => {
            const s = (r.status || r.rawStatus || '').toLowerCase();
            const isComp = Boolean(r.isCompleted || s === 'completed' || (r.raw_status || '').toLowerCase() === 'completed');
            if (isComp) return;

            all++;
            const quotesCount = Number(r.quotesReceived || r.quotesCount || r.bidsCount || 0);
            const isExp = Boolean(r.isExpired || s === 'expired' || s === 'cancelled' || s === 'closed');

            if (s === 'draft') {
                draft++;
            } else if (isExp) {
                expired++;
            } else if (s === 'won' || s === 'accepted' || s === 'booked' || r.hasAcceptedQuote) {
                booked++;
            } else if (s === 'negotiation' || s === 'negotiating' || s === 'review' || r.isNegotiating) {
                negotiation++;
            } else if (quotesCount > 0) {
                quotesReceived++;
            } else {
                pending++;
            }
        });

        return {
            all,
            draft,
            pending,
            quotesReceived,
            negotiation,
            booked,
            expired,
        };
    }, [requestData]);

    const tabs: { id: FilterTabId; label: string; count: number }[] = [
        { id: 'All', label: 'All', count: counts.all },
        { id: 'Draft', label: 'Draft', count: counts.draft },
        { id: 'Pending', label: 'Pending', count: counts.pending },
        { id: 'Quotes Received', label: 'Quotes Received', count: counts.quotesReceived },
        { id: 'Negotiation', label: 'Negotiation', count: counts.negotiation },
        { id: 'Booked', label: 'Booked', count: counts.booked },
        { id: 'Expired', label: 'Expired', count: counts.expired },
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
