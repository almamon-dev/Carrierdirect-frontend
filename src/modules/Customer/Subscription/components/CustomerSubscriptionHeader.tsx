import React from "react";
import { RefreshCw } from "lucide-react";
import Button from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";

interface CustomerSubscriptionHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export const CustomerSubscriptionHeader: React.FC<CustomerSubscriptionHeaderProps> = ({
  isLoading,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
            Subscription & Billing Plans
          </h1>
          <StatusBadge status="Active Shipper Account" category="success" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Manage your active subscription tier, corporate credit lines, and freight booking tools.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-8 px-3 text-xs bg-white dark:bg-[#181d24] border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5"
          title="Refresh Data"
        >
          <RefreshCw size={13} className={isLoading ? "animate-spin text-[#ff4a1f]" : "text-slate-500"} />
          <span>Refresh</span>
        </Button>
      </div>
    </div>
  );
};

export default CustomerSubscriptionHeader;
