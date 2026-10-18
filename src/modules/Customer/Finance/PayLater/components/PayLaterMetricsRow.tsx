import React from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import MetricCard from '@/components/cards/metric-card';
import Badge from '@/components/ui/badge';

interface PayLaterMetricsRowProps {
  calculatedStats: {
    monthlyLimit: number;
    totalCreditLimit: number;
    availableCredit: number;
    dueCount: number;
    totalOutstandingFormatted: string;
    payLaterDays: number;
  };
  isLoading: boolean;
}

export const PayLaterMetricsRow: React.FC<PayLaterMetricsRowProps> = ({
  calculatedStats,
  isLoading,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      <MetricCard
        title="Monthly Credit Limit"
        description="30-day revolving credit facility limit"
        value={`€${calculatedStats.monthlyLimit.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={ShieldCheck}
        colorClass="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
        badge={
          <Badge
            variant="secondary"
            className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold border border-indigo-200"
          >
            Monthly
          </Badge>
        }
        valueClassName="text-base sm:text-lg"
        className="p-2.5 sm:p-3"
        isLoading={isLoading}
      />
      <MetricCard
        title="Available Credit"
        description="Ready to use for booking new cargo dispatch"
        value={`€${calculatedStats.availableCredit.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={CheckCircle2}
        colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
        badge={
          <Badge
            variant="secondary"
            className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200"
          >
            Available
          </Badge>
        }
        valueClassName="text-base sm:text-lg"
        className="p-2.5 sm:p-3"
        isLoading={isLoading}
      />
      <MetricCard
        title="Outstanding Balance"
        description={`${calculatedStats.dueCount} invoices currently in payment cycle`}
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
        title="Payment Cycle Terms"
        description={`Consolidated Net-${calculatedStats.payLaterDays} settlement cycle`}
        value={`Net-${calculatedStats.payLaterDays} Days`}
        icon={Clock}
        colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
        badge={
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200"
          >
            Term
          </Badge>
        }
        valueClassName="text-base sm:text-lg"
        className="p-2.5 sm:p-3"
        isLoading={isLoading}
      />
    </div>
  );
};

export default PayLaterMetricsRow;
