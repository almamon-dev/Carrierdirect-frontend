import React, { useMemo } from "react";
import { CustomerPayLaterItem, PayLaterFilterTab } from "../types";

interface PayLaterFilterTabsProps {
    invoices: CustomerPayLaterItem[];
    stats?: {
        total_invoices?: number;
        invoices_paid?: number;
        invoices_due?: number;
        invoices_overdue?: number;
    } | null;
    activeTab: PayLaterFilterTab;
    onSelectTab: (tab: PayLaterFilterTab) => void;
}

export const PayLaterFilterTabs: React.FC<PayLaterFilterTabsProps> = ({
    invoices,
    stats,
    activeTab,
    onSelectTab,
}) => {
    const counts = useMemo(() => {
        let paid = 0;
        let due = 0;
        let overdue = 0;

        invoices.forEach((inv) => {
            const st = String(inv.raw_status || inv.status || "").toLowerCase().trim();
            if (st === "paid" || st === "settled" || st === "succeeded" || st === "cleared") {
                paid++;
            } else if (st === "overdue") {
                overdue++;
            } else {
                due++;
            }
        });

        return {
            all: stats?.total_invoices ?? invoices.length,
            paid: stats?.invoices_paid ?? paid,
            due: stats?.invoices_due ?? due,
            overdue: stats?.invoices_overdue ?? overdue,
        };
    }, [invoices, stats]);

    const tabs: { id: PayLaterFilterTab; label: string; count: number }[] = [
        { id: "all", label: "All Invoices", count: counts.all },
        { id: "paid", label: "Paid", count: counts.paid },
        { id: "due", label: "Due", count: counts.due },
        { id: "overdue", label: "Overdue", count: counts.overdue },
    ];

    return (
        <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto hide-scrollbar mb-[-1px]">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onSelectTab(tab.id)}
                        className={`flex items-center gap-1.5 pb-2.5 border-b transition-colors whitespace-nowrap cursor-pointer px-1 ${
                            isActive
                                ? "border-[#ff4a1f] text-[#ff4a1f] dark:border-[#ff4a1f] dark:text-[#ff4a1f]"
                                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                        }`}
                    >
                        <span className={`text-[13px] ${isActive ? "font-bold" : "font-medium"}`}>
                            {tab.label}
                        </span>
                        <span
                            className={`text-[11px] font-medium px-1.5 py-0.25 rounded-full transition-colors ${
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

export default PayLaterFilterTabs;
