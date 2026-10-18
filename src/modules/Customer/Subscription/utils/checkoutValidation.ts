import { detectCardBrand, validateLuhn } from "./cardValidationUtils";

export interface CheckoutFormErrors {
  cardName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}

export function getCheckoutFieldErrors(
  paymentTab: "saved_card" | "new_card",
  cardName: string,
  cardNumber: string,
  cardExpiry: string,
  cardCvc: string,
  touched: { cardName?: boolean; cardNumber?: boolean; cardExpiry?: boolean; cardCvc?: boolean },
  isSubmitted: boolean
): CheckoutFormErrors {
  const errs: CheckoutFormErrors = {};
  if (paymentTab !== "new_card") return errs;

  const cleanNum = cardNumber.replace(/\D/g, "");
  const brand = detectCardBrand(cleanNum);
  const expectedNumLen = brand === "amex" ? 15 : 16;
  const expectedCvcLen = brand === "amex" ? 4 : 3;
  const cleanExp = cardExpiry.replace(/\D/g, "");
  const cleanCvcVal = cardCvc.replace(/\D/g, "");

  // 1. Cardholder Name
  if (!cardName.trim()) {
    if (touched.cardName || isSubmitted) errs.cardName = "Cardholder name is required.";
  } else if (cardName.trim().length < 2) {
    if (touched.cardName || isSubmitted) errs.cardName = "Cardholder name must be at least 2 characters.";
  }

  // 2. Card Number
  if (!cleanNum) {
    if (touched.cardNumber || isSubmitted) errs.cardNumber = "Card number is required.";
  } else if (cleanNum.length === expectedNumLen) {
    if (!validateLuhn(cleanNum)) errs.cardNumber = "Your card number is invalid.";
  } else if (cleanNum.length < expectedNumLen) {
    if (touched.cardNumber || isSubmitted) errs.cardNumber = `Your card number is incomplete (${cleanNum.length}/${expectedNumLen} digits).`;
  }

  // 3. Expiry Date (MM/YY)
  if (!cleanExp) {
    if (touched.cardExpiry || isSubmitted) errs.cardExpiry = "Expiry date is required.";
  } else if (cleanExp.length >= 2) {
    const m = parseInt(cleanExp.slice(0, 2), 10);
    if (m < 1 || m > 12) {
      errs.cardExpiry = "Your card's expiration month is invalid.";
    } else if (cleanExp.length === 4) {
      const y = parseInt(cleanExp.slice(2, 4), 10);
      const now = new Date();
      const curY = now.getFullYear() % 100;
      const curM = now.getMonth() + 1;
      if (y < curY || (y === curY && m < curM)) {
        errs.cardExpiry = "Your card's expiration year is in the past.";
      } else if (y > curY + 25) {
        errs.cardExpiry = "Your card's expiration year is invalid.";
      }
    } else if (touched.cardExpiry || isSubmitted) {
      errs.cardExpiry = "Your card's expiration date is incomplete.";
    }
  } else if (touched.cardExpiry || isSubmitted) {
    errs.cardExpiry = "Your card's expiration date is incomplete.";
  }

  // 4. CVC
  if (!cleanCvcVal) {
    if (touched.cardCvc || isSubmitted) errs.cardCvc = "CVC is required.";
  } else if (cleanCvcVal.length < expectedCvcLen) {
    if (touched.cardCvc || isSubmitted) errs.cardCvc = `Your card's security code is incomplete (${cleanCvcVal.length}/${expectedCvcLen} digits).`;
  }

  return errs;
}

export function getCheckoutValidationError(
  paymentTab: "saved_card" | "new_card",
  cardName: string,
  cardNumber: string,
  cardExpiry: string,
  cardCvc: string
): { field: "cardName" | "cardNumber" | "cardExpiry" | "cardCvc"; message: string } | null {
  if (paymentTab !== "new_card") return null;

  const cleanNum = cardNumber.replace(/\D/g, "");
  const brand = detectCardBrand(cleanNum);
  const expectedNumLen = brand === "amex" ? 15 : 16;
  const expectedCvcLen = brand === "amex" ? 4 : 3;
  const cleanExp = cardExpiry.replace(/\D/g, "");
  const cleanCvcVal = cardCvc.replace(/\D/g, "");

  if (!cardName.trim()) return { field: "cardName", message: "Cardholder name is required." };
  if (cardName.trim().length < 2) return { field: "cardName", message: "Cardholder name must be at least 2 characters." };
  if (!cleanNum) return { field: "cardNumber", message: "Card number is required." };
  if (cleanNum.length < expectedNumLen) return { field: "cardNumber", message: "Your card number is incomplete." };
  if (!validateLuhn(cleanNum)) return { field: "cardNumber", message: "Your card number is invalid." };
  if (!cleanExp) return { field: "cardExpiry", message: "Expiry date is required." };
  if (cleanExp.length < 4) return { field: "cardExpiry", message: "Your card's expiration date is incomplete." };

  const m = parseInt(cleanExp.slice(0, 2), 10);
  const y = parseInt(cleanExp.slice(2, 4), 10);
  const now = new Date();
  const curY = now.getFullYear() % 100;
  const curM = now.getMonth() + 1;
  if (m < 1 || m > 12) return { field: "cardExpiry", message: "Your card's expiration month is invalid." };
  if (y < curY || (y === curY && m < curM)) return { field: "cardExpiry", message: "Your card's expiration year is in the past." };
  if (y > curY + 25) return { field: "cardExpiry", message: "Your card's expiration year is invalid." };
  if (!cleanCvcVal) return { field: "cardCvc", message: "CVC is required." };
  if (cleanCvcVal.length < expectedCvcLen) return { field: "cardCvc", message: "Your card's security code is incomplete." };

  return null;
}
