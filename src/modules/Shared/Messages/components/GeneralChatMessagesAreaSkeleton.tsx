import React, { useState, useEffect } from 'react';
import Skeleton from '@/components/ui/skeleton';

interface GeneralChatMessagesAreaSkeletonProps {
    count?: number;
}

interface MockBubblePattern {
    isMe: boolean;
    cardWidth: string;
    lines: string[];
}

const BUBBLE_PATTERNS: MockBubblePattern[] = [
    { isMe: false, cardWidth: 'w-64 sm:w-72', lines: ['w-full', 'w-4/5'] },
    { isMe: true, cardWidth: 'w-48 sm:w-56', lines: ['w-full'] },
    { isMe: false, cardWidth: 'w-72 sm:w-80', lines: ['w-full', 'w-5/6', 'w-2/3'] },
    { isMe: true, cardWidth: 'w-60 sm:w-68', lines: ['w-full', 'w-3/4'] },
    { isMe: false, cardWidth: 'w-44 sm:w-52', lines: ['w-full'] },
    { isMe: true, cardWidth: 'w-52 sm:w-60', lines: ['w-full', 'w-2/3'] },
    { isMe: false, cardWidth: 'w-64 sm:w-72', lines: ['w-full', 'w-3/4'] },
];

export const GeneralChatMessagesAreaSkeleton: React.FC<GeneralChatMessagesAreaSkeletonProps> = ({ count }) => {
    const [dynamicCount, setDynamicCount] = useState<number>(() => {
        if (typeof count === 'number' && count > 0) return count;
        if (typeof window !== 'undefined') {
            const calculated = Math.floor((window.innerHeight - 250) / 95);
            return Math.max(3, Math.min(8, calculated));
        }
        return 4;
    });

    useEffect(() => {
        if (typeof count === 'number' && count > 0) {
            setDynamicCount(count);
            return;
        }

        const handleResize = () => {
            const calculated = Math.floor((window.innerHeight - 250) / 95);
            setDynamicCount(Math.max(3, Math.min(8, calculated)));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [count]);

    return (
        <div className="space-y-4 py-2 animate-in fade-in duration-150">
            {Array.from({ length: dynamicCount }).map((_, i) => {
                const pattern = BUBBLE_PATTERNS[i % BUBBLE_PATTERNS.length];
                const isMe = pattern.isMe;

                return (
                    <div
                        key={i}
                        className={`flex gap-2.5 my-1 items-end ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                        {!isMe && (
                            <div className="shrink-0 mb-1">
                                <Skeleton className="w-7 h-7 rounded-full aspect-square" />
                            </div>
                        )}
                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[82%] sm:max-w-[72%] md:max-w-[65%]`}>
                            <div
                                className={`px-3.5 py-2.5 rounded-sm border shadow-2xs space-y-2 ${pattern.cardWidth} max-w-full ${
                                    isMe
                                        ? 'bg-[#d9fdd3]/70 dark:bg-[#005c4b]/50 border-emerald-200/50 dark:border-emerald-700/30'
                                        : 'bg-white dark:bg-[#202c33] border-slate-200/80 dark:border-slate-700/60'
                                }`}
                            >
                                {pattern.lines.map((lineWidth, lineIdx) => (
                                    <Skeleton key={lineIdx} className={`h-3.5 ${lineWidth} rounded-[2px]`} />
                                ))}
                            </div>
                            <div className={`flex items-center gap-1 mt-0.5 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <Skeleton className="h-2.5 w-12 rounded-[2px]" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default GeneralChatMessagesAreaSkeleton;
