import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDatePickerState } from "./useDatePickerState";
import { DatePickerCalendar } from "./DatePickerCalendar";

export interface DatePickerProps {
    id?: string;
    name?: string;
    value?: string | number | readonly string[];
    defaultValue?: string;
    onChange?: (e: any) => void;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    min?: string;
    max?: string;
    className?: string;
    error?: string;
    label?: string;
    align?: "start" | "center" | "end";
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
    (
        {
            id,
            name,
            value = "",
            defaultValue,
            onChange,
            placeholder = "YYYY-MM-DD",
            disabled = false,
            readOnly = false,
            required = false,
            min,
            max,
            className,
            error,
            label,
            align = "end",
            ...props
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = React.useState(false);

        const {
            stringValue,
            viewYear,
            viewMonth,
            setViewYear,
            setViewMonth,
            minDate,
            maxDate,
            isPrevDisabled,
            isNextDisabled,
            handlePrevMonth,
            handleNextMonth,
            isTodayDisabled,
            handleToday,
            handleClear,
            calendarDays,
            yearOptions,
            handleSelectDay,
            triggerChange,
        } = useDatePickerState({
            value,
            defaultValue,
            min,
            max,
            disabled,
            readOnly,
            name,
            onChange,
            setIsOpen,
        });

        const inputId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : name);

        return (
            <div className="flex flex-col gap-1 w-full font-sans antialiased">
                {label && (
                    <label htmlFor={inputId} className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                        {label}
                        {required && <span className="text-red-500 font-bold ml-0.5">*</span>}
                    </label>
                )}

                <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
                    <Popover.Anchor asChild>
                        <div className="relative flex items-center w-full">
                            <input
                                ref={ref}
                                type="text"
                                id={inputId}
                                name={name}
                                value={stringValue}
                                onChange={(e) => triggerChange(e.target.value)}
                                onClick={() => !disabled && !readOnly && setIsOpen(true)}
                                placeholder={placeholder}
                                disabled={disabled}
                                readOnly={readOnly}
                                required={required}
                                className={cn(
                                    "block h-[36px] w-full rounded-sm border bg-white dark:bg-[#12161c] px-3 pr-9 py-1 text-[13px] font-normal text-[#202223] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100 dark:disabled:bg-slate-800/60 disabled:text-slate-500 dark:disabled:text-slate-500 shadow-none font-sans cursor-pointer",
                                    error
                                        ? "border-[#d82c0d] focus:border-[#d82c0d] focus:ring-0"
                                        : "border-slate-300 dark:border-slate-700/80 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-0 focus:outline-none",
                                    className
                                )}
                                {...props}
                            />

                            <Popover.Trigger asChild>
                                <button
                                    type="button"
                                    disabled={disabled || readOnly}
                                    tabIndex={-1}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none"
                                >
                                    <CalendarIcon size={15} />
                                </button>
                            </Popover.Trigger>
                        </div>
                    </Popover.Anchor>

                    <DatePickerCalendar
                        align={align}
                        viewYear={viewYear}
                        viewMonth={viewMonth}
                        setViewYear={setViewYear}
                        setViewMonth={setViewMonth}
                        handlePrevMonth={handlePrevMonth}
                        handleNextMonth={handleNextMonth}
                        isPrevDisabled={isPrevDisabled}
                        isNextDisabled={isNextDisabled}
                        minDate={minDate}
                        maxDate={maxDate}
                        yearOptions={yearOptions}
                        calendarDays={calendarDays}
                        handleSelectDay={handleSelectDay}
                        handleClear={handleClear}
                        handleToday={handleToday}
                        isTodayDisabled={isTodayDisabled}
                    />
                </Popover.Root>

                {error && <span className="text-[12px] text-[#d82c0d] mt-0.5 font-sans">{error}</span>}
            </div>
        );
    }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
