import React, { useState, useEffect } from 'react';
import { Trash2, RotateCcw } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useToastStore } from '@/stores/useToastStore';
import { apiClient } from '@/lib/axios';

interface TrashedMember {
    id: number | string;
    rawId: number;
    employee_id: string;
    name: string;
    email: string;
    phone: string;
    role_name: string;
    deleted_at: string;
    deleted_at_human: string;
}

interface TrashBinTabProps {
    headerTabs?: React.ReactNode;
}

export default function TrashBinTab({ headerTabs }: TrashBinTabProps = {}) {
    const showToast = useToastStore((state) => state.showToast);
    const [trashedMembers, setTrashedMembers] = useState<TrashedMember[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [permanentlyDeletingMember, setPermanentlyDeletingMember] = useState<TrashedMember | null>(null);

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
            setTrashedMembers(prev => prev.filter(m => m.id !== row.id));
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
            setTrashedMembers(prev => prev.filter(m => m.id !== permanentlyDeletingMember.id));
            showToast(`Permanently deleted ${permanentlyDeletingMember.name} from the system`, 'success');
        } catch (err: any) {
            console.error('Failed to force delete member:', err);
            showToast(err.response?.data?.message || 'Failed to delete member permanently', 'error');
        }
    };

    const columns: Column<TrashedMember>[] = [
        {
            id: 'employee_id',
            label: 'ID',
            className: 'w-[85px]',
            render: (row) => (
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                    {row.employee_id}
                </span>
            )
        },
        {
            id: 'name',
            label: 'Name',
            className: 'w-[180px]',
            render: (row) => (
                <div className="flex items-center gap-2 whitespace-nowrap min-w-0">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[9.5px] font-bold shrink-0">
                        {(row.name || 'SM').slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate max-w-[120px]" title={row.name}>
                        {row.name}
                    </span>
                </div>
            )
        },
        {
            id: 'email',
            label: 'Email Address',
            render: (row) => (
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate" title={row.email}>
                    {row.email}
                </span>
            )
        },
        {
            id: 'role_name',
            label: 'Role',
            className: 'w-[130px]',
            render: (row) => (
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    {row.role_name || 'Staff Member'}
                </span>
            )
        },
        {
            id: 'deleted_at',
            label: 'Deleted Date',
            className: 'w-[160px]',
            render: (row) => (
                <div className="flex flex-col text-[11.5px] text-slate-500">
                    <span>{row.deleted_at}</span>
                    <span className="text-[10px] text-slate-400">{row.deleted_at_human}</span>
                </div>
            )
        }
    ];

    const renderActions = (row: TrashedMember) => (
        <div className="flex items-center justify-end gap-2">
            <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs px-2.5 font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 cursor-pointer flex items-center gap-1 rounded-[3px]"
                onClick={() => handleRestore(row)}
                title="Restore to Active Team"
            >
                <RotateCcw size={12} />
                <span>Restore</span>
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer rounded-[3px]"
                onClick={() => setPermanentlyDeletingMember(row)}
                title="Permanently Delete"
            >
                <Trash2 size={14} />
            </Button>
        </div>
    );

    return (
        <div className="space-y-4 font-sans">
            <DataTable
                columns={columns}
                data={trashedMembers}
                compact={true}
                searchPlaceholder="Search deleted staff by name, email, ID..."
                hideViewToggle={false}
                tableLayout="fixed"
                tableClassName="min-w-[960px]"
                actions={renderActions}
                headerTabs={headerTabs}
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
