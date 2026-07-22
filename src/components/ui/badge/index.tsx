import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'critical' | 'info' | 'secondary' | 'primary' | 'destructive' | 'outline' | string;
    children: React.ReactNode;
}

export default function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
    const baseClasses = "inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-bold";
    
    const variants: Record<string, string> = {
        default: "bg-[#e4e5e7] text-[#202223]",
        secondary: "bg-slate-100 text-slate-700 border border-slate-200",
        primary: "bg-[#ff4a1f]/10 text-[#ff4a1f] border border-[#ff4a1f]/20",
        success: "bg-[#aee9d1] text-[#008060]",
        warning: "bg-[#ffea8a] text-[#8a6116]",
        critical: "bg-[#fed3d1] text-[#d82c0d]",
        destructive: "bg-red-100 text-red-700 border border-red-200",
        info: "bg-[#b4e1fa] text-[#006fbb]",
        outline: "bg-transparent text-slate-700 border border-slate-200",
    };

    const variantClass = variants[variant] || variants.default;

    return (
        <span className={`${baseClasses} ${variantClass} ${className}`} {...props}>
            {children}
        </span>
    );
}
