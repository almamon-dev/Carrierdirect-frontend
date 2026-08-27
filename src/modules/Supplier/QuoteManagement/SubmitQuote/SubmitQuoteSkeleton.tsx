/**
 * SubmitQuoteSkeleton Component
 * Zero-layout-shift loading skeleton for the carrier quote proposal and details view.
 */

import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export default function SubmitQuoteSkeleton() {
    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5">
            {/* Top Breadcrumb & Actions Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-36 rounded-[2px]" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-48 rounded-[2px]" />
                        <Skeleton className="h-5 w-16 rounded-[2px]" />
                        <Skeleton className="h-5 w-16 rounded-[2px]" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-24 rounded-[2px]" />
                    <Skeleton className="h-8 w-20 rounded-[2px]" />
                    <Skeleton className="h-8 w-28 rounded-[2px]" />
                </div>
            </div>

            {/* Split Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* LEFT PANEL */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                    {/* Unified Single Card: Customer Profile, Target Budget & Route Grid */}
                    <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-5 shadow-2xs">
                        {/* Top: Customer & Target Budget */}
                        <div className="flex items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-4">
                            <div className="flex items-center gap-3.5">
                                <Skeleton className="w-11 h-11 rounded-full shrink-0" />
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-28 rounded-[2px]" />
                                        <Skeleton className="h-4 w-24 rounded-[2px]" />
                                        <Skeleton className="h-4 w-16 rounded-[2px]" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-3 w-36 rounded-[2px]" />
                                        <Skeleton className="h-3 w-24 rounded-[2px]" />
                                    </div>
                                </div>
                            </div>
                            <div className="border border-emerald-200/80 dark:border-emerald-800/60 px-5 py-2.5 rounded-xl text-center space-y-1 min-w-[140px]">
                                <Skeleton className="h-2.5 w-20 mx-auto rounded-[2px]" />
                                <Skeleton className="h-6 w-24 mx-auto rounded-[2px]" />
                            </div>
                        </div>

                        {/* Bottom: Route Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
                            {/* Pickup */}
                            <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#181d24] flex flex-col justify-between space-y-3">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-3 w-16 rounded-[2px]" />
                                        <Skeleton className="h-3 w-20 rounded-[2px]" />
                                    </div>
                                    <Skeleton className="h-4 w-4/5 rounded-[2px]" />
                                    <Skeleton className="h-3 w-full rounded-[2px]" />
                                </div>
                                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex justify-between">
                                    <Skeleton className="h-3 w-16 rounded-[2px]" />
                                    <Skeleton className="h-3 w-28 rounded-[2px]" />
                                </div>
                            </div>

                            {/* Mid Distance */}
                            <div className="flex flex-col items-center justify-center px-1 py-2 gap-1.5 self-center">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="h-3 w-16 rounded-[2px]" />
                                <Skeleton className="h-2.5 w-20 rounded-[2px]" />
                            </div>

                            {/* Delivery */}
                            <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#181d24] flex flex-col justify-between space-y-3">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-3 w-16 rounded-[2px]" />
                                        <Skeleton className="h-3 w-20 rounded-[2px]" />
                                    </div>
                                    <Skeleton className="h-4 w-4/5 rounded-[2px]" />
                                    <Skeleton className="h-3 w-full rounded-[2px]" />
                                </div>
                                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex justify-between">
                                    <Skeleton className="h-3 w-16 rounded-[2px]" />
                                    <Skeleton className="h-3 w-24 rounded-[2px]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Tabs & Specs */}
                    <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                        <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-6 px-5 py-3">
                            <Skeleton className="h-4 w-28 rounded-[2px]" />
                            <Skeleton className="h-4 w-32 rounded-[2px]" />
                            <Skeleton className="h-4 w-24 rounded-[2px]" />
                        </div>

                        {/* 2-Column Side by Side Layout */}
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            {/* Left Side: Cargo Dimensions Table Skeleton */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <Skeleton className="h-4 w-32 rounded-[2px]" />
                                    <Skeleton className="h-3 w-12 rounded-[2px]" />
                                </div>
                                <div className="border border-slate-200 dark:border-slate-800 rounded-md p-3 space-y-2.5">
                                    <div className="flex justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                        {[6, 12, 12, 12, 8, 8].map((w, idx) => (
                                            <Skeleton key={idx} className={`h-3 w-${w} rounded-[2px]`} />
                                        ))}
                                    </div>
                                    <div className="flex justify-between py-1">
                                        {[6, 10, 10, 10, 6, 6].map((w, idx) => (
                                            <Skeleton key={idx} className={`h-3 w-${w} rounded-[2px]`} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Side: Vehicle & Shipment Specifications */}
                            <div className="space-y-2.5">
                                <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <Skeleton className="h-4 w-48 rounded-[2px]" />
                                </div>
                                <div className="space-y-2 divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div key={i} className="flex items-center justify-between pt-1.5 first:pt-0">
                                            <Skeleton className="h-3 w-28 rounded-[2px]" />
                                            <Skeleton className="h-3 w-32 rounded-[2px]" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: Quotation Form */}
                <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs p-5 space-y-4 sticky top-6">
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
                        <Skeleton className="h-4 w-36 rounded-[2px]" />
                        <Skeleton className="h-3 w-20 rounded-[2px]" />
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded flex justify-between items-center">
                        <Skeleton className="h-3 w-32 rounded-[2px]" />
                        <Skeleton className="h-3 w-20 rounded-[2px]" />
                    </div>
                    <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                        <Skeleton className="h-9 w-full rounded-[2px]" />
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded space-y-2">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-3 w-20 rounded-[2px]" />
                            <Skeleton className="h-3 w-16 rounded-[2px]" />
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                            <Skeleton className="h-4 w-24 rounded-[2px]" />
                            <Skeleton className="h-5 w-20 rounded-[2px]" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-full rounded-[2px]" />
                </div>
            </div>
        </div>
    );
}
