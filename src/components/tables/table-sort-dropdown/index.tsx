import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, ArrowUpDown } from 'lucide-react';
import { Column } from '../data-table';

export interface TableSortDropdownProps<T = any> {
    columns: Column<T>[];
    sortKey: string | null;
    sortDir: 'asc' | 'desc';
    onSortChange: (key: string | null) => void;
    onSortDirChange: (dir: 'asc' | 'desc') => void;
    className?: string;
}

export default function TableSortDropdown<T>({
    columns,
    sortKey,
    sortDir,
    onSortChange,
    onSortDirChange,
    className = ""
}: TableSortDropdownProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const sortableCols = columns.filter(c => Boolean(c.sortable) && c.id !== 'actions' && Boolean(c.label));
    const activeCol = sortableCols.find(c => c.id === sortKey);
    const activeLabel = activeCol ? activeCol.label : 'Default';

    return (
        <div className={`relative flex items-center ${className}`} ref={wrapperRef}>
            <div className="flex items-center border border-slate-200/80 dark:border-slate-700/60 rounded-[3px] overflow-hidden bg-slate-50/50 dark:bg-[#1e2329] shadow-none h-[32px] px-1">
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`h-[28px] px-2 flex items-center gap-1.5 text-xs font-semibold rounded-[2px] transition-colors cursor-pointer outline-none select-none ${
                        isOpen || sortKey
                            ? 'text-[#ff4a1f] font-bold'
                            : 'text-slate-700 dark:text-slate-200 hover:text-[#ff4a1f]'
                    }`}
                    title="Sort Items"
                >
                    <span className="truncate max-w-[120px]">Sort: {activeLabel}</span>
                    <ChevronDown size={12} className={`text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180 text-[#ff4a1f]' : ''}`} />
                </button>

                {/* Sort Direction Toggle Button */}
                {sortKey && (
                    <>
                        <div className="w-[1px] h-4 bg-slate-200/80 dark:bg-slate-700/60 mx-0.5"></div>
                        <button
                            type="button"
                            onClick={() => onSortDirChange(sortDir === 'asc' ? 'desc' : 'asc')}
                            className="h-[24px] px-1.5 flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-[#ff4a1f] transition-colors cursor-pointer"
                            title={`Order: ${sortDir === 'asc' ? 'Ascending' : 'Descending'}`}
                        >
                            <ArrowUpDown size={12} className="text-slate-500 dark:text-slate-400" />
                            <span className="uppercase text-[10px]">{sortDir}</span>
                        </button>
                    </>
                )}
            </div>

            {/* Custom Styled Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-[200px] bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 rounded-[3px] shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 font-sans">
                    <div className="p-2">
                        <div className="px-2 py-1 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                Sort By
                            </span>
                            {sortKey && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSortChange(null);
                                        setIsOpen(false);
                                    }}
                                    className="text-[10px] font-bold text-[#ff4a1f] hover:underline cursor-pointer"
                                >
                                    Reset
                                </button>
                            )}
                        </div>

                        <div className="space-y-0.5 max-h-[260px] overflow-y-auto hide-scrollbar">
                            {/* Default option */}
                            <button
                                type="button"
                                onClick={() => {
                                    onSortChange(null);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-[2px] text-[12px] flex items-center justify-between transition-colors cursor-pointer ${
                                    !sortKey
                                        ? 'bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] font-bold'
                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                            >
                                <span>Default</span>
                                {!sortKey && <Check size={13} className="text-[#ff4a1f]" />}
                            </button>

                            {/* Column options */}
                            {sortableCols.map((col) => {
                                const isSelected = sortKey === col.id;
                                return (
                                    <button
                                        key={col.id}
                                        type="button"
                                        onClick={() => {
                                            onSortChange(col.id);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-2.5 py-1.5 rounded-[2px] text-[12px] flex items-center justify-between transition-colors cursor-pointer ${
                                            isSelected
                                                ? 'bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] font-bold'
                                                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <span className="truncate">{col.label}</span>
                                        {isSelected && <Check size={13} className="text-[#ff4a1f] shrink-0 ml-1.5" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
