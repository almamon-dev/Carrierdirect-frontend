import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, RotateCcw, MoreVertical, Copy, Check } from 'lucide-react';
import DataTable, { Column } from '@/components/tables/data-table';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
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

interface TrashBinRowActionsProps {
    row: TrashedMember;
    onRestore: (row: TrashedMember) => void;
    onPermanentDelete: (row: TrashedMember) => void;
}

const TrashBinRowActions: React.FC<TrashBinRowActionsProps> = ({ row, onRestore, onPermanentDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 180)
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            handleClose();
        }, 1200);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(e.target as Node)
            ) {
                handleClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };

        const handleScroll = () => handleClose();

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    return (
        <div className="relative flex items-center justify-end w-full">
            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center"
                onClick={handleToggle}
                title="Actions"
            >
                <MoreVertical size={15} />
            </Button>

            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    className="fixed w-44 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left"
                    style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            handleClose();
                            onRestore(row);
                        }}
                    >
                        <RotateCcw size={14} className="text-emerald-500 shrink-0" />
                        <span>Restore Member</span>
                    </button>

                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => handleCopy(row.employee_id || row.email)}
                    >
                        {copied ? (
                            <Check size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                            <Copy size={14} className="text-slate-400 dark:text-slate-400 shrink-0" />
                        )}
                        <span>{copied ? 'Copied ID!' : 'Copy Employee ID'}</span>
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            handleClose();
                            onPermanentDelete(row);
                        }}
                    >
                        <Trash2 size={14} className="text-red-500 shrink-0" />
                        <span>Delete Permanently</span>
                    </button>
                </div>,
                document.body
            )}
        </div>
    );
};

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

    const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');

    const filteredTrashedMembers = useMemo(() => {
        if (selectedRoleFilter === 'all') return trashedMembers;
        return trashedMembers.filter(m => (m.role_name || '').toLowerCase() === selectedRoleFilter.toLowerCase());
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

    const renderActions = (row: TrashedMember) => (
        <TrashBinRowActions
            row={row}
            onRestore={handleRestore}
            onPermanentDelete={(m) => setPermanentlyDeletingMember(m)}
        />
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
                actions={renderActions}
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
