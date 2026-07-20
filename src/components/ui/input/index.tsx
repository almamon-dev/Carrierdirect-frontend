import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, label, id, ...props }, ref) => {
        const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
        return (
            <div className="flex flex-col gap-1 w-full">
                {label && (
                    <label htmlFor={inputId} className="text-[14px] font-bold text-[#202223]">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    id={inputId}
                    className={cn(
                        "flex h-[36px] w-full rounded-[4px] border bg-white px-3 py-1.5 text-[14px] font-medium text-[#202223] placeholder:text-[#6d7175] focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 shadow-none",
                        error
                            ? "border-[#d82c0d] focus:border-[#d82c0d] focus:ring-[#d82c0d]"
                            : "border-[#d1d1d1] focus:border-[#008060]",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <span className="text-[12px] text-[#d82c0d] mt-0.5">{error}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
