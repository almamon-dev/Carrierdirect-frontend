import React, { useState } from 'react';
import { Edit, Trash2, Shield, MoreHorizontal, UserPlus } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

export default function TeamMembersTab() {
    // Dummy Data
    const members = [
        { id: 'EMP-001', name: 'John Doe', avatar: 'J', role: 'Admin', department: 'Operations', designation: 'Operations Manager', email: 'john@abclogistics.com', phone: '+1234567890', status: 'Active', lastLogin: '2026-07-21 09:30 AM' },
        { id: 'EMP-002', name: 'Jane Smith', avatar: 'JS', role: 'Dispatcher', department: 'Operations', designation: 'Senior Dispatcher', email: 'jane@abclogistics.com', phone: '+1234567891', status: 'Active', lastLogin: '2026-07-20 04:15 PM' },
        { id: 'EMP-003', name: 'Mike Ross', avatar: 'M', role: 'Driver', department: 'Fleet', designation: 'Heavy Truck Driver', email: 'mike@abclogistics.com', phone: '+1234567892', status: 'On Leave', lastLogin: '2026-07-15 10:00 AM' },
        { id: 'EMP-004', name: 'Sarah Lee', avatar: 'S', role: 'Warehouse Manager', department: 'Warehouse', designation: 'Warehouse Head', email: 'sarah@abclogistics.com', phone: '+1234567893', status: 'Active', lastLogin: '2026-07-21 08:00 AM' },
    ];

    const columns = [
        { 
            id: 'id', 
            label: 'Employee ID', 
            render: (row: any) => <span className="font-semibold text-slate-800">{row.id}</span> 
        },
        { 
            id: 'name', 
            label: 'Name', 
            render: (row: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {row.avatar}
                    </div>
                    <span className="font-medium text-slate-900">{row.name}</span>
                </div>
            )
        },
        { id: 'role', label: 'Role', render: (row: any) => <span className="text-slate-600">{row.role}</span> },
        { id: 'department', label: 'Department', render: (row: any) => <span className="text-slate-600">{row.department}</span> },
        { id: 'designation', label: 'Designation', render: (row: any) => <span className="text-slate-600">{row.designation}</span> },
        { id: 'email', label: 'Email', render: (row: any) => <span className="text-slate-600">{row.email}</span> },
        { id: 'phone', label: 'Phone', render: (row: any) => <span className="text-slate-600">{row.phone}</span> },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row: any) => (
                <Badge variant="secondary" className={
                    row.status === 'Active' ? 'bg-emerald-50 text-emerald-700' :
                    'bg-amber-50 text-amber-700'
                }>
                    {row.status}
                </Badge>
            )
        },
        { id: 'lastLogin', label: 'Last Login', render: (row: any) => <span className="text-slate-500 whitespace-nowrap">{row.lastLogin}</span> },
        { 
            id: 'actions', 
            label: 'Actions', 
            render: (row: any) => (
                <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-indigo-600">
                        <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-600">
                        <Trash2 size={16} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-0 flex-1 overflow-auto">
                <DataTable 
                    columns={columns} 
                    data={members}
                />
            </div>
    );
}
