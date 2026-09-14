import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export default function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
    const textareaId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

    const renderLabel = (labelStr: string) => {
        if (labelStr.endsWith('*')) {
            const baseText = labelStr.slice(0, -1).trim();
            return (
                <>
                    {baseText} <span className="text-red-500 font-bold ml-0.5">*</span>
                </>
            );
        }
        return labelStr;
    };

    return (
        <div className="flex flex-col gap-1 w-full font-sans antialiased">
            {label && (
                <label htmlFor={textareaId} className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 font-sans">
                    {renderLabel(label)}
                </label>
            )}
            <textarea
                id={textareaId}
                className={cn(
                    "w-full h-auto min-h-[80px] rounded-sm border bg-white dark:bg-[#12161c] px-3 py-2 text-[13px] font-normal text-[#202223] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800/60 shadow-none resize-y font-sans antialiased",
                    error
                        ? "border-[#d82c0d] focus:border-[#d82c0d] focus:ring-0"
                        : "border-slate-300 dark:border-slate-700/80 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-0 focus:outline-none",
                    className
                )}
                {...props}
            />
            {error && <span className="text-[12px] text-[#d82c0d] mt-0.5 font-sans">{error}</span>}
        </div>
    );
}
