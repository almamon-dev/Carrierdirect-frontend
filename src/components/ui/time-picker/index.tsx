import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimePickerProps {
    id?: string;
    name?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (e: any) => void;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    className?: string;
    error?: string;
    label?: string;
    align?: "start" | "center" | "end";
}

const HOURS_12 = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
const COMMON_PRESETS = [
    "08:00 AM", "09:00 AM", "10:00 AM", "12:00 PM",
    "02:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
];

function parseTimeString(timeStr: string): { hour: string; minute: string; period: "AM" | "PM" } {
    if (!timeStr || typeof timeStr !== "string") {
        return { hour: "09", minute: "00", period: "AM" };
    }
    const clean = timeStr.trim();
    // Check 12-hour format e.g. "09:30 AM" or "9:30 PM"
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
    // Check 24-hour format e.g. "17:00" or "09:00"
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

const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
    (
        {
            id,
            name,
            value = "",
            defaultValue,
            onChange,
            placeholder = "HH:MM AM/PM",
            disabled = false,
            readOnly = false,
            required = false,
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

        const initial = parseTimeString(stringValue);
        const [selectedHour, setSelectedHour] = React.useState(initial.hour);
        const [selectedMinute, setSelectedMinute] = React.useState(initial.minute);
        const [selectedPeriod, setSelectedPeriod] = React.useState<"AM" | "PM">(initial.period);

        React.useEffect(() => {
            if (stringValue) {
                const parsed = parseTimeString(stringValue);
                setSelectedHour(parsed.hour);
                setSelectedMinute(parsed.minute);
                setSelectedPeriod(parsed.period);
            }
        }, [stringValue]);

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

        const applyTime = (h: string, m: string, p: "AM" | "PM") => {
            const formatted = `${h}:${m} ${p}`;
            setSelectedHour(h);
            setSelectedMinute(m);
            setSelectedPeriod(p);
            triggerChange(formatted);
        };

        const handlePresetSelect = (preset: string) => {
            const parsed = parseTimeString(preset);
            setSelectedHour(parsed.hour);
            setSelectedMinute(parsed.minute);
            setSelectedPeriod(parsed.period);
            triggerChange(preset);
            setIsOpen(false);
        };

        const handleNow = () => {
            const now = new Date();
            let h = now.getHours();
            const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
            if (h === 0) h = 12;
            else if (h > 12) h -= 12;
            // Round to nearest 5 minutes
            const m = Math.round(now.getMinutes() / 5) * 5;
            const mStr = String(m >= 60 ? 55 : m).padStart(2, "0");
            const hStr = String(h).padStart(2, "0");
            applyTime(hStr, mStr, period);
            setIsOpen(false);
        };

        const handleClear = () => {
            triggerChange("");
            setIsOpen(false);
        };

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
                                    <Clock size={15} />
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
                            {/* Header / Preview */}
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                    <Clock size={13} className="text-[#ff4a1f]" />
                                    Select Time
                                </span>
                                <div className="text-xs font-bold bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] px-2 py-0.5 rounded border border-orange-200/50 dark:border-orange-800/40">
                                    {selectedHour}:{selectedMinute} {selectedPeriod}
                                </div>
                            </div>

                            {/* Column Picker */}
                            <div className="grid grid-cols-3 gap-1.5 pt-2.5 pb-2 text-center text-xs">
                                {/* Hour Column */}
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hour</div>
                                    <div className="h-36 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                                        {HOURS_12.map((h) => {
                                            const isSelected = selectedHour === h;
                                            return (
                                                <button
                                                    key={h}
                                                    type="button"
                                                    onClick={() => applyTime(h, selectedMinute, selectedPeriod)}
                                                    className={cn(
                                                        "w-full py-1 rounded text-xs transition-colors cursor-pointer block",
                                                        isSelected
                                                            ? "bg-[#ff4a1f] text-white font-bold shadow-xs"
                                                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    )}
                                                >
                                                    {h}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Minute Column */}
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Min</div>
                                    <div className="h-36 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                                        {MINUTES.map((m) => {
                                            const isSelected = selectedMinute === m;
                                            return (
                                                <button
                                                    key={m}
                                                    type="button"
                                                    onClick={() => applyTime(selectedHour, m, selectedPeriod)}
                                                    className={cn(
                                                        "w-full py-1 rounded text-xs transition-colors cursor-pointer block",
                                                        isSelected
                                                            ? "bg-[#ff4a1f] text-white font-bold shadow-xs"
                                                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    )}
                                                >
                                                    {m}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Period Column */}
                                <div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Period</div>
                                    <div className="space-y-1.5 pt-1">
                                        {(["AM", "PM"] as const).map((p) => {
                                            const isSelected = selectedPeriod === p;
                                            return (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => applyTime(selectedHour, selectedMinute, p)}
                                                    className={cn(
                                                        "w-full py-2 rounded text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1",
                                                        isSelected
                                                            ? "bg-[#ff4a1f] text-white shadow-xs"
                                                            : "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    )}
                                                >
                                                    {p}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Presets */}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quick Presets</div>
                                <div className="grid grid-cols-4 gap-1">
                                    {COMMON_PRESETS.map((preset) => (
                                        <button
                                            key={preset}
                                            type="button"
                                            onClick={() => handlePresetSelect(preset)}
                                            className={cn(
                                                "px-1 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer text-center truncate",
                                                stringValue === preset
                                                    ? "bg-[#ff4a1f] text-white font-bold"
                                                    : "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-orange-50 hover:text-[#ff4a1f] dark:hover:bg-orange-950/30"
                                            )}
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Clear
                                </button>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={handleNow}
                                        className="text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                    >
                                        Now
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="text-[11px] font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white px-2.5 py-0.5 rounded transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                                    >
                                        <Check size={12} /> Done
                                    </button>
                                </div>
                            </div>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>

                {error && <span className="text-[12px] text-[#d82c0d] mt-0.5 font-sans">{error}</span>}
            </div>
        );
    }
);

TimePicker.displayName = "TimePicker";

export default TimePicker;

