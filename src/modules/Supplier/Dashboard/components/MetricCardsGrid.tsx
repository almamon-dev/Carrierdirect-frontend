import React from 'react';
import { Euro, Package, FileText, CreditCard, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MetricCardProps {
    title: string;
    description: string;
    value: string | number;
    icon: React.ElementType;
    colorClass: string;
    isLoading?: boolean;
    onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    description,
    value,
    icon: Icon,
    colorClass,
    isLoading = false,
    onClick,
}) => (
    <div
        onClick={onClick}
        className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col items-start cursor-pointer w-full"
    >
        <div className="flex justify-between items-start w-full mb-3">
            <div className={`w-9 h-9 rounded-md shrink-0 flex items-center justify-center ${colorClass}`}>
                <Icon size={18} strokeWidth={2} />
            </div>
            {isLoading ? (
                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
            ) : (
                <span className="text-[20px] font-bold text-slate-800 dark:text-slate-200">{value}</span>
            )}
        </div>
        <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">
            {title}
        </h3>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-snug">
            {description}
        </p>
    </div>
);

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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
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
                title="Withdrawable Balance"
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
                isLoading={isLoading}
                onClick={() => navigate('/supplier/settings')}
            />
        </div>
    );
};
