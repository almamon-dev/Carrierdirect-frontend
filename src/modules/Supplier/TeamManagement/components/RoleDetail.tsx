import React, { useState } from 'react';
import { ArrowLeft, Shield, Users, Save, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Switch from '@/components/ui/switch';
import Badge from '@/components/ui/badge';

const ALL_MODULES = [
    { id: 'orders', name: 'Orders', description: 'View, create, and manage orders' },
    { id: 'quotes', name: 'Quotes', description: 'Submit and negotiate quotes' },
    { id: 'shipments', name: 'Shipments', description: 'Track and manage active shipments' },
    { id: 'fleet', name: 'Fleet', description: 'Manage vehicles and maintenance' },
    { id: 'drivers', name: 'Drivers', description: 'Manage driver profiles and assignments' },
    { id: 'customers', name: 'Customers', description: 'View customer directory and interactions' },
    { id: 'payments', name: 'Payments', description: 'View earnings and manage withdrawals' },
    { id: 'reports', name: 'Reports', description: 'Access analytics and reporting' },
    { id: 'settings', name: 'Settings', description: 'Manage company and system settings' },
];

export default function RoleDetail({ role, onBack }: { role: any, onBack: () => void }) {
    // Dummy assigned users for demonstration
    const assignedUsers = [
        { id: 1, name: 'John Doe', email: 'john@abclogistics.com' },
        { id: 2, name: 'Sarah Lee', email: 'sarah@abclogistics.com' },
    ];

    const [permissions, setPermissions] = useState<Record<string, boolean>>(
        ALL_MODULES.reduce((acc, mod) => ({ ...acc, [mod.id]: role.name === 'Admin' || Math.random() > 0.5 }), {})
    );

    const togglePermission = (id: string) => {
        setPermissions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-[15px] font-bold text-slate-800">{role.name}</h2>
                            <Badge variant="secondary" className="bg-brand-light text-indigo-700 h-5 px-1.5 text-[10px]">Role Edit</Badge>
                        </div>
                        <p className="text-[12px] text-slate-500 mt-1">Modify permissions and view assigned users.</p>
                    </div>
                </div>
                <Button variant="primary" className="gap-2">
                    <Save size={16} />
                    <span>Save Changes</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Left Column: Role Details & Users */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                        <h3 className="text-[13px] font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                            <Shield size={14} className="text-brand" />
                            Role Details
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Role Name</label>
                                <Input defaultValue={role.name} className="h-9" />
                            </div>
                            <div>
                                <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">Description</label>
                                <textarea 
                                    className="w-full text-[13px] border border-slate-200 rounded-md p-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[60px]"
                                    defaultValue={role.description}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5">
                                <Users size={14} className="text-brand" />
                                Assigned Users
                            </h3>
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{assignedUsers.length}</span>
                        </div>
                        <div className="space-y-3">
                            {assignedUsers.map(user => (
                                <div key={user.id} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-900 leading-tight">{user.name}</p>
                                        <p className="text-[11px] text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Permissions Matrix */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-[13px] font-bold text-slate-800">Module Access & Permissions</h3>
                            <p className="text-[12px] text-slate-500 mt-0.5">Toggle which modules this role can access and manage.</p>
                        </div>
                        
                        <div className="p-0 flex-1 grid grid-cols-1 md:grid-cols-2">
                            {ALL_MODULES.map((module, index) => (
                                <div key={module.id} className="flex items-center justify-between p-3 border-b border-r border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div>
                                        <h4 className="text-[13px] font-bold text-slate-900">{module.name}</h4>
                                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{module.description}</p>
                                    </div>
                                    <Switch 
                                        checked={permissions[module.id]} 
                                        onCheckedChange={() => togglePermission(module.id)} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
