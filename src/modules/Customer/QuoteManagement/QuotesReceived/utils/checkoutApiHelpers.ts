import apiClient from "@/lib/axios";
import { getStripe } from "@/lib/stripe";
import { CardData } from "../components/checkoutCardUtils";

export interface ExecutePayNowParams {
    targetQuoteId: string | number;
    paymentPayload: any;
    discountAmount: number;
}

export interface ExecuteBookingResult {
    orderNum: string;
    invNum: string;
    orderId?: number | string;
    invoiceId?: number | string;
}

export const buildPaymentPayload = (
    paymentTab: "saved_card" | "new_card",
    selectedCardId: string | null,
    savedCards: any[],
    cardData: CardData,
    discountAmount: number,
    saveCard: boolean = false
) => {
    const payload: any = { 
        discount_amount: discountAmount,
        save_card: Boolean(saveCard),
    };

    if (paymentTab === "saved_card" && selectedCardId) {
        const savedCard = savedCards.find((c: any) => String(c.id) === String(selectedCardId));
        const pmId = savedCard?.stripe_payment_method_id || savedCard?.stripe_pm_id || savedCard?.payment_method_id || savedCard?.pm_id || savedCard?.id;
        if (pmId) {
            payload.payment_method_id = pmId;
            payload.saved_card_id = savedCard?.id;
        } else {
            throw new Error("Saved card payment method not found. Please use a new card.");
        }
    } else {
        const cleanNumber = cardData.cardNumber.replace(/\s/g, "");
        const parts = cardData.expDate.split("/");
        payload.card_number = cleanNumber;
        payload.exp_month = parseInt(parts[0], 10);
        payload.exp_year = parseInt("20" + parts[1], 10);
        payload.cvc = cardData.cvc;
        payload.card_name = cardData.cardName || "Customer";
        payload.save_card = Boolean(saveCard);
    }

    return payload;
};

export const executePayNowBooking = async ({
    targetQuoteId,
    paymentPayload,
    discountAmount,
}: ExecutePayNowParams): Promise<ExecuteBookingResult> => {
    const intentRes: any = await apiClient.post(
        `/customer/quotes/${targetQuoteId}/create-payment-intent`,
        paymentPayload
    );
    const intentData = intentRes?.data?.data || intentRes?.data || {};
    const paymentIntentId = intentData?.payment_intent_id;

    if (!paymentIntentId && !intentData?.client_secret) {
        throw new Error(intentRes?.data?.message || "Payment processing failed. Please check card details.");
    }

    if (intentData?.requires_action && intentData?.client_secret) {
        const stripe = await getStripe(intentData.publishable_key);
        if (stripe) {
            const nextActionRes = await stripe.handleNextAction({
                clientSecret: intentData.client_secret,
            });
            if (nextActionRes.error) {
                throw new Error(nextActionRes.error.message || "3D Secure authentication failed.");
            }
        }
    }

    const acceptRes: any = await apiClient.post(`/customer/quotes/${targetQuoteId}/accept`, {
        discount_amount: discountAmount,
        payment_option: "pay_now",
        payment_intent_id: paymentIntentId,
        save_card: paymentPayload.save_card,
        card_number: paymentPayload.card_number,
        card_name: paymentPayload.card_name,
        exp_month: paymentPayload.exp_month,
        exp_year: paymentPayload.exp_year,
    });

    const resData = acceptRes?.data?.data || acceptRes?.data || {};
    return {
        orderNum: resData?.order_number || `ORD-${String(targetQuoteId || 1001).padStart(4, "0")}`,
        invNum: resData?.invoice_number || `INV-${String(targetQuoteId || 202545).padStart(4, "0")}`,
        orderId: resData?.order_id,
        invoiceId: resData?.invoice_id,
    };
};

export const executePayLaterBooking = async ({
    targetQuoteId,
    discountAmount,
}: {
    targetQuoteId: string | number;
    discountAmount: number;
}): Promise<ExecuteBookingResult> => {
    const acceptRes: any = await apiClient.post(`/customer/quotes/${targetQuoteId}/accept`, {
        discount_amount: discountAmount,
        payment_option: "pay_later",
    });

    const resData = acceptRes?.data?.data || acceptRes?.data || {};
    return {
        orderNum: resData?.order_number || `ORD-${String(targetQuoteId || 1001).padStart(4, "0")}`,
        invNum: resData?.invoice_number || `INV-${String(targetQuoteId || 202545).padStart(4, "0")}`,
        orderId: resData?.order_id,
        invoiceId: resData?.invoice_id,
    };
};
