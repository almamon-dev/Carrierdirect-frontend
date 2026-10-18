import React from "react";
import { Check, CheckCircle2, ChevronDown } from "lucide-react";
import Button from "@/components/ui/button";
import { CustomerPlanItem } from "../types";

interface PlanCardItemProps {
  plan: CustomerPlanItem;
  isUpgrading: boolean;
  isExpanded: boolean;
  onToggleExpanded: (planId: string | number) => void;
  onSelectPlan: (plan: CustomerPlanItem) => void;
}

export const PlanCardItem: React.FC<PlanCardItemProps> = ({
  plan,
  isUpgrading,
  isExpanded,
  onToggleExpanded,
  onSelectPlan,
}) => {
  const isCurrent = plan.isCurrent;
  const isPopular = plan.popular;

  return (
    <div
      className={`relative rounded-[6px] p-4 sm:p-5 transition-all flex flex-col justify-between w-full bg-white dark:bg-[#181d24] shadow-xs hover:shadow-md ${
        isPopular
          ? "border-2 border-[#ff4a1f] dark:border-[#ff4a1f] ring-2 ring-[#ff4a1f]/10"
          : "border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#ff4a1f] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
          {plan.badgeText || "Most Popular"}
        </div>
      )}

      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {plan.name}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-relaxed min-h-[30px]">
              {plan.description}
            </p>
          </div>
          {isCurrent && (
            <span className="shrink-0 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded tracking-wider">
              Active
            </span>
          )}
        </div>

        <div className="pt-2 pb-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {plan.displayPrice}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {plan.billingCycleText}
            </span>
          </div>
          {plan.subNote && (
            <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {plan.subNote}
            </p>
          )}
        </div>

        <div className="pt-1 pb-4">
          {isCurrent ? (
            <div className="w-full h-9 rounded-[4px] text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1.5">
              <CheckCircle2 size={14} /> Current Active Plan
            </div>
          ) : (
            <Button
              type="button"
              isLoading={isUpgrading}
              disabled={isUpgrading}
              onClick={() => onSelectPlan(plan)}
              className={`w-full h-9 rounded-[4px] text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 ${
                isPopular
                  ? "bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-xs"
                  : "bg-slate-900 hover:bg-black dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-xs"
              }`}
            >
              {plan.isTrial ? (
                "Start 7-Day Trial"
              ) : isPopular ? (
                `Upgrade to ${plan.name}`
              ) : (
                `Select ${plan.name}`
              )}
            </Button>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            WHAT'S INCLUDED ({plan.features?.length || 0})
          </span>

          <div className="space-y-2">
            {(plan.features || [])
              .slice(0, isExpanded ? undefined : 4)
              .map((feat: string, i: number) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Check size={9} strokeWidth={3} />
                  </div>
                  <span className="leading-snug">{feat}</span>
                </div>
              ))}
          </div>

          {plan.features && plan.features.length > 4 && (
            <button
              type="button"
              onClick={() => onToggleExpanded(plan.planId)}
              className="w-full pt-1 text-xs font-semibold text-[#ff4a1f] hover:underline cursor-pointer flex items-center justify-between transition-colors"
            >
              <span>
                {isExpanded
                  ? "Show fewer features"
                  : `+ Show ${plan.features.length - 4} more features`}
              </span>
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanCardItem;
