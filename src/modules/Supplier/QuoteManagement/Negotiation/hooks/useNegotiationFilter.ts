import { useMemo, useState } from "react";
import { NegotiationItem } from "../types";
import {
    NegotiationFilterTab,
    isNegotiationActive,
    isNegotiationAgreed,
    isNegotiationClosed,
    isWaitingForYou,
    isWaitingForCustomer,
} from "../components/NegotiationFilterTabs";

export function useNegotiationFilter(negotiations: NegotiationItem[]) {
    const [activeTab, setActiveTab] = useState<NegotiationFilterTab>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [vehicleFilter, setVehicleFilter] = useState<string>("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const handleResetFilters = () => {
        setPriorityFilter("all");
        setStatusFilter("all");
        setVehicleFilter("all");
        setStartDate("");
        setEndDate("");
        // Preserve activeTab as per specification
    };

    const filteredData = useMemo(() => {
        const list = Array.isArray(negotiations) ? negotiations : [];
        return list.filter(item => {
            if (!item) return false;

            if (activeTab === "active" && !isNegotiationActive(item)) return false;
            if (activeTab === "waiting_you" && (!isNegotiationActive(item) || !isWaitingForYou(item))) return false;
            if (activeTab === "waiting_customer" && (!isNegotiationActive(item) || !isWaitingForCustomer(item))) return false;
            if (activeTab === "agreed" && !isNegotiationAgreed(item)) return false;
            if (activeTab === "closed" && !isNegotiationClosed(item)) return false;

            if (priorityFilter !== "all" && item.priority?.toLowerCase() !== priorityFilter.toLowerCase()) {
                return false;
            }
            if (statusFilter !== "all") {
                const normStatus = (item.status || item.statusRaw || "").toLowerCase();
                const filterVal = statusFilter.toLowerCase();
                if (filterVal === "active" && !isNegotiationActive(item)) return false;
                else if (filterVal === "agreed" && !isNegotiationAgreed(item)) return false;
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
