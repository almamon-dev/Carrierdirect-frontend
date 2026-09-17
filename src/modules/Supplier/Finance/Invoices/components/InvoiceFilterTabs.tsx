import React, { useMemo } from "react";

export type InvoiceFilterTab = "all" | "cleared" | "in_escrow" | "due";

interface InvoiceFilterTabsProps {
    invoices: any[];
    activeTab: InvoiceFilterTab;
    onSelectTab: (tab: InvoiceFilterTab) => void;
}

export const InvoiceFilterTabs: React.FC<InvoiceFilterTabsProps> = ({
    invoices,
    activeTab,
    onSelectTab,
}) => {
    const counts = useMemo(() => {
        let cleared = 0;
        let inEscrow = 0;
        let due = 0;

        invoices.forEach((inv) => {
            const stage = String(inv.payment_stage || "").toLowerCase().trim();
            const st = String(inv.raw_status || inv.status || "").toLowerCase().trim();

            if (stage === "cleared" || st === "cleared") {
                cleared++;
            } else if (stage === "in_escrow" || st === "in escrow" || (st === "paid" && stage !== "cleared")) {
                inEscrow++;
            } else if (stage === "pay_later" || stage === "unpaid" || st === "due" || st === "pending" || st === "overdue") {
                due++;
            } else {
                due++;
            }
        });

        return {
            all: invoices.length,
            cleared,
            in_escrow: inEscrow,
            due,
        };
    }, [invoices]);

    const tabs: { id: InvoiceFilterTab; label: string; count: number }[] = [
        { id: "all", label: "All Invoices", count: counts.all },
        { id: "cleared", label: "Cleared & Ready", count: counts.cleared },
        { id: "in_escrow", label: "Held in Escrow", count: counts.in_escrow },
        { id: "due", label: "Due / Pay Later", count: counts.due },
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
                        className={`flex items-center gap-1.5 pb-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer px-1 ${
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

export default InvoiceFilterTabs;
