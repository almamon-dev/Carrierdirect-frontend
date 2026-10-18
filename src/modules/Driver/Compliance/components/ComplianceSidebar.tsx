import { Check } from "lucide-react";
import React from "react";
import { COMPLIANCE_STEPS } from "./complianceConstants";

interface ComplianceSidebarProps {
    step: 1 | 2 | 3;
    onStepClick: (step: 1 | 2 | 3) => void;
}

export const ComplianceSidebar: React.FC<ComplianceSidebarProps> = ({
    step,
    onStepClick,
}) => {
    return (
        <div className="w-full md:w-[260px] lg:w-[280px] bg-white dark:bg-[#181a20] border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 p-5 sm:p-6 flex flex-col justify-start shrink-0 overflow-y-auto">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                Driver Verification
            </h2>

            {/* Stepper items */}
            <div className="space-y-4">
                {COMPLIANCE_STEPS.map((s) => {
                    const isCurrent = step === s.number;
                    const isCompleted = step > s.number;

                    return (
                        <button
                            key={s.number}
                            type="button"
                            onClick={() => onStepClick(s.number as any)}
                            className={`flex items-start gap-3 text-left w-full cursor-pointer transition-all ${
                                isCurrent
                                    ? "bg-[#FFF5F2] dark:bg-orange-950/30 rounded-xl px-3 py-2.5 -mx-2.5"
                                    : "px-0 py-1 hover:opacity-80"
                            }`}
                        >
                            {/* Circular Step Indicator */}
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                                    isCompleted
                                        ? "bg-emerald-500 text-white shadow-2xs"
                                        : isCurrent
                                        ? "bg-[#FF4A1F] text-white shadow-2xs"
                                        : "bg-white dark:bg-[#1e2329] border border-slate-300 dark:border-slate-700 text-slate-500"
                                }`}
                            >
                                {isCompleted ? (
                                    <Check size={16} strokeWidth={2.8} />
                                ) : (
                                    <span>{s.number}</span>
                                )}
                            </div>

                            {/* Step Label & Subtitle */}
                            <div className="pt-0.5 min-w-0 flex-1">
                                <span
                                    className={`text-xs sm:text-sm font-bold block truncate ${
                                        isCurrent
                                            ? "text-[#FF4A1F]"
                                            : isCompleted
                                            ? "text-slate-900 dark:text-slate-100"
                                            : "text-slate-600 dark:text-slate-400"
                                    }`}
                                >
                                    {s.title}
                                </span>
                                <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                    {isCompleted
                                        ? "Completed"
                                        : isCurrent && s.number === 3
                                        ? "Upload verification documents"
                                        : s.subtitle}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
