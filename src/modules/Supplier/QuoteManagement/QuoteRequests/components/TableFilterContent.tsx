/**
 * Supplier Available Requests Filter Component
 * Minimal Filters: Location, Pickup Date (Start & End), and Reset.
 */

import React from "react";
import Input from "@/components/ui/input";
import { RotateCcw, MapPin, Calendar } from "lucide-react";

interface TableFilterContentProps {
    locationFilter?: string;
    setLocationFilter?: (val: string) => void;
    startDate: string;
    setStartDate: (val: string) => void;
    endDate: string;
    setEndDate: (val: string) => void;
    onResetFilters: () => void;
}

export const TableFilterContent: React.FC<TableFilterContentProps> = ({
    locationFilter = "",
    setLocationFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onResetFilters,
}) => {
    const hasActiveFilters = Boolean(locationFilter) || Boolean(startDate) || Boolean(endDate);

    return (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                {/* 1. Location */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Location
                    </label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="City, state, country, or postal code..."
                            value={locationFilter}
                            onChange={(e) => setLocationFilter?.(e.target.value)}
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
                    <div className="relative">
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="h-9 text-xs pl-8"
                        />
                        <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* 3. Pickup Date - To & Reset */}
                <div className="min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                            Pickup Date To
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
                    <div className="relative">
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="h-9 text-xs pl-8"
                        />
                        <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};
