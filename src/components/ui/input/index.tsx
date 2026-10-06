import * as React from "react";
import { cn } from "@/lib/utils";
import DatePicker from "@/components/ui/date-picker";
import TimePicker from "@/components/ui/time-picker";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, label, icon, rightIcon, id, ...props }, ref) => {
        const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

        if (type === "date") {
            return (
                <DatePicker
                    ref={ref}
                    id={inputId}
                    label={label}
                    error={error}
                    className={className}
                    min={typeof props.min === 'string' ? props.min : undefined}
                    max={typeof props.max === 'string' ? props.max : undefined}
                    {...(props as any)}
                />
            );
        }

        if (type === "time") {
            return (
                <TimePicker
                    ref={ref}
                    id={inputId}
                    label={label}
                    error={error}
                    className={className}
                    {...(props as any)}
                />
            );
        }

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
                    <label htmlFor={inputId} className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 font-sans">
                        {renderLabel(label)}
                    </label>
                )}
                <div className="relative flex items-center w-full">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10 text-gray-400 dark:text-slate-500">
                            {icon}
                        </div>
                    )}
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            "block h-[36px] w-full rounded-sm border bg-white dark:bg-[#12161c] px-3 py-1 text-[13px] font-normal text-[#202223] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:text-slate-500 dark:disabled:text-slate-500 shadow-none font-sans antialiased dark:[color-scheme:dark]",
                            icon && "pl-9",
                            rightIcon && "pr-10",
                            (type === "date" || type === "time" || type === "datetime-local") &&
                                "cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:ml-auto",
                            error
                                ? "border-[#d82c0d] focus:border-[#d82c0d] focus:ring-0"
                                : "border-slate-300 dark:border-slate-700/80 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-0 focus:outline-none",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 pointer-events-none">
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
