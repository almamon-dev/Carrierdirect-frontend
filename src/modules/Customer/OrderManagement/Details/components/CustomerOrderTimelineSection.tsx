import React from 'react';
import { Check, MapPin, Clock } from 'lucide-react';

interface CustomerOrderTimelineSectionProps {
    timeline: any[];
}

export const CustomerOrderTimelineSection: React.FC<CustomerOrderTimelineSectionProps> = ({ timeline }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs flex flex-col font-sans h-auto overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50 shrink-0">
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                    Shipment Timeline & Logs
                </h3>
                <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock size={11} className="text-[#ff4a1f]" />
                    <span>Milestones</span>
                </span>
            </div>

            {/* Timeline Body */}
            <div className="p-3">
                <div className="relative">
                    {/* Vertical Background Line */}
                    <div className="absolute left-[9px] top-2.5 bottom-4 w-[2px] bg-slate-100 dark:bg-slate-800" />

                    <div className="space-y-2.5 relative">
                        {timeline.map((step, index) => (
                            <div key={step.id} className="flex gap-2.5 relative">
                                {/* Dot / Check / Number Icon */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div
                                        className={`w-5 h-5 min-w-[20px] min-h-[20px] rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
                                            step.completed
                                                ? 'bg-emerald-500 text-white shadow-2xs'
                                                : step.active
                                                ? 'bg-[#ff4a1f] text-white ring-2 ring-orange-200 dark:ring-orange-950/80 shadow-2xs scale-105'
                                                : 'bg-white dark:bg-slate-900 border-[1.5px] border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                                        }`}
                                    >
                                        {step.completed ? (
                                            <Check size={11} strokeWidth={3} className="text-white" />
                                        ) : (
                                            <span>{index + 1}</span>
                                        )}
                                    </div>

                                    {/* Connecting Line to next step */}
                                    {index !== timeline.length - 1 && (
                                        <div
                                            className={`absolute top-5 w-[2px] h-[calc(100%+10px)] z-0 ${
                                                step.completed && timeline[index + 1]?.completed
                                                    ? 'bg-emerald-500'
                                                    : step.completed && timeline[index + 1]?.active
                                                    ? 'bg-orange-400'
                                                    : 'bg-slate-200 dark:bg-slate-700'
                                            }`}
                                        />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-0.5">
                                    <div className="flex items-start justify-between gap-1">
                                        <h4
                                            className={`text-[11.5px] font-bold ${
                                                step.active
                                                    ? 'text-[#ff4a1f]'
                                                    : step.completed
                                                    ? 'text-slate-900 dark:text-slate-100'
                                                    : 'text-slate-400 dark:text-slate-500'
                                            }`}
                                        >
                                            {step.status}
                                        </h4>
                                        <span
                                            className={`text-[10px] font-medium shrink-0 ${
                                                step.active || step.completed
                                                    ? 'text-slate-500 dark:text-slate-400'
                                                    : 'text-slate-300 dark:text-slate-600'
                                            }`}
                                        >
                                            {step.time}
                                        </span>
                                    </div>

                                    {step.description && (
                                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.25 leading-tight">
                                            {step.description}
                                        </p>
                                    )}

                                    {/* Active Step highlighted location banner */}
                                    {step.active && step.location && (
                                        <div className="mt-1 bg-orange-50/70 dark:bg-orange-950/30 rounded p-1 px-1.5 border border-orange-200 dark:border-orange-900/60 flex items-center gap-1.5">
                                            <MapPin size={11} className="text-[#ff4a1f] shrink-0" />
                                            <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                                                {step.location}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderTimelineSection;
