import { useMemo } from 'react';
import { FilterTabId } from '../../CreateRequest/types';

interface UseFilteredRequestListParams {
    requestData: any[];
    activeFilterTab: FilterTabId;
    priorityFilter: string;
    statusFilter: string;
    quotesFilter: string;
    startDate: string;
    endDate: string;
}

export function useFilteredRequestList({
    requestData,
    activeFilterTab,
    priorityFilter,
    statusFilter,
    quotesFilter,
    startDate,
    endDate,
}: UseFilteredRequestListParams) {
    return useMemo(() => {
        return (requestData || []).filter((r) => {
            const statusStr = String(r.status || '').toLowerCase();
            const rawStatusStr = String(r.rawStatus || r.raw_status || '').toLowerCase();
            const isComp = Boolean(r.isCompleted || statusStr === 'completed' || rawStatusStr === 'completed');

            // Completed quote requests belong strictly in Quote History
            if (isComp) return false;

            const quotesCount = Number(r.quotesReceived || r.quotesCount || r.bidsCount || 0);
            const isExp = Boolean(r.isExpired || statusStr === 'expired' || statusStr === 'cancelled' || statusStr === 'closed');
            const isWon = Boolean(statusStr === 'won' || statusStr === 'accepted' || statusStr === 'booked' || r.hasAcceptedQuote);
            const isNeg = Boolean(statusStr === 'negotiation' || statusStr === 'negotiating' || statusStr === 'review' || r.isNegotiating);

            if (activeFilterTab === 'All') {
                // All non-completed requests
            } else if (activeFilterTab === 'Draft') {
                if (statusStr !== 'draft' && rawStatusStr !== 'draft') return false;
            } else if (activeFilterTab === 'Expired') {
                if (!isExp) return false;
            } else if ((activeFilterTab === 'Booked' || (activeFilterTab as string) === 'Won')) {
                if (!isWon || isExp) return false;
            } else if (activeFilterTab === 'Negotiation') {
                if (!isNeg || isExp || isWon) return false;
            } else if (activeFilterTab === 'Quotes Received') {
                if (quotesCount === 0 || isExp || isWon || isNeg || statusStr === 'draft') return false;
            } else if (activeFilterTab === 'Pending') {
                if (quotesCount > 0 || isExp || isWon || isNeg || statusStr === 'draft') return false;
            }

            if (priorityFilter !== 'all' && String(r.priority).toLowerCase() !== priorityFilter.toLowerCase()) {
                return false;
            }

            if (statusFilter !== 'all') {
                const filterNorm = statusFilter.toLowerCase();
                const matchesStatus = statusStr.includes(filterNorm) || rawStatusStr.includes(filterNorm.replace(/\s+/g, '_'));
                if (!matchesStatus) return false;
            }

            if (quotesFilter !== 'all') {
                const count = quotesCount;
                if (quotesFilter === 'none' && count > 0) return false;
                if (quotesFilter === 'has_quotes' && count === 0) return false;
                if (quotesFilter === 'multiple' && count < 2) return false;
            }

            if (startDate || endDate) {
                const rowDateStr = r.created_at || r.createdAt || r.date || r.pickup_date;
                if (rowDateStr) {
                    const rowDate = new Date(rowDateStr);
                    if (!isNaN(rowDate.getTime())) {
                        if (startDate) {
                            const start = new Date(startDate);
                            start.setHours(0, 0, 0, 0);
                            if (rowDate < start) return false;
                        }
                        if (endDate) {
                            const end = new Date(endDate);
                            end.setHours(23, 59, 59, 999);
                            if (rowDate > end) return false;
                        }
                    }
                }
            }

            return true;
        });
    }, [requestData, activeFilterTab, priorityFilter, statusFilter, quotesFilter, startDate, endDate]);
}
