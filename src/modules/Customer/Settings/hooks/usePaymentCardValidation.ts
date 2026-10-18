import { useState, useMemo } from "react";
import { detectCardBrand, validateLuhn, CardBrand } from "../utils/cardUtils";

interface UsePaymentCardValidationParams {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  isSubmitted: boolean;
}

export function usePaymentCardValidation({
  cardName,
  cardNumber,
  expiry,
  cvc,
  isSubmitted,
}: UsePaymentCardValidationParams) {
  const [touched, setTouched] = useState<{
    cardName?: boolean;
    cardNumber?: boolean;
    expiry?: boolean;
    cvc?: boolean;
  }>({});

  const markTouched = (field: "cardName" | "cardNumber" | "expiry" | "cvc") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const resetTouched = () => setTouched({});

  const cleanNumber = cardNumber.replace(/\D/g, "");
  const cardBrand: CardBrand = detectCardBrand(cleanNumber);
  const expectedCvcLength = cardBrand === "amex" ? 4 : 3;

  const nameError = useMemo(() => {
    if (!cardName.trim()) {
      return touched.cardName || isSubmitted ? "Cardholder name is required." : null;
    }
    if (cardName.trim().length < 2) {
      return touched.cardName || isSubmitted
        ? "Cardholder name must be at least 2 characters."
        : null;
    }
    return null;
  }, [cardName, touched.cardName, isSubmitted]);

  const cardNumberError = useMemo(() => {
    const expectedLength = cardBrand === "amex" ? 15 : 16;
    if (!cleanNumber) {
      return touched.cardNumber || isSubmitted ? "Card number is required." : null;
    }
    if (cleanNumber.length === expectedLength) {
      if (!validateLuhn(cleanNumber)) return "Your card number is invalid.";
      return null;
    }
    if (cleanNumber.length < expectedLength) {
      return touched.cardNumber || isSubmitted
        ? `Your card number is incomplete (${cleanNumber.length}/${expectedLength} digits).`
        : null;
    }
    return null;
  }, [cleanNumber, cardBrand, touched.cardNumber, isSubmitted]);

  const expiryError = useMemo(() => {
    const cleanExp = expiry.replace(/\D/g, "");
    if (!cleanExp) return touched.expiry || isSubmitted ? "Expiry date is required." : null;
    if (cleanExp.length >= 2) {
      const month = parseInt(cleanExp.slice(0, 2), 10);
      if (month < 1 || month > 12) return "Your card's expiration month is invalid.";
      if (cleanExp.length === 4) {
        const year = parseInt(cleanExp.slice(2, 4), 10);
        const now = new Date();
        const curYear = now.getFullYear() % 100;
        const curMonth = now.getMonth() + 1;
        if (year < curYear || (year === curYear && month < curMonth)) {
          return "Your card's expiration year is in the past.";
        }
        if (year > curYear + 25) return "Your card's expiration year is invalid.";
        return null;
      }
      return touched.expiry || isSubmitted ? "Your card's expiration date is incomplete." : null;
    }
    return touched.expiry || isSubmitted ? "Your card's expiration date is incomplete." : null;
  }, [expiry, touched.expiry, isSubmitted]);

  const cvcError = useMemo(() => {
    const cleanCvc = cvc.replace(/\D/g, "");
    if (!cleanCvc) return touched.cvc || isSubmitted ? "CVC is required." : null;
    if (cleanCvc.length < expectedCvcLength) {
      return touched.cvc || isSubmitted
        ? `Your card's security code is incomplete (${cleanCvc.length}/${expectedCvcLength} digits).`
        : null;
    }
    return null;
  }, [cvc, expectedCvcLength, touched.cvc, isSubmitted]);

  return {
    touched,
    markTouched,
    resetTouched,
    cleanNumber,
    cardBrand,
    expectedCvcLength,
    nameError,
    cardNumberError,
    expiryError,
    cvcError,
  };
}
