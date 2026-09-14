import React from 'react';
import { Check, MapPin, Clock } from 'lucide-react';

export default function SupplierTimelineSection({ timeline }: { timeline: any[] }) {
    return (
        <div
    className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs flex flex-col font-sans h-auto">
            <div
    className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-[#12161c]/40 rounded-t-[5px] shrink-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Shipment Timeline & Logs</h3>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock size={13} className="text-[#ff4a1f]" /> Live tracking
                </span>
            </div>

            <div className="p-4">
                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[13px] top-3.5 bottom-6 w-[2px] bg-slate-100 dark:bg-slate-800"></div>

                    <div className="space-y-3.5 relative">
                        {timeline.map((step, index) => (
                            <div key={index} className="flex gap-3.5 relative">
                                {/* Icon/Dot matching reference design */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className={`w-7 h-7 min-w-[28px] min-h-[28px] aspect-square rounded-full flex items-center justify-center font-bold transition-all ${
                                        step.completed
                                            ? 'bg-[#10b981] border-[#10b981] text-white shadow-2xs'
                                            : step.active
                                                ? 'bg-[#ff5722] border-[#ff5722] text-white ring-3 ring-[#ff5722]/20 shadow-2xs'
                                                : 'bg-white dark:bg-slate-900 border-[1.5px] border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                                    }`}>
                                        {step.completed ? (
                                            <Check size={14} strokeWidth={3} className="text-white" />
                                        ) : (
                                            <span className="text-xs font-bold">{index + 1}</span>
                                        )}
                                    </div>
                                    {/* Connecting line fill */}
                                    {index !== timeline.length - 1 && (
                                        <div className={`absolute top-7 w-[2px] h-[calc(100%+14px)] z-0 ${
                                            step.completed && timeline[index + 1]?.completed 
                                                ? 'bg-[#10b981]' 
                                                : 'bg-slate-200 dark:bg-slate-700'
                                        }`}></div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`text-[13px] font-bold ${
                                            step.active 
                                                ? 'text-[#ff4a1f]' 
                                                : step.completed 
                                                    ? 'text-slate-900 dark:text-slate-100' 
                                                    : 'text-slate-400 dark:text-slate-500'
                                        }`}>
                                            {step.status}
                                        </h4>
                                        <span className={`text-xs font-medium ${
                                            step.active || step.completed 
                                                ? 'text-slate-500 dark:text-slate-400' 
                                                : 'text-slate-300 dark:text-slate-600'
                                        }`}>
                                            {step.time}
                                        </span>
                                    </div>

                                    {/* Extra details for active step */}
                                    {step.active && step.location && (
                                        <div className="mt-1.5 bg-orange-50/70 dark:bg-orange-950/30 rounded-[4px] p-2 px-2.5 border border-orange-200 dark:border-orange-900/60 flex items-center gap-2">
                                            <MapPin size={14} className="text-[#ff4a1f] shrink-0" />
                                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{step.location}</p>
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
}
