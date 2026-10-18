import { CustomerChatMessage, CustomerChatItem } from "../../types";

export interface ResolvedQuotePaymentStatus {
    targetQuoteId: any;
    cleanQuoteId: string;
    isPayLater: boolean;
    isOrderPaid: boolean;
    orderId: any;
}

export function resolveQuotePaymentStatus(
    msg: CustomerChatMessage,
    activeChat?: CustomerChatItem | null
): ResolvedQuotePaymentStatus {
    const targetQuoteId =
        activeChat?.raw?.quote_id ||
        activeChat?.raw?.id ||
        (activeChat as any)?.quoteId ||
        activeChat?.id ||
        msg?.id ||
        1;

    const cleanQuoteId = String(targetQuoteId || "").replace(/[^0-9]/g, "");

    const isPayLater = Boolean(
        (cleanQuoteId && localStorage.getItem(`cd_quote_paid_type_${cleanQuoteId}`) === "pay_later") ||
        (targetQuoteId && localStorage.getItem(`cd_quote_paid_type_${targetQuoteId}`) === "pay_later") ||
        activeChat?.raw?.invoice?.invoice_type === "pay_later" ||
        activeChat?.raw?.order?.invoice_type === "pay_later" ||
        activeChat?.raw?.payment_option === "pay_later" ||
        activeChat?.raw?.payment_method === "pay_later" ||
        (activeChat?.raw?.invoice?.status === "due" && activeChat?.raw?.has_order) ||
        String(activeChat?.raw?.notes || "").toLowerCase().includes("pay later") ||
        String(msg?.text || (msg as any)?.message || "").toLowerCase().includes("pay later")
    );

    const isOrderPaid = Boolean(
        (cleanQuoteId && localStorage.getItem(`cd_quote_paid_${cleanQuoteId}`) === "true") ||
        (targetQuoteId && localStorage.getItem(`cd_quote_paid_${targetQuoteId}`) === "true") ||
        activeChat?.raw?.is_paid ||
        activeChat?.raw?.has_order ||
        activeChat?.raw?.order_id ||
        activeChat?.raw?.order ||
        activeChat?.raw?.invoice ||
        activeChat?.raw?.status_raw === "booked" ||
        activeChat?.raw?.status === "Booked" ||
        (activeChat as any)?.status === "Booked" ||
        (activeChat as any)?.statusRaw === "booked" ||
        activeChat?.raw?.payment_status === "succeeded" ||
        activeChat?.raw?.payment_status === "paid" ||
        activeChat?.raw?.payment_status === "completed" ||
        activeChat?.raw?.payment_option === "pay_later" ||
        activeChat?.raw?.payment_option === "pay_now" ||
        activeChat?.raw?.order?.status === "in_progress" ||
        activeChat?.raw?.order?.status === "completed" ||
        activeChat?.raw?.order?.status === "confirmed" ||
        activeChat?.raw?.order?.status === "delivered" ||
        activeChat?.raw?.invoice?.status === "paid" ||
        activeChat?.raw?.invoice?.invoice_type === "pay_later" ||
        (activeChat as any)?.isPaid ||
        (activeChat as any)?.hasOrder ||
        (msg as any)?.is_paid ||
        (msg as any)?.has_order ||
        (msg as any)?.status === "booked" ||
        String(msg?.text || (msg as any)?.message || "").toLowerCase().includes("payment completed") ||
        String(msg?.text || (msg as any)?.message || "").toLowerCase().includes("pay later booking confirmed")
    );

    const orderId = activeChat?.raw?.order_id || activeChat?.raw?.order?.id || (activeChat as any)?.orderId;

    return {
        targetQuoteId,
        cleanQuoteId,
        isPayLater,
        isOrderPaid,
        orderId,
    };
}
