import React from "react";
import Skeleton from "@/components/ui/skeleton";

interface SubscriptionPackagesSkeletonProps {
  isCustomer: boolean;
  billingCycle: "monthly" | "yearly";
}

export const SubscriptionPackagesSkeleton: React.FC<SubscriptionPackagesSkeletonProps> = ({
  isCustomer,
  billingCycle,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {isCustomer ? "Shipper Subscription Plans" : "Carrier Subscription Plans"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose the optimal plan to streamline your freight quotes and logistics operations.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 bg-slate-50/80 dark:bg-slate-800/50 p-1.5 px-3 rounded-full border border-slate-200/80 dark:border-slate-700/80">
          <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-slate-900 dark:text-slate-100" : "text-slate-500"}`}>
            Monthly Billed
          </span>
          <div className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
            billingCycle === "yearly" ? "bg-[#ff4a1f]" : "bg-slate-300 dark:bg-slate-700"
          }`}>
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ${
              billingCycle === "yearly" ? "translate-x-5" : "translate-x-0"
            }`} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${billingCycle === "yearly" ? "text-slate-900 dark:text-slate-100" : "text-slate-500"}`}>
              Yearly Billed
            </span>
            <span className="text-[10px] font-extrabold text-[#ff4a1f] bg-orange-100 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800/60 px-1.5 py-0.2 rounded-full shadow-2xs">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid (Supplier: 3 Cards, Customer: 4 Cards) */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          isCustomer ? "lg:grid-cols-4" : "lg:grid-cols-3"
        } gap-4 w-full items-stretch`}
      >
        {(isCustomer ? [1, 2, 3, 4] : [1, 2, 3]).map((i) => {
          const isPopular = isCustomer ? i === 3 : i === 2;
          return (
            <div
              key={i}
              className={`relative rounded-[6px] p-4 sm:p-5 flex flex-col justify-between w-full bg-white dark:bg-[#181d24] shadow-xs border ${
                isPopular
                  ? "border-2 border-[#ff4a1f] ring-2 ring-[#ff4a1f]/10"
                  : "border-slate-200 dark:border-slate-800"
              } space-y-4`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#ff4a1f] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-xs">
                  Most Popular
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-5 w-32 rounded-[3px]" />
                    <Skeleton className="h-3 w-full rounded-[2px]" />
                  </div>
                  {i === 1 && (
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded">
                      Active
                    </span>
                  )}
                </div>

                <div className="pt-2 pb-1">
                  <Skeleton className="h-8 w-28 rounded-[3px]" />
                </div>

                <Skeleton className="h-9 w-full rounded-[4px]" />

                {/* Features List */}
                <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">
                    WHAT'S INCLUDED
                  </span>
                  {[1, 2, 3, 4, 5].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
                      <Skeleton className="h-3 w-full rounded-[2px]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
