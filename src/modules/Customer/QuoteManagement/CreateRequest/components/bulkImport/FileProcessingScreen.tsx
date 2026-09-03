import React, { useMemo, useEffect, useRef } from 'react';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

export interface FileProcessingScreenProps {
    mode?: 'extract' | 'confirm';
    progress: number;
    statusText?: string;
    totalRequestsCount?: number;
    extractedData?: any;
    onClose?: () => void;
}

export const FileProcessingScreen: React.FC<FileProcessingScreenProps> = ({
    progress,
    totalRequestsCount = 1,
    extractedData,
    onClose,
}) => {
    const isCompleted = progress >= 100;
    const terminalRef = useRef<HTMLDivElement>(null);

    const rows: any[] = useMemo(() => {
        if (!extractedData) return [];
        if (Array.isArray(extractedData)) return extractedData;
        if (Array.isArray(extractedData.rows) && extractedData.rows.length > 0) {
            return extractedData.rows;
        }
        if (Array.isArray(extractedData.requests) && extractedData.requests.length > 0) {
            return extractedData.requests;
        }
        if (typeof extractedData === 'object' && (extractedData.requestTitle || extractedData.title || extractedData.pickup || extractedData.pickupCity)) {
            return [extractedData];
        }
        return [];
    }, [extractedData]);

    const effectiveTotal = rows.length || totalRequestsCount || 1;

    // Calculate how many rows should be revealed based on progress (0 to 95%)
    const visibleCount = useMemo(() => {
        if (isCompleted) return rows.length;
        if (progress < 5) return 0;
        // Distribute all items smoothly across 5% to 92% progress
        const count = Math.min(rows.length, Math.ceil(((progress - 5) / 88) * rows.length));
        return Math.max(1, count);
    }, [progress, rows.length, isCompleted]);

    // Auto-scroll terminal to bottom as new items type in
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [visibleCount, isCompleted]);

    return (
        <div className="w-full py-1 font-sans animate-in fade-in zoom-in-95 duration-150">
            {/* Minimalist Header */}
            <div className="flex items-center justify-between gap-2 mb-2.5 px-0.5">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        {isCompleted ? (
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        ) : (
                            <>
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
                            </>
                        )}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                        {isCompleted ? `Published ${effectiveTotal} Quote Requests` : 'Creating & Publishing Requests...'}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-slate-400 dark:text-slate-500">
                        {visibleCount}/{effectiveTotal} rows
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {Math.round(progress)}%
                    </span>
                </div>
            </div>

            {/* Hairline Minimal Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden mb-3">
                <div
                    className={`h-full rounded-full transition-all duration-150 ease-out ${
                        isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Clean Full-Width Minimal Stream Feed */}
            <div 
                ref={terminalRef}
                className="w-full bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800 rounded-lg p-3 text-xs leading-relaxed max-h-[280px] overflow-y-auto space-y-1.5 scroll-smooth select-none"
            >
                {rows.slice(0, visibleCount).map((r, idx) => {
                    const title = r.title || r.requestTitle || r.request_title || `Request #${idx + 1}`;
                    const pickup = r.pickup || r.pickupCity || r.pickup_city || 'Origin';
                    const delivery = r.delivery || r.deliveryCity || r.delivery_city || 'Destination';
                    const vehicle = r.vehicle || r.vehicleType || r.vehicle_type || 'Freight';
                    const budget = r.amount || r.budget || 'Standard';

                    return (
                        <div 
                            key={idx} 
                            className="flex items-center justify-between gap-3 py-1.5 px-2.5 rounded-md hover:bg-white/70 dark:hover:bg-slate-800/60 transition-colors animate-in fade-in duration-100 w-full"
                        >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <span className="text-[10.5px] font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded shrink-0">
                                    ✓ {String(idx + 1).padStart(2, '0')}
                                </span>
                                <span className="font-medium text-slate-900 dark:text-slate-100 truncate">
                                    {pickup} <span className="text-slate-400 font-normal px-0.5">➔</span> {delivery}
                                </span>
                                <span className="text-slate-400 dark:text-slate-500 text-[11px] truncate hidden md:inline">
                                    · {vehicle}
                                </span>
                                {title && title !== 'Logistics Freight Shipment Request' && (
                                    <span className="text-slate-400 dark:text-slate-500 text-[11px] truncate hidden lg:inline">
                                        · {title}
                                    </span>
                                )}
                            </div>

                            {budget && (
                                <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-semibold shrink-0 pl-2">
                                    ৳{budget}
                                </span>
                            )}
                        </div>
                    );
                })}

                {/* Quiet Typing Status indicator */}
                {!isCompleted && visibleCount < rows.length && (
                    <div className="flex items-center gap-2 py-1.5 px-2.5 text-slate-400 dark:text-slate-500 text-[11px]">
                        <Loader2 size={11} className="animate-spin text-indigo-500" />
                        <span>Processing record {visibleCount + 1} of {effectiveTotal}...</span>
                    </div>
                )}

                {/* Final Completion State */}
                {isCompleted && (
                    <div className="pt-2.5 mt-1 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in duration-150 px-1">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="stroke-[2.5]" />
                            All {effectiveTotal} quote requests created and active in marketplace
                        </span>
                    </div>
                )}
            </div>

            {/* Minimal Done Action */}
            {isCompleted && (
                <div className="pt-3 flex items-center justify-end animate-in fade-in duration-150">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-8 px-4 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-md inline-flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                        <span>View Requests</span>
                        <ArrowRight size={13} />
                    </button>
                </div>
            )}
        </div>
    );
};
