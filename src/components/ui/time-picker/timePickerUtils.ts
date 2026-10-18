export const HOURS_12 = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
export const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
export const COMMON_PRESETS = [
    "08:00 AM", "09:00 AM", "10:00 AM", "12:00 PM",
    "02:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

export function parseTimeString(timeStr: string): { hour: string; minute: string; period: "AM" | "PM" } {
    if (!timeStr || typeof timeStr !== "string") {
        return { hour: "09", minute: "00", period: "AM" };
    }
    const clean = timeStr.trim();
    const match12 = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match12) {
        let h = parseInt(match12[1], 10);
        if (h === 0) h = 12;
        if (h > 12) h = 12;
        return {
            hour: String(h).padStart(2, "0"),
            minute: match12[2],
            period: match12[3].toUpperCase() as "AM" | "PM",
        };
    }
    const match24 = clean.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (match24) {
        let h = parseInt(match24[1], 10);
        const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
        if (h === 0) h = 12;
        else if (h > 12) h -= 12;
        return {
            hour: String(h).padStart(2, "0"),
            minute: match24[2],
            period,
        };
    }
    return { hour: "09", minute: "00", period: "AM" };
}
