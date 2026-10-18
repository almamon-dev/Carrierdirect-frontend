import React from 'react';
import { CheckCircle2, Wallet, Receipt } from 'lucide-react';
import MetricCard from '@/components/cards/metric-card';
import Badge from '@/components/ui/badge';

interface PaymentMetricsRowProps {
  calculatedStats: {
    totalSettledFormatted: string;
    payLaterTotalFormatted: string;
    totalTransactions: number;
  };
  isLoading: boolean;
}

export const PaymentMetricsRow: React.FC<PaymentMetricsRowProps> = ({
  calculatedStats,
  isLoading,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
      <MetricCard
        title="Total Paid"
        description="Total funds paid out across all shipments"
        value={calculatedStats.totalSettledFormatted}
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
        title="Pay Later Settlements"
        description="Transactions deferred via Net-30 credit"
        value={calculatedStats.payLaterTotalFormatted}
        icon={Wallet}
        colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
        badge={
          <Badge
            variant="secondary"
            className="bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200"
          >
            Net-30
          </Badge>
        }
        valueClassName="text-base sm:text-lg"
        className="p-2.5 sm:p-3"
        isLoading={isLoading}
      />
      <MetricCard
        title="Total Transactions"
        description="All booking payments and settlements history"
        value={calculatedStats.totalTransactions}
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

export default PaymentMetricsRow;
