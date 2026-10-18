import React from 'react';

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
    if (b.includes("discover")) {
        return (
            <div className="w-10 h-7 bg-orange-600 rounded-[3px] flex items-center justify-center text-white font-extrabold text-[8.5px] shrink-0 shadow-2xs">
                DISCOVER
            </div>
        );
    }
    return (
        <div className="w-10 h-7 bg-slate-100 dark:bg-slate-800 rounded-[3px] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 font-bold text-[10px] shrink-0">
            CARD
        </div>
    );
};
