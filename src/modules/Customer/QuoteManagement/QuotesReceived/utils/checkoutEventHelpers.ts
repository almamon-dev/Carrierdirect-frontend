import apiClient from "@/lib/axios";

export interface DispatchCheckoutSuccessParams {
    targetQuoteId: string | number;
    cleanId: string;
    orderNum: string;
    quoteIdStr: string;
    totalAmount: number;
    paymentOption: "pay_now" | "pay_later";
}

export const dispatchCheckoutSuccessEvents = async ({
    targetQuoteId,
    cleanId,
    orderNum,
    quoteIdStr,
    totalAmount,
    paymentOption,
}: DispatchCheckoutSuccessParams) => {
    // Sync payment completion to localStorage
    if (cleanId) {
        localStorage.setItem(`cd_quote_paid_${cleanId}`, "true");
        localStorage.setItem(`cd_quote_paid_type_${cleanId}`, paymentOption);
    }
    if (targetQuoteId) {
        localStorage.setItem(`cd_quote_paid_${targetQuoteId}`, "true");
        localStorage.setItem(`cd_quote_paid_type_${targetQuoteId}`, paymentOption);
    }

    const quoteNumStr = quoteIdStr || `QT-${String(cleanId || 1).padStart(4, "0")}`;
    const formattedAmt = `€${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const chatMsg = paymentOption === "pay_now"
        ? `Payment completed! 🎉\nEscrow payment of ${formattedAmt} EUR has been secured via Stripe for quote #${String(quoteNumStr).replace(/^#+/, "")}. Transport Order #${orderNum} is now active.`
        : `Pay Later booking confirmed! 📋\nBooking of ${formattedAmt} EUR is confirmed under Corporate Net-30 terms for quote #${String(quoteNumStr).replace(/^#+/, "")}. Transport Order #${orderNum} is now active.`;

    try {
        await apiClient.post(`/customer/negotiations/${cleanId || targetQuoteId}/messages`, {
            message: chatMsg,
            text: chatMsg,
            type: "system",
        });
    } catch {
        try {
            await apiClient.post(`/negotiations/${cleanId || targetQuoteId}/messages`, {
                message: chatMsg,
                text: chatMsg,
                type: "system",
            });
        } catch {}
    }

    window.dispatchEvent(new CustomEvent("carrierdirect_payment_success", { 
        detail: { quoteId: cleanId || targetQuoteId, orderNumber: orderNum, paymentOption } 
    }));
    window.dispatchEvent(new CustomEvent("carrierdirect_negotiation_refresh"));
    window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
};
