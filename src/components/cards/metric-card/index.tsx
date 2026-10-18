import React from 'react';

export interface MetricCardProps {
    title: string;
    description?: string;
    value: string | number;
    icon?: React.ElementType;
    colorClass?: string;
    isLoading?: boolean;
    isLastOnMobile?: boolean;
    onClick?: () => void;
    badge?: React.ReactNode;
    className?: string;
    valueClassName?: string;
    trend?: string | React.ReactNode;
}

export function MetricCard({
    title,
    description,
    value,
    icon: Icon,
    colorClass = 'bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]',
    isLoading = false,
    isLastOnMobile = false,
    onClick,
    badge,
    className = '',
    valueClassName,
    trend,
}: MetricCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-[#1e2329] p-2 sm:p-2.5 md:p-3 rounded-[4px] border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all flex flex-col justify-between w-full shadow-2xs ${
                onClick ? 'cursor-pointer' : ''
            } ${isLastOnMobile ? 'col-span-2 sm:col-span-1' : ''} ${className}`}
        >
            <div>
                <div className="flex justify-between items-start w-full mb-1 sm:mb-1.5">
                    {Icon ? (
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-[4px] shrink-0 flex items-center justify-center ${colorClass}`}>
                            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
                        </div>
                    ) : (
                        <div />
                    )}
                    {isLoading ? (
                        <div className="h-5 sm:h-6 w-12 sm:w-16 bg-slate-200 dark:bg-slate-700/60 rounded animate-pulse" />
                    ) : (
                        <div className="flex flex-col items-end min-w-0 max-w-[65%]">
                            <span className={`font-extrabold text-slate-800 dark:text-slate-200 tracking-tight tabular-nums truncate block max-w-full ${
                                valueClassName || 'text-[14px] sm:text-[16px] md:text-[18px]'
                            }`} title={typeof value === 'string' ? value : undefined}>
                                {value}
                            </span>
                            {badge && <div className="mt-0.5">{badge}</div>}
                            {trend && <div className="mt-0.5">{trend}</div>}
                        </div>
                    )}
                </div>
                <h3 className="text-[11px] sm:text-[12px] font-bold text-slate-800 dark:text-slate-200 mb-0.5 truncate" title={title}>
                    {title}
                </h3>
            </div>
            {description && (
                <p className="text-[9.5px] sm:text-[10.5px] text-slate-500 dark:text-slate-400 font-medium leading-tight line-clamp-1 mt-0.5" title={description}>
                    {description}
                </p>
            )}
        </div>
    );
}

export default MetricCard;
