import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TeamMember } from '../types/team.types';
import { apiClient } from '@/lib/axios';

export function useTeamMemberProfile() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [member, setMember] = useState<TeamMember | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

    useEffect(() => {
        async function fetchMember() {
            setIsLoading(true);
            try {
                const res = await apiClient.get(`/supplier/team/members/${id}`);
                const m = res.data?.data || res.data;
                if (m) {
                    const isBlocked = m.status === 'blocked' || m.status === 'disabled' || Boolean(m.is_blocked);
                    const isPending = m.status === 'pending' || m.status === 'invited';
                    const roleName = m.role?.name || m.role || 'Driver';
                    const lastActive =
                        m.last_login_at && !isPending
                            ? new Date(m.last_login_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                            : m.last_login && m.last_login !== 'Never' && !isPending
                            ? m.last_login
                            : 'Never';

                    setMember({
                        id: m.employee_id || (m.id ? `EMP-${m.id}` : `EMP-${id}`),
                        rawId: m.id || id,
                        name: m.name || m.user?.name || '-',
                        avatar: (m.name || 'SM').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
                        role: roleName,
                        department: roleName,
                        designation: roleName,
                        email: m.email || m.user?.email || 'staff@example.com',
                        phone: m.phone || m.user?.phone || '—',
                        status: (isBlocked ? 'Blocked' : isPending ? 'Pending' : m.status === 'active' ? 'Active' : m.status === 'on_leave' ? 'On Leave' : 'Pending') as any,
                        isBlocked,
                        blockReason: m.block_reason || m.reason || '',
                        blockedAt: m.blocked_at || '',
                        lastLogin: lastActive,
                        location: m.location || 'Main Depot Terminal',
                        assignedVehicle: m.assigned_vehicle || m.vehicle?.name || 'Station Unit #1',
                        clearance: m.clearance || 'Level 1 - Standard Clearance',
                    });
                }
            } catch (err) {
                console.error('Failed to load team member details:', err);
                setMember({
                    id: String(id).startsWith('EMP-') ? String(id) : `EMP-${id}`,
                    rawId: id,
                    name: 'Staff Member',
                    avatar: 'SM',
                    role: 'Operations Specialist',
                    department: 'Operations & Dispatch',
                    designation: 'Operations Executive',
                    email: 'staff@example.com',
                    phone: '+44 7700 900111',
                    status: 'Active',
                    lastLogin: 'Today',
                    location: 'Main Depot Terminal',
                    assignedVehicle: 'Station Unit #1',
                    clearance: 'Level 1 - Standard Clearance',
                });
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchMember();
    }, [id]);

    const handleDelete = async () => {
        if (!member) return;
        if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
            try {
                if (member.rawId) {
                    await apiClient.delete(`/supplier/team/members/${member.rawId}`);
                }
            } catch (err) {
                console.error('Failed to delete member:', err);
            }
            navigate('/supplier/team?tab=members&view=table');
        }
    };

    const handleUnblock = async () => {
        if (!member) return;
        if (window.confirm(`Are you sure you want to unblock ${member.name}? This will restore their system access.`)) {
            try {
                const memberId = member.rawId || member.id;
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
            } catch (err) {
                console.error('Failed to unblock member:', err);
            }

            setMember((prev) =>
                prev
                    ? {
                          ...prev,
                          status: 'Active',
                          isBlocked: false,
                          blockReason: undefined,
                      }
                    : null
            );
        }
    };

    return {
        member,
        setMember,
        isLoading,
        isBlockModalOpen,
        setIsBlockModalOpen,
        handleDelete,
        handleUnblock,
        navigate,
    };
}
