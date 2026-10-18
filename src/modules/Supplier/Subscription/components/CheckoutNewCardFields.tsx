import React from "react";
import Input from "@/components/ui/input";
import FormLabel from "@/components/ui/label";
import { renderCardLogo, detectCardBrand } from "../utils/cardUtils";

interface CheckoutNewCardFieldsProps {
  cardName: string;
  setCardName: (v: string) => void;
  cardNumber: string;
  setCardNumber: (v: string) => void;
  cardExpiry: string;
  setCardExpiry: (v: string) => void;
  cardCvc: string;
  setCardCvc: (v: string) => void;
  saveCardForFuture: boolean;
  setSaveCardForFuture: (v: boolean) => void;
  markTouched: (field: "cardName" | "cardNumber" | "cardExpiry" | "cardCvc") => void;
}

export function CheckoutNewCardFields({
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvc,
  setCardCvc,
  saveCardForFuture,
  setSaveCardForFuture,
  markTouched,
}: CheckoutNewCardFieldsProps) {
  const cardBrand = detectCardBrand(cardNumber);

  return (
    <div className="space-y-3.5">
      <div>
        <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300">Name on Card</FormLabel>
        <Input
          type="text"
          placeholder="e.g. John Doe"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          onBlur={() => markTouched("cardName")}
          className="mt-1 h-9 text-xs"
        />
      </div>

      <div>
        <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300">Card Number</FormLabel>
        <div className="relative mt-1">
          <Input
            type="text"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 16);
              setCardNumber(val.replace(/(.{4})/g, "$1 ").trim());
            }}
            onBlur={() => markTouched("cardNumber")}
            className="h-9 text-xs pr-12 font-mono"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            {renderCardLogo(cardBrand)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300">Expiry (MM/YY)</FormLabel>
          <Input
            type="text"
            placeholder="MM/YY"
            maxLength={5}
            value={cardExpiry}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, "").slice(0, 4);
              if (val.length >= 3) val = `${val.slice(0, 2)}/${val.slice(2)}`;
              setCardExpiry(val);
            }}
            onBlur={() => markTouched("cardExpiry")}
            className="mt-1 h-9 text-xs font-mono"
          />
        </div>
        <div>
          <FormLabel className="text-xs font-bold text-slate-700 dark:text-slate-300">Security CVC</FormLabel>
          <Input
            type="password"
            placeholder="123"
            maxLength={4}
            value={cardCvc}
            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            onBlur={() => markTouched("cardCvc")}
            className="mt-1 h-9 text-xs font-mono"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
        <input
          type="checkbox"
          checked={saveCardForFuture}
          onChange={(e) => setSaveCardForFuture(e.target.checked)}
          className="accent-[#ff4a1f] rounded w-3.5 h-3.5"
        />
        <span>Securely save this card for automatic plan renewals</span>
      </label>
    </div>
  );
}
export default CheckoutNewCardFields;
