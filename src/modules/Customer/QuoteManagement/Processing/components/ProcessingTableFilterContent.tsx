/**
 * Customer Open Requests Table Filter Content
 * Advanced Filters: Pickup Date (Start & End), Location, Status, Vehicle Type
 */

import React from 'react';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import { RotateCcw, MapPin } from 'lucide-react';

interface ProcessingTableFilterContentProps {
    priorityFilter: string;
    setPriorityFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    vehicleFilter: string;
    setVehicleFilter: (value: string) => void;
    locationFilter?: string;
    setLocationFilter?: (value: string) => void;
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
    locationFilter = '',
    setLocationFilter,
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
        Boolean(locationFilter) ||
        Boolean(startDate) ||
        Boolean(endDate);

    return (
        <div className="w-full font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 items-end">
                {/* 1. Location Filter */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Location
                    </label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="City, Country, or Region"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter && setLocationFilter(e.target.value)}
                            className="h-9 text-xs pl-8"
                        />
                        <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* 2. Pickup Date - From */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Pickup Date From
                    </label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate && setStartDate(e.target.value)}
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
                        onChange={(e) => setEndDate && setEndDate(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>

                {/* 4. Priority */}
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

                {/* 5. Vehicle Type & Reset */}
                <div className="min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                            Vehicle Type
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
                    <Select value={vehicleFilter} onChange={(val) => setVehicleFilter(val)} showSearch={false}>
                        <option value="all">All Vehicles</option>
                        <option value="covered van">Covered Van</option>
                        <option value="refrigerated truck">Refrigerated Truck</option>
                        <option value="flatbed">Flatbed Truck</option>
                        <option value="box truck">Box Truck</option>
                        <option value="curtain sider">Curtain Sider</option>
                    </Select>
                </div>
            </div>
        </div>
    );
};
