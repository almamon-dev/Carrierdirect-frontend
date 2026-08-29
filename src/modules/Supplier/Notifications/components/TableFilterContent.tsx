/**
 * TableFilterContent Component
 * Provides filter dropdowns for Category, Status, and Priority level.
 */

import React from 'react';
import Select from '@/components/ui/select';

interface TableFilterContentProps {
    categoryFilter: string;
    setCategoryFilter: (val: string) => void;
    statusFilter: string;
    setStatusFilter: (val: string) => void;
}

export const TableFilterContent: React.FC<TableFilterContentProps> = ({
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-[#181d24] rounded-[3px] border border-slate-200/80 dark:border-slate-800 mb-3">
            <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Category Type</label>
                <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} showSearch={false}>
                    <option value="all">All Categories</option>
                    <option value="quote">Quotes</option>
                    <option value="order">Orders</option>
                    <option value="message">Messages</option>
                    <option value="finance">Finance</option>
                    <option value="system">System Alerts</option>
                </Select>
            </div>
            <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Read Status</label>
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} showSearch={false}>
                    <option value="all">All Statuses</option>
                    <option value="unread">Unread Only</option>
                    <option value="read">Read Only</option>
                </Select>
            </div>
        </div>
    );
};
