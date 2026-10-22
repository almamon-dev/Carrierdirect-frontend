import React, { useMemo } from "react";

export type ProcessingFilterTabId = 
    | "all"
    | "awaiting_quotes"
    | "quotes_received";

interface ProcessingFilterTabsProps {
    requests: any[];
    activeFilterTab: string;
    setActiveFilterTab: (tab: string) => void;
}

export const ProcessingFilterTabs: React.FC<ProcessingFilterTabsProps> = ({
    requests,
    activeFilterTab,
    setActiveFilterTab,
}) => {
    const counts = useMemo(() => {
        let all = 0;
        let awaitingQuotes = 0;
        let quotesReceived = 0;

        (requests || []).forEach((r) => {
            const s = String(r.rawStatus || r.status || "").toLowerCase().trim();
            const isComp = Boolean(r.isCompleted || s === "completed" || String(r.raw_status || "").toLowerCase() === "completed");
            const isBooked = Boolean(s === "booked" || s === "confirmed" || r.is_booked || r.has_order || (s === "accepted" && (r.is_paid || r.has_order)));
            const isClosed = s === "cancelled" || s === "expired" || s === "closed";
            const isDraft = s === "draft" || String(r.rawStatus || "").toLowerCase() === "draft";

            // Exclude cancelled, expired, booked, and completed requests
            if (isComp || isBooked || isClosed || isDraft) return;

            all++;
            const quotesCount = Number(r.bidsCount || r.quotesCount || r.quotesReceived || 0);
            if (quotesCount > 0 || s === "quotes_received" || s === "quotes received") {
                quotesReceived++;
            } else {
                awaitingQuotes++;
            }
        });

        return {
            all,
            awaitingQuotes,
            quotesReceived,
        };
    }, [requests]);

    const tabs = [
        { id: "all", label: "All", count: counts.all },
        { id: "awaiting_quotes", label: "Awaiting Quotes", count: counts.awaitingQuotes },
        { id: "quotes_received", label: "Quotes Received", count: counts.quotesReceived },
    ];

    const isTabActive = (tabId: string) => {
        const norm = activeFilterTab.toLowerCase();
        if (norm === tabId) return true;
        if (tabId === "awaiting_quotes" && (norm === "pending" || norm === "awaiting")) return true;
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
                        onClick={() => setActiveFilterTab(tab.id)}
                        className={`flex items-center gap-2 pb-3 border-b transition-colors whitespace-nowrap cursor-pointer px-1 ${
                            isActive
                                ? "border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]"
                                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                    >
                        <span className={`text-[14px] ${isActive ? "font-bold text-[#ff4a1f]" : "font-medium"}`}>{tab.label}</span>
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
