import React from "react";
import { CreditCard, ShieldCheck } from "lucide-react";
import { CheckoutSavedCardsList } from "./CheckoutSavedCardsList";
import { CheckoutNewCardForm } from "./CheckoutNewCardForm";
import { CheckoutPaymentMethodTabs } from "./CheckoutPaymentMethodTabs";
import { CardBrand } from "../../utils/cardValidationUtils";
import { CheckoutFormErrors } from "../../utils/checkoutValidation";

interface CheckoutPaymentMethodSectionProps {
  paymentTab: "saved_card" | "new_card";
  onSelectPaymentTab: (tab: "saved_card" | "new_card") => void;
  isLoadingCards: boolean;
  savedCards: any[];
  selectedCardId: string | null;
  activeCardMenuId: string | null;
  onSelectCard: (id: string) => void;
  onToggleCardMenu: (id: string) => void;
  onSetPrimary: (id: string) => void;
  onDeleteCard: (id: string) => void;
  onOpenAddCardModal: () => void;
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

export const CheckoutPaymentMethodSection: React.FC<CheckoutPaymentMethodSectionProps> = ({
  paymentTab,
  onSelectPaymentTab,
  isLoadingCards,
  savedCards,
  selectedCardId,
  activeCardMenuId,
  onSelectCard,
  onToggleCardMenu,
  onSetPrimary,
  onDeleteCard,
  onOpenAddCardModal,
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
    <div className="bg-white dark:bg-slate-900 rounded-[3px] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CreditCard size={17} className="text-blue-600 dark:text-blue-400" />
            <span>Payment Method</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Select a saved card or enter new credit/debit card details.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-[3px] border border-emerald-200/80 dark:border-emerald-800/60 self-start sm:self-auto">
          <ShieldCheck size={14} />
          <span>256-bit Encrypted</span>
        </div>
      </div>

      <CheckoutPaymentMethodTabs
        paymentTab={paymentTab}
        onSelectPaymentTab={onSelectPaymentTab}
      />

      {paymentTab === "saved_card" && (
        <CheckoutSavedCardsList
          isLoadingCards={isLoadingCards}
          savedCards={savedCards}
          selectedCardId={selectedCardId}
          activeCardMenuId={activeCardMenuId}
          onSelectCard={onSelectCard}
          onToggleCardMenu={onToggleCardMenu}
          onSetPrimary={onSetPrimary}
          onDeleteCard={onDeleteCard}
          onOpenAddCardModal={onOpenAddCardModal}
          onSwitchToNewCard={() => onSelectPaymentTab("new_card")}
        />
      )}

      {paymentTab === "saved_card" && (
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
          </div>
          <span className="relative bg-white dark:bg-slate-900 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            OR
          </span>
        </div>
      )}

      <div className={`space-y-4 ${paymentTab === "saved_card" ? "opacity-90" : ""}`}>
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Add a new card
          </label>
          {paymentTab === "saved_card" && (
            <button
              type="button"
              onClick={() => onSelectPaymentTab("new_card")}
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Use this form
            </button>
          )}
        </div>

        <CheckoutNewCardForm
          cardName={cardName}
          cardNumber={cardNumber}
          cardExpiry={cardExpiry}
          cardCvc={cardCvc}
          cardBrand={cardBrand}
          expectedCvcLength={expectedCvcLength}
          saveCardForFuture={saveCardForFuture}
          fieldErrors={fieldErrors}
          cardNameRef={cardNameRef}
          cardNumberRef={cardNumberRef}
          cardExpiryRef={cardExpiryRef}
          cardCvcRef={cardCvcRef}
          onCardNameChange={onCardNameChange}
          onCardNumberChange={onCardNumberChange}
          onExpiryChange={onExpiryChange}
          onCvcChange={onCvcChange}
          onSaveCardChange={onSaveCardChange}
          onBlurField={onBlurField}
        />
      </div>
    </div>
  );
};

export default CheckoutPaymentMethodSection;
