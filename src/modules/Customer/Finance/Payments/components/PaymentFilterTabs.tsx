import React, { useMemo } from "react";
import { CustomerPaymentItem, PaymentFilterTab } from "../types";

interface PaymentFilterTabsProps {
    payments: CustomerPaymentItem[];
    stats?: {
        total_transactions?: number;
        succeeded_count?: number;
        processing_count?: number;
        pay_later_count?: number;
        refunded_count?: number;
    } | null;
    activeTab: PaymentFilterTab;
    onSelectTab: (tab: PaymentFilterTab) => void;
}

export const PaymentFilterTabs: React.FC<PaymentFilterTabsProps> = ({
    payments,
    stats,
    activeTab,
    onSelectTab,
}) => {
    const counts = useMemo(() => {
        let succeeded = 0;
        let processing = 0;
        let payLater = 0;
        let refunded = 0;

        payments.forEach((p) => {
            const rawStatus = String(p.raw_status || p.status || "").toLowerCase().trim();
            const rawMethod = String(p.payment_method || p.method || "").toLowerCase().trim();

            if (rawMethod.includes("later") || rawMethod.includes("net-30") || String(p.payment_type || "").toLowerCase().includes("later")) {
                payLater++;
            }

            if (rawStatus === "succeeded" || rawStatus === "paid" || rawStatus === "completed") {
                succeeded++;
            } else if (rawStatus === "refunded" || rawStatus === "failed") {
                refunded++;
            } else {
                processing++;
            }
        });

        return {
            all: stats?.total_transactions ?? payments.length,
            succeeded: stats?.succeeded_count ?? succeeded,
            processing: stats?.processing_count ?? processing,
            pay_later: stats?.pay_later_count ?? payLater,
            refunded: stats?.refunded_count ?? refunded,
        };
    }, [payments, stats]);

    const tabs: { id: PaymentFilterTab; label: string; count: number }[] = [
        { id: "all", label: "All Payments", count: counts.all },
        { id: "succeeded", label: "Succeeded", count: counts.succeeded },
        { id: "processing", label: "In Escrow", count: counts.processing },
        { id: "pay_later", label: "Pay Later", count: counts.pay_later },
        { id: "refunded", label: "Refunded", count: counts.refunded },
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

export default PaymentFilterTabs;
