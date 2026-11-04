import React from 'react';
import { Check, Truck } from 'lucide-react';

interface SupplierTimelineSectionProps {
    timeline: any[];
}

export const SupplierTimelineSection: React.FC<SupplierTimelineSectionProps> = ({ timeline }) => {
    // Show only the 4 core steps matching the reference image: Assigned, Pickup, In Transit, Delivered
    const steps = timeline && timeline.length > 0 ? timeline.slice(0, 4) : [];

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs font-sans p-4 space-y-3.5">
            {/* Header matching screenshot */}
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                <Truck size={16} className="text-[#ff4a1f]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Shipment Timeline
                </h3>
            </div>

            {/* Timeline Activity List */}
            <div className="relative pt-1">
                {/* Continuous vertical line */}
                <div className="absolute left-[9px] top-3 bottom-4 w-[1.5px] bg-slate-200 dark:bg-slate-700 z-0" />

                <div className="space-y-4 relative">
                    {steps.map((step, index) => {
                        const isCompleted = step.completed && !step.active;
                        const isActive = step.active;

                        return (
                            <div key={step.id || index} className="flex items-start justify-between gap-3 relative z-10">
                                <div className="flex items-start gap-3 min-w-0">
                                    {/* Dot Indicator */}
                                    <div className="flex items-center justify-center shrink-0 mt-0.5">
                                        {isCompleted ? (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-2xs">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        ) : isActive ? (
                                            <div className="w-5 h-5 rounded-full border-2 border-[#ff4a1f] flex items-center justify-center bg-white dark:bg-[#1e2329] shadow-2xs">
                                                <span className="w-2.5 h-2.5 rounded-full bg-[#ff4a1f]" />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-[1.5px] border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e2329]" />
                                        )}
                                    </div>

                                    {/* Title + Subtext */}
                                    <div className="min-w-0">
                                        <span
                                            className={`text-xs block leading-tight ${
                                                isActive
                                                    ? 'text-[#ff4a1f] font-bold'
                                                    : isCompleted
                                                    ? 'text-slate-900 dark:text-slate-100 font-bold'
                                                    : 'text-slate-700 dark:text-slate-300 font-semibold'
                                            }`}
                                        >
                                            {step.status || step.title}
                                        </span>

                                        {isActive && step.location && (
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                                                {step.location}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Status Badge (In Progress / Pending / Completed) */}
                                <div className="shrink-0 text-right">
                                    {isActive ? (
                                        <span className="px-2 py-0.5 rounded-[4px] text-[10.5px] font-semibold bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300 border border-orange-200/60 dark:border-orange-900/40">
                                            In Progress
                                        </span>
                                    ) : isCompleted ? (
                                        <span className="px-2 py-0.5 rounded-[4px] text-[10.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                            Completed
                                        </span>
                                    ) : (
                                        <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                                            Pending
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SupplierTimelineSection;
