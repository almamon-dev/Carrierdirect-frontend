import React from 'react';
import Skeleton from '@/components/ui/skeleton';
import { RouteSkeletonCard } from './components/skeletons/RouteSkeletonCard';
import { OfferFormSkeletonCard } from './components/skeletons/OfferFormSkeletonCard';

export default function SubmitQuoteSkeleton() {
    return (
        <div className="p-3.5 sm:p-5 w-full mx-auto min-h-screen font-sans antialiased space-y-4 bg-[#f8fafc] dark:bg-[#12161c]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="h-3 w-4 rounded-[2px]" />
                        <Skeleton className="h-3 w-36 rounded-[2px]" />
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Skeleton className="h-6 w-48 rounded-[2px]" />
                        <Skeleton className="h-5.5 w-32 rounded-full" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-24 rounded-[3px]" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
                    <RouteSkeletonCard />

                    <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[3px] overflow-hidden shadow-2xs">
                        <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-5 px-4 py-2.5">
                            <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                            <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                            <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                        </div>
                        <div className="p-4 space-y-3">
                            <Skeleton className="h-4 w-40 rounded-[2px]" />
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                <Skeleton className="h-16 w-full rounded-[3px]" />
                                <Skeleton className="h-16 w-full rounded-[3px]" />
                                <Skeleton className="h-16 w-full rounded-[3px]" />
                                <Skeleton className="h-16 w-full rounded-[3px]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 xl:col-span-4 space-y-3.5 sticky top-4">
                    <OfferFormSkeletonCard />

                    <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[3px] p-3.5 space-y-2 shadow-2xs">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <div className="space-y-1">
                                <Skeleton className="h-3.5 w-28 rounded-[2px]" />
                                <Skeleton className="h-3 w-20 rounded-[2px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
