import React from "react";
import { Building2 } from "lucide-react";
import Badge from "@/components/ui/badge";
import { Column } from "@/components/tables/data-table";
import { formatDisplayDate } from "@/lib/utils";

export const getPaymentColumns = (
    onViewDetails?: (payment: any) => void
): Column<any>[] => [
    {
        id: "id",
        label: "Invoice #",
        sortable: true,
        className: "w-[110px] whitespace-nowrap",
        render: (row) => {
            const invNum = row.invoice_number || (row.id ? `INV-${String(row.id).padStart(4, "0")}` : "INV-0001");
            const ordNum = row.order_number || row.orderId || (row.order_id ? `ORD-${String(row.order_id).padStart(4, "0")}` : null);
            return (
                <div className="flex flex-col min-w-0 leading-none gap-0.5 min-h-[22px] justify-center">
                    <button
                        type="button"
                        onClick={() => onViewDetails && onViewDetails(row)}
                        className="font-bold text-[#ff4a1f] hover:underline whitespace-nowrap text-xs text-left cursor-pointer"
                    >
                        {invNum}
                    </button>
                    {ordNum && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none">
                            {ordNum}
                        </span>
                    )}
                </div>
            );
        }
    },
    {
        id: "customer",
        label: "Client / Customer",
        sortable: true,
        className: "whitespace-nowrap",
        render: (row) => {
            const company = row.customer_company || row.customer?.company_name || row.customer_name || "Direct Customer";
            const contactName = row.customer_name || row.customer?.name || row.customer_email || "Customer";
            return (
                <div className="flex items-center gap-1.5 min-w-0 min-h-[22px]">
                    <div className="w-4.5 h-4.5 min-w-[18px] min-h-[18px] aspect-square rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:border-orange-500/20 text-[#ff4a1f] flex items-center justify-center shrink-0">
                        <Building2 size={10.5} />
                    </div>
                    <div className="flex flex-col min-w-0 leading-none gap-0.5">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs whitespace-nowrap" title={company}>
                            {company}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none">
                            {contactName}
                        </span>
                    </div>
                </div>
            );
        }
    },
    {
        id: "route",
        label: "Pickup & Delivery",
        sortable: true,
        className: "w-auto max-w-[320px] min-w-[200px]",
        render: (row) => {
            const pickup = row.pickup_address || row.pickup || row.pickup_name || row.from || "Origin Hub";
            const delivery = row.delivery_address || row.delivery || row.delivery_name || row.to || "Destination Hub";

            return (
                <div className="flex flex-col gap-1 min-w-0 py-0.5 justify-center">
                    <div className="flex items-center gap-1.5 min-w-0 leading-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate" title={pickup}>
                            {pickup}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0 leading-tight">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] shrink-0" />
                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate" title={delivery}>
                            {delivery}
                        </span>
                    </div>
                </div>
            );
        }
    },
    {
        id: "issue_date",
        label: "Date",
        sortable: true,
        className: "w-[95px] text-center whitespace-nowrap",
        render: (row) => (
            <div className="flex items-center justify-center min-h-[22px]">
                <span className="whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {formatDisplayDate(row.date || row.issue_date || row.created_at)}
                </span>
            </div>
        )
    },
    {
        id: "net_amount",
        label: "Net Earnings",
        sortable: true,
        className: "w-[125px] whitespace-nowrap",
        render: (row) => {
            const payoutFormatted = row.supplier_amount_formatted || row.net_amount_formatted || (row.supplier_amount ? `€ ${Number(row.supplier_amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : (row.amount ? `€ ${Number(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "€ 0.00"));
            const grossFormatted = row.gross_amount_formatted || (row.gross_amount ? `€ ${Number(row.gross_amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "");

            return (
                <div className="flex flex-col min-h-[22px] justify-center leading-none gap-0.5">
                    <span className="whitespace-nowrap text-xs font-bold text-emerald-600 dark:text-emerald-400">{payoutFormatted}</span>
                    {grossFormatted && (
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 leading-none">Gross: {grossFormatted}</span>
                    )}
                </div>
            );
        }
    },
    {
        id: "payment_terms",
        label: "Payment Terms",
        sortable: true,
        className: "w-[100px] text-center whitespace-nowrap",
        render: (row) => {
            const isPayLater = row.is_pay_later || (row.payment_stage || "").toLowerCase() === "pay_later" || (row.invoice_type || "").toLowerCase() === "pay_later" || (row.payment_method || "").toLowerCase().includes("pay_later");
            return (
                <div className="flex items-center justify-center min-h-[22px]">
                    <Badge variant={isPayLater ? "info" : "secondary"} className="text-[9.5px] font-semibold whitespace-nowrap px-1.5 py-0.25">
                        {isPayLater ? "Pay Later" : "Immediate"}
                    </Badge>
                </div>
            );
        }
    },
    {
        id: "stage",
        label: "Settlement Stage",
        sortable: true,
        className: "w-[125px] text-center whitespace-nowrap",
        render: (row) => {
            const stage = (row.payment_stage || "").toLowerCase();
            const isCleared = row.is_cleared || stage === "cleared";
            const isInEscrow = row.is_in_escrow || stage === "in_escrow";
            const isPayLater = row.is_pay_later || stage === "pay_later";

            let displayStage = "Pending";
            let variant: any = "warning";

            if (isCleared) {
                displayStage = "Cleared & Available";
                variant = "success";
            } else if (isInEscrow) {
                displayStage = "In Escrow";
                variant = "secondary";
            } else if (isPayLater) {
                displayStage = "Pay Later (Due)";
                variant = "warning";
            } else {
                displayStage = row.payment_stage_label || "Pending";
                variant = "warning";
            }

            return (
                <div className="flex items-center justify-center min-h-[22px]">
                    <Badge variant={variant} showDot className="text-[9.5px] font-bold whitespace-nowrap px-1.5 py-0.25">
                        {displayStage}
                    </Badge>
                </div>
            );
        }
    }
];

export default getPaymentColumns;
