import React, { useState } from 'react';
import { Clock, History, Check } from 'lucide-react';
import { QuoteHistoryDrawer } from './QuoteHistoryDrawer';
import { 
    QuoteLifecycleStep, 
    QuoteLifecycleTrackerProps, 
    formatStepTimestamp 
} from './quoteLifecycleTypes';
import { buildQuoteLifecycleSteps } from './quoteLifecycleSteps';

export { formatStepTimestamp, buildQuoteLifecycleSteps };
export type { QuoteLifecycleStep, QuoteLifecycleTrackerProps };

export const QuoteLifecycleTracker: React.FC<QuoteLifecycleTrackerProps> = ({
    quote,
    requestDetail,
    className = '',
    allBids = []
}) => {
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
    const steps = buildQuoteLifecycleSteps(quote, requestDetail, allBids);

    const activeIndex = steps.findIndex(s => s.status === 'active');
    const currentStepText = activeIndex !== -1 
        ? `Stage ${activeIndex + 1} of ${steps.length}: ${steps[activeIndex].title}` 
        : steps.some(s => s.status === 'rejected') 
            ? 'Quote Rejected' 
            : steps.some(s => s.status === 'expired')
                ? 'Quote Expired'
                : 'All Stages Completed';

    return (
        <>
            <div className={`bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3 sm:p-4 shadow-2xs transition-all ${className}`}>
                <div className="flex items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded-[4px] bg-orange-100 dark:bg-[#ff4a1f]/20 text-[#ff4a1f] flex items-center justify-center shrink-0">
                            <History size={12} />
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight truncate">
                            Lifecycle & Milestone Progression
                        </h3>
                        <span className="hidden sm:inline-flex items-center text-[10.5px] font-semibold px-2 py-0.5 rounded-[4px] bg-orange-50 text-[#ff4a1f] border border-orange-200/80 dark:bg-[#ff4a1f]/10 dark:border-[#ff4a1f]/30">
                            {currentStepText}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <span className="sm:hidden inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] bg-orange-50 text-[#ff4a1f] border border-orange-200/80">
                            {activeIndex !== -1 ? `Stage ${activeIndex + 1}/6` : 'Completed'}
                        </span>
                        <button
                            type="button"
                            onClick={() => setIsHistoryDrawerOpen(true)}
                            className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-2xs cursor-pointer transition-colors"
                        >
                            <Clock size={11} className="text-[#ff4a1f]" />
                            <span>View Full History</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto hide-scrollbar -mx-1 px-1">
                    <div className="min-w-[680px] grid grid-cols-6 gap-2.5">
                        {steps.map((step) => {
                            const isCompleted = step.status === 'completed';
                            const isActive = step.status === 'active';
                            const isRejected = step.status === 'rejected';
                            const isExpired = step.status === 'expired';

                            return (
                                <div key={step.id} className="flex flex-col gap-1.5 group cursor-default">
                                    <div className="h-1.5 w-full rounded-[4px] overflow-hidden bg-slate-100 dark:bg-slate-800 transition-colors">
                                        <div 
                                            className={`h-full w-full rounded-[4px] transition-all duration-300 ${
                                                isCompleted 
                                                    ? 'bg-emerald-500' 
                                                    : isActive 
                                                    ? 'bg-[#ff4a1f]' 
                                                    : isRejected 
                                                    ? 'bg-rose-500' 
                                                    : isExpired 
                                                    ? 'bg-amber-500' 
                                                    : 'bg-transparent'
                                            }`} 
                                        />
                                    </div>

                                    <div className="flex items-center gap-1.5 min-w-0 mt-0.5">
                                        {isCompleted ? (
                                            <div className="w-3.5 h-3.5 rounded-[4px] bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                                                <Check size={9} strokeWidth={3} />
                                            </div>
                                        ) : isActive ? (
                                            <div className="w-3.5 h-3.5 rounded-[4px] bg-[#ff4a1f] flex items-center justify-center shrink-0 ring-2 ring-[#ff4a1f]/30">
                                                <span className="w-1.5 h-1.5 rounded-[2px] bg-white animate-pulse" />
                                            </div>
                                        ) : isRejected ? (
                                            <div className="w-3.5 h-3.5 rounded-[4px] bg-rose-500 text-white flex items-center justify-center shrink-0">
                                                <span className="text-[9px] font-bold leading-none">✕</span>
                                            </div>
                                        ) : (
                                            <div className="w-3.5 h-3.5 rounded-[4px] border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shrink-0" />
                                        )}

                                        <span className={`text-[11.5px] truncate ${
                                            isActive 
                                                ? 'font-bold text-[#ff4a1f]' 
                                                : isCompleted 
                                                ? 'font-bold text-slate-800 dark:text-slate-100' 
                                                : 'font-medium text-slate-400 dark:text-slate-500'
                                        }`} title={step.title}>
                                            {step.title}
                                        </span>
                                    </div>

                                    <div className="pl-5 min-w-0">
                                        <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block truncate font-medium" title={step.subtitle || step.dateFormatted}>
                                            {step.subtitle || step.dateFormatted || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <QuoteHistoryDrawer
                isOpen={isHistoryDrawerOpen}
                onClose={() => setIsHistoryDrawerOpen(false)}
                quote={quote}
                requestDetail={requestDetail}
                allBids={allBids}
            />
        </>
    );
};

export default QuoteLifecycleTracker;
