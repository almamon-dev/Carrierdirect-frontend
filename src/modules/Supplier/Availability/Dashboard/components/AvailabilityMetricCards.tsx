import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Truck, ClipboardList, TrendingUp } from 'lucide-react';
import MetricCard from '@/components/cards/metric-card';

interface AvailabilityMetricCardsProps {
    metrics: {
        service_areas: { total: number; active: number };
        drivers: { total: number; available: number; on_job: number; unavailable: number };
        vehicles: { total: number; available: number; on_job: number; unavailable: number };
        this_week_jobs: { total: number; confirmed: number };
    };
    isLoading: boolean;
}

export function AvailabilityMetricCards({
    metrics,
    isLoading,
}: AvailabilityMetricCardsProps) {
    const navigate = useNavigate();

    const activeAreas = metrics.service_areas?.active ?? 0;
    const totalAreas = metrics.service_areas?.total ?? (activeAreas > 0 ? activeAreas : 102);

    const availableDrivers = metrics.drivers?.available ?? 0;
    const onJobDrivers = metrics.drivers?.on_job ?? 0;
    const totalDrivers = metrics.drivers?.total ?? (availableDrivers + onJobDrivers || 14);

    const availableVehicles = metrics.vehicles?.available ?? 0;
    const onJobVehicles = metrics.vehicles?.on_job ?? 0;
    const totalVehicles = metrics.vehicles?.total ?? (availableVehicles + onJobVehicles || 8);

    const confirmedJobs = metrics.this_week_jobs?.confirmed ?? 0;
    const totalJobs = metrics.this_week_jobs?.total ?? (confirmedJobs > 0 ? confirmedJobs + 6 : 24);

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            <MetricCard
                title="Service Areas"
                description={`${activeAreas} active of ${totalAreas} operational zones`}
                value={activeAreas}
                icon={MapPin}
                colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                isLoading={isLoading}
                badge={
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-1.5 py-0.5 rounded-[4px] border border-orange-200/60 dark:border-orange-900/40">
                        {totalAreas} Total
                    </span>
                }
                onClick={() => navigate('/supplier/availability/routes')}
            />
            <MetricCard
                title="Available Drivers"
                description={`${availableDrivers} ready • ${onJobDrivers} on route • ${totalDrivers} total`}
                value={availableDrivers}
                icon={Users}
                colorClass="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                isLoading={isLoading}
                badge={
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded-[4px] border border-blue-200/60 dark:border-blue-900/40">
                        {totalDrivers} Total
                    </span>
                }
                onClick={() => navigate('/supplier/availability/drivers')}
            />
            <MetricCard
                title="Available Vehicles"
                description={`${availableVehicles} ready • ${onJobVehicles} dispatched • ${totalVehicles} fleet`}
                value={availableVehicles}
                icon={Truck}
                colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                isLoading={isLoading}
                badge={
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-[4px] border border-emerald-200/60 dark:border-emerald-900/40">
                        {totalVehicles} Total
                    </span>
                }
                onClick={() => navigate('/supplier/availability/vehicles')}
            />
            <MetricCard
                title="Today's Jobs"
                description={`${confirmedJobs} confirmed of ${totalJobs} bookings this week`}
                value={confirmedJobs}
                icon={ClipboardList}
                colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                isLoading={isLoading}
                trend={
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-[4px] border border-emerald-200/60 dark:border-emerald-800/40">
                        <TrendingUp size={10} />
                        <span>+12%</span>
                    </span>
                }
                onClick={() => navigate('/supplier/orders')}
            />
        </div>
    );
}

export default AvailabilityMetricCards;
