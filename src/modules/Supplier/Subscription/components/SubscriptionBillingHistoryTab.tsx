import React from "react";
import { Receipt } from "lucide-react";
import DataTable from "@/components/tables/data-table";
import EmptyState from "@/components/tables/empty-state";
import { getSubscriptionBillingColumns } from "./columns";
import { SubscriptionBillingHistoryItem } from "../types";

interface SubscriptionBillingHistoryTabProps {
  invoices: SubscriptionBillingHistoryItem[];
  isLoading: boolean;
  downloadingId?: string | number | null;
  onDownloadReceipt: (item: SubscriptionBillingHistoryItem) => void;
}

export const SubscriptionBillingHistoryTab: React.FC<SubscriptionBillingHistoryTabProps> = ({
  invoices,
  isLoading,
  downloadingId,
  onDownloadReceipt,
}) => {
  const columns = getSubscriptionBillingColumns(onDownloadReceipt, downloadingId);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Billing History & Downloadable Receipts
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            View and download official VAT tax invoices and payment receipts for your records.
          </p>
        </div>
      </div>

      <DataTable
        data={invoices}
        columns={columns}
        searchPlaceholder="Search invoices by reference, plan, date..."
        compact={true}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            icon={Receipt}
            title="No Billing Receipts Found"
            description="You don't have any subscription billing history or downloadable receipts yet."
          />
        }
      />
    </div>
  );
};

export default SubscriptionBillingHistoryTab;
