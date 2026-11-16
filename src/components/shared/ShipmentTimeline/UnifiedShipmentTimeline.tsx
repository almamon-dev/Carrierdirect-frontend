import { AlertCircle, Calendar, Check, Clock, GitFork } from 'lucide-react';
import React from 'react';
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
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-xs shadow-emerald-500/20 shrink-0">
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
        );
    }
    if (status === 'active') {
        return (
            <div className="w-5 h-5 rounded-full bg-white dark:bg-[#1e2329] border-2 border-[#ff4a1f] flex items-center justify-center shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#ff4a1f] animate-pulse" />
            </div>
        );
    }
    if (status === 'exception') {
        return (
            <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center shadow-xs shadow-rose-500/20 shrink-0">
                <AlertCircle className="w-3.5 h-3.5 text-white" strokeWidth={2.4} />
            </div>
        );
    }
    if (status === 'awaiting_assignment') {
        return (
            <div className="w-5 h-5 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500" />
            </div>
        );
    }
    return (
        <div className="w-5 h-5 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0" />
    );
};

const StepRightBadge: React.FC<{ step: UnifiedTimelineStep }> = ({ step }) => {
    if (step.status === 'exception') {
        return (
            <div className="flex flex-col items-end gap-0.5 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30 whitespace-nowrap">
                    {step.badgeText || 'Rejected'}
                </span>
                {step.date && (
                    <span className="text-[10px] text-rose-600/80 dark:text-rose-400/80 font-mono">
                        {step.date}
                    </span>
                )}
            </div>
        );
    }

    if (step.status === 'awaiting_assignment') {
        return (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 whitespace-nowrap shrink-0">
                {step.badgeText || 'Awaiting Assignment'}
            </span>
        );
    }

    if (step.status === 'active') {
        return (
            <div className="flex flex-col items-end gap-0.5 shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200/80 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/30 whitespace-nowrap">
                    {step.badgeText || 'In Progress'}
                </span>
                {step.date && (
                    <span className="text-[10px] text-slate-400 font-mono">
                        {step.date}
                    </span>
                )}
            </div>
        );
    }

    if (step.status === 'completed') {
        if (step.date) {
            return (
                <div className="inline-flex items-center gap-1 text-[10.5px] text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap shrink-0">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{step.date}</span>
                </div>
            );
        }
        return (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 whitespace-nowrap shrink-0">
                {step.badgeText || 'Completed'}
            </span>
        );
    }

    return (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-50 text-slate-400 border border-slate-200/60 dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-700/40 whitespace-nowrap shrink-0">
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
    const { steps } = buildUnifiedShipmentTimeline(data);

    return (
        <div
            className={`bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs font-sans overflow-hidden ${className}`}
        >
            {/* Header: Clean, standardized enterprise style without clutter badges */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <GitFork className="w-4 h-4 text-[#ff4a1f] rotate-90 shrink-0" />
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white tracking-tight">
                        {title}
                    </h3>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock size={11} className="shrink-0" />
                    <span>Live Tracking</span>
                </div>
            </div>

            {/* Vertical Milestones */}
            <div className={compact ? 'p-3.5 sm:p-4' : 'p-4 sm:p-5'}>
                <div className="relative">
                    {steps.map((step, index) => {
                        const isLast = index === steps.length - 1;
                        const isActive = step.status === 'active';
                        const isException = step.status === 'exception';
                        const isPending = step.status === 'pending' || step.status === 'awaiting_assignment';

                        return (
                            <div
                                key={step.id}
                                className={`relative transition-colors ${isActive
                                        ? 'bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-800/50 rounded-lg px-2.5 py-2.5 my-1'
                                        : isException
                                            ? 'bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/50 rounded-lg px-2.5 py-2.5 my-1'
                                            : isLast
                                                ? 'px-2.5 pt-1.5 pb-0'
                                                : compact
                                                    ? 'px-2.5 py-1.5'
                                                    : 'px-2.5 py-2'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Left Indicator Column: Icon and Continuous Vertical Line */}
                                    <div className="relative flex flex-col items-center shrink-0 w-6 pt-0.5">
                                        {/* Connector Line running directly through the center */}
                                        {!isLast && (
                                            <span
                                                className="absolute left-1/2 -translate-x-1/2 top-[12px] bottom-[-22px] w-[2px] bg-slate-200 dark:bg-slate-700 z-0 pointer-events-none"
                                                aria-hidden="true"
                                            />
                                        )}

                                        {/* Icon Node sits above the connector line */}
                                        <div className="relative z-10 shrink-0">
                                            <StepIcon status={step.status} />
                                        </div>
                                    </div>

                                    {/* Content + Right Date/Badge */}
                                    <div className="flex-1 min-w-0 flex items-start justify-between gap-2.5">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <p
                                                    className={`text-xs font-bold leading-snug break-words [overflow-wrap:anywhere] ${isActive
                                                            ? 'text-orange-950 dark:text-orange-200'
                                                            : isException
                                                                ? 'text-rose-950 dark:text-rose-200'
                                                                : isPending
                                                                    ? 'text-slate-500 dark:text-slate-400'
                                                                    : 'text-slate-900 dark:text-slate-100'
                                                        }`}
                                                >
                                                    {step.title}
                                                </p>
                                            </div>
                                            <p
                                                className={`text-[11.5px] mt-0.5 leading-snug break-words [overflow-wrap:anywhere] ${isActive
                                                        ? 'text-slate-600 dark:text-slate-300 font-medium'
                                                        : isException
                                                            ? 'text-rose-700/90 dark:text-rose-300 font-medium'
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
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default UnifiedShipmentTimeline;
