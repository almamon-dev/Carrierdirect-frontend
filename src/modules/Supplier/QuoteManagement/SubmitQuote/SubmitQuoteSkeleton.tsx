import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export default function SubmitQuoteSkeleton() {
    return (
        <div className="p-4 md:p-6 w-full mx-auto min-h-screen font-sans antialiased space-y-5">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-36" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-14 rounded-full" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-24 rounded-md" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-28 rounded-md" />
                </div>
            </div>

            {/* Split Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                {/* LEFT PANEL */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-5">

                    {/* Customer & Route Card */}
                    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs p-5 space-y-5">
                        {/* Customer Header */}
                        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                </div>
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <div className="text-right space-y-1">
                                <Skeleton className="h-3 w-20 ml-auto" />
                                <Skeleton className="h-5 w-16 ml-auto" />
                            </div>
                        </div>

                        {/* Route Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-stretch">
                            {/* Pickup */}
                            <div className="p-3.5 rounded-md border border-slate-200 bg-slate-50/50 space-y-3">
                                <div className="flex justify-between">
                                    <Skeleton className="h-3.5 w-16" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                                <div className="flex justify-between pt-2 border-t border-slate-200/60">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            {/* Mid */}
                            <div className="flex flex-col items-center justify-center px-1 gap-1">
                                <Skeleton className="h-7 w-7 rounded-full" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                            {/* Delivery */}
                            <div className="p-3.5 rounded-md border border-slate-200 bg-slate-50/50 space-y-3">
                                <div className="flex justify-between">
                                    <Skeleton className="h-3.5 w-16" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                                <div className="flex justify-between pt-2 border-t border-slate-200/60">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab Card */}
                    <div className="bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden">
                        {/* Tab bar */}
                        <div className="border-b border-slate-200 flex items-center gap-6 px-5 py-0.5">
                            {[72, 88, 96, 80].map((w, i) => (
                                <Skeleton key={i} className={`h-9 w-${w/4} my-1`} style={{ width: w }} />
                            ))}
                        </div>
                        {/* Tab body - specs grid */}
                        <div className="p-5 space-y-5">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1.5">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-4 w-28" />
                                    </div>
                                ))}
                            </div>
                            {/* Dimensions table skeleton */}
                            <div className="space-y-2">
                                <Skeleton className="h-3.5 w-28" />
                                <div className="border border-slate-200 rounded-md overflow-hidden">
                                    <div className="bg-slate-50 border-b border-slate-200 flex gap-4 px-3 py-2">
                                        {['w-16', 'w-16', 'w-16', 'w-10', 'w-10'].map((w, i) => (
                                            <Skeleton key={i} className={`h-3 ${w}`} />
                                        ))}
                                    </div>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="flex gap-4 px-3 py-2 border-b border-slate-100 last:border-0">
                                            {['w-12', 'w-12', 'w-12', 'w-8', 'w-8'].map((w, j) => (
                                                <Skeleton key={j} className={`h-3 ${w}`} />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL — Quotation Form */}
                <div className="lg:col-span-5 xl:col-span-4 bg-white border border-slate-200 rounded-lg shadow-2xs p-5 space-y-4 sticky top-6">
                    {/* Header */}
                    <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-20" />
                    </div>

                    {/* Budget helper */}
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>

                    {/* Base Price */}
                    <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-9 w-full rounded-md" />
                        <div className="flex gap-1.5 mt-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-7 flex-1 rounded-md" />
                            ))}
                        </div>
                    </div>

                    {/* Extra Charges section */}
                    <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-20" />
                    </div>

                    {/* Price Summary */}
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                        {['w-1/2', 'w-full'].map((w, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <Skeleton className={`h-3 ${w === 'w-full' ? 'w-28' : 'w-20'}`} />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        ))}
                        <div className="pt-2 border-t border-slate-200 flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </div>

                    {/* Validity & Terms */}
                    <div className="grid grid-cols-2 gap-2.5">
                        {[0, 1].map(i => (
                            <div key={i} className="space-y-1.5">
                                <Skeleton className="h-3 w-20" />
                                <Skeleton className="h-8 w-full rounded-md" />
                            </div>
                        ))}
                    </div>

                    {/* Remarks */}
                    <div className="space-y-1.5">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-16 w-full rounded-md" />
                    </div>

                    {/* Submit button */}
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>
            </div>
        </div>
    );
}
