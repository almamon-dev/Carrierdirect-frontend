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
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [startDate, setStartDate] = useState<string>("" );
    const [endDate, setEndDate] = useState<string>("");

    const handleResetFilters = () => {
        setStatusFilter("all");
        setStartDate("");
        setEndDate("");
    };

    const filteredData = useMemo(() => {
        const list = Array.isArray(negotiations) ? negotiations : [];
        return list.filter(item => {
            if (!item) return false;

            const tab = String(activeTab).toLowerCase();

            if (tab === "your_turn" || tab === "waiting_you") {
                if (!isWaitingForYou(item)) return false;
            } else if (tab === "customers_turn" || tab === "waiting_customer") {
                if (!isWaitingForCustomer(item)) return false;
            } else if (tab === "agreed") {
                if (!isNegotiationAgreed(item)) return false;
            } else if (tab === "active") {
                if (!isNegotiationActive(item)) return false;
            } else if (tab === "closed") {
                if (!isNegotiationClosed(item)) return false;
            }

            // Minimal Filter: Status
            if (statusFilter !== "all") {
                const normStatus = (item.status || item.statusRaw || "").toLowerCase();
                const filterVal = statusFilter.toLowerCase();
                if (filterVal === "agreed" || filterVal === "accepted") {
                    if (!isNegotiationAgreed(item) && !normStatus.includes("accept")) return false;
                } else if (filterVal === "closed") {
                    if (!isNegotiationClosed(item) && !normStatus.includes("close")) return false;
                } else if (!normStatus.includes(filterVal)) {
                    return false;
                }
            }

            // Minimal Filter: Last Activity Date Range
            if (startDate || endDate) {
                const rowDateStr = (item as any).lastUpdatedDate || (item as any).updated_at || (item as any).created_at || item.lastUpdated || item.requestDate;
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
    }, [negotiations, activeTab, statusFilter, startDate, endDate]);

    return {
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleResetFilters,
        filteredData,
    };
}
