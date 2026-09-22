import React from 'react';
import Select from '@/components/ui/select';
import { RotateCcw } from 'lucide-react';
import Button from '@/components/ui/button';

interface Props {
    statusFilter: string;
    setStatusFilter: (val: string) => void;
    priorityFilter: string;
    setPriorityFilter: (val: string) => void;
    freightTypeFilter: string;
    setFreightTypeFilter: (val: string) => void;
    onResetFilters: () => void;
}

export const TableFilterContent: React.FC<Props> = ({
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    freightTypeFilter,
    setFreightTypeFilter,
    onResetFilters,
}) => {
    return (
        <div className="space-y-3 p-3 bg-slate-50 dark:bg-[#181d24] rounded-[4px] border border-slate-200/80 dark:border-slate-800 mb-3 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Status Filter */}
                <div>
                    <label className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                        Shipment Status
                    </label>
                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} showSearch={false}>
                        <option value="all">All Statuses</option>
                        <option value="in_transit">In Transit</option>
                        <option value="at_pickup">At Pickup</option>
                        <option value="at_delivery">At Delivery</option>
                        <option value="assigned">Dispatched / Assigned</option>
                        <option value="delivered">Delivered</option>
                    </Select>
                </div>

                {/* Priority Filter */}
                <div>
                    <label className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                        Priority Level
                    </label>
                    <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} showSearch={false}>
                        <option value="all">All Priorities</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Standard">Standard</option>
                        <option value="High Value">High Value</option>
                    </Select>
                </div>

                {/* Freight Type Filter */}
                <div>
                    <label className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-400 mb-1 block">
                        Cargo / Equipment Type
                    </label>
                    <Select value={freightTypeFilter} onChange={(e) => setFreightTypeFilter(e.target.value)} showSearch={false}>
                        <option value="all">All Equipment Types</option>
                        <option value="Temperature Controlled">Temperature Controlled / Reefer</option>
                        <option value="Dry Van">Dry Van</option>
                        <option value="Flatbed">Flatbed</option>
                        <option value="Hazardous / ADR">Hazardous / ADR</option>
                        <option value="General Freight">General Freight</option>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end pt-1">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onResetFilters}
                    className="h-7 px-2.5 text-xs font-semibold flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-red-600 cursor-pointer"
                >
                    <RotateCcw size={12} />
                    <span>Reset Filters</span>
                </Button>
            </div>
        </div>
    );
};
