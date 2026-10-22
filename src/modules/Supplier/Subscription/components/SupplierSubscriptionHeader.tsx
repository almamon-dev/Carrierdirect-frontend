import React from "react";
import { RefreshCw } from "lucide-react";
import Button from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";

interface SupplierSubscriptionHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
  isActive?: boolean;
}

export const SupplierSubscriptionHeader: React.FC<SupplierSubscriptionHeaderProps> = ({
  isLoading,
  onRefresh,
  isActive = true,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
            Carrier Subscription & Fleet Dispatch
          </h1>
          <StatusBadge
            status={isActive ? "Active" : "Trial"}
            label={isActive ? "Active Carrier Account" : "Trial Carrier Account"}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Manage your transport membership tier, load quote quotas, and automated invoices.
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

export default SupplierSubscriptionHeader;
