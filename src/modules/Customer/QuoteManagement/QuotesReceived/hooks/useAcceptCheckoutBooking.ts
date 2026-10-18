import React, { useState, useEffect } from "react";
import { useToastStore } from "@/stores/useToastStore";
import { CardData, validateCreditCardData } from "../components/checkoutCardUtils";
import { dispatchCheckoutSuccessEvents } from "../utils/checkoutEventHelpers";
import { 
    buildPaymentPayload, 
    executePayNowBooking, 
    executePayLaterBooking 
} from "../utils/checkoutApiHelpers";

export interface UseAcceptCheckoutBookingProps {
    rawQuote: any;
    cleanQuoteId: string;
    quote: any;
    discountAmount: number;
    canUsePayLater: boolean;
    checkPayLaterOrLock: () => boolean;
    payLaterLimit: number;
    savedCards: any[];
    selectedCardId: string | null;
    paymentTab: "saved_card" | "new_card";
    setPaymentTab: (tab: "saved_card" | "new_card") => void;
    loadSavedCards?: () => Promise<void>;
}

export function useAcceptCheckoutBooking({
    rawQuote,
    cleanQuoteId,
    quote,
    discountAmount,
    canUsePayLater,
    checkPayLaterOrLock,
    payLaterLimit,
    savedCards,
    selectedCardId,
    paymentTab,
    setPaymentTab,
    loadSavedCards,
}: UseAcceptCheckoutBookingProps) {
    const showToast = useToastStore((state) => state.showToast);

    const [paymentOption, setPaymentOption] = useState<"pay_now" | "pay_later">("pay_now");
    const [saveCard, setSaveCard] = useState(true);
    const [agreedTerms, setAgreedTerms] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const [orderData, setOrderData] = useState<{
        order_number?: string;
        invoice_number?: string;
        order_id?: number | string;
        invoice_id?: number | string;
    } | null>(null);

    const [cardData, setCardData] = useState<CardData>({
        cardName: "",
        cardNumber: "",
        expDate: "",
        cvc: "",
    });
    const [checkoutSubmitted, setCheckoutSubmitted] = useState(false);

    useEffect(() => {
        if (!canUsePayLater && paymentOption === "pay_later") {
            setPaymentOption("pay_now");
        }
    }, [canUsePayLater, paymentOption]);

    const handleConfirmBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setCheckoutSubmitted(true);

        if (!agreedTerms) {
            showToast("Please agree to the Terms of Service to proceed.", "error");
            return;
        }

        if (paymentOption === "pay_now") {
            if (paymentTab === "saved_card") {
                if (!selectedCardId && savedCards.length > 0) {
                    showToast("Please select a saved payment card.", "error");
                    return;
                }
                if (savedCards.length === 0) {
                    showToast("Please enter credit card details.", "error");
                    setPaymentTab("new_card");
                    return;
                }
            } else {
                const cardErrors = validateCreditCardData(cardData);
                if (Object.keys(cardErrors).length > 0) {
                    const firstError = Object.values(cardErrors)[0];
                    showToast(firstError || "Please enter valid credit card details.", "error");
                    return;
                }
            }
        }

        if (isProcessing) return;
        setIsProcessing(true);

        try {
            const targetQuoteId = rawQuote?.id || cleanQuoteId;
            const cleanId = String(targetQuoteId).replace(/[^0-9]/g, "");

            if (paymentOption === "pay_now") {
                const paymentPayload = buildPaymentPayload(
                    paymentTab,
                    selectedCardId,
                    savedCards,
                    cardData,
                    discountAmount,
                    saveCard
                );

                const bookingRes = await executePayNowBooking({
                    targetQuoteId,
                    paymentPayload,
                    discountAmount,
                });

                if (saveCard && loadSavedCards) {
                    try {
                        await loadSavedCards();
                    } catch (e) {
                        console.error("Failed to reload saved cards:", e);
                    }
                }

                setOrderData({
                    order_number: bookingRes.orderNum,
                    invoice_number: bookingRes.invNum,
                    order_id: bookingRes.orderId,
                    invoice_id: bookingRes.invoiceId,
                });

                await dispatchCheckoutSuccessEvents({
                    targetQuoteId,
                    cleanId,
                    orderNum: bookingRes.orderNum,
                    quoteIdStr: quote.id,
                    totalAmount: quote.totalAmount,
                    paymentOption: "pay_now",
                });

                showToast("Payment confirmed! Booking is being processed via secure escrow.", "success");
                setIsBookingSuccess(true);
            } else {
                if (!checkPayLaterOrLock()) {
                    setCheckoutSubmitted(false);
                    return;
                }
                if (quote.totalAmount > payLaterLimit) {
                    showToast(`Insufficient Pay Later credit balance. Your available credit is €${payLaterLimit.toLocaleString()}, but this order total is €${quote.totalAmount.toLocaleString()}.`, 'error');
                    setCheckoutSubmitted(false);
                    return;
                }

                const bookingRes = await executePayLaterBooking({
                    targetQuoteId,
                    discountAmount,
                });

                setOrderData({
                    order_number: bookingRes.orderNum,
                    invoice_number: bookingRes.invNum,
                    order_id: bookingRes.orderId,
                    invoice_id: bookingRes.invoiceId,
                });

                await dispatchCheckoutSuccessEvents({
                    targetQuoteId,
                    cleanId,
                    orderNum: bookingRes.orderNum,
                    quoteIdStr: quote.id,
                    totalAmount: quote.totalAmount,
                    paymentOption: "pay_later",
                });

                showToast("Quote accepted & booking confirmed successfully!", "success");
                setIsBookingSuccess(true);
            }
        } catch (error: any) {
            console.error("Booking error:", error);
            if (error?.response?.data?.upgrade_required) {
                checkPayLaterOrLock();
                return;
            }
            const msg = error?.response?.data?.message || error?.message || "Failed to confirm booking.";
            showToast(msg, "error");
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        paymentOption,
        setPaymentOption,
        saveCard,
        setSaveCard,
        agreedTerms,
        setAgreedTerms,
        isProcessing,
        isBookingSuccess,
        orderData,
        cardData,
        setCardData,
        checkoutSubmitted,
        handleConfirmBooking,
    };
}
