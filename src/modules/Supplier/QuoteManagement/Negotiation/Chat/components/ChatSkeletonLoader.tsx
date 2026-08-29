import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export function ChatSkeletonLoader() {
    return (
        <div className="p-4 md:p-6 w-full mx-auto h-[calc(100vh-64px)] flex flex-col font-sans">
            <div className="flex flex-1 min-h-[500px] min-w-0 bg-white dark:bg-[#12161c] border border-slate-200 dark:border-slate-800 rounded-md overflow-hidden shadow-sm relative">
                {/* Left Sidebar Skeleton */}
                <div className="w-[320px] shrink-0 border-r border-slate-200 dark:border-slate-800 p-3 flex flex-col gap-3 bg-slate-50/50 dark:bg-[#181d24]/50">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 flex-1 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-2 py-1">
                        <Skeleton className="h-7 w-16 rounded-lg" />
                        <Skeleton className="h-7 w-20 rounded-lg" />
                    </div>
                    <div className="space-y-2 mt-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-center gap-3 bg-white dark:bg-[#181d24]">
                                <Skeleton className="w-10 h-10 rounded-full shrink-0 aspect-square" />
                                <div className="flex-1 space-y-1.5 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                                        <Skeleton className="h-3 w-10 rounded-[2px]" />
                                    </div>
                                    <Skeleton className="h-2.5 w-36 rounded-[2px]" />
                                    <div className="flex items-center justify-between pt-0.5">
                                        <Skeleton className="h-3 w-14 rounded-[2px]" />
                                        <Skeleton className="h-4 w-12 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Middle Chat Area Skeleton */}
                <div className="flex-1 min-w-0 flex flex-col min-h-0 h-full bg-white dark:bg-[#12161c] relative">
                    {/* Header Skeleton */}
                    <div className="h-14 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between bg-white dark:bg-[#181d24]">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full shrink-0 aspect-square" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-4 w-32 rounded-[2px]" />
                                <Skeleton className="h-3 w-20 rounded-[2px]" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <Skeleton className="w-8 h-8 rounded-lg" />
                        </div>
                    </div>

                    {/* Messages Area Skeleton */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50/40 dark:bg-slate-900/30">
                        {/* Quote request card skeleton */}
                        <div className="max-w-md mx-auto p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#181d24] space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-28 rounded-[2px]" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <Skeleton className="h-12 rounded-lg" />
                                <Skeleton className="h-12 rounded-lg" />
                            </div>
                            <Skeleton className="h-14 rounded-lg bg-orange-50/50 dark:bg-orange-950/20" />
                        </div>

                        {/* Received message bubble skeleton */}
                        <div className="flex items-start gap-2.5 max-w-sm">
                            <Skeleton className="w-8 h-8 rounded-full shrink-0 aspect-square" />
                            <div className="space-y-1">
                                <Skeleton className="h-16 w-56 rounded-2xl rounded-tl-xs bg-slate-200/70 dark:bg-slate-800" />
                                <Skeleton className="h-2.5 w-12 rounded-[2px]" />
                            </div>
                        </div>

                        {/* Sent message bubble skeleton */}
                        <div className="flex items-end justify-end gap-2.5 max-w-sm ml-auto">
                            <div className="space-y-1 flex flex-col items-end">
                                <Skeleton className="h-12 w-48 rounded-2xl rounded-tr-xs bg-orange-200/60 dark:bg-orange-950/40" />
                                <Skeleton className="h-2.5 w-16 rounded-[2px]" />
                            </div>
                        </div>

                        {/* Offer card bubble skeleton */}
                        <div className="max-w-sm ml-auto p-3.5 rounded-2xl border border-orange-200/70 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-950/20 space-y-2">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-3.5 w-32 rounded-[2px]" />
                                <Skeleton className="h-4 w-14 rounded-full" />
                            </div>
                            <Skeleton className="h-8 w-28 rounded-lg" />
                            <Skeleton className="h-3 w-full rounded-[2px]" />
                        </div>
                    </div>

                    {/* Input Bar Skeleton */}
                    <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-[#181d24]">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="h-10 flex-1 rounded-xl" />
                        <Skeleton className="h-10 w-24 rounded-xl" />
                        <Skeleton className="w-10 h-10 rounded-xl" />
                    </div>
                </div>

                {/* Right Details Sidebar Skeleton */}
                <div className="w-[300px] shrink-0 border-l border-slate-200 dark:border-slate-800 p-4 hidden xl:flex flex-col gap-4 bg-slate-50/50 dark:bg-[#181d24]/50">
                    <div className="flex flex-col items-center p-4 bg-white dark:bg-[#181d24] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                        <Skeleton className="w-14 h-14 rounded-full aspect-square" />
                        <Skeleton className="h-4 w-28 rounded-[2px]" />
                        <Skeleton className="h-3 w-20 rounded-[2px]" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-16 rounded-xl" />
                        <Skeleton className="h-20 rounded-xl" />
                        <Skeleton className="h-24 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
