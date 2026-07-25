import React from 'react';
import FormLabel from '@/components/ui/label';

export const SectionHeader = ({ title, icon: Icon, className = "col-span-1 md:col-span-2" }: { title: string, icon?: any, className?: string }) => (
    <div className={`${className} mt-3 pt-2.5 border-t border-slate-100 first:mt-0 first:pt-0 first:border-t-0 mb-1.5`}>
        <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            {Icon && <Icon size={15} className="text-slate-400" />}
            {title}
        </h3>
    </div>
);

export const FormRow = ({ label, required, children, colSpan = false }: { label: string, required?: boolean, children: React.ReactNode, colSpan?: boolean }) => (
    <div className={`${colSpan ? 'col-span-1 md:col-span-2' : ''} grid grid-cols-[150px_10px_1fr] items-center gap-2.5`}>
        <FormLabel required={required} className="!mb-0 text-xs font-semibold text-slate-700 leading-tight">{label}</FormLabel>
        <span className="text-xs text-slate-400 font-medium select-none">:</span>
        <div className="w-full min-w-0">{children}</div>
    </div>
);
