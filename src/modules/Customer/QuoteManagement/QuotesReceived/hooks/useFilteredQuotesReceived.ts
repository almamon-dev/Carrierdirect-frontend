import { useMemo } from 'react';
import {
    isQuoteAccepted,
    isQuoteRejected,
    isQuoteExpired,
    isQuoteNegotiation,
    isQuoteNew,
    isQuoteCompleted,
} from '../components/QuotesReceivedFilterTabs';

interface UseFilteredQuotesReceivedProps {
    quotes: any[];
    activeFilterTab: string;
    statusFilter: string;
    vehicleFilter: string;
    ratingFilter: string;
    startDate: string;
    endDate: string;
}

export function useFilteredQuotesReceived({
    quotes,
    activeFilterTab,
    statusFilter,
    vehicleFilter,
    ratingFilter,
    startDate,
    endDate,
}: UseFilteredQuotesReceivedProps) {
    return useMemo(() => {
        return (quotes || []).filter((item) => {
            if (!item) return false;

            // Completed quotes belong strictly in Quote History
            if (isQuoteCompleted(item)) return false;

            const tab = activeFilterTab.toLowerCase();
            if (tab === 'all') {
                // Return all non-completed
            } else if (tab === 'new' && !isQuoteNew(item)) return false;
            else if (tab === 'negotiation' && !isQuoteNegotiation(item)) return false;
            else if (tab === 'accepted' && !isQuoteAccepted(item)) return false;
            else if (tab === 'rejected' && !isQuoteRejected(item)) return false;
            else if (tab === 'expired' && !isQuoteExpired(item)) return false;

            if (statusFilter !== 'all') {
                const normStatus = (item.status || item.status_raw || '').toLowerCase();
                if (!normStatus.includes(statusFilter.toLowerCase())) return false;
            }

            if (vehicleFilter !== 'all') {
                const normVehicle = (item.vehicleType || item.vehicle_type || '').toLowerCase();
                if (!normVehicle.includes(vehicleFilter.toLowerCase())) return false;
            }

            if (ratingFilter !== 'all') {
                const r = parseFloat(item.supplierRating || item.supplier_rating || item.rating || 0);
                const minR = parseFloat(ratingFilter);
                if (!isNaN(minR) && r < minR) return false;
            }

            if (startDate || endDate) {
                const dateVal = item.created_at || item.createdAt || item.date;
                if (dateVal) {
                    const time = new Date(dateVal).getTime();
                    if (!isNaN(time)) {
                        if (startDate && time < new Date(startDate).setHours(0, 0, 0, 0)) return false;
                        if (endDate && time > new Date(endDate).setHours(23, 59, 59, 999)) return false;
                    }
                }
            }

            return true;
        });
    }, [quotes, activeFilterTab, statusFilter, vehicleFilter, ratingFilter, startDate, endDate]);
}
