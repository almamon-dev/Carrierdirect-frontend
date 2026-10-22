import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import DataTable from '@/components/tables/data-table';

const HISTORY_DATA = [
    { id: 'ACT-991', date: 'Jul 21, 2026 09:30 AM', action: 'Added Exception', details: 'Marked Jul 21 as Afternoon Only.', user: 'Admin' },
    { id: 'ACT-990', date: 'Jul 20, 2026 04:15 PM', action: 'System Update', details: 'Jul 20 automatically marked as Partial (Job Overlap).', user: 'System' },
    { id: 'ACT-989', date: 'Jul 15, 2026 11:00 AM', action: 'System Update', details: 'Jul 15 and 16 marked Fully Booked due to max capacity.', user: 'System' },
    { id: 'ACT-988', date: 'Jul 01, 2026 10:00 AM', action: 'Added Exception', details: 'Marked Jul 4 as Holiday.', user: 'Admin' },
    { id: 'ACT-987', date: 'Jun 28, 2026 02:20 PM', action: 'Schedule Changed', details: 'Updated standard working hours for Fridays.', user: 'Admin' },
    { id: 'ACT-986', date: 'Jun 25, 2026 09:10 AM', action: 'System Update', details: 'Cleared expired exceptions for previous month.', user: 'System' },
];

const HISTORY_COLUMNS = [
    { id: 'date', label: 'Date & Time', render: (row: any) => <span className="text-[12px] font-medium text-slate-700">{row.date}</span> },
    { id: 'action', label: 'Action Type', render: (row: any) => <StatusBadge status={row.action} /> },
    { id: 'details', label: 'Details', render: (row: any) => <span className="text-[12px] text-slate-600">{row.details}</span> },
    { id: 'user', label: 'Initiated By', render: (row: any) => <span className="text-[12px] font-semibold text-slate-800">{row.user}</span> },
];

export const CalendarAuditLog: React.FC = () => {
    return (
        <Card className="flex flex-col shadow-sm border-slate-200">
            <CardHeader className="border-b border-slate-100 py-2 px-3">
                <CardTitle className="text-[13px] flex items-center justify-between w-full">
                    <span>Availability Audit Log</span>
                    <Button variant="ghost" className="h-6 text-[11px] font-bold text-brand px-2 py-0 hover:bg-brand-light">
                        See All
                    </Button>
                </CardTitle>
            </CardHeader>
            <div className="p-0 border-t border-slate-100">
                <DataTable
                    compact={true}
                    columns={HISTORY_COLUMNS}
                    data={HISTORY_DATA.slice(0, 6)}
                    hideViewToggle={true}
                    hidePagination={true}
                    searchPlaceholder="Search audit log..."
                />
            </div>
        </Card>
    );
};
