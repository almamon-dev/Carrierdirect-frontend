import React from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface FileProcessingStreamFeedProps {
    terminalRef: React.RefObject<HTMLDivElement | null>;
    rows: any[];
    visibleCount: number;
    effectiveTotal: number;
    isCompleted: boolean;
}

export const FileProcessingStreamFeed: React.FC<FileProcessingStreamFeedProps> = ({
    terminalRef,
    rows,
    visibleCount,
    effectiveTotal,
    isCompleted,
}) => {
    return (
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

            {!isCompleted && visibleCount < rows.length && (
                <div className="flex items-center gap-2 py-1.5 px-2.5 text-slate-400 dark:text-slate-500 text-[11px]">
                    <Loader2 size={11} className="animate-spin text-indigo-500" />
                    <span>Processing record {visibleCount + 1} of {effectiveTotal}...</span>
                </div>
            )}

            {isCompleted && (
                <div className="pt-2.5 mt-1 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in duration-150 px-1">
                    <span className="flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="stroke-[2.5]" />
                        All {effectiveTotal} quote requests created and active in marketplace
                    </span>
                </div>
            )}
        </div>
    );
};
