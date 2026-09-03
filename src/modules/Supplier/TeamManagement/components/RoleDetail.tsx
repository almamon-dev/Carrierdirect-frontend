import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, Shield, Users, Save, Loader2, ShieldOff, Check,
    Package, Truck, FileText, DollarSign, UserCheck, Settings as SettingsIcon,
    Layers, Lock, Database
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Switch from '@/components/ui/switch';
import Badge from '@/components/ui/badge';
import { apiClient } from '@/lib/axios';

interface ModulePermission {
    id: string;
    name: string;
    description: string;
    category?: string;
    icon?: any;
}

// Smart parser for backend permission strings
const parsePermission = (p: any): ModulePermission => {
    let rawName = p.name || p.label || p.id || '';
    let rawDesc = p.description || p.desc || '';

    let cleanName = rawName;
    let cleanDesc = rawDesc;

    // If string is "Manage and configure Orders & Shipments access permissions"
    const regex = /Manage\s+and\s+configure\s+(.+?)\s+access\s+permissions/i;
    const matchName = rawName.match(regex);
    const matchDesc = rawDesc.match(regex);

    if (matchName) {
        cleanName = matchName[1];
        cleanDesc = rawDesc && rawDesc !== rawName ? rawDesc : `Full access, tracking and management for ${cleanName}.`;
    } else if (matchDesc) {
        cleanName = matchDesc[1];
        cleanDesc = rawDesc;
    } else {
        cleanName = cleanName.replace(/_/g, ' ').replace(/-/g, ' ');
    }

    // Capitalize words
    cleanName = cleanName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    if (!cleanDesc) {
        cleanDesc = `Full access and management for ${cleanName}.`;
    }

    // Assign appropriate icon
    const lower = cleanName.toLowerCase();
    let icon = Layers;
    if (lower.includes('order') || lower.includes('shipment')) icon = Package;
    else if (lower.includes('quote') || lower.includes('bid')) icon = FileText;
    else if (lower.includes('fleet') || lower.includes('driver')) icon = Truck;
    else if (lower.includes('finance') || lower.includes('invoice') || lower.includes('payment')) icon = DollarSign;
    else if (lower.includes('team') || lower.includes('staff') || lower.includes('user')) icon = Users;
    else if (lower.includes('setting') || lower.includes('compliance')) icon = SettingsIcon;

    return {
        id: p.id || p.key || cleanName.toLowerCase().replace(/\s+/g, '_'),
        name: cleanName,
        description: cleanDesc,
        category: p.category || 'Platform Modules',
        icon
    };
};

export default function RoleDetail({ 
    role, 
    onBack, 
    onRoleUpdated 
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

    // Dynamic modules list fetched from backend
    const [modules, setModules] = useState<ModulePermission[]>([]);
    const [isLoadingModules, setIsLoadingModules] = useState(true);

    // Active permissions map (module.id -> boolean)
    const [permissions, setPermissions] = useState<Record<string, boolean>>({});

    // 1. Fetch available system permissions from database
    useEffect(() => {
        let isMounted = true;
        async function fetchSystemPermissions() {
            setIsLoadingModules(true);
            try {
                const res = await apiClient.get('/supplier/team/permissions');
                const rawPerms = res.data?.data?.permissions || res.data?.data || res.data || [];
                
                if (Array.isArray(rawPerms) && rawPerms.length > 0 && isMounted) {
                    const parsed = rawPerms.map(parsePermission);
                    setModules(parsed);
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

    // 2. Initialize permissions for this role once modules or role changes
    useEffect(() => {
        const initial: Record<string, boolean> = {};
        const rolePerms = Array.isArray(role.permissions) ? role.permissions : [];

        modules.forEach(mod => {
            initial[mod.id] = rolePerms.includes(mod.id) || 
                              rolePerms.some((p: any) => (p.id || p.key || p.name || p) === mod.id) ||
                              (role.name === 'Admin');
        });
        setPermissions(initial);
    }, [modules, role]);

    // 3. Fetch dynamic assigned team members from backend
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
        setPermissions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const activePerms = Object.keys(permissions).filter(k => permissions[k]);
            const payload = {
                name: roleName,
                description: description,
                permissions: activePerms
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
        <div className="bg-white dark:bg-[#12161c] rounded-md border border-[#ebebeb] dark:border-slate-800 shadow-none font-sans h-auto">
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
                
                {/* Left Column: Role Details & Assigned Users */}
                <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 space-y-3.5 h-auto">
                    {/* Role Details Form Card */}
                    <div className="bg-slate-50/70 dark:bg-[#181d24] rounded-md border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-3">
                        <div className="flex items-center gap-1.5 pb-2 border-b border-slate-200/70 dark:border-slate-800">
                            <Shield size={14} className="text-[#ff4a1f]" />
                            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                Role Information
                            </h3>
                        </div>

                        <div className="space-y-2.5">
                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Role Name *
                                </label>
                                <Input 
                                    value={roleName} 
                                    onChange={(e) => setRoleName(e.target.value)} 
                                    placeholder="e.g. Operations Specialist"
                                    className="h-8 text-xs bg-white dark:bg-[#12161c]" 
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Description
                                </label>
                                <textarea 
                                    className="w-full text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#12161c] dark:text-slate-200 rounded-md p-2 focus:outline-none focus:border-[#ff4a1f] min-h-[60px] resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe access privileges for this role..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Assigned Members Card */}
                    <div className="bg-slate-50/70 dark:bg-[#181d24] rounded-md border border-slate-200/80 dark:border-slate-800 p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 dark:border-slate-800">
                            <div className="flex items-center gap-1.5">
                                <Users size={14} className="text-[#ff4a1f]" />
                                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                    Assigned Staff Members
                                </h3>
                            </div>
                            <span className="text-[10px] font-bold bg-white dark:bg-[#12161c] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-1.5 py-0.2 rounded">
                                {assignedUsers.length}
                            </span>
                        </div>

                        {isLoadingUsers ? (
                            <div className="py-4 flex items-center justify-center text-slate-400 text-xs gap-1.5">
                                <Loader2 size={13} className="animate-spin text-[#ff4a1f]" /> Loading members...
                            </div>
                        ) : assignedUsers.length === 0 ? (
                            <p className="text-[11px] text-slate-400 py-2 text-center">
                                No staff members currently assigned to this role.
                            </p>
                        ) : (
                            <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                                {assignedUsers.map((user, idx) => (
                                    <div key={user.id || idx} className="flex items-center gap-2.5 p-2 rounded bg-white dark:bg-[#12161c] border border-slate-200/60 dark:border-slate-800">
                                        <div className="w-7 h-7 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center font-bold text-[11px] shrink-0">
                                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[11.5px] font-bold text-slate-900 dark:text-slate-100 truncate leading-none">
                                                {user.name || 'Staff Member'}
                                            </p>
                                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Module Access & Permissions Matrix */}
                <div className="flex-1 w-full min-w-0 bg-white dark:bg-[#12161c] rounded-md border border-slate-200/80 dark:border-slate-800 shadow-none overflow-hidden h-auto">
                    {/* Header */}
                    <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181d24]/50 flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                Module Access & Permissions Matrix
                            </h3>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Enable or restrict operational modules and visibility for this access role.
                            </p>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#12161c] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {modules.length} Modules Available
                        </span>
                    </div>

                    {isLoadingModules ? (
                        <div className="p-12 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                            <Loader2 size={22} className="animate-spin text-[#FF4A1F]" />
                            <span className="text-xs font-medium">Fetching permission modules from database...</span>
                        </div>
                    ) : modules.length === 0 ? (
                        <div className="p-12 flex flex-col items-center justify-center text-center space-y-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                                <ShieldOff size={18} />
                            </div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">No Permissions Found</h4>
                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 max-w-xs">
                                No permission modules found in the database.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-slate-100 dark:divide-slate-800">
                            {modules.map((module) => {
                                const Icon = module.icon || Layers;
                                const isAllowed = permissions[module.id] ?? false;

                                return (
                                    <div 
                                        key={module.id} 
                                        className="flex items-center justify-between p-3.5 border-b border-r border-slate-100 dark:border-slate-800/80 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors gap-3"
                                    >
                                        <div className="flex items-start gap-2.5 min-w-0 pr-2">
                                            <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                                isAllowed 
                                                    ? 'bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f]' 
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                            }`}>
                                                <Icon size={15} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                                                        {module.name}
                                                    </h4>
                                                    {isAllowed && (
                                                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.2 rounded">
                                                            Allowed
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-1 mt-0.5">
                                                    {module.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="scale-90 shrink-0">
                                            <Switch 
                                                checked={isAllowed} 
                                                onCheckedChange={() => togglePermission(module.id)} 
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
