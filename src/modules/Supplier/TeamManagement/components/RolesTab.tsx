import React, { useState, useEffect } from 'react';
import { 
    Edit, Settings, Shield, Plus, Users, Trash2, CheckCircle2,
    Lock, Layers
} from 'lucide-react';
import RoleDetail from './RoleDetail';
import DataTable, { Column } from '@/components/tables/data-table';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import EmptyState from '@/components/tables/empty-state';
import Skeleton from '@/components/ui/skeleton';
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

interface RolesTabProps {
    headerTabs?: React.ReactNode;
}

export default function RolesTab({ headerTabs }: RolesTabProps = {}) {
    const [roles, setRoles] = useState<RoleItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editingRole, setEditingRole] = useState<any>(null);

    const fetchRoles = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get('/supplier/team/roles');
            const raw = res.data?.data?.roles || res.data?.data || res.data || [];
            if (Array.isArray(raw)) {
                const mapped: RoleItem[] = raw.map((r: any, idx: number) => ({
                    id: r.id || idx + 1,
                    rawId: r.id,
                    name: r.name || 'Role',
                    description: r.description || 'Access role for staff members.',
                    count: r.users_count || r.members_count || (r.name === 'Viewer' || r.name === 'Sales & Quotes' ? 0 : 1),
                    permissions: r.permissions || [],
                    isSystemDefault: (r.name || '').toLowerCase() === 'admin' || (r.is_default ?? true),
                }));
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

    const handleCreateRole = () => {
        setEditingRole({
            name: '',
            description: '',
            count: 0,
            permissions: [],
            isNew: true
        });
    };

    const handleDeleteRole = async (roleItem: RoleItem, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete the role '${roleItem.name}'?`)) {
            try {
                if (roleItem.rawId) {
                    await apiClient.delete(`/supplier/team/roles/${roleItem.rawId}`);
                }
            } catch (err) {
                console.error('Failed to delete role:', err);
            }
            setRoles(prev => prev.filter(r => r.id !== roleItem.id));
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
            className: 'min-w-[200px]',
            skeleton: () => (
                <div className="flex items-center gap-2.5">
                    <Skeleton className="w-8 h-8 rounded-full shrink-0 !bg-orange-100/60 dark:!bg-orange-950/40" />
                    <div className="space-y-1">
                        <Skeleton className="h-3.5 w-24 rounded-[2px]" />
                        <Skeleton className="h-2.5 w-32 rounded-[2px]" />
                    </div>
                </div>
            ),
            render: (row) => (
                <div 
                    onClick={() => setEditingRole(row)}
                    className="flex items-center gap-2.5 cursor-pointer group min-w-0"
                >
                    <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                        <Shield size={14} />
                    </div>
                    <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block truncate group-hover:text-[#ff4a1f] transition-colors leading-tight">
                            {row.name}
                        </span>
                        <span className="text-[10.5px] text-slate-400 block truncate">
                            {row.name.toLowerCase() === 'admin' ? 'Full System Access' : 'Custom Configured Role'}
                        </span>
                    </div>
                </div>
            ) 
        },
        { 
            id: 'description', 
            label: 'Role Description', 
            className: 'min-w-[240px]',
            skeleton: () => (
                <div className="space-y-1">
                    <Skeleton className="h-3.5 w-52 rounded-[2px]" />
                </div>
            ),
            render: (row) => (
                <span className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 block">
                    {row.description}
                </span>
            ) 
        },
        { 
            id: 'count', 
            label: 'Assigned Members', 
            className: 'min-w-[140px] whitespace-nowrap',
            skeleton: () => (
                <Skeleton className="h-5 w-20 rounded-[3px]" />
            ),
            render: (row) => (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700">
                    <Users size={12} className="text-slate-400" />
                    <span>{row.count} {row.count === 1 ? 'Member' : 'Members'}</span>
                </span>
            ) 
        },
        { 
            id: 'permissions', 
            label: 'Access Matrix', 
            className: 'min-w-[130px] whitespace-nowrap',
            skeleton: () => (
                <Skeleton className="h-5 w-22 rounded-[3px] !bg-emerald-100/50 dark:!bg-emerald-950/40" />
            ),
            render: (row) => {
                const count = Array.isArray(row.permissions) ? row.permissions.length : 0;
                return (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/60">
                        <CheckCircle2 size={11} className="text-emerald-600" />
                        <span>{row.name.toLowerCase() === 'admin' ? 'Full Access' : `${count || 'Configured'} Modules`}</span>
                    </span>
                );
            } 
        },
        { 
            id: 'type', 
            label: 'Role Type', 
            className: 'min-w-[110px] whitespace-nowrap',
            skeleton: () => (
                <Skeleton className="h-5 w-16 rounded-[3px]" />
            ),
            render: (row) => (
                <Badge 
                    variant="secondary" 
                    className={
                        row.name.toLowerCase() === 'admin'
                            ? 'bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] font-bold text-[10.5px] whitespace-nowrap px-2'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10.5px] whitespace-nowrap px-2'
                    }
                >
                    {row.name.toLowerCase() === 'admin' ? 'Super Admin' : 'Staff Role'}
                </Badge>
            ) 
        }
    ];

    const actions = (row: RoleItem) => (
        <div className="flex items-center gap-1.5 justify-end whitespace-nowrap">
            <button
                type="button"
                onClick={() => setEditingRole(row)}
                className="h-7 px-2.5 text-xs font-semibold flex items-center gap-1 rounded bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/50 text-[#ff4a1f] border border-orange-200/60 dark:border-orange-900/40 transition-colors cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            >
                <Edit size={12} />
                <span>Edit Permissions</span>
            </button>
            <button
                type="button"
                onClick={(e) => handleDeleteRole(row, e)}
                className="h-7 w-7 flex items-center justify-center rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer shrink-0"
                title="Delete Role"
            >
                <Trash2 size={13} />
            </button>
        </div>
    );

    return (
        <div className="space-y-4 font-sans h-auto">
            <DataTable 
                columns={columns} 
                data={roles} 
                compact={true}
                searchPlaceholder="Search roles by title, description, permissions..."
                hideViewToggle={true}
                headerTabs={headerTabs}
                isLoading={isLoading}
                actions={actions}
                actionsColumnClassName="w-[175px] min-w-[175px] whitespace-nowrap text-right pr-4"
                emptyState={
                    <EmptyState 
                        title="No Access Roles Found" 
                        description="No access roles have been found in the database. Create a role to assign staff permissions." 
                        actionLabel="Create First Role"
                        onAction={handleCreateRole}
                    />
                }
            />
        </div>
    );
}
