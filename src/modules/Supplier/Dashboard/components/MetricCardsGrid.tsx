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
    isLastOnMobile?: boolean;
    onClick?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title,
    description,
    value,
    icon: Icon,
    colorClass,
    isLoading = false,
    isLastOnMobile = false,
    onClick,
}) => (
    <div
        onClick={onClick}
        className={`bg-white dark:bg-[#1e2329] p-2.5 sm:p-3.5 md:p-4 rounded-[4px] border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all flex flex-col justify-between cursor-pointer w-full shadow-2xs ${
            isLastOnMobile ? 'col-span-2 sm:col-span-1' : ''
        }`}
    >
        <div>
            <div className="flex justify-between items-start w-full mb-1.5 sm:mb-2.5">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-[4px] shrink-0 flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" strokeWidth={2} />
                </div>
                {isLoading ? (
                    <div className="h-5 sm:h-6 w-12 sm:w-16 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                ) : (
                    <span className="text-[15px] sm:text-[18px] md:text-[20px] font-extrabold text-slate-800 dark:text-slate-200 tracking-tight tabular-nums">
                        {value}
                    </span>
                )}
            </div>
            <h3 className="text-[11.5px] sm:text-[12.5px] md:text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-0.5 truncate" title={title}>
                {title}
            </h3>
        </div>
        <p className="text-[10px] sm:text-[11px] md:text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-tight line-clamp-1 sm:line-clamp-2 mt-0.5" title={description}>
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
