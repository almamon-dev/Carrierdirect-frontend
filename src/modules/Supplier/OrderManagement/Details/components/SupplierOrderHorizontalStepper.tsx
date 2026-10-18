import React from 'react';
import { Check } from 'lucide-react';

interface Props {
    timeline: any[];
}

export const SupplierOrderHorizontalStepper: React.FC<Props> = ({ timeline }) => {
    if (!timeline || timeline.length === 0) return null;

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3 shadow-2xs overflow-x-auto font-sans">
            <div className="flex items-start justify-between min-w-[650px] relative">
                {timeline.map((step, idx) => (
                    <div key={step.id || idx} className="flex-1 flex flex-col items-center relative text-center px-1">
                        {/* Connecting Line to next step */}
                        {idx < timeline.length - 1 && (
                            <div
                                className={`absolute top-3 left-1/2 w-full h-[2px] -translate-y-1/2 z-0 transition-colors duration-300 ${
                                    step.completed
                                        ? 'bg-emerald-500'
                                        : 'bg-slate-200 dark:bg-slate-700'
                                }`}
                            />
                        )}

                        {/* Step Circle Indicator */}
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all relative z-10 shrink-0 ${
                                step.completed
                                    ? 'bg-emerald-500 text-white shadow-2xs'
                                    : step.active
                                    ? 'bg-[#FF4A1F] text-white ring-3 ring-orange-100 dark:ring-orange-950/80 shadow-2xs'
                                    : 'bg-white dark:bg-[#1e2329] border-[1px] border-slate-300 dark:border-slate-700 text-slate-400'
                            }`}
                        >
                            {step.completed ? <Check size={12} strokeWidth={3} /> : idx + 1}
                        </div>

                        {/* Step Label (No text limit / No truncation) */}
                        <span
                            className={`text-[11px] mt-1.5 font-bold leading-tight block text-center break-words px-0.5 ${
                                step.active
                                    ? 'text-[#FF4A1F]'
                                    : step.completed
                                    ? 'text-slate-800 dark:text-slate-200'
                                    : 'text-slate-400 dark:text-slate-500 font-medium'
                            }`}
                        >
                            {step.status || step.title}
                        </span>

                        {/* Step Time / Status Detail (No text limit / No truncation) */}
                        <span className="text-[10px] text-slate-400 mt-0.5 leading-tight block text-center whitespace-normal">
                            {step.time || '-'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SupplierOrderHorizontalStepper;
