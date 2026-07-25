import React from 'react';
import FormLabel from '@/components/ui/label';

export const SectionHeader = ({ title, icon: Icon, className = "col-span-1 md:col-span-2" }: { title: string, icon?: any, className?: string }) => (
    <div className={`${className} mt-4 pt-3 border-t border-slate-100 first:mt-0 first:pt-0 first:border-t-0 mb-2`}>
        <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-2">
            {Icon && <Icon size={16} className="text-slate-400" />}
            {title}
        </h3>
    </div>
);

export const FormRow = ({ label, required, children, colSpan = false }: { label: string, required?: boolean, children: React.ReactNode, colSpan?: boolean }) => (
    <div className={`${colSpan ? 'col-span-1 md:col-span-2' : ''} grid grid-cols-[160px_10px_1fr] items-start gap-3`}>
        <FormLabel required={required} className="!mb-0 mt-2">{label}</FormLabel>
        <p className="text-[14px] text-slate-400 mt-2">:</p>
        <div>{children}</div>
    </div>
);
