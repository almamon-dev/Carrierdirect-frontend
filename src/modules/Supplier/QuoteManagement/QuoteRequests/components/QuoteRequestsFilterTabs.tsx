import React, { useMemo } from "react";
import { QuoteRequest } from "../../data/quoteRequestsData";
import { SupplierTabStats } from "../hooks/useSupplierQuoteRequests";

export type RequestFilterTab = "all" | "new" | "quoted";

interface QuoteRequestsFilterTabsProps {
    requests: QuoteRequest[];
    activeTab: RequestFilterTab;
    onSelectTab: (tab: RequestFilterTab) => void;
    stats?: SupplierTabStats;
}

export function isRequestClosedOrBooked(r: any): boolean {
    if (!r) return true;
    const st = String(r.status || r.raw_status || "").toLowerCase().trim();
    const isExp = Boolean(r.isExpired || r.is_expired || st === "expired");
    const isComp = Boolean(r.isCompleted || st === "completed");
    const isBooked = Boolean(r.isBooked || st === "booked" || st === "won" || r.has_order);
    const isCancelled = st === "cancelled" || st === "closed";
    return isExp || isComp || isBooked || isCancelled;
}

export function isRequestQuoted(r: any): boolean {
    if (!r) return false;
    const st = String(r.status || r.raw_status || "").toLowerCase().trim();
    return Boolean(r.hasQuoted || r.isQuoted || r.my_quote || r.myQuote || st === "quoted");
}

export const QuoteRequestsFilterTabs: React.FC<QuoteRequestsFilterTabsProps> = ({
    requests,
    activeTab,
    onSelectTab,
}) => {
    const tabs = useMemo(() => {
        let allCount = 0;
        let newCount = 0;
        let quotedCount = 0;

        (requests || []).forEach((r: any) => {
            if (isRequestClosedOrBooked(r)) return;

            allCount++;
            if (isRequestQuoted(r)) {
                quotedCount++;
            } else {
                newCount++;
            }
        });

        return [
            { id: "all" as RequestFilterTab, label: "All", count: allCount },
            { id: "new" as RequestFilterTab, label: "New Requests", count: newCount },
            { id: "quoted" as RequestFilterTab, label: "Quoted", count: quotedCount },
        ];
    }, [requests]);

    const isTabActive = (tabId: RequestFilterTab) => {
        if (activeTab === tabId) return true;
        if (tabId === "new" && ((activeTab as string) === "new_requests" || (activeTab as string) === "new requests")) return true;
        return false;
    };

    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = isTabActive(tab.id);
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${
                            isActive
                                ? "border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]"
                                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? "font-bold text-[#ff4a1f]" : "font-medium"}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[12px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                                isActive
                                    ? "bg-orange-50 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] dark:text-orange-400"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default QuoteRequestsFilterTabs;
