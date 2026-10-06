import React from "react";
import { Download } from "lucide-react";
import { Column } from "@/components/tables/data-table";
import Button from "@/components/ui/button";
import { SubscriptionBillingHistoryItem } from "../types";
import { renderInvoiceStatusBadge } from "@/enums/FinanceStatus";

export const getSubscriptionBillingColumns = (
  onDownloadReceipt: (item: SubscriptionBillingHistoryItem) => void,
  downloadingId?: string | number | null
): Column<SubscriptionBillingHistoryItem>[] => [
  {
    id: "amount",
    label: "Amount",
    sortable: true,
    className: "w-[130px] whitespace-nowrap",
    render: (row) => (
      <div className="flex items-center min-h-[22px]">
        <span className="font-bold text-[13px] text-slate-900 dark:text-white whitespace-nowrap">
          {row.amount_formatted || `€${Number(row.amount || 0).toFixed(2)} EUR`}
        </span>
      </div>
    ),
  },
  {
    id: "status",
    label: "Status",
    sortable: true,
    className: "w-[120px] whitespace-nowrap",
    render: (row) => renderInvoiceStatusBadge(row.raw_status || row.status || "paid")
  },
  {
    id: "payment_method",
    label: "Payment Method",
    sortable: true,
    className: "w-[140px] whitespace-nowrap",
    render: (row) => {
      const cardBrand = (row.card_brand || "VISA").toUpperCase();
      const last4 = row.card_last4 || "4242";

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
    id: "invoice_number",
    label: "Invoice Reference",
    sortable: true,
    className: "w-[150px] whitespace-nowrap",
    render: (row) => (
      <div className="flex items-center min-h-[22px]">
        <span className="font-mono text-[12px] font-medium text-slate-700 dark:text-slate-300">
          {row.invoice_number}
        </span>
      </div>
    ),
  },
  {
    id: "plan_name",
    label: "Subscription Plan",
    sortable: true,
    className: "min-w-[190px] whitespace-nowrap",
    render: (row) => (
      <div className="flex flex-col justify-center min-h-[22px] leading-tight">
        <span className="font-bold text-[12.5px] text-slate-900 dark:text-slate-100">
          {row.plan_name}
        </span>
        {row.billing_cycle && (
          <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">
            {row.billing_cycle} Cycle
          </span>
        )}
      </div>
    ),
  },
  {
    id: "payment_date",
    label: "Billing Date",
    sortable: true,
    className: "w-[125px] whitespace-nowrap",
    render: (row) => (
      <div className="flex items-center min-h-[22px]">
        <span className="text-[12px] text-slate-600 dark:text-slate-400 font-normal">
          {row.billing_date || row.payment_date || row.created_at || "—"}
        </span>
      </div>
    ),
  },
  {
    id: "receipt",
    label: "Receipt",
    className: "w-[130px] text-right whitespace-nowrap",
    render: (row) => {
      const isDownloading = downloadingId === row.id || downloadingId === row.invoice_number;
      return (
        <div className="flex items-center justify-end min-h-[22px]">
          <Button
            variant="outline"
            size="sm"
            disabled={isDownloading}
            onClick={() => onDownloadReceipt(row)}
            className="h-[26px] px-2 text-[11.5px] font-semibold flex items-center gap-1 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <Download size={11.5} className={isDownloading ? "animate-bounce text-[#ff4a1f]" : "text-slate-500"} />
            <span>{isDownloading ? "Downloading..." : "Download PDF"}</span>
          </Button>
        </div>
      );
    },
  },
];

export default getSubscriptionBillingColumns;
