import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AddPaymentMethodModal } from "@/modules/Customer/Settings/components/AddPaymentMethodModal";
import QuotaReminderBanner from "@/components/common/QuotaReminderBanner";
import { SubscriptionSkeleton } from "@/components/common/SubscriptionSkeleton";
import { TabKey } from "./types";
import { SupplierSubscriptionHeader } from "./components/SupplierSubscriptionHeader";
import { SubscriptionSidebar } from "./components/SubscriptionSidebar";
import { SubscriptionOverviewTab } from "./components/SubscriptionOverviewTab";
import { SubscriptionPlansTab } from "./components/SubscriptionPlansTab";
import { SubscriptionBillingHistoryTab } from "./components/SubscriptionBillingHistoryTab";
import { CancelSubscriptionModal } from "./components/CancelSubscriptionModal";
import { useSupplierSubscriptionData } from "./hooks/useSupplierSubscriptionData";
import { buildSupplierTierMap } from "./utils/subscriptionTiers";

export default function SupplierSubscription() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const getNormalizedTab = (tabStr: string | null): TabKey => {
    if (!tabStr) return "overview";
    const lower = tabStr.toLowerCase();
    if (lower === "packages" || lower === "plans" || lower === "pricing" || lower === "package") return "packages";
    if (lower === "history" || lower === "billing" || lower === "invoices" || lower === "receipts" || lower === "billing-history") return "history";
    return "overview";
  };

  const activeTab = useMemo(() => getNormalizedTab(searchParams.get("tab")), [searchParams]);

  const setActiveTab = (tab: TabKey) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", tab);
        return next;
      },
      { replace: true }
    );
  };

  const billingCycle = useMemo<"monthly" | "yearly">(() => {
    const val = (searchParams.get("cycle") || searchParams.get("billing") || "").toLowerCase();
    return val === "yearly" || val === "annual" ? "yearly" : "monthly";
  }, [searchParams]);

  const setBillingCycle = (cycle: "monthly" | "yearly") => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("cycle", cycle);
        return next;
      },
      { replace: true }
    );
  };

  const {
    subscription,
    dbPlans,
    invoices,
    quotaUsed,
    isLoading,
    isUpgradingPlanId,
    downloadingId,
    autoRenew,
    paymentCards,
    isCancelModalOpen,
    setIsCancelModalOpen,
    loadData,
    handleToggleAutoRenew,
    handleSetDefaultCard,
    handleDeleteCard,
    handleCancelSubscription,
    handleDownloadReceipt,
    handleSelectPlan,
  } = useSupplierSubscriptionData(billingCycle, setActiveTab);

  const plans = useMemo(
    () => buildSupplierTierMap(dbPlans, billingCycle, subscription),
    [dbPlans, billingCycle, subscription]
  );

  const hasActiveSub = Boolean(subscription?.is_active || (subscription?.status === "active" && !subscription?.is_trial));
  const activePlanName = subscription?.plan_name || (subscription?.is_trial ? "7-Day Free Trial" : (hasActiveSub ? "Professional Carrier" : "No Active Plan"));
  const activePlanPrice = subscription?.is_trial
    ? "Free Trial"
    : (subscription?.price && Number(subscription.price) > 0
      ? `€${(parseFloat(String(subscription.price).replace(/[^0-9.-]/g, "")) || 0).toFixed(0)}/${subscription?.billing_period === "annual" || billingCycle === "yearly" ? "year" : "month"}`
      : (hasActiveSub ? "Active" : "—"));

  const activeTierIndex = plans.findIndex((p: any) =>
    p.name.toLowerCase() === (activePlanName || "").replace(/\s*\((Monthly|Yearly|Annual)\)/i, "").toLowerCase()
  );
  const popularPlan = (activeTierIndex !== -1 && activeTierIndex < plans.length - 1)
    ? plans[activeTierIndex + 1]
    : (plans.find((p: any) => p.popular && !p.isCurrent) || plans.find((p: any) => !p.isTrial && !p.isCurrent) || plans[1] || plans[0] || null);

  const upgradePlanName = popularPlan?.name || "Enterprise Fleet Operator";
  const upgradePlanPrice = billingCycle === "yearly"
    ? (popularPlan?.yearlyPrice ? `€${popularPlan.yearlyPrice}/year` : (popularPlan?.displayPrice || ""))
    : (popularPlan?.monthlyPrice ? `€${popularPlan.monthlyPrice}/month` : (popularPlan?.displayPrice || ""));
  const upgradePlanPeriodText = billingCycle === "yearly" ? "365 days access" : "30 days access";

  const daysRemaining = subscription?.days_remaining ?? (
    subscription?.expires_at
      ? Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : 7
  );

  const formattedExpiryDate = subscription?.expires_at
    ? new Date(subscription.expires_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  const formattedStartDate = (subscription?.started_at || subscription?.created_at)
    ? new Date(subscription.started_at || subscription.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  if (isLoading) {
    return <SubscriptionSkeleton userType="supplier" activeTab={activeTab} billingCycle={billingCycle} />;
  }

  return (
    <div className="p-4 sm:p-5 md:p-6 w-full mx-auto space-y-5 font-sans antialiased animate-fade-in">
      <SupplierSubscriptionHeader
        isLoading={isLoading}
        onRefresh={loadData}
        isActive={Boolean(subscription?.is_active && !subscription?.is_trial)}
      />

      {(subscription?.is_trial || !subscription?.is_active || ((subscription?.quotes_limit ?? 0) > 0)) && (
        <QuotaReminderBanner
          quotaUsed={quotaUsed}
          maxQuota={Number(subscription?.quotes_limit || (subscription?.is_trial ? 10 : 100))}
          daysRemaining={daysRemaining}
          onUpgradeClick={() => setActiveTab("packages")}
        />
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <SubscriptionSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          billingHistoryCount={invoices.length}
        />

        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs w-full p-5 md:p-6 space-y-6">
          {activeTab === "overview" && (
            <SubscriptionOverviewTab
              subscription={subscription}
              activePlanName={activePlanName}
              activePlanPrice={activePlanPrice}
              formattedExpiryDate={formattedExpiryDate}
              formattedStartDate={formattedStartDate}
              daysRemaining={daysRemaining}
              autoRenew={autoRenew}
              onToggleAutoRenew={handleToggleAutoRenew}
              onOpenCancelModal={() => setIsCancelModalOpen(true)}
              popularPlan={popularPlan}
              upgradePlanName={upgradePlanName}
              upgradePlanPrice={upgradePlanPrice}
              upgradePlanPeriodText={upgradePlanPeriodText}
              isUpgradingPlanId={isUpgradingPlanId}
              onSelectPlan={handleSelectPlan}
              paymentCards={paymentCards}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              onSetDefaultCard={handleSetDefaultCard}
              onDeleteCard={handleDeleteCard}
            />
          )}

          {activeTab === "packages" && (
            <SubscriptionPlansTab
              plans={plans}
              billingCycle={billingCycle}
              setBillingCycle={setBillingCycle}
              onSelectPlan={handleSelectPlan}
              isUpgradingPlanId={isUpgradingPlanId}
            />
          )}

          {activeTab === "history" && (
            <SubscriptionBillingHistoryTab
              invoices={invoices as any}
              isLoading={isLoading}
              downloadingId={downloadingId}
              onDownloadReceipt={handleDownloadReceipt as any}
            />
          )}
        </div>
      </div>

      <CancelSubscriptionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelSubscription}
        planName={activePlanName}
        daysRemaining={daysRemaining}
      />

      <AddPaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onAddSuccess={() => {
          setIsPaymentModalOpen(false);
          loadData();
        }}
      />
    </div>
  );
}
