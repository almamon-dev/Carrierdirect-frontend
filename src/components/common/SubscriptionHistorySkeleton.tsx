import React from "react";
import Skeleton from "@/components/ui/skeleton";

export const SubscriptionHistorySkeleton: React.FC = () => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Billing Invoices & Receipts
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            View and download official tax receipts for your platform subscriptions and freight operations.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Skeleton className="h-8.5 w-full sm:w-44 rounded-[4px]" />
        <Skeleton className="h-8.5 w-full sm:w-44 rounded-[4px]" />
        <Skeleton className="h-8.5 flex-1 w-full rounded-[4px]" />
      </div>

      {/* Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <Skeleton className="h-3.5 w-28 rounded-[2px]" />
          <Skeleton className="h-3.5 w-20 rounded-[2px]" />
          <Skeleton className="h-3.5 w-24 rounded-[2px]" />
          <Skeleton className="h-3.5 w-16 rounded-[2px]" />
          <Skeleton className="h-3.5 w-16 rounded-[2px]" />
        </div>

        {[1, 2, 3, 4].map((row) => (
          <div
            key={row}
            className="p-3.5 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 flex items-center justify-between gap-4"
          >
            <Skeleton className="h-3.5 w-28 rounded-[2px]" />
            <Skeleton className="h-3 w-20 rounded-[2px]" />
            <Skeleton className="h-3.5 w-32 rounded-[2px]" />
            <Skeleton className="h-3.5 w-16 rounded-[2px]" />
            <Skeleton className="h-5 w-16 rounded-[3px]" />
            <Skeleton className="h-3.5 w-24 rounded-[2px]" />
          </div>
        ))}
      </div>
    </div>
  );
};
