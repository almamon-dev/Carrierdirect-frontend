import React from "react";
import { Lock, Loader2 } from "lucide-react";
import Button from "@/components/ui/button";
import { renderCardLogo } from "../utils/cardUtils";
import { CheckoutNewCardFields } from "./CheckoutNewCardFields";

interface CheckoutPaymentCardProps {
  paymentTab: "saved_card" | "new_card";
  setPaymentTab: (tab: "saved_card" | "new_card") => void;
  savedCards: any[];
  selectedCardId: string | null;
  setSelectedCardId: (id: string) => void;
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
  touched: Record<string, boolean | undefined>;
  markTouched: (field: "cardName" | "cardNumber" | "cardExpiry" | "cardCvc") => void;
  isProcessing: boolean;
  totalAmount: number;
  onPay: () => void;
}

export function CheckoutPaymentCard({
  paymentTab,
  setPaymentTab,
  savedCards,
  selectedCardId,
  setSelectedCardId,
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
  isProcessing,
  totalAmount,
  onPay,
}: CheckoutPaymentCardProps) {
  return (
    <div className="bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Payment Details</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select a saved payment method or enter a new card.</p>
      </div>

      {savedCards.length > 0 && (
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setPaymentTab("saved_card")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              paymentTab === "saved_card"
                ? "bg-white dark:bg-[#12161c] text-[#ff4a1f] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Saved Card ({savedCards.length})
          </button>
          <button
            type="button"
            onClick={() => setPaymentTab("new_card")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              paymentTab === "new_card"
                ? "bg-white dark:bg-[#12161c] text-[#ff4a1f] shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            New Credit / Debit Card
          </button>
        </div>
      )}

      {paymentTab === "saved_card" && savedCards.length > 0 ? (
        <div className="space-y-2">
          {savedCards.map((card) => {
            const isSelected = selectedCardId === String(card.id);
            return (
              <label
                key={card.id}
                onClick={() => setSelectedCardId(String(card.id))}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#ff4a1f] bg-orange-50/20 dark:bg-[#ff4a1f]/5 ring-1 ring-[#ff4a1f]/30"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="saved_card"
                    checked={isSelected}
                    onChange={() => setSelectedCardId(String(card.id))}
                    className="accent-[#ff4a1f] w-4 h-4 cursor-pointer"
                  />
                  <div className="flex items-center gap-2">
                    {renderCardLogo(card.brand || card.type)}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      •••• {card.last4}
                    </span>
                    {card.is_primary && (
                      <span className="px-1.5 py-0.25 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">
                        Primary
                      </span>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      ) : (
        <CheckoutNewCardFields
          cardName={cardName}
          setCardName={setCardName}
          cardNumber={cardNumber}
          setCardNumber={setCardNumber}
          cardExpiry={cardExpiry}
          setCardExpiry={setCardExpiry}
          cardCvc={cardCvc}
          setCardCvc={setCardCvc}
          saveCardForFuture={saveCardForFuture}
          setSaveCardForFuture={setSaveCardForFuture}
          markTouched={markTouched}
        />
      )}

      {/* Pay CTA */}
      <Button
        size="md"
        disabled={isProcessing}
        onClick={onPay}
        className="w-full h-10 rounded-xl text-xs font-extrabold bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center justify-center gap-2 shadow-sm cursor-pointer"
      >
        {isProcessing ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <Lock size={14} />
            <span>Pay €{totalAmount.toFixed(2)} & Activate Plan</span>
          </>
        )}
      </Button>
    </div>
  );
}
export default CheckoutPaymentCard;
