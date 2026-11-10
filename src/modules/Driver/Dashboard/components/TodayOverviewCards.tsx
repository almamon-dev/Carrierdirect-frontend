import React from 'react';
import { Package, Truck, Compass, Star } from 'lucide-react';

interface Props {
    metrics: any;
}

export const TodayOverviewCards: React.FC<Props> = ({ metrics }) => {
    if (!metrics) return null;

    const cards = [
        {
            title: 'Active Loads',
            value: metrics.activeLoads?.value ?? '0 Loads',
            subtitle: metrics.activeLoads?.subtitle || 'In dispatch transit',
            icon: Truck,
            colorClass: 'bg-[#FFF0EB] text-[#FF4A1F] dark:bg-[#341d16] dark:text-orange-400',
        },
        {
            title: 'Orders',
            value: metrics.tripsCompleted?.value ?? '0 Orders',
            subtitle: metrics.tripsCompleted?.subtitle || "Active orders",
            icon: Package,
            colorClass: 'bg-[#ECFDF5] text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
        },
        {
            title: 'Distance',
            value: metrics.distance?.value ?? '0 km',
            subtitle: metrics.distance?.subtitle || 'Total route',
            icon: Compass,
            colorClass: 'bg-[#EFF6FF] text-blue-600 dark:bg-blue-950/40 dark:text-blue-400',
        },
        {
            title: 'Driver Rating',
            value: metrics.driverRating?.rating !== undefined
                ? `${Number(metrics.driverRating.rating).toFixed(1)} ★`
                : (metrics.driverRating?.value ? `${metrics.driverRating.value} ★` : '0.0 ★'),
            subtitle: metrics.driverRating?.subtitle || 'Fleet rating',
            icon: Star,
            colorClass: 'bg-[#FFFBEB] text-amber-500 dark:bg-amber-950/40 dark:text-amber-400',
        },
    ];

    return (
        <div className="space-y-2.5">
            <h3 className="text-[15px] font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Active Overview
            </h3>

            {/* 4 Cards Grid matching mockup */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className="bg-white dark:bg-[#1e2329] p-3 sm:p-3.5 rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[4px] flex items-center justify-center shrink-0 ${card.colorClass}`}>
                                    <Icon size={16} strokeWidth={2} />
                                </div>
                            </div>
                            <div className="mt-2.5">
                                <div className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400">
                                    {card.title}
                                </div>
                                <div className="text-[16px] sm:text-[18px] font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
                                    {card.value}
                                </div>
                                <div className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                    {card.subtitle}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const ActiveOverviewCards = TodayOverviewCards;
