import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export const GeneralChatSkeletonLoader: React.FC = () => {
    return (
        <div className="space-y-4 py-3 animate-in fade-in duration-150">
            {/* Partner bubble skeleton */}
            <div className="flex gap-2.5 justify-start items-end">
                <div className="shrink-0 mb-1">
                    <Skeleton className="w-7 h-7 rounded-full aspect-square" />
                </div>
                <div className="space-y-1.5 max-w-[65%]">
                    <div className="px-3.5 py-2.5 rounded-sm bg-white dark:bg-[#202c33] border border-slate-200/80 dark:border-slate-700/60 shadow-2xs space-y-2 w-72 sm:w-96 max-w-full">
                        <Skeleton className="h-3.5 w-full rounded-[2px]" />
                        <Skeleton className="h-3.5 w-4/5 rounded-[2px]" />
                    </div>
                    <div className="flex items-center px-1">
                        <Skeleton className="h-2.5 w-12 rounded-[2px]" />
                    </div>
                </div>
            </div>

            {/* My bubble skeleton */}
            <div className="flex gap-2.5 justify-end items-end">
                <div className="space-y-1.5 max-w-[65%] flex flex-col items-end">
                    <div className="px-3.5 py-2.5 rounded-sm bg-[#d9fdd3]/70 dark:bg-[#005c4b]/50 border border-emerald-200/50 dark:border-emerald-700/30 shadow-2xs space-y-2 w-72 sm:w-96 max-w-full">
                        <Skeleton className="h-3.5 w-full rounded-[2px]" />
                        <Skeleton className="h-3.5 w-3/5 rounded-[2px]" />
                    </div>
                    <div className="flex items-center justify-end px-1">
                        <Skeleton className="h-2.5 w-16 rounded-[2px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralChatSkeletonLoader;
