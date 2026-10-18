import React from "react";
import { ShieldCheck } from "lucide-react";
import Badge from "@/components/ui/badge";
import PageHeader from "@/components/common/page-header";
import { AddPaymentMethodModal } from "@/modules/Customer/Settings/components/AddPaymentMethodModal";
import SubscriptionCheckoutSkeleton from "@/components/common/SubscriptionCheckoutSkeleton";
import { useCheckoutState } from "./hooks/useCheckoutState";
import { CheckoutPaymentMethodSection } from "./components/checkout/CheckoutPaymentMethodSection";
import { CheckoutOrderSummaryCard } from "./components/checkout/CheckoutOrderSummaryCard";
import { CheckoutSuccessModal } from "./components/checkout/CheckoutSuccessModal";
import { renderCardLogo } from "./utils/cardValidationUtils";

export { renderCardLogo };

export default function SubscriptionCheckout() {
  const state = useCheckoutState();
  const { planState, cardForm } = state;

  if (state.isInitialLoading) {
    return <SubscriptionCheckoutSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 w-full max-w-7xl mx-auto min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c] text-slate-900 dark:text-slate-100 space-y-6">
      <PageHeader
        title="Complete Subscription Checkout"
        badge={
          <Badge className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-[3px] border border-blue-200 dark:border-blue-800">
            {planState.selectedPlan?.name || "Selected Plan"}
          </Badge>
        }
        description="Choose your payment method to activate your plan. All transactions are 256-bit encrypted."
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>SSL Secure</span>
          </span>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <CheckoutPaymentMethodSection
            paymentTab={state.paymentTab}
            onSelectPaymentTab={state.setPaymentTab}
            isLoadingCards={state.isLoadingCards}
            savedCards={state.savedCards}
            selectedCardId={state.selectedCardId}
            activeCardMenuId={state.activeCardMenuId}
            onSelectCard={state.setSelectedCardId}
            onToggleCardMenu={(id) => state.setActiveCardMenuId(state.activeCardMenuId === id ? null : id)}
            onSetPrimary={state.handleSetPrimary}
            onDeleteCard={state.handleDeleteCard}
            onOpenAddCardModal={() => state.setIsAddCardModalOpen(true)}
            cardName={cardForm.cardName}
            cardNumber={cardForm.cardNumber}
            cardExpiry={cardForm.cardExpiry}
            cardCvc={cardForm.cardCvc}
            cardBrand={cardForm.cardBrand}
            expectedCvcLength={cardForm.expectedCvcLength}
            saveCardForFuture={cardForm.saveCardForFuture}
            fieldErrors={cardForm.fieldErrors}
            cardNameRef={cardForm.cardNameRef}
            cardNumberRef={cardForm.cardNumberRef}
            cardExpiryRef={cardForm.cardExpiryRef}
            cardCvcRef={cardForm.cardCvcRef}
            onCardNameChange={cardForm.handleCardNameChange}
            onCardNumberChange={cardForm.handleCardNumberChange}
            onExpiryChange={cardForm.handleExpiryChange}
            onCvcChange={cardForm.handleCvcChange}
            onSaveCardChange={cardForm.setSaveCardForFuture}
            onBlurField={cardForm.markTouched}
          />
        </div>

        <div className="lg:col-span-5">
          <CheckoutOrderSummaryCard
            selectedPlan={planState.selectedPlan}
            planCycle={planState.planCycle}
            totalAmount={planState.totalAmount}
            nextBillingDateText={planState.nextBillingDateText}
            isAlreadySubscribed={planState.isAlreadySubscribed}
            isProcessing={state.isProcessing}
            currentSub={planState.currentSub}
            onCycleChange={planState.handleCycleChange}
            onSubmit={state.handleCheckoutSubmit}
          />
        </div>
      </div>

      <AddPaymentMethodModal
        isOpen={state.isAddCardModalOpen}
        onClose={() => state.setIsAddCardModalOpen(false)}
        onAddSuccess={() => state.loadSavedCards()}
      />

      <CheckoutSuccessModal
        isOpen={state.isSuccessModalOpen}
        successData={state.successData}
        selectedPlan={planState.selectedPlan}
        totalAmount={planState.totalAmount}
        isDownloadingInvoice={state.isDownloadingInvoice}
        onDownloadInvoice={state.handleDownloadTaxInvoice}
        onGoToDashboard={() => {
          state.setIsSuccessModalOpen(false);
          state.navigate("/customer/dashboard");
        }}
      />
    </div>
  );
}
