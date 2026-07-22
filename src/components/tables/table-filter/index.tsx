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
                    className="h-[32px] px-2.5 rounded-md border border-slate-300 text-[12px] font-bold flex items-center gap-1.5 bg-white text-slate-600 hover:bg-orange-50 hover:border-orange-300 hover:text-[#FF4A1F] transition-all outline-none shadow-2xs cursor-pointer group"
                    title="Clear All Filters"
                >
                    <RotateCcw size={13} className="group-hover:rotate-[-45deg] transition-transform text-slate-500 group-hover:text-[#FF4A1F]" />
                    <span>Clear</span>
                </button>
            )}

            {/* Filter Toggle Button */}
            <button 
                onClick={onFilterClick}
                className={`h-[32px] px-3 rounded-md border text-[12px] font-bold flex items-center gap-1.5 transition-all outline-none shadow-2xs cursor-pointer ${
                    isFilterOpen || isFiltered
                        ? 'bg-orange-50 border-orange-300 text-[#FF4A1F]' 
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                }`}
            >
                <SlidersHorizontal size={14} className={isFilterOpen || isFiltered ? 'text-[#FF4A1F]' : 'text-slate-500'} />
                <span>Filters</span>
                {(isFilterOpen || isFiltered) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A1F] ml-0.5" />
                )}
            </button>
        </div>
    );
}
