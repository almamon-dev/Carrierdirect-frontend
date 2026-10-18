import React from 'react';
import { Check, Flag, Truck } from 'lucide-react';

export interface DriverStepperStep {
    id: number;
    label: string;
    subLabel: string;
    time: string;
    completed: boolean;
    active: boolean;
    isLive?: boolean;
}

interface DriverShipmentStepperProps {
    steps: DriverStepperStep[];
}

export const DriverShipmentStepper: React.FC<DriverShipmentStepperProps> = ({ steps }) => {
    return (
        <div className="p-4 sm:p-5 bg-white dark:bg-[#1e2329] border-t border-slate-100 dark:border-slate-800/80">
            <div className="grid grid-cols-4 gap-2 items-start relative">
                {steps.map((step, idx) => {
                    const isCompleted = step.completed;
                    const isCurrent = step.active;

                    return (
                        <div key={step.id} className="flex flex-col items-center text-center relative group">
                            {/* Connecting horizontal bar to next step */}
                            {idx < steps.length - 1 && (
                                <div
                                    className={`absolute top-3.5 left-1/2 w-full h-[2px] -z-0 transition-colors ${
                                        isCompleted && (steps[idx + 1]?.completed || steps[idx + 1]?.active)
                                            ? 'bg-emerald-500'
                                            : 'bg-slate-200 dark:bg-slate-700'
                                    }`}
                                />
                            )}

                            {/* Step Circle Indicator */}
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center z-10 transition-all ${
                                    isCompleted
                                        ? 'bg-emerald-500 text-white shadow-2xs'
                                        : isCurrent
                                        ? 'bg-[#FF4A1F] text-white ring-4 ring-orange-100 dark:ring-orange-950/70 scale-105 shadow-xs'
                                        : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                                }`}
                            >
                                {isCompleted ? (
                                    <Check size={14} strokeWidth={3} className="text-white" />
                                ) : isCurrent ? (
                                    <Truck size={13} className="text-white" />
                                ) : (
                                    <Flag size={12} className="text-slate-400" />
                                )}
                            </div>

                            {/* Step Title */}
                            <span
                                className={`mt-2 text-xs sm:text-[13px] font-bold tracking-tight transition-colors ${
                                    isCurrent
                                        ? 'text-[#FF4A1F]'
                                        : isCompleted
                                        ? 'text-slate-900 dark:text-slate-100'
                                        : 'text-slate-500 dark:text-slate-400'
                                }`}
                            >
                                {step.label}
                            </span>

                            {/* Step Subtitle */}
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                                {step.subLabel}
                            </span>

                            {/* Step Time / Live Badge */}
                            {step.isLive ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF4A1F] mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A1F] shrink-0 animate-pulse" />
                                    Live
                                </span>
                            ) : (
                                <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                                    {step.time}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
