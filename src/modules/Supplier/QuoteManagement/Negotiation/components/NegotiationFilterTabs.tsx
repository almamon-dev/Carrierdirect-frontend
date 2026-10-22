import React, { useMemo } from "react";
import { NegotiationItem, NegotiationFilterTab } from "../types";

export { type NegotiationFilterTab } from "../types";

interface NegotiationFilterTabsProps {
    negotiations: NegotiationItem[];
    activeTab: NegotiationFilterTab;
    onSelectTab: (tab: NegotiationFilterTab) => void;
}

export function isNegotiationCompleted(item: any): boolean {
    if (!item) return false;
    if (item.isCompleted === true || item.is_completed === true) return true;
    const s = String(item.status || "").toLowerCase().trim();
    const sRaw = String(item.statusRaw || item.status_raw || "").toLowerCase().trim();
    const ost = String(item.orderStatus || item.order_status || item.order?.status || item.raw?.order_status || item.raw?.order?.status || "").toLowerCase().trim();
    const podStatus = String(item.pod_status || item.podStatus || item.order?.pod_status || item.raw?.pod_status || item.raw?.order?.pod_status || "").toLowerCase().trim();
    return s === "completed" || sRaw === "completed" || ost === "completed" || podStatus === "confirmed" || podStatus === "accepted";
}

export function isNegotiationAgreed(item: NegotiationItem): boolean {
    if (isNegotiationCompleted(item)) return false;
    const s = (item.statusRaw || item.status || "").toLowerCase().trim();
    const rev = (item.revisionStatus || "").toLowerCase().trim();
    return s === "accepted" || s === "agreed" || rev === "accepted";
}

export function isNegotiationClosed(item: NegotiationItem): boolean {
    if (isNegotiationCompleted(item)) return true;
    if (isNegotiationAgreed(item)) return false;
    const s = (item.statusRaw || item.status || "").toLowerCase().trim();
    return s === "closed" || s === "rejected" || s === "expired" || s === "lost" || s === "declined" || s === "cancelled" || Boolean((item as any).isExpired);
}

export function isNegotiationActive(item: NegotiationItem): boolean {
    if (isNegotiationCompleted(item) || isNegotiationAgreed(item) || isNegotiationClosed(item)) return false;
    return true;
}

export function isWaitingForYou(item: NegotiationItem): boolean {
    if (!isNegotiationActive(item)) return false;
    if (item.can_accept === true || item.can_counter === true) return true;
    if (item.is_my_offer === false && (item.revisionStatus === "pending" || item.status === "Counter Received" || item.statusRaw === "counter_offers")) return true;
    if (item.unreadCount && item.unreadCount > 0) return true;
    if (item.is_my_offer === false && item.waiting_for_response !== true) return true;
    return false;
}

export function isWaitingForCustomer(item: NegotiationItem): boolean {
    if (!isNegotiationActive(item)) return false;
    if (item.waiting_for_response === true) return true;
    if (item.is_my_offer === true && item.revisionStatus === "pending") return true;
    if (item.can_withdraw === true) return true;
    return !isWaitingForYou(item);
}

export const NegotiationFilterTabs: React.FC<NegotiationFilterTabsProps> = ({
    negotiations,
    activeTab,
    onSelectTab,
}) => {
    const tabs = useMemo(() => {
        let allCount = (negotiations || []).length;
        let yourTurnCount = 0;
        let customersTurnCount = 0;
        let agreedCount = 0;

        (negotiations || []).forEach((n) => {
            if (isNegotiationAgreed(n)) {
                agreedCount++;
            } else if (isWaitingForYou(n)) {
                yourTurnCount++;
            } else if (isWaitingForCustomer(n)) {
                customersTurnCount++;
            }
        });

        return [
            { id: "all" as NegotiationFilterTab, label: "All", count: allCount },
            { id: "your_turn" as NegotiationFilterTab, label: "Your Turn", count: yourTurnCount },
            { id: "customers_turn" as NegotiationFilterTab, label: "Customer's Turn", count: customersTurnCount },
            { id: "agreed" as NegotiationFilterTab, label: "Agreed", count: agreedCount },
        ];
    }, [negotiations]);

    const isTabActive = (tabId: string) => {
        if (activeTab === tabId) return true;
        if (tabId === "your_turn" && (activeTab === "waiting_you" || (activeTab as string) === "your turn")) return true;
        if (tabId === "customers_turn" && (activeTab === "waiting_customer" || (activeTab as string) === "customer's turn")) return true;
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

export default NegotiationFilterTabs;
