import React from 'react';
import { CheckCircle2, AlertCircle, Receipt } from 'lucide-react';
import MetricCard from '@/components/cards/metric-card';
import Badge from '@/components/ui/badge';

interface InvoiceMetricsRowProps {
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

export const InvoiceMetricsRow: React.FC<InvoiceMetricsRowProps> = ({
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
        badge={
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200"
          >
            Paid
          </Badge>
        }
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
        badge={
          <Badge
            variant="secondary"
            className="bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200"
          >
            Due
          </Badge>
        }
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
        badge={
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
          >
            Total
          </Badge>
        }
        valueClassName="text-base sm:text-lg"
        className="p-2.5 sm:p-3"
        isLoading={isLoading}
      />
    </div>
  );
};

export default InvoiceMetricsRow;
