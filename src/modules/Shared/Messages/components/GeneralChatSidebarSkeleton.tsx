import React, { useState, useEffect } from 'react';
import Skeleton from '@/components/ui/skeleton';

interface GeneralChatSidebarSkeletonProps {
    count?: number;
}

export const GeneralChatSidebarSkeleton: React.FC<GeneralChatSidebarSkeletonProps> = ({ count }) => {
    const [dynamicCount, setDynamicCount] = useState<number>(() => {
        if (typeof count === 'number' && count > 0) return count;
        if (typeof window !== 'undefined') {
            const calculated = Math.floor((window.innerHeight - 200) / 68);
            return Math.max(4, Math.min(10, calculated));
        }
        return 6;
    });

    useEffect(() => {
        if (typeof count === 'number' && count > 0) {
            setDynamicCount(count);
            return;
        }

        const handleResize = () => {
            const calculated = Math.floor((window.innerHeight - 200) / 68);
            setDynamicCount(Math.max(4, Math.min(10, calculated)));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [count]);

    // Varied widths for realistic conversational skeleton
    const nameWidths = ['w-24', 'w-32', 'w-20', 'w-28', 'w-36', 'w-22'];
    const msgWidths = ['w-44', 'w-52', 'w-36', 'w-48', 'w-40', 'w-56'];

    return (
        <div className="space-y-1.5 p-1 animate-in fade-in duration-150">
            {Array.from({ length: dynamicCount }).map((_, i) => (
                <div key={i} className="p-2.5 rounded-[4px] flex gap-3 items-center bg-white dark:bg-[#181d24] border border-slate-100 dark:border-slate-800/80">
                    <Skeleton className="w-11 h-11 rounded-full shrink-0 aspect-square" />
                    <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex justify-between items-center gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <Skeleton className={`h-3.5 ${nameWidths[i % nameWidths.length]} rounded-[2px]`} />
                                <Skeleton className="h-3.5 w-14 rounded-full" />
                            </div>
                            <Skeleton className="h-2.5 w-10 rounded-[2px] shrink-0" />
                        </div>
                        <Skeleton className={`h-3 ${msgWidths[i % msgWidths.length]} rounded-[2px]`} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GeneralChatSidebarSkeleton;
