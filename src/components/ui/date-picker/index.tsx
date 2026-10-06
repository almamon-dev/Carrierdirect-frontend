import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDateString(dateStr: string | null | undefined): Date | null {
    if (!dateStr || typeof dateStr !== "string") return null;
    const trimmed = dateStr.trim();
    if (!trimmed) return null;

    // 1. Check YYYY-MM-DD
    const isoMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (isoMatch) {
        const y = parseInt(isoMatch[1], 10);
        const m = parseInt(isoMatch[2], 10) - 1;
        const d = parseInt(isoMatch[3], 10);
        const date = new Date(y, m, d);
        if (date.getFullYear() === y && date.getMonth() === m && date.getDate() === d) {
            return date;
        }
    }

    // 2. Check DD-MM-YYYY or DD/MM/YYYY
    const dmyMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmyMatch) {
        const d = parseInt(dmyMatch[1], 10);
        const m = parseInt(dmyMatch[2], 10) - 1;
        const y = parseInt(dmyMatch[3], 10);
        const date = new Date(y, m, d);
        if (date.getFullYear() === y && date.getMonth() === m && date.getDate() === d) {
            return date;
        }
    }

    // 3. Fallback to Date.parse (e.g., '07-Mar-2026', '2026-09-30T00:00:00.000Z')
    const ts = Date.parse(trimmed);
    if (!isNaN(ts)) {
        const dt = new Date(ts);
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    }

    return null;
}

function formatDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
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
        const stringValue = typeof value === "string" ? value : value ? String(value) : (defaultValue || "");
        const parsedDate = React.useMemo(() => parseDateString(stringValue), [stringValue]);

        const minDate = React.useMemo(() => parseDateString(min), [min]);
        const maxDate = React.useMemo(() => parseDateString(max), [max]);

        // Get initial view year and month bounded by min/max
        const getInitialView = () => {
            if (parsedDate) {
                return { y: parsedDate.getFullYear(), m: parsedDate.getMonth() };
            }
            const today = new Date();
            if (minDate && today < minDate) {
                return { y: minDate.getFullYear(), m: minDate.getMonth() };
            }
            if (maxDate && today > maxDate) {
                return { y: maxDate.getFullYear(), m: maxDate.getMonth() };
            }
            return { y: today.getFullYear(), m: today.getMonth() };
        };

        const initialView = getInitialView();
        const [viewYear, setViewYear] = React.useState<number>(initialView.y);
        const [viewMonth, setViewMonth] = React.useState<number>(initialView.m);

        // Sync view date when value or min/max changes
        React.useEffect(() => {
            if (parsedDate) {
                setViewYear(parsedDate.getFullYear());
                setViewMonth(parsedDate.getMonth());
            } else if (minDate && (viewYear < minDate.getFullYear() || (viewYear === minDate.getFullYear() && viewMonth < minDate.getMonth()))) {
                setViewYear(minDate.getFullYear());
                setViewMonth(minDate.getMonth());
            } else if (maxDate && (viewYear > maxDate.getFullYear() || (viewYear === maxDate.getFullYear() && viewMonth > maxDate.getMonth()))) {
                setViewYear(maxDate.getFullYear());
                setViewMonth(maxDate.getMonth());
            }
        }, [stringValue, minDate, maxDate]);

        const isDateDisabled = React.useCallback((y: number, m: number, d: number) => {
            const checkDate = new Date(y, m, d, 0, 0, 0, 0);
            if (minDate) {
                const minCheck = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0, 0, 0);
                if (checkDate.getTime() < minCheck.getTime()) return true;
            }
            if (maxDate) {
                const maxCheck = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0, 0);
                if (checkDate.getTime() > maxCheck.getTime()) return true;
            }
            return false;
        }, [minDate, maxDate]);

        const triggerChange = (newVal: string) => {
            if (onChange) {
                const syntheticEvent = {
                    target: { name: name || "", value: newVal },
                    currentTarget: { name: name || "", value: newVal },
                    preventDefault: () => {},
                    stopPropagation: () => {},
                };
                onChange(syntheticEvent as any);
            }
        };

        const handleSelectDay = (day: number, monthOffset: number = 0) => {
            if (disabled || readOnly) return;
            const targetDate = new Date(viewYear, viewMonth + monthOffset, day);
            const y = targetDate.getFullYear();
            const m = targetDate.getMonth();
            const d = targetDate.getDate();
            if (isDateDisabled(y, m, d)) return;

            const formatted = formatDateString(targetDate);
            triggerChange(formatted);
            setIsOpen(false);
        };

        const isPrevDisabled = React.useMemo(() => {
            if (!minDate) return false;
            if (viewYear < minDate.getFullYear()) return true;
            if (viewYear === minDate.getFullYear() && viewMonth <= minDate.getMonth()) return true;
            return false;
        }, [minDate, viewYear, viewMonth]);

        const isNextDisabled = React.useMemo(() => {
            if (!maxDate) return false;
            if (viewYear > maxDate.getFullYear()) return true;
            if (viewYear === maxDate.getFullYear() && viewMonth >= maxDate.getMonth()) return true;
            return false;
        }, [maxDate, viewYear, viewMonth]);

        const handlePrevMonth = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isPrevDisabled) return;
            if (viewMonth === 0) {
                setViewMonth(11);
                setViewYear((prev) => prev - 1);
            } else {
                setViewMonth((prev) => prev - 1);
            }
        };

        const handleNextMonth = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isNextDisabled) return;
            if (viewMonth === 11) {
                setViewMonth(0);
                setViewYear((prev) => prev + 1);
            } else {
                setViewMonth((prev) => prev + 1);
            }
        };

        const today = new Date();
        const isTodayDisabled = isDateDisabled(today.getFullYear(), today.getMonth(), today.getDate());

        const handleToday = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isTodayDisabled) return;
            setViewYear(today.getFullYear());
            setViewMonth(today.getMonth());
            triggerChange(formatDateString(today));
            setIsOpen(false);
        };

        const handleClear = (e: React.MouseEvent) => {
            e.stopPropagation();
            triggerChange("");
            setIsOpen(false);
        };

        // Generate calendar days
        const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
        const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

        const calendarDays: Array<{
            day: number;
            monthOffset: number; // -1 for prev, 0 for current, 1 for next
            isCurrentMonth: boolean;
            isSelected: boolean;
            isToday: boolean;
            isDisabled: boolean;
        }> = [];

        const isTodayDate = (y: number, m: number, d: number) =>
            today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;

        const isSelectedDate = (y: number, m: number, d: number) =>
            parsedDate ? parsedDate.getFullYear() === y && parsedDate.getMonth() === m && parsedDate.getDate() === d : false;

        // Prev month padding
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const d = daysInPrevMonth - i;
            const m = viewMonth === 0 ? 11 : viewMonth - 1;
            const y = viewMonth === 0 ? viewYear - 1 : viewYear;
            calendarDays.push({
                day: d,
                monthOffset: -1,
                isCurrentMonth: false,
                isSelected: isSelectedDate(y, m, d),
                isToday: isTodayDate(y, m, d),
                isDisabled: isDateDisabled(y, m, d),
            });
        }

        // Current month days
        for (let d = 1; d <= daysInCurrentMonth; d++) {
            calendarDays.push({
                day: d,
                monthOffset: 0,
                isCurrentMonth: true,
                isSelected: isSelectedDate(viewYear, viewMonth, d),
                isToday: isTodayDate(viewYear, viewMonth, d),
                isDisabled: isDateDisabled(viewYear, viewMonth, d),
            });
        }

        // Next month padding (fill up to 42 cells)
        const remainingCells = 42 - calendarDays.length;
        for (let d = 1; d <= remainingCells; d++) {
            const m = viewMonth === 11 ? 0 : viewMonth + 1;
            const y = viewMonth === 11 ? viewYear + 1 : viewYear;
            calendarDays.push({
                day: d,
                monthOffset: 1,
                isCurrentMonth: false,
                isSelected: isSelectedDate(y, m, d),
                isToday: isTodayDate(y, m, d),
                isDisabled: isDateDisabled(y, m, d),
            });
        }

        const inputId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : name);

        // Year options restricted by minDate and maxDate
        const currentYear = new Date().getFullYear();
        const startYear = minDate ? minDate.getFullYear() : currentYear - 30;
        const endYear = maxDate ? maxDate.getFullYear() : currentYear + 25;

        const effectiveStart = Math.min(startYear, viewYear);
        const effectiveEnd = Math.max(endYear, viewYear);

        const yearOptions: number[] = [];
        for (let y = effectiveStart; y <= effectiveEnd; y++) {
            yearOptions.push(y);
        }

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

                    <Popover.Portal>
                        <Popover.Content
                            align={align}
                            side="bottom"
                            sideOffset={4}
                            className="z-50 w-[280px] rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#1a1f26] p-3 shadow-xl shadow-slate-900/10 text-slate-800 dark:text-slate-100 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-150"
                        >
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between gap-1 pb-2 border-b border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={handlePrevMonth}
                                    disabled={isPrevDisabled}
                                    className={cn(
                                        "h-7 w-7 rounded-[4px] flex items-center justify-center transition-colors cursor-pointer",
                                        isPrevDisabled
                                            ? "text-slate-300 dark:text-slate-600 opacity-30 cursor-not-allowed pointer-events-none"
                                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                    title="Previous Month"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <div className="flex items-center gap-1">
                                    {/* Month Dropdown */}
                                    <select
                                        value={viewMonth}
                                        onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                                        className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent border-0 py-0.5 px-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer focus:outline-none"
                                    >
                                        {MONTH_NAMES.map((m, idx) => {
                                            const isMonthDisabled =
                                                (minDate && viewYear === minDate.getFullYear() && idx < minDate.getMonth()) ||
                                                (maxDate && viewYear === maxDate.getFullYear() && idx > maxDate.getMonth()) ||
                                                (minDate && viewYear < minDate.getFullYear()) ||
                                                (maxDate && viewYear > maxDate.getFullYear());

                                            return (
                                                <option
                                                    key={m}
                                                    value={idx}
                                                    disabled={isMonthDisabled}
                                                    className={cn(
                                                        "bg-white dark:bg-[#1a1f26]",
                                                        isMonthDisabled ? "text-slate-300 dark:text-slate-600" : "text-slate-800 dark:text-slate-200"
                                                    )}
                                                >
                                                    {m}
                                                </option>
                                            );
                                        })}
                                    </select>

                                    {/* Year Dropdown */}
                                    <select
                                        value={viewYear}
                                        onChange={(e) => {
                                            const newYear = parseInt(e.target.value, 10);
                                            setViewYear(newYear);
                                            if (minDate && newYear === minDate.getFullYear() && viewMonth < minDate.getMonth()) {
                                                setViewMonth(minDate.getMonth());
                                            } else if (maxDate && newYear === maxDate.getFullYear() && viewMonth > maxDate.getMonth()) {
                                                setViewMonth(maxDate.getMonth());
                                            }
                                        }}
                                        className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent border-0 py-0.5 px-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer focus:outline-none"
                                    >
                                        {yearOptions.map((y) => (
                                            <option key={y} value={y} className="bg-white dark:bg-[#1a1f26] text-slate-800 dark:text-slate-200">
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleNextMonth}
                                    disabled={isNextDisabled}
                                    className={cn(
                                        "h-7 w-7 rounded-[4px] flex items-center justify-center transition-colors cursor-pointer",
                                        isNextDisabled
                                            ? "text-slate-300 dark:text-slate-600 opacity-30 cursor-not-allowed pointer-events-none"
                                            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    )}
                                    title="Next Month"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {/* Weekday Names */}
                            <div className="grid grid-cols-7 gap-1 pt-2 pb-1 text-center">
                                {WEEK_DAYS.map((day) => (
                                    <span key={day} className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                                        {day}
                                    </span>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {calendarDays.map((c, idx) => {
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            disabled={c.isDisabled}
                                            onClick={() => !c.isDisabled && handleSelectDay(c.day, c.monthOffset)}
                                            className={cn(
                                                "h-7 w-full rounded text-xs flex items-center justify-center transition-colors select-none",
                                                c.isDisabled && c.isCurrentMonth && "text-slate-400 dark:text-slate-500 cursor-not-allowed pointer-events-none opacity-60 bg-transparent font-normal",
                                                c.isDisabled && !c.isCurrentMonth && "text-slate-300 dark:text-slate-700 cursor-not-allowed pointer-events-none opacity-40 bg-transparent font-normal",
                                                !c.isDisabled && "cursor-pointer",
                                                !c.isDisabled && !c.isCurrentMonth && "text-slate-400 dark:text-slate-500 font-normal opacity-50",
                                                !c.isDisabled && c.isCurrentMonth && !c.isSelected && "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium",
                                                !c.isDisabled && c.isToday && !c.isSelected && "border border-[#ff4a1f] font-bold text-[#ff4a1f] dark:text-[#ff6b4a]",
                                                !c.isDisabled && c.isSelected && "bg-[#ff4a1f] text-white font-bold hover:bg-[#e03e15] shadow-sm"
                                            )}
                                        >
                                            {c.day}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Clear
                                </button>
                                <button
                                    type="button"
                                    disabled={isTodayDisabled}
                                    onClick={handleToday}
                                    className={cn(
                                        "text-[11px] font-bold px-1.5 py-0.5 rounded transition-colors",
                                        isTodayDisabled
                                            ? "text-slate-300 dark:text-slate-600 opacity-30 cursor-not-allowed pointer-events-none"
                                            : "text-[#ff4a1f] hover:text-[#e03e15] dark:text-[#ff6b4a] hover:bg-orange-50 dark:hover:bg-orange-950/40 cursor-pointer"
                                    )}
                                >
                                    Today
                                </button>
                            </div>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>

                {error && <span className="text-[12px] text-[#d82c0d] mt-0.5 font-sans">{error}</span>}
            </div>
        );
    }
);

DatePicker.displayName = "DatePicker";

export default DatePicker;
