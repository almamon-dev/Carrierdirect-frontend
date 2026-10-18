import React, { useState } from "react";
import { Check, ShieldCheck, ChevronDown } from "lucide-react";
import Badge from "@/components/ui/badge";

interface CheckoutPlanCardProps {
  selectedPlan: any;
  onCycleChange: (cycle: "monthly" | "yearly") => void;
}

export function CheckoutPlanCard({
  selectedPlan,
  onCycleChange,
}: CheckoutPlanCardProps) {
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(false);
  const cycle = selectedPlan?.cycle || "monthly";
  const monthlyPrice = Number(selectedPlan?.priceMonthly || 49);
  const yearlyPrice = Number(selectedPlan?.priceYearly || 490);
  const displayPrice = cycle === "yearly" ? yearlyPrice : monthlyPrice;
  const features: string[] = selectedPlan?.features || [];

  return (
    <div className="bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Selected Plan</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedPlan?.name || "Professional Carrier"}</h2>
        </div>
        <Badge variant="secondary" className="bg-orange-50 text-[#ff4a1f] font-bold text-[10px]">
          {cycle === "yearly" ? "Annual Billing" : "Monthly Billing"}
        </Badge>
      </div>

      {/* Cycle Switch */}
      <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          type="button"
          onClick={() => onCycleChange("monthly")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
            cycle === "monthly"
              ? "bg-white dark:bg-[#12161c] text-[#ff4a1f] shadow-2xs"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Monthly (€{monthlyPrice}/mo)
        </button>
        <button
          type="button"
          onClick={() => onCycleChange("yearly")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            cycle === "yearly"
              ? "bg-white dark:bg-[#12161c] text-[#ff4a1f] shadow-2xs"
              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <span>Yearly (€{yearlyPrice}/yr)</span>
          <span className="text-[9px] px-1 py-0.25 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded font-black">
            Save 20%
          </span>
        </button>
      </div>

      {/* Price Summary */}
      <div className="p-4 rounded-xl bg-orange-50/40 dark:bg-[#ff4a1f]/5 border border-orange-100 dark:border-[#ff4a1f]/20 flex items-baseline justify-between">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Billed Today</span>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            €{displayPrice.toFixed(2)}
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          {cycle === "yearly" ? "Billed annually" : "Billed monthly"}
        </span>
      </div>

      {/* Features List */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Plan Benefits & Quota</span>
          {features.length > 4 && (
            <button
              type="button"
              onClick={() => setIsFeaturesExpanded(!isFeaturesExpanded)}
              className="text-[11px] font-bold text-[#ff4a1f] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{isFeaturesExpanded ? "Show less" : `View all (${features.length})`}</span>
              <ChevronDown size={12} className={`transition-transform ${isFeaturesExpanded ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
        <ul className="space-y-1.5">
          {(isFeaturesExpanded ? features : features.slice(0, 4)).map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Security Trust Badge */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-[11px]">
        <ShieldCheck size={15} className="text-emerald-500 shrink-0" />
        <span>256-bit encrypted SSL checkout. Cancel anytime from your portal.</span>
      </div>
    </div>
  );
}
export default CheckoutPlanCard;
