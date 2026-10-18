import React from 'react';
import Select from '@/components/ui/select';
import { RotateCcw } from 'lucide-react';

interface DriverFilterContentProps {
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    vehicleFilter: string;
    setVehicleFilter: (val: string) => void;
    areaFilter: string;
    setAreaFilter: (val: string) => void;
    onResetFilters: () => void;
}

export const DriverFilterContent: React.FC<DriverFilterContentProps> = ({
    statusFilter,
    setStatusFilter,
    vehicleFilter,
    setVehicleFilter,
    areaFilter,
    setAreaFilter,
    onResetFilters,
}) => {
    const hasActiveFilters =
        statusFilter !== 'all' ||
        vehicleFilter !== 'all' ||
        areaFilter !== 'all';

    return (
        <div className="w-full font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Availability Status
                    </label>
                    <Select
                        value={statusFilter}
                        onChange={(val: any) => setStatusFilter(val)}
                        showSearch={false}
                    >
                        <option value="all">All Statuses</option>
                        <option value="Available">Available</option>
                        <option value="On Job">On Job</option>
                        <option value="Unavailable">Unavailable</option>
                    </Select>
                </div>

                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Assigned Vehicle
                    </label>
                    <Select
                        value={vehicleFilter}
                        onChange={(val: any) => setVehicleFilter(val)}
                        showSearch={false}
                    >
                        <option value="all">All Vehicles</option>
                        <option value="assigned">Vehicle Assigned</option>
                        <option value="unassigned">No Vehicle Assigned</option>
                    </Select>
                </div>

                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Service Area
                    </label>
                    <Select
                        value={areaFilter}
                        onChange={(val: any) => setAreaFilter(val)}
                        showSearch={false}
                    >
                        <option value="all">All Service Areas</option>
                        <option value="assigned">Service Area Assigned</option>
                        <option value="unassigned">No Area Assigned</option>
                    </Select>
                </div>

                <div className="flex items-center justify-end">
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onResetFilters}
                            className="h-9 px-3 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-[4px] flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Reset all filters"
                        >
                            <RotateCcw size={12} />
                            <span>Reset Filters</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DriverFilterContent;
