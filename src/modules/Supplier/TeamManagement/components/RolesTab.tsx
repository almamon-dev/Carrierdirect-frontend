import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
    Edit, Shield, Plus, Users, Trash2, CheckCircle2,
    MoreVertical, Copy, Check, RotateCcw
} from 'lucide-react';
import RoleDetail from './RoleDetail';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import EmptyState from '@/components/tables/empty-state';
import { useToastStore } from '@/stores/useToastStore';
import { apiClient } from '@/lib/axios';

export interface RoleItem {
    id: number | string;
    rawId?: number | string;
    name: string;
    description: string;
    count: number;
    permissions: any[];
    isSystemDefault: boolean;
}

interface RoleRowActionsProps {
    row: RoleItem;
    onEdit: (row: RoleItem) => void;
    onDelete: (row: RoleItem) => void;
}

const RoleRowActions: React.FC<RoleRowActionsProps> = ({ row, onEdit, onDelete }) => {
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
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            handleClose();
                            onEdit(row);
                        }}
                    >
                        <Edit size={14} className="text-[#ff4a1f] shrink-0" />
                        <span>Edit Permissions</span>
                    </button>

                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => handleCopy(row.name)}
                    >
                        {copied ? (
                            <Check size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                            <Copy size={14} className="text-slate-400 dark:text-slate-400 shrink-0" />
                        )}
                        <span>{copied ? 'Copied Name!' : 'Copy Role Name'}</span>
                    </button>

                    {!row.isSystemDefault ? (
                        <>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={() => {
                                    handleClose();
                                    onDelete(row);
                                }}
                            >
                                <Trash2 size={14} className="text-red-500 shrink-0" />
                                <span>Delete Role</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                            <div className="px-3.5 py-1 text-[10.5px] text-slate-400 dark:text-slate-500 italic">
                                System Default Role
                            </div>
                        </>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};

interface RolesTabProps {
    headerTabs?: React.ReactNode;
    isCreatingRole?: boolean;
    onResetCreating?: () => void;
}

export default function RolesTab({ headerTabs, isCreatingRole, onResetCreating }: RolesTabProps = {}) {
    const showToast = useToastStore((state) => state.showToast);
    const [roles, setRoles] = useState<RoleItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editingRole, setEditingRole] = useState<any>(null);
    const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null);

    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get('/supplier/team/roles');
            const raw = res.data?.data?.roles || res.data?.data || res.data || [];
            if (Array.isArray(raw)) {
                const mapped: RoleItem[] = raw.map((r: any, idx: number) => {
                    const rName = (r.name || 'Role').trim();
                    const isSys = rName.toLowerCase() === 'admin' || 
                                  rName.toLowerCase() === 'super admin' || 
                                  Boolean(r.is_default === true || r.is_default === 1 || r.is_default === '1');

                    return {
                        id: r.id || idx + 1,
                        rawId: r.id,
                        name: rName,
                        description: r.description || 'Access role for staff members.',
                        count: r.users_count || r.members_count || (rName === 'Viewer' || rName === 'Sales & Quotes' ? 0 : 1),
                        permissions: r.permissions || [],
                        isSystemDefault: isSys,
                    };
                });
                setRoles(mapped);
            } else {
                setRoles([]);
            }
        } catch (err) {
            console.error('Failed to fetch roles from API:', err);
            setRoles([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        if (isCreatingRole) {
            handleCreateRole();
            if (onResetCreating) onResetCreating();
        }
    }, [isCreatingRole, onResetCreating]);

    const handleCreateRole = () => {
        setEditingRole({
            name: '',
            description: '',
            count: 0,
            permissions: [],
            isNew: true
        });
    };

    const handleConfirmDelete = async () => {
        if (!deletingRole) return;
        try {
            if (deletingRole.rawId) {
                await apiClient.delete(`/supplier/team/roles/${deletingRole.rawId}`);
            }
            setRoles(prev => prev.filter(r => r.id !== deletingRole.id));
            showToast(`Role '${deletingRole.name}' deleted successfully`, 'success');
        } catch (err: any) {
            console.error('Failed to delete role:', err);
            showToast(err.response?.data?.message || 'Failed to delete role', 'error');
        } finally {
            setDeletingRole(null);
        }
    };

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

    const columns: Column<RoleItem>[] = [
        { 
            id: 'name', 
            label: 'Role Name', 
            className: 'w-[180px] min-w-[180px]',
            sortable: true,
            render: (row) => (
                <div 
                    onClick={() => setEditingRole(row)}
                    className="flex items-center gap-2 cursor-pointer group min-h-[26px]"
                >
                    <Shield size={14} className="text-[#ff4a1f] shrink-0" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate group-hover:text-[#ff4a1f] transition-colors">
                        {row.name}
                    </span>
                </div>
            ) 
        },
        { 
            id: 'description', 
            label: 'Role Description', 
            className: 'min-w-[240px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px] truncate" title={row.description}>
                    <span className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        {row.description}
                    </span>
                </div>
            ) 
        },
        { 
            id: 'count', 
            label: 'Assigned Members', 
            className: 'w-[140px] min-w-[140px]',
            sortable: true,
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <Users size={12} className="text-slate-400" />
                        <span>{row.count} {row.count === 1 ? 'member' : 'members'}</span>
                    </span>
                </div>
            ) 
        },
        { 
            id: 'permissions', 
            label: 'Access Matrix', 
            className: 'w-[140px] min-w-[140px]',
            render: (row) => {
                const count = Array.isArray(row.permissions) ? row.permissions.length : 0;
                return (
                    <div className="flex items-center min-h-[26px]">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                            <CheckCircle2 size={11} className="text-emerald-600" />
                            <span>{row.name.toLowerCase() === 'admin' ? 'Full access' : `${count || 'Configured'} modules`}</span>
                        </span>
                    </div>
                );
            } 
        },
        { 
            id: 'type', 
            label: 'Role Type', 
            className: 'w-[120px] min-w-[120px]',
            render: (row) => (
                <div className="flex items-center min-h-[26px]">
                    <Badge 
                        variant="secondary" 
                        className={
                            row.name.toLowerCase() === 'admin'
                                ? 'bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] font-semibold text-[10.5px] px-2 py-0.5 border border-orange-200/60 dark:border-orange-900/40'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10.5px] px-2 py-0.5 border border-slate-200 dark:border-slate-700'
                        }
                    >
                        {row.name.toLowerCase() === 'admin' ? 'Super admin' : 'Staff role'}
                    </Badge>
                </div>
            ) 
        }
    ];

    const [roleTypeFilter, setRoleTypeFilter] = useState('all');
    const [accessFilter, setAccessFilter] = useState('all');
    const [memberFilter, setMemberFilter] = useState('all');

    const handleResetFilters = () => {
        setRoleTypeFilter('all');
        setAccessFilter('all');
        setMemberFilter('all');
    };

    const isFiltered = roleTypeFilter !== 'all' || accessFilter !== 'all' || memberFilter !== 'all';

    const filteredRoles = useMemo(() => {
        return roles.filter(role => {
            const isSuper = role.name.toLowerCase() === 'admin' || role.name.toLowerCase() === 'super admin';

            // Role type filter
            if (roleTypeFilter === 'super_admin' && !isSuper) return false;
            if (roleTypeFilter === 'staff_role' && isSuper) return false;

            // Access level filter
            if (accessFilter === 'full_access' && !isSuper) return false;
            if (accessFilter === 'custom_modules' && isSuper) return false;

            // Member filter
            if (memberFilter === 'assigned' && (role.count || 0) <= 0) return false;
            if (memberFilter === 'unassigned' && (role.count || 0) > 0) return false;

            return true;
        });
    }, [roles, roleTypeFilter, accessFilter, memberFilter]);

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
                        onChange={(e: any) => {
                            const val = e?.target?.value !== undefined ? e.target.value : (e?.value !== undefined ? e.value : e);
                            setRoleTypeFilter(val);
                        }}
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
                        onChange={(e: any) => {
                            const val = e?.target?.value !== undefined ? e.target.value : (e?.value !== undefined ? e.value : e);
                            setAccessFilter(val);
                        }}
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
                        onChange={(e: any) => {
                            const val = e?.target?.value !== undefined ? e.target.value : (e?.value !== undefined ? e.value : e);
                            setMemberFilter(val);
                        }}
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

    const renderRoleCard = (role: RoleItem) => {
        const isSuper = role.name.toLowerCase() === 'admin' || role.name.toLowerCase() === 'super admin';
        const count = Array.isArray(role.permissions) ? role.permissions.length : 0;

        return (
            <div
                key={role.id}
                className="bg-white dark:bg-[#181d24] rounded-md border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-3.5 flex flex-col justify-between transition-all shadow-2xs group"
            >
                <div>
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                            <div className="w-7 h-7 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 flex items-center justify-center text-[#ff4a1f] shrink-0">
                                <Shield size={14} />
                            </div>
                            <div className="min-w-0">
                                <h4 
                                    onClick={() => setEditingRole(role)}
                                    className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate cursor-pointer group-hover:text-[#ff4a1f] transition-colors"
                                >
                                    {role.name}
                                </h4>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                    {isSuper ? 'Super Admin' : 'Staff Role'}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <Badge 
                                variant="secondary" 
                                className={
                                    isSuper
                                        ? 'bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] font-semibold text-[10px] px-1.5 py-0.2 border border-orange-200/60 dark:border-orange-900/40'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px] px-1.5 py-0.2 border border-slate-200 dark:border-slate-700'
                                }
                            >
                                {isSuper ? 'Default' : 'Custom'}
                            </Badge>
                            <RoleRowActions
                                row={role}
                                onEdit={setEditingRole}
                                onDelete={(r) => setDeletingRole(r)}
                            />
                        </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 min-h-[32px] mb-3 leading-relaxed">
                        {role.description}
                    </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
                        <Users size={12} className="text-slate-400" />
                        <span>{role.count} {role.count === 1 ? 'member' : 'members'}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200/60 dark:border-emerald-800/60">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>{isSuper ? 'Full access' : `${count || 'Configured'} modules`}</span>
                    </span>
                </div>
            </div>
        );
    };

    const actions = (row: RoleItem) => (
        <RoleRowActions
            row={row}
            onEdit={setEditingRole}
            onDelete={(r) => setDeletingRole(r)}
        />
    );

    return (
        <div className="space-y-4 font-sans h-auto">
            <DataTable 
                columns={columns} 
                data={filteredRoles} 
                compact={true}
                searchPlaceholder="Search roles by title, description, permissions..."
                hideViewToggle={false}
                renderGridCard={renderRoleCard}
                headerTabs={headerTabs}
                filterContent={filterContent}
                isLoading={isLoading}
                actions={actions}
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

            {/* Delete Role Confirmation Modal */}
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
