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
            const statusStr = String(r.status || '').toLowerCase().trim();
            const rawStatusStr = String(r.rawStatus || r.raw_status || '').toLowerCase().trim();
            const isComp = Boolean(
                r.isCompleted ||
                statusStr === 'completed' ||
                rawStatusStr === 'completed' ||
                String(r.order_status || '').toLowerCase() === 'completed'
            );
            const isBooked = !isComp && Boolean(
                statusStr === 'booked' ||
                statusStr === 'confirmed' ||
                r.is_booked ||
                r.has_order ||
                (statusStr === 'accepted' && (r.is_paid || r.has_order))
            );
            const isDraft = statusStr === 'draft' || rawStatusStr === 'draft';
            const quotesCount = Number(r.quotesReceived || r.quotesCount || r.bidsCount || 0);

            // Tab filtering
            if (activeFilterTab === 'Drafts' || (activeFilterTab as string) === 'Draft') {
                if (!isDraft) return false;
            } else if (activeFilterTab === 'In Progress' || (activeFilterTab as string) === 'Active') {
                if (isDraft || isBooked || isComp) return false;
            } else if (activeFilterTab === 'Booked') {
                if (!isBooked) return false;
            } else if (activeFilterTab === 'Completed') {
                if (!isComp) return false;
            }
            // 'All' includes all requests

            // Advanced Filter 1: Priority
            if (priorityFilter !== 'all' && String(r.priority).toLowerCase() !== priorityFilter.toLowerCase()) {
                return false;
            }

            // Advanced Filter 2: Status
            if (statusFilter !== 'all') {
                const filterNorm = statusFilter.toLowerCase();
                if (filterNorm === 'draft' && !isDraft) return false;
                if ((filterNorm === 'in_progress' || filterNorm === 'in progress') && (isDraft || isBooked || isComp)) return false;
                if (filterNorm === 'booked' && !isBooked) return false;
                if (filterNorm === 'completed' && !isComp) return false;
                if (filterNorm === 'expired' && !(statusStr === 'expired' || rawStatusStr === 'expired')) return false;
                if (filterNorm === 'cancelled' && !(statusStr === 'cancelled' || rawStatusStr === 'cancelled')) return false;
            }

            // Advanced Filter 3: Quotes count
            if (quotesFilter !== 'all') {
                if (quotesFilter === 'has_quotes' && quotesCount === 0) return false;
                if (quotesFilter === 'no_quotes' && quotesCount > 0) return false;
            }

            // Advanced Filter 4: Pickup Date / Schedule Date Range
            if (startDate || endDate) {
                const rowDateStr = r.pickup_date || r.pickupDate || r.created_at || r.createdAt || r.date;
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
