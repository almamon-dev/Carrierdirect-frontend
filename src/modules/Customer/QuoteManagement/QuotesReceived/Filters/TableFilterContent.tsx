const extractFilterVal = (val: any): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
        if (val.target && val.target.value !== undefined) return String(val.target.value);
        if (val.value !== undefined) return String(val.value);
        if (val.id !== undefined) return String(val.id);
    }
    return String(val);
};

/**
 * Customer Quotes Received Table Filter Content
 * Advanced Filters: Supplier, Price Range (Min/Max), Status, Vehicle Type, and Reset.
 */

import React from "react";
import Select from "@/components/ui/select";
import Input from "@/components/ui/input";
import { RotateCcw, User, Euro } from "lucide-react";

interface TableFilterContentProps {
    supplierFilter?: string;
    setSupplierFilter?: (value: string) => void;
    minPrice?: string;
    setMinPrice?: (value: string) => void;
    maxPrice?: string;
    setMaxPrice?: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    vehicleFilter: string;
    setVehicleFilter: (value: string) => void;
    ratingFilter?: string;
    setRatingFilter?: (value: string) => void;
    startDate?: string;
    setStartDate?: (value: string) => void;
    endDate?: string;
    setEndDate?: (value: string) => void;
    onResetFilters: () => void;
}

export const TableFilterContent: React.FC<TableFilterContentProps> = ({
    supplierFilter = "",
    setSupplierFilter,
    minPrice = "",
    setMinPrice,
    maxPrice = "",
    setMaxPrice,
    statusFilter,
    setStatusFilter,
    vehicleFilter,
    setVehicleFilter,
    onResetFilters,
}) => {
    const hasActiveFilters =
        Boolean(supplierFilter) ||
        Boolean(minPrice) ||
        Boolean(maxPrice) ||
        statusFilter !== "all" ||
        vehicleFilter !== "all";

    return (
        <div className="w-full font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 items-end">
                {/* 1. Supplier Filter */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Supplier
                    </label>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Carrier or supplier name..."
                            value={supplierFilter}
                            onChange={(e) => setSupplierFilter && setSupplierFilter(e.target.value)}
                            className="h-9 text-xs pl-8"
                        />
                        <User size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* 2. Price Range - Min Price */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Min Price (€)
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            min="0"
                            placeholder="Min €"
                            value={minPrice}
                            onChange={(e) => setMinPrice && setMinPrice(e.target.value)}
                            className="h-9 text-xs pl-7"
                        />
                        <Euro size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* 3. Price Range - Max Price */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Max Price (€)
                    </label>
                    <div className="relative">
                        <Input
                            type="number"
                            min="0"
                            placeholder="Max €"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice && setMaxPrice(e.target.value)}
                            className="h-9 text-xs pl-7"
                        />
                        <Euro size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* 4. Status Filter */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Status
                    </label>
                    <Select value={statusFilter} onChange={(val) => setStatusFilter(extractFilterVal(val))} showSearch={false}>
                        <option value="all">All Statuses</option>
                        <option value="pending">⏳ Pending Review</option>
                        <option value="negotiat">💬 Negotiating</option>
                        <option value="accept">🏆 Accepted</option>
                        <option value="reject">❌ Rejected / Expired</option>
                    </Select>
                </div>

                {/* 5. Vehicle Type & Reset */}
                <div className="min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                            Vehicle Type
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
                    <Select value={vehicleFilter} onChange={(val) => setVehicleFilter(extractFilterVal(val))} showSearch={false}>
                        <option value="all">All Vehicles</option>
                        <option value="covered">Covered Van</option>
                        <option value="refrigerated">Refrigerated Truck</option>
                        <option value="flatbed">Flatbed Truck</option>
                        <option value="box">Box Truck</option>
                        <option value="curtain">Curtain Sider</option>
                    </Select>
                </div>
            </div>
        </div>
    );
};
