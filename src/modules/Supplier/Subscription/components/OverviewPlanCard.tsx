import React from "react";
import { UserSubscriptionData } from "../types";

interface OverviewPlanCardProps {
  subscription: UserSubscriptionData | null;
  activePlanName: string;
  activePlanPrice: string;
  formattedExpiryDate: string;
  formattedStartDate: string | null;
  daysRemaining: number;
  autoRenew: boolean;
  onToggleAutoRenew: () => void;
  onOpenCancelModal: () => void;
}

export const OverviewPlanCard: React.FC<OverviewPlanCardProps> = ({
  subscription,
  activePlanName,
  activePlanPrice,
  formattedExpiryDate,
  formattedStartDate,
  daysRemaining,
  autoRenew,
  onToggleAutoRenew,
  onOpenCancelModal,
}) => {
  const isTrial = Boolean(subscription?.is_trial);

  return (
    <div className="relative border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 rounded-[6px] p-5 sm:p-6 flex flex-col justify-between min-h-[145px] shadow-2xs">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">
            {activePlanName}
          </h3>
          <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            {activePlanPrice}
          </span>
        </div>
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {subscription?.auto_renew ? "Renews on:" : "Expires on:"}
            </span>
            <span className="font-bold text-[#ff4a1f] dark:text-orange-400">
              {formattedExpiryDate}
            </span>
            {subscription?.expires_at && (
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                ({daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining)
              </span>
            )}
          </div>
          {formattedStartDate && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Member since: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{formattedStartDate}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-4 border-t border-slate-200/70 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Auto-Renew:
          </span>
          <button
            type="button"
            onClick={onToggleAutoRenew}
            className={`px-2 py-0.5 rounded-[3px] text-[11px] font-bold transition-colors cursor-pointer border ${
              autoRenew
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            {autoRenew ? "Enabled" : "Disabled"}
          </button>
        </div>

        {!isTrial && (
          autoRenew ? (
            <button
              type="button"
              onClick={onOpenCancelModal}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer text-left"
            >
              Cancel Subscription
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggleAutoRenew}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer text-left"
            >
              Resume Subscription
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default OverviewPlanCard;
