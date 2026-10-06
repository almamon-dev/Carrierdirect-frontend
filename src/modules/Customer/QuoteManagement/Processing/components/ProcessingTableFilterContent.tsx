/**
 * Customer Processing Table Filter Content
 * Filter bar tailored for Quote Requests (Priority, Status, Vehicle Type, Quotes Count, Date ranges, Reset).
 */

import React from 'react';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';

interface ProcessingTableFilterContentProps {
    priorityFilter: string;
    setPriorityFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    vehicleFilter: string;
    setVehicleFilter: (value: string) => void;
    quotesFilter?: string;
    setQuotesFilter?: (value: string) => void;
    startDate?: string;
    setStartDate?: (value: string) => void;
    endDate?: string;
    setEndDate?: (value: string) => void;
    onResetFilters?: () => void;
}

export const ProcessingTableFilterContent: React.FC<ProcessingTableFilterContentProps> = ({
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    vehicleFilter,
    setVehicleFilter,
    quotesFilter = 'all',
    setQuotesFilter,
    startDate = '',
    setStartDate,
    endDate = '',
    setEndDate,
    onResetFilters,
}) => {
    const hasActiveFilters =
        priorityFilter !== 'all' ||
        statusFilter !== 'all' ||
        vehicleFilter !== 'all' ||
        quotesFilter !== 'all' ||
        Boolean(startDate) ||
        Boolean(endDate);

    return (
        <div className="w-full font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 items-end">
                {/* 1. Priority */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Priority
                    </label>
                    <Select value={priorityFilter} onChange={(val) => setPriorityFilter(val)} showSearch={false}>
                        <option value="all">All Priorities</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="normal">Normal</option>
                    </Select>
                </div>

                {/* 2. Status */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Status
                    </label>
                    <Select value={statusFilter} onChange={(val) => setStatusFilter(val)} showSearch={false}>
                        <option value="all">All Statuses</option>
                        <option value="in_progress">In Progress</option>
                        <option value="pending">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </Select>
                </div>

                {/* 3. Vehicle Type */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Vehicle Type
                    </label>
                    <Select value={vehicleFilter} onChange={(val) => setVehicleFilter(val)} showSearch={false}>
                        <option value="all">All Vehicles</option>
                        <option value="covered van">Covered Van</option>
                        <option value="refrigerated truck">Refrigerated Truck</option>
                        <option value="flatbed">Flatbed Truck</option>
                        <option value="box truck">Box Truck</option>
                        <option value="curtain sider">Curtain Sider</option>
                    </Select>
                </div>

                {/* 4. Start Date */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Start Date
                    </label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate && setStartDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>

                {/* 5. End Date & Reset */}
                <div className="min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                            End Date
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
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate && setEndDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>
            </div>
        </div>
    );
};
