import React, { useMemo } from "react";

export type PaymentFilterTab = "all" | "cleared" | "escrow" | "pay_later" | "pending";

interface PaymentFilterTabsProps {
    payments: any[];
    activeTab: PaymentFilterTab;
    onSelectTab: (tab: PaymentFilterTab) => void;
}

export const PaymentFilterTabs: React.FC<PaymentFilterTabsProps> = ({
    payments,
    activeTab,
    onSelectTab,
}) => {
    const counts = useMemo(() => {
        let cleared = 0;
        let escrow = 0;
        let payLater = 0;
        let pending = 0;

        payments.forEach((i) => {
            const stage = (i.payment_stage || "").toLowerCase();
            const st = (i.raw_status || i.status || "").toLowerCase();
            const isPL = i.is_pay_later || stage === "pay_later" || st.includes("pay later") || (i.payment_method || "").toLowerCase().includes("pay_later");
            
            if (i.is_cleared || stage === "cleared" || st === "paid" || st === "cleared" || st === "released") {
                cleared++;
            } else if (i.is_in_escrow || stage === "escrow" || stage === "in_escrow") {
                escrow++;
            } else if (isPL) {
                payLater++;
            } else if (!i.is_cleared && (stage === "unpaid" || st === "pending" || st === "due")) {
                pending++;
            }
        });

        return {
            all: payments.length,
            cleared,
            escrow,
            pay_later: payLater,
            pending,
        };
    }, [payments]);

    const tabs: { id: PaymentFilterTab; label: string; count: number }[] = [
        { id: "all", label: "All Payments", count: counts.all },
        { id: "cleared", label: "Cleared & Ready", count: counts.cleared },
        { id: "escrow", label: "Held in Escrow", count: counts.escrow },
        { id: "pay_later", label: "Pay Later (30 Days)", count: counts.pay_later },
        { id: "pending", label: "Pending", count: counts.pending },
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

export default PaymentFilterTabs;
