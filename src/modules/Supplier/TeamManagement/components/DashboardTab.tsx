import React from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { 
    Users, UserCheck, Clock, ShieldCheck, Truck, Package, MonitorPlay, TrendingUp, UserPlus
} from 'lucide-react';
import Select from '@/components/ui/select';

const memberGrowthData = [
    { name: 'May 01', members: 32 },
    { name: 'May 05', members: 35 },
    { name: 'May 10', members: 35 },
    { name: 'May 15', members: 38 },
    { name: 'May 20', members: 40 },
    { name: 'May 25', members: 42 },
    { name: 'May 31', members: 45 },
];

const MetricCard = ({ title, description, value, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex flex-col items-start cursor-pointer w-full shadow-sm">
        <div className="flex justify-between items-start w-full mb-3">
            <div className={`w-9 h-9 rounded-md shrink-0 flex items-center justify-center ${colorClass}`}>
                <Icon size={18} strokeWidth={2} />
            </div>
            <span className="text-[20px] font-bold text-slate-800">{value}</span>
        </div>
        <h3 className="text-[13px] font-bold text-slate-800 mb-0.5">
            {title}
        </h3>
        <p className="text-[12px] text-slate-500 font-medium leading-snug">
            {description}
        </p>
    </div>
);

export default function DashboardTab() {
    return (
        <div className="space-y-4">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                <MetricCard 
                    title="Total Team Members" 
                    description="All registered staff across departments." 
                    value="45"
                    icon={Users}
                    colorClass="bg-brand-light text-brand"
                />
                <MetricCard 
                    title="Active Members" 
                    description="Staff currently active and not on leave." 
                    value="42"
                    icon={UserCheck}
                    colorClass="bg-emerald-50 text-emerald-600"
                />
                <MetricCard 
                    title="Pending Invitations" 
                    description="Awaiting response from invited users." 
                    value="3"
                    icon={Clock}
                    colorClass="bg-amber-50 text-amber-600"
                />
                <MetricCard 
                    title="Online Users" 
                    description="Team members currently logged in." 
                    value="18"
                    icon={MonitorPlay}
                    colorClass="bg-brand-light text-brand"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                
                {/* Area Chart - Team Growth */}
                <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 -mx-4 px-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-brand" />
                            <h3 className="text-[13px] font-bold text-slate-800">Team Growth</h3>
                        </div>
                        <Select 
                            className="w-32"
                            value="this_month"
                            showSearch={false}
                            options={[
                                { id: 'this_month', name: 'This Month' },
                                { id: 'last_month', name: 'Last Month' },
                                { id: 'this_year', name: 'This Year' },
                            ]}
                        />
                    </div>

                    <div className="flex items-baseline gap-3 mb-4">
                        <span className="text-2xl font-bold text-slate-900">45</span>
                        <span className="text-sm font-bold text-emerald-500">+13% <span className="text-slate-400 font-medium">vs previous month</span></span>
                    </div>

                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={memberGrowthData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF4A1F" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#FF4A1F" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} minTickGap={30} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`${value}`, 'Members']}
                                />
                                <Area type="monotone" dataKey="members" stroke="#FF4A1F" strokeWidth={2} dot={{ r: 3, fill: '#FF4A1F', stroke: '#ffffff', strokeWidth: 2 }} activeDot={{ r: 5 }} fillOpacity={1} fill="url(#colorMembers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Department Stats Side List */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 -mx-4 px-4">
                        <h3 className="text-[13px] font-bold text-slate-800">Department Breakdown</h3>
                    </div>
                    
                    <div className="flex flex-col gap-3 mt-2">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-indigo-100 text-brand flex items-center justify-center shrink-0">
                                    <Truck size={16} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm leading-tight">Drivers</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Fleet and transport staff</p>
                                </div>
                            </div>
                            <span className="font-bold text-lg text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm">25</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <Package size={16} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm leading-tight">Warehouse</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Inventory and sorting</p>
                                </div>
                            </div>
                            <span className="font-bold text-lg text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm">12</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                    <ShieldCheck size={16} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm leading-tight">Operations</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Management and dispatch</p>
                                </div>
                            </div>
                            <span className="font-bold text-lg text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-md shadow-sm">8</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Bottom Row - Recent Activity / Invitations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 -mx-4 px-4">
                        <h3 className="text-[13px] font-bold text-slate-800">Recent Invitations</h3>
                        <button className="text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors">Manage All</button>
                    </div>
                    <div className="flex flex-col text-[13px] text-slate-500 flex-1">
                        <div className="flex justify-between items-center py-2.5 border-b border-dashed border-slate-300">
                            <div className="flex items-center gap-2">
                                <UserPlus size={14} className="text-slate-400" />
                                <span className="font-bold text-slate-800">newguy@abclogistics.com</span>
                            </div>
                            <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded text-[11px] font-bold">Pending</span>
                        </div>
                        <div className="flex justify-between items-center py-2.5 border-b border-dashed border-slate-300">
                            <div className="flex items-center gap-2">
                                <UserPlus size={14} className="text-slate-400" />
                                <span className="font-bold text-slate-800">sales@abclogistics.com</span>
                            </div>
                            <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[11px] font-bold">Accepted</span>
                        </div>
                        <div className="flex justify-between items-center py-2.5">
                            <div className="flex items-center gap-2">
                                <UserPlus size={14} className="text-slate-400" />
                                <span className="font-bold text-slate-800">support@abclogistics.com</span>
                            </div>
                            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[11px] font-bold">Expired</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 -mx-4 px-4">
                        <h3 className="text-[13px] font-bold text-slate-800">Recent Activity</h3>
                        <button className="text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors">View Logs</button>
                    </div>
                    <div className="flex flex-col text-[13px] text-slate-500 flex-1">
                        <div className="flex justify-between items-center py-2.5 border-b border-dashed border-slate-300">
                            <span className="font-medium"><strong className="text-slate-800">John Doe</strong> accepted quote <strong className="text-slate-800">QT-8822</strong></span>
                            <span className="text-[11px] font-medium text-slate-400">10:30 AM</span>
                        </div>
                        <div className="flex justify-between items-center py-2.5 border-b border-dashed border-slate-300">
                            <span className="font-medium"><strong className="text-slate-800">Jane Smith</strong> assigned driver to <strong className="text-slate-800">ORD-1023</strong></span>
                            <span className="text-[11px] font-medium text-slate-400">09:15 AM</span>
                        </div>
                        <div className="flex justify-between items-center py-2.5">
                            <span className="font-medium"><strong className="text-slate-800">Admin</strong> updated Company Settings</span>
                            <span className="text-[11px] font-medium text-slate-400">Yesterday</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
