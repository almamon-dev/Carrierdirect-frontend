/**
 * Hook for filtering Customer Processing Quote Requests by Tab, Status, Priority, Vehicle, and Date.
 */

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
        return (requests || []).filter((r) => {
            if (!r) return false;
            const s = String(r.rawStatus || r.status || '').toLowerCase();

            // Tab filtering
            if (activeFilterTab === 'in_progress') {
                const isProg = s === 'in_progress' || s === 'in progress' || s === 'active' || s === 'bidding';
                const isComp = s === 'completed' || s === 'accepted' || s === 'won' || Boolean(r.hasAcceptedQuote);
                const isCanc = s === 'cancelled' || s === 'expired' || s === 'closed' || s === 'rejected';
                if (!isProg || isComp || isCanc) return false;
            } else if (activeFilterTab === 'pending' || activeFilterTab === 'processing') {
                const isPend = s === 'pending' || s === 'processing' || s === 'draft';
                const isComp = s === 'completed' || s === 'accepted' || s === 'won' || Boolean(r.hasAcceptedQuote);
                const isCanc = s === 'cancelled' || s === 'expired' || s === 'closed' || s === 'rejected';
                if (!isPend || isComp || isCanc) return false;
            } else if (activeFilterTab === 'completed') {
                const isComp = s === 'completed' || s === 'accepted' || s === 'won' || Boolean(r.hasAcceptedQuote);
                if (!isComp) return false;
            } else if (activeFilterTab === 'cancelled') {
                const isCanc = s === 'cancelled' || s === 'expired' || s === 'closed' || s === 'rejected';
                if (!isCanc) return false;
            }

            // Dropdown Status Filter
            if (statusFilter !== 'all') {
                const filterVal = statusFilter.toLowerCase();
                if (filterVal === 'in_progress') {
                    if (s !== 'in_progress' && s !== 'in progress' && s !== 'active') return false;
                } else if (filterVal === 'pending' || filterVal === 'processing') {
                    if (s !== 'pending' && s !== 'processing' && s !== 'draft') return false;
                } else if (filterVal === 'completed') {
                    if (s !== 'completed' && s !== 'accepted' && !r.hasAcceptedQuote) return false;
                } else if (filterVal === 'cancelled') {
                    if (s !== 'cancelled' && s !== 'expired' && s !== 'closed' && s !== 'rejected') return false;
                } else if (!s.includes(filterVal)) {
                    return false;
                }
            }

            // Vehicle filter
            if (vehicleFilter !== 'all') {
                const vehicle = String(r.vehicleType || r.vehicle || '').toLowerCase().replace(/[\s_-]+/g, '');
                const targetVehicle = vehicleFilter.toLowerCase().replace(/[\s_-]+/g, '');
                if (!vehicle.includes(targetVehicle)) return false;
            }

            // Priority filter
            if (priorityFilter !== 'all') {
                const prio = String(r.priority || '').toLowerCase();
                if (prio !== priorityFilter.toLowerCase()) return false;
            }

            // Date filtering
            if (startDate || endDate) {
                const rowDateStr = r.createdAt || r.pickupDate || (r.rawData && r.rawData.created_at);
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
