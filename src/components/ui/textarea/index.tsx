import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export default function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
    const textareaId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label htmlFor={textareaId} className="text-[13px] font-bold text-[#202223]">
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={cn(
                    "w-full h-auto min-h-[80px] rounded-[3px] border bg-white px-3 py-2 text-[12px] font-medium text-[#202223] placeholder:text-[#6d7175] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 shadow-none resize-y",
                    error
                        ? "border-[#d82c0d] focus:border-[#d82c0d] focus:ring-[#d82c0d]"
                        : "border-[#d1d1d1] focus:border-[#008060]",
                    className
                )}
                {...props}
            />
            {error && <span className="text-[12px] text-[#d82c0d] mt-0.5">{error}</span>}
        </div>
    );
}
