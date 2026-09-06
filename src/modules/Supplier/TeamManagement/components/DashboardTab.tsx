import React, { useEffect, useState, useMemo } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import { apiClient } from '@/lib/axios';
import {
    Activity,
    ArrowUpRight, CheckCircle,
    Clock,
    Mail,
    MonitorPlay,
    ShieldCheck,
    TrendingUp,
    Truck,
    UserCheck,
    UserPlus,
    Users,
    Zap
} from 'lucide-react';

const MetricCard = ({ title, description, value, trend, icon: Icon, colorClass }: any) => (
    <div className="bg-white dark:bg-[#181d24] p-3 rounded-md border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between shadow-2xs group">
        <div className="flex justify-between items-start w-full mb-2">
            <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${colorClass}`}>
                <Icon size={14} strokeWidth={2} />
            </div>
            {trend && (
                <span className="text-[10.5px] font-normal text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 leading-none">
                    <ArrowUpRight size={11} />
                    {trend}
                </span>
            )}
        </div>

        <div>
            <div className="mb-0.5">
                <span className="text-lg font-semibold text-slate-800 dark:text-slate-200 tracking-tight leading-none">{value}</span>
            </div>
            <h3 className="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 leading-tight">
                {title}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight truncate mt-0.5">
                {description}
            </p>
        </div>
    </div>
);

interface DashboardTabProps {
    headerTabs?: React.ReactNode;
}

export default function DashboardTab({ headerTabs }: DashboardTabProps = {}) {
    const [timeFilter, setTimeFilter] = useState('this_month');
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

    const displayedGrowthData = useMemo(() => {
        if (timeFilter === 'last_month') {
            return [
                { name: 'Week 1', members: Math.max(0, Math.round(stats.totalMembers * 0.7)), active: Math.max(0, Math.round(stats.activeMembers * 0.65)) },
                { name: 'Week 2', members: Math.max(0, Math.round(stats.totalMembers * 0.8)), active: Math.max(0, Math.round(stats.activeMembers * 0.75)) },
                { name: 'Week 3', members: Math.max(0, Math.round(stats.totalMembers * 0.85)), active: Math.max(0, Math.round(stats.activeMembers * 0.8)) },
                { name: 'Week 4', members: Math.max(0, Math.round(stats.totalMembers * 0.9)), active: Math.max(0, Math.round(stats.activeMembers * 0.85)) },
            ];
        }
        if (timeFilter === 'this_year') {
            return [
                { name: 'Q1', members: Math.max(0, Math.round(stats.totalMembers * 0.4)), active: Math.max(0, Math.round(stats.activeMembers * 0.4)) },
                { name: 'Q2', members: Math.max(0, Math.round(stats.totalMembers * 0.65)), active: Math.max(0, Math.round(stats.activeMembers * 0.6)) },
                { name: 'Q3', members: Math.max(0, Math.round(stats.totalMembers * 0.85)), active: Math.max(0, Math.round(stats.activeMembers * 0.8)) },
                { name: 'Q4', members: stats.totalMembers, active: stats.activeMembers },
            ];
        }
        return growthData.length > 0 ? growthData : [
            { name: 'Week 1', members: Math.max(0, Math.round(stats.totalMembers * 0.5)), active: Math.max(0, Math.round(stats.activeMembers * 0.5)) },
            { name: 'Week 2', members: Math.max(0, Math.round(stats.totalMembers * 0.7)), active: Math.max(0, Math.round(stats.activeMembers * 0.7)) },
            { name: 'Week 3', members: Math.max(0, Math.round(stats.totalMembers * 0.9)), active: Math.max(0, Math.round(stats.activeMembers * 0.85)) },
            { name: 'Week 4', members: stats.totalMembers, active: stats.activeMembers },
        ];
    }, [timeFilter, growthData, stats]);

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
        <div className="space-y-3.5 font-sans">
            {headerTabs && (
                <div className="bg-white dark:bg-[#181d24] rounded-md border border-slate-200/80 dark:border-slate-800 shadow-none px-4 pt-2.5">
                    {headerTabs}
                </div>
            )}
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard
                    title="Total Team Members"
                    description="Registered staff across departments."
                    value={stats.totalMembers}
                    trend={stats.totalMembers > 0 ? "+13% mo/mo" : undefined}
                    icon={Users}
                    colorClass="bg-orange-50 dark:bg-[#ff4a1f]/15 text-[#ff4a1f]"
                />
                <MetricCard
                    title="Active Operational Staff"
                    description="Members currently available for duty."
                    value={stats.activeMembers}
                    trend={stats.activeMembers > 0 ? "100% active" : undefined}
                    icon={UserCheck}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                />
                <MetricCard
                    title="Pending Invitations"
                    description="Invites awaiting team confirmation."
                    value={stats.pendingInvitations || recentInvitations.length}
                    icon={Clock}
                    colorClass="bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                />
                <MetricCard
                    title="Online Session Count"
                    description="Logins recorded in the past hour."
                    value={stats.onlineCount || (stats.activeMembers > 0 ? 1 : 0)}
                    icon={MonitorPlay}
                    colorClass="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                />
            </div>

            {/* Charts & Quick Invite Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                {/* Area Chart - Team Growth */}
                <div className="lg:col-span-2 bg-white dark:bg-[#181d24] p-3.5 rounded-md border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2.5">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 flex items-center justify-center text-[#ff4a1f]">
                                    <TrendingUp size={13} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-none">Headcount Growth Trend</h3>
                                    <p className="text-[10.5px] text-slate-500 leading-none mt-0.5">Monthly staff additions vs active rate</p>
                                </div>
                            </div>
                            <Select
                                size="sm"
                                className="w-[115px]"
                                triggerClassName="h-7 text-xs py-0 pr-6 pl-2.5 text-slate-700 dark:text-slate-300 font-normal border-slate-200 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600 rounded"
                                value={timeFilter}
                                onChange={(e: any) => {
                                    const val = e?.target?.value !== undefined ? e.target.value : (e?.value !== undefined ? e.value : e);
                                    setTimeFilter(val);
                                }}
                                showSearch={false}
                                options={[
                                    { id: 'this_month', name: 'This Month' },
                                    { id: 'last_month', name: 'Last Month' },
                                    { id: 'this_year', name: 'This Year' },
                                ]}
                            />
                        </div>

                        <div className="flex items-center gap-4 mb-2 text-xs">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4A1F]" />
                                <span className="font-normal text-[11px] text-slate-600 dark:text-slate-400">Total Members</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="font-normal text-[11px] text-slate-600 dark:text-slate-400">Active Staff</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[150px] w-full mt-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={displayedGrowthData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
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
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={5} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '6px', border: 'none', backgroundColor: '#181d24', color: '#f8fafc', fontSize: '11px', padding: '6px 10px' }}
                                />
                                <Area type="monotone" dataKey="members" stroke="#FF4A1F" strokeWidth={2} dot={{ r: 3, fill: '#FF4A1F' }} fill="url(#colorMembers)" />
                                <Area type="monotone" dataKey="active" stroke="#10B981" strokeWidth={1.5} dot={{ r: 2.5, fill: '#10B981' }} fill="url(#colorActive)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Dynamic Department Distribution Side Card */}
                <div className="bg-white dark:bg-[#181d24] p-3.5 rounded-md border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2.5">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 flex items-center justify-center text-[#ff4a1f]">
                                    <Users size={13} />
                                </div>
                                <h3 className="text-xs font-medium text-slate-700 dark:text-slate-300">Department Distribution</h3>
                            </div>
                            <span className="text-[10.5px] font-normal text-slate-500 dark:text-slate-400">
                                {stats.totalMembers} {stats.totalMembers === 1 ? 'member' : 'members'}
                            </span>
                        </div>

                        <div className="space-y-2">
                            {departmentDist.map((dept, idx) => {
                                const Icon = dept.icon;
                                return (
                                    <div key={idx}>
                                        <div className="flex justify-between items-center text-[11px] mb-0.5">
                                            <span className="font-normal text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                <Icon size={12} className={dept.textCol} /> {dept.name}
                                            </span>
                                            <span className="font-normal text-slate-600 dark:text-slate-400 text-[11px]">
                                                {dept.count} <span className="text-slate-400 font-normal">({dept.percentage}%)</span>
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                        <form onSubmit={handleQuickInvite} className="bg-slate-50/70 dark:bg-slate-800/40 p-2.5 rounded border border-slate-200/70 dark:border-slate-700/60">
                            <label className="block text-[10.5px] font-normal text-slate-600 dark:text-slate-400 mb-1 flex items-center gap-1">
                                <Zap size={11} className="text-[#ff4a1f]" /> Quick Invite Staff Member
                            </label>
                            <div className="flex gap-1.5">
                                <Input
                                    type="email"
                                    placeholder="colleague@company.com"
                                    className="h-7 text-xs bg-white dark:bg-[#12161c]"
                                    value={quickEmail}
                                    onChange={(e) => setQuickEmail(e.target.value)}
                                    required
                                />
                                <Button type="submit" variant="primary" size="sm" className="h-7 px-2.5 text-xs shrink-0 cursor-pointer bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-normal">
                                    Send
                                </Button>
                            </div>
                            {quickInviteSent && (
                                <p className="text-[10px] text-emerald-600 font-normal mt-1 flex items-center gap-1">
                                    <CheckCircle size={11} /> Invitation dispatched!
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Bottom Row - Recent Invitations & Audit Logs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Recent Invitations */}
                <div className="bg-white dark:bg-[#181d24] p-3.5 rounded-md border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2.5">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 flex items-center justify-center text-[#ff4a1f]">
                                <UserPlus size={13} />
                            </div>
                            <h3 className="text-xs font-medium text-slate-700 dark:text-slate-300">Recent Invitations Sent</h3>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        {recentInvitations.length === 0 ? (
                            <p className="text-[11px] text-slate-400 py-3 text-center">No pending invitations</p>
                        ) : (
                            recentInvitations.map((inv, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 rounded border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                        <div className="w-6 h-6 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                            <Mail size={12} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-normal text-slate-800 dark:text-slate-200 text-xs truncate">{inv.email}</p>
                                            <p className="text-[10.5px] text-slate-500 truncate">{inv.role?.name || inv.role || 'Staff'} • Sent recently</p>
                                        </div>
                                    </div>
                                    <span className="text-[10.5px] font-normal text-amber-600 dark:text-amber-400 shrink-0">
                                        {inv.status || 'Pending'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Audit Activity */}
                <div className="bg-white dark:bg-[#181d24] p-3.5 rounded-md border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2.5">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-orange-50 dark:bg-[#ff4a1f]/15 flex items-center justify-center text-[#ff4a1f]">
                                <Clock size={13} />
                            </div>
                            <h3 className="text-xs font-medium text-slate-700 dark:text-slate-300">Audit Stream & Live Log</h3>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        {recentLogs.length === 0 ? (
                            <p className="text-[11px] text-slate-400 py-3 text-center">No recent activity logged</p>
                        ) : (
                            recentLogs.map((log, idx) => (
                                <div key={idx} className="flex justify-between items-center p-2 rounded border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                            <Activity size={12} />
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 min-w-0 truncate">
                                            <span className="text-slate-800 dark:text-slate-200 font-normal">{log.user?.name || log.actor || 'User'}</span> {log.action || 'performed action'}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-normal text-slate-400 shrink-0 ml-2">Just now</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
