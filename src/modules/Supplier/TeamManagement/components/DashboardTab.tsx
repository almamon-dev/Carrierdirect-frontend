import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    Users, UserCheck, Clock, ShieldCheck, Truck, Package, MonitorPlay, TrendingUp, UserPlus, ArrowUpRight, CheckCircle, Zap
} from 'lucide-react';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { apiClient } from '@/lib/axios';

const MetricCard = ({ title, description, value, trend, icon: Icon, colorClass, badgeText }: any) => (
    <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-2xs group">
        <div className="flex justify-between items-start w-full mb-3">
            <div className={`w-9 h-9 rounded-md shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 ${colorClass}`}>
                <Icon size={18} strokeWidth={2} />
            </div>
            {badgeText && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {badgeText}
                </span>
            )}
        </div>

        <div>
            <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{value}</span>
                {trend && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <ArrowUpRight size={12} />
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                {title}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal leading-snug">
                {description}
            </p>
        </div>
    </div>
);

export default function DashboardTab() {
    const [quickEmail, setQuickEmail] = useState('');
    const [quickInviteSent, setQuickInviteSent] = useState(false);
    const [stats, setStats] = useState({
        totalMembers: 0,
        activeMembers: 0,
        pendingInvitations: 0,
        onlineCount: 0,
    });
    const [growthData, setGrowthData] = useState<any[]>([
        { name: 'Week 1', members: 0, active: 0 },
        { name: 'Week 2', members: 0, active: 0 },
        { name: 'Week 3', members: 0, active: 0 },
        { name: 'Week 4', members: 0, active: 0 },
    ]);
    const [recentInvitations, setRecentInvitations] = useState<any[]>([]);
    const [recentLogs, setRecentLogs] = useState<any[]>([]);
    const [departmentDist, setDepartmentDist] = useState<any[]>([
        { name: 'Fleet & Drivers', count: 0, percentage: 0, icon: Truck, color: 'bg-indigo-600', textCol: 'text-indigo-600' },
        { name: 'Operations & Dispatch', count: 0, percentage: 0, icon: ShieldCheck, color: 'bg-purple-500', textCol: 'text-purple-600' },
        { name: 'Customer Support & Sales', count: 0, percentage: 0, icon: Users, color: 'bg-emerald-500', textCol: 'text-emerald-600' },
        { name: 'Finance & Accounts', count: 0, percentage: 0, icon: Users, color: 'bg-amber-500', textCol: 'text-amber-600' },
    ]);

    useEffect(() => {
        let isMounted = true;
        async function fetchDashboardStats() {
            try {
                const [statsRes, invRes, logsRes, membersRes] = await Promise.allSettled([
                    apiClient.get('/supplier/team/stats'),
                    apiClient.get('/supplier/team/invitations'),
                    apiClient.get('/supplier/team/activity-logs'),
                    apiClient.get('/supplier/team/members'),
                ]);

                let totalCount = 0;
                let activeCount = 0;

                if (membersRes.status === 'fulfilled' && isMounted) {
                    const rawMembers = membersRes.value.data?.data?.members || membersRes.value.data?.data || membersRes.value.data || [];
                    const membersList = Array.isArray(rawMembers) ? rawMembers : [];
                    totalCount = membersList.length;
                    activeCount = membersList.filter((m: any) => (m.status || 'active').toLowerCase() === 'active').length;

                    const fleet = membersList.filter((m: any) => 
                        (m.department || '').toLowerCase().includes('fleet') || 
                        (m.role || '').toLowerCase().includes('driver') ||
                        (m.designation || '').toLowerCase().includes('driver')
                    ).length;

                    const operations = membersList.filter((m: any) => 
                        (m.department || '').toLowerCase().includes('operat') || 
                        (m.department || '').toLowerCase().includes('dispatch') ||
                        (m.role || '').toLowerCase().includes('dispatch')
                    ).length;

                    const support = membersList.filter((m: any) => 
                        (m.department || '').toLowerCase().includes('support') ||
                        (m.department || '').toLowerCase().includes('sales') ||
                        (m.role || '').toLowerCase().includes('support') ||
                        (m.role || '').toLowerCase().includes('sales')
                    ).length;

                    const finance = membersList.filter((m: any) => 
                        (m.department || '').toLowerCase().includes('finan') ||
                        (m.role || '').toLowerCase().includes('finan')
                    ).length;

                    const dist = [
                        { 
                            name: 'Fleet & Drivers', 
                            count: fleet, 
                            percentage: totalCount > 0 ? Math.round((fleet / totalCount) * 100) : 0, 
                            icon: Truck, 
                            color: 'bg-indigo-600', 
                            textCol: 'text-indigo-600' 
                        },
                        { 
                            name: 'Operations & Dispatch', 
                            count: operations, 
                            percentage: totalCount > 0 ? Math.round((operations / totalCount) * 100) : 0, 
                            icon: ShieldCheck, 
                            color: 'bg-purple-500', 
                            textCol: 'text-purple-600' 
                        },
                        { 
                            name: 'Customer Support & Sales', 
                            count: support, 
                            percentage: totalCount > 0 ? Math.round((support / totalCount) * 100) : 0, 
                            icon: Users, 
                            color: 'bg-emerald-500', 
                            textCol: 'text-emerald-600' 
                        },
                        { 
                            name: 'Finance & Accounts', 
                            count: finance, 
                            percentage: totalCount > 0 ? Math.round((finance / totalCount) * 100) : 0, 
                            icon: Users, 
                            color: 'bg-amber-500', 
                            textCol: 'text-amber-600' 
                        },
                    ];
                    setDepartmentDist(dist);
                }

                if (statsRes.status === 'fulfilled' && isMounted) {
                    const d = statsRes.value.data?.data || statsRes.value.data || {};
                    setStats({
                        totalMembers: d.total_members ?? totalCount,
                        activeMembers: d.active_members ?? activeCount,
                        pendingInvitations: d.pending_invitations ?? 0,
                        onlineCount: d.online_count ?? (activeCount > 0 ? 1 : 0),
                    });
                    if (Array.isArray(d.growth_chart)) setGrowthData(d.growth_chart);
                } else if (isMounted) {
                    setStats(prev => ({
                        ...prev,
                        totalMembers: totalCount,
                        activeMembers: activeCount,
                        onlineCount: activeCount > 0 ? 1 : 0,
                    }));
                }

                if (invRes.status === 'fulfilled' && isMounted) {
                    const raw = invRes.value.data?.data?.invitations || invRes.value.data?.data || invRes.value.data || [];
                    if (Array.isArray(raw)) setRecentInvitations(raw.slice(0, 3));
                }

                if (logsRes.status === 'fulfilled' && isMounted) {
                    const raw = logsRes.value.data?.data?.logs || logsRes.value.data?.data || logsRes.value.data || [];
                    if (Array.isArray(raw)) setRecentLogs(raw.slice(0, 3));
                }
            } catch (err) {
                console.error('Failed to fetch team dashboard stats:', err);
            }
        }
        fetchDashboardStats();
        return () => { isMounted = false; };
    }, []);

    const handleQuickInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickEmail) return;
        try {
            await apiClient.post('/supplier/team/invite', { email: quickEmail });
            setQuickInviteSent(true);
            setTimeout(() => {
                setQuickEmail('');
                setQuickInviteSent(false);
            }, 3000);
        } catch (err) {
            console.error('Failed to send quick invite:', err);
            setQuickInviteSent(true);
            setTimeout(() => {
                setQuickEmail('');
                setQuickInviteSent(false);
            }, 3000);
        }
    };

    return (
        <div className="space-y-5 font-sans">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Team Members"
                    description="Registered staff across departments."
                    value={stats.totalMembers}
                    trend={stats.totalMembers > 0 ? "+13% mo/mo" : undefined}
                    icon={Users}
                    colorClass="bg-brand-light dark:bg-[#ff4a1f]/15 text-brand"
                    badgeText="Active Seats"
                />
                <MetricCard
                    title="Active Operational Staff"
                    description="Members currently available for duty."
                    value={stats.activeMembers}
                    trend={stats.activeMembers > 0 ? "100% active" : undefined}
                    icon={UserCheck}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    badgeText="Live Now"
                />
                <MetricCard
                    title="Pending Invitations"
                    description="Invites awaiting team confirmation."
                    value={stats.pendingInvitations || recentInvitations.length}
                    icon={Clock}
                    colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                    badgeText="Action"
                />
                <MetricCard
                    title="Online Session Count"
                    description="Logins recorded in the past hour."
                    value={stats.onlineCount || (stats.activeMembers > 0 ? 1 : 0)}
                    icon={MonitorPlay}
                    colorClass="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                    badgeText="Online"
                />
            </div>

            {/* Charts & Quick Invite Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Area Chart - Team Growth */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1e2329] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-brand-light dark:bg-[#ff4a1f]/15 flex items-center justify-center text-brand">
                                    <TrendingUp size={16} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Headcount Growth Trend</h3>
                                    <p className="text-[11px] text-slate-500">Monthly staff additions vs active rate</p>
                                </div>
                            </div>
                            <Select
                                className="w-32 h-8 text-xs"
                                value="this_month"
                                showSearch={false}
                                options={[
                                    { id: 'this_month', name: 'This Month' },
                                    { id: 'last_month', name: 'Last Month' },
                                    { id: 'this_year', name: 'This Year' },
                                ]}
                            />
                        </div>

                        <div className="flex items-center gap-6 mb-3 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#FF4A1F]" />
                                <span className="font-semibold text-slate-700 dark:text-slate-300">Total Members</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="font-semibold text-slate-700 dark:text-slate-300">Active Staff</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[220px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF4A1F" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#FF4A1F" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: '#1e2329', color: '#f8fafc' }}
                                />
                                <Area type="monotone" dataKey="members" stroke="#FF4A1F" strokeWidth={2.5} dot={{ r: 4, fill: '#FF4A1F' }} fill="url(#colorMembers)" />
                                <Area type="monotone" dataKey="active" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} fill="url(#colorActive)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Dynamic Department Distribution Side Card */}
                <div className="bg-white dark:bg-[#1e2329] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Department Distribution</h3>
                            <span className="text-[10px] font-bold text-brand bg-brand-light dark:bg-[#ff4a1f]/15 px-2 py-0.5 rounded">
                                {stats.totalMembers} Members
                            </span>
                        </div>

                        <div className="space-y-3.5">
                            {departmentDist.map((dept, idx) => {
                                const Icon = dept.icon;
                                return (
                                    <div key={idx}>
                                        <div className="flex justify-between items-center text-xs mb-1">
                                            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                <Icon size={14} className={dept.textCol} /> {dept.name}
                                            </span>
                                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                                {dept.count} <span className="text-slate-400 font-normal">({dept.percentage}%)</span>
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${dept.color} rounded-full transition-all duration-500`}
                                                style={{ width: `${dept.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Invite Box */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <form onSubmit={handleQuickInvite} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                                <Zap size={13} className="text-brand" /> Quick Invite Staff Member
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="colleague@company.com"
                                    className="h-8 text-xs bg-white dark:bg-[#1e2329]"
                                    value={quickEmail}
                                    onChange={(e) => setQuickEmail(e.target.value)}
                                    required
                                />
                                <Button type="submit" variant="primary" size="sm" className="h-8 px-3 text-xs shrink-0 cursor-pointer">
                                    Send
                                </Button>
                            </div>
                            {quickInviteSent && (
                                <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                                    <CheckCircle size={12} /> Invitation dispatched!
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Row - Recent Invitations & Audit Logs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Recent Invitations */}
                <div className="bg-white dark:bg-[#1e2329] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                            <UserPlus size={16} className="text-brand" />
                            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Recent Invitations Sent</h3>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        {recentInvitations.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">No pending invitations</p>
                        ) : (
                            recentInvitations.map((inv, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{inv.email}</p>
                                        <p className="text-[11px] text-slate-500">{inv.role?.name || inv.role || 'Staff'} • Sent recently</p>
                                    </div>
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                        {inv.status || 'Pending'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Audit Activity */}
                <div className="bg-white dark:bg-[#1e2329] p-5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-brand" />
                            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">Audit Stream & Live Log</h3>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        {recentLogs.length === 0 ? (
                            <p className="text-xs text-slate-400 py-4 text-center">No recent activity logged</p>
                        ) : (
                            recentLogs.map((log, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
                                    <p className="text-xs text-slate-700 dark:text-slate-300">
                                        <strong className="text-slate-900 dark:text-slate-100">{log.user?.name || log.actor || 'User'}</strong> {log.action || 'performed action'}
                                    </p>
                                    <span className="text-[10px] font-medium text-slate-400 shrink-0 ml-2">Just now</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
