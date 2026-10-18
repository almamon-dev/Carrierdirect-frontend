import React from 'react';
import { CustomerChatSidebarSkeleton } from './CustomerChatSidebarSkeleton';
import { CustomerChatCenterPanelSkeleton } from './CustomerChatCenterPanelSkeleton';

export function CustomerChatSkeletonLoader() {
    return (
        <div className="p-0 sm:p-2 md:p-3 w-full mx-auto h-full flex flex-col font-sans min-h-0 overflow-hidden box-border">
            <div className="flex flex-1 min-h-0 min-w-0 bg-white dark:bg-[#12161c] border-0 sm:border border-slate-200 dark:border-slate-800 rounded-none sm:rounded-lg overflow-hidden shadow-none sm:shadow-xs relative">
                {/* Left Sidebar Skeleton Frame */}
                <CustomerChatSidebarSkeleton />

                {/* Middle Chat Center Panel Skeleton Frame */}
                <CustomerChatCenterPanelSkeleton />
            </div>
        </div>
    );
}

export { CustomerChatSidebarSkeleton, CustomerChatCenterPanelSkeleton };
