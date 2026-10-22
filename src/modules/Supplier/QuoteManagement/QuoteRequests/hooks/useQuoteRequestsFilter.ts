import { useMemo, useState } from "react";
import { QuoteRequest } from "../../data/quoteRequestsData";
import { RequestFilterTab, isRequestClosedOrBooked, isRequestQuoted } from "../components/QuoteRequestsFilterTabs";

export function useQuoteRequestsFilter(requests: QuoteRequest[]) {
    const [activeTab, setActiveTab] = useState<RequestFilterTab>("all");
    const [locationFilter, setLocationFilter] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const handleResetFilters = () => {
        setLocationFilter("");
        setStartDate("");
        setEndDate("");
    };

    const filteredRequests = useMemo(() => {
        const normLoc = (locationFilter || "").trim().toLowerCase();

        return requests.filter((item) => {
            if (!item) return false;

            // Always exclude expired, cancelled, booked, completed from available requests
            if (isRequestClosedOrBooked(item)) return false;

            const isQuoted = isRequestQuoted(item);

            if (activeTab === "new") {
                if (isQuoted) return false;
            } else if (activeTab === "quoted") {
                if (!isQuoted) return false;
            }

            // Minimal Filter: Location
            if (normLoc) {
                const pickupLoc = String(item.pickup || (item as any).pickup_address || (item as any).pickup_city || "").toLowerCase();
                const deliveryLoc = String(item.delivery || (item as any).delivery_address || (item as any).delivery_city || "").toLowerCase();
                if (!pickupLoc.includes(normLoc) && !deliveryLoc.includes(normLoc)) {
                    return false;
                }
            }

            // Minimal Filter: Pickup Date (Start & End)
            if (startDate || endDate) {
                const dateVal = item.pickupDate || (item as any).pickupDateRaw || (item as any).pickup_date_raw || (item as any).pickup_date || item.requestDate;
                if (dateVal) {
                    try {
                        const itemTime = new Date(dateVal).getTime();
                        if (!isNaN(itemTime)) {
                            if (startDate) {
                                const start = new Date(startDate);
                                start.setHours(0, 0, 0, 0);
                                if (itemTime < start.getTime()) return false;
                            }
                            if (endDate) {
                                const end = new Date(endDate);
                                end.setHours(23, 59, 59, 999);
                                if (itemTime > end.getTime()) return false;
                            }
                        }
                    } catch { }
                }
            }

            return true;
        });
    }, [requests, activeTab, locationFilter, startDate, endDate]);

    return {
        activeTab,
        setActiveTab,
        locationFilter,
        setLocationFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleResetFilters,
        filteredRequests,
    };
}
