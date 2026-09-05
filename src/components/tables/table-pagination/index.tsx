import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, MoreHorizontal } from 'lucide-react';

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
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
    variant?: 'table' | 'grid';
    perPageOptions?: number[];
    itemLabel?: string;
    perPageLabel?: string;
    className?: string;
}

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
    if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
        return [1, 2, 3, 4, 'ellipsis', total];
    }
    if (current >= total - 2) {
        return [1, 'ellipsis', total - 3, total - 2, total - 1, total];
    }
    return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total];
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
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    variant = 'table',
    perPageOptions,
    itemLabel,
    perPageLabel,
    className = "",
}: TablePaginationProps) {
    const isGrid = variant === 'grid';
    const defaultOptions = isGrid ? [12, 24, 36, 48, 96] : [10, 15, 30, 50, 100];
    const options = perPageOptions || defaultOptions;
    const resolvedItemLabel = itemLabel || (isGrid ? 'items' : 'entries');
    const resolvedPerPageLabel = perPageLabel || (isGrid ? 'Cards per page:' : 'Rows per page:');

    const pageNumbers = totalPages > 1 ? getPageNumbers(currentPage, totalPages) : [];

    const containerClasses = isGrid
        ? `flex flex-col sm:flex-row items-center justify-between gap-2 px-3 py-1.5 bg-white dark:bg-[#12161c] rounded-[3px] border border-[#ebebeb] dark:border-slate-800 shadow-none ${className}`
        : `flex flex-col sm:flex-row items-center justify-between gap-2 px-3 py-1.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181d24] ${className}`;

    return (
        <div className={containerClasses}>
            {/* Left: Items / Entries Info */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>Showing</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                    {total > 0 ? `${fromIdx}–${toIdx}` : '0'}
                </span>
                <span>of</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{total}</span>
                <span>{resolvedItemLabel}</span>
            </div>

            {/* Center: Page Number Buttons (When multiple pages exist) */}
            {totalPages > 1 && onPageChange && (
                <div className="hidden md:flex items-center gap-1">
                    {pageNumbers.map((p, idx) => {
                        if (p === 'ellipsis') {
                            return (
                                <span
                                    key={`ellipsis-${idx}`}
                                    className="w-6 h-7 flex items-center justify-center text-slate-400 dark:text-slate-500 select-none"
                                >
                                    <MoreHorizontal size={13} />
                                </span>
                            );
                        }

                        const isActive = p === currentPage;
                        return (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={`w-7 h-7 flex items-center justify-center text-[11px] font-semibold rounded-[3px] transition-all cursor-pointer ${
                                    isActive
                                        ? 'bg-[#ff4a1f] text-white font-bold shadow-2xs'
                                        : 'bg-slate-50/70 dark:bg-[#1e2329] border border-slate-200/80 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-[#ff4a1f]/50 hover:text-[#ff4a1f] hover:bg-orange-50/40 dark:hover:bg-slate-800'
                                }`}
                                aria-label={`Go to page ${p}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Right: Per page selector & Prev/Next buttons */}
            <div className="flex items-center gap-2.5">
                {/* Per Page Selector */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                        {resolvedPerPageLabel}
                    </span>
                    <div className="relative">
                        <select
                            value={perPage}
                            onChange={(e) => onPerPageChange(Number(e.target.value))}
                            className="h-7 pl-2 pr-5 text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-[#1e2329] border border-slate-200/80 dark:border-slate-700/60 rounded-[3px] shadow-none focus:border-[#ff4a1f] focus:ring-0 outline-none appearance-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                        >
                            {options.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                    </div>
                </div>

                {/* Prev / Next Buttons */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onPrevPage}
                        disabled={!hasPrev}
                        aria-label="Previous page"
                        className="h-7 px-2 flex items-center justify-center gap-1 text-[11px] font-semibold rounded-[3px] border border-slate-200/80 dark:border-slate-700/60 bg-slate-50/50 dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 hover:border-[#ff4a1f]/40 hover:text-[#ff4a1f] hover:bg-orange-50/50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:border-slate-200/80 dark:disabled:hover:border-slate-700/60 disabled:hover:text-slate-700 dark:disabled:hover:text-slate-200 disabled:hover:bg-slate-50/50 dark:disabled:hover:bg-[#1e2329] disabled:cursor-not-allowed transition-all shadow-none active:scale-95 cursor-pointer"
                    >
                        <ChevronLeft size={13} />
                        <span className="hidden sm:inline">Prev</span>
                    </button>
                    <button
                        onClick={onNextPage}
                        disabled={!hasNext}
                        aria-label="Next page"
                        className="h-7 px-2 flex items-center justify-center gap-1 text-[11px] font-semibold rounded-[3px] border border-slate-200/80 dark:border-slate-700/60 bg-slate-50/50 dark:bg-[#1e2329] text-slate-700 dark:text-slate-200 hover:border-[#ff4a1f]/40 hover:text-[#ff4a1f] hover:bg-orange-50/50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:hover:border-slate-200/80 dark:disabled:hover:border-slate-700/60 disabled:hover:text-slate-700 dark:disabled:hover:text-slate-200 disabled:hover:bg-slate-50/50 dark:disabled:hover:bg-[#1e2329] disabled:cursor-not-allowed transition-all shadow-none active:scale-95 cursor-pointer"
                    >
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
}
