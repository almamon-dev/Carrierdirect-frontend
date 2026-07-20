import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'critical' | 'info';
    children: React.ReactNode;
}

export default function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
    const baseClasses = "inline-flex items-center px-2 py-0.5 rounded-[3px] text-[11px] font-bold";
    
    const variants = {
        default: "bg-[#e4e5e7] text-[#202223]",
        success: "bg-[#aee9d1] text-[#008060]",
        warning: "bg-[#ffea8a] text-[#8a6116]",
        critical: "bg-[#fed3d1] text-[#d82c0d]",
        info: "bg-[#b4e1fa] text-[#006fbb]",
    };

    return (
        <span className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
            {children}
        </span>
    );
}
