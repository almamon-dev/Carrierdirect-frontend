import React, { useMemo } from 'react';

export type QuotesReceivedFilterTab = 'all' | 'active' | 'counter' | 'accepted' | 'history';

interface QuotesReceivedFilterTabsProps {
    quotes: any[];
    activeFilterTab: string;
    setActiveFilterTab: (tab: any) => void;
}

export function isQuoteAccepted(item: any): boolean {
    const s = (item.status_raw || item.statusRaw || item.status || '').toLowerCase().trim();
    const rev = (item.revision_status || item.revisionStatus || '').toLowerCase().trim();
    return s === 'accepted' || s === 'booked' || s === 'completed' || s === 'won' || s === 'confirmed' || s === 'paid' || rev === 'accepted' || Boolean(item.is_paid || item.isPaid || item.has_order || item.hasOrder);
}

export function isQuoteHistory(item: any): boolean {
    const s = (item.status_raw || item.statusRaw || item.status || '').toLowerCase().trim();
    const rev = (item.revision_status || item.revisionStatus || '').toLowerCase().trim();
    return s === 'rejected' || s === 'expired' || s === 'closed' || s === 'lost' || s === 'declined' || s === 'cancelled';
}

export function isQuoteCounter(item: any): boolean {
    if (isQuoteAccepted(item) || isQuoteHistory(item)) return false;
    const s = (item.status_raw || item.statusRaw || item.status || '').toLowerCase().trim();
    const rev = (item.revision_status || item.revisionStatus || '').toLowerCase().trim();
    return s.includes('counter') || rev === 'pending' || (item.unreadCount !== undefined && item.unreadCount > 0);
}

export function isQuoteActive(item: any): boolean {
    if (isQuoteAccepted(item) || isQuoteHistory(item)) return false;
    return true;
}

export const QuotesReceivedFilterTabs: React.FC<QuotesReceivedFilterTabsProps> = ({
    quotes,
    activeFilterTab,
    setActiveFilterTab,
}) => {
    const tabs = useMemo(() => {
        let activeCount = 0;
        let counterCount = 0;
        let acceptedCount = 0;
        let historyCount = 0;

        quotes.forEach((n) => {
            if (isQuoteActive(n)) activeCount++;
            if (isQuoteCounter(n)) counterCount++;
            if (isQuoteAccepted(n)) acceptedCount++;
            if (isQuoteHistory(n)) historyCount++;
        });

        return [
            { id: 'all' as QuotesReceivedFilterTab, label: 'All', count: quotes.length },
            { id: 'active' as QuotesReceivedFilterTab, label: 'Active', count: activeCount },
            { id: 'counter' as QuotesReceivedFilterTab, label: 'Counter Offers', count: counterCount },
            { id: 'accepted' as QuotesReceivedFilterTab, label: 'Accepted', count: acceptedCount },
            { id: 'history' as QuotesReceivedFilterTab, label: 'Closed / History', count: historyCount },
        ];
    }, [quotes]);

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
