import React from "react";
import { Column } from "@/components/tables/data-table";
import { formatDisplayDate } from "@/lib/utils";
import { CustomerInvoiceItem } from "../types";
import { renderInvoiceStatusBadge } from "@/enums/FinanceStatus";

export const getInvoiceColumns = (
    onViewDetails?: (invoice: CustomerInvoiceItem) => void
): Column<CustomerInvoiceItem>[] => [
    {
        id: "net_amount",
        label: "Amount",
        sortable: true,
        className: "w-[130px] whitespace-nowrap",
        render: (row) => {
            const rawAmt = Number((row.gross_amount ?? row.total_amount ?? row.amount_raw ?? row.supplier_amount ?? row.amount ?? 0));
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
        render: (row) => renderInvoiceStatusBadge(row.raw_status || row.status || row.payment_stage, row.is_pay_later)
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
        id: "supplier",
        label: "Carrier / Supplier",
        sortable: true,
        className: "whitespace-nowrap min-w-[130px]",
        render: (row) => {
            const supplier = row.supplier_name || row.carrier || (typeof row.supplier === "string" ? row.supplier : row.supplier?.company_name || row.supplier?.name) || "Carrier Direct";
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="text-[12.5px] font-normal text-slate-700 dark:text-slate-300 whitespace-nowrap truncate" title={supplier}>
                        {supplier}
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
            const isDue = rawSt === "due" || rawSt === "pending" || rawSt === "unpaid";
            const isOverdue = rawSt === "overdue";
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className={`whitespace-nowrap text-[12px] font-normal ${
                        isOverdue ? "text-rose-600 dark:text-rose-400 font-semibold" :
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
