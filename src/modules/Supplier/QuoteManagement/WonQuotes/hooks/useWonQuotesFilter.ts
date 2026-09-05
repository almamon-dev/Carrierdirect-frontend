import { useMemo, useState } from 'react';
import { WonQuoteItem, WonFilterTab } from '../types';

export function useWonQuotesFilter(quotes: WonQuoteItem[], activeTab: WonFilterTab) {
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [vehicleFilter, setVehicleFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleResetFilters = () => {
        setPriorityFilter("all");
        setStatusFilter("all");
        setVehicleFilter("all");
        setStartDate("");
        setEndDate("");
    };

    const filteredQuotes = useMemo(() => {
        return quotes.filter((q) => {
            if (activeTab && activeTab.toLowerCase() !== "all") {
                if ((q.status || "").toLowerCase() !== activeTab.toLowerCase()) return false;
            }

            if (priorityFilter !== "all") {
                if ((q.priority || "").toLowerCase() !== priorityFilter.toLowerCase()) return false;
            }

            if (statusFilter !== "all") {
                if (!(q.status || "").toLowerCase().includes(statusFilter.toLowerCase())) return false;
            }

            if (vehicleFilter !== "all") {
                if (!(q.vehicleType || "").toLowerCase().includes(vehicleFilter.toLowerCase())) return false;
            }

            if (startDate || endDate) {
                const dateVal = q.pickupDate || q.requestDate;
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
    }, [quotes, activeTab, priorityFilter, statusFilter, vehicleFilter, startDate, endDate]);

    return {
        priorityFilter, setPriorityFilter,
        statusFilter, setStatusFilter,
        vehicleFilter, setVehicleFilter,
        startDate, setStartDate,
        endDate, setEndDate,
        handleResetFilters,
        filteredQuotes,
    };
}
