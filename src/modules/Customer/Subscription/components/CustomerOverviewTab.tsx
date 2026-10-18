import React from "react";
import {
  CustomerPlanItem,
  SavedCard,
  UserSubscriptionData,
} from "../types";
import { OverviewPlanCard } from "./OverviewPlanCard";
import { OverviewUpgradeCard } from "./OverviewUpgradeCard";
import { SubscriptionPaymentMethodsCard } from "./SubscriptionPaymentMethodsCard";

interface CustomerOverviewTabProps {
  subscription: UserSubscriptionData | null;
  activePlanName: string;
  activePlanPrice: string;
  formattedExpiryDate: string;
  formattedStartDate: string | null;
  daysRemaining: number;
  autoRenew: boolean;
  onToggleAutoRenew: () => void;
  onOpenCancelModal: () => void;
  popularPlan: CustomerPlanItem | null;
  upgradePlanName: string;
  upgradePlanPrice: string;
  upgradePlanPeriodText: string;
  isUpgradingPlanId: string | null;
  onSelectPlan: (plan: CustomerPlanItem) => void;
  paymentCards: SavedCard[];
  onOpenPaymentModal: () => void;
  onSetDefaultCard: (id: string) => Promise<void>;
  onDeleteCard: (id: string) => Promise<void>;
}

export const CustomerOverviewTab: React.FC<CustomerOverviewTabProps> = ({
  subscription,
  activePlanName,
  activePlanPrice,
  formattedExpiryDate,
  formattedStartDate,
  daysRemaining,
  autoRenew,
  onToggleAutoRenew,
  onOpenCancelModal,
  popularPlan,
  upgradePlanName,
  upgradePlanPrice,
  upgradePlanPeriodText,
  isUpgradingPlanId,
  onSelectPlan,
  paymentCards,
  onOpenPaymentModal,
  onSetDefaultCard,
  onDeleteCard,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. PLAN SECTION */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <OverviewPlanCard
            subscription={subscription}
            activePlanName={activePlanName}
            activePlanPrice={activePlanPrice}
            formattedExpiryDate={formattedExpiryDate}
            formattedStartDate={formattedStartDate}
            daysRemaining={daysRemaining}
            autoRenew={autoRenew}
            onToggleAutoRenew={onToggleAutoRenew}
            onOpenCancelModal={onOpenCancelModal}
          />

          <OverviewUpgradeCard
            popularPlan={popularPlan}
            upgradePlanName={upgradePlanName}
            upgradePlanPrice={upgradePlanPrice}
            upgradePlanPeriodText={upgradePlanPeriodText}
            isUpgradingPlanId={isUpgradingPlanId}
            onSelectPlan={onSelectPlan}
          />
        </div>
      </section>

      {/* 2. RENEWAL SETTINGS */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Renewal Settings
        </h2>

        <div className="flex items-center justify-between p-3.5 bg-slate-50/70 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800/80">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Subscription Auto-Renew
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Automatically renew your subscription at the end of each billing cycle to maintain uninterrupted platform service.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={autoRenew}
            onClick={onToggleAutoRenew}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              autoRenew ? "bg-[#ff4a1f]" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                autoRenew ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </section>

      {/* 3. PAYMENT METHOD SECTION */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <SubscriptionPaymentMethodsCard
          savedCards={paymentCards}
          onOpenAddCard={onOpenPaymentModal}
          onSetDefaultCard={onSetDefaultCard}
          onDeleteCard={onDeleteCard}
        />
      </section>
    </div>
  );
};

export default CustomerOverviewTab;
