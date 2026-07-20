import React from 'react';
import { cn } from '@/lib/utils';

interface TabHeaderProps {
    title: string;
    icon?: React.ElementType;
    className?: string;
}

export default function TabHeader({ title, icon: Icon, className }: TabHeaderProps) {
    return (
        <div className={cn("col-span-1 md:col-span-2 -mt-2 md:-mt-4 mb-5 pb-4 border-b border-slate-200 -mx-6 md:-mx-8 px-6 md:px-8", className)}>
            <h2 className="text-[18px] font-bold text-slate-800 flex items-center gap-2">
                {Icon && <Icon size={18} className="text-slate-600" />}
                {title}
            </h2>
        </div>
    );
}
