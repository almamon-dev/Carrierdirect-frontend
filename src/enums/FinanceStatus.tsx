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

export {
    renderInvoiceStatusBadge,
    renderPaymentStatusBadge
} from "./FinanceStatusBadges";
