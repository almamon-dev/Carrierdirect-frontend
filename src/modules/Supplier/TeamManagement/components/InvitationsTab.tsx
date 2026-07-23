import React, { useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';

export interface InvitationItem {
    id: string;
    email: string;
    role: string;
    department: string;
    dateSent: string;
    status: 'Pending' | 'Accepted' | 'Expired';
    expires: string;
}

export default function InvitationsTab() {
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

    const [invitations, setInvitations] = useState<InvitationItem[]>([
        { id: 'INV-001', email: 'newguy@abclogistics.com', role: 'Driver', department: 'Fleet', dateSent: 'Jul 20, 2026 10:00 AM', status: 'Pending', expires: 'Jul 27, 2026 10:00 AM' },
        { id: 'INV-002', email: 'support@abclogistics.com', role: 'Customer Support', department: 'Support', dateSent: 'Jul 15, 2026 02:00 PM', status: 'Expired', expires: 'Jul 22, 2026 02:00 PM' },
        { id: 'INV-003', email: 'sales@abclogistics.com', role: 'Sales Lead', department: 'Sales', dateSent: 'Jul 21, 2026 09:00 AM', status: 'Accepted', expires: 'Jul 28, 2026 09:00 AM' },
        { id: 'INV-004', email: 'dispatch@abclogistics.com', role: 'Dispatcher', department: 'Operations', dateSent: 'Jul 22, 2026 11:30 AM', status: 'Pending', expires: 'Jul 29, 2026 11:30 AM' },
    ]);

    const handleResend = (id: string) => {
        setInvitations(invitations.map(inv => inv.id === id ? { ...inv, status: 'Pending', dateSent: 'Resent just now' } : inv));
    };

    const handleRevoke = (id: string) => {
        setInvitations(invitations.filter(inv => inv.id !== id));
    };

    const filteredInvitations = invitations.filter(inv => {
        if (selectedStatusFilter === 'all') return true;
        return inv.status.toLowerCase() === selectedStatusFilter.toLowerCase();
    });

    const columns: Column<InvitationItem>[] = [
        { 
            id: 'email', 
            label: 'Email Address', 
            render: (row) => <span className="font-bold text-slate-900">{row.email}</span> 
        },
        { 
            id: 'role', 
            label: 'Assigned Role', 
            render: (row) => <span className="text-xs font-semibold text-slate-800">{row.role}</span> 
        },
        { 
            id: 'dateSent', 
            label: 'Date Sent', 
            render: (row) => <span className="text-[11px] text-slate-500">{row.dateSent}</span> 
        },
        { 
            id: 'expires', 
            label: 'Expires On', 
            render: (row) => <span className="text-[11px] text-slate-500">{row.expires}</span> 
        },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row) => (
                <Badge variant="secondary" className={
                    row.status === 'Pending' ? 'bg-amber-50 text-amber-700 font-semibold' :
                    row.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                    'bg-red-50 text-red-700 font-semibold'
                }>
                    {row.status}
                </Badge>
            )
        }
    ];

    const renderActions = (row: InvitationItem) => (
        <div className="flex items-center justify-end gap-2">
            {(row.status === 'Pending' || row.status === 'Expired') && (
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-xs px-2.5 font-semibold"
                    onClick={() => handleResend(row.id)}
                >
                    <RefreshCw size={12} className="mr-1" /> Resend
                </Button>
            )}
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-red-600"
                onClick={() => handleRevoke(row.id)}
                title="Revoke Invitation"
            >
                <X size={15} />
            </Button>
        </div>
    );

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Status Filter</label>
                <Select value={selectedStatusFilter} onChange={(e) => setSelectedStatusFilter(e.target.value)} showSearch={false}>
                    <option value="all">All Invitations</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="expired">Expired</option>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-0 space-y-5">
            <DataTable 
                columns={columns} 
                data={filteredInvitations} 
                compact={true}
                searchPlaceholder="Search invitations by email, role..."
                hideViewToggle={true}
                actions={renderActions}
                filterContent={filterContent}
            />
        </div>
    );
}
