import React from "react";
import { useNavigate } from "react-router-dom";
import SubscriptionCheckoutSkeleton from "@/components/common/SubscriptionCheckoutSkeleton";
import { CheckoutPlanCard } from "./components/CheckoutPlanCard";
import { CheckoutPaymentCard } from "./components/CheckoutPaymentCard";
import { CheckoutSuccessModal } from "./components/CheckoutSuccessModal";
import { useSubscriptionCheckoutState } from "./hooks/useSubscriptionCheckoutState";

export default function SupplierSubscriptionCheckout() {
  const navigate = useNavigate();
  const {
    selectedPlan,
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
    touched,
    markTouched,
    isProcessing,
    isInitialLoading,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    successData,
    totalAmount,
    handleCycleChange,
    handlePay,
  } = useSubscriptionCheckoutState();

  if (isInitialLoading) {
    return <SubscriptionCheckoutSkeleton />;
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Checkout & Plan Activation
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Review your chosen carrier tier and complete payment to unlock full freight dispatch tools.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <CheckoutPlanCard
            selectedPlan={selectedPlan}
            onCycleChange={handleCycleChange}
          />
        </div>

        <div className="lg:col-span-7">
          <CheckoutPaymentCard
            paymentTab={paymentTab}
            setPaymentTab={setPaymentTab}
            savedCards={savedCards}
            selectedCardId={selectedCardId}
            setSelectedCardId={setSelectedCardId}
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
            touched={touched}
            markTouched={markTouched}
            isProcessing={isProcessing}
            totalAmount={totalAmount}
            onPay={handlePay}
          />
        </div>
      </div>

      <CheckoutSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate("/supplier/dashboard");
        }}
        data={successData}
        planName={selectedPlan?.name}
        onGoToDashboard={() => navigate("/supplier/dashboard")}
      />
    </div>
  );
}
