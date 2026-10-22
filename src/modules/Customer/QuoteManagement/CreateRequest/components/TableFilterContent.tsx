/**
 * Customer My Requests Filter Bar Component
 * Advanced Filters: Status, Pickup Date (Start & End), Priority, Quotes count
 */

import React from 'react';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';

interface TableFilterContentProps {
    priorityFilter: string;
    setPriorityFilter: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    quotesFilter: string;
    setQuotesFilter: (val: string) => void;
    startDate: string;
    setStartDate: (val: string) => void;
    endDate: string;
    setEndDate: (val: string) => void;
    onResetFilters: () => void;
}

export const TableFilterContent: React.FC<TableFilterContentProps> = ({
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    quotesFilter,
    setQuotesFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onResetFilters,
}) => {
    const hasActiveFilters =
        priorityFilter !== 'all' ||
        statusFilter !== 'all' ||
        quotesFilter !== 'all' ||
        Boolean(startDate) ||
        Boolean(endDate);

    return (
        <div className="w-full font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 items-end">
                {/* 1. Status Filter */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Status
                    </label>
                    <Select value={statusFilter} onChange={(val) => setStatusFilter(val)} showSearch={false}>
                        <option value="all">All Statuses</option>
                        <option value="in_progress">🔵 In Progress</option>
                        <option value="draft">📝 Draft</option>
                        <option value="booked">📦 Booked</option>
                        <option value="completed">🟢 Completed</option>
                        <option value="expired">⏳ Expired</option>
                        <option value="cancelled">🔴 Cancelled</option>
                    </Select>
                </div>

                {/* 2. Pickup Date - From */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Pickup Date From
                    </label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>

                {/* 3. Pickup Date - To */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Pickup Date To
                    </label>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>

                {/* 4. Priority Level */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Priority Level
                    </label>
                    <Select value={priorityFilter} onChange={(val) => setPriorityFilter(val)} showSearch={false}>
                        <option value="all">All Priorities</option>
                        <option value="Urgent">Urgent</option>
                        <option value="High">High</option>
                        <option value="Normal">Normal</option>
                    </Select>
                </div>

                {/* 5. Quotes Received & Reset */}
                <div className="min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                            Quotes Received
                        </label>
                        {hasActiveFilters && (
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
                    <Select value={quotesFilter} onChange={(val) => setQuotesFilter(val)} showSearch={false}>
                        <option value="all">All Quotes</option>
                        <option value="has_quotes">Has Quotes (1+)</option>
                        <option value="no_quotes">No Quotes (0)</option>
                    </Select>
                </div>
            </div>
        </div>
    );
};
