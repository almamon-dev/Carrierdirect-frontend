import { useState, useMemo } from "react";
import { MyQuoteItem } from "./useSupplierMyQuotes";

export type MyQuoteFilterTab = "all" | "pending" | "won" | "rejected";

export function isQuoteWon(r: any): boolean {
    if (!r) return false;
    const st = (r.supplierStatus || r.status || "").toLowerCase().trim();
    const ost = String(r.orderStatus || r.order?.status || "").toLowerCase().trim();
    const isOrderActive = ost && ["booked", "confirmed", "in_progress", "completed", "delivered", "pod_accepted"].includes(ost) && !["cancelled", "rejected"].includes(ost);
    return Boolean(
        st === "booked" ||
        r.hasOrder ||
        r.order ||
        r.orderId ||
        isOrderActive ||
        (st === "won" && (r.hasOrder || r.isPaid || isOrderActive))
    );
}

export function isQuoteRejected(r: any): boolean {
    if (!r) return false;
    const st = (r.supplierStatus || r.status || "").toLowerCase().trim();
    return st === "rejected" || st === "lost" || st === "declined" || st === "cancelled";
}

export function isQuoteExpired(r: any): boolean {
    if (!r) return false;
    const st = (r.supplierStatus || r.status || "").toLowerCase().trim();
    return Boolean(r.isExpired || st === "expired");
}

export function isQuotePending(r: any): boolean {
    if (!r) return false;
    if (isQuoteWon(r) || isQuoteRejected(r) || isQuoteExpired(r)) return false;
    return true;
}

export function useMyQuoteFilter(quotes: MyQuoteItem[] = []) {
    const [activeTab, setActiveTab] = useState<MyQuoteFilterTab>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [requestIdFilter, setRequestIdFilter] = useState<string>("");

    const handleResetFilters = () => {
        setStatusFilter("all");
        setRequestIdFilter("");
    };

    const tabs = useMemo(() => {
        let allCount = quotes.length;
        let pendingCount = 0;
        let wonCount = 0;
        let rejectedCount = 0;

        quotes.forEach((r) => {
            if (isQuoteWon(r)) {
                wonCount++;
            } else if (isQuoteRejected(r)) {
                rejectedCount++;
            } else if (isQuotePending(r)) {
                pendingCount++;
            }
        });

        return [
            { id: "all" as MyQuoteFilterTab, label: "All", count: allCount },
            { id: "pending" as MyQuoteFilterTab, label: "Pending", count: pendingCount },
            { id: "won" as MyQuoteFilterTab, label: "Won", count: wonCount },
            { id: "rejected" as MyQuoteFilterTab, label: "Rejected", count: rejectedCount },
        ];
    }, [quotes]);

    const filteredData = useMemo(() => {
        const normReqId = requestIdFilter.trim().toLowerCase().replace("req-", "");

        return quotes.filter((r) => {
            // Tab filtering
            if (activeTab === "pending" && !isQuotePending(r)) return false;
            if (activeTab === "won" && !isQuoteWon(r)) return false;
            if (activeTab === "rejected" && !isQuoteRejected(r)) return false;

            // Status filter
            if (statusFilter !== "all") {
                const st = (r.supplierStatus || r.status || "").toLowerCase().trim();
                if (statusFilter === "won") {
                    if (!isQuoteWon(r)) return false;
                } else if (statusFilter === "pending") {
                    if (!isQuotePending(r)) return false;
                } else if (statusFilter === "rejected") {
                    if (!isQuoteRejected(r)) return false;
                } else if (statusFilter === "expired") {
                    if (!isQuoteExpired(r)) return false;
                } else if (!st.includes(statusFilter.toLowerCase())) {
                    return false;
                }
            }

            // Request ID filter
            if (normReqId) {
                const rowId = String(r.id || r.rawId || "").toLowerCase();
                const cleanRowId = rowId.replace("req-", "");
                if (!cleanRowId.includes(normReqId) && !rowId.includes(normReqId)) {
                    return false;
                }
            }

            return true;
        });
    }, [quotes, activeTab, statusFilter, requestIdFilter]);

    return {
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        requestIdFilter,
        setRequestIdFilter,
        handleResetFilters,
        tabs,
        filteredData,
    };
}
