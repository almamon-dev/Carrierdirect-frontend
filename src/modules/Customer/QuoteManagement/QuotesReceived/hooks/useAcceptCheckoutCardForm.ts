import React, { useState, useMemo, useRef } from "react";
import {
    CardData,
    detectCardBrand,
    validateLuhn,
} from "../components/checkoutCardUtils";

export function useAcceptCheckoutCardForm(
    cardData: CardData,
    setCardData: React.Dispatch<React.SetStateAction<CardData>>,
    submitted = false
) {
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const cardNameRef = useRef<HTMLInputElement>(null);
    const cardNumberRef = useRef<HTMLInputElement>(null);
    const expDateRef = useRef<HTMLInputElement>(null);
    const cvcRef = useRef<HTMLInputElement>(null);

    const markBlurred = (field: string) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const cleanCardNum = cardData.cardNumber.replace(/\D/g, "");
    const brand = detectCardBrand(cleanCardNum);
    const expectedLength = brand === "amex" ? 15 : 16;
    const expectedCvcLength = brand === "amex" ? 4 : 3;
    const cleanExp = cardData.expDate.replace(/\D/g, "");
    const cleanCvc = cardData.cvc.replace(/\D/g, "");

    const fieldErrors = useMemo(() => {
        const errs: Record<string, string> = {};

        // 1. Name
        if (!cardData.cardName.trim()) {
            if (touched.cardName || submitted) errs.cardName = "Cardholder name is required.";
        } else if (cardData.cardName.trim().length < 2) {
            if (touched.cardName || submitted) errs.cardName = "Cardholder name must be at least 2 characters.";
        }

        // 2. Number
        if (!cleanCardNum) {
            if (touched.cardNumber || submitted) errs.cardNumber = "Card number is required.";
        } else if (cleanCardNum.length === expectedLength) {
            if (!validateLuhn(cleanCardNum)) {
                errs.cardNumber = "Your card number is invalid.";
            }
        } else if (cleanCardNum.length < expectedLength) {
            if (touched.cardNumber || submitted) errs.cardNumber = `Your card number is incomplete (${cleanCardNum.length}/${expectedLength} digits).`;
        }

        // 3. Expiry
        if (!cleanExp) {
            if (touched.expDate || submitted) errs.expDate = "Expiry date is required.";
        } else if (cleanExp.length >= 2) {
            const m = parseInt(cleanExp.slice(0, 2), 10);
            if (m < 1 || m > 12) {
                errs.expDate = "Your card's expiration month is invalid.";
            } else if (cleanExp.length === 4) {
                const y = parseInt(cleanExp.slice(2, 4), 10);
                const now = new Date();
                const curY = now.getFullYear() % 100;
                const curM = now.getMonth() + 1;
                if (y < curY || (y === curY && m < curM)) {
                    errs.expDate = "Your card's expiration year is in the past.";
                } else if (y > curY + 25) {
                    errs.expDate = "Your card's expiration year is invalid.";
                }
            } else if (touched.expDate || submitted) {
                errs.expDate = "Your card's expiration date is incomplete.";
            }
        } else if (touched.expDate || submitted) {
            errs.expDate = "Your card's expiration date is incomplete.";
        }

        // 4. CVC
        if (!cleanCvc) {
            if (touched.cvc || submitted) errs.cvc = "CVC is required.";
        } else if (cleanCvc.length < expectedCvcLength) {
            if (touched.cvc || submitted) errs.cvc = `Your card's security code is incomplete (${cleanCvc.length}/${expectedCvcLength} digits).`;
        }

        return errs;
    }, [cardData, cleanCardNum, expectedLength, cleanExp, cleanCvc, expectedCvcLength, touched, submitted]);

    const isNameValid = !fieldErrors.cardName && cardData.cardName.trim().length >= 2;
    const isCardNumValid = !fieldErrors.cardNumber && cleanCardNum.length >= expectedLength && validateLuhn(cleanCardNum);
    const isExpValid = !fieldErrors.expDate && cleanExp.length === 4;
    const isCvcValid = !fieldErrors.cvc && cleanCvc.length === expectedCvcLength;

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
        const cardBrandDetected = detectCardBrand(raw);
        const reqLen = cardBrandDetected === "amex" ? 15 : 16;
        const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
        setCardData((prev) => ({ ...prev, cardNumber: formatted }));

        if (raw.length === reqLen && validateLuhn(raw)) {
            expDateRef.current?.focus();
        }
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

        const cleanVal = val.replace(/\D/g, "");
        if (cleanVal.length === 4) {
            const m = parseInt(cleanVal.slice(0, 2), 10);
            const y = parseInt(cleanVal.slice(2, 4), 10);
            const now = new Date();
            const curY = now.getFullYear() % 100;
            const curM = now.getMonth() + 1;
            if (m >= 1 && m <= 12 && (y > curY || (y === curY && m >= curM))) {
                cvcRef.current?.focus();
            }
        }
    };

    const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, expectedCvcLength);
        setCardData((prev) => ({ ...prev, cvc: val }));
    };

    return {
        brand,
        expectedCvcLength,
        fieldErrors,
        isNameValid,
        isCardNumValid,
        isExpValid,
        isCvcValid,
        cardNameRef,
        cardNumberRef,
        expDateRef,
        cvcRef,
        markBlurred,
        handleCardNumberChange,
        handleExpiryChange,
        handleCvcChange,
    };
}
