import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export const SupplierOrderDetailsSkeleton: React.FC = () => {
    return (
        <div className="p-2.5 sm:p-4 w-full flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] pb-8 space-y-3 antialiased animate-in fade-in duration-150">
            {/* Top Header Bar Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 pb-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Order ID Title */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-16 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-6 w-36 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="h-5 w-20 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-5 w-24 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>

                {/* Right Header Buttons */}
                <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                    <Skeleton className="h-8.5 w-32 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-8.5 w-32 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                </div>
            </div>

            {/* Tab Navigation Skeleton */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <Skeleton className="h-7 w-20 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-7 w-20 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-7 w-36 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-7 w-24 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* Main 12-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
                {/* Left Column (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-2.5">
                    {/* 1. Map Section Skeleton */}
                    <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs overflow-hidden">
                        {/* Map Header Bar */}
                        <div className="px-4 py-3 bg-white dark:bg-[#1e2329] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                                <Skeleton className="h-4 w-24 rounded-[3px] bg-slate-200 dark:bg-slate-800" />
                                <Skeleton className="h-3.5 w-16 rounded-[3px] bg-slate-100 dark:bg-slate-800/60" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-6 w-20 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                                <Skeleton className="h-6 w-24 rounded-[4px] bg-slate-200 dark:bg-slate-800" />
                            </div>
                        </div>

                        {/* Map Canvas Frame */}
                        <div className="w-full h-[260px] sm:h-[300px] relative overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                            <Skeleton className="w-full h-full absolute inset-0 rounded-none bg-slate-200/60 dark:bg-slate-800/40" />
                            {/* Floating Location Overlay Card Skeleton */}
                            <div className="absolute top-3 left-3 z-10 bg-white/95 dark:bg-[#1e2329]/95 border border-slate-200 dark:border-slate-700 rounded-lg p-3 w-[260px] sm:w-[300px] space-y-2.5 shadow-md">
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

                    {/* 2. Three Cards Skeleton (Vehicle & Cargo | Payment | Order Information) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-stretch">
                        {/* Card 1: Vehicle & Cargo Skeleton */}
                        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <Skeleton className="h-3.5 w-24 rounded-[3px] bg-slate-200 dark:bg-slate-800" />
                                    <Skeleton className="h-4 w-20 rounded-[4px] bg-blue-100 dark:bg-blue-950/40" />
                                </div>
                                <div className="space-y-2 pt-2.5">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-14 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                                        <Skeleton className="h-3.5 w-20 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-14 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                                        <Skeleton className="h-3.5 w-16 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                                <Skeleton className="h-3 w-16 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                                <Skeleton className="h-3.5 w-20 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                            </div>
                        </div>

                        {/* Card 2: Payment Skeleton */}
                        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <Skeleton className="h-4 w-16 rounded-[3px] bg-slate-200 dark:bg-slate-800" />
                                    <Skeleton className="h-4 w-16 rounded-[4px] bg-emerald-100 dark:bg-emerald-950/40" />
                                </div>
                                <div className="space-y-2 pt-2.5">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-24 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                                        <Skeleton className="h-3.5 w-16 rounded-[2px] bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-28 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                                        <Skeleton className="h-3.5 w-14 rounded-[2px] bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                                <Skeleton className="h-3.5 w-20 rounded-[3px] bg-slate-200 dark:bg-slate-800" />
                                <Skeleton className="h-4 w-20 rounded-[3px] bg-slate-300 dark:bg-slate-700" />
                            </div>
                        </div>

                        {/* Card 3: Order Information Skeleton */}
                        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-3 flex flex-col justify-between">
                            <div>
                                <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <Skeleton className="h-4 w-28 rounded-[3px] bg-slate-200 dark:bg-slate-800" />
                                </div>
                                <div className="space-y-2 pt-2.5">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-16 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                                        <Skeleton className="h-3.5 w-24 rounded-[2px] bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-3 w-16 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                                        <Skeleton className="h-3.5 w-28 rounded-[2px] bg-slate-200 dark:bg-slate-700" />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                                <Skeleton className="h-3 w-16 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                                <Skeleton className="h-3.5 w-20 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-2.5">
                    {/* Customer Profile Card Skeleton */}
                    <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-4 w-28 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                                <Skeleton className="h-3 w-36 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                            </div>
                        </div>
                    </div>

                    {/* Shipment Timeline Card Skeleton */}
                    <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <Skeleton className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700" />
                            <Skeleton className="h-4 w-32 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                        </div>
                        <div className="space-y-5 pl-2">
                            {[1, 2, 3, 4].map((step) => (
                                <div key={step} className="flex items-start gap-3">
                                    <Skeleton className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0 mt-0.5" />
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-3.5 w-20 rounded-[3px] bg-slate-200 dark:bg-slate-700" />
                                            <Skeleton className="h-3 w-16 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                                        </div>
                                        <Skeleton className="h-3 w-40 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
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

export default SupplierOrderDetailsSkeleton;

