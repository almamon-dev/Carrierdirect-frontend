import React from "react";
import Skeleton from "@/components/ui/skeleton";

export const CustomerChatMessagesSkeleton: React.FC = () => {
    return (
        <div className="space-y-4 py-2 animate-in fade-in duration-150">
            {/* 1. Supplier Quote Activity Speech Bubble (LEFT ALIGNED) */}
            <div className="flex gap-2.5 items-start justify-start group relative w-full">
                <Skeleton className="w-8 h-8 rounded-full shrink-0 aspect-square mt-0.5" />
                <div className="w-[440px] sm:w-[460px] max-w-full">
                    <div className="p-3.5 rounded-2xl rounded-tl-xs bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
                        <Skeleton className="h-3.5 w-60 rounded-md" />
                        <Skeleton className="h-3.5 w-44 rounded-md" />
                        <Skeleton className="h-2.5 w-12 rounded-md" />
                    </div>
                </div>
            </div>

            {/* 2. Supplier Quote Details Card (LEFT ALIGNED with pl-[42px]) */}
            <div className="flex items-center justify-start pl-0 sm:pl-[42px] w-full my-1.5">
                <div className="w-[440px] sm:w-[460px] max-w-full bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[4px] p-3.5 shadow-2xs space-y-3 font-sans">
                    {/* Header */}
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

                    {/* Route section */}
                    <div className="space-y-2 py-1">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3.5 w-52 rounded-md" />
                            <Skeleton className="h-2.5 w-12 rounded-md" />
                        </div>
                        <Skeleton className="h-3.5 w-56 rounded-md" />
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 space-y-2">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-28 rounded-md" />
                            <Skeleton className="h-3.5 w-16 rounded-md" />
                        </div>
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-3 w-20 rounded-md" />
                            <Skeleton className="h-3.5 w-14 rounded-md" />
                        </div>
                    </div>

                    {/* Total Row */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                        <Skeleton className="h-4 w-32 rounded-md" />
                        <Skeleton className="h-5 w-24 rounded-md" />
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        <Skeleton className="h-9 w-full rounded-[4px]" />
                        <Skeleton className="h-9 w-full rounded-[4px]" />
                    </div>
                </div>
            </div>

            {/* 3. Customer Reply Bubble (RIGHT ALIGNED) */}
            <div className="flex justify-end w-full pt-2">
                <div className="space-y-1 flex flex-col items-end max-w-[80%] sm:max-w-[70%]">
                    <div className="p-3.5 rounded-[4px] bg-[#d9fdd3]/70 dark:bg-[#005c4b]/50 border border-emerald-200/50 dark:border-emerald-700/30 shadow-2xs space-y-2">
                        <Skeleton className="h-3.5 w-56 rounded-md" />
                        <Skeleton className="h-3.5 w-40 rounded-md" />
                    </div>
                    <Skeleton className="h-2.5 w-14 rounded-md mr-1" />
                </div>
            </div>

            {/* 4. Status / Confirmation Banner (RIGHT ALIGNED) */}
            <div className="flex justify-end w-full pt-1">
                <div className="w-[380px] max-w-full p-3 rounded-[4px] bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 space-y-1.5">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded-full shrink-0" />
                        <Skeleton className="h-3.5 w-32 rounded-md" />
                    </div>
                    <Skeleton className="h-3 w-64 rounded-md" />
                </div>
            </div>
        </div>
    );
};
