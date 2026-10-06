import { useMemo } from 'react';
import {
    isQuoteActive,
    isQuoteCounter,
    isQuoteAccepted,
    isQuoteHistory,
} from '../components/QuotesReceivedFilterTabs';

interface UseFilteredQuotesReceivedParams {
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
}: UseFilteredQuotesReceivedParams) {
    return useMemo(() => {
        return quotes.filter((row) => {
            const s = (row.status_raw || row.statusRaw || row.status || '').toLowerCase();

            if (activeFilterTab === 'active') {
                if (!isQuoteActive(row)) return false;
            } else if (activeFilterTab === 'counter') {
                if (!isQuoteCounter(row)) return false;
            } else if (activeFilterTab === 'accepted') {
                if (!isQuoteAccepted(row)) return false;
            } else if (activeFilterTab === 'history' || activeFilterTab === 'closed') {
                if (!isQuoteHistory(row)) return false;
            }

            if (statusFilter !== 'all') {
                if (!s.includes(statusFilter.toLowerCase())) return false;
            }

            if (vehicleFilter !== 'all') {
                const rowVehicle = (row.vehicleType || row.vehicle || row.vehicle_type || row.truck_type || row.quote_request?.vehicle_type || '').toLowerCase();
                if (!rowVehicle.includes(vehicleFilter.toLowerCase())) return false;
            }

            if (ratingFilter !== 'all') {
                const numRating = Number(row.rating || row.supplier?.rating || 0);
                const minRating = parseFloat(ratingFilter);
                if (numRating < minRating) return false;
            }

            if (startDate || endDate) {
                const rowDateStr = row.created_at || row.request_date || row.date || row.valid_until || row.pickup_date;
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
    }, [quotes, activeFilterTab, statusFilter, vehicleFilter, ratingFilter, startDate, endDate]);
}
