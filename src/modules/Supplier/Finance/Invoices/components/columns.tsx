import React from "react";
import { Building2, Clock } from "lucide-react";
import Badge from "@/components/ui/badge";
import { Column } from "@/components/tables/data-table";
import { formatDisplayDate } from "@/lib/utils";

export const getInvoiceColumns = (
    onViewInvoice?: (invoice: any) => void
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
            const st = (row.raw_status || row.status || "").toLowerCase();

            if (stage === "cleared" || st === "cleared" || st === "paid" || st === "succeeded") {
                return (
                    <div className="flex items-center min-h-[22px]">
                        <span className="inline-flex items-center gap-1 bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                            Paid
                        </span>
                    </div>
                );
            }
            if (stage === "in_escrow" || st === "in escrow") {
                return (
                    <div className="flex items-center min-h-[22px]">
                        <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                            In Escrow
                        </span>
                    </div>
                );
            }
            if (stage === "pay_later" || row.is_pay_later) {
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
                        Due
                    </span>
                </div>
            );
        }
    },
    {
        id: "invoice_number",
        label: "Invoice #",
        sortable: true,
        className: "w-[110px] whitespace-nowrap",
        render: (row) => {
            const invNum = row.invoice_number || (row.id ? `INV-${String(row.id).padStart(4, "0")}` : "INV-0001");
            return (
                <div className="flex items-center min-h-[22px]">
                    <button
                        type="button"
                        onClick={() => onViewInvoice && onViewInvoice(row)}
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
        id: "route",
        label: "Pickup & Delivery",
        sortable: true,
        className: "w-auto max-w-[320px] min-w-[180px]",
        render: (row) => {
            const pickup = row.pickup_address || row.pickup || row.pickup_name || row.from || "Origin Hub";
            const delivery = row.delivery_address || row.delivery || row.delivery_name || row.to || "Destination Hub";

            return (
                <div className="flex flex-col justify-center leading-tight py-0 min-w-0">
                    <span className="text-[12.5px] font-normal text-slate-700 dark:text-slate-300 truncate" title={`Pickup: ${pickup}`}>
                        {pickup}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate" title={`Delivery: ${delivery}`}>
                        to {delivery}
                    </span>
                </div>
            );
        }
    },
    {
        id: "issue_date",
        label: "Issue Date",
        sortable: true,
        className: "w-[120px] whitespace-nowrap",
        render: (row) => (
            <div className="flex items-center min-h-[22px]">
                <span className="whitespace-nowrap text-[12px] text-slate-500 dark:text-slate-400 font-normal">
                    {formatDisplayDate(row.issue_date || row.issueDate || row.created_at || row.date)}
                </span>
            </div>
        )
    },
    {
        id: "due_date",
        label: "Due Date",
        sortable: true,
        className: "w-[120px] whitespace-nowrap",
        render: (row) => {
            const rawSt = (row.raw_status || row.status || "").toLowerCase();
            const isDue = rawSt === "due" || rawSt === "pending";
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className={`whitespace-nowrap text-[12px] font-normal ${
                        isDue ? "text-amber-700 dark:text-amber-400 font-medium" : "text-slate-500 dark:text-slate-400"
                    }`}>
                        {formatDisplayDate(row.due_date || row.dueDate, "30 Days Net")}
                    </span>
                </div>
            );
        }
    }
];

export default getInvoiceColumns;
