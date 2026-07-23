import React, { useState } from 'react';
import { Eye, Shield, UserCheck, Mail, Phone, Building, Truck, Package, X } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import DataTable, { Column } from '@/components/tables/data-table';

export interface TeamMember {
    id: string;
    name: string;
    avatar: string;
    role: string;
    department: string;
    designation: string;
    email: string;
    phone: string;
    status: 'Active' | 'On Leave' | 'Inactive';
    lastLogin: string;
    location: string;
    assignedVehicle: string;
    clearance: string;
}

export default function TeamMembersTab() {
    const [selectedDept, setSelectedDept] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedMemberModal, setSelectedMemberModal] = useState<TeamMember | null>(null);

    const members: TeamMember[] = [
        { 
            id: 'EMP-001', 
            name: 'John Doe', 
            avatar: 'JD', 
            role: 'Admin', 
            department: 'Operations', 
            designation: 'Operations Manager', 
            email: 'john@abclogistics.com', 
            phone: '+1 (555) 234-5678', 
            status: 'Active', 
            lastLogin: '10 mins ago',
            location: 'Main HQ - Dhaka',
            assignedVehicle: 'HQ Command Desk',
            clearance: 'Level 3 - Full Admin'
        },
        { 
            id: 'EMP-002', 
            name: 'Jane Smith', 
            avatar: 'JS', 
            role: 'Dispatcher', 
            department: 'Operations', 
            designation: 'Senior Freight Dispatcher', 
            email: 'jane@abclogistics.com', 
            phone: '+1 (555) 876-5432', 
            status: 'Active', 
            lastLogin: '1 hour ago',
            location: 'Central Dispatch Hub',
            assignedVehicle: 'Dispatcher Station #4',
            clearance: 'Level 2 - Dispatcher'
        },
        { 
            id: 'EMP-003', 
            name: 'Mike Ross', 
            avatar: 'MR', 
            role: 'Driver', 
            department: 'Fleet', 
            designation: 'Heavy Fleet Operator', 
            email: 'mike@abclogistics.com', 
            phone: '+1 (555) 345-6789', 
            status: 'On Leave', 
            lastLogin: 'Jul 15, 2026',
            location: 'Chittagong Port Fleet',
            assignedVehicle: 'Volvo FH16 (TRK-9921)',
            clearance: 'Level 1 - Heavy Vehicle'
        },
        { 
            id: 'EMP-004', 
            name: 'Sarah Lee', 
            avatar: 'SL', 
            role: 'Warehouse Head', 
            department: 'Warehouse', 
            designation: 'Inventory Lead', 
            email: 'sarah@abclogistics.com', 
            phone: '+1 (555) 987-6543', 
            status: 'Active', 
            lastLogin: 'Today, 08:30 AM',
            location: 'Warehouse Facility B',
            assignedVehicle: 'Forklift & Inventory Bay 2',
            clearance: 'Level 2 - Warehouse'
        },
        { 
            id: 'EMP-005', 
            name: 'Alex Rivera', 
            avatar: 'AR', 
            role: 'Finance Manager', 
            department: 'Finance', 
            designation: 'Billing & Escrow Analyst', 
            email: 'alex@abclogistics.com', 
            phone: '+1 (555) 456-7890', 
            status: 'Active', 
            lastLogin: 'Yesterday, 04:15 PM',
            location: 'Finance Desk',
            assignedVehicle: 'Stripe Escrow Terminal',
            clearance: 'Level 2 - Escrow Access'
        },
        { 
            id: 'EMP-006', 
            name: 'David Chen', 
            avatar: 'DC', 
            role: 'Fleet Specialist', 
            department: 'Fleet', 
            designation: 'Fleet Maintenance Supv.', 
            email: 'david@abclogistics.com', 
            phone: '+1 (555) 654-3210', 
            status: 'Inactive', 
            lastLogin: 'Jun 28, 2026',
            location: 'Depot Yard',
            assignedVehicle: 'Service Van #09',
            clearance: 'Level 1 - Depot'
        },
    ];

    const filteredMembers = members.filter((member) => {
        const matchesDept = selectedDept === 'all' || member.department.toLowerCase() === selectedDept.toLowerCase();
        const matchesStatus = selectedStatus === 'all' || member.status.toLowerCase() === selectedStatus.toLowerCase();
        return matchesDept && matchesStatus;
    });

    const columns: Column<TeamMember>[] = [
        { 
            id: 'id', 
            label: 'Employee ID', 
            render: (row) => (
                <button 
                    onClick={() => setSelectedMemberModal(row)}
                    className="font-bold text-slate-900 hover:text-[#ff4a1f] hover:underline text-left"
                >
                    {row.id}
                </button>
            ) 
        },
        { 
            id: 'name', 
            label: 'Member Name', 
            render: (row) => (
                <div>
                    <p className="font-bold text-slate-900">{row.name}</p>
                    <p className="text-[11px] text-slate-400">{row.email}</p>
                </div>
            ) 
        },
        { 
            id: 'role', 
            label: 'Role & Scope', 
            render: (row) => (
                <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                        <Shield size={13} className="text-slate-500" />
                        <span>{row.role}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{row.designation}</p>
                </div>
            ) 
        },
        { 
            id: 'department', 
            label: 'Department', 
            render: (row) => (
                <span className="text-xs font-semibold text-slate-800">{row.department}</span>
            ) 
        },
        { 
            id: 'phone', 
            label: 'Contact', 
            render: (row) => (
                <span className="text-xs font-bold text-slate-900">{row.phone}</span>
            ) 
        },
        { 
            id: 'status', 
            label: 'Status', 
            render: (row) => (
                <Badge variant="secondary" className={
                    row.status === 'Active' ? 'bg-emerald-50 text-emerald-700 font-semibold' :
                    row.status === 'On Leave' ? 'bg-amber-50 text-amber-700 font-semibold' :
                    'bg-red-50 text-red-700 font-semibold'
                }>
                    {row.status}
                </Badge>
            )
        },
        { 
            id: 'lastLogin', 
            label: 'Last Active', 
            render: (row) => (
                <span className="text-[11px] font-semibold text-slate-500">{row.lastLogin}</span>
            ) 
        }
    ];

    const renderActions = (row: TeamMember) => (
        <div className="flex items-center justify-end gap-2">
            <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-xs px-2.5 font-semibold"
                onClick={() => setSelectedMemberModal(row)}
            >
                <Eye size={13} className="mr-1" /> View Details
            </Button>
        </div>
    );

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Department Filter</label>
                <Select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} showSearch={false}>
                    <option value="all">All Departments</option>
                    <option value="operations">Operations</option>
                    <option value="fleet">Fleet</option>
                    <option value="warehouse">Warehouse</option>
                    <option value="finance">Finance</option>
                </Select>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600">Status Filter</label>
                <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} showSearch={false}>
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="on leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="space-y-5">
            <DataTable 
                columns={columns} 
                data={filteredMembers} 
                compact={true}
                searchPlaceholder="Search by member name, email, role or ID..."
                hideViewToggle={true}
                actions={renderActions}
                filterContent={filterContent}
            />

            {/* Member Details Modal matching exact app design */}
            {selectedMemberModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
                    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden border border-slate-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <div>
                                <h3 className="text-base font-bold text-slate-900">{selectedMemberModal.name}</h3>
                                <p className="text-xs text-slate-500 font-medium">{selectedMemberModal.designation} • {selectedMemberModal.id}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedMemberModal(null)}
                                className="p-1 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div>
                                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Role</span>
                                    <span className="font-bold text-slate-900">{selectedMemberModal.role}</span>
                                </div>
                                <div>
                                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Department</span>
                                    <span className="font-bold text-slate-900">{selectedMemberModal.department}</span>
                                </div>
                                <div>
                                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</span>
                                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-semibold mt-0.5">
                                        {selectedMemberModal.status}
                                    </Badge>
                                </div>
                                <div>
                                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Clearance</span>
                                    <span className="font-bold text-slate-900">{selectedMemberModal.clearance}</span>
                                </div>
                            </div>

                            <div className="space-y-2 border-t border-slate-100 pt-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Email Address:</span>
                                    <span className="font-bold text-slate-900">{selectedMemberModal.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Phone Contact:</span>
                                    <span className="font-bold text-slate-900">{selectedMemberModal.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Location Hub:</span>
                                    <span className="font-bold text-slate-900">{selectedMemberModal.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Assigned Vehicle / Station:</span>
                                    <span className="font-bold text-[#ff4a1f]">{selectedMemberModal.assignedVehicle}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Last Active:</span>
                                    <span className="font-semibold text-slate-700">{selectedMemberModal.lastLogin}</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <Button 
                                variant="outline" 
                                size="sm"
                                className="h-8 text-xs px-4"
                                onClick={() => setSelectedMemberModal(null)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
