import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { parseTimeString } from "./timePickerUtils";
import { TimePickerContent } from "./TimePickerContent";

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

                    <TimePickerContent
                        align={align}
                        selectedHour={selectedHour}
                        selectedMinute={selectedMinute}
                        selectedPeriod={selectedPeriod}
                        stringValue={stringValue}
                        applyTime={applyTime}
                        handlePresetSelect={handlePresetSelect}
                        handleClear={handleClear}
                        handleNow={handleNow}
                        onClose={() => setIsOpen(false)}
                    />
                </Popover.Root>

                {error && <span className="text-[12px] text-[#d82c0d] mt-0.5 font-sans">{error}</span>}
            </div>
        );
    }
);

TimePicker.displayName = "TimePicker";

export default TimePicker;
