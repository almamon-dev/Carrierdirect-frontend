import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export const OfferFormSkeletonCard: React.FC = () => {
    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[3px] p-3.5 sm:p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                    <Skeleton className="h-4 w-4 rounded-[2px]" />
                    <Skeleton className="h-4 w-28 rounded-[2px]" />
                </div>
                <Skeleton className="h-4 w-12 rounded-[2px]" />
            </div>

            <div className="space-y-1">
                <Skeleton className="h-3 w-28 rounded-[2px]" />
                <Skeleton className="h-9 w-full rounded-[3px]" />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                    <Skeleton className="h-3 w-16 rounded-[2px]" />
                    <Skeleton className="h-8 w-full rounded-[3px]" />
                </div>
                <div className="space-y-1">
                    <Skeleton className="h-3 w-20 rounded-[2px]" />
                    <Skeleton className="h-8 w-full rounded-[3px]" />
                </div>
            </div>

            <div className="p-3 bg-slate-50/80 dark:bg-[#181d24]/60 rounded-[3px] border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-20 rounded-[2px]" />
                    <Skeleton className="h-3 w-12 rounded-[2px]" />
                </div>
                <div className="flex justify-between">
                    <Skeleton className="h-3 w-24 rounded-[2px]" />
                    <Skeleton className="h-3 w-14 rounded-[2px]" />
                </div>
                <div className="border-t border-dashed border-slate-200 dark:border-slate-700/60 pt-2 flex justify-between">
                    <Skeleton className="h-4 w-24 rounded-[2px]" />
                    <Skeleton className="h-4 w-16 rounded-[2px]" />
                </div>
            </div>

            <Skeleton className="h-9 w-full rounded-[3px]" />
        </div>
    );
};
