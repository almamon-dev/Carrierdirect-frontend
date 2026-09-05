import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, RotateCcw } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import EmptyState from '@/components/tables/empty-state';
import { TeamMember } from '../types/team.types';
import { TeamMemberRowActions } from './TeamMemberRowActions';
import BlockMemberModal from './BlockMemberModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useToastStore } from '@/stores/useToastStore';
import { apiClient } from '@/lib/axios';

interface TeamMembersTabProps {
    headerTabs?: React.ReactNode;
}

export default function TeamMembersTab({ headerTabs }: TeamMembersTabProps = {}) {
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
                const statusDisplay = isBlocked ? 'Blocked' : (rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1));
                
                return {
                    id: m.employee_id || `EMP-${m.id}`,
                    rawId: m.id,
                    name: m.name || `${m.first_name || ''} ${m.last_name || ''}`.trim() || 'Team Member',
                    email: m.email || '',
                    phone: m.phone || m.phone_number || '-',
                    role: m.role?.name || m.role || 'Staff Member',
                    designation: m.designation || m.role?.name || m.role || 'Staff Member',
                    department: m.department || 'Operations & Dispatch',
                    status: statusDisplay as any,
                    isBlocked: isBlocked,
                    blockReason: m.block_reason || undefined,
                    blockedAt: m.blocked_at || undefined,
                    joinDate: m.created_at ? new Date(m.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
                    lastLogin: m.last_active_at ? new Date(m.last_active_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Recently',
                    avatar: (m.name || 'TM').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
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

    const filteredMembers = members.filter(member => {
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

    const handleNavigateProfile = (member: TeamMember) => {
        navigate(`/supplier/team/members/${member.id}`, { state: { member } });
    };

    const columns: Column<TeamMember>[] = [
        {
            id: 'id',
            label: 'ID',
            className: 'w-[85px]',
            render: (row) => (
                <div className="flex items-center h-5">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400 leading-none">
                        {row.id}
                    </span>
                </div>
            )
        },
        {
            id: 'name',
            label: 'Name',
            className: 'w-[180px]',
            render: (row) => (
                <div className="flex items-center gap-2 whitespace-nowrap min-w-0 h-5">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-[9.5px] font-bold shrink-0 leading-none">
                        {row.avatar}
                    </div>
                    <button
                        onClick={() => handleNavigateProfile(row)}
                        className="font-semibold text-slate-800 dark:text-slate-200 text-xs hover:text-primary dark:hover:text-primary transition-colors truncate max-w-[120px] text-left leading-none cursor-pointer"
                        title={row.name}
                    >
                        {row.name}
                    </button>
                </div>
            )
        },
        {
            id: 'email',
            label: 'Email',
            className: 'min-w-0',
            render: (row) => (
                <div className="flex items-center min-w-0 h-5" title={row.email}>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate whitespace-nowrap leading-none">
                        {row.email}
                    </span>
                </div>
            )
        },
        {
            id: 'phone',
            label: 'Phone',
            className: 'w-[125px]',
            render: (row) => (
                <div className="flex items-center h-5">
                    <span className="whitespace-nowrap text-slate-600 dark:text-slate-400 text-xs font-mono leading-none">
                        {row.phone}
                    </span>
                </div>
            )
        },
        {
            id: 'role',
            label: 'Role',
            className: 'w-[110px]',
            render: (row) => (
                <div className="flex items-center h-5">
                    <span className="whitespace-nowrap font-semibold text-slate-800 dark:text-slate-200 text-xs leading-none">
                        {row.role}
                    </span>
                </div>
            )
        },
        {
            id: 'status',
            label: 'Status',
            className: 'w-[95px] text-center',
            render: (row) => {
                const isBlocked = row.status === 'Blocked' || Boolean(row.isBlocked);
                const rawStatus = (row.status || 'Active').toLowerCase();
                return (
                    <div className="flex items-center justify-center h-5">
                        <Badge
                            variant="secondary"
                            className={`whitespace-nowrap text-[10.5px] font-semibold border flex items-center gap-1 px-2 py-0.5 leading-none ${isBlocked
                                ? 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300'
                                : rawStatus === 'active'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                                    : rawStatus === 'pending' || rawStatus === 'invited'
                                        ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300'
                                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                        >
                            {rawStatus === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                            {(rawStatus === 'pending' || rawStatus === 'invited') && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />}
                            {isBlocked && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                            {isBlocked ? 'Blocked' : row.status}
                        </Badge>
                    </div>
                );
            }
        },
        {
            id: 'lastLogin',
            label: 'Last Active',
            className: 'w-[95px] text-center',
            render: (row) => (
                <div className="flex items-center justify-center h-5">
                    <span className="whitespace-nowrap text-slate-500 text-xs leading-none">{row.lastLogin}</span>
                </div>
            )
        }
    ];

    const handleConfirmDelete = async () => {
        if (!deletingMember) return;
        try {
            const targetId = deletingMember.rawId || deletingMember.id;
            await apiClient.delete(`/supplier/team/members/${targetId}`);
            setMembers(prev => prev.filter(m => m.id !== deletingMember.id));
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
            setMembers(prev => prev.map(m => m.id === row.id ? { ...m, status: 'Active', isBlocked: false, blockReason: undefined } : m));
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

    const actions = (row: TeamMember) => (
        <TeamMemberRowActions
            row={row}
            onViewProfile={handleNavigateProfile}
            onDelete={(m) => setDeletingMember(m)}
            onBlock={(m) => setBlockingMember(m)}
            onUnblock={handleUnblockMember}
            onResendInvite={handleResendInvite}
        />
    );

    const filterContent = (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Department
                    </label>
                    <Select
                        value={selectedDept}
                        onChange={(val) => setSelectedDept(val)}
                        showSearch={false}
                        options={[
                            { id: 'all', name: 'All Departments' },
                            { id: 'Operations & Dispatch', name: 'Operations & Dispatch' },
                            { id: 'Fleet & Drivers', name: 'Fleet & Drivers' },
                            { id: 'Customer Support & Sales', name: 'Customer Support & Sales' },
                            { id: 'Finance & Accounts', name: 'Finance & Accounts' },
                            { id: 'Security & Compliance', name: 'Security & Compliance' },
                        ]}
                    />
                </div>

                <div className="min-w-0">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Employment Status
                    </label>
                    <Select
                        value={selectedStatus}
                        onChange={(val) => setSelectedStatus(val)}
                        showSearch={false}
                        options={[
                            { id: 'all', name: 'All Statuses' },
                            { id: 'active', name: 'Active' },
                            { id: 'on leave', name: 'On Leave' },
                            { id: 'inactive', name: 'Inactive' },
                            { id: 'blocked', name: 'Blocked' }
                        ]}
                    />
                </div>

                {(selectedDept !== 'all' || selectedStatus !== 'all') && (
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => { setSelectedDept('all'); setSelectedStatus('all'); }}
                            className="h-[34px] px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 rounded-[3px]"
                        >
                            <RotateCcw size={13} />
                            <span>Reset Filters</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-4 font-sans">
            <DataTable
                columns={columns}
                data={filteredMembers}
                compact={true}
                searchPlaceholder="Search staff by name, email, employee ID..."
                hideViewToggle={false}
                tableLayout="fixed"
                tableClassName="min-w-[960px]"
                actions={actions}
                headerTabs={headerTabs}
                filterContent={filterContent}
                isLoading={isLoading}
                emptyState={
                    <EmptyState
                        icon={Users}
                        title="No Team Members Found"
                        description="There are currently no staff members matching the search or filter criteria. Click Create Team Member to add staff."
                    />
                }
            />

            {/* Block Member Modal */}
            {blockingMember && (
                <BlockMemberModal
                    member={blockingMember}
                    onClose={() => setBlockingMember(null)}
                    onSuccess={(updated) => {
                        setMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
                        showToast(`${updated.name} has been blocked and access revoked`, 'success');
                    }}
                />
            )}

            {/* Delete Member Confirmation Modal */}
            {deletingMember && (
                <DeleteConfirmationModal
                    isOpen={Boolean(deletingMember)}
                    onClose={() => setDeletingMember(null)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Team Member"
                    subtitle="Move to Trash Bin"
                    memberName={deletingMember.name}
                    memberEmail={deletingMember.email}
                    memberRole={deletingMember.role}
                    memberId={deletingMember.id}
                    avatar={deletingMember.avatar}
                    confirmText="Move to Trash"
                    warningMessage="Are you sure you want to delete this team member? They will be moved to the Trash Bin and will lose access to the portal. You can restore them anytime from the Trash Bin tab."
                />
            )}
        </div>
    );
}
