import React from 'react';
import Skeleton from '@/components/ui/skeleton';

export const GeneralChatDetailsPanelSkeleton: React.FC = () => {
    return (
        <div className="p-4 space-y-4 animate-in fade-in duration-200">
            {/* Profile Avatar Card */}
            <div className="flex flex-col items-center p-4 bg-white dark:bg-[#181d24] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-2xs">
                <Skeleton className="w-16 h-16 rounded-full aspect-square" />
                <Skeleton className="h-4 w-32 rounded-[2px]" />
                <Skeleton className="h-3 w-20 rounded-full" />
                <Skeleton className="h-3 w-40 rounded-[2px]" />
            </div>

            {/* Media Gallery Skeleton */}
            <div className="p-3 bg-white dark:bg-[#181d24] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs">
                <Skeleton className="h-4 w-28 rounded-[2px]" />
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <Skeleton className="h-16 rounded-lg aspect-square" />
                    <Skeleton className="h-16 rounded-lg aspect-square" />
                    <Skeleton className="h-16 rounded-lg aspect-square" />
                </div>
            </div>

            {/* Files / Documents Skeleton */}
            <div className="p-3 bg-white dark:bg-[#181d24] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-2xs">
                <Skeleton className="h-4 w-28 rounded-[2px]" />
                <div className="space-y-1.5 pt-1">
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

export default GeneralChatDetailsPanelSkeleton;
