import React from "react";

export enum InvoiceStatus {
    UNPAID = "unpaid",
    PENDING = "pending",
    DUE = "due",
    OVERDUE = "overdue",
    PAID = "paid",
    IN_ESCROW = "in_escrow",
    CANCELLED = "cancelled",
}

export enum PaymentStatus {
    PENDING = "pending",
    SUCCEEDED = "succeeded",
    FAILED = "failed",
    REFUNDED = "refunded",
    IN_ESCROW = "in_escrow",
}

export enum PaymentMethod {
    CARD = "card",
    STRIPE = "stripe",
    PAY_LATER = "pay_later",
    BANK_TRANSFER = "bank_transfer",
}

export enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    BOOKED = "booked",
    DRIVER_ASSIGNED = "driver_assigned",
    PICKED_UP = "picked_up",
    IN_TRANSIT = "in_transit",
    DELIVERED = "delivered",
    POD_UPLOADED = "pod_uploaded",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
}

export function parseInvoiceStatus(raw?: string): InvoiceStatus {
    if (!raw) return InvoiceStatus.DUE;
    const s = String(raw).toLowerCase().trim();
    if (s === "paid" || s === "settled" || s === "succeeded" || s === "cleared" || s === "completed") {
        return InvoiceStatus.PAID;
    }
    if (s === "in_escrow" || s === "in escrow" || s === "escrow" || s === "held") {
        return InvoiceStatus.IN_ESCROW;
    }
    if (s === "overdue" || s === "late") {
        return InvoiceStatus.OVERDUE;
    }
    if (s === "due" || s === "awaiting_payment" || s === "awaiting payment") {
        return InvoiceStatus.DUE;
    }
    if (s === "pending" || s === "processing") {
        return InvoiceStatus.PENDING;
    }
    if (s === "unpaid") {
        return InvoiceStatus.UNPAID;
    }
    if (s === "cancelled" || s === "canceled" || s === "void" || s === "rejected") {
        return InvoiceStatus.CANCELLED;
    }
    return InvoiceStatus.DUE;
}

export function getInvoiceStatusLabel(status: InvoiceStatus): string {
    switch (status) {
        case InvoiceStatus.PAID:
            return "Paid";
        case InvoiceStatus.IN_ESCROW:
            return "In Escrow";
        case InvoiceStatus.DUE:
            return "Due";
        case InvoiceStatus.OVERDUE:
            return "Overdue";
        case InvoiceStatus.PENDING:
            return "Pending";
        case InvoiceStatus.UNPAID:
            return "Unpaid";
        case InvoiceStatus.CANCELLED:
            return "Cancelled";
        default:
            return "Due";
    }
}

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

export function parsePaymentStatus(raw?: string): PaymentStatus {
    if (!raw) return PaymentStatus.PENDING;
    const s = String(raw).toLowerCase().trim();
    if (s === "succeeded" || s === "paid" || s === "completed" || s === "settled") {
        return PaymentStatus.SUCCEEDED;
    }
    if (s === "in_escrow" || s === "in escrow" || s === "held" || s === "processing") {
        return PaymentStatus.IN_ESCROW;
    }
    if (s === "refunded" || s === "partially_refunded") {
        return PaymentStatus.REFUNDED;
    }
    if (s === "failed" || s === "declined" || s === "cancelled") {
        return PaymentStatus.FAILED;
    }
    return PaymentStatus.PENDING;
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
