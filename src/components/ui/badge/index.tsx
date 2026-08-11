import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'critical' | 'info' | 'secondary' | 'primary' | 'destructive' | 'outline' | 'error' | 'failed' | 'pending' | string;
    showDot?: boolean;
    children: React.ReactNode;
}

export default function Badge({ 
    variant = 'default', 
    showDot = false, 
    className = '', 
    children, 
    ...props 
}: BadgeProps) {
    const baseClasses = "inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold tracking-wide transition-colors rounded-full whitespace-nowrap shrink-0";
    
    const variants: Record<string, { bg: string; dot?: string }> = {
        default: { bg: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-700", dot: "bg-slate-500 dark:bg-slate-400" },
        secondary: { bg: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/80 dark:text-slate-200 dark:border-slate-700", dot: "bg-slate-500 dark:bg-slate-400" },
        primary: { bg: "bg-orange-50 text-[#ff4a1f] border border-orange-200/80 dark:bg-[#ff4a1f]/15 dark:text-[#ff6b4a] dark:border-[#ff4a1f]/30", dot: "bg-[#ff4a1f]" },
        
        // Success (Completed, Active, Verified, Paid, Accepted)
        success: { bg: "bg-emerald-50 text-emerald-700 border border-emerald-200/90 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/80", dot: "bg-emerald-500 dark:bg-emerald-400" },
        active: { bg: "bg-emerald-50 text-emerald-700 border border-emerald-200/90 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/80", dot: "bg-emerald-500 dark:bg-emerald-400" },
        completed: { bg: "bg-emerald-50 text-emerald-700 border border-emerald-200/90 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/80", dot: "bg-emerald-500 dark:bg-emerald-400" },

        // Warning & Pending (In Progress, Processing, Awaiting)
        warning: { bg: "bg-amber-50 text-amber-700 border border-amber-200/90 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/80", dot: "bg-amber-500 dark:bg-amber-400" },
        pending: { bg: "bg-amber-50 text-amber-700 border border-amber-200/90 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/80", dot: "bg-amber-500 dark:bg-amber-400" },
        processing: { bg: "bg-amber-50 text-amber-700 border border-amber-200/90 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/80", dot: "bg-amber-500 dark:bg-amber-400" },

        // Critical / Failed / Error / Cancelled
        critical: { bg: "bg-rose-50 text-rose-700 border border-rose-200/90 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/80", dot: "bg-rose-500 dark:bg-rose-400" },
        failed: { bg: "bg-rose-50 text-rose-700 border border-rose-200/90 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/80", dot: "bg-rose-500 dark:bg-rose-400" },
        error: { bg: "bg-rose-50 text-rose-700 border border-rose-200/90 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/80", dot: "bg-rose-500 dark:bg-rose-400" },
        destructive: { bg: "bg-rose-50 text-rose-700 border border-rose-200/90 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/80", dot: "bg-rose-500 dark:bg-rose-400" },
        cancelled: { bg: "bg-rose-50 text-rose-700 border border-rose-200/90 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/80", dot: "bg-rose-500 dark:bg-rose-400" },

        // Info & Draft
        info: { bg: "bg-sky-50 text-sky-700 border border-sky-200/90 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800/80", dot: "bg-sky-500 dark:bg-sky-400" },
        draft: { bg: "bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700", dot: "bg-slate-400 dark:bg-slate-500" },

        // Outline
        outline: { bg: "bg-transparent text-slate-700 border border-slate-300 dark:text-slate-200 dark:border-slate-700", dot: "bg-slate-400 dark:bg-slate-500" },
    };

    const currentVariant = variants[variant.toLowerCase()] || variants.default;

    return (
        <span className={cn(baseClasses, currentVariant.bg, className)} {...props}>
            {showDot && currentVariant.dot && (
                <span className={`w-1.5 h-1.5 rounded-full ${currentVariant.dot} shrink-0`} />
            )}
            <span className="inline-flex items-center gap-1 whitespace-nowrap">{children}</span>
        </span>
    );
}
