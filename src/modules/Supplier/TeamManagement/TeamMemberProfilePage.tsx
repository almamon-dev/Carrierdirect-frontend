import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Mail, Phone, Building, Shield, UserCheck, Truck,
    Clock, Trash2, AlertTriangle, MapPin, Ban, CheckCircle, ArrowLeft
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { TeamMember } from './types/team.types';
import { apiClient } from '@/lib/axios';
import BlockMemberModal from './components/BlockMemberModal';

export default function TeamMemberProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [member, setMember] = useState<TeamMember | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

    useEffect(() => {
        async function fetchMember() {
            setIsLoading(true);
            try {
                const res = await apiClient.get(`/supplier/team/members/${id}`);
                const m = res.data?.data || res.data;
                if (m) {
                    const isBlocked = m.status === 'blocked' || m.status === 'disabled' || Boolean(m.is_blocked);
                    const isPending = m.status === 'pending' || m.status === 'invited';
                    const roleName = m.role?.name || m.role || 'Driver';
                    const lastActive = (m.last_login_at && !isPending)
                        ? new Date(m.last_login_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : (m.last_login && m.last_login !== 'Never' && !isPending ? m.last_login : 'Never');

                    setMember({
                        id: m.employee_id || (m.id ? `EMP-${m.id}` : `EMP-${id}`),
                        rawId: m.id || id,
                        name: m.name || m.user?.name || 'Staff Member',
                        avatar: (m.name || 'SM').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
                        role: roleName,
                        department: roleName,
                        designation: roleName,
                        email: m.email || m.user?.email || 'staff@example.com',
                        phone: m.phone || m.user?.phone || '—',
                        status: (isBlocked ? 'Blocked' : isPending ? 'Pending' : m.status === 'active' ? 'Active' : m.status === 'on_leave' ? 'On Leave' : 'Pending') as any,
                        isBlocked: isBlocked,
                        blockReason: m.block_reason || m.reason || '',
                        blockedAt: m.blocked_at || '',
                        lastLogin: lastActive,
                        location: m.location || 'Main Depot Terminal',
                        assignedVehicle: m.assigned_vehicle || m.vehicle?.name || 'Station Unit #1',
                        clearance: m.clearance || 'Level 1 - Standard Clearance',
                    });
                }
            } catch (err) {
                console.error('Failed to load team member details:', err);
                // Fallback default state
                setMember({
                    id: String(id).startsWith('EMP-') ? String(id) : `EMP-${id}`,
                    rawId: id,
                    name: 'Staff Member',
                    avatar: 'SM',
                    role: 'Operations Specialist',
                    department: 'Operations & Dispatch',
                    designation: 'Operations Executive',
                    email: 'staff@example.com',
                    phone: '+44 7700 900111',
                    status: 'Active',
                    lastLogin: 'Today',
                    location: 'Main Depot Terminal',
                    assignedVehicle: 'Station Unit #1',
                    clearance: 'Level 1 - Standard Clearance',
                });
            } finally {
                setIsLoading(false);
            }
        }
        if (id) fetchMember();
    }, [id]);

    const handleDelete = async () => {
        if (!member) return;
        if (window.confirm(`Are you sure you want to delete ${member.name}?`)) {
            try {
                if (member.rawId) {
                    await apiClient.delete(`/supplier/team/members/${member.rawId}`);
                }
            } catch (err) {
                console.error('Failed to delete member:', err);
            }
            navigate('/supplier/team?tab=members&view=table');
        }
    };

    const handleUnblock = async () => {
        if (!member) return;
        if (window.confirm(`Are you sure you want to unblock ${member.name}? This will restore their system access.`)) {
            try {
                const memberId = member.rawId || member.id;
                await apiClient.post(`/supplier/team/members/${memberId}/unblock`, {
                    status: 'active',
                    is_blocked: false,
                }).catch(async () => {
                    return apiClient.put(`/supplier/team/members/${memberId}`, {
                        status: 'active',
                        is_blocked: false,
                        block_reason: null,
                    });
                });
            } catch (err) {
                console.error('Failed to unblock member:', err);
            }

            setMember(prev => prev ? {
                ...prev,
                status: 'Active',
                isBlocked: false,
                blockReason: undefined,
            } : null);
        }
    };

    if (isLoading) {
        return (
            <div className="p-3.5 sm:p-4 w-full mx-auto min-h-[200px] h-auto bg-[#f8fafc] dark:bg-[#12161c] flex items-center justify-center font-sans">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ff4a1f]" />
            </div>
        );
    }

    if (!member) {
        return (
            <div className="p-3.5 sm:p-4 w-full mx-auto h-auto bg-[#f8fafc] dark:bg-[#12161c] space-y-2 font-sans">
                <div className="bg-white dark:bg-[#1e2329] p-5 rounded-md border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                    Team Member not found.
                </div>
            </div>
        );
    }

    const isBlocked = member.status === 'Blocked' || Boolean(member.isBlocked);
    const roleLower = (member.role || '').toLowerCase();

    const quotesRules = [
        { id: 'q_view', name: 'View Quote Requests', desc: 'Browse shipper freight requests', allowed: true },
        { id: 'q_sub', name: 'Submit Price Bids', desc: 'Send bids & submit freight quotes', allowed: ['admin', 'operations', 'dispatcher', 'sales'].some(r => roleLower.includes(r)) },
        { id: 'q_neg', name: 'Live Negotiation Chat', desc: 'Counter-offer live chat with shippers', allowed: ['admin', 'operations', 'dispatcher', 'sales', 'support'].some(r => roleLower.includes(r)) },
        { id: 'q_arc', name: 'Won & Lost Archives', desc: 'Track winning bids & archive logs', allowed: true },
    ];

    const ordersRules = [
        { id: 'o_act', name: 'Active Jobs Tracking', desc: 'Monitor on-road transport jobs', allowed: true },
        { id: 'o_dsp', name: 'Dispatch Drivers & Fleet', desc: 'Assign fleet resources to shipments', allowed: ['admin', 'operations', 'dispatcher', 'driver'].some(r => roleLower.includes(r)) },
        { id: 'o_pod', name: 'Verify Delivery POD', desc: 'Upload POD receipts & confirm delivery', allowed: ['admin', 'operations', 'dispatcher', 'driver'].some(r => roleLower.includes(r)) },
        { id: 'o_sch', name: 'Availability & Lanes', desc: 'Publish available vehicles and lanes', allowed: ['admin', 'operations', 'dispatcher', 'driver'].some(r => roleLower.includes(r)) },
    ];

    const adminRules = [
        { id: 'a_fin', name: 'Earnings & Payout Ledger', desc: 'View withdrawal requests and revenue', allowed: ['admin', 'finance', 'billing'].some(r => roleLower.includes(r)) },
        { id: 'a_cfg', name: 'Organization Settings', desc: 'Configure organization preferences & roles', allowed: roleLower.includes('admin') },
    ];

    return (
        <div className="p-4 md:p-6 w-full mx-auto space-y-4 h-auto font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                        Team Member Profile
                    </h1>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        <button
                            type="button"
                            onClick={() => navigate('/supplier/team?tab=members&view=table')}
                            className="hover:text-[#ff4a1f] transition-colors cursor-pointer"
                        >
                            Team Management
                        </button>
                        <span>/</span>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">{member.name}</span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded shadow-2xs self-start sm:self-auto"
                    onClick={() => navigate('/supplier/team?tab=members&view=table')}
                >
                    <ArrowLeft size={13} />
                    <span>Back to Team</span>
                </Button>
            </div>

            {/* 2-Column Left & Right Layout */}
            <div className="flex flex-col lg:flex-row items-start gap-3.5 h-auto">

                {/* Left Column: Member Card & Quick Actions */}
                <div className="w-full lg:w-[300px] xl:w-[320px] shrink-0 space-y-2.5 h-auto">
                    <div className="bg-white dark:bg-[#12161c] rounded-md border border-[#ebebeb] dark:border-slate-800 p-3.5 space-y-3 shadow-none h-auto">
                        {/* Avatar & Core Identity */}
                        <div className="flex flex-col items-center text-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-13 h-13 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold flex items-center justify-center mb-2 shadow-inner">
                                {member.avatar}
                            </div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{member.name}</h2>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{member.designation}</span>
                            <div className="flex items-center gap-1.5 mt-2">
                                <Badge
                                    variant="secondary"
                                    className={
                                        isBlocked
                                            ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 font-semibold text-[10.5px] px-1.5 py-0'
                                            : member.status === 'Active'
                                                ? 'bg-emerald-50 text-emerald-700 font-semibold text-[10.5px] px-1.5 py-0'
                                                : member.status === 'Pending'
                                                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-semibold text-[10.5px] px-1.5 py-0'
                                                    : member.status === 'On Leave'
                                                        ? 'bg-blue-50 text-blue-700 font-semibold text-[10.5px] px-1.5 py-0'
                                                        : 'bg-slate-100 text-slate-700 font-semibold text-[10.5px] px-1.5 py-0'
                                    }
                                >
                                    {isBlocked ? 'Blocked' : member.status}
                                </Badge>
                                <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]">
                                    {member.id}
                                </span>
                            </div>
                        </div>

                        {/* Contact Information List */}
                        <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                                    <Building size={12} className="text-slate-400" /> Department
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[155px] text-[11px]">{member.department}</span>
                            </div>

                            <div className="flex items-center justify-between py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                                    <Shield size={12} className="text-slate-400" /> System Role
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[155px] text-[11px]">{member.role}</span>
                            </div>

                            <div className="flex items-center justify-between py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                                    <Mail size={12} className="text-slate-400" /> Email
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[155px] text-[11px]">{member.email}</span>
                            </div>

                            <div className="flex items-center justify-between py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                                    <Phone size={12} className="text-slate-400" /> Phone
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{member.phone}</span>
                            </div>

                            <div className="flex items-center justify-between py-1 border-b border-slate-100/80 dark:border-slate-800/80">
                                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                                    <MapPin size={12} className="text-slate-400" /> Location
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{member.location}</span>
                            </div>

                            <div className="flex items-center justify-between py-0.5">
                                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 text-[11px]">
                                    <Clock size={12} className="text-slate-400" /> Last Active
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{member.lastLogin}</span>
                            </div>
                        </div>

                        {/* Action Buttons in Left Card */}
                        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1.5 w-full">
                            {member.email && (
                                <a
                                    href={`mailto:${member.email}`}
                                    className="w-full h-8 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-md bg-[#FF4A1F] text-white hover:bg-[#E03E15] active:scale-[0.99] transition-all shadow-xs cursor-pointer"
                                >
                                    <Mail size={13} className="text-white" />
                                    <span>Send Email</span>
                                </a>
                            )}
                            <div className="flex items-center gap-1.5 w-full">
                                {isBlocked ? (
                                    <button
                                        type="button"
                                        onClick={handleUnblock}
                                        className="flex-1 h-8 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-md bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <CheckCircle size={13} className="text-emerald-600 dark:text-emerald-400" />
                                        <span>Unblock</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsBlockModalOpen(true)}
                                        className="flex-1 h-8 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-md bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-100/80 dark:hover:bg-amber-900/50 transition-colors shadow-2xs cursor-pointer"
                                    >
                                        <Ban size={13} className="text-amber-600 dark:text-amber-400" />
                                        <span>Block</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex-1 h-8 px-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-md bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200/80 dark:border-red-900/60 hover:bg-red-100/80 dark:hover:bg-red-900/50 transition-colors shadow-2xs cursor-pointer"
                                >
                                    <Trash2 size={13} className="text-red-600 dark:text-red-400" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Clean Single Card for Rules & Permissions */}
                <div className="flex-1 w-full min-w-0 bg-white dark:bg-[#12161c] rounded-[3px] border border-[#ebebeb] dark:border-slate-800 shadow-none h-auto">

                    {/* Bottom: Clean Flat 3-Column Permissions Matrix (No Inner Boxes!) */}
                    <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between pb-1">
                            <div>
                                <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                    Assigned System Rules & Permissions
                                </h3>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Governed by <span className="font-semibold text-slate-700 dark:text-slate-300">{member.role}</span> role configuration.
                                </p>
                            </div>
                            <Badge variant="secondary" className="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f] text-[10px] font-bold px-1.5 py-0">
                                RBAC Assigned
                            </Badge>
                        </div>

                        {/* Flat 3 Columns with Hairline Row Dividers */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
                            {/* Column 1: Quotes */}
                            <div className="space-y-1">
                                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-200 dark:border-slate-700">
                                    Quotes & Bidding
                                </h4>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {quotesRules.map(rule => (
                                        <div key={rule.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                                            <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{rule.name}</span>
                                            <span className={`text-[10px] font-bold shrink-0 px-1.5 py-0.5 rounded ${rule.allowed ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
                                                {rule.allowed ? '✓ Yes' : '✕ No'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Column 2: Orders */}
                            <div className="space-y-1">
                                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-200 dark:border-slate-700">
                                    Orders & Fleet
                                </h4>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {ordersRules.map(rule => (
                                        <div key={rule.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                                            <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{rule.name}</span>
                                            <span className={`text-[10px] font-bold shrink-0 px-1.5 py-0.5 rounded ${rule.allowed ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
                                                {rule.allowed ? '✓ Yes' : '✕ No'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Column 3: Finance & Admin */}
                            <div className="space-y-1">
                                <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-200 dark:border-slate-700">
                                    Finance & Admin
                                </h4>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {adminRules.map(rule => (
                                        <div key={rule.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                                            <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{rule.name}</span>
                                            <span className={`text-[10px] font-bold shrink-0 px-1.5 py-0.5 rounded ${rule.allowed ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}>
                                                {rule.allowed ? '✓ Yes' : '✕ No'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Block Modal */}
            {isBlockModalOpen && member && (
                <BlockMemberModal
                    member={member}
                    onClose={() => setIsBlockModalOpen(false)}
                    onSuccess={(updated) => {
                        setMember(updated);
                    }}
                />
            )}
        </div>
    );
}
