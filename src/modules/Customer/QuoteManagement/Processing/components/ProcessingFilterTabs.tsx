import React, { useMemo } from "react";

export type ProcessingFilterTabId = 
    | "all"
    | "pending"
    | "quotes_received"
    | "negotiation"
    | "booking_in_progress"
    | "booked"
    | "cancelled"
    | "expired";

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
        let pending = 0;
        let quotesReceived = 0;
        let negotiation = 0;
        let bookingInProgress = 0;
        let booked = 0;
        let cancelled = 0;
        let expired = 0;

        (requests || []).forEach((r) => {
            all++;
            const s = String(r.rawStatus || r.status || "").toLowerCase();
            const quotesCount = Number(r.bidsCount || r.quotesCount || r.quotesReceived || 0);

            if (s === "cancelled" || s === "closed" || s === "rejected") {
                cancelled++;
            } else if (s === "expired") {
                expired++;
            } else if (s === "booked" || s === "completed") {
                booked++;
            } else if (s === "booking_in_progress" || s === "booking in progress" || s === "payment_pending") {
                bookingInProgress++;
            } else if (s === "negotiation" || s === "negotiating") {
                negotiation++;
            } else if (quotesCount > 0 || s === "quotes_received" || s === "quotes received") {
                quotesReceived++;
            } else {
                pending++;
            }
        });

        return {
            all,
            pending,
            quotesReceived,
            negotiation,
            bookingInProgress,
            booked,
            cancelled,
            expired,
        };
    }, [requests]);

    const tabs = [
        { id: "all", label: "All", count: counts.all },
        { id: "pending", label: "Pending", count: counts.pending },
        { id: "quotes_received", label: "Quotes Received", count: counts.quotesReceived },
        { id: "negotiation", label: "Negotiation", count: counts.negotiation },
        { id: "booking_in_progress", label: "Booking in Progress", count: counts.bookingInProgress },
        { id: "booked", label: "Booked", count: counts.booked },
        { id: "cancelled", label: "Cancelled", count: counts.cancelled },
        { id: "expired", label: "Expired", count: counts.expired },
    ];

    return (
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeFilterTab.toLowerCase() === tab.id.toLowerCase();
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
