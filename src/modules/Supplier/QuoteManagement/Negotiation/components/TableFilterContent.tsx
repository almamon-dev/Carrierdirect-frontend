/**
 * Supplier Negotiation Filter Bar Component
 * Matches QuoteRequests TableFilterContent style with Priority Level, Status, Vehicle Type, Date ranges, and Reset.
 */

import React from 'react';
import Select from '@/components/ui/select';
import Input from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';

interface TableFilterContentProps {
    priorityFilter?: string;
    setPriorityFilter?: (val: string) => void;
    statusFilter?: string;
    setStatusFilter?: (val: string) => void;
    vehicleFilter?: string;
    setVehicleFilter?: (val: string) => void;
    startDate?: string;
    setStartDate?: (val: string) => void;
    endDate?: string;
    setEndDate?: (val: string) => void;
    onResetFilters?: () => void;
}

export const TableFilterContent: React.FC<TableFilterContentProps> = ({
    priorityFilter = 'all',
    setPriorityFilter,
    statusFilter = 'all',
    setStatusFilter,
    vehicleFilter = 'all',
    setVehicleFilter,
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
        Boolean(startDate) ||
        Boolean(endDate);

    return (
        <div className="w-full font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 items-end">
                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Priority Level</label>
                    <Select
                        value={priorityFilter}
                        onChange={(val: any) => setPriorityFilter?.(val)}
                        showSearch={false}
                    >
                        <option value="all">All Priorities</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="normal">Normal</option>
                    </Select>
                </div>
                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Status</label>
                    <Select
                        value={statusFilter}
                        onChange={(val: any) => setStatusFilter?.(val)}
                        showSearch={false}
                    >
                        <option value="all">All Statuses</option>
                        <option value="counter received">Counter Received</option>
                        <option value="counter offer sent">Counter Offer Sent</option>
                        <option value="under review">Under Review</option>
                        <option value="accepted">Accepted</option>
                        <option value="negotiation">Negotiation</option>
                    </Select>
                </div>
                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Vehicle Type</label>
                    <Select
                        value={vehicleFilter}
                        onChange={(val: any) => setVehicleFilter?.(val)}
                        showSearch={false}
                    >
                        <option value="all">All Vehicles</option>
                        <option value="covered">Covered Van</option>
                        <option value="truck">Open Truck</option>
                        <option value="refrigerated">Refrigerated Van</option>
                        <option value="curtain">Curtain Sider</option>
                    </Select>
                </div>
                <div>
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Start Date</label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate?.(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">End Date</label>
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
                        onChange={(e) => setEndDate?.(e.target.value)}
                        className="h-9 text-xs"
                    />
                </div>
            </div>
        </div>
    );
};
