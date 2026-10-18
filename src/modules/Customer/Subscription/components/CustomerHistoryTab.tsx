import DataTable from "@/components/tables/data-table";
import Select from "@/components/ui/select";
import { Receipt } from "lucide-react";
import React from "react";
import { InvoiceItem, UserSubscriptionData } from "../types";
import { getCustomerInvoiceColumns } from "./customerInvoiceColumns";

interface CustomerHistoryTabProps {
  invoices: InvoiceItem[];
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  isLoading: boolean;
  downloadingId: string | null;
  onDownloadReceipt: (item: InvoiceItem) => void;
  activePlanName: string;
  hasActiveSub: boolean;
  subscription: UserSubscriptionData | null;
  formattedExpiryDate: string;
  daysRemaining: number;
  onUpgradeClick: () => void;
}

export const CustomerHistoryTab: React.FC<CustomerHistoryTabProps> = ({
  invoices,
  statusFilter,
  onStatusFilterChange,
  isLoading,
  downloadingId,
  onDownloadReceipt,
  activePlanName,
  hasActiveSub,
  subscription,
  formattedExpiryDate,
  daysRemaining,
  onUpgradeClick,
}) => {
  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter !== "All" && inv.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  const invoiceColumns = getCustomerInvoiceColumns(downloadingId, onDownloadReceipt);

  const statusFilterOptions = [
    { id: "All", name: "All Statuses" },
    { id: "Paid", name: "Paid" },
    { id: "Pending", name: "Pending" },
    { id: "Failed", name: "Failed" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Billing History & Downloadable Receipts
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            View and download official VAT tax invoices and payment receipts for your records.
          </p>
        </div>
      </div>

      {/* Current Active Plan & Expiry Summary Banner */}
      <div className="p-3.5 bg-gradient-to-r from-slate-50 via-orange-50/20 to-slate-50 dark:from-slate-800/60 dark:via-orange-950/10 dark:to-slate-800/60 border border-slate-200/90 dark:border-slate-800 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#ff4a1f] flex items-center justify-center shrink-0">
            <Receipt size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Current Plan: {activePlanName}
              </span>
              <span className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold border ${hasActiveSub || subscription?.is_trial
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
                }`}>
                {hasActiveSub || subscription?.is_trial ? "Active" : "Inactive"}
              </span>
              {subscription?.auto_renew && (
                <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 text-[10px] font-bold rounded-[3px]">
                  Auto-Renew On
                </span>
              )}
            </div>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
              {subscription?.auto_renew ? "Next Billing / Renewal Date:" : "Plan Expires / Closes On:"}{" "}
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">{formattedExpiryDate}</strong>{" "}
              {subscription?.expires_at && (
                <span className="text-[#ff4a1f] font-medium">({daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining)</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onUpgradeClick}
            className="px-3 py-1.5 text-xs font-semibold text-[#ff4a1f] bg-white hover:bg-orange-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-orange-200/80 dark:border-orange-800/60 rounded-[4px] cursor-pointer transition-colors shadow-2xs"
          >
            Change / Upgrade Plan
          </button>
        </div>
      </div>

      <DataTable
        columns={invoiceColumns}
        data={filteredInvoices}
        compact={true}
        searchPlaceholder="Search invoices by reference, plan, date..."
        hideViewToggle={true}
        isLoading={isLoading}
        keyExtractor={(item) => item.id}
        filterContent={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-1">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Payment Status
              </label>
              <Select
                options={statusFilterOptions}
                value={statusFilter}
                onChange={(val) => onStatusFilterChange(val)}
                placeholder="Filter status..."
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default CustomerHistoryTab;
