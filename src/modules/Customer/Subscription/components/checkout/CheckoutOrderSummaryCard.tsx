import React, { useState } from "react";
import { CheckCircle2, Lock, Calendar, Info, Rocket } from "lucide-react";
import Button from "@/components/ui/button";
import { CheckoutFeaturesList } from "./CheckoutFeaturesList";
import { CheckoutTrustBadges } from "./CheckoutTrustBadges";

interface CheckoutOrderSummaryCardProps {
  selectedPlan: any;
  planCycle: "monthly" | "yearly";
  totalAmount: number;
  nextBillingDateText: string;
  isAlreadySubscribed: boolean;
  isProcessing: boolean;
  currentSub: any;
  onCycleChange: (cycle: "monthly" | "yearly") => void;
  onSubmit: () => void;
}

export const CheckoutOrderSummaryCard: React.FC<CheckoutOrderSummaryCardProps> = ({
  selectedPlan,
  planCycle,
  totalAmount,
  nextBillingDateText,
  isAlreadySubscribed,
  isProcessing,
  currentSub,
  onCycleChange,
  onSubmit,
}) => {
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(false);

  const planFeatures: string[] = Array.isArray(selectedPlan?.features) ? selectedPlan.features : [];

  return (
    <div className="sticky top-6 bg-white dark:bg-slate-900 rounded-[3px] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-4 font-sans">
      {/* Header: Plan info & Price */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-[3px] bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
              <Rocket size={13} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {selectedPlan?.name}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 pt-1 pl-7.5">
            <button
              type="button"
              onClick={() => onCycleChange("monthly")}
              className={`text-[10.5px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                planCycle === "monthly"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => onCycleChange("yearly")}
              className={`text-[10.5px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer flex items-center gap-1 ${
                planCycle === "yearly"
                  ? "bg-[#ff4a1f] text-white shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#ff4a1f] dark:text-slate-400 dark:hover:text-[#ff4a1f]"
              }`}
            >
              <span>Yearly</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-1 py-0.2 rounded font-black">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100">
            €{totalAmount.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            /{planCycle === "yearly" ? "year" : "month"}
          </span>
        </div>
      </div>

      {/* What's included checklist */}
      <CheckoutFeaturesList
        features={planFeatures}
        isExpanded={isFeaturesExpanded}
        onToggleExpand={() => setIsFeaturesExpanded(!isFeaturesExpanded)}
      />

      {/* Pricing breakdown */}
      <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>Plan Subtotal</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">€{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-500 dark:text-slate-400">
          <span>Tax / VAT (0%)</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">€0.00</span>
        </div>
        <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Total Due Today</span>
          <span className="text-lg font-black text-blue-600">€{totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Next billing date reminder */}
      <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 rounded-[3px] flex items-center gap-2">
        <div className="p-1 bg-blue-100 dark:bg-blue-900/60 rounded-[3px] text-blue-600 dark:text-blue-400 shrink-0">
          <Calendar size={14} />
        </div>
        <div className="text-[11px] leading-tight">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Next billing date: {nextBillingDateText}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
            Charged €{totalAmount.toFixed(2)} automatically upon renewal.
          </span>
        </div>
      </div>

      {/* Already Subscribed Notice */}
      {isAlreadySubscribed && (
        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-[3px] text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
          <div className="flex items-center gap-1.5 font-bold">
            <Info size={13} className="text-amber-600 dark:text-amber-400" />
            <span>Already Subscribed</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            You are already actively subscribed to the <strong>{selectedPlan?.name}</strong> plan{currentSub?.expires_at ? ` until ${currentSub.expires_at}` : ""}.
          </p>
        </div>
      )}

      {/* Subscribe Action Button */}
      <div className="pt-0.5">
        <Button
          type="button"
          variant="primary"
          isLoading={isProcessing}
          disabled={isProcessing || isAlreadySubscribed}
          onClick={onSubmit}
          className={`w-full h-10 text-xs sm:text-sm font-bold shadow-xs cursor-pointer flex items-center justify-center gap-2 rounded-[3px] transition-all ${
            isAlreadySubscribed
              ? "bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-not-allowed"
              : "bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
          }`}
        >
          {isAlreadySubscribed ? (
            <>
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>Current Active Plan</span>
            </>
          ) : (
            <>
              <Lock size={14} />
              <span>Subscribe Now · €{totalAmount.toFixed(2)}</span>
            </>
          )}
        </Button>
      </div>

      <CheckoutTrustBadges />
    </div>
  );
};

export default CheckoutOrderSummaryCard;
