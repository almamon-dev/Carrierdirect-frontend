import React, { useState, useEffect } from 'react';
import { Edit, Settings, Truck, Users, Package, Car, CreditCard, Headphones, Briefcase, Eye } from 'lucide-react';
import RoleDetail from './RoleDetail';
import { apiClient } from '@/lib/axios';

const DEFAULT_ROLES = [
    { name: 'Admin', description: 'Full access to all modules and settings.', count: 1, icon: Settings },
    { name: 'Operations Manager', description: 'Can manage orders, quotes, and shipments.', count: 0, icon: Briefcase },
    { name: 'Dispatcher', description: 'Can assign drivers and track active jobs.', count: 0, icon: Truck },
    { name: 'Driver Manager', description: 'Manage drivers and fleet operations.', count: 0, icon: Car },
    { name: 'Finance & Billing', description: 'Access to earnings, payments, and invoices.', count: 0, icon: CreditCard },
    { name: 'Customer Support', description: 'Can view orders and assist customers.', count: 0, icon: Headphones },
    { name: 'Sales & Quotes', description: 'Can submit quotes and negotiate rates.', count: 0, icon: Users },
    { name: 'Viewer', description: 'Read-only access to basic data.', count: 0, icon: Eye },
];

export default function RolesTab() {
    const [roles, setRoles] = useState<any[]>(DEFAULT_ROLES);
    const [editingRole, setEditingRole] = useState<any>(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchRoles() {
            try {
                const res = await apiClient.get('/supplier/team/roles');
                const raw = res.data?.data?.roles || res.data?.data || res.data || [];
                if (Array.isArray(raw) && raw.length > 0 && isMounted) {
                    const mapped = raw.map((r: any) => ({
                        id: r.id,
                        name: r.name,
                        description: r.description || 'Access role for staff.',
                        count: r.users_count || r.members_count || 0,
                        icon: Settings,
                        permissions: r.permissions || [],
                    }));
                    setRoles(mapped);
                }
            } catch (err) {
                console.error('Failed to fetch roles from API:', err);
            }
        }
        fetchRoles();
        return () => { isMounted = false; };
    }, []);

    if (editingRole) {
        return <RoleDetail role={editingRole} onBack={() => setEditingRole(null)} />;
    }

    return (
        <div className="space-y-4 min-h-[500px]">
            {/* Compact Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {roles.map((role, idx) => {
                    const Icon = role.icon || Settings;
                    return (
                        <div 
                            key={idx} 
                            onClick={() => setEditingRole(role)}
                            className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col items-start cursor-pointer w-full shadow-2xs"
                        >
                            <div className="flex justify-between items-start w-full mb-3">
                                <div className="w-9 h-9 rounded-md shrink-0 flex items-center justify-center bg-brand-light dark:bg-[#ff4a1f]/15 text-brand">
                                    <Icon size={18} strokeWidth={2} />
                                </div>
                                <span className="text-[18px] font-bold text-slate-700 dark:text-slate-200">{role.count}</span>
                            </div>
                            <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                                {role.name}
                            </h3>
                            <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-snug mb-4">
                                {role.description}
                            </p>
                            
                            <div className="mt-auto w-full flex items-center justify-end">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingRole(role);
                                    }}
                                    className="text-[12px] font-medium text-brand hover:underline flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Edit size={12} />
                                    Edit Permissions
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
