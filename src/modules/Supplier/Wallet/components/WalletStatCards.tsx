import React from 'react';
import { Wallet, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import MetricCard from '@/components/cards/metric-card';
import Badge from '@/components/ui/badge';

interface WalletStats {
    available_balance: number;
    available_balance_formatted?: string;
    pending_balance: number;
    pending_balance_formatted?: string;
    total_earnings: number;
    total_earnings_formatted?: string;
    total_paid_out: number;
    total_paid_out_formatted?: string;
    currency_symbol?: string;
}

interface WalletStatCardsProps {
    stats: WalletStats;
    isLoading?: boolean;
}

export default function WalletStatCards({ stats, isLoading = false }: WalletStatCardsProps) {
    const symbol = stats?.currency_symbol || '€';

    const formatAmount = (val: number | undefined, formatted?: string) => {
        if (formatted) return formatted;
        return `${symbol} ${Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
            <MetricCard
                title="Available Balance"
                description="Cleared funds ready for withdrawal"
                value={formatAmount(stats?.available_balance, stats?.available_balance_formatted)}
                icon={Wallet}
                colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                isLoading={isLoading}
                badge={
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-semibold border border-emerald-200 dark:border-emerald-800">
                        Available
                    </Badge>
                }
            />

            <MetricCard
                title="Pending Balance"
                description="Held in escrow until POD approval"
                value={formatAmount(stats?.pending_balance, stats?.pending_balance_formatted)}
                icon={Clock}
                colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                isLoading={isLoading}
                badge={
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 text-[10px] font-semibold border border-amber-200 dark:border-amber-800">
                        Escrow
                    </Badge>
                }
            />

            <MetricCard
                title="Total Earnings"
                description="Gross earnings across completed orders"
                value={formatAmount(stats?.total_earnings, stats?.total_earnings_formatted)}
                icon={TrendingUp}
                colorClass="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                isLoading={isLoading}
                badge={
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-[10px] font-semibold border border-blue-200 dark:border-blue-800">
                        Lifetime
                    </Badge>
                }
            />

            <MetricCard
                title="Total Paid Out"
                description="Disbursed to your connected Stripe account"
                value={formatAmount(stats?.total_paid_out, stats?.total_paid_out_formatted)}
                icon={ArrowUpRight}
                colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                isLastOnMobile={true}
                isLoading={isLoading}
                badge={
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 text-[10px] font-semibold border border-purple-200 dark:border-purple-800">
                        Disbursed
                    </Badge>
                }
            />
        </div>
    );
}
