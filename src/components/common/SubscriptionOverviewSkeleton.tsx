import React from "react";
import { Plus } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";

export const SubscriptionOverviewSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Plan Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Plan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Active Plan Card Skeleton */}
          <div className="relative border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 rounded-[6px] p-5 sm:p-6 flex flex-col justify-between min-h-[145px] shadow-2xs space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-36 rounded-[3px]" />
                <Skeleton className="h-5 w-20 rounded-[3px]" />
              </div>
              <div className="pt-2">
                <Skeleton className="h-3.5 w-28 rounded-[2px]" />
              </div>
            </div>

            <div className="pt-2">
              <Skeleton className="h-8 w-40 rounded-[4px]" />
            </div>
          </div>

          {/* Featured Upgrade Plan Card Skeleton */}
          <div className="relative bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent dark:from-orange-950/30 dark:via-orange-950/10 dark:to-transparent border border-orange-200/80 dark:border-orange-900/40 rounded-[6px] p-5 sm:p-6 flex flex-col justify-between min-h-[145px] shadow-2xs space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-40 rounded-[3px]" />
                <Skeleton className="h-5 w-24 rounded-[3px]" />
              </div>
              <div className="pt-2">
                <Skeleton className="h-3.5 w-32 rounded-[2px]" />
              </div>
            </div>

            <div className="pt-2">
              <Skeleton className="h-8 w-48 rounded-[4px]" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Renewal Settings */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Renewal Settings
        </h2>

        <div className="flex items-center justify-between p-3.5 bg-slate-50/70 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800/80">
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-44 rounded-[2px]" />
            <Skeleton className="h-3 w-80 max-w-full rounded-[2px]" />
          </div>
          <Skeleton className="h-6 w-11 rounded-full shrink-0" />
        </div>
      </section>

      {/* 3. Payment Method */}
      <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Payment Method
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage your saved credit/debit cards for subscription billing and platform tools.
            </p>
          </div>

          <div className="h-8 px-3 text-xs font-semibold text-slate-500 border border-slate-200 dark:border-slate-700 rounded-[4px] flex items-center gap-1.5 opacity-60">
            <Plus size={13} />
            <span>Add New Card</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#181d24] min-h-[96px] flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-10 rounded-[3px]" />
                  <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                </div>
                <Skeleton className="h-4 w-4 rounded-[2px]" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <Skeleton className="h-3 w-20 rounded-[2px]" />
                {i === 1 && <Skeleton className="h-4 w-12 rounded-[3px]" />}
              </div>
            </div>
          ))}

          <div className="p-3.5 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-1.5 min-h-[96px] text-slate-400">
            <Plus size={16} />
            <span className="text-xs font-semibold">Add New Card</span>
          </div>
        </div>
      </section>
    </div>
  );
};
