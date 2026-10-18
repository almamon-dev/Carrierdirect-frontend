export function formatTime12h(timeStr?: string | null): string {
    if (!timeStr) return '';
    const clean = String(timeStr).trim();
    if (!clean || clean === '—' || clean === '-') return '';

    if (/^\d{1,2}:\d{2}\s*(?:AM|PM)$/i.test(clean)) {
        return clean.toUpperCase();
    }

    const match = clean.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (match) {
        let hour = parseInt(match[1], 10);
        const minute = match[2];
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        if (hour === 0) hour = 12;
        const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
        return `${hourStr}:${minute} ${ampm}`;
    }

    return clean;
}

export function formatDeliveryTime(
    timeFrom?: string | null,
    timeTill?: string | null,
    fallback?: string | null,
    singleTime?: string | null
): string {
    const from12 = formatTime12h(timeFrom);
    const till12 = formatTime12h(timeTill);
    const single12 = formatTime12h(singleTime);

    if (single12) return single12;
    if (till12) return till12;
    if (from12) return from12;
    if (fallback) {
        const cleanWin = String(fallback).trim();
        if (cleanWin.includes('–') || cleanWin.includes('-') || cleanWin.toLowerCase().includes(' to ')) {
            const parts = cleanWin.split(/–|-|\bto\b/i);
            if (parts.length === 2) {
                const p2 = formatTime12h(parts[1].trim());
                if (p2) return p2;
            }
        }
        return formatTime12h(cleanWin);
    }
    return '';
}

export function formatTimeSlotWindow(
    timeFrom?: string | null,
    timeTill?: string | null,
    fallbackWindow?: string | null,
    singleTime?: string | null
): string {
    const from12 = formatTime12h(timeFrom);
    const till12 = formatTime12h(timeTill);

    if (from12 && till12 && from12 !== till12) {
        return `${from12} – ${till12}`;
    }
    if (from12) return from12;
    if (till12) return till12;
    if (singleTime) return formatTime12h(singleTime);
    if (fallbackWindow) {
        const cleanWin = String(fallbackWindow).trim();
        if (cleanWin.includes('–') || cleanWin.includes('-') || cleanWin.toLowerCase().includes(' to ')) {
            const parts = cleanWin.split(/–|-|\bto\b/i);
            if (parts.length === 2) {
                const p1 = formatTime12h(parts[0].trim());
                const p2 = formatTime12h(parts[1].trim());
                if (p1 && p2 && p1 !== p2) return `${p1} – ${p2}`;
                if (p1) return p1;
            }
        }
        return formatTime12h(cleanWin);
    }
    return '';
}
