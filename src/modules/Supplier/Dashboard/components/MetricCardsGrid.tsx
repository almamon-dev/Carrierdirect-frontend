import React from 'react';
import { Euro, Package, FileText, CreditCard, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MetricCard from '@/components/cards/metric-card';

interface MetricCardsGridProps {
    totalEarnings: string;
    activeOrdersCount: number;
    pendingQuotesCount: number;
    withdrawableBalance: string;
    avgRating: string | number;
    isLoading?: boolean;
}

export const MetricCardsGrid: React.FC<MetricCardsGridProps> = ({
    totalEarnings,
    activeOrdersCount,
    pendingQuotesCount,
    withdrawableBalance,
    avgRating,
    isLoading = false,
}) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4 mt-1 sm:mt-2">
            <MetricCard
                title="Total Earnings"
                description="View your recent and lifetime earnings overview."
                value={totalEarnings}
                icon={Euro}
                colorClass="bg-brand-light dark:bg-[#ff4a1f]/15 text-brand"
                isLoading={isLoading}
                onClick={() => navigate('/supplier/finance/earnings')}
            />
            <MetricCard
                title="Active Orders"
                description="Track and manage all your currently active orders."
                value={activeOrdersCount}
                icon={Package}
                colorClass="bg-brand-light dark:bg-[#ff4a1f]/15 text-brand"
                isLoading={isLoading}
                onClick={() => navigate('/supplier/orders/active-jobs')}
            />
            <MetricCard
                title="Pending Quotes"
                description="Monitor quotes you've recently sent to clients."
                value={pendingQuotesCount}
                icon={FileText}
                colorClass="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                isLoading={isLoading}
                onClick={() => navigate('/supplier/quotes/requests')}
            />
            <MetricCard
                title="Withdrawable"
                description="Balance currently available to withdraw."
                value={withdrawableBalance}
                icon={CreditCard}
                colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                isLoading={isLoading}
                onClick={() => navigate('/supplier/finance/withdrawal')}
            />
            <MetricCard
                title="Avg. Rating"
                description="Your average rating based on customer reviews."
                value={avgRating}
                icon={Star}
                colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                isLastOnMobile={true}
                isLoading={isLoading}
                onClick={() => navigate('/supplier/settings')}
            />
        </div>
    );
};
