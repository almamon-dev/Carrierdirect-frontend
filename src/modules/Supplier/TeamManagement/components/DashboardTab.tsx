import React, { useState } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
    Users, UserCheck, Clock, ShieldCheck, Truck, Package, MonitorPlay, TrendingUp, UserPlus, Mail, ArrowUpRight, CheckCircle, Zap
} from 'lucide-react';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

const memberGrowthData = [
    { name: 'May 01', members: 32, active: 30 },
    { name: 'May 08', members: 35, active: 33 },
    { name: 'May 15', members: 38, active: 36 },
    { name: 'May 22', members: 40, active: 38 },
    { name: 'May 29', members: 42, active: 40 },
    { name: 'Jun 05', members: 45, active: 42 },
];

const MetricCard = ({ title, description, value, trend, icon: Icon, colorClass, badgeText }: any) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-sm hover:shadow-md group">
        <div className="flex justify-between items-start w-full mb-3">
            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 ${colorClass}`}>
                <Icon size={20} strokeWidth={2} />
            </div>
            {badgeText && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {badgeText}
                </span>
            )}
        </div>

        <div>
            <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</span>
                {trend && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                        <ArrowUpRight size={12} />
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-xs font-bold text-slate-800 mb-0.5">
                {title}
            </h3>
            <p className="text-[11px] text-slate-500 font-normal leading-snug">
                {description}
            </p>
        </div>
    </div>
);

export default function DashboardTab() {
    const [quickEmail, setQuickEmail] = useState('');
    const [quickInviteSent, setQuickInviteSent] = useState(false);

    const handleQuickInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickEmail) return;
        setQuickInviteSent(true);
        setTimeout(() => {
            setQuickEmail('');
            setQuickInviteSent(false);
        }, 3000);
    };

    return (
        <div className="space-y-5">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                    title="Total Team Members" 
                    description="Registered staff across 5 departments." 
                    value="45"
                    trend="+13% mo/mo"
                    icon={Users}
                    colorClass="bg-brand-light text-brand"
                    badgeText="5 Seats Free"
                />
                <MetricCard 
                    title="Active Operational Staff" 
                    description="Members currently available for duty." 
                    value="42"
                    trend="93% uptime"
                    icon={UserCheck}
                    colorClass="bg-emerald-50 text-emerald-600"
                    badgeText="3 On Leave"
                />
                <MetricCard 
                    title="Pending Invitations" 
                    description="Invites awaiting team confirmation." 
                    value="3"
                    icon={Clock}
                    colorClass="bg-amber-50 text-amber-600"
                    badgeText="Action Needed"
                />
                <MetricCard 
                    title="Online Session Count" 
                    description="Logins recorded in the past hour." 
                    value="18"
                    icon={MonitorPlay}
                    colorClass="bg-indigo-50 text-indigo-600"
                    badgeText="Live Now"
                />
            </div>

            {/* Charts & Quick Invite Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* Area Chart - Team Growth */}
                <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-brand-light flex items-center justify-center text-brand">
                                    <TrendingUp size={16} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">Headcount Growth Trend</h3>
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
                                <span className="font-semibold text-slate-700">Total Members</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="font-semibold text-slate-700">Active Staff</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[220px] w-full mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={memberGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF4A1F" stopOpacity={0.25}/>
                                        <stop offset="95%" stopColor="#FF4A1F" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px -2px rgba(0,0,0,0.08)' }}
                                />
                                <Area type="monotone" dataKey="members" stroke="#FF4A1F" strokeWidth={2.5} dot={{ r: 4, fill: '#FF4A1F' }} fill="url(#colorMembers)" />
                                <Area type="monotone" dataKey="active" stroke="#10B981" strokeWidth={2} dot={{ r: 3, fill: '#10B981' }} fill="url(#colorActive)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Department Distribution Side Card */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <h3 className="text-xs font-bold text-slate-900">Department Distribution</h3>
                            <span className="text-[10px] font-bold text-brand bg-brand-light px-2 py-0.5 rounded">5 Active Teams</span>
                        </div>
                        
                        <div className="space-y-3.5">
                            <div>
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                        <Truck size={14} className="text-indigo-600" /> Fleet Drivers
                                    </span>
                                    <span className="font-bold text-slate-900">25 <span className="text-slate-400 font-normal">(55%)</span></span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: '55%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                        <Package size={14} className="text-emerald-600" /> Warehouse Ops
                                    </span>
                                    <span className="font-bold text-slate-900">12 <span className="text-slate-400 font-normal">(27%)</span></span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '27%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                        <ShieldCheck size={14} className="text-purple-600" /> Management & Dispatch
                                    </span>
                                    <span className="font-bold text-slate-900">8 <span className="text-slate-400 font-normal">(18%)</span></span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Invite Box */}
                    <div className="mt-5 pt-4 border-t border-slate-100">
                        <form onSubmit={handleQuickInvite} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                            <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                                <Zap size={13} className="text-brand" /> Quick Invite Staff Member
                            </label>
                            <div className="flex gap-2">
                                <Input 
                                    type="email"
                                    placeholder="colleague@company.com" 
                                    className="h-8 text-xs bg-white"
                                    value={quickEmail}
                                    onChange={(e) => setQuickEmail(e.target.value)}
                                    required
                                />
                                <Button type="submit" variant="primary" size="sm" className="h-8 px-3 text-xs shrink-0">
                                    Send
                                </Button>
                            </div>
                            {quickInviteSent && (
                                <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                                    <CheckCircle size={12} /> Invitation sent successfully!
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
            
            {/* Bottom Row - Recent Invitations & Audit Logs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Recent Invitations */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                            <UserPlus size={16} className="text-brand" />
                            <h3 className="text-xs font-bold text-slate-900">Recent Invitations Sent</h3>
                        </div>
                        <span className="text-[11px] font-semibold text-brand cursor-pointer hover:underline">View All Invitations</span>
                    </div>

                    <div className="space-y-2.5">
                        {[
                            { email: 'newguy@abclogistics.com', role: 'Driver', date: 'Jul 20, 2026', status: 'Pending' },
                            { email: 'sales@abclogistics.com', role: 'Sales Lead', date: 'Jul 19, 2026', status: 'Accepted' },
                            { email: 'support@abclogistics.com', role: 'Support Agent', date: 'Jul 15, 2026', status: 'Expired' },
                        ].map((inv, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-bold text-slate-900 text-xs">{inv.email}</p>
                                    <p className="text-[11px] text-slate-500">{inv.role} • Sent on {inv.date}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    inv.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                    inv.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                    {inv.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Audit Activity */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-brand" />
                            <h3 className="text-xs font-bold text-slate-900">Audit Stream & Live Log</h3>
                        </div>
                        <span className="text-[11px] font-semibold text-brand cursor-pointer hover:underline">Full Log History</span>
                    </div>

                    <div className="space-y-2.5">
                        {[
                            { user: 'John Doe', action: 'accepted quote', target: 'QT-8822', time: '10:30 AM' },
                            { user: 'Jane Smith', action: 'assigned driver to', target: 'ORD-1023', time: '09:15 AM' },
                            { user: 'Sarah Lee', action: 'updated warehouse roster', target: 'WH-East', time: 'Yesterday' },
                        ].map((log, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                                <p className="text-xs text-slate-700">
                                    <strong className="text-slate-900">{log.user}</strong> {log.action} <strong className="text-brand">{log.target}</strong>
                                </p>
                                <span className="text-[10px] font-medium text-slate-400 shrink-0 ml-2">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
