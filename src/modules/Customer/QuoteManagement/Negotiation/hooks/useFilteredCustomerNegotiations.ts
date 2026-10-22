import { useMemo } from "react";
import { CustomerNegotiationItem, NegotiationFilterTab } from "../types";
import {
    isNegotiationActive,
    isNegotiationAgreed,
    isNegotiationClosed,
    isWaitingForYou,
    isWaitingForSupplier,
} from "../components/NegotiationFilterTabs";

interface UseFilteredCustomerNegotiationsProps {
    negotiations: CustomerNegotiationItem[];
    activeTab: NegotiationFilterTab;
    priorityFilter: string;
    statusFilter: string;
    vehicleFilter: string;
    startDate: string;
    endDate: string;
}

export function useFilteredCustomerNegotiations({
    negotiations,
    activeTab,
    priorityFilter,
    statusFilter,
    vehicleFilter,
    startDate,
    endDate,
}: UseFilteredCustomerNegotiationsProps) {
    return useMemo(() => {
        return (negotiations || []).filter((item) => {
            if (!item) return false;

            const tab = String(activeTab).toLowerCase();

            if (tab === "your_turn" || tab === "waiting_you") {
                if (!isWaitingForYou(item)) return false;
            } else if (tab === "suppliers_turn" || tab === "waiting_supplier") {
                if (!isWaitingForSupplier(item)) return false;
            } else if (tab === "agreed") {
                if (!isNegotiationAgreed(item)) return false;
            } else if (tab === "active") {
                if (!isNegotiationActive(item)) return false;
            } else if (tab === "closed") {
                if (!isNegotiationClosed(item)) return false;
            }

            // Advanced Filter: Status
            if (statusFilter !== "all") {
                const normStatus = String(item.status || item.statusRaw || "").toLowerCase();
                const filterVal = statusFilter.toLowerCase();
                if (filterVal === "agreed" || filterVal === "accepted") {
                    if (!isNegotiationAgreed(item) && !normStatus.includes("accept") && !normStatus.includes("awaiting")) return false;
                } else if (filterVal === "awaiting_payment" || filterVal === "awaiting payment") {
                    if (!normStatus.includes("awaiting") && !item.isAwaitingPayment && !(item as any).is_awaiting_payment) return false;
                } else if (filterVal === "closed") {
                    if (!isNegotiationClosed(item) && !normStatus.includes("close")) return false;
                } else if (!normStatus.includes(filterVal)) {
                    return false;
                }
            }

            // Advanced Filter: Priority
            if (priorityFilter !== "all") {
                const normPriority = (item.priority || "").toLowerCase();
                if (!normPriority.includes(priorityFilter.toLowerCase())) return false;
            }

            // Advanced Filter: Vehicle
            if (vehicleFilter !== "all") {
                const normVehicle = (item.vehicleType || "").toLowerCase();
                if (!normVehicle.includes(vehicleFilter.toLowerCase())) return false;
            }

            // Advanced Filter: Last Activity (startDate / endDate)
            if (startDate || endDate) {
                const dateVal = item.lastUpdatedDate || item.lastSeenAt || item.updatedAt || item.updated_at || item.createdAt || item.date || item.requestDate;
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
    }, [negotiations, activeTab, priorityFilter, statusFilter, vehicleFilter, startDate, endDate]);
}
