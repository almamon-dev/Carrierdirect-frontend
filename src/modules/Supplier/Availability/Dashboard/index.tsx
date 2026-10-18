import React, { useState } from 'react';
import { Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/button';
import { AvailabilityMetricCards } from './components/AvailabilityMetricCards';
import { ServiceAreaAvailabilitySection } from './components/ServiceAreaAvailabilitySection';
import { useAvailabilityDashboardData } from './hooks/useAvailabilityDashboardData';

export default function AvailabilityDashboard() {
    const {
        isLoading,
        isRefreshing,
        metrics,
        serviceAreas,
        coverageMap,
        fetchDashboardData,
    } = useAvailabilityDashboardData();

    const [dateRangeText] = useState('Oct 15, 2026 - Oct 21, 2026');

    return (
        <div className="p-3 sm:p-4 md:p-6 w-full mx-auto space-y-4 sm:space-y-5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">


            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Availability Dashboard
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        Overview of your coverage, drivers, vehicles and current status.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => fetchDashboardData(true)}
                        disabled={isRefreshing || isLoading}
                        className="h-8 px-3 rounded-[4px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18202a] text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors shadow-2xs"
                    >
                        <CalendarIcon size={13} className="text-slate-400" />
                        <span>{dateRangeText}</span>
                        <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-[#ff4a1f] ml-1' : 'text-slate-400 ml-1'} />
                    </button>
                </div>
            </div>

            {/* 4 Stat Cards */}
            <AvailabilityMetricCards
                metrics={metrics}
                isLoading={isLoading}
            />

            {/* Main 2-Column Section: Service Area Coverage & Upcoming Availability */}
            <ServiceAreaAvailabilitySection
                serviceAreas={serviceAreas}
                coverageMap={coverageMap}
                isLoading={isLoading}
            />
        </div>
    );
}
