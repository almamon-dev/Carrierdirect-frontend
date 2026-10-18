import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { InvitationItem } from '../types/team.types';

export function useInvitations() {
    const showToast = useToastStore((state) => state.showToast);
    const [invitations, setInvitations] = useState<InvitationItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
    const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
    const [revokingInvitation, setRevokingInvitation] = useState<InvitationItem | null>(null);

    const fetchInvitations = async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get('/supplier/team/invitations');
            const raw = res.data?.data?.invitations || res.data?.data || res.data || [];
            const resArray = Array.isArray(raw) ? raw : [];

            const mapped: InvitationItem[] = resArray.map((inv: any, idx: number) => {
                const rawRole = inv.role?.name || inv.role || '-';
                const dept = inv.department || (
                    rawRole.toLowerCase().includes('fleet') || rawRole.toLowerCase().includes('driver') ? 'Fleet & Drivers' :
                    rawRole.toLowerCase().includes('dispatch') || rawRole.toLowerCase().includes('operat') ? 'Operations & Dispatch' :
                    rawRole.toLowerCase().includes('support') || rawRole.toLowerCase().includes('sales') ? 'Customer Support & Sales' :
                    rawRole.toLowerCase().includes('finan') ? 'Finance & Accounts' : 'Operations & Dispatch'
                );

                const dateSentStr = inv.created_at 
                    ? new Date(inv.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                    : 'Recently';

                const expiresStr = inv.expires_at 
                    ? new Date(inv.expires_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                    : 'In 7 days';

                return {
                    id: inv.id ? `INV-${String(inv.id).padStart(3, '0')}` : `INV-${String(idx + 1).padStart(3, '0')}`,
                    rawId: inv.id || idx + 1,
                    email: inv.email || 'user@example.com',
                    role: rawRole,
                    department: dept,
                    dateSent: dateSentStr,
                    status: (inv.status === 'accepted' ? 'Accepted' : inv.status === 'expired' ? 'Expired' : 'Pending') as any,
                    expires: expiresStr,
                };
            });

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
            setInvitations(prev => prev.map(inv => inv.id === row.id ? { ...inv, status: 'Pending', dateSent: 'Resent just now' } : inv));
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

    const handleResetFilters = () => {
        setSelectedStatusFilter('all');
        setSelectedDeptFilter('all');
    };

    const isFiltered = selectedStatusFilter !== 'all' || selectedDeptFilter !== 'all';

    const filteredInvitations = useMemo(() => {
        return invitations.filter(inv => {
            if (selectedStatusFilter !== 'all' && inv.status.toLowerCase() !== selectedStatusFilter.toLowerCase()) {
                return false;
            }
            if (selectedDeptFilter !== 'all' && (inv.department || '').toLowerCase() !== selectedDeptFilter.toLowerCase()) {
                return false;
            }
            return true;
        });
    }, [invitations, selectedStatusFilter, selectedDeptFilter]);

    return {
        invitations,
        filteredInvitations,
        isLoading,
        selectedStatusFilter,
        setSelectedStatusFilter,
        selectedDeptFilter,
        setSelectedDeptFilter,
        revokingInvitation,
        setRevokingInvitation,
        handleResend,
        handleConfirmRevoke,
        handleResetFilters,
        isFiltered,
    };
}
