import React from "react";
import { Download, Loader2 } from "lucide-react";
import { Column } from "@/components/tables/data-table";
import { renderInvoiceStatusBadge } from "@/enums/FinanceStatus";
import { InvoiceItem } from "../types";

export const getCustomerInvoiceColumns = (
  downloadingId: string | null,
  onDownloadReceipt: (item: InvoiceItem) => void
): Column<InvoiceItem>[] => [
  {
    id: "amount",
    label: "Amount",
    sortable: true,
    className: "w-[130px] whitespace-nowrap",
    render: (item) => (
      <span className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap">
        {item.amount}
      </span>
    ),
  },
  {
    id: "status",
    label: "Status",
    sortable: true,
    className: "w-[110px] whitespace-nowrap",
    render: (item) => renderInvoiceStatusBadge(item.raw_status || item.status || "paid"),
  },
  {
    id: "payment_method",
    label: "Payment Method",
    sortable: true,
    className: "w-[140px] whitespace-nowrap",
    render: (item) => {
      const brand = (item.card_brand || "VISA").toUpperCase();
      const last4 = item.card_last4 || "4242";
      return (
        <div className="inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] font-medium text-slate-700 dark:text-slate-200 min-h-[22px]">
          <span className={`px-1.5 py-0.5 rounded-[3px] font-bold text-[9px] tracking-wider leading-none shadow-2xs ${
            brand === "MC" ? "bg-[#eb001b] text-white" : "bg-[#1a1f71] text-white"
          }`}>
            {brand === "MC" ? "MC" : "VISA"}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">••••</span>
          <span className="font-mono text-slate-700 dark:text-slate-300 text-xs">{last4}</span>
        </div>
      );
    },
  },
  {
    id: "id",
    label: "Invoice Reference",
    sortable: true,
    className: "w-[150px] whitespace-nowrap",
    render: (item) => (
      <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
        {item.id}
      </span>
    ),
  },
  {
    id: "details",
    label: "Subscription Plan",
    sortable: true,
    className: "min-w-[190px] whitespace-nowrap",
    render: (item) => (
      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
        {item.details}
      </span>
    ),
  },
  {
    id: "date",
    label: "Billing Date",
    sortable: true,
    className: "w-[125px] whitespace-nowrap",
    render: (item) => (
      <span className="text-xs text-slate-600 dark:text-slate-400 font-normal">
        {item.date}
      </span>
    ),
  },
  {
    id: "download",
    label: "Receipt",
    className: "w-[130px] text-right whitespace-nowrap",
    render: (item) => (
      <button
        type="button"
        disabled={downloadingId === item.id}
        onClick={() => onDownloadReceipt(item)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#ff4a1f] bg-[#fff5f2] hover:bg-[#ffece6] dark:bg-[#ff4a1f]/10 dark:hover:bg-[#ff4a1f]/20 border border-[#ffdcd2] dark:border-[#ff4a1f]/30 rounded-[4px] transition-colors cursor-pointer disabled:opacity-50"
      >
        {downloadingId === item.id ? (
          <>
            <Loader2 size={12} className="animate-spin text-[#ff4a1f]" />
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <Download size={12} />
            <span>Download PDF</span>
          </>
        )}
      </button>
    ),
  },
];
