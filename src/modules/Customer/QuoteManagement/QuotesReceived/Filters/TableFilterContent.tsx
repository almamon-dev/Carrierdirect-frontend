/**
 * Customer Quotes Received Table Filter Content
 * Inline filter bar with Status, Vehicle Type, Rating, Date ranges, and Reset.
 */

import React from 'react';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';

interface TableFilterContentProps {
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    vehicleFilter: string;
    setVehicleFilter: (value: string) => void;
    ratingFilter: string;
    setRatingFilter: (value: string) => void;
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
    onResetFilters: () => void;
}

export const TableFilterContent: React.FC<TableFilterContentProps> = ({
    statusFilter,
    setStatusFilter,
    vehicleFilter,
    setVehicleFilter,
    ratingFilter,
    setRatingFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onResetFilters,
}) => {
    const hasActiveFilters =
        statusFilter !== 'all' ||
        vehicleFilter !== 'all' ||
        ratingFilter !== 'all' ||
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
                        <option value="pending">⏳ Pending Review</option>
                        <option value="negotiating">💬 Negotiating</option>
                        <option value="accepted">🏆 Accepted</option>
                        <option value="rejected">❌ Rejected / Expired</option>
                    </Select>
                </div>

                {/* 2. Vehicle Type */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Vehicle Type
                    </label>
                    <Select value={vehicleFilter} onChange={(val) => setVehicleFilter(val)} showSearch={false}>
                        <option value="all">All Vehicles</option>
                        <option value="covered">Covered Van</option>
                        <option value="refrigerated">Refrigerated Truck</option>
                        <option value="flatbed">Flatbed Truck</option>
                        <option value="box">Box Truck</option>
                        <option value="curtain">Curtain Sider</option>
                    </Select>
                </div>

                {/* 3. Rating */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Supplier Rating
                    </label>
                    <Select value={ratingFilter} onChange={(val) => setRatingFilter(val)} showSearch={false}>
                        <option value="all">All Ratings</option>
                        <option value="4.5">★ 4.5 & Above</option>
                        <option value="4.0">★ 4.0 & Above</option>
                        <option value="3.5">★ 3.5 & Above</option>
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

                {/* 5. End Date & Reset */}
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
