import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export const CustomerOrderDetailsSkeleton: React.FC = () => {
    return (
        <div className="p-2.5 sm:p-4 w-full flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] pb-8 space-y-3 antialiased animate-in fade-in duration-150">
            {/* Main Unified Card Skeleton */}
            <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-4">
                {/* Header Row: Identity & Status on Left + 5 Metrics & Actions on Right */}
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-11 h-11 rounded-[4px] bg-slate-200 dark:bg-slate-800 shrink-0" />
                        <div className="space-y-1.5">
                            <Skeleton className="h-5 w-36 rounded-[3px] bg-slate-200 dark:bg-slate-800" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-12 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                                <Skeleton className="h-5 w-20 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                                <Skeleton className="h-5 w-24 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between xl:justify-end gap-3">
                        {/* 5 Metrics Skeletons */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 flex-1 xl:flex-initial">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="space-y-1 sm:px-2">
                                    <Skeleton className="h-3 w-16 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                                    <Skeleton className="h-4 w-20 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex items-center gap-2 shrink-0">
                            <Skeleton className="h-8 w-20 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                            <Skeleton className="h-8 w-20 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                            <Skeleton className="h-8 w-8 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                        </div>
                    </div>
                </div>

                {/* Body Row: Map (8 cols) + Timeline / Progress (4 cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    {/* Left: Map Skeleton (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col">
                        <div className="relative w-full h-[330px] sm:h-[370px] rounded-[4px] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                            <Skeleton className="w-full h-full absolute inset-0 rounded-none bg-slate-200/60 dark:bg-slate-800/40" />
                            {/* Switcher Pill Skeleton */}
                            <div className="absolute top-3 left-3 z-10 flex gap-1 bg-white/95 dark:bg-[#181c22]/95 border border-slate-200 dark:border-slate-700 rounded-[4px] p-1">
                                <Skeleton className="h-6 w-14 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                                <Skeleton className="h-6 w-16 rounded-[3px] bg-slate-100 dark:bg-slate-800" />
                            </div>
                            {/* Floating Location Overlay Card Skeleton */}
                            <div className="absolute top-13 sm:top-14 left-3 z-10 bg-white/95 dark:bg-[#1e2329]/95 border border-slate-200 dark:border-slate-700 rounded-lg p-3 w-[260px] sm:w-[300px] space-y-2.5 shadow-md">
                                <div className="space-y-1">
                                    <Skeleton className="h-3 w-20 rounded-[3px] bg-emerald-100 dark:bg-emerald-950/60" />
                                    <Skeleton className="h-3.5 w-full rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                                </div>
                                <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                                    <Skeleton className="h-3 w-24 rounded-[3px] bg-rose-100 dark:bg-rose-950/60" />
                                    <Skeleton className="h-3.5 w-4/5 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Shipment Progress / Timeline Skeleton (4 cols) */}
                    <div className="lg:col-span-4 bg-slate-50/70 dark:bg-slate-900/40 rounded-[4px] border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                            <Skeleton className="h-4 w-32 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                            <Skeleton className="h-4 w-16 rounded-[3px] bg-slate-100 dark:bg-slate-800" />
                        </div>
                        <div className="space-y-5 pl-1 flex-1 py-2">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className="flex items-start gap-3">
                                    <Skeleton className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0 mt-0.5" />
                                    <div className="space-y-1.5 flex-1">
                                        <Skeleton className="h-3.5 w-24 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                                        <Skeleton className="h-3 w-36 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom 4-Column Details Grid Skeleton (Pickup | Destination | Vehicle & Cargo | Payment) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((idx) => (
                    <div
                        key={idx}
                        className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 p-3.5 space-y-3 shadow-2xs"
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                            <Skeleton className="h-3.5 w-24 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                            <Skeleton className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700" />
                        </div>
                        <div className="space-y-2 pt-0.5">
                            <Skeleton className="h-4 w-28 rounded-[3px] bg-slate-300 dark:bg-slate-600" />
                            <Skeleton className="h-3.5 w-full rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                            <Skeleton className="h-3.5 w-4/5 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CustomerOrderDetailsSkeleton;

