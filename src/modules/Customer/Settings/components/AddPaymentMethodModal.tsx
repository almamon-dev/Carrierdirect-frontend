import React, { useState, useRef } from "react";
import Drawer from "@/components/modals/drawer";
import { useToastStore } from "@/stores/useToastStore";
import apiClient from "@/lib/axios";
import { formatCardNumber, formatExpiry, validateLuhn } from "../utils/cardUtils";
import { usePaymentCardValidation } from "../hooks/usePaymentCardValidation";
import {
  PaymentModalTitle,
  PaymentModalFooter,
  PaymentTermsGuidelines,
} from "./PaymentModalGuidelines";
import PaymentFormInputs from "./PaymentFormInputs";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess?: (newCard: any) => void;
  endpoint?: string;
}

export const AddPaymentMethodModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onAddSuccess,
  endpoint = "/subscription/payment-methods",
}) => {
  const showToast = useToastStore((state) => state.showToast);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isPrimary, setIsPrimary] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const cardNumberRef = useRef<HTMLInputElement>(null);
  const expiryRef = useRef<HTMLInputElement>(null);
  const cvcRef = useRef<HTMLInputElement>(null);

  const {
    markTouched,
    resetTouched,
    cleanNumber,
    cardBrand,
    expectedCvcLength,
    nameError,
    cardNumberError,
    expiryError,
    cvcError,
  } = usePaymentCardValidation({ cardName, cardNumber, expiry, cvc, isSubmitted });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    const expectedLen = cardBrand === "amex" ? 15 : 16;
    setCardNumber(formatCardNumber(raw, cardBrand));
    if (digits.length === expectedLen && validateLuhn(digits)) {
      expiryRef.current?.focus();
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value, expiry);
    setExpiry(formatted);
    const cleanExp = formatted.replace(/\D/g, "");
    if (cleanExp.length === 4) {
      const month = parseInt(cleanExp.slice(0, 2), 10);
      const year = parseInt(cleanExp.slice(2, 4), 10);
      const now = new Date();
      const curYear = now.getFullYear() % 100;
      const curMonth = now.getMonth() + 1;
      if (month >= 1 && month <= 12 && (year > curYear || (year === curYear && month >= curMonth))) {
        cvcRef.current?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    (["cardName", "cardNumber", "expiry", "cvc"] as const).forEach(markTouched);

    if (!cardName.trim() || cardName.trim().length < 2) {
      showToast(nameError || "Cardholder name is required.", "error");
      nameRef.current?.focus();
      return;
    }
    const expNumLen = cardBrand === "amex" ? 15 : 16;
    if (!cleanNumber || cleanNumber.length < expNumLen || !validateLuhn(cleanNumber)) {
      showToast(cardNumberError || "Please enter a valid card number.", "error");
      cardNumberRef.current?.focus();
      return;
    }
    if (!expiry || expiry.replace(/\D/g, "").length < 4 || expiryError) {
      showToast(expiryError || "Please enter a valid expiration date.", "error");
      expiryRef.current?.focus();
      return;
    }
    if (!cvc || cvc.replace(/\D/g, "").length < expectedCvcLength) {
      showToast(cvcError || "Please enter a valid CVC code.", "error");
      cvcRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiClient.post(endpoint, {
        card_name: cardName.trim(),
        card_number: cleanNumber,
        expiry,
        cvc: cvc.trim(),
        is_primary: isPrimary,
      });

      const newCard = res.data?.data?.new_card || res.data?.new_card || res.data || res;
      showToast(res.data?.message || res.message || "Payment method added successfully!", "success");
      if (onAddSuccess) onAddSuccess(newCard);

      setCardName("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setIsPrimary(true);
      resetTouched();
      onClose();
    } catch (err: any) {
      const errMsg = err.data?.message || err.message || "Failed to add payment method.";
      showToast(errMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={<PaymentModalTitle />}
      footer={
        <PaymentModalFooter
          isSubmitting={isSubmitting}
          onClose={onClose}
          onSubmit={handleSubmit}
        />
      }
      position="right"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans" noValidate>
        <PaymentTermsGuidelines />
        <PaymentFormInputs
          cardName={cardName}
          setCardName={setCardName}
          nameError={nameError}
          nameRef={nameRef}
          cardNumber={cardNumber}
          handleCardNumberChange={handleCardNumberChange}
          cardNumberError={cardNumberError}
          cardNumberRef={cardNumberRef}
          cleanNumber={cleanNumber}
          cardBrand={cardBrand}
          expiry={expiry}
          handleExpiryChange={handleExpiryChange}
          expiryError={expiryError}
          expiryRef={expiryRef}
          cvc={cvc}
          setCvc={setCvc}
          cvcError={cvcError}
          cvcRef={cvcRef}
          expectedCvcLength={expectedCvcLength}
          isPrimary={isPrimary}
          setIsPrimary={setIsPrimary}
          markTouched={markTouched}
        />
      </form>
    </Drawer>
  );
};
