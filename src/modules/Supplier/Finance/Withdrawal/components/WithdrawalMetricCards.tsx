import React from 'react';
import { Euro, Clock, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';
import MetricCard from '@/components/cards/metric-card';
import Badge from '@/components/ui/badge';
import { StripeRedirectTarget } from '../types/withdrawal.types';

interface WithdrawalMetricCardsProps {
    stats: {
        availableBalance: number;
        escrowBalance: number;
        totalWithdrawn: number;
    };
    isStripeConnected: boolean;
    stripeAccountData: any;
    loading: boolean;
    onStripeCardClick: (target: StripeRedirectTarget, isDashboard: boolean) => void;
}

export function WithdrawalMetricCards({
    stats,
    isStripeConnected,
    stripeAccountData,
    loading,
    onStripeCardClick,
}: WithdrawalMetricCardsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            <MetricCard
                title="Available Balance"
                description="Cleared funds ready for withdrawal"
                value={`€${(stats.availableBalance || 0).toFixed(2)}`}
                icon={Euro}
                colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                badge={<span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-[3px]">Ready to Withdraw</span>}
                isLoading={loading}
            />
            <MetricCard
                title="Pending Clearance"
                description="Funds in escrow awaiting delivery"
                value={`€${(stats.escrowBalance || 0).toFixed(2)}`}
                icon={Clock}
                colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                isLoading={loading}
            />
            <MetricCard
                title="Lifetime Settled"
                description="Total cumulative settled payout sum"
                value={`€${(stats.totalWithdrawn || 0).toFixed(2)}`}
                icon={TrendingUp}
                colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                isLoading={loading}
            />
            <MetricCard
                title="Stripe Connect"
                description={isStripeConnected ? (stripeAccountData?.stripe_account?.stripe_account_id ? 'Direct Bank Linked & Active' : 'Connected & Ready') : 'Direct bank payout setup required'}
                value={isStripeConnected ? "Connected" : "Setup Needed"}
                icon={isStripeConnected ? ShieldCheck : AlertCircle}
                colorClass={isStripeConnected ? "bg-[#635BFF]/10 text-[#635BFF]" : "bg-red-50 dark:bg-red-950/40 text-red-600"}
                badge={
                    isStripeConnected ? (
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold text-[10px]">
                            Active
                        </Badge>
                    ) : (
                        <span className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded shadow-2xs animate-pulse">
                            Required
                        </span>
                    )
                }
                onClick={() => onStripeCardClick('card_stat', isStripeConnected)}
                isLoading={loading}
            />
        </div>
    );
}
