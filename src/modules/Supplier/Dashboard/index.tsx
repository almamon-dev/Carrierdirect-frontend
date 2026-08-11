import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Legend
} from 'recharts';
import {
    Euro, FileText, Package, CreditCard, Star,
    TrendingUp, Activity, Truck, Bell, Wallet
} from 'lucide-react';
import Select from '@/components/ui/select';

const earningsData = [
    { name: 'May 01', earnings: 2000 },
    { name: 'May 03', earnings: 6000 },
    { name: 'May 04', earnings: 6800 },
    { name: 'May 05', earnings: 6200 },
    { name: 'May 06', earnings: 8500 },
    { name: 'May 08', earnings: 7800 },
    { name: 'May 09', earnings: 11000 },
    { name: 'May 10', earnings: 10500 },
    { name: 'May 11', earnings: 12000 },
    { name: 'May 12', earnings: 11800 },
    { name: 'May 14', earnings: 14500 },
    { name: 'May 15', earnings: 14000 },
    { name: 'May 16', earnings: 16500 },
    { name: 'May 18', earnings: 15800 },
    { name: 'May 19', earnings: 18000 },
    { name: 'May 20', earnings: 17500 },
    { name: 'May 21', earnings: 19000 },
    { name: 'May 23', earnings: 20500 },
    { name: 'May 24', earnings: 20000 },
    { name: 'May 26', earnings: 22000 },
    { name: 'May 27', earnings: 21500 },
    { name: 'May 29', earnings: 23000 },
    { name: 'May 30', earnings: 22000 },
    { name: 'May 31', earnings: 24580 },
];

const orderQuoteData = [
    { name: 'May 01', requests: 65, submitted: 40, won: 15 },
    { name: 'May 06', requests: 72, submitted: 38, won: 18 },
    { name: 'May 11', requests: 80, submitted: 48, won: 22 },
    { name: 'May 16', requests: 76, submitted: 44, won: 20 },
    { name: 'May 21', requests: 85, submitted: 52, won: 25 },
    { name: 'May 26', requests: 80, submitted: 48, won: 28 },
    { name: 'May 31', requests: 90, submitted: 62, won: 38 },
];

const recentQuotes = [
    { id: 'QR-7845', status: 'New', color: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400' },
    { id: 'QR-7844', status: 'Viewed', color: 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand' },
    { id: 'QR-7843', status: 'Quoted', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' },
    { id: 'QR-7842', status: 'New', color: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400' },
    { id: 'QR-7841', status: 'Quoted', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' },
    { id: 'QR-7840', status: 'Viewed', color: 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand' },
    { id: 'QR-7839', status: 'Lost', color: 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300' },
    { id: 'QR-7838', status: 'New', color: 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400' },
    { id: 'QR-7837', status: 'Viewed', color: 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand' },
    { id: 'QR-7836', status: 'Quoted', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' }
];

const activeOrders = [
    { id: 'ORD-1254', status: 'In Transit', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' },
    { id: 'ORD-1253', status: 'Pending', color: 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand' },
    { id: 'ORD-1252', status: 'Loading', color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' },
    { id: 'ORD-1251', status: 'In Transit', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' },
    { id: 'ORD-1250', status: 'Pending', color: 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand' },
    { id: 'ORD-1249', status: 'Delivered', color: 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300' },
    { id: 'ORD-1248', status: 'Loading', color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' },
    { id: 'ORD-1247', status: 'In Transit', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' },
    { id: 'ORD-1246', status: 'Pending', color: 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand' },
    { id: 'ORD-1245', status: 'Loading', color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' }
];

const notificationList = [
    { icon: FileText, text: 'New quote request QR-7845 received', bg: 'bg-purple-100 dark:bg-purple-950/60', color: 'text-purple-600 dark:text-purple-400', time: '10 min' },
    { icon: Package, text: 'Your quote for QR-7842 was accepted', bg: 'bg-emerald-100 dark:bg-emerald-950/60', color: 'text-emerald-600 dark:text-emerald-400', time: '1 hr' },
    { icon: Truck, text: 'ORD-1254 status changed to In Transit', bg: 'bg-blue-100 dark:bg-blue-950/60', color: 'text-brand', time: '2 hrs' },
    { icon: Euro, text: 'Payment of €1,250 received', bg: 'bg-emerald-100 dark:bg-emerald-950/60', color: 'text-emerald-600 dark:text-emerald-400', time: '5 hrs' },
    { icon: FileText, text: 'New quote request QR-7842 received', bg: 'bg-purple-100 dark:bg-purple-950/60', color: 'text-purple-600 dark:text-purple-400', time: '1 day' },
    { icon: Bell, text: 'Customer asked a question on QR-7840', bg: 'bg-amber-100 dark:bg-amber-950/60', color: 'text-amber-600 dark:text-amber-400', time: '1 day' },
    { icon: Package, text: 'Your quote for QR-7839 was rejected', bg: 'bg-rose-100 dark:bg-rose-950/60', color: 'text-rose-600 dark:text-rose-400', time: '2 days' },
    { icon: Truck, text: 'ORD-1249 marked as Delivered', bg: 'bg-blue-100 dark:bg-blue-950/60', color: 'text-brand', time: '3 days' },
    { icon: Euro, text: 'Payment of €450 received', bg: 'bg-emerald-100 dark:bg-emerald-950/60', color: 'text-emerald-600 dark:text-emerald-400', time: '3 days' },
];

const MetricCard = ({ title, description, value, icon: Icon, colorClass }: { title: string; description: string; value: string; icon: any; colorClass: string }) => (
    <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex flex-col items-start cursor-pointer w-full">
        <div className="flex justify-between items-start w-full mb-3">
            <div className={`w-9 h-9 rounded-md shrink-0 flex items-center justify-center ${colorClass}`}>
                <Icon size={18} strokeWidth={2} />
            </div>
            <span className="text-[20px] font-bold text-slate-800 dark:text-slate-200">{value}</span>
        </div>
        <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">
            {title}
        </h3>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-snug">
            {description}
        </p>
    </div>
);

export default function Dashboard() {
    return (
        <div className="p-4 md:p-5 space-y-4 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen transition-colors duration-200">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
                <MetricCard
                    title="Total Earnings"
                    description="View your recent and lifetime earnings overview."
                    value="€24,580"
                    icon={Euro}
                    colorClass="bg-brand-light dark:bg-[#ff4a1f]/15 text-brand"
                />
                <MetricCard
                    title="Active Orders"
                    description="Track and manage all your currently active orders."
                    value="8"
                    icon={Package}
                    colorClass="bg-brand-light dark:bg-[#ff4a1f]/15 text-brand"
                />
                <MetricCard
                    title="Pending Quotes"
                    description="Monitor quotes you've recently sent to clients."
                    value="21"
                    icon={FileText}
                    colorClass="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                />
                <MetricCard
                    title="Withdrawable Balance"
                    description="Balance currently available to withdraw."
                    value="€8,250"
                    icon={CreditCard}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                />
                <MetricCard
                    title="Avg. Rating"
                    description="Your average rating based on 342 reviews."
                    value="4.9"
                    icon={Star}
                    colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">

                {/* Area Chart - Earnings Overview */}
                <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 -mx-4 px-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-brand" />
                            <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Earnings Overview</h3>
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
                        <span className="text-2xl font-bold text-slate-900 dark:text-slate-200">€24,580</span>
                        <span className="text-sm font-bold text-emerald-500">+12.5% <span className="text-slate-400 dark:text-slate-500 font-medium">vs previous 30 days</span></span>
                    </div>

                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={earningsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF4A1F" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#FF4A1F" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} minTickGap={30} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dx={-10} tickFormatter={(val) => `€${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.3)', backgroundColor: '#1e2329', color: '#f8fafc' }}
                                    formatter={(value) => [`€${value}`, 'Earnings']}
                                />
                                <Area type="monotone" dataKey="earnings" stroke="#FF4A1F" strokeWidth={2} dot={{ r: 3, fill: '#FF4A1F', stroke: '#ffffff', strokeWidth: 2 }} activeDot={{ r: 5 }} fillOpacity={1} fill="url(#colorEarnings)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Chart - Order & Quote Overview */}
                <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4 -mx-4 px-4">
                        <div className="flex items-center gap-2">
                            <Activity size={16} className="text-brand" />
                            <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Order & Quote Overview</h3>
                        </div>
                        <Select
                            className="w-42"
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
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span className="w-2.5 h-2.5 rounded-md bg-brand"></span> Quote Requests
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span className="w-2.5 h-2.5 rounded-md bg-emerald-500"></span> Quotes Submitted
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span className="w-2.5 h-2.5 rounded-md bg-purple-500"></span> Orders Won
                        </div>
                    </div>

                    <div className="h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={orderQuoteData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.3)', backgroundColor: '#1e2329', color: '#f8fafc' }}
                                />
                                <Line type="monotone" dataKey="requests" stroke="#FF4A1F" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} name="Requests" />
                                <Line type="monotone" dataKey="submitted" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} name="Submitted" />
                                <Line type="monotone" dataKey="won" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 1.5 }} activeDot={{ r: 5 }} name="Won" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Footer Lists */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 -mx-4 px-4">
                        <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Recent Quote Requests</h3>
                        <button className="text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors">See All</button>
                    </div>
                    <div className="flex flex-col text-[13px] text-slate-500 dark:text-slate-400 flex-1">
                        {recentQuotes.slice(0, 5).map((quote, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2.5 border-b border-dashed border-slate-300 dark:border-slate-800 last:border-0 last:pb-0 first:pt-0">
                                <span className="font-bold text-slate-800 dark:text-slate-200">{quote.id}</span>
                                <span className={`${quote.color} px-2 py-0.5 rounded text-[11px] font-bold`}>{quote.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 -mx-4 px-4">
                        <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Active Orders</h3>
                        <button className="text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors">See All</button>
                    </div>
                    <div className="flex flex-col text-[13px] text-slate-500 dark:text-slate-400 flex-1">
                        {activeOrders.slice(0, 5).map((order, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2.5 border-b border-dashed border-slate-300 dark:border-slate-800 last:border-0 last:pb-0 first:pt-0">
                                <span className="font-bold text-slate-800 dark:text-slate-200">{order.id}</span>
                                <span className={`${order.color} px-2 py-0.5 rounded text-[11px] font-bold`}>{order.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1e2329] p-4 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 -mx-4 px-4">
                        <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Notifications</h3>
                        <button className="text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors">See All</button>
                    </div>
                    <div className="flex flex-col text-[13px] text-slate-500 dark:text-slate-400 flex-1">
                        {notificationList.slice(0, 4).map((notification, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-3 py-2.5 border-b border-dashed border-slate-300 dark:border-slate-800 last:border-0 last:pb-0 first:pt-0">
                                <div className="flex items-center gap-2.5 truncate">
                                    <div className={`w-7 h-7 rounded-full ${notification.bg} dark:bg-slate-800 flex items-center justify-center shrink-0`}>
                                        <notification.icon size={13} className={notification.color} />
                                    </div>
                                    <span className="truncate text-slate-700 dark:text-slate-300">{notification.text}</span>
                                </div>
                                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0">{notification.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
