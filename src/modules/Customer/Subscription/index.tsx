import React from "react";
import { AddPaymentMethodModal } from "@/modules/Customer/Settings/components/AddPaymentMethodModal";
import QuotaReminderBanner from "@/components/common/QuotaReminderBanner";
import { SubscriptionSkeleton } from "@/components/common/SubscriptionSkeleton";
import { useSubscriptionPageState } from "./hooks/useSubscriptionPageState";
import { useSubscriptionActions } from "./hooks/useSubscriptionActions";
import { CustomerSubscriptionHeader } from "./components/CustomerSubscriptionHeader";
import { SubscriptionSidebar } from "./components/SubscriptionSidebar";
import { CustomerOverviewTab } from "./components/CustomerOverviewTab";
import { CustomerPlansTab } from "./components/CustomerPlansTab";
import { CustomerHistoryTab } from "./components/CustomerHistoryTab";
import { CustomerCancelModal } from "./components/CustomerCancelModal";

export default function CustomerSubscription() {
  const state = useSubscriptionPageState();

  const activeTierIndex = state.plans.findIndex((p) =>
    p.name.toLowerCase() === (state.activePlanName || "").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").toLowerCase()
  );
  const popularPlan = (activeTierIndex !== -1 && activeTierIndex < state.plans.length - 1)
    ? state.plans[activeTierIndex + 1]
    : (state.plans.find((p) => p.popular) || state.plans[1] || state.plans[0] || null);

  const upgradePlanName = popularPlan?.name || "Growth Logistics";
  const upgradePlanPrice = state.billingCycle === "yearly"
    ? (popularPlan?.yearlyPrice ? `€${popularPlan.yearlyPrice}/year` : "")
    : (popularPlan?.monthlyPrice ? `€${popularPlan.monthlyPrice}/month` : "");
  const upgradePlanPeriodText = state.billingCycle === "yearly" ? "365 days access" : "30 days access";

  const actions = useSubscriptionActions({
    billingCycle: state.billingCycle,
    loadData: state.loadData,
    setActiveTab: state.setActiveTab,
    setPaymentCards: state.setPaymentCards,
    setIsUpgradingPlanId: state.setIsUpgradingPlanId,
    setDownloadingId: state.setDownloadingId,
    setIsCanceling: state.setIsCanceling,
    setIsCancelModalOpen: state.setIsCancelModalOpen,
    setCancelConfirmationText: state.setCancelConfirmationText,
    cancelConfirmationText: state.cancelConfirmationText,
  });

  if (state.isLoading) {
    return <SubscriptionSkeleton userType="customer" activeTab={state.activeTab} billingCycle={state.billingCycle} />;
  }

  return (
    <div className="p-4 sm:p-5 md:p-6 w-full mx-auto space-y-5 font-sans antialiased animate-fade-in">
      <CustomerSubscriptionHeader
        isLoading={state.isLoading}
        onRefresh={state.loadData}
      />

      {(state.subscription?.is_trial || !state.hasActiveSub || ((state.subscription?.quote_limit ?? 0) > 0)) && (
        <QuotaReminderBanner
          quotaUsed={state.quotaUsed}
          maxQuota={Number(state.subscription?.quote_limit || (state.subscription?.is_trial ? 3 : 3))}
          daysRemaining={state.daysRemaining}
          onUpgradeClick={() => state.setActiveTab("packages")}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <SubscriptionSidebar
          activeTab={state.activeTab}
          onSelectTab={state.setActiveTab}
          billingHistoryCount={state.invoices.length}
        />

        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs w-full p-5 md:p-6 space-y-6">
          {state.activeTab === "overview" && (
            <CustomerOverviewTab
              subscription={state.subscription}
              activePlanName={state.activePlanName}
              activePlanPrice={state.activePlanPrice}
              formattedExpiryDate={state.formattedExpiryDate}
              formattedStartDate={state.formattedStartDate}
              daysRemaining={state.daysRemaining}
              autoRenew={state.autoRenew}
              onToggleAutoRenew={state.handleToggleAutoRenew}
              onOpenCancelModal={() => {
                state.setCancelConfirmationText("");
                state.setIsCancelModalOpen(true);
              }}
              popularPlan={popularPlan}
              upgradePlanName={upgradePlanName}
              upgradePlanPrice={upgradePlanPrice}
              upgradePlanPeriodText={upgradePlanPeriodText}
              isUpgradingPlanId={state.isUpgradingPlanId}
              onSelectPlan={actions.handleSelectPlan}
              paymentCards={state.paymentCards}
              onOpenPaymentModal={() => state.setIsPaymentModalOpen(true)}
              onSetDefaultCard={actions.handleSetDefaultCard}
              onDeleteCard={actions.handleDeleteCard}
            />
          )}

          {state.activeTab === "packages" && (
            <CustomerPlansTab
              plans={state.plans}
              billingCycle={state.billingCycle}
              onSetBillingCycle={state.setBillingCycle}
              isUpgradingPlanId={state.isUpgradingPlanId}
              onSelectPlan={actions.handleSelectPlan}
            />
          )}

          {state.activeTab === "history" && (
            <CustomerHistoryTab
              invoices={state.invoices}
              statusFilter={state.statusFilter}
              onStatusFilterChange={state.setStatusFilter}
              isLoading={state.isLoading}
              downloadingId={state.downloadingId}
              onDownloadReceipt={actions.handleDownloadReceipt}
              activePlanName={state.activePlanName}
              hasActiveSub={state.hasActiveSub}
              subscription={state.subscription}
              formattedExpiryDate={state.formattedExpiryDate}
              daysRemaining={state.daysRemaining}
              onUpgradeClick={() => state.setActiveTab("packages")}
            />
          )}
        </div>
      </div>

      <AddPaymentMethodModal
        isOpen={state.isPaymentModalOpen}
        onClose={() => state.setIsPaymentModalOpen(false)}
        onAddSuccess={() => state.loadData()}
      />

      <CustomerCancelModal
        isOpen={state.isCancelModalOpen}
        isCanceling={state.isCanceling}
        confirmationText={state.cancelConfirmationText}
        onConfirmationTextChange={state.setCancelConfirmationText}
        onClose={() => {
          state.setCancelConfirmationText("");
          state.setIsCancelModalOpen(false);
        }}
        onConfirm={actions.handleCancelSubscription}
      />
    </div>
  );
}
