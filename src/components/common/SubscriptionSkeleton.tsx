import React from "react";
import {
  LayoutDashboard,
  Package,
  Receipt,
  ChevronRight,
  Plus,
  RefreshCw,
  Clock,
  ArrowRight,
} from "lucide-react";
import Skeleton from "@/components/ui/skeleton";

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
      <div className="p-3 sm:p-3.5 bg-gradient-to-r from-amber-50 via-orange-50/70 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-2xs">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-bold text-amber-950 dark:text-amber-100">
              Subscription Quota & Usage
            </h4>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[3px] text-[10.5px] font-bold border bg-orange-100 text-[#ff4a1f] border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800">
              <Clock size={11} className="shrink-0" />
              <span>Active</span>
            </span>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <Skeleton className="h-3.5 w-72 sm:w-96 max-w-full rounded-[2px]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff4a1f] shrink-0 py-1 px-1.5 opacity-80">
          <span>Upgrade Subscription</span>
          <ArrowRight size={13} className="shrink-0" />
        </div>
      </div>

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
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
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
          )}

          {/* TAB 2: PACKAGES & PLANS */}
          {activeTab === "packages" && (
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
          )}

          {/* TAB 3: BILLING HISTORY */}
          {activeTab === "history" && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSkeleton;
