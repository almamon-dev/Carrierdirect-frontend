import { useMemo } from 'react';

interface UseFilteredProcessingRequestsParams {
    requests: any[];
    activeFilterTab: string;
    statusFilter: string;
    vehicleFilter: string;
    priorityFilter: string;
    startDate: string;
    endDate: string;
}

export function useFilteredProcessingRequests({
    requests,
    activeFilterTab,
    statusFilter,
    vehicleFilter,
    priorityFilter,
    startDate,
    endDate,
}: UseFilteredProcessingRequestsParams) {
    return useMemo(() => {
        return requests.filter((r) => {
            if (activeFilterTab === 'has_bids') {
                if (r.bidsCount === 0) return false;
            } else if (activeFilterTab === 'awaiting') {
                if (r.bidsCount > 0) return false;
            } else if (activeFilterTab === 'high_priority') {
                if (String(r.priority).toLowerCase() !== 'high') return false;
            }

            if (statusFilter !== 'all') {
                if (!r.rawStatus.includes(statusFilter.toLowerCase())) return false;
            }

            if (vehicleFilter !== 'all') {
                if (!r.vehicleType.toLowerCase().includes(vehicleFilter.toLowerCase())) return false;
            }

            if (priorityFilter !== 'all') {
                if (String(r.priority).toLowerCase() !== priorityFilter.toLowerCase()) return false;
            }

            if (startDate || endDate) {
                const rowDateStr = r.createdAt || r.pickupDate;
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
    }, [requests, activeFilterTab, statusFilter, vehicleFilter, priorityFilter, startDate, endDate]);
}
