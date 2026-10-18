import { useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { decryptId } from "@/lib/encryption";
import { useQuoteViewDetail } from "./hooks/useQuoteViewDetail";
import { AcceptCheckoutSummaryCard } from "./components/AcceptCheckoutSummaryCard";
import { AcceptCheckoutPaymentCard } from "./components/AcceptCheckoutPaymentCard";
import { AcceptCheckoutSuccessModal } from "./components/AcceptCheckoutSuccessModal";
import { AddPaymentMethodModal } from "@/modules/Customer/Settings/components/AddPaymentMethodModal";
import { useSubscriptionQuota } from "@/hooks/useSubscriptionQuota";
import { SubscriptionLockModal } from "@/components/modals";
import apiClient from "@/lib/axios";
import { useToastStore } from "@/stores/useToastStore";
import PayLaterIncreaseModal from "@/modules/Customer/Finance/PayLater/components/PayLaterIncreaseModal";
import { computeCheckoutQuoteDetails } from "./utils/checkoutPricingCalculation";
import { useAcceptCheckoutProfileAndCards } from "./hooks/useAcceptCheckoutProfileAndCards";
import { useAcceptCheckoutBooking } from "./hooks/useAcceptCheckoutBooking";
import { AcceptCheckoutHeader } from "./components/AcceptCheckoutHeader";
import { AcceptCheckoutSidebarSummary } from "./components/AcceptCheckoutSidebarSummary";

export default function CustomerAcceptCheckout() {
    const { quoteId } = useParams<{ quoteId: string }>();
    const location = useLocation();

    const {
        canUsePayLater,
        checkPayLaterOrLock,
        isLockModalOpen,
        setIsLockModalOpen,
        modalTitle,
        modalDescription,
        modalFeatureName,
        modalRequiredPlan,
        modalBenefits,
        handleUpgradeRedirect,
    } = useSubscriptionQuota();

    const cleanQuoteId = quoteId ? decryptId(quoteId) : "";
    const stateQuote = location.state?.quote;
    const { quote: fetchedQuote, loading: fetchLoading } = useQuoteViewDetail(cleanQuoteId);

    const rawQuote = fetchedQuote || stateQuote;
    const req = (rawQuote as any)?.quote_request || (rawQuote as any)?.request || (rawQuote as any)?.logistics || {};

    const {
        payLaterLimit,
        payLaterStatus,
        savedCards,
        isLoadingCards,
        selectedCardId,
        setSelectedCardId,
        paymentTab,
        setPaymentTab,
        isAddCardModalOpen,
        setIsAddCardModalOpen,
        loadSavedCards,
        handleSetPrimaryCard,
        handleDeleteCard,
    } = useAcceptCheckoutProfileAndCards();

    const { quote, discountAmount } = useMemo(
        () => computeCheckoutQuoteDetails(rawQuote, stateQuote, req, cleanQuoteId),
        [rawQuote, stateQuote, req, cleanQuoteId]
    );

    const {
        paymentOption,
        setPaymentOption,
        saveCard,
        setSaveCard,
        agreedTerms,
        setAgreedTerms,
        isProcessing,
        isBookingSuccess,
        orderData,
        cardData,
        setCardData,
        checkoutSubmitted,
        handleConfirmBooking,
    } = useAcceptCheckoutBooking({
        rawQuote,
        cleanQuoteId,
        quote,
        discountAmount,
        canUsePayLater,
        checkPayLaterOrLock,
        payLaterLimit,
        savedCards,
        selectedCardId,
        paymentTab,
        setPaymentTab,
        loadSavedCards,
    });

    const [isIncreaseModalOpen, setIsIncreaseModalOpen] = useState(false);
    const [isIncreaseSubmitting, setIsIncreaseSubmitting] = useState(false);
    const showToast = useToastStore((state) => state.showToast);

    const handleOpenCreditRequest = () => {
        if (!canUsePayLater) {
            checkPayLaterOrLock();
            return;
        }
        setIsIncreaseModalOpen(true);
    };

    const handleIncreaseSubmit = async (target: string, amount: string, reason: string) => {
        if (!checkPayLaterOrLock()) return;
        if (!amount || parseFloat(amount) <= 0) return;

        setIsIncreaseSubmitting(true);
        try {
            let limitTypeKey = 'monthly';
            if (target === 'Monthly Limit') limitTypeKey = 'monthly';
            else if (target === 'Weekly Limit') limitTypeKey = 'weekly';
            else if (target === 'Daily Limit') limitTypeKey = 'daily';

            await apiClient.post('/customer/pay-later/request', {
                requested_limit: parseFloat(amount),
                limit_type: limitTypeKey,
                reason,
            });

            showToast("Credit limit request submitted successfully. Awaiting review.", "success");
            setIsIncreaseModalOpen(false);
        } catch (err: any) {
            showToast(err?.response?.data?.message || "Failed to submit credit request", "error");
        } finally {
            setIsIncreaseSubmitting(false);
        }
    };

    if (fetchLoading && !stateQuote) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 size={32} className="animate-spin text-[#ff4a1f]" />
            </div>
        );
    }

    return (
        <div className="pt-4 sm:pt-6 pb-12 px-3.5 sm:px-6 max-w-7xl mx-auto w-full font-sans antialiased text-slate-800 dark:text-slate-100 min-h-[85vh]">
            <AcceptCheckoutHeader
                quoteId={quote.id}
                requestId={quote.requestId}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                    <AcceptCheckoutPaymentCard
                        paymentOption={paymentOption}
                        setPaymentOption={setPaymentOption}
                        paymentTab={paymentTab}
                        setPaymentTab={setPaymentTab}
                        savedCards={savedCards}
                        isLoadingCards={isLoadingCards}
                        selectedCardId={selectedCardId}
                        setSelectedCardId={setSelectedCardId}
                        onSetPrimaryCard={handleSetPrimaryCard}
                        onDeleteCard={handleDeleteCard}
                        onOpenAddCardModal={() => setIsAddCardModalOpen(true)}
                        cardData={cardData}
                        setCardData={setCardData}
                        saveCard={saveCard}
                        setSaveCard={setSaveCard}
                        totalAmount={quote.totalAmount}
                        payLaterLimit={payLaterLimit}
                        payLaterStatus={payLaterStatus}
                        submitted={checkoutSubmitted}
                        canUsePayLater={canUsePayLater}
                        onLockedPayLaterClick={() => checkPayLaterOrLock()}
                        onRequestCreditIncrease={handleOpenCreditRequest}
                    />

                    <AcceptCheckoutSummaryCard quote={quote} />
                </div>

                <div className="lg:col-span-5 xl:col-span-4">
                    <AcceptCheckoutSidebarSummary
                        quote={quote}
                        paymentOption={paymentOption}
                        agreedTerms={agreedTerms}
                        setAgreedTerms={setAgreedTerms}
                        isProcessing={isProcessing}
                        handleConfirmBooking={handleConfirmBooking}
                    />
                </div>
            </div>

            <AddPaymentMethodModal
                isOpen={isAddCardModalOpen}
                onClose={() => setIsAddCardModalOpen(false)}
                onAddSuccess={() => {
                    loadSavedCards();
                }}
            />

            <AcceptCheckoutSuccessModal
                isOpen={isBookingSuccess}
                quote={quote}
                orderData={orderData}
                paymentMethod={paymentOption}
            />

            <PayLaterIncreaseModal
                isOpen={isIncreaseModalOpen}
                onClose={() => setIsIncreaseModalOpen(false)}
                calculatedStats={{
                    totalCreditLimit: payLaterLimit > 0 ? payLaterLimit : 40000,
                    monthlyLimit: payLaterLimit > 0 ? payLaterLimit : 40000,
                    weeklyLimit: 15000,
                    dailyLimit: 8000,
                }}
                onSubmit={handleIncreaseSubmit}
                isSubmitting={isIncreaseSubmitting}
            />

            <SubscriptionLockModal
                isOpen={isLockModalOpen}
                onClose={() => setIsLockModalOpen(false)}
                onUpgrade={handleUpgradeRedirect}
                userType="customer"
                title={modalTitle}
                description={modalDescription}
                featureName={modalFeatureName}
                requiredPlan={modalRequiredPlan}
                benefits={modalBenefits}
            />
        </div>
    );
}
