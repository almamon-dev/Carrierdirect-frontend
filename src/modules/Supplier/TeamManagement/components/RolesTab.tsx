import React, { useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import RoleDetail from './RoleDetail';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import EmptyState from '@/components/tables/empty-state';
import { useRolesData } from '../hooks/useRolesData';
import { RoleItem, RoleRowActions } from './RoleRowActions';
import { getRoleColumns } from './roleColumns';
import { RoleGridCard } from './RoleGridCard';

export type { RoleItem };

interface RolesTabProps {
    headerTabs?: React.ReactNode;
    isCreatingRole?: boolean;
    onResetCreating?: () => void;
}

export default function RolesTab({ headerTabs, isCreatingRole, onResetCreating }: RolesTabProps = {}) {
    const {
        filteredRoles,
        isLoading,
        editingRole,
        setEditingRole,
        deletingRole,
        setDeletingRole,
        roleTypeFilter,
        setRoleTypeFilter,
        accessFilter,
        setAccessFilter,
        memberFilter,
        setMemberFilter,
        handleCreateRole,
        handleConfirmDelete,
        handleResetFilters,
        isFiltered,
        fetchRoles,
    } = useRolesData(isCreatingRole, onResetCreating);

    const columns = useMemo(() => getRoleColumns({ onSelectRole: setEditingRole }), [setEditingRole]);

    if (editingRole) {
        return (
            <RoleDetail 
                role={editingRole} 
                onBack={() => setEditingRole(null)} 
                onRoleUpdated={() => {
                    setEditingRole(null);
                    fetchRoles();
                }} 
            />
        );
    }

    const filterContent = (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                <div className="min-w-0">
                    <label className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Role Type
                    </label>
                    <Select
                        size="sm"
                        value={roleTypeFilter}
                        onChange={(e: any) => setRoleTypeFilter(e?.target?.value ?? e?.value ?? e)}
                        showSearch={false}
                        options={[
                            { id: 'all', name: 'All Role Types' },
                            { id: 'super_admin', name: 'Super Admin' },
                            { id: 'staff_role', name: 'Staff Roles' },
                        ]}
                    />
                </div>

                <div className="min-w-0">
                    <label className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Access Matrix
                    </label>
                    <Select
                        size="sm"
                        value={accessFilter}
                        onChange={(e: any) => setAccessFilter(e?.target?.value ?? e?.value ?? e)}
                        showSearch={false}
                        options={[
                            { id: 'all', name: 'All Access Levels' },
                            { id: 'full_access', name: 'Full Access (Admin)' },
                            { id: 'custom_modules', name: 'Configured Modules' },
                        ]}
                    />
                </div>

                <div className="min-w-0">
                    <label className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Assigned Members
                    </label>
                    <Select
                        size="sm"
                        value={memberFilter}
                        onChange={(e: any) => setMemberFilter(e?.target?.value ?? e?.value ?? e)}
                        showSearch={false}
                        options={[
                            { id: 'all', name: 'All Member Counts' },
                            { id: 'assigned', name: 'Has Assigned Members (> 0)' },
                            { id: 'unassigned', name: 'Unassigned (0 Members)' },
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
        <div className="space-y-4 font-sans h-auto">
            <DataTable 
                columns={columns} 
                data={filteredRoles} 
                compact={true}
                searchPlaceholder="Search roles by title, description, permissions..."
                hideViewToggle={false}
                renderGridCard={(role) => (
                    <RoleGridCard
                        key={role.id}
                        role={role}
                        onEdit={setEditingRole}
                        onDelete={(r) => setDeletingRole(r)}
                    />
                )}
                headerTabs={headerTabs}
                filterContent={filterContent}
                isLoading={isLoading}
                actions={(row: RoleItem) => (
                    <RoleRowActions
                        row={row}
                        onEdit={setEditingRole}
                        onDelete={(r) => setDeletingRole(r)}
                    />
                )}
                actionsColumnClassName="w-[80px] min-w-[80px] whitespace-nowrap text-right pr-3"
                tableClassName="w-full min-w-[1050px]"
                emptyState={
                    <EmptyState 
                        title="No Access Roles Found" 
                        description="No access roles have been found matching your filter criteria. Create a role to assign staff permissions." 
                        actionLabel="Create Role"
                        onAction={handleCreateRole}
                    />
                }
            />

            {deletingRole && (
                <DeleteConfirmationModal
                    isOpen={Boolean(deletingRole)}
                    onClose={() => setDeletingRole(null)}
                    onConfirm={handleConfirmDelete}
                    title="Delete Access Role"
                    subtitle="Remove role from organization"
                    memberName={deletingRole.name}
                    memberRole={`${deletingRole.count} assigned members`}
                    confirmText="Delete Role"
                    warningMessage={`Are you sure you want to delete the role '${deletingRole.name}'? Staff members currently assigned to this role may lose access to their designated modules.`}
                />
            )}
        </div>
    );
}
