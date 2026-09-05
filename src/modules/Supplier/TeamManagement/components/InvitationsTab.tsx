import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Mail } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import EmptyState from '@/components/tables/empty-state';
import { InvitationItem } from '../types/team.types';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useToastStore } from '@/stores/useToastStore';
import { apiClient } from '@/lib/axios';

interface InvitationsTabProps {
    headerTabs?: React.ReactNode;
}

export default function InvitationsTab({ headerTabs }: InvitationsTabProps = {}) {
    const showToast = useToastStore((state) => state.showToast);
    const [invitations, setInvitations] = useState<InvitationItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
    const [revokingInvitation, setRevokingInvitation] = useState<InvitationItem | null>(null);

    const fetchInvitations = async () => {
        try {
            setIsLoading(true);
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

    const handleResend = async (row: InvitationItem) => {
        try {
            const targetId = row.rawId || row.id;
            await apiClient.post(`/supplier/team/invitations/${targetId}/resend`);
            setInvitations(invitations.map(inv => inv.id === row.id ? { ...inv, status: 'Pending', dateSent: 'Resent just now' } : inv));
            showToast(`Invitation email resent successfully to ${row.email}!`, 'success');
        } catch (err: any) {
            console.error('Failed to resend invitation:', err);
            showToast(err.response?.data?.message || 'Failed to resend invitation', 'error');
        }
    };

    const handleConfirmRevoke = async () => {
        if (!revokingInvitation) return;
        try {
            const targetId = revokingInvitation.rawId || revokingInvitation.id;
            await apiClient.delete(`/supplier/team/invitations/${targetId}`);
            setInvitations(prev => prev.filter(inv => inv.id !== revokingInvitation.id));
            showToast(`Revoked invitation for ${revokingInvitation.email}`, 'success');
        } catch (err: any) {
            console.error('Failed to revoke invitation:', err);
            showToast(err.response?.data?.message || 'Failed to revoke invitation', 'error');
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
                    className="h-8 text-xs px-2.5 font-semibold cursor-pointer text-slate-700 hover:text-[#FF4A1F] rounded-[3px]"
                    onClick={() => handleResend(row)}
                >
                    <RefreshCw size={12} className="mr-1" /> Resend
                </Button>
            )}
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-slate-400 hover:text-red-600 cursor-pointer rounded-[3px]"
                onClick={() => setRevokingInvitation(row)}
                title="Revoke Invitation"
            >
                <X size={15} />
            </Button>
        </div>
    );

    const filterContent = (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Status Filter</label>
                    <Select value={selectedStatusFilter} onChange={(val) => setSelectedStatusFilter(val)} showSearch={false} options={[
                        { id: 'all', name: 'All Invitations' },
                        { id: 'pending', name: 'Pending' },
                        { id: 'accepted', name: 'Accepted' },
                        { id: 'expired', name: 'Expired' }
                    ]} />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-4 font-sans">
            <DataTable 
                columns={columns} 
                data={filteredInvitations} 
                compact={true}
                searchPlaceholder="Search invitations by email, role..."
                hideViewToggle={false}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                actions={renderActions}
                headerTabs={headerTabs}
                filterContent={filterContent}
                isLoading={isLoading}
                emptyState={
                    <EmptyState
                        icon={Mail}
                        title="No Invitations Found"
                        description="There are currently no active or pending team member invitations."
                    />
                }
            />

            {/* Revoke Invitation Modal */}
            {revokingInvitation && (
                <DeleteConfirmationModal
                    isOpen={Boolean(revokingInvitation)}
                    onClose={() => setRevokingInvitation(null)}
                    onConfirm={handleConfirmRevoke}
                    title="Revoke Invitation"
                    subtitle="Cancel pending team invitation"
                    memberName={revokingInvitation.email}
                    memberEmail={revokingInvitation.email}
                    memberRole={revokingInvitation.role}
                    memberId={revokingInvitation.id}
                    confirmText="Revoke Invitation"
                    warningMessage={`Are you sure you want to revoke the invitation sent to ${revokingInvitation.email}? The invitation link will immediately become invalid.`}
                />
            )}
        </div>
    );
}
