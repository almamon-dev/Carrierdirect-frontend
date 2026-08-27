/**
 * Supplier Quote Requests Filter Bar Component
 * Provides select filters for Priority Level, Status, and Vehicle Type.
 */

import React from 'react';
import Select from '@/components/ui/select';

export const TableFilterContent: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-[#181d24] rounded-lg border border-slate-200/80 dark:border-slate-800 mb-3">
            <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Priority Level</label>
                <Select value="all" showSearch={false}>
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                </Select>
            </div>
            <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Status</label>
                <Select value="all" showSearch={false}>
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </Select>
            </div>
            <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Vehicle Type</label>
                <Select value="all" showSearch={false}>
                    <option value="all">All Vehicles</option>
                    <option value="covered_van">Covered Van</option>
                    <option value="open_truck">Open Truck</option>
                    <option value="refrigerated">Refrigerated Van</option>
                </Select>
            </div>
        </div>
    );
};
