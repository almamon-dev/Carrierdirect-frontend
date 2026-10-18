import React, { useState } from "react";
import { PlanCardItem } from "./PlanCardItem";

interface SubscriptionPlansTabProps {
  plans: any[];
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (c: "monthly" | "yearly") => void;
  onSelectPlan: (plan: any) => void;
  isUpgradingPlanId: string | null;
}

export function SubscriptionPlansTab({
  plans,
  billingCycle,
  setBillingCycle,
  onSelectPlan,
  isUpgradingPlanId,
}: SubscriptionPlansTabProps) {
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

  const togglePlanExpanded = (planId: string | number) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [String(planId)]: !prev[String(planId)],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Flexible Transport & Logistics Carrier Plans
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Choose a subscription tier designed for your transport fleet size and dispatch volume.
          </p>
        </div>

        {/* Monthly / Yearly Billing Toggle */}
        <div className="flex items-center gap-3 shrink-0 bg-slate-50/80 dark:bg-slate-800/50 p-1.5 px-3 rounded-full border border-slate-200/80 dark:border-slate-700/80">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`text-xs font-bold transition-colors cursor-pointer ${
              billingCycle === "monthly"
                ? "text-slate-900 dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            Monthly Billed
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={billingCycle === "yearly"}
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              billingCycle === "yearly" ? "bg-[#ff4a1f]" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                billingCycle === "yearly" ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`text-xs font-bold transition-colors cursor-pointer ${
                billingCycle === "yearly"
                  ? "text-slate-900 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
              }`}
            >
              Yearly Billed
            </button>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-extrabold bg-orange-100 dark:bg-orange-950/60 text-[#ff4a1f] dark:text-orange-400 border border-orange-200/80 dark:border-orange-900/60">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid using PlanCardItem */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${plans.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4 w-full items-stretch pt-2`}>
        {plans.map((plan: any, idx: number) => (
          <PlanCardItem
            key={idx}
            plan={plan}
            isUpgrading={isUpgradingPlanId === String(plan.planId || plan.id)}
            isExpanded={Boolean(expandedPlans[String(plan.planId || plan.id)])}
            onToggleExpanded={togglePlanExpanded}
            onSelectPlan={onSelectPlan}
          />
        ))}
      </div>
    </div>
  );
}

export default SubscriptionPlansTab;
