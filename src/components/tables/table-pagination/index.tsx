import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        <div className="flex items-center justify-end gap-6 px-6 py-3 border-t border-[#ebebeb] bg-white">
            <div className="flex items-center gap-2">
                <div className="w-[75px]">
                    <select
                        value={perPage}
                        onChange={(e) => onPerPageChange(Number(e.target.value))}
                        className="w-full h-[30px] px-2 text-[12px] border border-[#d1d1d1] rounded-[3px] focus:border-[#008060] focus:ring-1 focus:ring-[#008060] outline-none"
                    >
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-[12px] text-[#081621] font-bold tabular-nums">
                    {total > 0 ? `${fromIdx} - ${toIdx} of ${total}` : '0 - 0'}
                </span>

                <div className="flex gap-1">
                    <button
                        onClick={onPrevPage}
                        disabled={!hasPrev}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-[#d1d1d1] text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-[0_1px_0_rgba(0,0,0,0.05)]"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={onNextPage}
                        disabled={!hasNext}
                        className="w-7 h-7 flex items-center justify-center rounded-[2px] border border-[#d1d1d1] text-[#081621] hover:border-[#008060] hover:text-[#008060] disabled:opacity-30 disabled:cursor-not-allowed transition-all bg-white shadow-[0_1px_0_rgba(0,0,0,0.05)]"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
