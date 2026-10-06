import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Skeleton from '@/components/ui/skeleton';
import { ShipmentCard } from './ShipmentCard';
import { ShipmentItem } from '../../types';

interface Props {
    shipments: ShipmentItem[];
    isLoading?: boolean;
    emptyState?: React.ReactNode;
}

const INITIAL_COUNT = 8;
const BATCH_SIZE = 8;

export const DriverShipmentInfiniteGrid: React.FC<Props> = ({
    shipments,
    isLoading = false,
    emptyState,
}) => {
    const [displayCount, setDisplayCount] = useState<number>(INITIAL_COUNT);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    // Reset visible count back to initial 8 when dataset changes (filters, search, tabs)
    useEffect(() => {
        setDisplayCount(INITIAL_COUNT);
        setIsLoadingMore(false);
    }, [shipments]);

    const hasMore = displayCount < shipments.length;

    const loadMore = useCallback(() => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        // Small delay for smooth scroll response
        setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + BATCH_SIZE, shipments.length));
            setIsLoadingMore(false);
        }, 200);
    }, [isLoadingMore, hasMore, shipments.length]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMore();
                }
            },
            {
                root: null,
                rootMargin: '200px',
                threshold: 0.05,
            }
        );

        observer.observe(sentinel);

        return () => {
            if (sentinel) observer.unobserve(sentinel);
        };
    }, [hasMore, loadMore]);

    // Initial Loading State: 8 skeleton cards in 2 columns
    if (isLoading && shipments.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-4 space-y-3"
                    >
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
                            <Skeleton className="h-4 w-28 rounded-[2px]" />
                            <Skeleton className="h-5 w-20 rounded-[2px]" />
                        </div>
                        <div className="space-y-2 pt-1">
                            {Array.from({ length: 5 }).map((_, r) => (
                                <div key={r} className="grid grid-cols-[130px_12px_1fr] items-center gap-1">
                                    <Skeleton className="h-3 w-24 rounded-[2px]" />
                                    <span className="text-slate-300 dark:text-slate-600 text-center font-bold text-[10px] select-none">:</span>
                                    <Skeleton className="h-3 w-3/4 rounded-[2px]" />
                                </div>
                            ))}
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <Skeleton className="h-6 w-18 rounded-[3px]" />
                            <Skeleton className="h-6 w-24 rounded-[3px]" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Empty State
    if (shipments.length === 0) {
        return (
            <div className="pt-3">
                {emptyState}
            </div>
        );
    }

    const visibleItems = shipments.slice(0, displayCount);

    return (
        <div className="space-y-3.5 pt-3 font-sans">
            {/* 2-Column Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {visibleItems.map((item) => (
                    <ShipmentCard key={item.id} shipment={item} />
                ))}
            </div>

            {/* Infinite Scroll Trigger Sentinel & Loading Indicator */}
            {hasMore ? (
                <div ref={sentinelRef} className="py-4 flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-[#1e2329] px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-2xs">
                        <Loader2 size={14} className="animate-spin text-[#FF4A1F]" />
                        <span>Loading more loads ({visibleItems.length} of {shipments.length})...</span>
                    </div>
                </div>
            ) : shipments.length > INITIAL_COUNT ? (
                <div className="py-3 text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5 font-medium">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <span>All {shipments.length} assigned loads loaded</span>
                </div>
            ) : null}
        </div>
    );
};
