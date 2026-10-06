import React from "react";
import Skeleton from "@/components/ui/skeleton";

interface SubscriptionCheckoutSkeletonProps {
  userType?: "customer" | "supplier";
}

export const SubscriptionCheckoutSkeleton: React.FC<SubscriptionCheckoutSkeletonProps> = ({
  userType = "customer",
}) => {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-6 w-56 rounded-[3px]" />
            <Skeleton className="h-5 w-24 rounded-[3px]" />
          </div>
          <Skeleton className="h-3.5 w-80 max-w-full rounded-[2px]" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-24 rounded-[3px]" />
        </div>
      </div>

      {/* Two-Column Checkout Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Payment Methods Form Skeleton */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-[3px] border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-1.5">
                <Skeleton className="h-4.5 w-36 rounded-[3px]" />
                <Skeleton className="h-3 w-64 rounded-[2px]" />
              </div>
              <Skeleton className="h-6 w-28 rounded-[3px]" />
            </div>

            {/* Payment Method Selector Tabs Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-28 rounded-[2px]" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Skeleton className="h-16 w-full rounded-[3px]" />
                <Skeleton className="h-16 w-full rounded-[3px]" />
              </div>
            </div>

            {/* Card Form Inputs Skeleton */}
            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32 rounded-[2px]" />
                <Skeleton className="h-9 w-full rounded-[3px]" />
              </div>

              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28 rounded-[2px]" />
                <Skeleton className="h-9 w-full rounded-[3px]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                  <Skeleton className="h-9 w-full rounded-[3px]" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                  <Skeleton className="h-9 w-full rounded-[3px]" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Skeleton className="h-4 w-4 rounded-[2px]" />
                <Skeleton className="h-3.5 w-72 rounded-[2px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Skeleton */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-900 rounded-[3px] border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-2xs space-y-4">
            {/* Plan Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-6 h-6 rounded-[3px]" />
                  <Skeleton className="h-4.5 w-36 rounded-[3px]" />
                </div>
                <Skeleton className="h-5 w-32 rounded-[3px]" />
              </div>
              <div className="space-y-1 text-right">
                <Skeleton className="h-6 w-20 rounded-[3px]" />
                <Skeleton className="h-3 w-12 rounded-[2px]" />
              </div>
            </div>

            {/* Features Checklist Skeleton */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3.5 w-28 rounded-[2px]" />
                <Skeleton className="h-3 w-16 rounded-[2px]" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
                    <Skeleton className="h-3.5 w-full rounded-[2px]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown Skeleton */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                <Skeleton className="h-3.5 w-16 rounded-[2px]" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                <Skeleton className="h-3.5 w-12 rounded-[2px]" />
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <Skeleton className="h-4.5 w-28 rounded-[2px]" />
                <Skeleton className="h-5 w-20 rounded-[3px]" />
              </div>
            </div>

            {/* Next Renewal Box Skeleton */}
            <Skeleton className="h-12 w-full rounded-[3px]" />

            {/* Submit Button Skeleton */}
            <Skeleton className="h-9 w-full rounded-[3px]" />

            {/* Footer Trust Badges Skeleton */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <Skeleton className="h-3 w-20 rounded-[2px]" />
              <Skeleton className="h-3 w-20 rounded-[2px]" />
              <Skeleton className="h-3 w-20 rounded-[2px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCheckoutSkeleton;
