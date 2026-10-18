import React, { useMemo } from 'react';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { SupplierTabStats } from '../hooks/useSupplierQuoteRequests';

export type RequestFilterTab = 'new' | 'viewed' | 'expired' | 'submitted' | 'negotiation' | 'accepted' | 'rejected' | 'all';

interface QuoteRequestsFilterTabsProps {
    requests: QuoteRequest[];
    activeTab: RequestFilterTab;
    onSelectTab: (tab: RequestFilterTab) => void;
    stats?: SupplierTabStats;
}

export const QuoteRequestsFilterTabs: React.FC<QuoteRequestsFilterTabsProps> = ({
    requests,
    activeTab,
    onSelectTab,
    stats,
}) => {
    // Exact spec: New | Viewed | Expired
    const tabs = useMemo(() => {
        let newCount = 0;
        let viewedCount = 0;
        let expiredCount = 0;

        (requests || []).forEach((r: any) => {
            const isExp = Boolean(r.isExpired || r.is_expired || (r.status || '').toLowerCase() === 'expired');
            const hasViewed = Boolean(r.hasViewed || r.isViewed || r.supplierStatus === 'Viewed' || (r.status || '').toLowerCase() === 'viewed');
            const hasQuoted = Boolean(r.hasQuoted || r.isQuoted || (r.status || '').toLowerCase() === 'quoted');

            if (isExp) {
                expiredCount++;
            } else if (hasViewed && !hasQuoted) {
                viewedCount++;
            } else if (!hasQuoted) {
                newCount++;
            }
        });

        return [
            { id: 'new' as RequestFilterTab, label: 'New', count: newCount },
            { id: 'viewed' as RequestFilterTab, label: 'Viewed', count: viewedCount },
            { id: 'expired' as RequestFilterTab, label: 'Expired', count: expiredCount },
        ];
    }, [requests, stats]);

    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
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

export default QuoteRequestsFilterTabs;
