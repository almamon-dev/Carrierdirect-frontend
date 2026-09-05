import { useMemo } from 'react';

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
            const st = (row.status_raw || row.status || 'pending').toLowerCase();

            if (activeFilterTab === 'pending') {
                if (st !== 'pending') return false;
            } else if (activeFilterTab === 'negotiating') {
                if (st !== 'negotiating' && row.revision_status !== 'pending') return false;
            } else if (activeFilterTab === 'accepted') {
                if (st !== 'accepted' && st !== 'completed') return false;
            } else if (activeFilterTab === 'rejected') {
                if (st !== 'rejected' && st !== 'expired' && st !== 'cancelled') return false;
            }

            if (statusFilter !== 'all') {
                if (!st.includes(statusFilter.toLowerCase())) return false;
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
