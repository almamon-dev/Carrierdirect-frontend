import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { RoleItem } from '../components/RoleRowActions';

export function useRolesData(isCreatingRole?: boolean, onResetCreating?: () => void) {
    const showToast = useToastStore((state) => state.showToast);
    const [roles, setRoles] = useState<RoleItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editingRole, setEditingRole] = useState<any>(null);
    const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null);

    const [roleTypeFilter, setRoleTypeFilter] = useState('all');
    const [accessFilter, setAccessFilter] = useState('all');
    const [memberFilter, setMemberFilter] = useState('all');

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

    const handleCreateRole = () => {
        setEditingRole({
            name: '',
            description: '',
            count: 0,
            permissions: [],
            isNew: true,
        });
    };

    useEffect(() => {
        if (isCreatingRole) {
            handleCreateRole();
            if (onResetCreating) onResetCreating();
        }
    }, [isCreatingRole, onResetCreating]);

    const handleConfirmDelete = async () => {
        if (!deletingRole) return;
        try {
            if (deletingRole.rawId) {
                await apiClient.delete(`/supplier/team/roles/${deletingRole.rawId}`);
            }
            setRoles((prev) => prev.filter((r) => r.id !== deletingRole.id));
            showToast(`Role '${deletingRole.name}' deleted successfully`, 'success');
        } catch (err: any) {
            console.error('Failed to delete role:', err);
            showToast(err.response?.data?.message || 'Failed to delete role', 'error');
        } finally {
            setDeletingRole(null);
        }
    };

    const handleResetFilters = () => {
        setRoleTypeFilter('all');
        setAccessFilter('all');
        setMemberFilter('all');
    };

    const isFiltered = roleTypeFilter !== 'all' || accessFilter !== 'all' || memberFilter !== 'all';

    const filteredRoles = useMemo(() => {
        return roles.filter((role) => {
            const isSuper = role.name.toLowerCase() === 'admin' || role.name.toLowerCase() === 'super admin';

            if (roleTypeFilter === 'super_admin' && !isSuper) return false;
            if (roleTypeFilter === 'staff_role' && isSuper) return false;

            if (accessFilter === 'full_access' && !isSuper) return false;
            if (accessFilter === 'custom_modules' && isSuper) return false;

            if (memberFilter === 'assigned' && (role.count || 0) <= 0) return false;
            if (memberFilter === 'unassigned' && (role.count || 0) > 0) return false;

            return true;
        });
    }, [roles, roleTypeFilter, accessFilter, memberFilter]);

    return {
        roles,
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
    };
}
