import { useMemo, useState } from 'react';
import { NegotiationItem } from '../types';
import {
    NegotiationFilterTab,
    isNegotiationAccepted,
    isNegotiationBooked,
    isNegotiationClosed,
    isNegotiationCounter,
    isNegotiationOpen,
} from '../components/NegotiationFilterTabs';

export function useNegotiationFilter(negotiations: NegotiationItem[]) {
    const [activeTab, setActiveTab] = useState<NegotiationFilterTab>("all");
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

    const filteredData = useMemo(() => {
        const list = Array.isArray(negotiations) ? negotiations : [];
        return list.filter(item => {
            if (!item) return false;

            if (activeTab === "open" && !isNegotiationOpen(item)) return false;
            if (activeTab === "counter" && !isNegotiationCounter(item)) return false;
            if (activeTab === "accepted" && !isNegotiationAccepted(item)) return false;
            if (activeTab === "booked" && !isNegotiationBooked(item)) return false;
            if (activeTab === "closed" && !isNegotiationClosed(item)) return false;

            if (priorityFilter !== "all" && item.priority?.toLowerCase() !== priorityFilter.toLowerCase()) {
                return false;
            }
            if (statusFilter !== "all") {
                const normStatus = (item.status || item.statusRaw || "").toLowerCase();
                const filterVal = statusFilter.toLowerCase();
                if (filterVal === "open" && !isNegotiationOpen(item)) return false;
                else if (filterVal === "counter" && !isNegotiationCounter(item)) return false;
                else if (filterVal === "accepted" && !isNegotiationAccepted(item)) return false;
                else if (filterVal === "booked" && !isNegotiationBooked(item)) return false;
                else if (filterVal === "closed" && !isNegotiationClosed(item)) return false;
                else if (!normStatus.includes(filterVal)) return false;
            }
            if (vehicleFilter !== "all") {
                const normVehicle = (item.vehicleType || "").toLowerCase().replace(/[\s_-]+/g, "");
                const targetVehicle = vehicleFilter.toLowerCase().replace(/[\s_-]+/g, "");
                if (!normVehicle.includes(targetVehicle)) {
                    return false;
                }
            }

            if (startDate || endDate) {
                const rowDateStr = (item as any).created_at || item.requestDate || item.pickupDate || item.lastUpdated;
                if (rowDateStr) {
                    try {
                        const rowTime = new Date(rowDateStr).getTime();
                        if (!isNaN(rowTime)) {
                            if (startDate) {
                                const start = new Date(startDate);
                                start.setHours(0, 0, 0, 0);
                                if (rowTime < start.getTime()) return false;
                            }
                            if (endDate) {
                                const end = new Date(endDate);
                                end.setHours(23, 59, 59, 999);
                                if (rowTime > end.getTime()) return false;
                            }
                        }
                    } catch { }
                }
            }

            return true;
        });
    }, [negotiations, activeTab, priorityFilter, statusFilter, vehicleFilter, startDate, endDate]);

    return {
        activeTab, setActiveTab,
        priorityFilter, setPriorityFilter,
        statusFilter, setStatusFilter,
        vehicleFilter, setVehicleFilter,
        startDate, setStartDate,
        endDate, setEndDate,
        handleResetFilters,
        filteredData,
    };
}
