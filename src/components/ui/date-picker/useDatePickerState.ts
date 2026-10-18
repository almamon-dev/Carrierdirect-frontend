import * as React from "react";
import {
    parseDateString,
    formatDateString,
    generateCalendarDays
} from "./datePickerUtils";

interface UseDatePickerStateProps {
    value?: string | number | readonly string[];
    defaultValue?: string;
    min?: string;
    max?: string;
    disabled?: boolean;
    readOnly?: boolean;
    name?: string;
    onChange?: (e: any) => void;
    setIsOpen: (open: boolean) => void;
}

export function useDatePickerState({
    value = "",
    defaultValue,
    min,
    max,
    disabled = false,
    readOnly = false,
    name,
    onChange,
    setIsOpen,
}: UseDatePickerStateProps) {
    const stringValue = typeof value === "string" ? value : value ? String(value) : (defaultValue || "");
    const parsedDate = React.useMemo(() => parseDateString(stringValue), [stringValue]);

    const minDate = React.useMemo(() => parseDateString(min), [min]);
    const maxDate = React.useMemo(() => parseDateString(max), [max]);

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

    const calendarDays = React.useMemo(
        () => generateCalendarDays(viewYear, viewMonth, parsedDate, today, isDateDisabled),
        [viewYear, viewMonth, parsedDate, isDateDisabled]
    );

    const currentYear = new Date().getFullYear();
    const startYear = minDate ? minDate.getFullYear() : currentYear - 30;
    const endYear = maxDate ? maxDate.getFullYear() : currentYear + 25;
    const effectiveStart = Math.min(startYear, viewYear);
    const effectiveEnd = Math.max(endYear, viewYear);

    const yearOptions: number[] = [];
    for (let y = effectiveStart; y <= effectiveEnd; y++) {
        yearOptions.push(y);
    }

    return {
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
    };
}
