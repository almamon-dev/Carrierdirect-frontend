import React from 'react';
import { Check } from 'lucide-react';

interface SupplierTimelineSectionProps {
    timeline: any[];
}

export const SupplierTimelineSection: React.FC<SupplierTimelineSectionProps> = ({ timeline }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs font-sans overflow-hidden">
            {/* Header */}
            <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1e2329] shrink-0">
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                    Shipment Timeline & Logs
                </h3>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    View All
                </span>
            </div>

            {/* Timeline Activity List */}
            <div className="p-3.5 sm:p-4">
                <div className="relative">
                    {/* Continuous vertical grey line */}
                    <div className="absolute left-[9px] top-2.5 bottom-3 w-[1.5px] bg-slate-200 dark:bg-slate-700 z-0" />

                    <div className="space-y-3.5 relative">
                        {timeline.map((step, index) => {
                            const isCompleted = step.completed && !step.active;
                            const isActive = step.active;

                            return (
                                <div key={step.id || index} className="flex items-start justify-between gap-3 relative z-10">
                                    <div className="flex items-start gap-2.5 min-w-0">
                                        {/* Dot Indicator */}
                                        <div className="flex items-center justify-center shrink-0 mt-0.5">
                                            {isCompleted ? (
                                                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-2xs">
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                            ) : isActive ? (
                                                <div className="w-5 h-5 rounded-full bg-[#FF4A1F] flex items-center justify-center text-white ring-2 ring-orange-200 dark:ring-orange-950/80 shadow-2xs">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-[1.5px] border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e2329]" />
                                            )}
                                        </div>

                                        {/* Title + Subtext (only for active step) */}
                                        <div className="min-w-0">
                                            <span
                                                className={`text-xs block leading-tight ${
                                                    isActive
                                                        ? 'text-[#FF4A1F] font-bold'
                                                        : isCompleted
                                                        ? 'text-slate-900 dark:text-slate-100 font-bold'
                                                        : 'text-slate-400 dark:text-slate-500 font-medium'
                                                }`}
                                            >
                                                {step.status || step.title}
                                            </span>

                                            {isActive && (
                                                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                                    {step.location || 'Driver is being assigned to this order'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Timestamp or Live/In Progress */}
                                    <div className="shrink-0 text-right mt-0.5">
                                        {isActive ? (
                                            <span className="text-xs font-bold text-[#FF4A1F]">
                                                {step.time || 'In Progress'}
                                            </span>
                                        ) : (
                                            <span
                                                className={`text-[11px] font-medium ${
                                                    isCompleted
                                                        ? 'text-slate-500 dark:text-slate-400'
                                                        : 'text-slate-400 dark:text-slate-500'
                                                }`}
                                            >
                                                {step.time}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierTimelineSection;
