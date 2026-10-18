export const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function parseDateString(dateStr: string | null | undefined): Date | null {
    if (!dateStr || typeof dateStr !== "string") return null;
    const trimmed = dateStr.trim();
    if (!trimmed) return null;

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

    const ts = Date.parse(trimmed);
    if (!isNaN(ts)) {
        const dt = new Date(ts);
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    }

    return null;
}

export function formatDateString(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export interface CalendarDayItem {
    day: number;
    monthOffset: number;
    isCurrentMonth: boolean;
    isSelected: boolean;
    isToday: boolean;
    isDisabled: boolean;
}

export function generateCalendarDays(
    viewYear: number,
    viewMonth: number,
    parsedDate: Date | null,
    today: Date,
    isDateDisabled: (y: number, m: number, d: number) => boolean
): CalendarDayItem[] {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const calendarDays: CalendarDayItem[] = [];

    const isTodayDate = (y: number, m: number, d: number) =>
        today.getFullYear() === y && today.getMonth() === m && today.getDate() === d;

    const isSelectedDate = (y: number, m: number, d: number) =>
        parsedDate ? parsedDate.getFullYear() === y && parsedDate.getMonth() === m && parsedDate.getDate() === d : false;

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

    return calendarDays;
}
