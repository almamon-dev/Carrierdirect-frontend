import React, { useMemo } from 'react';
import { getQuoteStatusInfo } from './QuotesReceivedCells';

interface QuotesReceivedFilterTabsProps {
    quotes: any[];
    activeFilterTab: string;
    setActiveFilterTab: (tab: string) => void;
}

export const QuotesReceivedFilterTabs: React.FC<QuotesReceivedFilterTabsProps> = ({
    quotes,
    activeFilterTab,
    setActiveFilterTab,
}) => {
    const counts = useMemo(() => {
        let pendingCount = 0;
        let negotiatingCount = 0;
        let acceptedCount = 0;
        let rejectedCount = 0;

        quotes.forEach((q) => {
            const { statusKey } = getQuoteStatusInfo(q);
            if (statusKey === 'pending') pendingCount++;
            else if (statusKey === 'negotiating') negotiatingCount++;
            else if (statusKey === 'accepted') acceptedCount++;
            else if (statusKey === 'rejected' || statusKey === 'expired' || statusKey === 'cancelled') rejectedCount++;
        });

        return {
            all: quotes.length,
            pending: pendingCount,
            negotiating: negotiatingCount,
            accepted: acceptedCount,
            rejected: rejectedCount,
        };
    }, [quotes]);

    const tabs = [
        { id: 'all', label: 'All Quotes', count: counts.all },
        { id: 'pending', label: 'Pending Review', count: counts.pending },
        { id: 'negotiating', label: 'Negotiating', count: counts.negotiating },
        { id: 'accepted', label: 'Accepted', count: counts.accepted },
        { id: 'rejected', label: 'Rejected / Expired', count: counts.rejected },
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
