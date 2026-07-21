import React from 'react';
import { Mail, RefreshCw, X, UserPlus } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';

export default function InvitationsTab() {
    const invitations = [
        { id: 'INV-001', email: 'newguy@abclogistics.com', role: 'Driver', dateSent: '2026-07-20 10:00 AM', status: 'Pending', expires: '2026-07-27 10:00 AM' },
        { id: 'INV-002', email: 'support@abclogistics.com', role: 'Customer Support', dateSent: '2026-07-15 02:00 PM', status: 'Expired', expires: '2026-07-22 02:00 PM' },
        { id: 'INV-003', email: 'sales@abclogistics.com', role: 'Sales', dateSent: '2026-07-21 09:00 AM', status: 'Accepted', expires: '2026-07-28 09:00 AM' },
    ];

    const columns = [
        { id: 'email', label: 'Email Address', render: (row: any) => <span className="font-medium text-slate-800">{row.email}</span> },
        { id: 'role', label: 'Assigned Role', render: (row: any) => <span className="text-slate-600">{row.role}</span> },
        { id: 'dateSent', label: 'Date Sent', render: (row: any) => <span className="text-slate-600">{row.dateSent}</span> },
        { id: 'expires', label: 'Expires On', render: (row: any) => <span className="text-slate-500">{row.expires}</span> },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row: any) => {
                let badgeClass = '';
                if(row.status === 'Pending') badgeClass = 'bg-amber-50 text-amber-700';
                else if(row.status === 'Accepted') badgeClass = 'bg-emerald-50 text-emerald-700';
                else if(row.status === 'Expired') badgeClass = 'bg-red-50 text-red-700';

                return (
                    <Badge variant="secondary" className={badgeClass}>
                        {row.status}
                    </Badge>
                );
            }
        },
        { 
            id: 'actions', 
            label: 'Actions', 
            render: (row: any) => (
                <div className="flex items-center justify-end gap-2">
                    {(row.status === 'Pending' || row.status === 'Expired') && (
                        <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                            Resend
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-600">
                        <X size={16} />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="p-0 flex-1 overflow-auto">
            <DataTable 
                columns={columns} 
                data={invitations}
            />
        </div>
    );
}
