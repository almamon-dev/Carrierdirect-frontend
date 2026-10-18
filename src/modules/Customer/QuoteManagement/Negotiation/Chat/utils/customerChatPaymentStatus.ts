export const checkIsOrderPaid = (
    activeChat: any,
    activeChatId?: string | number,
    currentMessages: any[] = []
): boolean => {
    const rawQuoteId = activeChat?.raw?.quote_id || activeChat?.raw?.id || activeChat?.id || activeChatId;
    const cleanId = String(rawQuoteId || "").replace(/[^0-9]/g, "");

    return Boolean(
        (cleanId && localStorage.getItem(`cd_quote_paid_${cleanId}`) === "true") ||
        (rawQuoteId && localStorage.getItem(`cd_quote_paid_${rawQuoteId}`) === "true") ||
        activeChat?.raw?.is_paid ||
        activeChat?.raw?.has_order ||
        activeChat?.raw?.order_id ||
        activeChat?.raw?.order ||
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
        currentMessages.some((m) => {
            const t = (m.text || (m as any).message || "").toLowerCase();
            return (
                t.includes("payment completed") ||
                t.includes("pay later booking confirmed") ||
                t.includes("pay later confirmed") ||
                t.includes("funds held securely") ||
                t.includes("escrow payment of")
            );
        })
    );
};

export const checkIsQuoteAccepted = (
    activeChat: any,
    currentMessages: any[] = [],
    isOrderPaid: boolean
): boolean => {
    if (isOrderPaid) return false;

    return Boolean(
        activeChat?.raw?.status_raw === "accepted" ||
        activeChat?.raw?.status === "accepted" ||
        activeChat?.raw?.revision_status === "accepted" ||
        currentMessages.some((m) => m.type === "quote_request" && m.status === "accepted") ||
        currentMessages.some((m) => m.type === "offer" && m.status === "accepted")
    );
};
