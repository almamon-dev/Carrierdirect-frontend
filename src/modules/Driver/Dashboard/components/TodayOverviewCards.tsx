import React from 'react';
import { Package, Truck, Compass, Star, GitFork, FileText, BarChart3 } from 'lucide-react';
import MetricCard from '@/components/cards/metric-card';

interface Props {
    metrics: any;
    onOpenGPS: () => void;
    onOpenBOL: () => void;
    onOpenReports: () => void;
}

export const TodayOverviewCards: React.FC<Props> = ({ metrics, onOpenGPS, onOpenBOL, onOpenReports }) => {
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
                    value={metrics.activeLoads?.value || '2'}
                    icon={Package}
                    colorClass="bg-blue-50 dark:bg-blue-950/40 text-blue-600"
                />
                <MetricCard
                    title="Trips Today"
                    description={metrics.tripsCompleted?.subtitle || '2 scheduled today'}
                    value={metrics.tripsCompleted?.value || '8'}
                    icon={Truck}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                />
                <MetricCard
                    title="Distance Logged"
                    description={metrics.distance?.subtitle || "Today's total drive"}
                    value={metrics.distance?.value || '142.6 km'}
                    icon={Compass}
                    colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600"
                />
                <MetricCard
                    title="Performance"
                    description={metrics.driverRating?.subtitle || '52 reviews'}
                    value={metrics.driverRating?.value || '4.95'}
                    icon={Star}
                    colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600"
                />
            </div>

            {/* 3 Quick Action Buttons Row - Standardized height */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                <button
                    type="button"
                    onClick={onOpenGPS}
                    className="h-8 px-3 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-[4px] text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-98 cursor-pointer"
                >
                    <GitFork size={13} className="text-blue-500" />
                    <span>Live GPS</span>
                </button>

                <button
                    type="button"
                    onClick={onOpenBOL}
                    className="h-8 px-3 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-[4px] text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-98 cursor-pointer"
                >
                    <FileText size={13} className="text-[#FF4A1F]" />
                    <span>Digital BOL</span>
                </button>

                <button
                    type="button"
                    onClick={onOpenReports}
                    className="h-8 px-3 bg-white dark:bg-[#1e2329] hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 rounded-[4px] text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-98 cursor-pointer"
                >
                    <BarChart3 size={13} className="text-emerald-500" />
                    <span>Reports</span>
                </button>
            </div>
        </div>
    );
};
