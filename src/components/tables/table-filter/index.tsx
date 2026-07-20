import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

export interface TableFilterProps {
    onFilterClick?: () => void;
    onResetClick?: () => void;
    className?: string;
}

export default function TableFilter({ onFilterClick, onResetClick, className = "" }: TableFilterProps) {
    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <button 
                onClick={onFilterClick}
                className="h-[32px] px-3 rounded-[3px] border border-[#d1d1d1] text-[12px] font-bold flex items-center gap-1.5 bg-white text-[#202223] hover:bg-[#f6f6f7] transition-all outline-none shadow-sm"
            >
                <SlidersHorizontal size={14} /> Filters
            </button>
            <button 
                onClick={onResetClick}
                className="h-[32px] w-[32px] flex items-center justify-center bg-white border border-[#d1d1d1] text-[#6d7175] rounded-[3px] hover:border-[#008060] hover:text-[#008060] transition-all group outline-none shadow-sm"
                title="Reset Filters"
            >
                <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-transform" />
            </button>
        </div>
    );
}
