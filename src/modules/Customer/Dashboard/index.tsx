import React from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { 
    DollarSign, FileText, Package, CreditCard, Star,
    TrendingUp, Activity, Truck, Bell
} from 'lucide-react';
import Select from '@/components/ui/select';

const spendData = [
    { name: 'May 01', spend: 1200 },
    { name: 'May 03', spend: 3400 },
    { name: 'May 04', spend: 4200 },
    { name: 'May 05', spend: 3900 },
    { name: 'May 06', spend: 5100 },
    { name: 'May 08', spend: 4800 },
    { name: 'May 09', spend: 6500 },
    { name: 'May 10', spend: 6100 },
    { name: 'May 11', spend: 7200 },
    { name: 'May 12', spend: 7000 },
    { name: 'May 14', spend: 8500 },
    { name: 'May 15', spend: 8100 },
    { name: 'May 16', spend: 9300 },
    { name: 'May 18', spend: 8900 },
    { name: 'May 19', spend: 10400 },
    { name: 'May 20', spend: 10000 },
    { name: 'May 21', spend: 11200 },
    { name: 'May 23', spend: 12500 },
    { name: 'May 24', spend: 12100 },
    { name: 'May 26', spend: 13400 },
    { name: 'May 27', spend: 13000 },
    { name: 'May 29', spend: 14200 },
    { name: 'May 30', spend: 13800 },
    { name: 'May 31', spend: 15400 },
];

const orderQuoteData = [
    { name: 'May 01', requests: 12, quotes: 8, booked: 3 },
    { name: 'May 06', requests: 15, quotes: 11, booked: 5 },
    { name: 'May 11', requests: 18, quotes: 14, booked: 6 },
    { name: 'May 16', requests: 14, quotes: 12, booked: 4 },
    { name: 'May 21', requests: 22, quotes: 18, booked: 8 },
    { name: 'May 26', requests: 19, quotes: 15, booked: 7 },
    { name: 'May 31', requests: 25, quotes: 21, booked: 10 },
];

const recentRequests = [
    { id: 'REQ-9235', status: 'Draft', color: 'bg-slate-100 text-slate-600' },
    { id: 'REQ-9234', status: 'Quoting', color: 'bg-amber-50 text-amber-600' },
    { id: 'REQ-9233', status: 'Booked', color: 'bg-emerald-50 text-emerald-600' },
    { id: 'REQ-9232', status: 'Action Required', color: 'bg-rose-50 text-rose-600' },
    { id: 'REQ-9231', status: 'Booked', color: 'bg-emerald-50 text-emerald-600' },
    { id: 'REQ-9230', status: 'Reviewing', color: 'bg-blue-50 text-blue-600' },
    { id: 'REQ-9229', status: 'Cancelled', color: 'bg-slate-100 text-slate-600' },
    { id: 'REQ-9228', status: 'Quoting', color: 'bg-amber-50 text-amber-600' },
    { id: 'REQ-9227', status: 'Reviewing', color: 'bg-blue-50 text-blue-600' },
    { id: 'REQ-9226', status: 'Booked', color: 'bg-emerald-50 text-emerald-600' }
];

const activeOrders = [
    { id: 'ORD-3354', route: 'Dhaka → Chittagong', status: 'In Transit', progress: 65, color: 'bg-emerald-50 text-emerald-600', progressColor: 'bg-emerald-500' },
    { id: 'ORD-3353', route: 'Sylhet → Dhaka', status: 'Loading', progress: 15, color: 'bg-amber-50 text-amber-600', progressColor: 'bg-amber-500' },
    { id: 'ORD-3351', route: 'Khulna → Rajshahi', status: 'In Transit', progress: 80, color: 'bg-emerald-50 text-emerald-600', progressColor: 'bg-emerald-500' },
    { id: 'ORD-3350', route: 'Dhaka → Sylhet', status: 'Pending', progress: 5, color: 'bg-blue-50 text-blue-600', progressColor: 'bg-blue-500' },
    { id: 'ORD-3348', route: 'Rajshahi → Dhaka', status: 'Out for Delivery', progress: 95, color: 'bg-emerald-50 text-emerald-600', progressColor: 'bg-emerald-500' }
];

const notificationList = [
    { icon: FileText, text: 'New quote received for REQ-9234', bg: 'bg-purple-100', color: 'text-purple-600', time: '5 min' },
    { icon: Package, text: 'Your booking for REQ-9233 was confirmed', bg: 'bg-emerald-100', color: 'text-emerald-600', time: '30 min' },
    { icon: Truck, text: 'ORD-3354 status changed to In Transit', bg: 'bg-blue-100', color: 'text-blue-600', time: '1 hr' },
    { icon: DollarSign, text: 'Payment of €900 sent', bg: 'bg-emerald-100', color: 'text-emerald-600', time: '4 hrs' },
    { icon: FileText, text: 'New quote received for REQ-9232', bg: 'bg-purple-100', color: 'text-purple-600', time: '12 hrs' },
    { icon: Bell, text: 'Supplier asked a question on REQ-9230', bg: 'bg-amber-100', color: 'text-amber-600', time: '1 day' },
    { icon: Package, text: 'Your booking for REQ-9229 was cancelled', bg: 'bg-rose-100', color: 'text-rose-600', time: '2 days' },
    { icon: Truck, text: 'ORD-3349 marked as Delivered', bg: 'bg-blue-100', color: 'text-blue-600', time: '3 days' },
    { icon: DollarSign, text: 'Payment of €350 sent', bg: 'bg-emerald-100', color: 'text-emerald-600', time: '4 days' },
    { icon: Star, text: 'Please rate your recent delivery', bg: 'bg-amber-100', color: 'text-amber-600', time: '1 week' }
];

const MetricCard = ({ title, description, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex flex-col items-start cursor-pointer w-full">
        <div className="flex justify-between items-start w-full mb-3">
            <div className={`w-9 h-9 rounded-md shrink-0 flex items-center justify-center ${colorClass}`}>
                <Icon size={18} strokeWidth={2} />
            </div>
            <span className="text-[20px] font-black text-slate-800">{value}</span>
        </div>
        <h3 className="font-bold text-[14px] text-slate-900 leading-tight mb-0.5">
            {title}
        </h3>
        <p className="text-[12px] text-slate-500 font-medium leading-snug">
            {description}
        </p>
    </div>
);

export default function Dashboard() {
    return (
        <div className="p-4 md:p-5 space-y-4 bg-[#f8fafc] min-h-screen">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
                <MetricCard 
                    title="Total Spending" 
                    description="View your recent and lifetime spending overview." 
                    value="€15,400"
                    icon={DollarSign}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <MetricCard 
                    title="Active Orders" 
                    description="Track and manage all your currently active orders." 
                    value="12"
                    icon={Package}
                    colorClass="bg-indigo-50 text-indigo-600"
                />
                <MetricCard 
                    title="Active Requests" 
                    description="Monitor requests you've recently sent to suppliers." 
                    value="5"
                    icon={FileText}
                    colorClass="bg-orange-50 text-orange-600"
                />
                <MetricCard 
                    title="Wallet Balance" 
                    description="Available balance in your corporate account." 
                    value="€3,400"
                    icon={CreditCard}
                    colorClass="bg-emerald-50 text-emerald-600"
                />
                <MetricCard 
                    title="Avg. Rating" 
                    description="Your average rating given to suppliers." 
                    value="4.8"
                    icon={Star}
                    colorClass="bg-purple-50 text-purple-600"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                
                {/* Area Chart - Spending Overview */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 -mx-4 px-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-indigo-600" />
                            <h3 className="text-[15px] font-bold text-slate-900">Spending Overview</h3>
                        </div>
                        <Select 
                            className="w-38"
                            value="30_days"
                            showSearch={false}
                            options={[
                                { id: '30_days', name: 'Last 30 Days' },
                                { id: '3_months', name: 'Last 3 Months' },
                                { id: 'this_year', name: 'This Year' },
                            ]}
                        />
                    </div>

                    <div className="flex items-baseline gap-3 mb-4">
                        <span className="text-2xl font-extrabold text-slate-900">€15,400</span>
                        <span className="text-sm font-bold text-emerald-500">-5.2% <span className="text-slate-400 font-medium">vs previous 30 days</span></span>
                    </div>

                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={spendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} minTickGap={30} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dx={-10} tickFormatter={(val) => `€${val/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`€${value}`, 'Spending']}
                                />
                                <Area type="monotone" dataKey="spend" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }} activeDot={{ r: 5 }} fillOpacity={1} fill="url(#colorSpend)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Chart - Request & Order Overview */}
                <div className="bg-white p-4 rounded-lg border border-slate-200 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 -mx-4 px-4">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-indigo-600" />
                            <h3 className="text-[15px] font-bold text-slate-900">Request & Order Overview</h3>
                        </div>
                        <Select 
                            className="w-38"
                            value="30_days"
                            showSearch={false}
                            options={[
                                { id: '30_days', name: 'Last 30 Days' },
                                { id: '3_months', name: 'Last 3 Months' },
                                { id: 'this_year', name: 'This Year' },
                            ]}
                        />
                    </div>

                    <div className="flex items-center gap-4 mb-4 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span> Requests Sent
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Quotes Received
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> Orders Booked
                        </div>
                    </div>

                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={orderQuoteData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.1)' }}
                                />
                                <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} name="Requests" />
                                <Line type="monotone" dataKey="quotes" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} name="Quotes" />
                                <Line type="monotone" dataKey="booked" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} name="Booked" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
            
            {/* Live Tracking - Full Width Horizontal */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 overflow-hidden mb-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 -mx-4 px-4">
                    <h3 className="text-[15px] font-bold text-slate-900">Live Tracking</h3>
                    <button className="text-[12px] font-bold text-indigo-600 hover:underline focus:outline-none transition-colors">See All Active Shipments</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activeOrders.slice(0, 4).map((order, idx) => (
                        <div key={idx} className="border border-slate-100 rounded-lg p-3 hover:border-slate-300 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-center mb-3">
                                <span className="font-bold text-[13px] text-slate-800">{order.id}</span>
                                <span className={`${order.color} px-2 py-0.5 rounded text-[10px] font-bold`}>{order.status}</span>
                            </div>
                            <div className="relative pt-2 pb-1">
                                <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2">
                                    <span>{order.route.split('→')[0].trim()}</span>
                                    <span>{order.route.split('→')[1].trim()}</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-visible relative flex items-center">
                                    <div className={`h-1.5 rounded-full ${order.progressColor} relative`} style={{ width: `${order.progress}%` }}>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full flex items-center justify-center shadow-sm">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 -mx-4 px-4">
                        <h3 className="text-[15px] font-bold text-slate-900">Recent Requests</h3>
                        <button className="text-[12px] font-bold text-indigo-600 hover:underline focus:outline-none transition-colors">See All</button>
                    </div>
                    <div className="flex flex-col text-[13px] text-slate-500 flex-1">
                        {recentRequests.slice(0, 5).map((req, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2.5 border-b border-dashed border-slate-300 last:border-0 last:pb-0 first:pt-0">
                                <span className="font-bold text-slate-800">{req.id}</span>
                                <span className={`${req.color} px-2 py-0.5 rounded text-[11px] font-bold`}>{req.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-slate-200 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 -mx-4 px-4">
                        <h3 className="text-[15px] font-bold text-slate-900">Notifications</h3>
                        <button className="text-[12px] font-bold text-indigo-600 hover:underline focus:outline-none transition-colors">See All</button>
                    </div>
                    <div className="flex flex-col text-[13px] text-slate-500 flex-1">
                        {notificationList.slice(0, 5).map((notification, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3 py-2.5 border-b border-dashed border-slate-300 last:border-0 last:pb-0 first:pt-0">
                                <div className="flex items-center gap-2.5 truncate">
                                    <div className={`w-7 h-7 rounded-full ${notification.bg} flex items-center justify-center shrink-0`}>
                                        <notification.icon size={13} className={notification.color} />
                                    </div>
                                    <span className="truncate">{notification.text}</span>
                                </div>
                                <span className="text-[11px] font-medium text-slate-400 shrink-0">{notification.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
