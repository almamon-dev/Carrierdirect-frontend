import React from 'react';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface PODTableFilterContentProps {
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

export const PODTableFilterContent: React.FC<PODTableFilterContentProps> = ({
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
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 font-sans">
            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    POD Status
                </label>
                <Select
                    size="sm"
                    value={statusFilter}
                    onChange={(val) => {
                        const v = typeof val === 'object' && val?.target ? val.target.value : val;
                        setStatusFilter(v);
                    }}
                    showSearch={false}
                    placeholder="All POD Statuses"
                >
                    <option value="all">All Statuses</option>
                    <option value="needs_upload">Needs Upload</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </Select>
            </div>

            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Vehicle Type
                </label>
                <Select
                    size="sm"
                    value={vehicleFilter}
                    onChange={(val) => {
                        const v = typeof val === 'object' && val?.target ? val.target.value : val;
                        setVehicleFilter(v);
                    }}
                    showSearch={false}
                    placeholder="All Vehicles"
                >
                    <option value="all">All Vehicles</option>
                    <option value="Covered Van">Covered Van</option>
                    <option value="Flatbed">Flatbed Truck</option>
                    <option value="Trailer">Trailer (40ft)</option>
                    <option value="Container">Container</option>
                    <option value="Refrigerated">Refrigerated</option>
                </Select>
            </div>

            <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Date From
                </label>
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-[30px] text-xs py-1"
                />
            </div>

            <div className="flex items-end gap-2">
                <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Date To
                    </label>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-[30px] text-xs py-1"
                    />
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onResetFilters}
                    className="h-[30px] px-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 flex items-center gap-1 shrink-0 cursor-pointer"
                    title="Reset Filters"
                >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                </Button>
            </div>
        </div>
    );
};

export default PODTableFilterContent;
