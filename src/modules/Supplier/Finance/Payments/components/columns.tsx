import React from "react";
import { Building2 } from "lucide-react";
import Badge from "@/components/ui/badge";
import { Column } from "@/components/tables/data-table";
import { formatDisplayDate } from "@/lib/utils";

export const getPaymentColumns = (
    onViewDetails?: (payment: any) => void
): Column<any>[] => [
    {
        id: "net_amount",
        label: "Amount",
        sortable: true,
        className: "w-[130px] whitespace-nowrap",
        render: (row) => {
            const rawAmt = Number((row.supplier_amount ?? row.net_amount ?? row.amount ?? 0));
            const formatted = rawAmt.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const cur = (row.currency || "EUR").toUpperCase();
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="font-bold text-[13px] text-slate-900 dark:text-white whitespace-nowrap">
                        €{formatted} <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">{cur}</span>
                    </span>
                </div>
            );
        }
    },
    {
        id: "stage",
        label: "Status",
        sortable: true,
        className: "w-[125px] whitespace-nowrap",
        render: (row) => {
            const stage = (row.payment_stage || "").toLowerCase();
            const isCleared = row.is_cleared || stage === "cleared";
            const isInEscrow = row.is_in_escrow || stage === "in_escrow";
            const isPayLater = row.is_pay_later || stage === "pay_later";

            if (isCleared) {
                return (
                    <div className="flex items-center min-h-[22px]">
                        <span className="inline-flex items-center gap-1 bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                            Succeeded
                        </span>
                    </div>
                );
            }
            if (isInEscrow) {
                return (
                    <div className="flex items-center min-h-[22px]">
                        <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                            In Escrow
                        </span>
                    </div>
                );
            }
            if (isPayLater) {
                return (
                    <div className="flex items-center min-h-[22px]">
                        <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                            Net-30
                        </span>
                    </div>
                );
            }
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="inline-flex items-center gap-1 bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-300 border border-[#fde68a] dark:border-amber-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                        Pending
                    </span>
                </div>
            );
        }
    },
    {
        id: "method",
        label: "Payment Method",
        sortable: true,
        className: "w-[125px] whitespace-nowrap",
        render: (row) => {
            const method = (row.payment_method || row.method || "card").toLowerCase();
            const isPayLater = method.includes("pay_later") || method.includes("pay later") || row.is_pay_later;
            const cardBrand = (row.card_brand || row.brand || (method.includes("master") ? "MC" : "VISA")).toUpperCase();
            const last4 = row.last4 || row.card_last4 || "4242";

            if (isPayLater) {
                return (
                    <div className="flex items-center min-h-[22px]">
                        <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-[11px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                            Net-30 Terms
                        </span>
                    </div>
                );
            }

            return (
                <div className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-medium text-slate-700 dark:text-slate-200 min-h-[22px]">
                    <span className={`px-1.5 py-0.5 rounded-[3px] font-bold text-[9px] tracking-wider leading-none shadow-2xs ${cardBrand === "MC" ? "bg-[#eb001b] text-white" : "bg-[#1a1f71] text-white"}`}>
                        {cardBrand === "MC" ? "MC" : "VISA"}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">••••</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 text-xs">{last4}</span>
                </div>
            );
        }
    },
    {
        id: "id",
        label: "Invoice #",
        sortable: true,
        className: "w-[110px] whitespace-nowrap",
        render: (row) => {
            const invNum = row.invoice_number || (row.id ? `INV-${String(row.id).padStart(4, "0")}` : "INV-0001");
            return (
                <div className="flex items-center min-h-[22px]">
                    <button
                        type="button"
                        onClick={() => onViewDetails && onViewDetails(row)}
                        className="font-medium text-[12.5px] text-slate-800 dark:text-slate-200 hover:text-[#ff4a1f] hover:underline whitespace-nowrap text-left cursor-pointer"
                    >
                        {invNum}
                    </button>
                </div>
            );
        }
    },
    {
        id: "customer",
        label: "Client / Customer",
        sortable: true,
        className: "whitespace-nowrap min-w-[130px]",
        render: (row) => {
            const company = row.customer_company || row.customer?.company_name || row.customer_name || "Direct Customer";
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="text-[12.5px] font-normal text-slate-700 dark:text-slate-300 whitespace-nowrap truncate" title={company}>
                        {company}
                    </span>
                </div>
            );
        }
    },
    {
        id: "issue_date",
        label: "Date",
        sortable: true,
        className: "w-[120px] whitespace-nowrap",
        render: (row) => (
            <div className="flex items-center min-h-[22px]">
                <span className="whitespace-nowrap text-[12px] text-slate-500 dark:text-slate-400 font-normal">
                    {formatDisplayDate(row.date || row.issue_date || row.created_at)}
                </span>
            </div>
        )
    }
];

export default getPaymentColumns;
