import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
    Lock,
    ShieldCheck,
    RotateCcw,
    CheckCircle2,
    Truck,
    Building2,
    CreditCard,
    ExternalLink,
    FileText,
} from "lucide-react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Button from "@/components/ui/button";
import { useToastStore } from "@/stores/useToastStore";
import apiClient from "@/lib/axios";
import { decryptId } from "@/lib/encryption";
import { getStripe } from "@/lib/stripe";
import { useQuoteViewDetail } from "./hooks/useQuoteViewDetail";
import { AcceptCheckoutSummaryCard } from "./components/AcceptCheckoutSummaryCard";
import {
    AcceptCheckoutPaymentCard,
    CardData,
    validateCreditCardData,
    detectCardBrand,
} from "./components/AcceptCheckoutPaymentCard";
import { AcceptCheckoutSuccessModal } from "./components/AcceptCheckoutSuccessModal";
import { AddPaymentMethodModal } from "@/modules/Customer/Settings/components/AddPaymentMethodModal";
import { resolveQuoteDistance } from "@/utils/geoDistance";

const formatQuoteId = (idStr?: string | number): string => {
    if (!idStr) return "QT-0001";
    const str = String(idStr).trim();
    const cleanNum = str.replace(/[^0-9]/g, "");
    return cleanNum ? `QT-${cleanNum.padStart(4, "0")}` : str;
};

const formatReqId = (idStr?: string | number): string => {
    if (!idStr) return "REQ-0001";
    const str = String(idStr).trim();
    const cleanNum = str.replace(/[^0-9]/g, "");
    return cleanNum ? `REQ-${cleanNum.padStart(4, "0")}` : str;
};

export default function CustomerAcceptCheckout() {
    const { quoteId } = useParams<{ quoteId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const showToast = useToastStore((state) => state.showToast);

    // Decrypt quote ID from parameter if encrypted
    const cleanQuoteId = quoteId ? decryptId(quoteId) : "";
    const stateQuote = location.state?.quote;

    // Use hook to fetch quote if not passed via route state
    const { quote: fetchedQuote, loading: fetchLoading } = useQuoteViewDetail(cleanQuoteId);

    const rawQuote = fetchedQuote || stateQuote;
    const req = (rawQuote as any)?.quote_request || (rawQuote as any)?.request || (rawQuote as any)?.logistics || {};

    // Dynamic credit limit & payment profile state (fetched dynamically from database)
    const [payLaterLimit, setPayLaterLimit] = useState<number>(80000);
    const [payLaterStatus, setPayLaterStatus] = useState<string>("approved");

    useEffect(() => {
        const fetchPaymentProfile = async () => {
            try {
                const res: any = await apiClient.get("/customer/profile");
                const profileData = res?.data?.data || res?.data || {};

                const dynamicLimit =
                    profileData.pay_later_limit ??
                    profileData.pay_later_available ??
                    profileData.payment_info?.pay_later_limit;

                if (dynamicLimit !== undefined && dynamicLimit !== null) {
                    setPayLaterLimit(Number(dynamicLimit));
                }

                const dynamicStatus =
                    profileData.pay_later_status ??
                    profileData.payment_info?.pay_later_status;

                if (dynamicStatus) {
                    setPayLaterStatus(dynamicStatus);
                }
            } catch (e) {
                console.log("Customer payment profile fetch error:", e);
            }
        };
        fetchPaymentProfile();
    }, []);

    // Saved Cards State
    const [savedCards, setSavedCards] = useState<any[]>([]);
    const [isLoadingCards, setIsLoadingCards] = useState<boolean>(false);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [paymentTab, setPaymentTab] = useState<"saved_card" | "new_card">("saved_card");
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);

    const loadSavedCards = async () => {
        setIsLoadingCards(true);
        try {
            const res: any = await apiClient.get("/subscription/payment-methods");
            const cards = res?.data?.saved_cards || res?.data?.data?.saved_cards || [];
            setSavedCards(cards);

            if (cards.length > 0) {
                const primary = cards.find((c: any) => c.is_primary) || cards[0];
                setSelectedCardId(String(primary.id));
                setPaymentTab("saved_card");
            } else {
                setPaymentTab("new_card");
            }
        } catch (e) {
            console.log("Saved cards fetch error:", e);
            setPaymentTab("new_card");
        } finally {
            setIsLoadingCards(false);
        }
    };

    useEffect(() => {
        loadSavedCards();
    }, []);

    const handleSetPrimaryCard = async (cardId: string) => {
        try {
            await apiClient.post(`/subscription/payment-methods/${cardId}/primary`);
            setSavedCards((prev) =>
                prev.map((c) => ({
                    ...c,
                    is_primary: String(c.id) === String(cardId),
                }))
            );
            setSelectedCardId(cardId);
            showToast("Default card updated successfully", "success");
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to update default card", "error");
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        try {
            await apiClient.delete(`/subscription/payment-methods/${cardId}`);
            setSavedCards((prev) => {
                const next = prev.filter((c) => String(c.id) !== String(cardId));
                if (selectedCardId === String(cardId)) {
                    setSelectedCardId(next.length > 0 ? String(next[0].id) : null);
                    if (next.length === 0) setPaymentTab("new_card");
                }
                return next;
            });
            showToast("Card removed successfully", "success");
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to delete card", "error");
        }
    };

    const supplierName =
        rawQuote?.supplier?.company_name ||
        rawQuote?.supplier_name ||
        rawQuote?.carrier ||
        rawQuote?.supplier?.name ||
        rawQuote?.name ||
        "Carrier Direct Partner";

    const supplierRating =
        rawQuote?.supplier?.rating
            ? `${rawQuote.supplier.rating} ★`
            : rawQuote?.rating
                ? `${rawQuote.rating} ★`
                : "4.9 ★";

    const parseAmount = (val: any): number => {
        if (val === null || val === undefined) return 0;
        if (typeof val === "number") return isNaN(val) ? 0 : val;
        const str = String(val).replace(/[^0-9.-]/g, "").trim();
        const num = parseFloat(str);
        return isNaN(num) ? 0 : num;
    };

    // Robust extra charges extractor
    const extractCharges = (): Array<{ type: string; custom_name: string; amount: number }> => {
        let source =
            rawQuote?.extra_charges ??
            rawQuote?.extraCharges ??
            rawQuote?.extra_fees ??
            rawQuote?.extraFeeItems ??
            rawQuote?.surcharges ??
            rawQuote?.pricing?.extra_charges ??
            rawQuote?.pricing?.extraCharges ??
            stateQuote?.extra_charges ??
            stateQuote?.extraCharges ??
            req?.extra_charges ??
            [];

        if (typeof source === "string") {
            try {
                source = JSON.parse(source);
            } catch {
                source = [];
            }
        }
        if (!Array.isArray(source)) source = [];

        const list = source
            .map((item: any) => {
                const type = item?.type || item?.custom_name || item?.customName || item?.name || "Extra Service";
                const custom_name = item?.custom_name || item?.customName || item?.name || item?.type || "Extra Charge";
                const amount = parseAmount(item?.amount ?? item?.price ?? item?.fee);
                return { type, custom_name, amount };
            })
            .filter((item: any) => item.amount > 0);

        return list;
    };

    const extraCharges = extractCharges();
    const extraTotal = extraCharges.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

    const totalRaw = parseAmount(
        rawQuote?.totalAmount ??
        rawQuote?.total_amount ??
        rawQuote?.amount_raw ??
        rawQuote?.amount ??
        rawQuote?.revised_amount_raw ??
        rawQuote?.revised_amount ??
        rawQuote?.proposed_amount ??
        rawQuote?.newTotal ??
        (rawQuote as any)?.currentPrice ??
        stateQuote?.amount_raw ??
        stateQuote?.amount
    );

    const rawBase = parseAmount(
        rawQuote?.baseFreightAmount ??
        rawQuote?.base_amount_raw ??
        rawQuote?.base_amount ??
        rawQuote?.baseFreight ??
        rawQuote?.basePrice ??
        rawQuote?.base_price ??
        stateQuote?.baseFreightAmount ??
        stateQuote?.base_amount_raw
    );

    let baseFreightAmount = 0;
    let totalAmount = 0;

    if (rawBase > 0) {
        baseFreightAmount = rawBase;
        totalAmount = totalRaw > rawBase ? totalRaw : (rawBase + extraTotal);
    } else if (totalRaw > 0) {
        if (extraTotal > 0 && totalRaw > extraTotal) {
            baseFreightAmount = totalRaw - extraTotal;
            totalAmount = totalRaw;
        } else {
            baseFreightAmount = totalRaw;
            totalAmount = totalRaw + extraTotal;
        }
    } else {
        baseFreightAmount = 0;
        totalAmount = extraTotal;
    }

    const insuranceAmount = parseAmount(rawQuote?.insuranceAmount ?? rawQuote?.insurance_amount ?? rawQuote?.pricing?.insurance);
    const loadingUnloadingAmount = parseAmount(rawQuote?.loadingUnloadingAmount ?? rawQuote?.loading_unloading_amount ?? rawQuote?.pricing?.loadingUnloading);
    const discountAmount = parseAmount(rawQuote?.discount_amount ?? rawQuote?.discount);

    if (discountAmount > 0) {
        totalAmount = Math.max(0, totalAmount - discountAmount);
    }

    const distanceRes = resolveQuoteDistance({
        ...(req || {}),
        ...(rawQuote || {}),
        pickup_address: rawQuote?.pickup_address || req?.pickup_address || rawQuote?.origin_city || req?.pickup_city,
        delivery_address: rawQuote?.delivery_address || req?.delivery_address || rawQuote?.destination_city || req?.delivery_city,
        pickup_city: rawQuote?.origin_city || req?.pickup_city,
        delivery_city: rawQuote?.destination_city || req?.delivery_city,
        pickup_lat: rawQuote?.pickup_lat || req?.pickup_lat || rawQuote?.pickupLat || req?.pickupLat,
        pickup_lng: rawQuote?.pickup_lng || req?.pickup_lng || rawQuote?.pickupLng || req?.pickupLng,
        delivery_lat: rawQuote?.delivery_lat || req?.delivery_lat || rawQuote?.deliveryLat || req?.deliveryLat,
        delivery_lng: rawQuote?.delivery_lng || req?.delivery_lng || rawQuote?.deliveryLng || req?.deliveryLng,
        distance_km: rawQuote?.distance_km || req?.distance_km,
        distance: rawQuote?.distance || req?.distance,
    });

    const quote = {
        id: formatQuoteId(rawQuote?.quote_id || rawQuote?.id || cleanQuoteId),
        requestId: formatReqId(rawQuote?.request_id || rawQuote?.quote_request_id || req?.id),
        supplier: supplierName,
        rating: supplierRating,
        pickupCity: rawQuote?.origin_city || req?.pickup_city || rawQuote?.pickup_address || rawQuote?.pickupCity || rawQuote?.pickup?.city || "Origin Port",
        deliveryCity: rawQuote?.destination_city || req?.delivery_city || rawQuote?.delivery_address || rawQuote?.deliveryCity || rawQuote?.delivery?.city || "Destination Port",
        pickupAddress: rawQuote?.pickup_address || req?.pickup_address || req?.pickup || rawQuote?.pickupCity || "Dhaka, Bangladesh",
        deliveryAddress: rawQuote?.delivery_address || req?.delivery_address || req?.delivery || rawQuote?.deliveryCity || "Chittagong, Bangladesh",
        pickupDate: rawQuote?.pickup_date || req?.pickup_date || "As scheduled",
        deliveryDate: rawQuote?.delivery_date || req?.delivery_date || rawQuote?.estimated_delivery || "Standard Delivery",
        vehicleType: rawQuote?.vehicle || rawQuote?.vehicle_type || req?.vehicle_type || "Covered Van (Standard)",
        palletType: rawQuote?.pallet_type || req?.pallet_type || req?.type_of_pallets || "Standard Euro Pallet",
        weight: rawQuote?.cargo?.weight || rawQuote?.weight || req?.weight || req?.total_weight || "Standard Load (500 KG)",
        distance: distanceRes?.distanceStr && distanceRes.distanceStr !== "—" ? distanceRes.distanceStr : (rawQuote?.distance || (rawQuote?.distance_km ? `${rawQuote.distance_km} km` : (req?.distance || (req?.distance_km ? `${req.distance_km} km` : "—")))),
        transitTime: rawQuote?.transit_time || rawQuote?.estimated_time || req?.transit_time || "1 - 2 Business Days",
        handlingServices: rawQuote?.handling_services || req?.handling_services || ["Tail-lift assistance", "GPS Live Tracking", "Loading Support"],
        notes: rawQuote?.notes || req?.additional_notes || req?.notes || rawQuote?.special_instructions || "Direct dock-to-dock transport with carrier direct escrow verification.",
        baseFreightAmount,
        extraCharges,
        extraTotal,
        insuranceAmount,
        loadingUnloadingAmount,
        discountAmount,
        totalAmount,
    };

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

            if (paymentOption === "pay_now") {
                // ── REAL STRIPE PAYMENT FLOW ──────────────────────────────────
                const paymentPayload: any = {
                    discount_amount: discountAmount,
                };

                if (paymentTab === "saved_card" && selectedCardId) {
                    const savedCard = savedCards.find((c: any) => String(c.id) === String(selectedCardId));
                    const pmId = savedCard?.stripe_pm_id || savedCard?.payment_method_id || savedCard?.pm_id;
                    if (pmId) {
                        paymentPayload.payment_method_id = pmId;
                    } else {
                        throw new Error("Saved card payment method not found. Please use a new card.");
                    }
                } else {
                    const cleanNumber = cardData.cardNumber.replace(/\s/g, "");
                    const parts = cardData.expDate.split("/");
                    paymentPayload.card_number = cleanNumber;
                    paymentPayload.exp_month = parseInt(parts[0], 10);
                    paymentPayload.exp_year = parseInt("20" + parts[1], 10);
                    paymentPayload.cvc = cardData.cvc;
                    paymentPayload.card_name = cardData.cardName || "Customer";
                }

                // Step 1: Process card tokenization and intent confirmation securely on backend
                const intentRes: any = await apiClient.post(
                    `/customer/quotes/${targetQuoteId}/create-payment-intent`,
                    paymentPayload
                );
                const intentData = intentRes?.data?.data || intentRes?.data || {};
                const paymentIntentId = intentData?.payment_intent_id;

                if (!paymentIntentId && !intentData?.client_secret) {
                    throw new Error(intentRes?.data?.message || "Payment processing failed. Please check card details.");
                }

                // If 3DS action is required, handle it via Stripe.js
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

                // Step 2: Accept quote and link confirmed payment in database
                let acceptRes: any = null;
                if (targetQuoteId) {
                    acceptRes = await apiClient.post(`/customer/quotes/${targetQuoteId}/accept`, {
                        discount_amount: discountAmount,
                        payment_option: "pay_now",
                        payment_intent_id: paymentIntentId,
                    });
                }

                const resData = acceptRes?.data?.data || acceptRes?.data || {};
                const orderNum = resData?.order_number || `ORD-${String(targetQuoteId || 1001).padStart(4, "0")}`;
                const invNum = resData?.invoice_number || `INV-${String(targetQuoteId || 202545).padStart(4, "0")}`;

                setOrderData({
                    order_number: orderNum,
                    invoice_number: invNum,
                    order_id: resData?.order_id,
                    invoice_id: resData?.invoice_id,
                });

                // Sync payment completion to localStorage
                const cleanId = String(targetQuoteId).replace(/[^0-9]/g, "");
                if (cleanId) {
                    localStorage.setItem(`cd_quote_paid_${cleanId}`, "true");
                    localStorage.setItem(`cd_quote_paid_type_${cleanId}`, "pay_now");
                }
                if (targetQuoteId) {
                    localStorage.setItem(`cd_quote_paid_${targetQuoteId}`, "true");
                    localStorage.setItem(`cd_quote_paid_type_${targetQuoteId}`, "pay_now");
                }

                // Send payment complete system message to negotiation chat thread
                const quoteNumStr = quote.id || `QT-${String(cleanId || 1).padStart(4, "0")}`;
                const formattedAmt = `€${quote.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                const paymentChatMsg = `Payment completed! 🎉\nEscrow payment of ${formattedAmt} EUR has been secured via Stripe for quote #${String(quoteNumStr).replace(/^#+/, "")}. Transport Order #${orderNum} is now active.`;

                try {
                    await apiClient.post(`/customer/negotiations/${cleanId || targetQuoteId}/messages`, {
                        message: paymentChatMsg,
                        text: paymentChatMsg,
                        type: "system",
                    });
                } catch {
                    try {
                        await apiClient.post(`/negotiations/${cleanId || targetQuoteId}/messages`, {
                            message: paymentChatMsg,
                            text: paymentChatMsg,
                            type: "system",
                        });
                    } catch {}
                }

                window.dispatchEvent(new CustomEvent("carrierdirect_payment_success", { detail: { quoteId: cleanId || targetQuoteId, orderNumber: orderNum, paymentOption: "pay_now" } }));
                window.dispatchEvent(new CustomEvent("carrierdirect_negotiation_refresh"));
                window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
                showToast("Payment confirmed! Booking is being processed via secure escrow.", "success");
                setIsBookingSuccess(true);

            } else {
                // ── PAY LATER FLOW (unchanged — no real Stripe charge needed) ──
                let acceptRes: any = null;
                if (targetQuoteId) {
                    acceptRes = await apiClient.post(`/customer/quotes/${targetQuoteId}/accept`, {
                        discount_amount: discountAmount,
                        payment_option: "pay_later",
                    });
                }

                const resData = acceptRes?.data?.data || acceptRes?.data || {};
                const orderNum = resData?.order_number || `ORD-${String(targetQuoteId || 1001).padStart(4, "0")}`;
                const invNum = resData?.invoice_number || `INV-${String(targetQuoteId || 202545).padStart(4, "0")}`;

                setOrderData({
                    order_number: orderNum,
                    invoice_number: invNum,
                    order_id: resData?.order_id,
                    invoice_id: resData?.invoice_id,
                });

                // Sync payment completion to localStorage
                const cleanId = String(targetQuoteId).replace(/[^0-9]/g, "");
                if (cleanId) {
                    localStorage.setItem(`cd_quote_paid_${cleanId}`, "true");
                    localStorage.setItem(`cd_quote_paid_type_${cleanId}`, "pay_later");
                }
                if (targetQuoteId) {
                    localStorage.setItem(`cd_quote_paid_${targetQuoteId}`, "true");
                    localStorage.setItem(`cd_quote_paid_type_${targetQuoteId}`, "pay_later");
                }

                // Send pay later confirmed system message to negotiation chat thread
                const quoteNumStr = quote.id || `QT-${String(cleanId || 1).padStart(4, "0")}`;
                const formattedAmt = `€${quote.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                const payLaterChatMsg = `Pay Later booking confirmed! 📋\nBooking of ${formattedAmt} EUR is confirmed under Corporate Net-30 terms for quote #${String(quoteNumStr).replace(/^#+/, "")}. Transport Order #${orderNum} is now active.`;

                try {
                    await apiClient.post(`/customer/negotiations/${cleanId || targetQuoteId}/messages`, {
                        message: payLaterChatMsg,
                        text: payLaterChatMsg,
                        type: "system",
                    });
                } catch {
                    try {
                        await apiClient.post(`/negotiations/${cleanId || targetQuoteId}/messages`, {
                            message: payLaterChatMsg,
                            text: payLaterChatMsg,
                            type: "system",
                        });
                    } catch {}
                }

                window.dispatchEvent(new CustomEvent("carrierdirect_payment_success", { detail: { quoteId: cleanId || targetQuoteId, orderNumber: orderNum, paymentOption: "pay_later" } }));
                window.dispatchEvent(new CustomEvent("carrierdirect_negotiation_refresh"));
                window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
                showToast("Quote accepted & booking confirmed successfully!", "success");
                setIsBookingSuccess(true);
            }
        } catch (error: any) {
            console.error("Booking error:", error);
            const msg = error?.response?.data?.message || error?.message || "Failed to confirm booking.";
            showToast(msg, "error");
        } finally {
            setIsProcessing(false);
        }
    };

    if (fetchLoading && !stateQuote) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={32} className="animate-spin text-[#ff4a1f]" />
            </div>
        );
    }

    return (
        <div className="pt-4 sm:pt-6 pb-12 px-3.5 sm:px-6 max-w-7xl mx-auto w-full font-sans antialiased text-slate-800 dark:text-slate-100 min-h-[85vh]">
            {/* Top Navigation & Clean Header */}
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Complete Booking
                        </h1>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70">
                            {quote.id}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                            •
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Request: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{quote.requestId}</strong>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span>100% Escrow Protected</span>
                    </span>
                </div>
            </div>

            {/* Main 2-Column Checkout Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column: Payment Method Selection & Shipment Details */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                    {/* Payment Method Card */}
                    <AcceptCheckoutPaymentCard
                        paymentOption={paymentOption}
                        setPaymentOption={setPaymentOption}
                        paymentTab={paymentTab}
                        setPaymentTab={setPaymentTab}
                        savedCards={savedCards}
                        isLoadingCards={isLoadingCards}
                        selectedCardId={selectedCardId}
                        setSelectedCardId={setSelectedCardId}
                        onSetPrimaryCard={handleSetPrimaryCard}
                        onDeleteCard={handleDeleteCard}
                        onOpenAddCardModal={() => setIsAddCardModalOpen(true)}
                        cardData={cardData}
                        setCardData={setCardData}
                        saveCard={saveCard}
                        setSaveCard={setSaveCard}
                        totalAmount={quote.totalAmount}
                        payLaterLimit={payLaterLimit}
                        payLaterStatus={payLaterStatus}
                        submitted={checkoutSubmitted}
                    />

                    {/* Shipment & Cargo Specifications Card */}
                    <AcceptCheckoutSummaryCard quote={quote} />
                </div>

                {/* Right Column: Sticky Booking & Escrow Summary */}
                <div className="lg:col-span-5 xl:col-span-4">
                    <div className="sticky top-20 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[3px] p-5 shadow-sm space-y-4 font-sans">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                    <Truck size={15} className="text-[#ff4a1f]" />
                                    <span>Booking Summary</span>
                                </h3>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px] block mt-0.5">
                                    {quote.supplier}
                                </span>
                            </div>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-[3px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {quote.pickupCity} ➔ {quote.deliveryCity}
                            </span>
                        </div>

                        {/* Price Breakdown Line Items */}
                        <div className="space-y-2.5 text-xs">
                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                <span>Base Freight Rate</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                    €{Number(quote.baseFreightAmount).toLocaleString()}
                                </span>
                            </div>

                            {quote.extraCharges && quote.extraCharges.map((charge, idx) => (
                                <div key={idx} className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                    <span className="flex items-center gap-1.5 truncate max-w-[170px]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                                        {charge.custom_name || charge.type}
                                    </span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        +€{Number(charge.amount).toLocaleString()}
                                    </span>
                                </div>
                            ))}

                            {quote.insuranceAmount > 0 && (
                                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                    <span>Cargo Insurance</span>
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                                        +€{quote.insuranceAmount.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            

                            {quote.discountAmount > 0 && (
                                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-medium">
                                    <span>Discount / Promo</span>
                                    <span>-€{quote.discountAmount.toLocaleString()}</span>
                                </div>
                            )}

                            {/* Total Escrow Amount */}
                            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-1">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                        Total Escrow Amount
                                    </span>
                                    <span className="text-xl font-black text-[#ff4a1f] tracking-tight">
                                        €{quote.totalAmount.toLocaleString()}
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                                    All taxes &amp; platform escrow protection included.
                                </span>
                            </div>
                        </div>

                        {/* Escrow Guarantee Notice */}
                        <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 rounded-[3px] flex items-start gap-2.5">
                            <div className="p-1 bg-blue-100 dark:bg-blue-900/60 rounded-[3px] text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                                <ShieldCheck size={14} />
                            </div>
                            <div className="text-[11px] leading-relaxed">
                                <span className="font-bold text-slate-900 dark:text-slate-100 block">
                                    100% Escrow Protection
                                </span>
                                <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                                    Funds are held securely in escrow. Carrier is only paid after proof of delivery approval.
                                </span>
                            </div>
                        </div>

                        {/* What happens next */}
                        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                What happens next?
                            </p>
                            <div className="space-y-2">
                                {[
                                    "Payment authorization is safely locked in Escrow.",
                                    "The carrier is notified and route is scheduled.",
                                    "Live GPS tracking is activated once driver is en route.",
                                    "Escrow released upon your proof of delivery sign-off.",
                                ].map((text, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <div className="w-4 h-4 rounded-full bg-[#ff4a1f] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                            <span className="text-[9px] font-bold text-white leading-none">{i + 1}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight pt-0.5">
                                            {text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Terms Agreement Checkbox & Submit */}
                        <form onSubmit={handleConfirmBooking} className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-start gap-2">
                                <input
                                    id="checkout-agree-terms"
                                    type="checkbox"
                                    checked={agreedTerms}
                                    onChange={(e) => setAgreedTerms(e.target.checked)}
                                    className="w-4 h-4 mt-0.5 text-[#ff4a1f] accent-[#ff4a1f] border-slate-300 rounded-[3px] cursor-pointer shrink-0"
                                />
                                <label
                                    htmlFor="checkout-agree-terms"
                                    className="text-[11.5px] text-slate-600 dark:text-slate-400 cursor-pointer select-none leading-relaxed"
                                >
                                    I agree to CarrierDirect{" "}
                                    <Link
                                        to="/support/terms"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-[#ff4a1f] hover:underline font-bold"
                                    >
                                        Terms &amp; Conditions
                                    </Link>{" "}
                                    &amp; authorize booking.
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={!agreedTerms || isProcessing}
                                isLoading={isProcessing}
                                className="w-full h-11 text-xs sm:text-sm font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs cursor-pointer flex items-center justify-center gap-2 rounded-[3px] transition-all disabled:opacity-50"
                            >
                                <Lock size={14} />
                                <span>
                                    {paymentOption === "pay_later"
                                        ? `Confirm Net-30 Booking (€${quote.totalAmount.toLocaleString()})`
                                        : `Confirm & Authorize €${quote.totalAmount.toLocaleString()}`}
                                </span>
                            </Button>
                        </form>

                        {/* Trust Badges Footer */}
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                            <div className="space-y-1">
                                <ShieldCheck size={15} className="text-[#ff4a1f] mx-auto" />
                                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block">
                                    Secure Escrow
                                </span>
                                <span className="text-[9px] text-slate-400 block">
                                    Guaranteed hold
                                </span>
                            </div>

                            <div className="space-y-1">
                                <Lock size={15} className="text-[#ff4a1f] mx-auto" />
                                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block">
                                    256-Bit TLS
                                </span>
                                <span className="text-[9px] text-slate-400 block">
                                    Bank-grade security
                                </span>
                            </div>

                            <div className="space-y-1">
                                <RotateCcw size={15} className="text-[#ff4a1f] mx-auto" />
                                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block">
                                    Dispute Cover
                                </span>
                                <span className="text-[9px] text-slate-400 block">
                                    100% Refund guarantee
                                </span>
                            </div>
                        </div>

                        {/* Legal Disclaimer */}
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
                            By confirming, you agree to our{" "}
                            <a href="/terms" target="_blank" className="underline hover:text-slate-600 dark:hover:text-slate-300">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="/privacy" target="_blank" className="underline hover:text-slate-600 dark:hover:text-slate-300">
                                Carrier Direct Escrow Agreement
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Payment Method Modal */}
            <AddPaymentMethodModal
                isOpen={isAddCardModalOpen}
                onClose={() => setIsAddCardModalOpen(false)}
                onAddSuccess={() => {
                    loadSavedCards();
                }}
            />

            {/* Success Modal */}
            <AcceptCheckoutSuccessModal
                isOpen={isBookingSuccess}
                quote={quote}
                orderData={orderData}
                paymentMethod={paymentOption}
            />
        </div>
    );
}
