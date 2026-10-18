import { useState, useMemo } from 'react';
import { MyQuoteItem } from './useSupplierMyQuotes';

export type MyQuoteFilterTab = 'all' | 'submitted' | 'negotiation' | 'accepted' | 'rejected' | 'expired';

export function useMyQuoteFilter(quotes: MyQuoteItem[] = []) {
    const [activeTab, setActiveTab] = useState<MyQuoteFilterTab>('all');

    const tabs = useMemo(() => {
        let submittedCount = 0;
        let negotiationCount = 0;
        let acceptedCount = 0;
        let rejectedCount = 0;
        let expiredCount = 0;

        quotes.forEach((r) => {
            const st = (r.supplierStatus || r.status || '').toLowerCase();
            const isExp = Boolean(r.isExpired || st === 'expired');

            if (isExp) {
                expiredCount++;
            } else if (st === 'accepted' || st === 'won' || st === 'booked' || st === 'completed') {
                acceptedCount++;
            } else if (st === 'rejected' || st === 'lost' || st === 'declined' || st === 'cancelled') {
                rejectedCount++;
            } else if (st === 'negotiation' || st === 'negotiating') {
                negotiationCount++;
            } else {
                submittedCount++;
            }
        });

        return [
            { id: 'all' as MyQuoteFilterTab, label: 'All Quotes', count: quotes.length },
            { id: 'submitted' as MyQuoteFilterTab, label: 'Submitted', count: submittedCount },
            { id: 'negotiation' as MyQuoteFilterTab, label: 'Negotiation', count: negotiationCount },
            { id: 'accepted' as MyQuoteFilterTab, label: 'Accepted', count: acceptedCount },
            { id: 'rejected' as MyQuoteFilterTab, label: 'Rejected', count: rejectedCount },
            { id: 'expired' as MyQuoteFilterTab, label: 'Expired', count: expiredCount },
        ];
    }, [quotes]);

    const filteredData = useMemo(() => {
        if (activeTab === 'all') return quotes;
        return quotes.filter((r) => {
            const st = (r.supplierStatus || r.status || '').toLowerCase();
            const isExp = Boolean(r.isExpired || st === 'expired');

            if (activeTab === 'expired') {
                return isExp;
            }
            if (activeTab === 'submitted') {
                return !isExp && (st === 'submitted' || st === 'pending' || st === 'quoted');
            }
            if (activeTab === 'negotiation') {
                return !isExp && (st === 'negotiation' || st === 'negotiating');
            }
            if (activeTab === 'accepted') {
                return !isExp && (st === 'accepted' || st === 'won' || st === 'booked' || st === 'completed');
            }
            if (activeTab === 'rejected') {
                return !isExp && (st === 'rejected' || st === 'lost' || st === 'declined' || st === 'cancelled');
            }
            return true;
        });
    }, [quotes, activeTab]);

    return {
        activeTab,
        setActiveTab,
        tabs,
        filteredData,
    };
}
