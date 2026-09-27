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
import Button from "@/components/ui/button";
import { useToastStore } from "@/stores/useToastStore";
import apiClient from "@/lib/axios";
import { decryptId } from "@/lib/encryption";
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
    const { quote: fetchedQuote, loading: fetchLoading } = useQuoteViewDetail(
        stateQuote ? undefined : cleanQuoteId
    );

    const rawQuote = stateQuote || fetchedQuote;
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
                const amount = Number(item?.amount || item?.price || item?.fee || 0);
                return { type, custom_name, amount };
            })
            .filter((item: any) => item.amount > 0);

        if (list.length === 0 && rawQuote?.base_amount && (rawQuote?.amount_raw || rawQuote?.amount)) {
            const rawTotal = Number(rawQuote.amount_raw || parseFloat(String(rawQuote.amount).replace(/[^0-9.]/g, "")) || 0);
            const rawBase = Number(rawQuote.base_amount);
            if (rawTotal > rawBase && rawBase > 0) {
                list.push({
                    type: "Extra Surcharges",
                    custom_name: "Carrier Surcharges & Handling",
                    amount: rawTotal - rawBase,
                });
            }
        }

        return list;
    };

    const extraCharges = extractCharges();
    const extraTotal = extraCharges.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

    const totalRaw = Number(
        rawQuote?.amount_raw ??
        rawQuote?.amount ??
        (rawQuote?.amount ? parseFloat(String(rawQuote.amount).replace(/[^0-9.]/g, "")) : 4000)
    );

    const baseFreightAmount = Number(
        rawQuote?.base_amount ??
        rawQuote?.pricing?.baseFreight ??
        (rawQuote?.freightAmount ? Number(rawQuote.freightAmount) : null) ??
        (totalRaw > extraTotal && extraTotal > 0 ? totalRaw - extraTotal : totalRaw)
    );

    const insuranceAmount = Number(rawQuote?.insuranceAmount ?? rawQuote?.insurance_amount ?? rawQuote?.pricing?.insurance ?? 0);
    const loadingUnloadingAmount = Number(rawQuote?.loadingUnloadingAmount ?? rawQuote?.loading_unloading_amount ?? rawQuote?.pricing?.loadingUnloading ?? 0);
    const discountAmount = Number(rawQuote?.discount_amount ?? rawQuote?.discount ?? 0);

    // 10% System charge split: 5% customer platform fee, 5% supplier fee
    const systemChargePercent = 5;
    const subtotalBeforePlatform = baseFreightAmount + extraTotal + insuranceAmount + loadingUnloadingAmount;
    const systemChargeAmount = Math.round(subtotalBeforePlatform * (systemChargePercent / 100));

    // Subtotal & Total
    const subtotal = subtotalBeforePlatform + systemChargeAmount;
    const totalAmount = Math.max(0, subtotal - discountAmount);

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
        distance: rawQuote?.distance || (rawQuote?.distance_km ? `${rawQuote.distance_km} km` : (req?.distance || (req?.distance_km ? `${req.distance_km} km` : "—"))),
        transitTime: rawQuote?.transit_time || rawQuote?.estimated_time || req?.transit_time || "1 - 2 Business Days",
        handlingServices: rawQuote?.handling_services || req?.handling_services || ["Tail-lift assistance", "GPS Live Tracking", "Loading Support"],
        notes: rawQuote?.notes || req?.additional_notes || req?.notes || rawQuote?.special_instructions || "Direct dock-to-dock transport with carrier direct escrow verification.",
        baseFreightAmount,
        extraCharges,
        extraTotal,
        insuranceAmount,
        loadingUnloadingAmount,
        discountAmount,
        systemChargePercent,
        systemChargeAmount,
        totalAmount: totalAmount > 0 ? totalAmount : 4200,
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
            let acceptRes: any = null;

            const cleanNum = cardData.cardNumber.replace(/\D/g, "");
            const brand = detectCardBrand(cleanNum);

            if (targetQuoteId) {
                acceptRes = await apiClient.post(`/customer/quotes/${targetQuoteId}/accept`, {
                    discount_amount: discountAmount,
                    payment_option: paymentOption,
                    payment_tab: paymentTab,
                    saved_card_id: paymentTab === "saved_card" ? selectedCardId : null,
                    ...(paymentOption === "pay_now" && paymentTab === "new_card" ? {
                        card_name: cardData.cardName,
                        card_number: cardData.cardNumber,
                        card_last_four: cleanNum.slice(-4),
                        card_brand: brand === "generic" ? "Visa" : brand.toUpperCase(),
                        card_expiry: cardData.expDate,
                        save_card: saveCard,
                    } : {}),
                });
            }

            // Optionally persist new card if requested
            if (paymentOption === "pay_now" && paymentTab === "new_card" && saveCard && cleanNum) {
                try {
                    const expParts = cardData.expDate.split("/");
                    await apiClient.post("/subscription/payment-methods", {
                        cardholder_name: cardData.cardName,
                        card_number: cleanNum,
                        exp_month: expParts[0],
                        exp_year: expParts[1],
                        cvc: cardData.cvc,
                        is_primary: savedCards.length === 0,
                    });
                } catch (cardErr) {
                    console.log("Card save warning (ignored):", cardErr);
                }
            }

            const resData = acceptRes?.data?.data || acceptRes?.data || {};
            const createdOrderNumber = resData?.order_number || `ORD-${String(targetQuoteId || 1001).padStart(4, "0")}`;
            const createdInvoiceNumber = resData?.invoice_number || `INV-${String(targetQuoteId || 202545).padStart(4, "0")}`;
            const invoiceId = resData?.invoice_id;

            setOrderData({
                order_number: createdOrderNumber,
                invoice_number: createdInvoiceNumber,
                order_id: resData?.order_id,
                invoice_id: invoiceId,
            });

            window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
            showToast("Quote accepted & booking confirmed successfully!", "success");
            setIsBookingSuccess(true);
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
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer mr-2"
                        >
                            <ArrowLeft size={14} />
                            <span>Back to quote</span>
                        </button>
                        <span className="text-slate-300 dark:text-slate-700">/</span>
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Complete Booking &amp; Escrow Payment
                        </h1>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[3px] text-[11px] font-bold bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200/80 dark:border-orange-900/50">
                            {quote.id}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Authorize carrier booking for RFQ <span className="font-bold text-[#ff4a1f]">{quote.requestId}</span> with 100% Escrow Protection Guarantee.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span>Escrow Protected</span>
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

                            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                                <span>Platform Fee ({quote.systemChargePercent}%)</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">
                                    €{quote.systemChargeAmount.toLocaleString()}
                                </span>
                            </div>

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
