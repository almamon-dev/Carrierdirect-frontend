import React, { useMemo } from 'react';
import { Mail, RotateCcw } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import EmptyState from '@/components/tables/empty-state';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useInvitations } from '../hooks/useInvitations';
import { getInvitationColumns } from './invitationColumns';
import { InvitationGridCard } from './InvitationGridCard';
import { InvitationRowActions } from './InvitationRowActions';
import { InvitationItem } from '../types/team.types';

interface InvitationsTabProps {
    headerTabs?: React.ReactNode;
}

export default function InvitationsTab({ headerTabs }: InvitationsTabProps = {}) {
    const {
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
    } = useInvitations();

    const columns = useMemo(() => getInvitationColumns(), []);

    const filterContent = (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                <div className="min-w-0">
                    <label className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 block mb-1">Status Filter</label>
                    <Select 
                        size="sm"
                        value={selectedStatusFilter} 
                        onChange={(e: any) => setSelectedStatusFilter(e?.target?.value ?? e?.value ?? e)} 
                        showSearch={false} 
                        options={[
                            { id: 'all', name: 'All Invitations' },
                            { id: 'pending', name: 'Pending' },
                            { id: 'accepted', name: 'Accepted' },
                            { id: 'expired', name: 'Expired' },
                        ]} 
                    />
                </div>

                <div className="min-w-0">
                    <label className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 block mb-1">Department</label>
                    <Select 
                        size="sm"
                        value={selectedDeptFilter} 
                        onChange={(e: any) => setSelectedDeptFilter(e?.target?.value ?? e?.value ?? e)} 
                        showSearch={false} 
                        options={[
                            { id: 'all', name: 'All Departments' },
                            { id: 'Operations & Dispatch', name: 'Operations & Dispatch' },
                            { id: 'Fleet & Drivers', name: 'Fleet & Drivers' },
                            { id: 'Customer Support & Sales', name: 'Customer Support & Sales' },
                            { id: 'Finance & Accounts', name: 'Finance & Accounts' },
                        ]} 
                    />
                </div>

                {isFiltered && (
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilters}
                            className="h-[30px] text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 cursor-pointer"
                        >
                            <RotateCcw size={12} />
                            Reset Filters
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
                data={filteredInvitations} 
                compact={true}
                searchPlaceholder="Search invitations by email, role, ID, department..."
                hideViewToggle={false}
                renderGridCard={(inv) => (
                    <InvitationGridCard 
                        key={inv.id} 
                        inv={inv} 
                        onResend={handleResend} 
                        onRevoke={(r) => setRevokingInvitation(r)} 
                    />
                )}
                tableLayout="fixed"
                tableClassName="min-w-[1050px]"
                actions={(row: InvitationItem) => (
                    <InvitationRowActions
                        row={row}
                        onResend={handleResend}
                        onRevoke={(r) => setRevokingInvitation(r)}
                    />
                )}
                actionsColumnClassName="w-[80px] min-w-[80px] text-right pr-3"
                headerTabs={headerTabs}
                filterContent={filterContent}
                isLoading={isLoading}
                emptyState={
                    <EmptyState
                        icon={Mail}
                        title="No Invitations Found"
                        description="There are currently no active or pending team member invitations matching the criteria."
                    />
                }
            />

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
