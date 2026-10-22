import React from 'react';
import { CheckCircle2, AlertCircle, Receipt } from 'lucide-react';
import MetricCard from '@/components/cards/metric-card';
import { StatusBadge } from '@/components/common/StatusBadge';

interface BillingMetricsRowProps {
  calculatedStats: {
    paidCount: number;
    dueCount: number;
    overdueCount: number;
    totalSpentFormatted: string;
    totalOutstandingFormatted: string;
    totalInvoices: number;
  };
  isLoading: boolean;
}

export const BillingMetricsRow: React.FC<BillingMetricsRowProps> = ({
  calculatedStats,
  isLoading,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
      <MetricCard
        title="Total Spent & Paid"
        description={`${calculatedStats.paidCount} fully paid invoices`}
        value={calculatedStats.totalSpentFormatted}
        icon={CheckCircle2}
        colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
        badge={<StatusBadge status="Paid" />}
        valueClassName="text-base sm:text-lg"
        className="p-2.5 sm:p-3"
        isLoading={isLoading}
      />
      <MetricCard
        title="Outstanding & Due"
        description={`${calculatedStats.dueCount} due${
          calculatedStats.overdueCount > 0 ? `, ${calculatedStats.overdueCount} overdue` : ' awaiting payment'
        }`}
        value={calculatedStats.totalOutstandingFormatted}
        icon={AlertCircle}
        colorClass="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
        badge={<StatusBadge status="Due" />}
        valueClassName="text-base sm:text-lg"
        className="p-2.5 sm:p-3"
        isLoading={isLoading}
      />
      <MetricCard
        title="Total Invoices"
        description="All lifetime generated invoice documents"
        value={calculatedStats.totalInvoices}
        icon={Receipt}
        colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
        badge={<StatusBadge status="Total" />}
        valueClassName="text-base sm:text-lg"
        className="p-2.5 sm:p-3"
        isLoading={isLoading}
      />
    </div>
  );
};

export default BillingMetricsRow;
