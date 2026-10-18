import React from "react";
import { Check, ChevronDown } from "lucide-react";

interface CheckoutFeaturesListProps {
  features: string[];
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const CheckoutFeaturesList: React.FC<CheckoutFeaturesListProps> = ({
  features,
  isExpanded,
  onToggleExpand,
}) => {
  const visibleFeatures = isExpanded ? features : features.slice(0, 4);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        <span>What's included</span>
        <span className="text-[10px] text-slate-400 font-semibold lowercase">
          ({features.length} features)
        </span>
      </div>

      <div className="space-y-1.5">
        {visibleFeatures.map((feat: string, idx: number) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium leading-snug">
            <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <Check size={9} strokeWidth={3} />
            </div>
            <span>{feat}</span>
          </div>
        ))}
      </div>

      {features.length > 4 && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="w-full pt-0.5 text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center justify-between transition-colors"
        >
          <span>{isExpanded ? "Show fewer features" : `+ Show ${features.length - 4} more features`}</span>
          <ChevronDown size={13} className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
};

export default CheckoutFeaturesList;
