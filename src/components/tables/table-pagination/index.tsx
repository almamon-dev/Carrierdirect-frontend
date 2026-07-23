import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export interface TablePaginationProps {
    total: number;
    fromIdx?: number;
    toIdx?: number;
    perPage: number;
    onPerPageChange: (perPage: number) => void;
    onPrevPage: () => void;
    onNextPage: () => void;
    hasPrev?: boolean;
    hasNext?: boolean;
}

export default function TablePagination({
    total,
    fromIdx = 0,
    toIdx = 0,
    perPage,
    onPerPageChange,
    onPrevPage,
    onNextPage,
    hasPrev = false,
    hasNext = false,
}: TablePaginationProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-200 bg-slate-50/50">
            {/* Left: Entries Info */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span>Showing</span>
                <span className="font-bold text-slate-800 tabular-nums">
                    {total > 0 ? `${fromIdx}–${toIdx}` : '0'}
                </span>
                <span>of</span>
                <span className="font-bold text-slate-800 tabular-nums">{total}</span>
                <span>entries</span>
            </div>

            {/* Right: Rows selector & Pagination buttons */}
            <div className="flex items-center gap-4">
                {/* Per Page Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">Rows per page:</span>
                    <div className="relative">
                        <select
                            value={perPage}
                            onChange={(e) => onPerPageChange(Number(e.target.value))}
                            className="h-8 pl-3 pr-7 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-md shadow-2xs focus:border-[#ff4a1f] focus:ring-1 focus:ring-[#ff4a1f] outline-none appearance-none cursor-pointer hover:border-slate-400 transition-colors"
                        >
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                        <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* Prev / Next Buttons */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={onPrevPage}
                        disabled={!hasPrev}
                        aria-label="Previous page"
                        className="h-8 px-2.5 flex items-center justify-center gap-1 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:border-[#ff4a1f]/40 hover:text-[#ff4a1f] hover:bg-orange-50/50 disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:text-slate-700 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                        <ChevronLeft size={15} />
                        <span className="hidden sm:inline">Prev</span>
                    </button>
                    <button
                        onClick={onNextPage}
                        disabled={!hasNext}
                        aria-label="Next page"
                        className="h-8 px-2.5 flex items-center justify-center gap-1 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:border-[#ff4a1f]/40 hover:text-[#ff4a1f] hover:bg-orange-50/50 disabled:opacity-40 disabled:hover:border-slate-300 disabled:hover:text-slate-700 disabled:hover:bg-white disabled:cursor-not-allowed transition-all shadow-2xs active:scale-95 cursor-pointer"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={15} />
                    </button>
                </div>
            </div>
        </div>
    );
}
