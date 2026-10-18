import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import { apiClient } from '@/lib/axios';
import { ModulePermission, parsePermission } from '../utils/permissionParser';
import { RoleDetailSidebar } from './RoleDetailSidebar';
import { RolePermissionMatrix } from './RolePermissionMatrix';

export default function RoleDetail({
    role,
    onBack,
    onRoleUpdated,
}: {
    role: any;
    onBack: () => void;
    onRoleUpdated?: () => void;
}) {
    const [roleName, setRoleName] = useState(role.name || '');
    const [description, setDescription] = useState(role.description || '');
    const [assignedUsers, setAssignedUsers] = useState<any[]>(role.users || []);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [modules, setModules] = useState<ModulePermission[]>([]);
    const [isLoadingModules, setIsLoadingModules] = useState(true);
    const [permissions, setPermissions] = useState<Record<string, boolean>>({});

    useEffect(() => {
        let isMounted = true;
        async function fetchSystemPermissions() {
            setIsLoadingModules(true);
            try {
                const res = await apiClient.get('/supplier/team/permissions');
                const rawPerms = res.data?.data?.permissions || res.data?.data || res.data || [];
                if (Array.isArray(rawPerms) && rawPerms.length > 0 && isMounted) {
                    setModules(rawPerms.map(parsePermission));
                } else {
                    setModules([]);
                }
            } catch (err) {
                console.error('Failed to fetch permissions from database:', err);
                setModules([]);
            } finally {
                if (isMounted) setIsLoadingModules(false);
            }
        }
        fetchSystemPermissions();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        const initial: Record<string, boolean> = {};
        const rolePerms = Array.isArray(role.permissions) ? role.permissions : [];

        modules.forEach((mod) => {
            initial[mod.id] =
                rolePerms.includes(mod.id) ||
                rolePerms.some((p: any) => (p.id || p.key || p.name || p) === mod.id) ||
                role.name === 'Admin';
        });
        setPermissions(initial);
    }, [modules, role]);

    useEffect(() => {
        let isMounted = true;
        async function fetchAssignedUsers() {
            setIsLoadingUsers(true);
            try {
                const res = await apiClient.get('/supplier/team/members');
                const list = res.data?.data?.members || res.data?.data || res.data || [];
                if (Array.isArray(list) && isMounted) {
                    const filtered = list.filter((m: any) => {
                        const mRole = (m.role || m.system_role || '').toLowerCase();
                        const rName = (role.name || '').toLowerCase();
                        return rName && (mRole.includes(rName) || rName.includes(mRole));
                    });
                    setAssignedUsers(filtered);
                } else {
                    setAssignedUsers([]);
                }
            } catch (err) {
                console.error('Failed to load assigned users:', err);
                setAssignedUsers([]);
            } finally {
                if (isMounted) setIsLoadingUsers(false);
            }
        }
        fetchAssignedUsers();
        return () => { isMounted = false; };
    }, [role.name]);

    const togglePermission = (id: string) => {
        setPermissions((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const activePerms = Object.keys(permissions).filter((k) => permissions[k]);
            const payload = {
                name: roleName,
                description,
                permissions: activePerms,
            };

            if (role.id) {
                await apiClient.put(`/supplier/team/roles/${role.id}`, payload);
            } else {
                await apiClient.post('/supplier/team/roles', payload);
            }
            onRoleUpdated?.();
            onBack();
        } catch (err) {
            console.error('Failed to save role to database:', err);
            onRoleUpdated?.();
            onBack();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#12161c] rounded-lg border border-slate-200 dark:border-slate-800 shadow-none font-sans h-auto">
            {/* Clean Sub-Header */}
            <div className="px-4 py-3 border-b border-[#ebebeb] dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onBack}
                        className="h-8 px-2.5 text-xs font-semibold gap-1.5 text-slate-700 dark:text-slate-200 hover:text-slate-900 border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs rounded"
                    >
                        <ArrowLeft size={14} />
                        <span>Back</span>
                    </Button>
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">
                            {roleName || 'New Custom Role'}
                        </h2>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] border border-orange-200/60 dark:border-orange-900/40">
                            RBAC Matrix
                        </span>
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="sm"
                    className="gap-1.5 h-8 px-3.5 text-xs font-semibold shadow-2xs bg-[#FF4A1F] hover:bg-[#E03E15] text-white cursor-pointer rounded"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </Button>
            </div>

            {/* 2-Column Clean Structured Layout */}
            <div className="p-4 md:p-5 flex flex-col lg:flex-row items-start gap-4 h-auto">
                <RoleDetailSidebar
                    roleName={roleName}
                    setRoleName={setRoleName}
                    description={description}
                    setDescription={setDescription}
                    assignedUsers={assignedUsers}
                    isLoadingUsers={isLoadingUsers}
                />
                <RolePermissionMatrix
                    modules={modules}
                    isLoadingModules={isLoadingModules}
                    permissions={permissions}
                    togglePermission={togglePermission}
                />
            </div>
        </div>
    );
}
