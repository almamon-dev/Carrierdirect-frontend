import React from 'react';
import { Calendar, CheckCircle2, GitFork, XCircle } from 'lucide-react';
import {
    buildUnifiedShipmentTimeline,
    UnifiedTimelineInput,
    UnifiedTimelineStep,
} from './buildUnifiedTimeline';

export interface UnifiedShipmentTimelineProps {
    data: UnifiedTimelineInput;
    title?: string;
    className?: string;
    compact?: boolean;
}

const StepIcon: React.FC<{ status: UnifiedTimelineStep['status'] }> = ({ status }) => {
    if (status === 'completed') {
        return (
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-500/20 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
        );
    }
    if (status === 'active') {
        return (
            <div className="w-6 h-6 rounded-full bg-orange-50 dark:bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            </div>
        );
    }
    if (status === 'exception') {
        return (
            <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center shadow-sm shadow-rose-500/20 shrink-0">
                <XCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
        );
    }
    return (
        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0" />
    );
};

const StepRightBadge: React.FC<{ step: UnifiedTimelineStep }> = ({ step }) => {
    if (step.status === 'exception') {
        return (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30 whitespace-nowrap shrink-0">
                {step.badgeText || 'Exception'}
            </span>
        );
    }

    if (step.status === 'active') {
        return (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200/80 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30 whitespace-nowrap shrink-0">
                {step.badgeText || 'In Progress'}
            </span>
        );
    }

    if (step.status === 'completed') {
        if (step.date) {
            return (
                <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap shrink-0">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{step.date}</span>
                </div>
            );
        }
        return (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 whitespace-nowrap shrink-0">
                Completed
            </span>
        );
    }

    return (
        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200/80 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700/60 whitespace-nowrap shrink-0">
            Pending
        </span>
    );
};

export const UnifiedShipmentTimeline: React.FC<UnifiedShipmentTimelineProps> = ({
    data,
    title = 'Shipment Timeline',
    className = '',
    compact = false,
}) => {
    const { steps, hasMultipleLegs } = buildUnifiedShipmentTimeline(data);

    return (
        <div
            className={`bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col ${className}`}
        >
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 min-w-0">
                    <GitFork className="w-4 h-4 text-orange-500 rotate-90 shrink-0" />
                    <h3 className="text-[13px] font-bold text-slate-900 dark:text-white tracking-tight">
                        {title}
                    </h3>
                </div>
                <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap shrink-0 ${
                        hasMultipleLegs
                            ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30'
                            : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    }`}
                >
                    {hasMultipleLegs ? '(Multi-Driver)' : '(Single Driver)'}
                </span>
            </div>

            {/* Vertical Milestones */}
            <div className={compact ? 'p-4' : 'p-5'}>
                <div className="relative">
                    {steps.map((step, index) => {
                        const isLast = index === steps.length - 1;
                        const isActive = step.status === 'active';
                        const isPending = step.status === 'pending';

                        return (
                            <div
                                key={step.id}
                                className={`relative flex items-start gap-3 ${
                                    isActive
                                        ? 'bg-orange-50/70 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-lg px-2.5 py-2.5 my-1.5 -mx-1.5'
                                        : isLast
                                            ? 'pb-0'
                                            : compact
                                                ? 'pb-3.5'
                                                : 'pb-4'
                                }`}
                            >
                                {/* Connector line to next step */}
                                {!isLast && (
                                    <span
                                        className={`absolute w-[2px] ${
                                            isActive
                                                ? 'left-[21px] top-[34px] bottom-[-10px] bg-slate-200 dark:bg-slate-800'
                                                : 'left-[11px] top-[24px] bottom-0 bg-slate-200 dark:bg-slate-800'
                                        }`}
                                        aria-hidden="true"
                                    />
                                )}

                                {/* Icon */}
                                <div className="relative z-10 mt-0.5">
                                    <StepIcon status={step.status} />
                                </div>

                                {/* Content + Right Date/Badge */}
                                <div className="flex-1 min-w-0 flex items-start justify-between gap-2.5">
                                    <div className="min-w-0 flex-1">
                                        <p
                                            className={`text-[13px] font-bold leading-snug break-words [overflow-wrap:anywhere] ${
                                                isActive
                                                    ? 'text-orange-950 dark:text-orange-200'
                                                    : isPending
                                                        ? 'text-slate-500 dark:text-slate-400'
                                                        : 'text-slate-900 dark:text-slate-100'
                                            }`}
                                        >
                                            {step.title}
                                        </p>
                                        <p
                                            className={`text-[12px] mt-0.5 leading-snug break-words [overflow-wrap:anywhere] ${
                                                isActive
                                                    ? 'text-slate-600 dark:text-slate-300 font-medium'
                                                    : isPending
                                                        ? 'text-slate-400 dark:text-slate-500'
                                                        : 'text-slate-500 dark:text-slate-400'
                                            }`}
                                        >
                                            {step.description}
                                        </p>
                                    </div>

                                    <StepRightBadge step={step} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UnifiedShipmentTimeline;

