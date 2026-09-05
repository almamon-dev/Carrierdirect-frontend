import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export const RouteSkeletonCard: React.FC = () => {
    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[3px] p-3.5 sm:p-4 space-y-3.5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-28 rounded-[2px]" />
                            <Skeleton className="h-4.5 w-14 rounded-full" />
                            <Skeleton className="h-4.5 w-18 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-36 rounded-[2px]" />
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-[#181d24] border border-slate-200/90 dark:border-slate-800 px-3 py-1.5 rounded-[3px] text-right space-y-1 min-w-[120px]">
                    <Skeleton className="h-2.5 w-16 ml-auto rounded-[2px]" />
                    <Skeleton className="h-5 w-20 ml-auto rounded-[2px]" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-stretch">
                <div className="p-3 rounded-[3px] border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-[#181d24]/60 flex flex-col justify-between space-y-2 min-h-[120px]">
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-14 rounded-[2px]" />
                            <Skeleton className="h-3 w-16 rounded-[2px]" />
                        </div>
                        <Skeleton className="h-3.5 w-4/5 rounded-[2px]" />
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex justify-between">
                        <Skeleton className="h-3 w-14 rounded-[2px]" />
                        <Skeleton className="h-3 w-24 rounded-[2px]" />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center px-1 py-1 gap-1 self-center">
                    <Skeleton className="w-7 h-7 rounded-[3px]" />
                    <Skeleton className="h-3.5 w-14 rounded-[2px]" />
                    <Skeleton className="h-2.5 w-16 rounded-[2px]" />
                </div>

                <div className="p-3 rounded-[3px] border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-[#181d24]/60 flex flex-col justify-between space-y-2 min-h-[120px]">
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-14 rounded-[2px]" />
                            <Skeleton className="h-3 w-16 rounded-[2px]" />
                        </div>
                        <Skeleton className="h-3.5 w-4/5 rounded-[2px]" />
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex justify-between">
                        <Skeleton className="h-3 w-14 rounded-[2px]" />
                        <Skeleton className="h-3 w-20 rounded-[2px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};
