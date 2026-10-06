import React from 'react';
import { Package, Truck, Compass, Star } from 'lucide-react';
import MetricCard from '@/components/cards/metric-card';

interface Props {
    metrics: any;
}

export const TodayOverviewCards: React.FC<Props> = ({ metrics }) => {
    if (!metrics) return null;

    return (
        <div className="space-y-3">
            <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                Today's Overview
            </h3>

            {/* 4 Cards Grid - Standardized Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
                <MetricCard
                    title="Active Loads"
                    description={metrics.activeLoads?.subtitle || 'In dispatch transit'}
                    value={metrics.activeLoads?.value ?? '0 Loads'}
                    icon={Package}
                    colorClass="bg-blue-50 dark:bg-blue-950/40 text-blue-600"
                />
                <MetricCard
                    title="Trips Today"
                    description={metrics.tripsCompleted?.subtitle || '2 scheduled today'}
                    value={metrics.tripsCompleted?.value ?? '0 Orders'}
                    icon={Truck}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                />
                <MetricCard
                    title="Distance Logged"
                    description={metrics.distance?.subtitle || "Today's total drive"}
                    value={metrics.distance?.value ?? '0 km'}
                    icon={Compass}
                    colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600"
                />
                <MetricCard
                    title="Performance"
                    description={metrics.driverRating?.subtitle || '52 reviews'}
                    value={metrics.driverRating?.value ?? '0.00'}
                    icon={Star}
                    colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600"
                />
            </div>
        </div>
    );
};
