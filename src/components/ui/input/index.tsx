import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, label, icon, rightIcon, id, ...props }, ref) => {
        const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

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
                    <label htmlFor={inputId} className="text-[13px] font-semibold text-slate-700 font-sans">
                        {renderLabel(label)}
                    </label>
                )}
                <div className="relative flex items-center w-full">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 text-gray-400">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            "flex h-[40px] w-full rounded-md border bg-white px-3 py-1.5 text-[13px] font-normal text-[#202223] placeholder:text-slate-400 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 shadow-none font-sans antialiased",
                            icon && "pl-9",
                            rightIcon && "pr-10",
                            error
                                ? "border-[#d82c0d] focus:border-[#d82c0d] focus:ring-[#d82c0d]"
                                : "border-slate-300 focus:border-[#2563eb] focus:ring-[#2563eb]/20",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && <span className="text-[12px] text-[#d82c0d] mt-0.5 font-sans">{error}</span>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
