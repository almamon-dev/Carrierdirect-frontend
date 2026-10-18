import React from "react";
import {
  LayoutDashboard,
  Package,
  Receipt,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { QuotaReminderBannerSkeleton } from "./QuotaReminderBanner";
import { SubscriptionOverviewSkeleton } from "./SubscriptionOverviewSkeleton";
import { SubscriptionPackagesSkeleton } from "./SubscriptionPackagesSkeleton";
import { SubscriptionHistorySkeleton } from "./SubscriptionHistorySkeleton";

interface SubscriptionSkeletonProps {
  userType?: "supplier" | "customer";
  activeTab?: "overview" | "packages" | "history";
  billingCycle?: "monthly" | "yearly";
}

export const SubscriptionSkeleton: React.FC<SubscriptionSkeletonProps> = ({
  userType = "customer",
  activeTab = "overview",
  billingCycle = "monthly",
}) => {
  const isCustomer = userType === "customer";

  const SUBSCRIPTION_TABS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "packages", label: "Packages & Plans", icon: Package },
    { id: "history", label: "Billing History", icon: Receipt },
  ];

  return (
    <div className="p-4 sm:p-5 md:p-6 w-full mx-auto space-y-5 font-sans antialiased animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
              Subscription & Billing Plans
            </h1>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-[3px] border border-emerald-200 px-2 py-0.5">
              {isCustomer ? "Active Shipper Account" : "Active Carrier Account"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isCustomer
              ? "Manage your active subscription tier, corporate credit lines, and freight booking tools."
              : "Manage your carrier subscription tier, fleet capacity, and load bidding tools."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 px-3 text-xs bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded flex items-center gap-1.5 text-slate-400">
            <RefreshCw size={13} className="animate-spin text-[#ff4a1f]" />
            <span>Loading...</span>
          </div>
        </div>
      </div>

      {/* Quota Reminder Banner Skeleton */}
      <QuotaReminderBannerSkeleton />

      {/* Left Sidebar + Right Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar Menu */}
        <div className="w-full lg:w-[260px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider">
              Subscription Menu
            </h3>
          </div>

          <div className="flex flex-col">
            {SUBSCRIPTION_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <div
                  key={tab.id}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-medium border-l-[3px] border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 ${
                    isSelected
                      ? "border-l-[#ff4a1f] bg-orange-50/50 dark:bg-orange-950/20 text-[#ff4a1f] font-bold"
                      : "border-l-transparent text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} className={isSelected ? "text-[#ff4a1f]" : "text-slate-400"} />
                    <span>{tab.label}</span>
                  </div>

                  {isSelected && <ChevronRight size={14} className="text-[#ff4a1f]" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs w-full p-5 md:p-6 space-y-6">
          {activeTab === "overview" && <SubscriptionOverviewSkeleton />}
          {activeTab === "packages" && (
            <SubscriptionPackagesSkeleton
              isCustomer={isCustomer}
              billingCycle={billingCycle}
            />
          )}
          {activeTab === "history" && <SubscriptionHistorySkeleton />}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSkeleton;
