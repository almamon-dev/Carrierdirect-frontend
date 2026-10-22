import React from 'react';
import Select from '@/components/ui/select';
import { RotateCcw } from 'lucide-react';

interface TrackBidsFilterContentProps {
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    vehicleFilter: string;
    setVehicleFilter: (val: string) => void;
    ratingFilter: string;
    setRatingFilter: (val: string) => void;
    sortBy: string;
    setSortBy: (val: string) => void;
    onResetFilters: () => void;
}

const extractVal = (val: any): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
        if (val.target && val.target.value !== undefined) return String(val.target.value);
        if (val.value !== undefined) return String(val.value);
        if (val.id !== undefined) return String(val.id);
    }
    return String(val);
};

export const TrackBidsFilterContent: React.FC<TrackBidsFilterContentProps> = ({
    statusFilter,
    setStatusFilter,
    vehicleFilter,
    setVehicleFilter,
    ratingFilter,
    setRatingFilter,
    sortBy,
    setSortBy,
    onResetFilters,
}) => {
    const hasActiveFilters =
        statusFilter !== 'all' ||
        vehicleFilter !== 'all' ||
        ratingFilter !== 'all' ||
        sortBy !== 'lowest_price';

    return (
        <div className="w-full font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5 items-end">
                {/* 1. Sort By */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Sort Offers By
                    </label>
                    <Select value={sortBy} onChange={(val) => setSortBy(extractVal(val))} showSearch={false}>
                        <option value="lowest_price">Price: Low to High</option>
                        <option value="highest_price">Price: High to Low</option>
                        <option value="top_rated">Top Rated Carrier</option>
                        <option value="fastest">Fastest Transit</option>
                        <option value="newest">Newest First</option>
                    </Select>
                </div>

                {/* 2. Status */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Status
                    </label>
                    <Select value={statusFilter} onChange={(val) => setStatusFilter(extractVal(val))} showSearch={false}>
                        <option value="all">All Statuses</option>
                        <option value="pending">🟡 Pending Review</option>
                        <option value="negotiating">🟣 Negotiating</option>
                        <option value="accepted">🟢 Accepted</option>
                        <option value="rejected">🔴 Declined</option>
                    </Select>
                </div>

                {/* 3. Vehicle Type */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Vehicle Type
                    </label>
                    <Select value={vehicleFilter} onChange={(val) => setVehicleFilter(extractVal(val))} showSearch={false}>
                        <option value="all">All Vehicles</option>
                        <option value="cargo van">Cargo Van</option>
                        <option value="covered van">Covered Van</option>
                        <option value="box truck">Box Truck</option>
                        <option value="flatbed">Flatbed</option>
                        <option value="reefer">Reefer</option>
                    </Select>
                </div>

                {/* 4. Carrier Rating */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Carrier Rating
                    </label>
                    <Select value={ratingFilter} onChange={(val) => setRatingFilter(extractVal(val))} showSearch={false}>
                        <option value="all">All Ratings</option>
                        <option value="4.8">★ 4.8 & Above</option>
                        <option value="4.5">★ 4.5 & Above</option>
                        <option value="4.0">★ 4.0 & Above</option>
                    </Select>
                </div>

                {/* 5. Reset Action */}
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={onResetFilters}
                        disabled={!hasActiveFilters}
                        className={`h-9 px-3 w-full rounded-[4px] border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                            hasActiveFilters
                                ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        }`}
                    >
                        <RotateCcw size={13} />
                        <span>Reset Filters</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
