import React, { useState, useMemo } from "react";
import {
    ShieldCheck,
    Lock,
    Building2,
    CreditCard,
    CheckCircle2,
    AlertCircle,
    Plus,
    MoreVertical,
    Check,
    Trash2,
    Sparkles,
} from "lucide-react";
import Input from "@/components/ui/input";
import FormLabel from "@/components/ui/label";
import Button from "@/components/ui/button";

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

// SVG Card Brand Logo Renderer
export const renderCardLogo = (brand?: string) => {
    const b = (brand || "").toLowerCase();
    if (b.includes("visa")) {
        return (
            <div className="w-10 h-7 bg-blue-600 rounded-[3px] flex items-center justify-center text-white font-black italic text-[11px] tracking-tighter shrink-0 shadow-2xs">
                VISA
            </div>
        );
    }
    if (b.includes("master") || b.includes("mc")) {
        return (
            <div className="w-10 h-7 bg-slate-900 rounded-[3px] flex items-center justify-center shrink-0 relative overflow-hidden shadow-2xs">
                <div className="w-4 h-4 rounded-full bg-red-500 opacity-90 -mr-1.5" />
                <div className="w-4 h-4 rounded-full bg-amber-400 opacity-90" />
            </div>
        );
    }
    if (b.includes("amex") || b.includes("american")) {
        return (
            <div className="w-10 h-7 bg-[#0070ba] rounded-[3px] flex items-center justify-center text-white font-bold text-[9px] tracking-tight shrink-0 shadow-2xs">
                AMEX
            </div>
        );
    }
    if (b.includes("discover") || b.includes("disc")) {
        return (
            <div className="w-10 h-7 bg-gradient-to-r from-orange-500 to-amber-500 rounded-[3px] flex items-center justify-center text-white font-black text-[8px] tracking-tight shrink-0 shadow-2xs">
                DISC
            </div>
        );
    }
    return (
        <div className="w-10 h-7 bg-slate-200 dark:bg-slate-700 rounded-[3px] flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-[10px] shrink-0">
            <CreditCard size={15} />
        </div>
    );
};

interface AcceptCheckoutPaymentCardProps {
    paymentOption: "pay_now" | "pay_later";
    setPaymentOption: (opt: "pay_now" | "pay_later") => void;
    paymentTab: "saved_card" | "new_card";
    setPaymentTab: (tab: "saved_card" | "new_card") => void;
    savedCards: any[];
    isLoadingCards: boolean;
    selectedCardId: string | null;
    setSelectedCardId: (id: string | null) => void;
    onSetPrimaryCard?: (id: string) => Promise<void>;
    onDeleteCard?: (id: string) => Promise<void>;
    onOpenAddCardModal?: () => void;
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
    saveCard: boolean;
    setSaveCard: (val: boolean) => void;
    totalAmount: number;
    payLaterLimit?: number;
    payLaterStatus?: string;
    submitted?: boolean;
}

export const AcceptCheckoutPaymentCard: React.FC<AcceptCheckoutPaymentCardProps> = ({
    paymentOption,
    setPaymentOption,
    paymentTab,
    setPaymentTab,
    savedCards,
    isLoadingCards,
    selectedCardId,
    setSelectedCardId,
    onSetPrimaryCard,
    onDeleteCard,
    onOpenAddCardModal,
    cardData,
    setCardData,
    saveCard,
    setSaveCard,
    totalAmount,
    payLaterLimit = 80000,
    payLaterStatus = "approved",
    submitted = false,
}) => {
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [activeCardMenuId, setActiveCardMenuId] = useState<string | null>(null);

    const markBlurred = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const errors = useMemo(() => validateCreditCardData(cardData), [cardData]);
    const cleanCardNum = cardData.cardNumber.replace(/\D/g, "");
    const brand = detectCardBrand(cleanCardNum);
    const expectedCvcLength = brand === "amex" ? 4 : 3;

    // Field validity checks
    const isNameValid = !errors.cardName && cardData.cardName.trim().length >= 3;
    const isCardNumValid = !errors.cardNumber && cleanCardNum.length >= (brand === "amex" ? 15 : 16);
    const isExpValid = !errors.expDate && cardData.expDate.replace(/\D/g, "").length === 4;
    const isCvcValid = !errors.cvc && cardData.cvc.replace(/\D/g, "").length === expectedCvcLength;

    const showNameError = (touched.cardName || submitted) && !!errors.cardName;
    const showCardNumError = (touched.cardNumber || submitted) && !!errors.cardNumber;
    const showExpError = (touched.expDate || submitted) && !!errors.expDate;
    const showCvcError = (touched.cvc || submitted) && !!errors.cvc;

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
        const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
        setCardData((prev) => ({ ...prev, cardNumber: formatted }));
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 4) val = val.slice(0, 4);

        if (val.length === 1 && parseInt(val, 10) > 1) {
            val = "0" + val;
        }
        if (val.length >= 2) {
            let month = parseInt(val.slice(0, 2), 10);
            if (month > 12) month = 12;
            if (month === 0) month = 1;
            const monthStr = month < 10 ? "0" + month : "" + month;
            if (val.length > 2) {
                val = monthStr + "/" + val.slice(2);
            } else {
                val = monthStr + "/";
            }
        }
        setCardData((prev) => ({ ...prev, expDate: val }));
    };

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, expectedCvcLength);
        setCardData((prev) => ({ ...prev, cvc: val }));
    };

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[3px] p-5 shadow-2xs space-y-4 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <CreditCard size={17} className="text-[#ff4a1f]" />
                        <span>Payment Method</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Choose your preferred payment method for escrow authorization.
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-[3px] border border-emerald-200/80 dark:border-emerald-800/60 self-start sm:self-auto">
                    <ShieldCheck size={14} />
                    <span>Escrow Protected</span>
                </div>
            </div>

            {/* Top Method Selector: Pay Now vs Corporate Pay Later (Net-30) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Pay Now (Card) */}
                <div
                    onClick={() => setPaymentOption("pay_now")}
                    className={`border rounded-[3px] p-3.5 cursor-pointer transition-all flex items-start gap-3 ${
                        paymentOption === "pay_now"
                            ? "border-[#ff4a1f] bg-orange-50/20 dark:bg-orange-950/10 shadow-xs"
                            : "border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900/40"
                    }`}
                >
                    <div className="mt-0.5 shrink-0">
                        <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                paymentOption === "pay_now"
                                    ? "border-[#ff4a1f] bg-[#ff4a1f]"
                                    : "border-slate-400 dark:border-slate-500"
                            }`}
                        >
                            {paymentOption === "pay_now" && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                Credit / Debit Card
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                                Instant Hold
                            </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            Secure escrow payment via Visa, Mastercard, AMEX or Discover.
                        </p>
                    </div>
                </div>

                {/* 2. Corporate Pay Later (Net-30) */}
                <div
                    onClick={() => setPaymentOption("pay_later")}
                    className={`border rounded-[3px] p-3.5 cursor-pointer transition-all flex items-start gap-3 ${
                        paymentOption === "pay_later"
                            ? "border-[#ff4a1f] bg-orange-50/20 dark:bg-orange-950/10 shadow-xs"
                            : "border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900/40"
                    }`}
                >
                    <div className="mt-0.5 shrink-0">
                        <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                paymentOption === "pay_later"
                                    ? "border-[#ff4a1f] bg-[#ff4a1f]"
                                    : "border-slate-400 dark:border-slate-500"
                            }`}
                        >
                            {paymentOption === "pay_later" && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                <Building2 size={13} className="text-slate-500" />
                                Corporate Net-30
                            </span>
                            {payLaterStatus === "approved" ? (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                                    Approved
                                </span>
                            ) : (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40">
                                    Review
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            €{payLaterLimit.toLocaleString()} available. Invoice payable in 30 days.
                        </p>
                    </div>
                </div>
            </div>

            {/* When Pay Now (Card) is selected: Segmented Tabs (Saved card vs Add new card) */}
            {paymentOption === "pay_now" && (
                <div className="space-y-4 pt-1">
                    {/* Segmented Radio Cards for Saved vs Add New */}
                    <div className="grid grid-cols-2 gap-3">
                        <div
                            onClick={() => setPaymentTab("saved_card")}
                            className={`border rounded-[3px] p-3 cursor-pointer transition-all flex items-center gap-2.5 ${
                                paymentTab === "saved_card"
                                    ? "border-[#ff4a1f] bg-orange-50/30 dark:bg-orange-950/20 shadow-xs"
                                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30"
                            }`}
                        >
                            <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    paymentTab === "saved_card"
                                        ? "border-[#ff4a1f] bg-[#ff4a1f]"
                                        : "border-slate-400"
                                }`}
                            >
                                {paymentTab === "saved_card" && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                Saved card
                            </span>
                            {savedCards.length > 0 && (
                                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                    {savedCards.length}
                                </span>
                            )}
                        </div>

                        <div
                            onClick={() => setPaymentTab("new_card")}
                            className={`border rounded-[3px] p-3 cursor-pointer transition-all flex items-center gap-2.5 ${
                                paymentTab === "new_card"
                                    ? "border-[#ff4a1f] bg-orange-50/30 dark:bg-orange-950/20 shadow-xs"
                                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30"
                            }`}
                        >
                            <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                    paymentTab === "new_card"
                                        ? "border-[#ff4a1f] bg-[#ff4a1f]"
                                        : "border-slate-400"
                                }`}
                            >
                                {paymentTab === "new_card" && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </div>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                Add new card
                            </span>
                        </div>
                    </div>

                    {/* 1. Saved Cards Section */}
                    {paymentTab === "saved_card" && (
                        <div className="space-y-3">
                            {isLoadingCards ? (
                                <div className="space-y-2">
                                    <div className="h-14 bg-slate-100 dark:bg-slate-800/60 rounded-[3px] animate-pulse" />
                                    <div className="h-14 bg-slate-100 dark:bg-slate-800/60 rounded-[3px] animate-pulse" />
                                </div>
                            ) : savedCards.length > 0 ? (
                                <div className="space-y-2">
                                    {savedCards.map((card) => {
                                        const isSelected = String(card.id) === String(selectedCardId);
                                        return (
                                            <div
                                                key={card.id}
                                                onClick={() => setSelectedCardId(String(card.id))}
                                                className={`border rounded-[3px] p-3 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                                                    isSelected
                                                        ? "border-[#ff4a1f] bg-orange-50/30 dark:bg-orange-950/20 shadow-xs"
                                                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div
                                                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                                            isSelected
                                                                ? "border-[#ff4a1f] bg-[#ff4a1f]"
                                                                : "border-slate-400"
                                                        }`}
                                                    >
                                                        {isSelected && (
                                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                                        )}
                                                    </div>

                                                    {renderCardLogo(card.brand)}

                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-wide">
                                                                •••• •••• •••• {card.last_four || "4242"}
                                                            </span>
                                                            {card.is_primary && (
                                                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-[3px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40">
                                                                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                                            Expires {card.exp_month || "12"}/{card.exp_year || "28"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Card 3-dot action menu */}
                                                <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setActiveCardMenuId(
                                                                activeCardMenuId === String(card.id) ? null : String(card.id)
                                                            )
                                                        }
                                                        className="p-1 rounded-[3px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>

                                                    {activeCardMenuId === String(card.id) && (
                                                        <div className="absolute right-0 top-8 z-30 w-36 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[3px] shadow-lg py-1 text-xs animate-in fade-in zoom-in-95">
                                                            {!card.is_primary && onSetPrimaryCard && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setActiveCardMenuId(null);
                                                                        onSetPrimaryCard(String(card.id));
                                                                    }}
                                                                    className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 cursor-pointer font-medium"
                                                                >
                                                                    <Check size={13} className="text-emerald-500" />
                                                                    Set as Default
                                                                </button>
                                                            )}
                                                            {onDeleteCard && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setActiveCardMenuId(null);
                                                                        onDeleteCard(String(card.id));
                                                                    }}
                                                                    className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 cursor-pointer font-medium"
                                                                >
                                                                    <Trash2 size={13} />
                                                                    Remove Card
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-[3px] bg-slate-50/50 dark:bg-slate-900/30 space-y-2">
                                    <CreditCard size={28} className="mx-auto text-slate-400" />
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        No saved cards found
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        Enter your card details below or add a card to your account.
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPaymentTab("new_card")}
                                        className="h-8 text-xs font-semibold rounded-[3px] border-slate-300 dark:border-slate-700 mt-1"
                                    >
                                        <Plus size={13} className="mr-1" />
                                        Enter Card Details
                                    </Button>
                                </div>
                            )}

                            {/* Divider & Option to Add Card */}
                            <div className="relative pt-2 pb-1">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                                </div>
                                <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
                                    <span className="bg-white dark:bg-[#1e2329] px-3 text-slate-400 dark:text-slate-500">
                                        OR
                                    </span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    if (onOpenAddCardModal) {
                                        onOpenAddCardModal();
                                    } else {
                                        setPaymentTab("new_card");
                                    }
                                }}
                                className="w-full py-2.5 px-3 border border-dashed border-slate-300 dark:border-slate-700 rounded-[3px] text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#ff4a1f] hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] bg-slate-50/40 dark:bg-slate-900/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                                <Plus size={14} />
                                <span>Add a new payment card</span>
                            </button>
                        </div>
                    )}

                    {/* 2. Add New Card Form Section */}
                    {paymentTab === "new_card" && (
                        <div className="space-y-3.5 pt-1">
                            {/* Cardholder Name */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <FormLabel htmlFor="checkout-card-name" required className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                        Cardholder Name
                                    </FormLabel>
                                    {isNameValid && (
                                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                            <CheckCircle2 size={12} /> Valid
                                        </span>
                                    )}
                                </div>
                                <Input
                                    id="checkout-card-name"
                                    value={cardData.cardName}
                                    placeholder="e.g. John Doe"
                                    onChange={(e) => setCardData((prev) => ({ ...prev, cardName: e.target.value }))}
                                    onBlur={() => markBlurred("cardName")}
                                    error={showNameError ? errors.cardName : undefined}
                                    className={`!h-[42px] text-[13px] rounded-[3px] px-3 font-medium transition-colors ${
                                        showNameError
                                            ? "border-red-500 focus:border-red-500"
                                            : isNameValid
                                            ? "border-emerald-500/80 focus:border-emerald-500"
                                            : "border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f]"
                                    }`}
                                />
                            </div>

                            {/* Card Number */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <FormLabel htmlFor="checkout-card-number" required className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                        Card Number
                                    </FormLabel>
                                    <div className="flex items-center gap-1.5">
                                        {isCardNumValid && (
                                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                                                <CheckCircle2 size={12} /> Valid
                                            </span>
                                        )}
                                        {renderCardLogo(brand)}
                                    </div>
                                </div>
                                <Input
                                    id="checkout-card-number"
                                    value={cardData.cardNumber}
                                    placeholder="4242 •••• •••• 4242"
                                    maxLength={19}
                                    onChange={handleCardNumberChange}
                                    onBlur={() => markBlurred("cardNumber")}
                                    error={showCardNumError ? errors.cardNumber : undefined}
                                    className={`!h-[42px] text-[13px] rounded-[3px] px-3 font-medium tracking-wide transition-colors ${
                                        showCardNumError
                                            ? "border-red-500 focus:border-red-500"
                                            : isCardNumValid
                                            ? "border-emerald-500/80 focus:border-emerald-500"
                                            : "border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f]"
                                    }`}
                                />
                            </div>

                            {/* Expiry Date & CVC in 2-cols */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <FormLabel htmlFor="checkout-card-exp" required className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                            Expiry Date
                                        </FormLabel>
                                        {isExpValid && (
                                            <CheckCircle2 size={13} className="text-emerald-500" />
                                        )}
                                    </div>
                                    <Input
                                        id="checkout-card-exp"
                                        value={cardData.expDate}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        onChange={handleExpiryChange}
                                        onBlur={() => markBlurred("expDate")}
                                        error={showExpError ? errors.expDate : undefined}
                                        className={`!h-[42px] text-[13px] rounded-[3px] px-3 font-medium transition-colors ${
                                            showExpError
                                                ? "border-red-500 focus:border-red-500"
                                                : isExpValid
                                                ? "border-emerald-500/80 focus:border-emerald-500"
                                                : "border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f]"
                                        }`}
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <FormLabel htmlFor="checkout-card-cvc" required className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                                            Security CVC {brand === "amex" ? "(4 Digits)" : "(3 Digits)"}
                                        </FormLabel>
                                        {isCvcValid && (
                                            <CheckCircle2 size={13} className="text-emerald-500" />
                                        )}
                                    </div>
                                    <Input
                                        id="checkout-card-cvc"
                                        value={cardData.cvc}
                                        placeholder={brand === "amex" ? "1234" : "888"}
                                        maxLength={expectedCvcLength}
                                        onChange={handleCvcChange}
                                        onBlur={() => markBlurred("cvc")}
                                        error={showCvcError ? errors.cvc : undefined}
                                        className={`!h-[42px] text-[13px] rounded-[3px] px-3 font-medium transition-colors ${
                                            showCvcError
                                                ? "border-red-500 focus:border-red-500"
                                                : isCvcValid
                                                ? "border-emerald-500/80 focus:border-emerald-500"
                                                : "border-slate-300 dark:border-slate-700 focus:border-[#ff4a1f]"
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Save card checkbox */}
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    id="checkout-save-card"
                                    type="checkbox"
                                    checked={saveCard}
                                    onChange={(e) => setSaveCard(e.target.checked)}
                                    className="w-4 h-4 text-[#ff4a1f] accent-[#ff4a1f] border-slate-300 rounded-[3px] cursor-pointer"
                                />
                                <label
                                    htmlFor="checkout-save-card"
                                    className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                                >
                                    Save this card for future shipments &amp; faster checkout
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* When Corporate Net-30 is selected */}
            {paymentOption === "pay_later" && (
                <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-[3px] text-xs space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Corporate Net-30 Terms Active
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 rounded-[3px]">
                            Available: €{payLaterLimit.toLocaleString()}
                        </span>
                    </div>
                    <p className="text-[11.5px] text-emerald-800 dark:text-emerald-400 leading-relaxed">
                        Booking will be confirmed immediately without upfront card charge. A corporate tax invoice for <strong className="font-bold">€{totalAmount.toLocaleString()}</strong> will be issued to your accounts payable department, due in 30 days.
                    </p>
                </div>
            )}
        </div>
    );
};
