import React, { useState } from 'react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';

export interface ActivityLogItem {
    id: number;
    user: string;
    action: string;
    target: string;
    category: string;
    time: string;
}

export default function ActivityLogsTab() {
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
    const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all');

    const logs: ActivityLogItem[] = [
        { id: 1, user: 'John Doe', action: 'Accepted quote offer', target: 'QT-8822', category: 'Quotes', time: '10:30 AM, Today' },
        { id: 2, user: 'Jane Smith', action: 'Assigned heavy truck driver to order', target: 'ORD-1023', category: 'Dispatch', time: '09:15 AM, Today' },
        { id: 3, user: 'Sarah Lee', action: 'Updated warehouse dispatch roster', target: 'WH-East', category: 'Warehouse', time: 'Yesterday, 04:30 PM' },
        { id: 4, user: 'John Doe', action: 'Logged into supplier portal', target: 'Session IP 192.168.1.45', category: 'Security', time: 'Yesterday, 09:00 AM' },
        { id: 5, user: 'Mike Ross', action: 'Updated security password & 2FA', target: 'User Profile Security', category: 'Security', time: 'Jul 15, 10:00 AM' },
        { id: 6, user: 'Alex Rivera', action: 'Exported quarterly payout statement', target: 'FIN-2026-Q2', category: 'Finance', time: 'Jul 12, 11:45 AM' },
        { id: 7, user: 'Admin User', action: 'Updated Company CMR Insurance Policy', target: 'Company Profile Settings', category: 'Settings', time: 'Jul 10, 02:00 PM' },
    ];

    const filteredLogs = logs.filter(log => {
        const matchesCategory = selectedCategoryFilter === 'all' || log.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
        const matchesUser = selectedUserFilter === 'all' || log.user.toLowerCase().includes(selectedUserFilter.toLowerCase());
        return matchesCategory && matchesUser;
    });

    const columns: Column<ActivityLogItem>[] = [
        { 
            id: 'user', 
            label: 'Staff Member', 
            render: (row) => <span className="font-bold text-slate-900">{row.user}</span> 
        },
        { 
            id: 'action', 
            label: 'Action Performed', 
            render: (row) => <span className="text-xs font-semibold text-slate-800">{row.action}</span> 
        },
        { 
            id: 'target', 
            label: 'Target / Item', 
            render: (row) => <span className="font-bold text-[#ff4a1f]">{row.target}</span> 
        },
        { 
            id: 'category', 
            label: 'Category', 
            render: (row) => (
                <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-semibold">
                    {row.category}
                </Badge>
            ) 
        },
        { 
            id: 'time', 
            label: 'Timestamp', 
            render: (row) => <span className="text-[11px] font-semibold text-slate-500">{row.time}</span> 
        }
    ];

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Category Filter</label>
                <Select value={selectedCategoryFilter} onChange={(e) => setSelectedCategoryFilter(e.target.value)} showSearch={false}>
                    <option value="all">All Categories</option>
                    <option value="quotes">Quotes</option>
                    <option value="dispatch">Dispatch</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="security">Security</option>
                    <option value="finance">Finance</option>
                </Select>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Staff Filter</label>
                <Select value={selectedUserFilter} onChange={(e) => setSelectedUserFilter(e.target.value)} showSearch={false}>
                    <option value="all">All Staff</option>
                    <option value="john">John Doe</option>
                    <option value="jane">Jane Smith</option>
                    <option value="sarah">Sarah Lee</option>
                    <option value="mike">Mike Ross</option>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-0 space-y-5">
            <DataTable 
                columns={columns} 
                data={filteredLogs} 
                compact={true}
                searchPlaceholder="Search activity logs by user, action, target..."
                hideViewToggle={true}
                filterContent={filterContent}
            />
        </div>
    );
}
