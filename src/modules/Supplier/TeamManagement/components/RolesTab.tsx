import React, { useState } from 'react';
import { Shield, Plus, Edit, Settings, Truck, Users, Package, Car, CreditCard, Headphones, Briefcase, Eye } from 'lucide-react';
import Button from '@/components/ui/button';
import RoleDetail from './RoleDetail';

export default function RolesTab() {
    const [editingRole, setEditingRole] = useState<any>(null);
    const roles = [
        { name: 'Admin', description: 'Full access to all modules and settings.', count: 2, icon: Settings },
        { name: 'Operations Manager', description: 'Can manage orders, quotes, and shipments.', count: 3, icon: Briefcase },
        { name: 'Dispatcher', description: 'Can assign drivers and track active jobs.', count: 5, icon: Truck },
        { name: 'Warehouse Manager', description: 'Manage inventory and warehouse staff.', count: 2, icon: Package },
        { name: 'Driver Manager', description: 'Manage drivers and fleet.', count: 1, icon: Car },
        { name: 'Finance', description: 'Access to earnings, payments, and withdrawal.', count: 2, icon: CreditCard },
        { name: 'Customer Support', description: 'Can view orders and chat with customers.', count: 4, icon: Headphones },
        { name: 'Sales', description: 'Can submit quotes and negotiate.', count: 3, icon: Users },
        { name: 'Viewer', description: 'Read-only access to basic data.', count: 10, icon: Eye },
    ];

    if (editingRole) {
        return <RoleDetail role={editingRole} onBack={() => setEditingRole(null)} />;
    }

    return (
        <div className="space-y-4 min-h-[500px]">

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {roles.map((role, idx) => {
                    const Icon = role.icon;
                    return (
                        <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex flex-col items-start w-full shadow-sm">
                            <div className="flex justify-between items-start w-full mb-3">
                                <div className="w-9 h-9 rounded-md shrink-0 flex items-center justify-center bg-indigo-50 text-indigo-600">
                                    <Icon size={18} strokeWidth={2} />
                                </div>
                                <span className="text-[18px] font-bold text-slate-700">{role.count}</span>
                            </div>
                        <h3 className="font-semibold text-[14px] text-slate-800 leading-tight mb-0.5">
                            {role.name}
                        </h3>
                        <p className="text-[12px] text-slate-500 leading-snug mb-4">
                            {role.description}
                        </p>
                        
                        <div className="mt-auto w-full flex items-center justify-end">
                            <button 
                                onClick={() => setEditingRole(role)}
                                className="text-[12px] font-medium text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1.5"
                            >
                                <Edit size={12} />
                                Edit Permissions
                            </button>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
}
