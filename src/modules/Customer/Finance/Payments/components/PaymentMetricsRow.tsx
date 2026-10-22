import React from 'react';
import { CheckCircle2, Wallet, Receipt } from 'lucide-react';
import MetricCard from '@/components/cards/metric-card';
import { StatusBadge } from '@/components/common/StatusBadge';

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
        badge={<StatusBadge status="Paid" />}
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
        badge={<StatusBadge status="Net-30" />}
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
        badge={<StatusBadge status="Total" />}
        valueClassName="text-base sm:text-lg"
        className="p-2.5 sm:p-3"
        isLoading={isLoading}
      />
    </div>
  );
};

export default PaymentMetricsRow;
