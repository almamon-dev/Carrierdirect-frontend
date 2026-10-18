import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export const ChatMessageListSkeleton: React.FC = () => {
    return (
        <div className="space-y-2 w-full animate-in fade-in duration-150">
            {/* 1. Supplier Revised Offer Activity Bubble Skeleton (RIGHT ALIGNED) */}
            <div className="flex justify-end w-full">
                <div className="w-[440px] sm:w-[460px] max-w-full p-3 bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[4px] shadow-2xs space-y-2">
                    <div className="flex items-center justify-between pb-1">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-5 h-5 rounded-[4px] shrink-0" />
                            <Skeleton className="h-3.5 w-36 rounded-md" />
                        </div>
                        <Skeleton className="h-2.5 w-12 rounded-md" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-3/4 rounded-md" />
                </div>
            </div>

            {/* 2. Supplier Revised Offer Details Card Skeleton (RIGHT ALIGNED) */}
            <div className="flex justify-end w-full my-1.5">
                <div className="w-[440px] sm:w-[460px] max-w-full bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[4px] p-3.5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-6 h-6 rounded-[4px] shrink-0" />
                            <div className="space-y-1">
                                <Skeleton className="h-3.5 w-36 rounded-md" />
                                <Skeleton className="h-2.5 w-14 rounded-md" />
                            </div>
                        </div>
                        <Skeleton className="h-5 w-20 rounded-[4px]" />
                    </div>

                    <div className="space-y-2 py-1">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3.5 w-52 rounded-md" />
                            <Skeleton className="h-2.5 w-12 rounded-md" />
                        </div>
                        <Skeleton className="h-3.5 w-56 rounded-md" />
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 space-y-2">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-28 rounded-md" />
                            <Skeleton className="h-3.5 w-16 rounded-md" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-20 rounded-md" />
                            <Skeleton className="h-3.5 w-14 rounded-md" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-28 rounded-md" />
                            <Skeleton className="h-3.5 w-14 rounded-md" />
                        </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                        <Skeleton className="h-4 w-32 rounded-md" />
                        <Skeleton className="h-5 w-24 rounded-md" />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <Skeleton className="h-3 w-40 rounded-md" />
                        <Skeleton className="h-3 w-20 rounded-md" />
                    </div>
                    <Skeleton className="h-9 w-full rounded-[4px]" />
                </div>
            </div>

            {/* 3. Customer Reply Bubble Skeleton (LEFT ALIGNED) */}
            <div className="flex items-start gap-2.5 max-w-md pt-2">
                <Skeleton className="w-8 h-8 rounded-full shrink-0 aspect-square mt-0.5" />
                <div className="space-y-1 max-w-[85%]">
                    <div className="p-3.5 rounded-[4px] bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
                        <Skeleton className="h-3.5 w-16 rounded-md" />
                        <Skeleton className="h-3.5 w-64 rounded-md" />
                        <Skeleton className="h-3.5 w-48 rounded-md" />
                    </div>
                    <Skeleton className="h-2.5 w-12 rounded-md ml-1" />
                </div>
            </div>

            {/* 4. Status Bubble / Quote Accepted Skeleton (RIGHT ALIGNED) */}
            <div className="flex justify-end w-full pt-1">
                <div className="p-2.5 rounded-[4px] bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center gap-2 max-w-md">
                    <Skeleton className="w-5 h-5 rounded-full shrink-0" />
                    <div className="space-y-1">
                        <Skeleton className="h-3.5 w-28 rounded-md" />
                        <Skeleton className="h-2.5 w-52 rounded-md" />
                    </div>
                    <Skeleton className="h-2.5 w-12 rounded-md ml-auto" />
                </div>
            </div>
        </div>
    );
};
