import React, { useState, useEffect } from 'react';
import { Eye, Shield, UserCheck, Mail, Phone, Building, Truck, Package, X } from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Select from '@/components/ui/select';
import DataTable, { Column } from '@/components/tables/data-table';
import { TeamMember } from '../types/team.types';
import { apiClient } from '@/lib/axios';

export default function TeamMembersTab() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedDept, setSelectedDept] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedMemberModal, setSelectedMemberModal] = useState<TeamMember | null>(null);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get('/supplier/team/members');
            const raw = res.data?.data?.members || res.data?.data || res.data || [];
            const resArray = Array.isArray(raw) ? raw : [];

            const mapped: TeamMember[] = resArray.map((m: any) => ({
                id: m.employee_id || (m.id ? `EMP-${m.id}` : `EMP-${m.slug || '000'}`),
                rawId: m.id,
                name: m.name || m.user?.name || 'Staff Member',
                avatar: (m.name || 'SM').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
                role: m.role?.name || m.role || 'Dispatcher',
                department: m.department || 'Operations',
                designation: m.designation || 'Staff',
                email: m.email || m.user?.email || 'staff@example.com',
                phone: m.phone || m.user?.phone || '+44 7700 900111',
                status: (m.status === 'active' ? 'Active' : m.status === 'on_leave' ? 'On Leave' : (m.status || 'Active')) as any,
                lastLogin: m.last_login_at ? new Date(m.last_login_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Recently',
                location: m.location || 'Main Depot',
                assignedVehicle: m.assigned_vehicle || m.vehicle?.name || 'Station #1',
                clearance: m.clearance || 'Level 1 - Standard',
            }));

            setMembers(mapped);
        } catch (err) {
            console.error('Failed to fetch team members:', err);
            setMembers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

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
                    className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#ff4a1f] hover:underline text-left cursor-pointer"
                >
                    {row.id}
                </button>
            )
        },
        {
            id: 'name',
            label: 'Team Member',
            render: (row) => (
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-xs shrink-0">
                        {row.avatar}
                    </div>
                    <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block text-xs">{row.name}</span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">{row.email}</span>
                    </div>
                </div>
            )
        },
        {
            id: 'role',
            label: 'Role & Dept.',
            render: (row) => (
                <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">{row.role}</span>
                    <span className="text-[11px] text-slate-500 block">{row.department}</span>
                </div>
            )
        },
        {
            id: 'contact',
            label: 'Contact Info',
            render: (row) => (
                <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                    <div className="flex items-center gap-1">
                        <Phone size={10} className="text-slate-400" />
                        <span>{row.phone}</span>
                    </div>
                </div>
            )
        },
        {
            id: 'status',
            label: 'Status',
            render: (row) => (
                <Badge
                    variant="secondary"
                    className={
                        row.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 font-semibold'
                            : row.status === 'On Leave'
                            ? 'bg-amber-50 text-amber-700 font-semibold'
                            : 'bg-slate-100 text-slate-700 font-semibold'
                    }
                >
                    {row.status}
                </Badge>
            )
        },
        {
            id: 'lastLogin',
            label: 'Last Active',
            render: (row) => <span className="text-[11px] text-slate-500">{row.lastLogin}</span>
        }
    ];

    const actions = (row: TeamMember) => (
        <div className="flex items-center justify-end gap-1.5">
            <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs font-semibold cursor-pointer"
                onClick={() => setSelectedMemberModal(row)}
            >
                <Eye size={13} className="mr-1" /> Profile
            </Button>
        </div>
    );

    const filterContent = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Department</label>
                <Select
                    value={selectedDept}
                    onChange={(val) => setSelectedDept(val)}
                    showSearch={false}
                    className="text-xs"
                    options={[
                        { id: 'all', name: 'All Departments' },
                        { id: 'operations', name: 'Operations & Dispatch' },
                        { id: 'fleet', name: 'Fleet & Drivers' },
                        { id: 'support', name: 'Customer Support & Sales' },
                        { id: 'finance', name: 'Finance & Accounts' }
                    ]}
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Employment Status</label>
                <Select
                    value={selectedStatus}
                    onChange={(val) => setSelectedStatus(val)}
                    showSearch={false}
                    className="text-xs"
                    options={[
                        { id: 'all', name: 'All Statuses' },
                        { id: 'active', name: 'Active' },
                        { id: 'on leave', name: 'On Leave' },
                        { id: 'inactive', name: 'Inactive' }
                    ]}
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-4 font-sans">
            <DataTable
                columns={columns}
                data={filteredMembers}
                compact={true}
                searchPlaceholder="Search staff by name, email, employee ID..."
                hideViewToggle={true}
                actions={actions}
                filterContent={filterContent}
                isLoading={isLoading}
            />

            {/* Member Profile Modal */}
            {selectedMemberModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-[#1e2329] rounded-lg max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
                        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-base">
                                    {selectedMemberModal.avatar}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{selectedMemberModal.name}</h3>
                                    <p className="text-xs text-slate-500">{selectedMemberModal.designation} • {selectedMemberModal.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedMemberModal(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md space-y-1">
                                <span className="text-slate-400 block font-medium">Department</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <Building size={13} className="text-slate-400" /> {selectedMemberModal.department}
                                </span>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md space-y-1">
                                <span className="text-slate-400 block font-medium">System Role</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <Shield size={13} className="text-slate-400" /> {selectedMemberModal.role}
                                </span>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md space-y-1">
                                <span className="text-slate-400 block font-medium">Clearance Level</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <UserCheck size={13} className="text-slate-400" /> {selectedMemberModal.clearance}
                                </span>
                            </div>

                            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md space-y-1">
                                <span className="text-slate-400 block font-medium">Assigned Unit</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                    <Truck size={13} className="text-slate-400" /> {selectedMemberModal.assignedVehicle}
                                </span>
                            </div>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md space-y-2 text-xs">
                            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                                <span className="text-slate-500 flex items-center gap-1.5"><Mail size={12} /> Email</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedMemberModal.email}</span>
                            </div>
                            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                                <span className="text-slate-500 flex items-center gap-1.5"><Phone size={12} /> Phone</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedMemberModal.phone}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Employment Status</span>
                                <Badge variant="secondary">{selectedMemberModal.status}</Badge>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <Button variant="outline" size="sm" onClick={() => setSelectedMemberModal(null)}>
                                Close Profile
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
