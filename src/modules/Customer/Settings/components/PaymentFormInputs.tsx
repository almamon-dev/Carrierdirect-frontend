import React from "react";
import { CheckCircle2, Lock } from "lucide-react";
import Input from "@/components/ui/input";
import Checkbox from "@/components/ui/checkbox";
import { CardBrand, renderCardBrandBadge, validateLuhn } from "../utils/cardUtils";

interface PaymentFormInputsProps {
  cardName: string;
  setCardName: (v: string) => void;
  nameError: string | null;
  nameRef: React.RefObject<HTMLInputElement | null>;

  cardNumber: string;
  handleCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cardNumberError: string | null;
  cardNumberRef: React.RefObject<HTMLInputElement | null>;
  cleanNumber: string;
  cardBrand: CardBrand;

  expiry: string;
  handleExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  expiryError: string | null;
  expiryRef: React.RefObject<HTMLInputElement | null>;

  cvc: string;
  setCvc: (v: string) => void;
  cvcError: string | null;
  cvcRef: React.RefObject<HTMLInputElement | null>;
  expectedCvcLength: number;

  isPrimary: boolean;
  setIsPrimary: (v: boolean) => void;
  markTouched: (f: "cardName" | "cardNumber" | "expiry" | "cvc") => void;
}

export const PaymentFormInputs: React.FC<PaymentFormInputsProps> = ({
  cardName,
  setCardName,
  nameError,
  nameRef,
  cardNumber,
  handleCardNumberChange,
  cardNumberError,
  cardNumberRef,
  cleanNumber,
  cardBrand,
  expiry,
  handleExpiryChange,
  expiryError,
  expiryRef,
  cvc,
  setCvc,
  cvcError,
  cvcRef,
  expectedCvcLength,
  isPrimary,
  setIsPrimary,
  markTouched,
}) => {
  return (
    <>
      <div>
        <Input
          ref={nameRef}
          label="Cardholder Name *"
          placeholder="e.g. John Doe"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          onBlur={() => markTouched("cardName")}
          error={nameError || undefined}
          rightIcon={
            !nameError && cardName.trim().length >= 2 ? (
              <CheckCircle2 size={15} className="text-emerald-500" />
            ) : undefined
          }
          required
        />
      </div>

      <div>
        <Input
          ref={cardNumberRef}
          label="Card Number *"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardNumberChange}
          onBlur={() => markTouched("cardNumber")}
          maxLength={19}
          className="pl-14 font-mono"
          icon={renderCardBrandBadge(cardBrand)}
          error={cardNumberError || undefined}
          rightIcon={
            !cardNumberError &&
            cleanNumber.length >= (cardBrand === "amex" ? 15 : 16) &&
            validateLuhn(cleanNumber) ? (
              <CheckCircle2 size={15} className="text-emerald-500" />
            ) : undefined
          }
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input
            ref={expiryRef}
            label="Expires (MM/YY) *"
            placeholder="MM/YY"
            value={expiry}
            onChange={handleExpiryChange}
            onBlur={() => markTouched("expiry")}
            maxLength={5}
            error={expiryError || undefined}
            rightIcon={
              !expiryError && expiry.replace(/\D/g, "").length === 4 ? (
                <CheckCircle2 size={15} className="text-emerald-500" />
              ) : undefined
            }
            required
          />
        </div>

        <div>
          <Input
            ref={cvcRef}
            label="Security Code (CVC) *"
            placeholder={cardBrand === "amex" ? "1234" : "123"}
            type="password"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, expectedCvcLength))}
            onBlur={() => markTouched("cvc")}
            maxLength={expectedCvcLength}
            icon={<Lock size={14} />}
            error={cvcError || undefined}
            rightIcon={
              !cvcError && cvc.replace(/\D/g, "").length === expectedCvcLength ? (
                <CheckCircle2 size={15} className="text-emerald-500" />
              ) : undefined
            }
            required
          />
        </div>
      </div>

      <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
        <Checkbox
          checked={isPrimary}
          onChange={(e) => setIsPrimary(e.target.checked)}
        />
        <span className="text-[13px] font-semibold text-slate-700">Set as primary payment method</span>
      </label>

      <div className="pt-2.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
        <Lock size={15} className="text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-normal font-medium">
          Your payment details are protected with <strong>256-bit SSL encryption</strong> and are{" "}
          <strong>PCI-DSS Level 1 compliant</strong>.
        </p>
      </div>
    </>
  );
};

export default PaymentFormInputs;
