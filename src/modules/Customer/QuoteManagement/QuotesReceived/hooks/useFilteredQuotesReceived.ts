import { useMemo } from 'react';
import { getQuoteStatusInfo } from '../components/QuotesReceivedCells';

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
            const { statusKey } = getQuoteStatusInfo(row);

            if (activeFilterTab === 'pending') {
                if (statusKey !== 'pending') return false;
            } else if (activeFilterTab === 'negotiating') {
                if (statusKey !== 'negotiating') return false;
            } else if (activeFilterTab === 'accepted') {
                if (statusKey !== 'accepted') return false;
            } else if (activeFilterTab === 'rejected') {
                if (statusKey !== 'rejected' && statusKey !== 'expired' && statusKey !== 'cancelled') return false;
            }

            if (statusFilter !== 'all') {
                if (!statusKey.includes(statusFilter.toLowerCase())) return false;
            }

            if (vehicleFilter !== 'all') {
                const rowVehicle = (row.vehicle || row.vehicle_type || row.truck_type || row.quote_request?.vehicle_type || '').toLowerCase();
                if (!rowVehicle.includes(vehicleFilter.toLowerCase())) return false;
            }

            if (ratingFilter !== 'all') {
                const numRating = Number(row.rating || row.supplier?.rating || 0);
                const minRating = parseFloat(ratingFilter);
                if (numRating < minRating) return false;
            }

            if (startDate || endDate) {
                const rowDateStr = row.created_at || row.date || row.valid_until || row.pickup_date;
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
