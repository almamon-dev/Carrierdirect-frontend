/**
 * Supplier Negotiation Filter Bar Component
 * Minimal Filters: Status, Last Activity (From / To), and Reset.
 */

import React from "react";
import Select from "@/components/ui/select";
import Input from "@/components/ui/input";
import { RotateCcw, Calendar } from "lucide-react";

interface TableFilterContentProps {
    statusFilter?: string;
    setStatusFilter?: (val: string) => void;
    startDate?: string;
    setStartDate?: (val: string) => void;
    endDate?: string;
    setEndDate?: (val: string) => void;
    onResetFilters?: () => void;
}

export const TableFilterContent: React.FC<TableFilterContentProps> = ({
    statusFilter = "all",
    setStatusFilter,
    startDate = "",
    setStartDate,
    endDate = "",
    setEndDate,
    onResetFilters,
}) => {
    const hasActiveFilters =
        statusFilter !== "all" ||
        Boolean(startDate) ||
        Boolean(endDate);

    return (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                {/* 1. Status Filter */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Status
                    </label>
                    <Select
                        value={statusFilter}
                        onChange={(val: any) => setStatusFilter?.(val)}
                        showSearch={false}
                    >
                        <option value="all">All Statuses</option>
                        <option value="open">💬 Open / Active</option>
                        <option value="counter">🔄 Counter Offers</option>
                        <option value="agreed">🤝 Agreed</option>
                        <option value="booked">📦 Booked</option>
                        <option value="closed">🔒 Closed / Expired</option>
                    </Select>
                </div>

                {/* 2. Last Activity - From */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Last Activity From
                    </label>
                    <div className="relative">
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate?.(e.target.value)}
                            className="h-9 text-xs pl-8"
                        />
                        <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* 3. Last Activity - To & Reset */}
                <div className="min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                            Last Activity To
                        </label>
                        {hasActiveFilters && onResetFilters && (
                            <button
                                type="button"
                                onClick={onResetFilters}
                                className="text-[10.5px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                                title="Reset filters"
                            >
                                <RotateCcw size={10} /> Reset
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate?.(e.target.value)}
                            className="h-9 text-xs pl-8"
                        />
                        <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};
