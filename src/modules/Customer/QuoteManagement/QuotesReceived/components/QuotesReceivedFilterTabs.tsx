import React, { useMemo } from 'react';

export type QuotesReceivedFilterTab = 'all' | 'new' | 'negotiation' | 'accepted' | 'rejected' | 'expired';

interface QuotesReceivedFilterTabsProps {
    quotes: any[];
    activeFilterTab: string;
    setActiveFilterTab: (tab: any) => void;
}

export function isQuoteCompleted(item: any): boolean {
    if (!item) return false;
    const s = (item.status_raw || item.statusRaw || item.status || '').toLowerCase().trim();
    const ost = (item.order_status || item.orderStatus || (item.order as any)?.status || '').toLowerCase().trim();
    const podStatus = (item.pod_status || item.podStatus || (item.order as any)?.pod_status || '').toLowerCase().trim();
    return s === 'completed' || ost === 'completed' || podStatus === 'confirmed' || podStatus === 'accepted';
}

export function isQuoteAccepted(item: any): boolean {
    if (isQuoteCompleted(item)) return false;
    const s = (item.status_raw || item.statusRaw || item.status || '').toLowerCase().trim();
    const rev = (item.revision_status || item.revisionStatus || '').toLowerCase().trim();
    return s === 'accepted' || s === 'booked' || s === 'won' || s === 'confirmed' || s === 'paid' || rev === 'accepted' || Boolean(item.is_paid || item.isPaid || item.has_order || item.hasOrder);
}

export function isQuoteExpired(item: any): boolean {
    if (isQuoteCompleted(item)) return false;
    const s = (item.status_raw || item.statusRaw || item.status || '').toLowerCase().trim();
    return s === 'expired' || Boolean(item.is_expired || item.isExpired);
}

export function isQuoteRejected(item: any): boolean {
    if (isQuoteCompleted(item) || isQuoteExpired(item)) return false;
    const s = (item.status_raw || item.statusRaw || item.status || '').toLowerCase().trim();
    return s === 'rejected' || s === 'declined' || s === 'cancelled' || s === 'closed' || s === 'lost';
}

export function isQuoteNegotiation(item: any): boolean {
    if (isQuoteCompleted(item) || isQuoteAccepted(item) || isQuoteRejected(item) || isQuoteExpired(item)) return false;
    const s = (item.status_raw || item.statusRaw || item.status || '').toLowerCase().trim();
    const rev = (item.revision_status || item.revisionStatus || '').toLowerCase().trim();
    const hasNeg = Boolean(item.is_negotiating || item.isNegotiating || item.has_negotiation_messages || item.hasNegotiationMessages);
    return s.includes('counter') || s.includes('negotiat') || rev === 'pending' || hasNeg || (item.unreadCount !== undefined && item.unreadCount > 0);
}

export function isQuoteNew(item: any): boolean {
    if (isQuoteCompleted(item) || isQuoteAccepted(item) || isQuoteRejected(item) || isQuoteExpired(item) || isQuoteNegotiation(item)) return false;
    return true;
}

export const QuotesReceivedFilterTabs: React.FC<QuotesReceivedFilterTabsProps> = ({
    quotes,
    activeFilterTab,
    setActiveFilterTab,
}) => {
    // Exact spec: New | Negotiation | Accepted | Rejected (Completed quotes strictly reside in Quote History)
    const tabs = useMemo(() => {
        let allCount = 0;
        let newCount = 0;
        let negotiationCount = 0;
        let acceptedCount = 0;
        let rejectedCount = 0;
        let expiredCount = 0;

        (quotes || []).forEach((n) => {
            if (isQuoteCompleted(n)) return;
            allCount++;
            if (isQuoteAccepted(n)) acceptedCount++;
            else if (isQuoteExpired(n)) expiredCount++;
            else if (isQuoteRejected(n)) rejectedCount++;
            else if (isQuoteNegotiation(n)) negotiationCount++;
            else newCount++;
        });

        return [
            { id: 'all' as QuotesReceivedFilterTab, label: 'All', count: allCount },
            { id: 'new' as QuotesReceivedFilterTab, label: 'New', count: newCount },
            { id: 'negotiation' as QuotesReceivedFilterTab, label: 'Negotiation', count: negotiationCount },
            { id: 'accepted' as QuotesReceivedFilterTab, label: 'Accepted', count: acceptedCount },
            { id: 'rejected' as QuotesReceivedFilterTab, label: 'Rejected', count: rejectedCount },
            { id: 'expired' as QuotesReceivedFilterTab, label: 'Expired', count: expiredCount },
        ];
    }, [quotes]);

    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeFilterTab.toLowerCase() === tab.id.toLowerCase();
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
