import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamMember } from '../types/team.types';
import { useToastStore } from '@/stores/useToastStore';
import { apiClient } from '@/lib/axios';

export function useTeamMembers() {
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedDept, setSelectedDept] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [blockingMember, setBlockingMember] = useState<TeamMember | null>(null);
    const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);

    const fetchMembers = async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get('/supplier/team/members');
            const list = res.data?.data?.members || res.data?.data || res.data || [];

            const mapped: TeamMember[] = (Array.isArray(list) ? list : []).map((m: any) => {
                const isBlocked = Boolean(m.is_blocked || m.status === 'blocked');
                const rawStatus = m.status || (isBlocked ? 'Blocked' : 'Active');
                const statusDisplay = isBlocked ? 'Blocked' : rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

                return {
                    id: m.employee_id || `EMP-${m.id}`,
                    rawId: m.id,
                    name: m.name || `${m.first_name || ''} ${m.last_name || ''}`.trim() || 'Team Member',
                    email: m.email || '',
                    phone: m.phone || m.phone_number || '-',
                    role: m.role?.name || m.role || '-',
                    designation: m.designation || m.role?.name || m.role || '-',
                    department: m.department || 'Operations & Dispatch',
                    status: statusDisplay as any,
                    isBlocked,
                    blockReason: m.block_reason || undefined,
                    blockedAt: m.blocked_at || undefined,
                    joinDate: m.created_at ? new Date(m.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
                    lastLogin: m.last_active_at ? new Date(m.last_active_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Recently',
                    avatar: (m.name || `${m.first_name || ''} ${m.last_name || ''}`.trim() || 'TM')
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase() || 'TM',
                    location: m.location || m.city || 'HQ / Remote',
                    assignedVehicle: m.assigned_vehicle || m.vehicle || 'None',
                    clearance: m.clearance || 'Standard',
                    permissions: m.role?.permissions?.map((p: any) => p.name || p) || [],
                };
            });

            setMembers(mapped);
        } catch (err) {
            console.error('Failed to fetch team members:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            if (selectedDept !== 'all' && member.department !== selectedDept) return false;
            if (selectedStatus !== 'all') {
                const memStatus = (member.status || '').toLowerCase();
                const filterStat = selectedStatus.toLowerCase();
                if (filterStat === 'blocked') {
                    if (!member.isBlocked && memStatus !== 'blocked') return false;
                } else {
                    if (memStatus !== filterStat) return false;
                }
            }
            return true;
        });
    }, [members, selectedDept, selectedStatus]);

    const handleNavigateProfile = (member: TeamMember) => {
        navigate(`/supplier/team/member/${member.id}`, { state: { member } });
    };

    const handleConfirmDelete = async () => {
        if (!deletingMember) return;
        try {
            const targetId = deletingMember.rawId || deletingMember.id;
            await apiClient.delete(`/supplier/team/members/${targetId}`);
            setMembers((prev) => prev.filter((m) => m.id !== deletingMember.id));
            showToast(`Moved ${deletingMember.name} to the Trash Bin`, 'success');
        } catch (err: any) {
            console.error('Failed to delete member:', err);
            showToast(err.response?.data?.message || 'Failed to delete team member', 'error');
        }
    };

    const handleUnblockMember = async (row: TeamMember) => {
        try {
            const memberId = row.rawId || row.id;
            await apiClient.post(`/supplier/team/members/${memberId}/unblock`, {
                status: 'active',
                is_blocked: false,
            }).catch(async () => {
                return apiClient.put(`/supplier/team/members/${memberId}`, {
                    status: 'active',
                    is_blocked: false,
                    block_reason: null,
                });
            });
            setMembers((prev) =>
                prev.map((m) => (m.id === row.id ? { ...m, status: 'Active', isBlocked: false, blockReason: undefined } : m))
            );
            showToast(`${row.name} has been restored to active status`, 'success');
        } catch (err: any) {
            console.error('Failed to unblock member:', err);
            showToast(err.response?.data?.message || 'Failed to unblock team member', 'error');
        }
    };

    const handleResendInvite = async (row: TeamMember) => {
        try {
            const memberId = row.rawId || row.id;
            await apiClient.post(`/supplier/team/members/${memberId}/resend-invitation`);
            showToast(`Invitation email sent successfully to ${row.email}!`, 'success');
        } catch (err: any) {
            console.error('Failed to resend invitation:', err);
            showToast(err.response?.data?.message || 'Failed to resend invitation', 'error');
        }
    };

    return {
        members,
        setMembers,
        filteredMembers,
        isLoading,
        selectedDept,
        setSelectedDept,
        selectedStatus,
        setSelectedStatus,
        blockingMember,
        setBlockingMember,
        deletingMember,
        setDeletingMember,
        handleNavigateProfile,
        handleConfirmDelete,
        handleUnblockMember,
        handleResendInvite,
    };
}
