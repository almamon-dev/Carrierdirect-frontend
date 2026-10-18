import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export const DriverShipmentDetailsSkeleton: React.FC = () => {
    return (
        <div className="p-2.5 sm:p-4 w-full flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] pb-8 space-y-2.5 antialiased animate-in fade-in duration-150">
            {/* Top Header Bar Skeleton */}
            <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-1">
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                    <Skeleton className="h-7 w-16 rounded-[4px]" />
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                    <Skeleton className="h-6 w-32 rounded-[3px]" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-28 rounded-[4px]" />
                </div>
            </div>

            {/* Main 12-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
                {/* ── LEFT COLUMN (8 cols) ── */}
                <div className="lg:col-span-8 flex flex-col gap-2.5">
                    {/* 1. Map & Stepper Card Skeleton */}
                    <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] overflow-hidden shadow-2xs">
                        {/* Subheader */}
                        <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-2.5 h-2.5 rounded-full" />
                                <Skeleton className="h-4 w-36 rounded-[2px]" />
                            </div>
                            <Skeleton className="h-5 w-48 rounded-[3px]" />
                        </div>
                        {/* Map Area */}
                        <div className="w-full h-[180px] sm:h-[220px] bg-slate-100 dark:bg-slate-800/50 relative p-3 flex flex-col justify-end">
                            <Skeleton className="w-full h-full absolute inset-0 rounded-none" />
                            <div className="relative z-10 flex items-center justify-between gap-2">
                                <Skeleton className="h-6 w-48 rounded-[4px]" />
                                <Skeleton className="h-6 w-28 rounded-[4px]" />
                            </div>
                        </div>
                        {/* Stepper Progress Skeleton */}
                        <div className="p-3.5 bg-white dark:bg-[#1e2329] border-t border-slate-100 dark:border-slate-800/60">
                            <div className="grid grid-cols-4 gap-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                                        <Skeleton className="w-6 h-6 rounded-full" />
                                        <Skeleton className="h-3 w-16 rounded-[2px]" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 2. Pickup & Delivery Location Card Skeleton */}
                    <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
                        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4 rounded-full" />
                                <Skeleton className="h-4 w-44 rounded-[2px]" />
                            </div>
                            <Skeleton className="h-4 w-20 rounded-[2px]" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800/80">
                            {/* Shipper */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/80">
                                    <Skeleton className="h-3.5 w-32 rounded-[2px]" />
                                    <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-40 rounded-[2px]" />
                                    <Skeleton className="h-3.5 w-full rounded-[2px]" />
                                    <Skeleton className="h-3.5 w-3/4 rounded-[2px]" />
                                </div>
                            </div>
                            {/* Consignee */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/80">
                                    <Skeleton className="h-3.5 w-32 rounded-[2px]" />
                                    <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-40 rounded-[2px]" />
                                    <Skeleton className="h-3.5 w-full rounded-[2px]" />
                                    <Skeleton className="h-3.5 w-3/4 rounded-[2px]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Cargo & Route Specs Card Skeleton */}
                    <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-2xs p-4 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                            <Skeleton className="h-4 w-36 rounded-[2px]" />
                            <Skeleton className="h-4 w-20 rounded-[2px]" />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="p-2.5 bg-slate-50/60 dark:bg-slate-800/40 rounded-[3px] space-y-1.5 border border-slate-100 dark:border-slate-800/60">
                                    <Skeleton className="h-3 w-16 rounded-[2px]" />
                                    <Skeleton className="h-4 w-24 rounded-[2px]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN (4 cols) ── */}
                <div className="lg:col-span-4 flex flex-col gap-2.5">
                    {/* 1. Milestone Action Card Skeleton */}
                    <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-2xs p-4 space-y-3.5">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                            <Skeleton className="h-4 w-32 rounded-[2px]" />
                            <Skeleton className="h-4 w-16 rounded-full" />
                        </div>
                        <div className="p-3 bg-orange-50/40 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-[3px] space-y-2">
                            <Skeleton className="h-3.5 w-28 rounded-[2px]" />
                            <Skeleton className="h-3 w-full rounded-[2px]" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-[4px]" />
                    </div>

                    {/* 2. Activity Timeline & Contact Card Skeleton */}
                    <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-2xs p-4 space-y-3.5">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                            <Skeleton className="h-4 w-32 rounded-[2px]" />
                            <Skeleton className="h-4 w-14 rounded-[2px]" />
                        </div>
                        <div className="space-y-3 pt-1">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-2.5">
                                    <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <Skeleton className="h-3.5 w-3/4 rounded-[2px]" />
                                        <Skeleton className="h-2.5 w-1/3 rounded-[2px]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
