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
        default: { bg: "bg-slate-100 text-slate-700 border border-slate-200", dot: "bg-slate-500" },
        secondary: { bg: "bg-slate-100 text-slate-700 border border-slate-200", dot: "bg-slate-500" },
        primary: { bg: "bg-orange-50 text-[#ff4a1f] border border-orange-200/80", dot: "bg-[#ff4a1f]" },
        
        // Success (Completed, Active, Verified, Paid, Accepted)
        success: { bg: "bg-emerald-50 text-emerald-700 border border-emerald-200/90", dot: "bg-emerald-500" },
        active: { bg: "bg-emerald-50 text-emerald-700 border border-emerald-200/90", dot: "bg-emerald-500" },
        completed: { bg: "bg-emerald-50 text-emerald-700 border border-emerald-200/90", dot: "bg-emerald-500" },

        // Warning & Pending (In Progress, Processing, Awaiting)
        warning: { bg: "bg-amber-50 text-amber-700 border border-amber-200/90", dot: "bg-amber-500" },
        pending: { bg: "bg-amber-50 text-amber-700 border border-amber-200/90", dot: "bg-amber-500" },
        processing: { bg: "bg-amber-50 text-amber-700 border border-amber-200/90", dot: "bg-amber-500" },

        // Critical / Failed / Error / Cancelled
        critical: { bg: "bg-rose-50 text-rose-700 border border-rose-200/90", dot: "bg-rose-500" },
        failed: { bg: "bg-rose-50 text-rose-700 border border-rose-200/90", dot: "bg-rose-500" },
        error: { bg: "bg-rose-50 text-rose-700 border border-rose-200/90", dot: "bg-rose-500" },
        destructive: { bg: "bg-rose-50 text-rose-700 border border-rose-200/90", dot: "bg-rose-500" },
        cancelled: { bg: "bg-rose-50 text-rose-700 border border-rose-200/90", dot: "bg-rose-500" },

        // Info & Draft
        info: { bg: "bg-sky-50 text-sky-700 border border-sky-200/90", dot: "bg-sky-500" },
        draft: { bg: "bg-slate-100 text-slate-600 border border-slate-200", dot: "bg-slate-400" },

        // Outline
        outline: { bg: "bg-transparent text-slate-700 border border-slate-300", dot: "bg-slate-400" },
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
