import React from "react";
import { CreditCard, Plus } from "lucide-react";
import {
    CardData,
    CardValidationErrors,
    CardBrand,
    validateLuhn,
    detectCardBrand,
    validateCreditCardData,
    renderCardLogo,
} from "./checkoutCardUtils";
import { useAcceptCheckoutCardForm } from "../hooks/useAcceptCheckoutCardForm";
import { AcceptCheckoutPaymentMethodSelector } from "./AcceptCheckoutPaymentMethodSelector";
import { AcceptCheckoutSavedCardsList } from "./AcceptCheckoutSavedCardsList";
import { AcceptCheckoutNewCardForm } from "./AcceptCheckoutNewCardForm";
import { AcceptCheckoutPayLaterTerms } from "./AcceptCheckoutPayLaterTerms";
import { CorporateNet30DrawerModal } from "./CorporateNet30DrawerModal";

export {
    validateLuhn,
    detectCardBrand,
    validateCreditCardData,
    renderCardLogo,
};
export type { CardData, CardValidationErrors, CardBrand };

export interface AcceptCheckoutPaymentCardProps {
    paymentOption: "pay_now" | "pay_later";
    setPaymentOption: (opt: "pay_now" | "pay_later") => void;
    paymentTab: "saved_card" | "new_card";
    setPaymentTab: (tab: "saved_card" | "new_card") => void;
    savedCards: any[];
    isLoadingCards?: boolean;
    selectedCardId?: string;
    setSelectedCardId: (id: string) => void;
    onSetPrimaryCard?: (id: string) => void;
    onDeleteCard?: (id: string) => void;
    onOpenAddCardModal?: () => void;
    cardData: CardData;
    setCardData: React.Dispatch<React.SetStateAction<CardData>>;
    saveCard: boolean;
    setSaveCard: (val: boolean) => void;
    totalAmount: number;
    payLaterLimit?: number;
    payLaterStatus?: string;
    submitted?: boolean;
    canUsePayLater?: boolean;
    onLockedPayLaterClick?: () => void;
    onRequestCreditIncrease?: () => void;
}

export const AcceptCheckoutPaymentCard: React.FC<AcceptCheckoutPaymentCardProps> = ({
    paymentOption,
    setPaymentOption,
    paymentTab,
    setPaymentTab,
    savedCards,
    isLoadingCards,
    selectedCardId,
    setSelectedCardId,
    onSetPrimaryCard,
    onDeleteCard,
    cardData,
    setCardData,
    saveCard,
    setSaveCard,
    totalAmount,
    payLaterLimit = 80000,
    payLaterStatus = "approved",
    submitted = false,
    canUsePayLater = true,
    onLockedPayLaterClick,
    onRequestCreditIncrease,
}) => {
    const [isLearnMoreDrawerOpen, setIsLearnMoreDrawerOpen] = React.useState(false);
    const {
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
    } = useAcceptCheckoutCardForm(cardData, setCardData, submitted);

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[3px] p-5 shadow-2xs space-y-4 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-[#ff4a1f]" />
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        Payment Method
                    </h2>
                </div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    256-Bit Encrypted
                </span>
            </div>

            {/* Top Method Selector: Pay Now vs Corporate Pay Later (Net-30) */}
            <AcceptCheckoutPaymentMethodSelector
                paymentOption={paymentOption}
                setPaymentOption={setPaymentOption}
                canUsePayLater={canUsePayLater}
                payLaterStatus={payLaterStatus}
                payLaterLimit={payLaterLimit}
                onLockedPayLaterClick={onLockedPayLaterClick}
                onOpenLearnMore={() => setIsLearnMoreDrawerOpen(true)}
            />

            {/* When Pay Now (Card) is selected: Segmented Tabs (Saved card vs Add new card) */}
            {paymentOption === "pay_now" && (
                <div className="space-y-3 pt-1">
                    <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-[4px] w-full sm:w-auto sm:inline-flex border border-slate-200/60 dark:border-slate-700/60">
                        <button
                            type="button"
                            onClick={() => setPaymentTab("saved_card")}
                            className={`py-1.5 px-3.5 rounded-[3px] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                paymentTab === "saved_card" ? "bg-white dark:bg-slate-700 text-[#ff4a1f] dark:text-orange-400 shadow-2xs border border-orange-200/60 dark:border-orange-900/40"
                                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                            }`}
                        >
                            <span>Saved card</span>
                            {savedCards.length > 0 && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 font-bold">
                                    {savedCards.length}
                                </span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentTab("new_card")}
                            className={`py-1.5 px-3.5 rounded-[3px] text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                paymentTab === "new_card" ? "bg-white dark:bg-slate-700 text-[#ff4a1f] dark:text-orange-400 shadow-2xs border border-orange-200/60 dark:border-orange-900/40"
                                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                            }`}
                        >
                            <Plus size={13} />
                            <span>Add new card</span>
                        </button>
                    </div>

                    {paymentTab === "saved_card" && (
                        <AcceptCheckoutSavedCardsList
                            savedCards={savedCards}
                            isLoadingCards={isLoadingCards}
                            selectedCardId={selectedCardId}
                            setSelectedCardId={setSelectedCardId}
                            onSetPrimaryCard={onSetPrimaryCard}
                            onDeleteCard={onDeleteCard}
                            onGoToNewCard={() => setPaymentTab("new_card")}
                        />
                    )}

                    {paymentTab === "new_card" && (
                        <AcceptCheckoutNewCardForm
                            cardData={cardData}
                            setCardData={setCardData}
                            fieldErrors={fieldErrors}
                            isNameValid={isNameValid}
                            isCardNumValid={isCardNumValid}
                            isExpValid={isExpValid}
                            isCvcValid={isCvcValid}
                            brand={brand}
                            expectedCvcLength={expectedCvcLength}
                            saveCard={saveCard}
                            setSaveCard={setSaveCard}
                            cardNameRef={cardNameRef}
                            cardNumberRef={cardNumberRef}
                            expDateRef={expDateRef}
                            cvcRef={cvcRef}
                            markBlurred={markBlurred}
                            handleCardNumberChange={handleCardNumberChange}
                            handleExpiryChange={handleExpiryChange}
                            handleCvcChange={handleCvcChange}
                        />
                    )}
                </div>
            )}

            {/* When Corporate Net-30 is selected */}
            {paymentOption === "pay_later" && (
                <AcceptCheckoutPayLaterTerms
                    payLaterLimit={payLaterLimit}
                    totalAmount={totalAmount}
                    payLaterStatus={payLaterStatus}
                    canUsePayLater={canUsePayLater}
                    onRequestCredit={onRequestCreditIncrease}
                    onLockedPayLaterClick={onLockedPayLaterClick}
                />
            )}

            {/* Corporate Net-30 Slide-over Drawer Modal */}
            <CorporateNet30DrawerModal
                isOpen={isLearnMoreDrawerOpen}
                onClose={() => setIsLearnMoreDrawerOpen(false)}
                onApplyCreditLine={
                    canUsePayLater ? onRequestCreditIncrease : onLockedPayLaterClick
                }
                actionButtonText={
                    !canUsePayLater
                        ? "Upgrade Plan"
                        : (!payLaterLimit || payLaterLimit <= 0)
                            ? "Apply for Credit Line"
                            : "Request Credit Increase"
                }
            />
        </div>
    );
};
