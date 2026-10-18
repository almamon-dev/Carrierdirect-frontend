import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Clock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { HOURS_12, MINUTES, COMMON_PRESETS } from "./timePickerUtils";

interface TimePickerContentProps {
    align?: "start" | "center" | "end";
    selectedHour: string;
    selectedMinute: string;
    selectedPeriod: "AM" | "PM";
    stringValue: string;
    applyTime: (h: string, m: string, p: "AM" | "PM") => void;
    handlePresetSelect: (preset: string) => void;
    handleClear: () => void;
    handleNow: () => void;
    onClose: () => void;
}

export const TimePickerContent: React.FC<TimePickerContentProps> = ({
    align = "end",
    selectedHour,
    selectedMinute,
    selectedPeriod,
    stringValue,
    applyTime,
    handlePresetSelect,
    handleClear,
    handleNow,
    onClose,
}) => {
    return (
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
                            onClick={onClose}
                            className="text-[11px] font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white px-2.5 py-0.5 rounded transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                        >
                            <Check size={12} /> Done
                        </button>
                    </div>
                </div>
            </Popover.Content>
        </Popover.Portal>
    );
};
