import React from "react";
import { Check, ChevronRight, Package, Sparkles } from "lucide-react";
import Button from "@/components/ui/button";
import { CustomerPlanItem } from "../types";

interface OverviewUpgradeCardProps {
  popularPlan: CustomerPlanItem | null;
  upgradePlanName: string;
  upgradePlanPrice: string;
  upgradePlanPeriodText: string;
  isUpgradingPlanId: string | null;
  onSelectPlan: (plan: CustomerPlanItem) => void;
}

export const OverviewUpgradeCard: React.FC<OverviewUpgradeCardProps> = ({
  popularPlan,
  upgradePlanName,
  upgradePlanPrice,
  upgradePlanPeriodText,
  isUpgradingPlanId,
  onSelectPlan,
}) => {
  if (!popularPlan) {
    return (
      <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-[6px] p-5 sm:p-6 flex flex-col items-center justify-center text-center min-h-[160px]">
        <Package className="w-8 h-8 text-slate-400 mb-1" />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          All features unlocked
        </span>
      </div>
    );
  }

  const isUpgrading = isUpgradingPlanId === String(popularPlan.planId);

  const features =
    popularPlan?.features && Array.isArray(popularPlan.features) && popularPlan.features.length > 0
      ? popularPlan.features
      : [];

  const badgeText = popularPlan?.badgeText || (popularPlan?.popular ? "Most Popular" : "Recommended");

  return (
    <div className="relative bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent dark:from-orange-950/30 dark:via-orange-950/10 dark:to-transparent border border-orange-200/80 dark:border-orange-900/40 rounded-[6px] p-5 sm:p-6 flex flex-col justify-between shadow-2xs">
      <div>
        {/* Header with Title, Badge & Price */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {upgradePlanName}
              </h3>
              {badgeText && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-[#ff4a1f] dark:bg-orange-950/60 dark:text-orange-400 rounded-full border border-orange-200/80 dark:border-orange-900/60">
                  {badgeText}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {upgradePlanPeriodText}
            </p>
          </div>
          <span className="text-base sm:text-lg font-bold text-[#ff4a1f] shrink-0">
            {upgradePlanPrice}
          </span>
        </div>

        {/* Card Body: Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-normal leading-relaxed">
          {popularPlan?.description ||
            "Expand your transport capacity with enhanced quote allowances, real-time tracking, and priority carrier dispatch."}
        </p>

        {/* Card Body: What's Included feature checklist */}
        {features.length > 0 && (
          <div className="mt-3 pt-3 border-t border-orange-200/60 dark:border-orange-900/40 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              WHAT'S INCLUDED:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.slice(0, 4).map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium"
                >
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span className="truncate" title={feat}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Area with Action matching OverviewPlanCard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-4 border-t border-orange-200/70 dark:border-orange-900/50">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Sparkles size={13} className="text-[#ff4a1f] shrink-0" />
          <span>Instant activation & unlock</span>
        </div>

        <Button
          type="button"
          isLoading={isUpgrading}
          disabled={isUpgrading}
          onClick={() => onSelectPlan(popularPlan)}
          className="h-8 px-4 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[4px] shadow-2xs cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shrink-0"
        >
          <span>Upgrade to {upgradePlanName}</span>
          <ChevronRight size={13} strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
};

export default OverviewUpgradeCard;
