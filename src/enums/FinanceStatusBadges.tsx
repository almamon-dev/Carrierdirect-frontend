import React from "react";
import {
    InvoiceStatus,
    PaymentStatus,
    parseInvoiceStatus,
    parsePaymentStatus
} from "./FinanceStatus";

export function renderInvoiceStatusBadge(rawStatus?: string, isPayLater?: boolean) {
    if (isPayLater) {
        return (
            <div className="flex items-center min-h-[22px]">
                <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                    Net-30
                </span>
            </div>
        );
    }

    const enumVal = parseInvoiceStatus(rawStatus);

    switch (enumVal) {
        case InvoiceStatus.PAID:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="inline-flex items-center gap-1 bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                        Paid
                    </span>
                </div>
            );
        case InvoiceStatus.IN_ESCROW:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                        In Escrow
                    </span>
                </div>
            );
        case InvoiceStatus.OVERDUE:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="inline-flex items-center gap-1 bg-[#fff1f2] dark:bg-rose-950/40 text-[#e11d48] dark:text-rose-300 border border-[#fecdd3] dark:border-rose-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                        Overdue
                    </span>
                </div>
            );
        case InvoiceStatus.PENDING:
        case InvoiceStatus.UNPAID:
        case InvoiceStatus.DUE:
        default:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="inline-flex items-center gap-1 bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-300 border border-[#fde68a] dark:border-amber-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                        Due
                    </span>
                </div>
            );
    }
}

export function renderPaymentStatusBadge(rawStatus?: string, isPayLater?: boolean) {
    if (isPayLater) {
        return (
            <div className="flex items-center min-h-[22px]">
                <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                    Net-30
                </span>
            </div>
        );
    }

    const enumVal = parsePaymentStatus(rawStatus);

    switch (enumVal) {
        case PaymentStatus.SUCCEEDED:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="inline-flex items-center gap-1 bg-[#ecfdf5] dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                        Succeeded
                    </span>
                </div>
            );
        case PaymentStatus.IN_ESCROW:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                        In Escrow
                    </span>
                </div>
            );
        case PaymentStatus.REFUNDED:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                        Refunded
                    </span>
                </div>
            );
        case PaymentStatus.FAILED:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="inline-flex items-center gap-1 bg-[#fff1f2] dark:bg-rose-950/40 text-[#e11d48] dark:text-rose-300 border border-[#fecdd3] dark:border-rose-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                        Failed
                    </span>
                </div>
            );
        case PaymentStatus.PENDING:
        default:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className="inline-flex items-center gap-1 bg-[#fffbeb] dark:bg-amber-950/40 text-[#d97706] dark:text-amber-300 border border-[#fde68a] dark:border-amber-800/60 text-[11.5px] px-2 py-0.5 rounded-[4px] font-semibold whitespace-nowrap">
                        Pending
                    </span>
                </div>
            );
    }
}
