import React from "react";
import { Calendar, Info } from "lucide-react";
import FormLabel from "@/components/ui/label";
import Input from "@/components/ui/input";
import { CardBrand, renderCardLogo } from "../../utils/cardValidationUtils";
import { CheckoutFormErrors } from "../../utils/checkoutValidation";

interface CheckoutNewCardFormProps {
  cardName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardBrand: CardBrand;
  expectedCvcLength: number;
  saveCardForFuture: boolean;
  fieldErrors: CheckoutFormErrors;
  cardNameRef: React.RefObject<HTMLInputElement | null>;
  cardNumberRef: React.RefObject<HTMLInputElement | null>;
  cardExpiryRef: React.RefObject<HTMLInputElement | null>;
  cardCvcRef: React.RefObject<HTMLInputElement | null>;
  onCardNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExpiryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCvcChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveCardChange: (checked: boolean) => void;
  onBlurField: (field: "cardName" | "cardNumber" | "cardExpiry" | "cardCvc") => void;
}

export const CheckoutNewCardForm: React.FC<CheckoutNewCardFormProps> = ({
  cardName,
  cardNumber,
  cardExpiry,
  cardCvc,
  cardBrand,
  expectedCvcLength,
  saveCardForFuture,
  fieldErrors,
  cardNameRef,
  cardNumberRef,
  cardExpiryRef,
  cardCvcRef,
  onCardNameChange,
  onCardNumberChange,
  onExpiryChange,
  onCvcChange,
  onSaveCardChange,
  onBlurField,
}) => {
  return (
    <div className="space-y-3">
      {/* 1. Cardholder Name */}
      <div>
        <FormLabel htmlFor="checkout-cardholder-name" required className="text-xs font-semibold mb-1 block">
          Cardholder Name
        </FormLabel>
        <Input
          ref={cardNameRef as any}
          id="checkout-cardholder-name"
          value={cardName}
          placeholder="e.g. John Doe"
          onChange={onCardNameChange}
          onBlur={() => onBlurField("cardName")}
          error={fieldErrors.cardName}
          className="!h-10 text-xs rounded-[3px]"
        />
      </div>

      {/* 2. Card Number */}
      <div>
        <FormLabel htmlFor="checkout-card-num" required className="text-xs font-semibold mb-1 block">
          Card Number
        </FormLabel>
        <div className="relative">
          <Input
            ref={cardNumberRef as any}
            id="checkout-card-num"
            value={cardNumber}
            placeholder="4242 •••• •••• 4242"
            maxLength={19}
            onChange={onCardNumberChange}
            onBlur={() => onBlurField("cardNumber")}
            error={fieldErrors.cardNumber}
            className="!h-10 text-xs font-mono tracking-wider rounded-[3px] pr-12"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
            {renderCardLogo(cardBrand)}
          </div>
        </div>
      </div>

      {/* 3. Expiry & CVC in 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormLabel htmlFor="checkout-card-expiry" required className="text-xs font-semibold mb-1 block">
            Expiry Date
          </FormLabel>
          <div className="relative">
            <Input
              ref={cardExpiryRef as any}
              id="checkout-card-expiry"
              value={cardExpiry}
              placeholder="MM/YY"
              maxLength={5}
              onChange={onExpiryChange}
              onBlur={() => onBlurField("cardExpiry")}
              error={fieldErrors.cardExpiry}
              className="!h-10 text-xs rounded-[3px] pr-8"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Calendar size={14} />
            </div>
          </div>
        </div>

        <div>
          <FormLabel htmlFor="checkout-card-cvc" required className="text-xs font-semibold mb-1 block">
            CVC {cardBrand === "amex" ? "(4 Digits)" : "(3 Digits)"}
          </FormLabel>
          <div className="relative">
            <Input
              ref={cardCvcRef as any}
              id="checkout-card-cvc"
              value={cardCvc}
              placeholder={cardBrand === "amex" ? "1234" : "888"}
              maxLength={expectedCvcLength}
              onChange={onCvcChange}
              onBlur={() => onBlurField("cardCvc")}
              error={fieldErrors.cardCvc}
              className="!h-10 text-xs font-mono rounded-[3px] pr-8"
            />
            <div
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              title="3 or 4-digit security code on the back of your card"
            >
              <Info size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Save card checkbox */}
      <div className="flex items-center gap-2 pt-1">
        <input
          id="checkout-save-card"
          type="checkbox"
          checked={saveCardForFuture}
          onChange={(e) => onSaveCardChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 accent-blue-600 border-slate-300 rounded-[3px] cursor-pointer"
        />
        <label
          htmlFor="checkout-save-card"
          className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none font-medium"
        >
          Save this card for future renewals and platform billing
        </label>
      </div>
    </div>
  );
};

export default CheckoutNewCardForm;
