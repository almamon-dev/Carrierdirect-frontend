/**
 * Supplier Quote Requests Filter Bar Component
 * Clean, seamless inline single-row filter bar with 5 items:
 * 1. Priority Level | 2. Status | 3. Vehicle Type | 4. Start Date | 5. End Date
 * No heavy card wrapper - clean inline row.
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
    vehicleFilter: string;
    setVehicleFilter: (val: string) => void;
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
    vehicleFilter,
    setVehicleFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onResetFilters,
}) => {
    const hasActiveFilters =
        priorityFilter !== 'all' ||
        statusFilter !== 'all' ||
        vehicleFilter !== 'all' ||
        Boolean(startDate) ||
        Boolean(endDate);

    return (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 items-end">
                {/* 1. Priority Level */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Priority Level
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
                        <option value="new">🟢 New Requests</option>
                        <option value="viewed">👁️ Viewed</option>
                        <option value="quoted">💼 Quoted (Offers Sent)</option>
                        <option value="booked">🏆 Booked / Won</option>
                        <option value="expired">⏳ Expired / Closed</option>
                    </Select>
                </div>

                {/* 3. Vehicle Type */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Vehicle Type
                    </label>
                    <Select value={vehicleFilter} onChange={(val) => setVehicleFilter(val)} showSearch={false}>
                        <option value="all">All Vehicles</option>
                        <option value="van">Covered Van</option>
                        <option value="truck">Curtain Sider / Truck</option>
                        <option value="refrigerated">Refrigerated Van</option>
                        <option value="trailer">Flatbed Trailer</option>
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
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>

                {/* 5. End Date */}
                <div className="min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                            End Date
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
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>
            </div>
        </div>
    );
};
