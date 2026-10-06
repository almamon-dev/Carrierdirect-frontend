import React from 'react';
import FormLabel from '@/components/ui/label';

export const SectionHeader = ({ title, icon: Icon, required = false, className = "col-span-1 md:col-span-2" }: { title: string, icon?: any, required?: boolean, className?: string }) => (
    <div className={`${className} mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 first:mt-0 first:pt-0 first:border-t-0 mb-1.5`}>
        <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            {Icon && <Icon size={15} className="text-slate-400 dark:text-slate-500" />}
            <span>{title}</span>{required && <span className="text-red-500 font-bold ml-0.5">*</span>}
        </h3>
    </div>
);

export const FormRow = ({
    label,
    required,
    children,
    colSpan = false,
    error,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    colSpan?: boolean;
    error?: string;
}) => {
    // Check if child component is already handling/rendering the error to avoid duplicate text
    const childHasError = React.isValidElement(children) && Boolean((children.props as any)?.error);

    return (
        <div className={`${colSpan ? 'col-span-1 md:col-span-2' : ''} grid grid-cols-[150px_10px_1fr] items-start gap-2.5 py-1`}>
            <FormLabel required={required} className="!mb-0 text-xs font-semibold text-slate-700 dark:text-slate-300 leading-normal pt-2 select-none">
                {label}
            </FormLabel>
            <span className="text-xs text-slate-400 dark:text-slate-600 font-medium select-none pt-2">:</span>
            <div className="w-full min-w-0 flex flex-col">
                {children}
                {error && !childHasError && (
                    <span className="text-[11.5px] font-medium text-[#d82c0d] dark:text-red-400 mt-1 flex items-center gap-1 animate-in fade-in duration-200">
                        {error}
                    </span>
                )}
            </div>
        </div>
    );
};
