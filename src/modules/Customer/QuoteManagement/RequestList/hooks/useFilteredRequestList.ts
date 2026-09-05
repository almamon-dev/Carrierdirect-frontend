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
        return requestData.filter((r) => {
            if (activeFilterTab === 'Active') {
                if (!(r.status === 'Active' || r.status === 'Bidding Active' || r.status === 'active')) return false;
            } else if (activeFilterTab === 'Waiting') {
                if (!((r.quotesReceived || r.bidsCount || r.bids_count || 0) === 0 || r.status === 'Draft' || r.status === 'pending')) return false;
            } else if (activeFilterTab === 'Review') {
                if (!((r.quotesReceived || r.bidsCount || r.bids_count || 0) > 0 || r.status === 'Negotiating')) return false;
            } else if (activeFilterTab === 'Completed') {
                if (!(r.status === 'Completed' || r.status === 'Awarded' || r.status === 'completed')) return false;
            } else if (activeFilterTab === 'Expired') {
                if (!(r.status === 'Expired' || r.status === 'Cancelled' || r.status === 'rejected')) return false;
            }

            if (priorityFilter !== 'all' && String(r.priority).toLowerCase() !== priorityFilter.toLowerCase()) {
                return false;
            }

            if (statusFilter !== 'all') {
                const normStatus = String(r.status || '').toLowerCase();
                if (!normStatus.includes(statusFilter.toLowerCase())) return false;
            }

            if (quotesFilter !== 'all') {
                const count = r.quotesReceived || r.bidsCount || r.bids_count || 0;
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
