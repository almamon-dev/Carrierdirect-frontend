import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import DataTable, { Column } from '@/components/tables/data-table';
import EmptyState from '@/components/tables/empty-state';
import { TeamMember } from '../types/team.types';
import { apiClient } from '@/lib/axios';
import { TeamMemberRowActions } from './TeamMemberRowActions';
import BlockMemberModal from './BlockMemberModal';

interface TeamMembersTabProps {
    headerTabs?: React.ReactNode;
}

export default function TeamMembersTab({ headerTabs }: TeamMembersTabProps = {}) {
    const navigate = useNavigate();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedDept, setSelectedDept] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [blockingMember, setBlockingMember] = useState<TeamMember | null>(null);

    const handleNavigateProfile = (row: TeamMember) => {
        const memberId = row.rawId || row.id;
        navigate(`/supplier/team/${memberId}`);
    };

    const fetchMembers = async () => {
        try {
            const res = await apiClient.get('/supplier/team/members');
            const raw = res.data?.data?.members || res.data?.data || res.data || [];
            const resArray = Array.isArray(raw) ? raw : [];

            const mapped: TeamMember[] = resArray.map((m: any) => {
                const isBlocked = m.status === 'blocked' || m.status === 'disabled' || Boolean(m.is_blocked);
                const isPending = m.status === 'pending' || m.status === 'invited';
                const roleName = m.role?.name || m.role || 'Driver';
                const lastActive = (m.last_login_at && !isPending)
                    ? new Date(m.last_login_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                    : (m.last_login && m.last_login !== 'Never' && !isPending ? m.last_login : 'Never');

                return {
                    id: m.employee_id || (m.id ? `EMP-${m.id}` : 'EMP-000'),
                    rawId: m.id,
                    name: m.name || m.user?.name || 'Staff Member',
                    avatar: (m.name || 'SM').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
                    role: roleName,
                    department: roleName,
                    designation: roleName,
                    email: m.email || m.user?.email || 'staff@example.com',
                    phone: m.phone || m.user?.phone || '—',
                    status: (isBlocked ? 'Blocked' : isPending ? 'Pending' : m.status === 'active' ? 'Active' : m.status === 'on_leave' ? 'On Leave' : 'Pending') as any,
                    isBlocked: isBlocked,
                    blockReason: m.block_reason || m.reason || '',
                    blockedAt: m.blocked_at || '',
                    lastLogin: lastActive,
                    location: m.location || 'Main Depot',
                    assignedVehicle: m.assigned_vehicle || m.vehicle?.name || 'Station #1',
                    clearance: m.clearance || 'Level 1 - Standard',
                };
            });

            setMembers(mapped);
        } catch (err) {
            console.error('Failed to fetch team members:', err);
            setMembers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const filteredMembers = members.filter((member) => {
        const matchesDept = selectedDept === 'all' || member.department.toLowerCase() === selectedDept.toLowerCase();
        const matchesStatus = selectedStatus === 'all' || member.status.toLowerCase() === selectedStatus.toLowerCase();
        return matchesDept && matchesStatus;
    });

    const columns: Column<TeamMember>[] = [
        {
            id: 'id',
            label: 'ID',
            className: 'w-[75px]',
            render: (row) => (
                <div className="flex items-center h-5">
                    <button
                        type="button"
                        onClick={() => handleNavigateProfile(row)}
                        className="font-bold text-[#ff4a1f] hover:underline text-left whitespace-nowrap cursor-pointer text-xs leading-none font-mono"
                    >
                        {row.id}
                    </button>
                </div>
            )
        },
        {
            id: 'name',
            label: 'Name',
            className: 'w-[180px]',
            render: (row) => (
                <div className="flex items-center gap-2 whitespace-nowrap min-w-0 h-5">
                    <div className="w-5 h-5 rounded-full bg-orange-100 dark:bg-[#ff4a1f]/20 border border-orange-200/60 dark:border-orange-500/20 text-[#ff4a1f] flex items-center justify-center text-[9.5px] font-bold shrink-0">
                        {row.avatar}
                    </div>
                    <button
                        type="button"
                        onClick={() => handleNavigateProfile(row)}
                        className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate max-w-[105px] leading-none hover:text-[#ff4a1f] cursor-pointer text-left"
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
            className: 'w-[105px] text-center',
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

    const handleDeleteMember = async (row: TeamMember) => {
        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
            try {
                if (row.rawId) {
                    await apiClient.delete(`/supplier/team/members/${row.rawId}`);
                }
            } catch (err) {
                console.error('Failed to delete member:', err);
            }
            setMembers(prev => prev.filter(m => m.id !== row.id));
        }
    };

    const handleUnblockMember = async (row: TeamMember) => {
        if (window.confirm(`Are you sure you want to unblock ${row.name}? This will restore their system access.`)) {
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
            } catch (err) {
                console.error('Failed to unblock member:', err);
            }

            setMembers(prev => prev.map(m => m.id === row.id ? { ...m, status: 'Active', isBlocked: false, blockReason: undefined } : m));
        }
    };

    const actions = (row: TeamMember) => (
        <TeamMemberRowActions
            row={row}
            onViewProfile={handleNavigateProfile}
            onDelete={handleDeleteMember}
            onBlock={(m) => setBlockingMember(m)}
            onUnblock={handleUnblockMember}
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
                            className="h-[34px] px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300"
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
                    }}
                />
            )}
        </div>
    );
}
