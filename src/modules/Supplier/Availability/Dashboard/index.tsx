import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import DataTable from '@/components/tables/data-table';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { 
    Calendar, CheckCircle, UserCircle, Truck, 
    Map, Activity, TrendingUp, Briefcase 
} from 'lucide-react';

const WEEKLY_DATA = [
    { name: 'Mon', available: 20, booked: 12 },
    { name: 'Tue', available: 25, booked: 18 },
    { name: 'Wed', available: 22, booked: 20 },
    { name: 'Thu', available: 28, booked: 15 },
    { name: 'Fri', available: 30, booked: 25 },
    { name: 'Sat', available: 15, booked: 14 },
    { name: 'Sun', available: 10, booked: 5 },
];

const ASSET_STATUS_DATA = [
    { name: 'In Transit', value: 45 },
    { name: 'Available', value: 30 },
    { name: 'Maintenance', value: 15 },
    { name: 'Off Duty', value: 10 },
];

const COLORS = ['#8b5cf6', '#0ea5e9', '#10b981', '#f43f5e']; // Purple, Sky, Emerald, Rose

const HISTORY_COLUMNS = [
    { id: 'date', label: 'Date', render: (row: any) => <span className="font-semibold text-slate-800">{row.date}</span> },
    { id: 'action', label: 'Action Taken', render: (row: any) => <span className="font-medium text-slate-700">{row.action}</span> },
    { id: 'details', label: 'Details' },
    { id: 'user', label: 'Triggered By' },
    { 
        id: 'status', 
        label: 'Status', 
        render: (row: any) => (
            <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                row.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                row.status === 'Warning' ? 'bg-amber-100 text-amber-700' :
                'bg-blue-100 text-blue-700'
            }`}>
                {row.status}
            </span>
        ) 
    },
];

const HISTORY_DATA = [
    { date: '2026-07-21 14:30', action: 'Schedule Updated', details: 'Added 5 slots for afternoon shifts.', status: 'Completed', user: 'System Auto' },
    { date: '2026-07-20 09:15', action: 'Capacity Alert', details: 'Route London-Paris reached 95% capacity.', status: 'Warning', user: 'System Monitor' },
    { date: '2026-07-19 16:45', action: 'Holiday Blocked', details: 'Blocked July 25th for National Holiday.', status: 'Completed', user: 'Admin' },
    { date: '2026-07-18 08:00', action: 'Driver Unavailability', details: 'Driver John Doe marked unavailable.', status: 'Notice', user: 'John Doe' },
];

export default function AvailabilityDashboard() {
    const [statusFilter, setStatusFilter] = React.useState('all');

    const filteredHistory = React.useMemo(() => {
        return HISTORY_DATA.filter(item => {
            if (statusFilter !== 'all' && item.status !== statusFilter) return false;
            return true;
        });
    }, [statusFilter]);

    return (
        <div className="p-4 w-full mx-auto space-y-4 min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-[18px] font-bold text-slate-900">Availability Dashboard</h1>
                <p className="text-[12px] text-slate-500 mt-0.5">Overview of your capacity, assets, and booking utilization.</p>
            </div>

            {/* Top Metric Widgets Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
                {[
                    { label: 'Available Slots', value: '142', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Booked Slots', value: '89', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Available Drivers', value: '24/30', icon: UserCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Available Vehicles', value: '18/25', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Active Routes', value: '12', icon: Map, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: "Today's Capacity", value: '85%', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50' },
                    { label: 'Upcoming Trips', value: '45', icon: Briefcase, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                    { label: 'Utilization Rate', value: '78%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                    <Icon size={14} strokeWidth={2.5} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[18px] font-black text-slate-900 leading-tight mb-0.5">{stat.value}</h3>
                                <p className="text-[10px] font-semibold text-slate-500 ">{stat.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Availability vs Booked */}
                <Card className="shadow-sm border-slate-200 lg:col-span-2 overflow-visible">
                    <CardHeader className="py-3 px-4 border-b border-slate-100">
                        <CardTitle className="text-[13px] flex justify-between items-center overflow-visible">
                            <span>Availability vs Bookings</span>
                            <div className="w-28 h-7 font-normal">
                                <Select 
                                    value="this_week"
                                    options={[
                                        { id: 'this_week', name: 'This Week' },
                                        { id: 'last_week', name: 'Last Week' },
                                        { id: 'last_month', name: 'Last Month' },
                                        { id: 'last_year', name: 'Last Year' }
                                    ]}
                                    showSearch={false}
                                />
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={WEEKLY_DATA} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '6px', fontSize: '11px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569' }} iconType="circle" />
                                <Line type="monotone" dataKey="available" name="Available Slots" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="booked" name="Booked Slots" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Fleet Status Pie Chart */}
                <Card className="shadow-sm border-slate-200 lg:col-span-1">
                    <CardHeader className="py-3 px-4 border-b border-slate-100">
                        <CardTitle className="text-[13px]">Asset Status Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '6px', fontSize: '11px', color: '#fff' }}
                                />
                                <Pie
                                    data={ASSET_STATUS_DATA}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={75}
                                    dataKey="value"
                                    style={{ fontSize: '10px', fontWeight: 600 }}
                                >
                                    {ASSET_STATUS_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>

            {/* History Table */}
            <div className="pt-2">
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="py-3 px-4 border-b border-slate-100">
                        <CardTitle className="text-[13px] flex items-center justify-between w-full">
                            <span>Recent Availability Changes (History)</span>
                            <Button variant="ghost" className="h-6 text-[11px] font-bold text-indigo-600 px-2 py-0 hover:bg-indigo-50">
                                See All
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <DataTable 
                            compact={true}
                            columns={HISTORY_COLUMNS}
                            data={filteredHistory}
                            hideViewToggle={true} 
                            hidePagination={true}
                            searchPlaceholder="Search history..."
                            filterContent={
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-semibold text-slate-700">Filter by Status</label>
                                        <div className="h-8">
                                            <Select 
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                                options={[
                                                    { id: 'all', name: 'All Statuses' },
                                                    { id: 'Completed', name: 'Completed' },
                                                    { id: 'Warning', name: 'Warning' },
                                                    { id: 'Notice', name: 'Notice' }
                                                ]}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
