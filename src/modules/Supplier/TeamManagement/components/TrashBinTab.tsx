import React, { useState, useEffect, useMemo } from 'react';
import { Trash2, RotateCcw } from 'lucide-react';
import DataTable from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import EmptyState from '@/components/tables/empty-state';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useToastStore } from '@/stores/useToastStore';
import { apiClient } from '@/lib/axios';
import { TrashBinRowActions, TrashedMember } from './TrashBinRowActions';
import { getTrashBinColumns } from './trashBinColumns';

interface TrashBinTabProps {
    headerTabs?: React.ReactNode;
}

export default function TrashBinTab({ headerTabs }: TrashBinTabProps = {}) {
    const showToast = useToastStore((state) => state.showToast);
    const [trashedMembers, setTrashedMembers] = useState<TrashedMember[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [permanentlyDeletingMember, setPermanentlyDeletingMember] = useState<TrashedMember | null>(null);
    const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');

    const fetchTrashed = async () => {
        try {
            setIsLoading(true);
            const res = await apiClient.get('/supplier/team/trash');
            const list = res.data?.data?.members || res.data?.data || res.data || [];
            setTrashedMembers(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Failed to fetch trashed team members:', err);
            setTrashedMembers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTrashed();
    }, []);

    const handleRestore = async (row: TrashedMember) => {
        try {
            const targetId = row.rawId || row.id;
            await apiClient.post(`/supplier/team/trash/${targetId}/restore`);
            setTrashedMembers((prev) => prev.filter((m) => m.id !== row.id));
            showToast(`Successfully restored ${row.name} (${row.email}) to the active team!`, 'success');
        } catch (err: any) {
            console.error('Failed to restore member:', err);
            showToast(err.response?.data?.message || 'Failed to restore member', 'error');
        }
    };

    const handleConfirmPermanentDelete = async () => {
        if (!permanentlyDeletingMember) return;
        try {
            const targetId = permanentlyDeletingMember.rawId || permanentlyDeletingMember.id;
            await apiClient.delete(`/supplier/team/trash/${targetId}/force-delete`);
            setTrashedMembers((prev) => prev.filter((m) => m.id !== permanentlyDeletingMember.id));
            showToast(`Permanently deleted ${permanentlyDeletingMember.name} from the system`, 'success');
        } catch (err: any) {
            console.error('Failed to force delete member:', err);
            showToast(err.response?.data?.message || 'Failed to delete member permanently', 'error');
        }
    };

    const columns = useMemo(() => getTrashBinColumns(), []);

    const filteredTrashedMembers = useMemo(() => {
        if (selectedRoleFilter === 'all') return trashedMembers;
        return trashedMembers.filter((m) => (m.role_name || '').toLowerCase() === selectedRoleFilter.toLowerCase());
    }, [trashedMembers, selectedRoleFilter]);

    const filterContent = (
        <div className="w-full mb-3.5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                <div className="min-w-0">
                    <label className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Filter by Previous Role
                    </label>
                    <Select
                        size="sm"
                        value={selectedRoleFilter}
                        onChange={(e: any) => {
                            const val = e?.target?.value !== undefined ? e.target.value : (e?.value !== undefined ? e.value : e);
                            setSelectedRoleFilter(val);
                        }}
                        showSearch={false}
                        options={[
                            { id: 'all', name: 'All Roles' },
                            { id: 'Admin', name: 'Admin' },
                            { id: 'Driver', name: 'Driver' },
                            { id: 'Operations Manager', name: 'Operations Manager' },
                            { id: 'Customer Support', name: 'Customer Support' },
                            { id: 'Finance & Billing', name: 'Finance & Billing' },
                        ]}
                    />
                </div>
                {selectedRoleFilter !== 'all' && (
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRoleFilter('all')}
                            className="h-[30px] text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 cursor-pointer"
                        >
                            <RotateCcw size={12} />
                            Reset Filter
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
                data={filteredTrashedMembers}
                compact={true}
                searchPlaceholder="Search deleted staff by name, email, ID..."
                hideViewToggle={false}
                tableLayout="fixed"
                tableClassName="min-w-[960px]"
                actions={(row: TrashedMember) => (
                    <TrashBinRowActions
                        row={row}
                        onRestore={handleRestore}
                        onPermanentDelete={(m) => setPermanentlyDeletingMember(m)}
                    />
                )}
                actionsColumnClassName="w-[80px] min-w-[80px] text-right pr-3"
                headerTabs={headerTabs}
                filterContent={filterContent}
                isLoading={isLoading}
                emptyState={
                    <EmptyState
                        icon={Trash2}
                        title="Trash Bin is Empty"
                        description="There are currently no deleted team members in the trash bin."
                    />
                }
            />

            {/* Permanent Delete Confirmation Modal */}
            {permanentlyDeletingMember && (
                <DeleteConfirmationModal
                    isOpen={Boolean(permanentlyDeletingMember)}
                    onClose={() => setPermanentlyDeletingMember(null)}
                    onConfirm={handleConfirmPermanentDelete}
                    title="Permanently Delete Member"
                    subtitle="Irreversible Database Deletion"
                    memberName={permanentlyDeletingMember.name}
                    memberEmail={permanentlyDeletingMember.email}
                    memberRole={permanentlyDeletingMember.role_name}
                    memberId={permanentlyDeletingMember.employee_id}
                    isPermanent={true}
                    confirmText="Delete Permanently"
                    warningMessage={`Are you sure you want to permanently delete ${permanentlyDeletingMember.name} (${permanentlyDeletingMember.email})? This action CANNOT be undone and will permanently remove all associated member data.`}
                />
            )}
        </div>
    );
}
