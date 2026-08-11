import React from 'react';
import { SlidersHorizontal, RotateCcw, X } from 'lucide-react';

export interface TableFilterProps {
    onFilterClick?: () => void;
    onResetClick?: () => void;
    isFilterOpen?: boolean;
    isFiltered?: boolean;
    className?: string;
}

export default function TableFilter({ 
    onFilterClick, 
    onResetClick, 
    isFilterOpen = false,
    isFiltered = false,
    className = "" 
}: TableFilterProps) {
    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            {/* Clear / Reset Button (Appears on left when filter is open or active) */}
            {(isFilterOpen || isFiltered) && onResetClick && (
                <button 
                    onClick={onResetClick}
                    className="h-[32px] px-2.5 rounded-md border border-slate-300 dark:border-slate-700 text-[12px] font-bold flex items-center gap-1.5 bg-white dark:bg-[#1e2329] text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/15 hover:border-orange-300 dark:hover:border-orange-500/40 hover:text-[#FF4A1F] dark:hover:text-[#FF4A1F] transition-all outline-none shadow-2xs cursor-pointer group"
                    title="Clear All Filters"
                >
                    <RotateCcw size={13} className="group-hover:rotate-[-45deg] transition-transform text-slate-500 dark:text-slate-400 group-hover:text-[#FF4A1F]" />
                    <span>Clear</span>
                </button>
            )}

            {/* Filter Toggle Button */}
            <button 
                onClick={onFilterClick}
                className={`h-[32px] px-3 rounded-md border text-[12px] font-bold flex items-center gap-1.5 transition-all outline-none shadow-2xs cursor-pointer ${
                    isFilterOpen || isFiltered
                        ? 'bg-orange-50 dark:bg-[#ff4a1f]/15 border-orange-300 dark:border-orange-500/40 text-[#FF4A1F]' 
                        : 'bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                }`}
            >
                <SlidersHorizontal size={14} className={isFilterOpen || isFiltered ? 'text-[#FF4A1F]' : 'text-slate-500 dark:text-slate-400'} />
                <span>Filters</span>
                {(isFilterOpen || isFiltered) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A1F] ml-0.5" />
                )}
            </button>
        </div>
    );
}
