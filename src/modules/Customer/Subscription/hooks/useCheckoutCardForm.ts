import { useState, useRef, useMemo } from "react";
import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  validateLuhn,
} from "../utils/cardValidationUtils";
import { getCheckoutFieldErrors } from "../utils/checkoutValidation";

export function useCheckoutCardForm(paymentTab: "saved_card" | "new_card") {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [saveCardForFuture, setSaveCardForFuture] = useState(true);

  const [touched, setTouched] = useState<{
    cardName?: boolean;
    cardNumber?: boolean;
    cardExpiry?: boolean;
    cardCvc?: boolean;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cardNameRef = useRef<HTMLInputElement>(null);
  const cardNumberRef = useRef<HTMLInputElement>(null);
  const cardExpiryRef = useRef<HTMLInputElement>(null);
  const cardCvcRef = useRef<HTMLInputElement>(null);

  const cleanCardNum = cardNumber.replace(/\D/g, "");
  const cardBrand = detectCardBrand(cleanCardNum);
  const expectedCvcLength = cardBrand === "amex" ? 4 : 3;

  const markTouched = (field: "cardName" | "cardNumber" | "cardExpiry" | "cardCvc") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    const brand = detectCardBrand(digits);
    const expectedLen = brand === "amex" ? 15 : 16;
    const formatted = formatCardNumber(raw, brand);
    setCardNumber(formatted);

    if (digits.length === expectedLen && validateLuhn(digits)) {
      cardExpiryRef.current?.focus();
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value, cardExpiry);
    setCardExpiry(formatted);

    const cleanExp = formatted.replace(/\D/g, "");
    if (cleanExp.length === 4) {
      const m = parseInt(cleanExp.slice(0, 2), 10);
      const y = parseInt(cleanExp.slice(2, 4), 10);
      const now = new Date();
      const curY = now.getFullYear() % 100;
      const curM = now.getMonth() + 1;
      if (m >= 1 && m <= 12 && (y > curY || (y === curY && m >= curM))) {
        cardCvcRef.current?.focus();
      }
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, expectedCvcLength);
    setCardCvc(digits);
  };

  const fieldErrors = useMemo(
    () =>
      getCheckoutFieldErrors(
        paymentTab,
        cardName,
        cardNumber,
        cardExpiry,
        cardCvc,
        touched,
        isSubmitted
      ),
    [paymentTab, cardName, cardNumber, cardExpiry, cardCvc, touched, isSubmitted]
  );

  return {
    cardName,
    cardNumber,
    cardExpiry,
    cardCvc,
    cleanCardNum,
    cardBrand,
    expectedCvcLength,
    saveCardForFuture,
    setSaveCardForFuture,
    touched,
    markTouched,
    isSubmitted,
    setIsSubmitted,
    cardNameRef,
    cardNumberRef,
    cardExpiryRef,
    cardCvcRef,
    handleCardNameChange,
    handleCardNumberChange,
    handleExpiryChange,
    handleCvcChange,
    fieldErrors,
  };
}
