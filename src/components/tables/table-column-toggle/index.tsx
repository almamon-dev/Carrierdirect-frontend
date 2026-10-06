import React, { useState, useRef, useEffect } from "react";
import { Settings2, Check } from "lucide-react";

export interface Column {
    id: string;
    label: string;
}

export interface TableColumnToggleProps {
    columns: Column[];
    visibleColumns: string[];
    onToggleColumn: (id: string) => void;
    onResetColumns?: () => void;
    wrapCells?: boolean;
    onToggleWrapCells?: (wrap: boolean) => void;
    className?: string;
}

export default function TableColumnToggle({ 
    columns, 
    visibleColumns, 
    onToggleColumn, 
    onResetColumns,
    wrapCells = false,
    onToggleWrapCells,
    className = "" 
}: TableColumnToggleProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`h-[32px] w-[32px] flex items-center justify-center rounded-[3px] border transition-all outline-none shadow-none cursor-pointer ${
                    isOpen 
                        ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100" 
                        : "bg-white dark:bg-[#1e2329] border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-100"
                }`}
                title="Table settings"
            >
                <Settings2 size={15} className={isOpen ? "text-[#635bff]" : "text-slate-500 dark:text-slate-400"} />
            </button>
            
            {isOpen && (
                <div
                    className="absolute right-0 mt-1.5 w-[210px] sm:w-[220px] bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 rounded-[6px] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 font-sans text-left"
                >
                    <div className="p-3">
                        {/* Title: Table settings */}
                        <div className="text-[12.5px] font-bold text-slate-900 dark:text-slate-100 mb-2 px-0.5">
                            Table settings
                        </div>

                        {/* Top: Wrap cells toggle (Stripe exact layout) */}
                        {onToggleWrapCells && (
                            <div className="flex items-center justify-between py-1 px-0.5">
                                <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300 select-none">
                                    Wrap cells
                                </span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={wrapCells}
                                    onClick={() => onToggleWrapCells(!wrapCells)}
                                    className={`relative inline-flex h-[18px] w-[34px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        wrapCells ? "bg-[#635bff]" : "bg-slate-200 dark:bg-slate-700"
                                    }`}
                                    title={wrapCells ? "Disable text wrap" : "Enable text wrap"}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-[14px] w-[14px] transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                            wrapCells ? "translate-x-4" : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-slate-100 dark:border-slate-800 my-2" />

                        {/* Section Header: Columns */}
                        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 px-0.5">
                            Columns
                        </div>

                        {/* Columns Checkbox List */}
                        <div className="space-y-0.5 max-h-[240px] overflow-y-auto hide-scrollbar">
                            {columns.map((col) => {
                                const isVisible = visibleColumns.includes(col.id);

                                return (
                                    <div 
                                        key={col.id}
                                        onClick={() => onToggleColumn(col.id)}
                                        className="flex items-center gap-2 py-1.5 px-1 rounded-[3px] hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer select-none transition-colors"
                                    >
                                        <div className={`w-3.5 h-3.5 rounded-[3px] flex items-center justify-center transition-colors shrink-0 ${
                                            isVisible 
                                                ? "bg-[#635bff] text-white" 
                                                : "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                                        }`}>
                                            {isVisible && <Check size={10} strokeWidth={3.5} />}
                                        </div>
                                        <span className={`text-[12px] truncate flex-1 ${
                                            isVisible ? "text-slate-800 dark:text-slate-200 font-medium" : "text-slate-400 dark:text-slate-500"
                                        }`}>
                                            {col.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom: Reset to default */}
                        {onResetColumns && (
                            <div className="pt-2 mt-1.5 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={onResetColumns}
                                    className="w-full text-center text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 py-0.5 transition-colors cursor-pointer"
                                >
                                    Reset to default
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
