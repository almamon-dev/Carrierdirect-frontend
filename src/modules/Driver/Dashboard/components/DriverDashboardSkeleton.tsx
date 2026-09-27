import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export const DriverDashboardSkeleton: React.FC = () => {
    return (
        <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-200">
            {/* Top Dashboard Header Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#12161c] p-4 sm:p-5 rounded-lg border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-3.5 sm:gap-4">
                    <Skeleton className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl" />
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-48 rounded-[3px]" />
                            <Skeleton className="h-4 w-24 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-72 max-w-full rounded-[2px]" />
                    </div>
                </div>
                <div className="flex items-center gap-2.5">
                    <Skeleton className="h-8.5 w-24 rounded-md" />
                    <Skeleton className="h-8.5 w-32 rounded-md" />
                </div>
            </div>

            {/* Left and Right Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
                {/* ── LEFT COLUMN (7 cols): Today's Overview & Active Shipment in Transit ── */}
                <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
                    {/* 1. Today's Overview Cards Skeleton */}
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-32 rounded-[3px]" />

                        {/* 4 Cards Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="p-3 sm:p-3.5 rounded-[4px] bg-white dark:bg-[#1e2329] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5"
                                >
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="w-7 h-7 rounded-[4px]" />
                                        <Skeleton className="h-3 w-12 rounded-[2px]" />
                                    </div>
                                    <div className="space-y-1.5 pt-1">
                                        <Skeleton className="h-6 w-20 rounded-[3px]" />
                                        <Skeleton className="h-2.5 w-full max-w-[100px] rounded-[2px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Active Shipment in Transit Skeleton */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-44 rounded-[3px]" />
                            <Skeleton className="h-3 w-16 rounded-[2px]" />
                        </div>

                        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs space-y-3.5">
                            {/* Top Badge Row */}
                            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-28 rounded-[3px]" />
                                    <Skeleton className="h-4 w-24 rounded-[3px]" />
                                </div>
                                <Skeleton className="h-5 w-24 rounded-[3px]" />
                            </div>

                            {/* Origin & Destination Timeline */}
                            <div className="space-y-3 relative pl-0.5">
                                {/* Origin */}
                                <div className="flex items-start gap-2.5">
                                    <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5" />
                                    <div className="space-y-1.5 flex-1">
                                        <Skeleton className="h-3.5 w-44 rounded-[2px]" />
                                        <Skeleton className="h-2.5 w-60 max-w-full rounded-[2px]" />
                                    </div>
                                </div>

                                {/* Destination */}
                                <div className="flex items-start gap-2.5 pt-1">
                                    <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5" />
                                    <div className="space-y-1.5 flex-1">
                                        <Skeleton className="h-3.5 w-48 rounded-[2px]" />
                                        <Skeleton className="h-2.5 w-64 max-w-full rounded-[2px]" />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                                <Skeleton className="h-8 w-28 rounded-[4px]" />
                                <Skeleton className="h-8 w-20 rounded-[4px]" />
                                <Skeleton className="h-8 w-20 rounded-[4px]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN (5 cols): Today's Schedule & Telematics ── */}
                <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
                    {/* 3. Today's Schedule Skeleton */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-32 rounded-[3px]" />
                            <Skeleton className="h-3 w-16 rounded-[2px]" />
                        </div>

                        <div className="space-y-2.5">
                            {[1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-3 sm:p-3.5 shadow-2xs space-y-3"
                                >
                                    <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-16 rounded-[3px]" />
                                            <Skeleton className="h-3.5 w-20 rounded-[2px]" />
                                        </div>
                                        <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                                    </div>

                                    <div className="space-y-2.5 pl-0.5">
                                        <div className="flex items-center gap-2.5">
                                            <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                                            <Skeleton className="h-3 w-48 max-w-full rounded-[2px]" />
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Skeleton className="w-3 h-3 rounded-full shrink-0" />
                                            <Skeleton className="h-3 w-52 max-w-full rounded-[2px]" />
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-0.5">
                                        <Skeleton className="h-4 w-16 rounded-[3px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. Assigned Vehicle & Dispatch Support Skeleton */}
                    <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-3.5 h-3.5 rounded-full" />
                                <Skeleton className="h-4 w-40 rounded-[3px]" />
                            </div>
                            <Skeleton className="h-4 w-20 rounded-[3px]" />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-2.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                                <Skeleton className="h-3 w-18 rounded-[2px]" />
                                <Skeleton className="h-4 w-24 rounded-[3px]" />
                                <Skeleton className="h-2.5 w-20 rounded-[2px]" />
                            </div>

                            <div className="p-2.5 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800/80 space-y-1.5">
                                <Skeleton className="h-3 w-18 rounded-[2px]" />
                                <Skeleton className="h-4 w-24 rounded-[3px]" />
                                <Skeleton className="h-2.5 w-20 rounded-[2px]" />
                            </div>
                        </div>

                        <div className="space-y-2 pt-0.5">
                            <Skeleton className="h-8 w-full rounded-[4px]" />
                            <div className="grid grid-cols-2 gap-2">
                                <Skeleton className="h-7 w-full rounded-[4px]" />
                                <Skeleton className="h-7 w-full rounded-[4px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDashboardSkeleton;
