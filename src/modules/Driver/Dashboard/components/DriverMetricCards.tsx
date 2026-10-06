import React from 'react';
import { Truck, Package, Navigation, Star } from 'lucide-react';
import MetricCard from '@/components/cards/metric-card';

interface Props {
    metrics: any;
}

export const DriverMetricCards: React.FC<Props> = ({ metrics }) => {
    if (!metrics) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
            {/* 1. Active Loads */}
            <MetricCard
                title="Active Loads"
                description="Assigned & currently in-transit loads."
                value={metrics.activeLoads}
                icon={Truck}
                colorClass="bg-blue-50 dark:bg-blue-950/40 text-blue-600"
            />

            {/* 2. Today's Orders */}
            <MetricCard
                title="Today's Orders"
                description="Total assigned shipments for current shift."
                value={metrics.todayOrders}
                icon={Package}
                colorClass="bg-orange-50 dark:bg-orange-950/40 text-[#FF4A1F]"
            />

            {/* 3. Distance */}
            <MetricCard
                title="Distance Driven"
                description="GPS tracked total driving distance."
                value={`${metrics.distanceKm} km`}
                icon={Navigation}
                colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600"
            />

            {/* 4. Rating */}
            <MetricCard
                title="Driver Rating"
                description={`${metrics.onTimePercentage}% On-Time delivery performance.`}
                value={metrics.rating}
                icon={Star}
                colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600"
            />
        </div>
    );
};
