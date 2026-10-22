import { useMemo } from "react";

interface UseFilteredProcessingRequestsParams {
    requests: any[];
    activeFilterTab: string;
    statusFilter: string;
    vehicleFilter: string;
    priorityFilter: string;
    locationFilter?: string;
    startDate: string;
    endDate: string;
}

export function useFilteredProcessingRequests({
    requests,
    activeFilterTab,
    statusFilter,
    vehicleFilter,
    priorityFilter,
    locationFilter = "",
    startDate,
    endDate,
}: UseFilteredProcessingRequestsParams) {
    return useMemo(() => {
        return (requests || []).filter((r) => {
            if (!r) return false;
            const s = String(r.rawStatus || r.status || "").toLowerCase().trim();
            const quotesCount = Number(r.bidsCount || r.quotesCount || r.quotesReceived || 0);
            const tab = activeFilterTab.toLowerCase();

            // Exclude completed, cancelled, expired, or booked requests from active Open Requests
            const isComp = Boolean(r.isCompleted || s === "completed" || String(r.raw_status || "").toLowerCase() === "completed");
            const isBooked = Boolean(s === "booked" || s === "confirmed" || r.is_booked || r.has_order || (s === "accepted" && (r.is_paid || r.has_order)));
            const isClosed = s === "cancelled" || s === "expired" || s === "closed";
            const isDraft = s === "draft" || String(r.rawStatus || "").toLowerCase() === "draft";

            if (isComp || isBooked || isClosed || isDraft) return false;

            // Tab filtering
            if (tab === "all") {
                // all open requests
            } else if (tab === "awaiting_quotes" || tab === "pending" || tab === "awaiting") {
                if (quotesCount > 0) return false;
            } else if (tab === "quotes_received") {
                if (quotesCount === 0) return false;
            }

            // Advanced Filter: Location
            if (locationFilter && locationFilter.trim() !== "") {
                const locQuery = locationFilter.toLowerCase().trim();
                const pickupLoc = String(r.pickup || r.pickup_address || r.pickup_city || "").toLowerCase();
                const deliveryLoc = String(r.delivery || r.delivery_address || r.delivery_city || "").toLowerCase();
                if (!pickupLoc.includes(locQuery) && !deliveryLoc.includes(locQuery)) {
                    return false;
                }
            }

            // Advanced Filter: Status
            if (statusFilter !== "all") {
                const filterVal = statusFilter.toLowerCase();
                if (!s.includes(filterVal)) return false;
            }

            // Advanced Filter: Vehicle
            if (vehicleFilter !== "all") {
                const vehicle = String(r.vehicleType || r.vehicle || "").toLowerCase().replace(/[\s_-]+/g, "");
                const targetVehicle = vehicleFilter.toLowerCase().replace(/[\s_-]+/g, "");
                if (!vehicle.includes(targetVehicle)) return false;
            }

            // Advanced Filter: Priority
            if (priorityFilter !== "all") {
                const prio = String(r.priority || "").toLowerCase();
                if (prio !== priorityFilter.toLowerCase()) return false;
            }

            // Advanced Filter: Pickup Date
            if (startDate || endDate) {
                const rowDateStr = r.pickupDate || r.pickup_date || r.createdAt || (r.rawData && r.rawData.pickup_date);
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
    }, [requests, activeFilterTab, statusFilter, vehicleFilter, priorityFilter, locationFilter, startDate, endDate]);
}
