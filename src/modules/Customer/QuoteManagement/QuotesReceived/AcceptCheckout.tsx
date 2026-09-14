import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import {
    ArrowLeft,
    Loader2,
    Lock,
    ExternalLink,
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
} from "./components/AcceptCheckoutPaymentCard";
import { AcceptCheckoutSuccessModal } from "./components/AcceptCheckoutSuccessModal";

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

        // If no explicit charges array but base_amount and total amount differ
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
        distance: rawQuote?.distance || req?.distance || "450 km",
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
    const [payNowMethod, setPayNowMethod] = useState<"card" | "sepa">("card");
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

        if (paymentOption === "pay_now") {
            const cardErrors = validateCreditCardData(cardData);
            if (Object.keys(cardErrors).length > 0) {
                const firstError = Object.values(cardErrors)[0];
                showToast(firstError || "Please enter valid credit card details.", "error");
                return;
            }
        }

        if (!agreedTerms || isProcessing) return;

        setIsProcessing(true);
        try {
            const targetQuoteId = rawQuote?.id || cleanQuoteId;
            let acceptRes: any = null;

            if (targetQuoteId) {
                acceptRes = await apiClient.post(`/customer/quotes/${targetQuoteId}/accept`, {
                    discount_amount: discountAmount,
                });
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

            // If Pay Later selected, settle with Pay Later endpoint
            if (paymentOption === "pay_later" && invoiceId) {
                try {
                    await apiClient.post(`/customer/invoices/${invoiceId}/pay-later`);
                } catch (e: any) {
                    console.log("Pay later invoice auto-settle status:", e?.message);
                }
            } else if (paymentOption === "pay_now" && invoiceId) {
                // If user selected instant card payment
                try {
                    const payRes = await apiClient.post(`/customer/invoices/${invoiceId}/pay`);
                    const checkoutUrl = payRes?.data?.data?.checkout_url || payRes?.data?.checkout_url;
                    if (checkoutUrl && payNowMethod === "card") {
                        // User can be redirected or we show the Escrow success modal
                    }
                } catch { }
            }

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
        <div className="pt-5 sm:pt-6 pb-8 px-3.5 sm:px-6 w-full font-sans antialiased text-slate-800 dark:text-slate-100 min-h-[85vh]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3">
                <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Accept Quote & Secure Booking
                        </h1>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200/80 dark:border-orange-900/50">
                            {quote.id}
                        </span>
                    </div>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
                        Authorize carrier booking for RFQ <span className="font-bold text-[#ff4a1f]">{quote.requestId}</span> with Escrow payment protection.
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="sm"
                    icon={<ArrowLeft size={13} />}
                    onClick={() => navigate(-1)}
                    className="h-8 px-3.5 text-xs font-bold rounded-[4px] shrink-0 bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                    Back to Details
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
                <div className="lg:col-span-7 space-y-3.5">
                    <AcceptCheckoutSummaryCard quote={quote} />
                    <AcceptCheckoutPaymentCard
                        paymentOption={paymentOption}
                        setPaymentOption={setPaymentOption}
                        payNowMethod={payNowMethod}
                        setPayNowMethod={setPayNowMethod}
                        cardData={cardData}
                        setCardData={setCardData}
                        totalAmount={quote.totalAmount}
                        payLaterLimit={payLaterLimit}
                        payLaterStatus={payLaterStatus}
                        submitted={checkoutSubmitted}
                    />
                </div>

                <div className="lg:col-span-5 space-y-3.5">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100">Payment Breakdown</h2>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] border border-orange-200/80 dark:border-orange-900/50">
                                Protected Rate
                            </span>
                        </div>

                        <div className="space-y-2 text-[11.5px] text-slate-600 dark:text-slate-400">
                            {/* Base Freight Rate */}
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-700 dark:text-slate-300">Base Freight Transport</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">€{quote.baseFreightAmount.toLocaleString()}</span>
                            </div>

                            {/* Dashed Separator Line between Base Freight and Additions */}
                            {(quote.extraCharges.length > 0 || quote.insuranceAmount > 0 || quote.loadingUnloadingAmount > 0) && (
                                <div className="border-t border-dashed border-slate-200 dark:border-slate-800 my-1" />
                            )}

                            {/* Extra Surcharges & Services breakdown */}
                            {quote.extraCharges.length > 0 && (
                                <div className="space-y-1.5 pl-2">
                                    {quote.extraCharges.map((charge, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] shrink-0" />
                                                <span>{charge.custom_name || charge.type || `Extra Service #${idx + 1}`}</span>
                                            </span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                +€{Number(charge.amount).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Goods Cargo Insurance */}
                            {quote.insuranceAmount > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Goods Cargo Insurance</span>
                                    <span className="font-bold text-slate-900 dark:text-slate-100">+€{quote.insuranceAmount.toLocaleString()}</span>
                                </div>
                            )}

                            {/* Loading/Unloading */}
                            {quote.loadingUnloadingAmount > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Loading / Unloading Service</span>
                                    <span className="font-bold text-slate-900 dark:text-slate-100">+€{quote.loadingUnloadingAmount.toLocaleString()}</span>
                                </div>
                            )}

                            {/* Dashed Separator Line before Platform Charge */}
                            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 my-1" />

                            {/* Platform Charge */}
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-slate-700 dark:text-slate-300">Platform System Charge ({quote.systemChargePercent}%)</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">€{quote.systemChargeAmount.toLocaleString()}</span>
                            </div>

                            {/* Dashed Separator Line between Platform Charge and Promo/Discount */}
                            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 my-1" />

                            {/* Discount Row */}
                            <div className={`flex justify-between items-center ${quote.discountAmount > 0 ? "text-emerald-600 dark:text-emerald-400 font-semibold" : ""}`}>
                                <span className="font-medium text-slate-700 dark:text-slate-300">Discount / Promo</span>
                                <span className={quote.discountAmount > 0 ? "font-bold" : "font-bold text-slate-900 dark:text-slate-100"}>
                                    {quote.discountAmount > 0 ? `-€${quote.discountAmount.toLocaleString()}` : "€0"}
                                </span>
                            </div>

                            {/* Dashed Separator Line before Total */}
                            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 my-1" />

                            {/* Total Row */}
                            <div className="pt-2 pb-1 flex justify-between items-baseline">
                                <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">Total Authorized Amount</span>
                                <span className="text-xl font-black text-[#ff4a1f]">€{quote.totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        <form onSubmit={handleConfirmBooking} className="space-y-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-start gap-2 pt-0.5">
                                <input
                                    id="checkout-agree-terms"
                                    type="checkbox"
                                    checked={agreedTerms}
                                    onChange={(e) => setAgreedTerms(e.target.checked)}
                                    className="w-4 h-4 mt-0.5 text-[#ff4a1f] accent-[#ff4a1f] border-slate-300 rounded-[3px] cursor-pointer shrink-0"
                                />
                                <label
                                    htmlFor="checkout-agree-terms"
                                    className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none leading-relaxed"
                                >
                                    I agree to CarrierDirect{" "}
                                    <Link
                                        to="/support/terms"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-[#ff4a1f] hover:underline font-bold inline-flex items-center gap-0.5"
                                    >
                                        <span>Terms and Conditions</span>
                                    </Link>{" "}
                                    & authorize carrier booking.
                                </label>
                            </div>

                            <Button
                                type="submit"
                                disabled={!agreedTerms || isProcessing}
                                className="w-full h-10 bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold text-xs shadow-xs rounded-[4px] cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 mt-1"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        <span>Authorizing Booking...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock size={13.5} />
                                        <span>
                                            {paymentOption === "pay_later"
                                                ? `Confirm Net-30 Booking (€${quote.totalAmount.toLocaleString()})`
                                                : `Confirm & Authorize €${quote.totalAmount.toLocaleString()}`}
                                        </span>
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <AcceptCheckoutSuccessModal
                isOpen={isBookingSuccess}
                quote={quote}
                orderData={orderData}
                paymentMethod={paymentOption}
            />
        </div>
    );
}
