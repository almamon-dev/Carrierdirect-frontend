import { useMemo } from "react";

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
            const s = String(r.rawStatus || r.status || "").toLowerCase();
            const quotesCount = Number(r.bidsCount || r.quotesCount || r.quotesReceived || 0);
            const tab = activeFilterTab.toLowerCase();

            if (tab === "all") {
                // all
            } else if (tab === "cancelled") {
                if (s !== "cancelled" && s !== "closed" && s !== "rejected") return false;
            } else if (tab === "expired") {
                if (s !== "expired") return false;
            } else if (tab === "booked") {
                if (s !== "booked" && s !== "completed") return false;
            } else if (tab === "booking_in_progress") {
                if (s !== "booking_in_progress" && s !== "booking in progress" && s !== "payment_pending") return false;
            } else if (tab === "negotiation") {
                if (s !== "negotiation" && s !== "negotiating") return false;
            } else if (tab === "quotes_received") {
                if (quotesCount === 0 && s !== "quotes_received" && s !== "quotes received") return false;
            } else if (tab === "pending") {
                if (quotesCount > 0 || ["booked", "completed", "cancelled", "expired", "negotiation", "negotiating", "booking_in_progress"].includes(s)) return false;
            }

            if (statusFilter !== "all") {
                const filterVal = statusFilter.toLowerCase();
                if (!s.includes(filterVal)) return false;
            }

            if (vehicleFilter !== "all") {
                const vehicle = String(r.vehicleType || r.vehicle || "").toLowerCase().replace(/[\s_-]+/g, "");
                const targetVehicle = vehicleFilter.toLowerCase().replace(/[\s_-]+/g, "");
                if (!vehicle.includes(targetVehicle)) return false;
            }

            if (priorityFilter !== "all") {
                const prio = String(r.priority || "").toLowerCase();
                if (prio !== priorityFilter.toLowerCase()) return false;
            }

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
