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
            const statusStr = String(r.status || '').toLowerCase();
            const rawStatusStr = String(r.rawStatus || r.raw_status || '').toLowerCase();

            if (activeFilterTab === 'In Progress' || activeFilterTab === 'Active') {
                if (!(statusStr === 'in progress' || rawStatusStr === 'in_progress' || statusStr === 'active' || rawStatusStr === 'active' || statusStr === 'bidding active')) return false;
            } else if (activeFilterTab === 'Processing' || activeFilterTab === 'Pending' || activeFilterTab === 'Waiting') {
                if (!(statusStr === 'processing' || rawStatusStr === 'pending' || statusStr === 'pending' || statusStr === 'draft' || ((r.quotesReceived || r.bidsCount || 0) === 0 && statusStr !== 'completed' && statusStr !== 'accepted'))) return false;
            } else if (activeFilterTab === 'Completed' || activeFilterTab === 'Accepted') {
                if (!(statusStr === 'completed' || rawStatusStr === 'completed' || statusStr === 'accepted' || statusStr === 'awarded' || r.hasAcceptedQuote)) return false;
            } else if (activeFilterTab === 'Cancelled' || activeFilterTab === 'Expired') {
                if (!(statusStr === 'cancelled' || rawStatusStr === 'cancelled' || statusStr === 'expired' || statusStr === 'rejected' || statusStr === 'closed')) return false;
            } else if (activeFilterTab === 'Review') {
                if (!(((r.quotesReceived || r.bidsCount || 0) > 0 || statusStr === 'negotiating') && statusStr !== 'completed' && statusStr !== 'accepted')) return false;
            }

            if (priorityFilter !== 'all' && String(r.priority).toLowerCase() !== priorityFilter.toLowerCase()) {
                return false;
            }

            if (statusFilter !== 'all') {
                const filterNorm = statusFilter.toLowerCase();
                const matchesStatus = statusStr.includes(filterNorm) || rawStatusStr.includes(filterNorm.replace(/s+/g, '_'));
                if (!matchesStatus) return false;
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
