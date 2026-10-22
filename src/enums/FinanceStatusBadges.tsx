import React from "react";
import {
    InvoiceStatus,
    PaymentStatus,
    parseInvoiceStatus,
    parsePaymentStatus
} from "./FinanceStatus";
import { STATUS_CATEGORY_STYLES, STATUS_BADGE_BASE_CLASS } from "@/components/common/StatusBadge";

export function renderInvoiceStatusBadge(rawStatus?: string, isPayLater?: boolean) {
    if (isPayLater) {
        return (
            <div className="flex items-center min-h-[22px]">
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.financial_hold.className}`}>
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
                    <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.success.className}`}>
                        Paid
                    </span>
                </div>
            );
        case InvoiceStatus.IN_ESCROW:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.financial_hold.className}`}>
                        In Escrow
                    </span>
                </div>
            );
        case InvoiceStatus.OVERDUE:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.action_required.className}`}>
                        Overdue
                    </span>
                </div>
            );
        case InvoiceStatus.CANCELLED:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.failed.className}`}>
                        Cancelled
                    </span>
                </div>
            );
        case InvoiceStatus.PENDING:
        case InvoiceStatus.UNPAID:
        case InvoiceStatus.DUE:
        default:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.pending.className}`}>
                        {enumVal === InvoiceStatus.PENDING ? "Pending" : enumVal === InvoiceStatus.UNPAID ? "Unpaid" : "Due"}
                    </span>
                </div>
            );
    }
}

export function renderPaymentStatusBadge(rawStatus?: string, isPayLater?: boolean) {
    if (isPayLater) {
        return (
            <div className="flex items-center min-h-[22px]">
                <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.financial_hold.className}`}>
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
                    <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.success.className}`}>
                        Succeeded
                    </span>
                </div>
            );
        case PaymentStatus.IN_ESCROW:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.financial_hold.className}`}>
                        In Escrow
                    </span>
                </div>
            );
        case PaymentStatus.REFUNDED:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.neutral.className}`}>
                        Refunded
                    </span>
                </div>
            );
        case PaymentStatus.FAILED:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.failed.className}`}>
                        Failed
                    </span>
                </div>
            );
        case PaymentStatus.PENDING:
        default:
            return (
                <div className="flex items-center min-h-[22px]">
                    <span className={`${STATUS_BADGE_BASE_CLASS} ${STATUS_CATEGORY_STYLES.pending.className}`}>
                        Pending
                    </span>
                </div>
            );
    }
}
