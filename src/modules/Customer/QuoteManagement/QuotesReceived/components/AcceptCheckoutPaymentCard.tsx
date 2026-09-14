import React, { useState, useMemo } from "react";
import { ShieldCheck, Lock, Building2, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import Input from "@/components/ui/input";
import FormLabel from "@/components/ui/label";

export interface CardData {
    cardName: string;
    cardNumber: string;
    expDate: string;
    cvc: string;
}

export interface CardValidationErrors {
    cardName?: string;
    cardNumber?: string;
    expDate?: string;
    cvc?: string;
}

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "jcb" | "diners" | "generic";

// Luhn (Mod-10) algorithm to check credit card validity
export const validateLuhn = (numStr: string): boolean => {
    const clean = numStr.replace(/\D/g, "");
    if (clean.length < 13 || clean.length > 19) return false;
    let sum = 0;
    let shouldDouble = false;
    for (let i = clean.length - 1; i >= 0; i--) {
        let digit = parseInt(clean.charAt(i), 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
};

// Detect card brand from number
export const detectCardBrand = (numStr: string): CardBrand => {
    const clean = numStr.replace(/\D/g, "");
    if (/^4/.test(clean)) return "visa";
    if (/^(5[1-5]|2[2-7])/.test(clean)) return "mastercard";
    if (/^3[47]/.test(clean)) return "amex";
    if (/^(6011|65|64[4-9]|622)/.test(clean)) return "discover";
    if (/^(?:2131|1800|35)/.test(clean)) return "jcb";
    if (/^3(?:0[0-5]|[68])/.test(clean)) return "diners";
    return "generic";
};

// Validate all credit card fields
export const validateCreditCardData = (data: CardData): CardValidationErrors => {
    const errors: CardValidationErrors = {};
    const nameTrimmed = data.cardName.trim();
    if (!nameTrimmed) {
        errors.cardName = "Cardholder name is required";
    } else if (nameTrimmed.length < 3) {
        errors.cardName = "Cardholder name must be at least 3 characters";
    }

    const cleanCardNum = data.cardNumber.replace(/\D/g, "");
    const brand = detectCardBrand(cleanCardNum);
    const expectedLength = brand === "amex" ? 15 : brand === "diners" ? 14 : 16;

    if (!cleanCardNum) {
        errors.cardNumber = "Card number is required";
    } else if (cleanCardNum.length < expectedLength) {
        errors.cardNumber = `Incomplete card number (${cleanCardNum.length}/${expectedLength} digits)`;
    } else if (!validateLuhn(cleanCardNum)) {
        errors.cardNumber = "Invalid card number (checksum failed)";
    }

    const cleanExp = data.expDate.replace(/\D/g, "");
    if (!cleanExp) {
        errors.expDate = "Expiry date is required";
    } else if (cleanExp.length < 4) {
        errors.expDate = "Enter full date (MM/YY)";
    } else {
        const month = parseInt(cleanExp.slice(0, 2), 10);
        const year = parseInt(cleanExp.slice(2, 4), 10);
        if (month < 1 || month > 12) {
            errors.expDate = "Month must be between 01 and 12";
        } else {
            const now = new Date();
            const currentYear = now.getFullYear() % 100;
            const currentMonth = now.getMonth() + 1;
            if (year < currentYear || (year === currentYear && month < currentMonth)) {
                errors.expDate = "Card has expired";
            } else if (year > currentYear + 25) {
                errors.expDate = "Invalid expiration year";
            }
        }
    }

    const cleanCvc = data.cvc.replace(/\D/g, "");
    const expectedCvcLength = brand === "amex" ? 4 : 3;
    if (!cleanCvc) {
        errors.cvc = "CVC is required";
    } else if (cleanCvc.length !== expectedCvcLength) {
        errors.cvc = `Must be exactly ${expectedCvcLength} digits`;
    }

    return errors;
};

interface AcceptCheckoutPaymentCardProps {
    paymentOption: "pay_now" | "pay_later";
    setPaymentOption: (opt: "pay_now" | "pay_later") => void;
    payNowMethod?: "card" | "sepa";
    setPayNowMethod?: (m: "card" | "sepa") => void;
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
    totalAmount: number;
    payLaterLimit?: number;
    payLaterStatus?: string;
    onValidationChange?: (isValid: boolean) => void;
    submitted?: boolean;
}

export const AcceptCheckoutPaymentCard: React.FC<AcceptCheckoutPaymentCardProps> = ({
    paymentOption,
    setPaymentOption,
    cardData,
    setCardData,
    totalAmount,
    payLaterLimit = 40000,
    onValidationChange,
    submitted = false,
}) => {
    const [blurred, setBlurred] = useState<Record<string, boolean>>({});

    const cleanCardNum = cardData.cardNumber.replace(/\D/g, "");
    const brand = useMemo(() => detectCardBrand(cleanCardNum), [cleanCardNum]);
    const expectedCardLength = brand === "amex" ? 15 : brand === "diners" ? 14 : 16;
    const expectedCvcLength = brand === "amex" ? 4 : 3;

    // Live validation errors
    const errors = useMemo(() => {
        const errs = validateCreditCardData(cardData);
        if (onValidationChange) {
            onValidationChange(Object.keys(errs).length === 0);
        }
        return errs;
    }, [cardData, onValidationChange]);

    // Real-time validity flags
    const isNameValid = cardData.cardName.trim().length >= 3;
    const isCardNumValid = cleanCardNum.length === expectedCardLength && validateLuhn(cleanCardNum);
    const cleanExp = cardData.expDate.replace(/\D/g, "");
    const isExpValid = cleanExp.length === 4 && !errors.expDate;
    const isCvcValid = cardData.cvc.replace(/\D/g, "").length === expectedCvcLength;

    // Display error logic for real-time responsiveness
    const showNameError = (submitted || blurred.cardName) && errors.cardName;
    const showCardNumError =
        (submitted || blurred.cardNumber || cleanCardNum.length >= expectedCardLength) && errors.cardNumber;
    const showExpError =
        (submitted || blurred.expDate || cleanExp.length === 4) && errors.expDate;
    const showCvcError =
        (submitted || blurred.cvc || cardData.cvc.replace(/\D/g, "").length === expectedCvcLength) && errors.cvc;

    // Formatter for Cardholder Name
    const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^a-zA-Z\s\-'.]/g, "");
        setCardData({ ...cardData, cardName: val });
    };

    // Formatter for Card Number
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "");
        const isAmex = /^3[47]/.test(raw);
        const isDiners = /^3(?:0[0-5]|[68])/.test(raw);
        const maxLen = isAmex ? 15 : isDiners ? 14 : 16;
        const truncated = raw.slice(0, maxLen);

        let formatted = "";
        if (isAmex || isDiners) {
            // Format 4-6-5 or 4-6-4
            if (truncated.length > 10) {
                formatted = `${truncated.slice(0, 4)} ${truncated.slice(4, 10)} ${truncated.slice(10)}`;
            } else if (truncated.length > 4) {
                formatted = `${truncated.slice(0, 4)} ${truncated.slice(4)}`;
            } else {
                formatted = truncated;
            }
        } else {
            // Format 4-4-4-4
            const chunks = truncated.match(/.{1,4}/g);
            formatted = chunks ? chunks.join(" ") : truncated;
        }

        setCardData({ ...cardData, cardNumber: formatted });
    };

    // Formatter for Expiry Date (MM/YY)
    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;
        const isDeleting = inputVal.length < (cardData.expDate || "").length;
        let raw = inputVal.replace(/\D/g, "").slice(0, 4);

        if (!isDeleting && raw.length === 1 && parseInt(raw, 10) > 1) {
            raw = `0${raw}`;
        }

        let formatted = raw;
        if (raw.length > 2) {
            formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
        } else if (raw.length === 2 && !isDeleting) {
            formatted = `${raw}/`;
        }

        setCardData((prev) => ({ ...prev, expDate: formatted }));
    };

    // Formatter for CVC
    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const clean = e.target.value.replace(/\D/g, "").slice(0, expectedCvcLength);
        setCardData((prev) => ({ ...prev, cvc: clean }));
    };

    const markBlurred = (field: string) => {
        setBlurred((prev) => ({ ...prev, [field]: true }));
    };

    // Render Card Brand Tag / Badge
    const renderCardBrandBadge = () => {
        switch (brand) {
            case "visa":
                return (
                    <span className="text-[10px] font-black tracking-wider bg-[#1A1F71] text-white px-2 py-0.5 rounded shadow-2xs pointer-events-none">
                        VISA
                    </span>
                );
            case "mastercard":
                return (
                    <span className="text-[10px] font-black tracking-wider bg-slate-900 text-white px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-0.5 pointer-events-none">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B] inline-block -mr-1.5 opacity-95" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] inline-block opacity-95" />
                        <span className="ml-1 text-[9px]">MC</span>
                    </span>
                );
            case "amex":
                return (
                    <span className="text-[10px] font-black tracking-wider bg-[#007AC1] text-white px-2 py-0.5 rounded shadow-2xs pointer-events-none">
                        AMEX
                    </span>
                );
            case "discover":
                return (
                    <span className="text-[10px] font-black tracking-wider bg-[#FF6000] text-white px-2 py-0.5 rounded shadow-2xs pointer-events-none">
                        DISC
                    </span>
                );
            case "jcb":
                return (
                    <span className="text-[10px] font-black tracking-wider bg-[#0E428F] text-white px-2 py-0.5 rounded shadow-2xs pointer-events-none">
                        JCB
                    </span>
                );
            default:
                return <CreditCard size={15} className="text-slate-400 pointer-events-none" />;
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 shadow-2xs space-y-3.5 font-sans">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                    <ShieldCheck size={15} className="text-[#ff4a1f]" />
                    <span>Select Payment Term & Protection</span>
                </div>
            </div>

            {/* Option Selection Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Option 1: Pay Now */}
                <button
                    type="button"
                    onClick={() => setPaymentOption("pay_now")}
                    className={`p-3 rounded-[4px] border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        paymentOption === "pay_now"
                            ? "border-[#ff4a1f] bg-orange-50/20 dark:bg-orange-950/20 shadow-2xs ring-1 ring-[#ff4a1f]/30"
                            : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                    }`}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5">
                            <Lock size={13.5} className="text-slate-800 dark:text-slate-200 shrink-0" />
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                                Pay Now via Escrow
                            </span>
                        </div>
                        <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                paymentOption === "pay_now" ? "border-[#ff4a1f] bg-[#ff4a1f]" : "border-slate-300 dark:border-slate-600"
                            }`}
                        >
                            {paymentOption === "pay_now" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Funds held safely in platform Escrow until delivery is confirmed.
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60 w-fit">
                        100% Escrow Protected
                    </span>
                </button>

                {/* Option 2: Pay Later */}
                <button
                    type="button"
                    onClick={() => setPaymentOption("pay_later")}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                        paymentOption === "pay_later"
                            ? "border-[#ff4a1f] bg-orange-50/20 dark:bg-orange-950/20 shadow-2xs ring-1 ring-[#ff4a1f]/30"
                            : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                    }`}
                >
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5">
                            <Building2 size={13.5} className="text-slate-800 dark:text-slate-200 shrink-0" />
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
                                Pay Later (Net-30 Credit)
                            </span>
                        </div>
                        <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                paymentOption === "pay_later" ? "border-[#ff4a1f] bg-[#ff4a1f]" : "border-slate-300 dark:border-slate-600"
                            }`}
                        >
                            {paymentOption === "pay_later" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Use your 30-day corporate credit limit without upfront credit card charge.
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 w-fit">
                        €{payLaterLimit.toLocaleString()} Available Limit
                    </span>
                </button>
            </div>

            {/* Credit Card Input Form with Real-time Validation */}
            {paymentOption === "pay_now" && (
                <div className="space-y-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                            <CreditCard size={14} className="text-[#ff4a1f]" />
                            <span>Credit / Debit Card Details</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10.5px] text-slate-400 font-medium">256-Bit SSL Encrypted</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* 1. Cardholder Name */}
                        <div>
                            <FormLabel htmlFor="checkout-card-name" required className="text-xs font-semibold mb-1.5 block text-slate-700 dark:text-slate-300 cursor-pointer">
                                Cardholder Name
                            </FormLabel>
                            <Input
                                id="checkout-card-name"
                                value={cardData.cardName}
                                placeholder="e.g. John Doe / Company Ltd"
                                onChange={handleCardNameChange}
                                onBlur={() => markBlurred("cardName")}
                                rightIcon={
                                    isNameValid ? (
                                        <CheckCircle2 size={15} className="text-emerald-500 pointer-events-none" />
                                    ) : undefined
                                }
                                error={showNameError ? errors.cardName : undefined}
                                className={`!h-[42px] text-[13px] rounded-[4px] px-3 font-medium transition-colors ${
                                    showNameError
                                        ? "border-red-500 focus:border-red-500"
                                        : isNameValid
                                        ? "border-emerald-500/80 focus:border-emerald-500"
                                        : "border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f]"
                                }`}
                            />
                        </div>

                        {/* 2. Card Number */}
                        <div>
                            <FormLabel htmlFor="checkout-card-number" required className="text-xs font-semibold mb-1.5 block text-slate-700 dark:text-slate-300 cursor-pointer">
                                Card Number
                            </FormLabel>
                            <Input
                                id="checkout-card-number"
                                value={cardData.cardNumber}
                                placeholder="4242 •••• •••• 4242"
                                onChange={handleCardNumberChange}
                                onBlur={() => markBlurred("cardNumber")}
                                rightIcon={
                                    <div className="flex items-center gap-1.5 pointer-events-none">
                                        {isCardNumValid && (
                                            <CheckCircle2 size={15} className="text-emerald-500" />
                                        )}
                                        {renderCardBrandBadge()}
                                    </div>
                                }
                                error={showCardNumError ? errors.cardNumber : undefined}
                                className={`!h-[42px] text-[13px] rounded-[4px] px-3 font-medium tracking-wide transition-colors ${
                                    showCardNumError
                                        ? "border-red-500 focus:border-red-500"
                                        : isCardNumValid
                                        ? "border-emerald-500/80 focus:border-emerald-500"
                                        : "border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f]"
                                }`}
                            />
                        </div>

                        {/* 3. Expiry Date */}
                        <div>
                            <FormLabel htmlFor="checkout-card-exp" required className="text-xs font-semibold mb-1.5 block text-slate-700 dark:text-slate-300 cursor-pointer">
                                Expiry Date
                            </FormLabel>
                            <Input
                                id="checkout-card-exp"
                                value={cardData.expDate}
                                placeholder="MM/YY"
                                maxLength={5}
                                onChange={handleExpiryChange}
                                onBlur={() => markBlurred("expDate")}
                                rightIcon={
                                    isExpValid ? (
                                        <CheckCircle2 size={15} className="text-emerald-500 pointer-events-none" />
                                    ) : undefined
                                }
                                error={showExpError ? errors.expDate : undefined}
                                className={`!h-[42px] text-[13px] rounded-[4px] px-3 font-medium transition-colors ${
                                    showExpError
                                        ? "border-red-500 focus:border-red-500"
                                        : isExpValid
                                        ? "border-emerald-500/80 focus:border-emerald-500"
                                        : "border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f]"
                                }`}
                            />
                        </div>

                        {/* 4. Security CVC */}
                        <div>
                            <FormLabel htmlFor="checkout-card-cvc" required className="text-xs font-semibold mb-1.5 block text-slate-700 dark:text-slate-300 cursor-pointer">
                                Security CVC {brand === "amex" ? "(4 Digits)" : "(3 Digits)"}
                            </FormLabel>
                            <Input
                                id="checkout-card-cvc"
                                value={cardData.cvc}
                                placeholder={brand === "amex" ? "1234" : "888"}
                                maxLength={expectedCvcLength}
                                onChange={handleCvcChange}
                                onBlur={() => markBlurred("cvc")}
                                rightIcon={
                                    isCvcValid ? (
                                        <CheckCircle2 size={15} className="text-emerald-500 pointer-events-none" />
                                    ) : undefined
                                }
                                error={showCvcError ? errors.cvc : undefined}
                                className={`!h-[42px] text-[13px] rounded-[4px] px-3 font-medium transition-colors ${
                                    showCvcError
                                        ? "border-red-500 focus:border-red-500"
                                        : isCvcValid
                                        ? "border-emerald-500/80 focus:border-emerald-500"
                                        : "border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f]"
                                }`}
                            />
                        </div>
                    </div>

                    {/* Accepted cards footer */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400 dark:text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <span>Supported cards:</span>
                            <span className="font-semibold text-slate-600 dark:text-slate-300">Visa</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-600 dark:text-slate-300">Mastercard</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-600 dark:text-slate-300">Amex</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-600 dark:text-slate-300">Discover</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <Lock size={11} />
                            <span>Escrow Protection Guarantee</span>
                        </div>
                    </div>
                </div>
            )}

            {paymentOption === "pay_later" && (
                <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-lg text-xs space-y-1">
                    <p className="font-semibold text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Corporate Net-30 Terms Active
                    </p>
                    <p className="text-[11px] text-emerald-800 dark:text-emerald-400/90 leading-relaxed">
                        Booking will be confirmed immediately. Tax invoice for <span className="font-bold">€{totalAmount.toLocaleString()}</span> will be issued to your corporate account, payable in 30 days.
                    </p>
                </div>
            )}
        </div>
    );
};


