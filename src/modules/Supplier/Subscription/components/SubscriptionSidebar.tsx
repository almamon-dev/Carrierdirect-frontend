import React from "react";
import { LayoutDashboard, Package, Receipt, ChevronRight } from "lucide-react";
import { TabKey } from "../types";

interface SubscriptionSidebarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  billingHistoryCount?: number;
}

export const SubscriptionSidebar: React.FC<SubscriptionSidebarProps> = ({
  activeTab,
  onSelectTab,
  billingHistoryCount = 0,
}) => {
  const tabs: { id: TabKey; label: string; icon: any; count?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "packages", label: "Packages & Plans", icon: Package },
    { id: "history", label: "Billing History", icon: Receipt, count: billingHistoryCount },
  ];

  return (
    <div className="w-full lg:w-64 shrink-0 space-y-1">
      <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Subscription Menu
      </div>
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] border-l-3 border-[#ff4a1f] shadow-2xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon size={16} className={isActive ? "text-[#ff4a1f]" : "text-slate-400 dark:text-slate-500"} />
                <span className="truncate">{tab.label}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {typeof tab.count === "number" && tab.count > 0 && (
                  <span
                    className={`px-1.5 py-0.25 text-[10.5px] font-bold rounded-full ${
                      isActive
                        ? "bg-[#ff4a1f] text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
                <ChevronRight size={13} className={isActive ? "text-[#ff4a1f]" : "text-slate-300 dark:text-slate-600"} />
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SubscriptionSidebar;
