/**
 * Supplier Negotiation Filter Bar Component
 * Matches QuoteRequests TableFilterContent style with Priority Level, Status, and Vehicle Type selects.
 */

import React from 'react';
import Select from '@/components/ui/select';

interface TableFilterContentProps {
    priorityFilter?: string;
    setPriorityFilter?: (val: string) => void;
    statusFilter?: string;
    setStatusFilter?: (val: string) => void;
    vehicleFilter?: string;
    setVehicleFilter?: (val: string) => void;
}

export const TableFilterContent: React.FC<TableFilterContentProps> = ({
    priorityFilter = 'all',
    setPriorityFilter,
    statusFilter = 'all',
    setStatusFilter,
    vehicleFilter = 'all',
    setVehicleFilter,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-[#181d24] rounded-lg border border-slate-200/80 dark:border-slate-800 mb-3">
            <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Priority Level</label>
                <Select
                    value={priorityFilter}
                    onChange={(e: any) => setPriorityFilter?.(e?.target?.value ?? e)}
                    showSearch={false}
                >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                </Select>
            </div>
            <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Status</label>
                <Select
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter?.(e?.target?.value ?? e)}
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
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Vehicle Type</label>
                <Select
                    value={vehicleFilter}
                    onChange={(e: any) => setVehicleFilter?.(e?.target?.value ?? e)}
                    showSearch={false}
                >
                    <option value="all">All Vehicles</option>
                    <option value="covered">Covered Van</option>
                    <option value="truck">Open Truck</option>
                    <option value="refrigerated">Refrigerated Van</option>
                    <option value="curtain">Curtain Sider</option>
                </Select>
            </div>
        </div>
    );
};
