import React, { useMemo } from 'react';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { SupplierTabStats } from '../hooks/useSupplierQuoteRequests';
import { isRequestToday, isRequestUpcoming, isRequestUrgent } from '../utils/requestDateFilters';

export { isRequestToday, isRequestExpired, isRequestUpcoming, isRequestUrgent } from '../utils/requestDateFilters';

export type RequestFilterTab = 'all' | 'active' | 'new' | 'quoted' | 'today' | 'upcoming' | 'urgent';

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
    const tabs = useMemo(() => {
        let newCount = 0;
        let quotedCount = 0;
        let todayCount = 0;
        let upcomingCount = 0;
        let urgentCount = 0;

        requests.forEach((r) => {
            const isQ = Boolean(r.status === 'Quoted' || r.isQuoted || r.hasQuoted);
            if (isQ) {
                quotedCount++;
            } else {
                newCount++;
            }
            if (isRequestToday(r)) todayCount++;
            if (isRequestUpcoming(r)) upcomingCount++;
            if (isRequestUrgent(r)) urgentCount++;
        });

        return [
            { id: 'all' as RequestFilterTab, label: 'Active', count: stats?.active ?? stats?.all ?? stats?.total ?? requests.length },
            { id: 'new' as RequestFilterTab, label: 'New', count: stats?.new ?? newCount },
            { id: 'quoted' as RequestFilterTab, label: 'Quoted', count: stats?.quoted ?? quotedCount },
            { id: 'today' as RequestFilterTab, label: 'Today', count: stats?.today ?? todayCount },
            { id: 'upcoming' as RequestFilterTab, label: 'Upcoming', count: stats?.upcoming ?? upcomingCount },
            { id: 'urgent' as RequestFilterTab, label: 'Urgent', count: stats?.urgent ?? urgentCount },
        ];
    }, [requests, stats]);

    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id || (tab.id === 'all' && activeTab === 'active');
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
