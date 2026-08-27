import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { InvitationItem } from '../types/team.types';
import { apiClient } from '@/lib/axios';

export default function InvitationsTab() {
    const [invitations, setInvitations] = useState<InvitationItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

    const fetchInvitations = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get('/supplier/team/invitations');
            const raw = res.data?.data?.invitations || res.data?.data || res.data || [];
            const resArray = Array.isArray(raw) ? raw : [];

            const mapped: InvitationItem[] = resArray.map((inv: any) => ({
                id: inv.id ? `INV-${inv.id}` : (inv.code || 'INV-000'),
                rawId: inv.id,
                email: inv.email || 'user@example.com',
                role: inv.role?.name || inv.role || 'Staff Member',
                department: inv.department || 'Operations',
                dateSent: inv.created_at ? new Date(inv.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Recently',
                status: (inv.status === 'accepted' ? 'Accepted' : inv.status === 'expired' ? 'Expired' : 'Pending') as any,
                expires: inv.expires_at ? new Date(inv.expires_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '7 days',
            }));

            setInvitations(mapped);
        } catch (err) {
            console.error('Failed to fetch invitations:', err);
            setInvitations([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvitations();
    }, []);

    const handleResend = async (id: string) => {
        try {
            await apiClient.post(`/supplier/team/invitations/${id}/resend`);
            setInvitations(invitations.map(inv => inv.id === id ? { ...inv, status: 'Pending', dateSent: 'Resent just now' } : inv));
        } catch (err) {
            console.error('Failed to resend invitation:', err);
        }
    };

    const handleRevoke = async (id: string) => {
        try {
            await apiClient.delete(`/supplier/team/invitations/${id}`);
            setInvitations(invitations.filter(inv => inv.id !== id));
        } catch (err) {
            console.error('Failed to revoke invitation:', err);
            setInvitations(invitations.filter(inv => inv.id !== id));
        }
    };

    const filteredInvitations = invitations.filter(inv => {
        if (selectedStatusFilter === 'all') return true;
        return inv.status.toLowerCase() === selectedStatusFilter.toLowerCase();
    });

    const columns: Column<InvitationItem>[] = [
        { 
            id: 'email', 
            label: 'Email Address', 
            render: (row) => <span className="font-bold text-slate-900 dark:text-slate-100">{row.email}</span> 
        },
        { 
            id: 'role', 
            label: 'Assigned Role', 
            render: (row) => <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{row.role}</span> 
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
                    className="h-8 text-xs px-2.5 font-semibold cursor-pointer"
                    onClick={() => handleResend(row.id)}
                >
                    <RefreshCw size={12} className="mr-1" /> Resend
                </Button>
            )}
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-red-600 cursor-pointer"
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
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Status Filter</label>
                <Select value={selectedStatusFilter} onChange={(val) => setSelectedStatusFilter(val)} showSearch={false} options={[
                    { id: 'all', name: 'All Invitations' },
                    { id: 'pending', name: 'Pending' },
                    { id: 'accepted', name: 'Accepted' },
                    { id: 'expired', name: 'Expired' }
                ]} />
            </div>
        </div>
    );

    return (
        <div className="p-0 space-y-5 font-sans">
            <DataTable 
                columns={columns} 
                data={filteredInvitations} 
                compact={true}
                searchPlaceholder="Search invitations by email, role..."
                hideViewToggle={true}
                actions={renderActions}
                filterContent={filterContent}
                isLoading={isLoading}
            />
        </div>
    );
}
