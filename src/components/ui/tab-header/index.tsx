import React from 'react';
import { cn } from '@/lib/utils';

interface TabHeaderProps {
    title: string;
    icon?: React.ElementType;
    className?: string;
}

export default function TabHeader({ title, icon: Icon, className }: TabHeaderProps) {
    return (
        <div className={cn("col-span-1 md:col-span-2 pb-3.5 mb-2 border-b border-slate-100 dark:border-slate-800", className)}>
            <h2 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {Icon && <Icon size={17} className="text-[#ff4a1f]" />}
                <span>{title}</span>
            </h2>
        </div>
    );
}
