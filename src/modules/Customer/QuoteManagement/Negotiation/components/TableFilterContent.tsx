/**
 * Customer Negotiation Table Filter Content
 * Matches Supplier TableFilterContent dropdowns for Priority, Status, and Vehicle Type.
 */

import React from 'react';
import Select from '@/components/ui/select';

interface TableFilterContentProps {
    priorityFilter: string;
    setPriorityFilter: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
    vehicleFilter: string;
    setVehicleFilter: (value: string) => void;
}

export const TableFilterContent: React.FC<TableFilterContentProps> = ({
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    vehicleFilter,
    setVehicleFilter,
}) => {
    return (
        <div className="p-3.5 space-y-3 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Priority */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Priority
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
                        <option value="under review">Under Review</option>
                        <option value="counter">Counter Received / Sent</option>
                        <option value="offer submitted">Offer Submitted</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected / Expired</option>
                    </Select>
                </div>

                {/* 3. Vehicle Type */}
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Vehicle Type
                    </label>
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
