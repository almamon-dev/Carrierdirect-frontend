import React, { useMemo } from 'react';
import { Users, RotateCcw } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import EmptyState from '@/components/tables/empty-state';
import { TeamMember } from '../types/team.types';
import { TeamMemberRowActions } from './TeamMemberRowActions';
import BlockMemberModal from './BlockMemberModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useToastStore } from '@/stores/useToastStore';
import { useTeamMembers } from '../hooks/useTeamMembers';
import { getTeamMemberColumns } from './teamMemberColumns';
import { TeamMemberGridCard } from './TeamMemberGridCard';

interface TeamMembersTabProps {
    headerTabs?: React.ReactNode;
}

export default function TeamMembersTab({ headerTabs }: TeamMembersTabProps = {}) {
    const showToast = useToastStore((state) => state.showToast);
    const {
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
    } = useTeamMembers();

    const columns = useMemo(
        () => getTeamMemberColumns({ onNavigateProfile: handleNavigateProfile }),
        []
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
                            { id: 'blocked', name: 'Blocked' },
                        ]}
                    />
                </div>

                {(selectedDept !== 'all' || selectedStatus !== 'all') && (
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelectedDept('all');
                                setSelectedStatus('all');
                            }}
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
                renderGridCard={(member: TeamMember) => (
                    <TeamMemberGridCard
                        key={member.id}
                        member={member}
                        onNavigateProfile={handleNavigateProfile}
                        onDelete={(m) => setDeletingMember(m)}
                        onBlock={(m) => setBlockingMember(m)}
                        onUnblock={handleUnblockMember}
                        onResendInvite={handleResendInvite}
                    />
                )}
                tableLayout="fixed"
                tableClassName="min-w-[1080px]"
                actions={(row: TeamMember) => (
                    <TeamMemberRowActions
                        row={row}
                        onViewProfile={handleNavigateProfile}
                        onDelete={(m) => setDeletingMember(m)}
                        onBlock={(m) => setBlockingMember(m)}
                        onUnblock={handleUnblockMember}
                        onResendInvite={handleResendInvite}
                    />
                )}
                actionsColumnClassName="w-[80px] min-w-[80px] text-right pr-3"
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
                        setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
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
