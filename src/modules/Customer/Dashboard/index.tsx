import React from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { 
    Euro, FileText, Package, CreditCard, Star,
    TrendingUp, Activity, Truck, Bell, MapPin, Navigation, ArrowUpRight
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
    { id: 'REQ-9235', status: 'Draft', color: 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60' },
    { id: 'REQ-9234', status: 'Quoting', color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50' },
    { id: 'REQ-9233', status: 'Booked', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' },
    { id: 'REQ-9232', status: 'Action Required', color: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50' },
    { id: 'REQ-9231', status: 'Booked', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' },
    { id: 'REQ-9230', status: 'Reviewing', color: 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand border-brand/20 dark:border-[#ff4a1f]/30' },
    { id: 'REQ-9229', status: 'Cancelled', color: 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60' },
    { id: 'REQ-9228', status: 'Quoting', color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50' },
    { id: 'REQ-9227', status: 'Reviewing', color: 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand border-brand/20 dark:border-[#ff4a1f]/30' },
    { id: 'REQ-9226', status: 'Booked', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' }
];

const activeOrders = [
    { id: 'ORD-3354', route: 'Dhaka → Chittagong', lastLocation: 'Comilla Checkpoint', supplier: 'Global Express Ltd.', vehicle: 'Covered Van (14ft)', eta: 'Today, 04:30 PM', status: 'In Transit', progress: 65, color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50', progressColor: 'bg-emerald-500' },
    { id: 'ORD-3353', route: 'Sylhet → Dhaka', lastLocation: 'Sylhet Hub', supplier: 'Speedy Carrier Co.', vehicle: 'Flatbed Truck (20ft)', eta: 'Tomorrow, 10:00 AM', status: 'Loading', progress: 15, color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50', progressColor: 'bg-amber-500' },
    { id: 'ORD-3351', route: 'Khulna → Rajshahi', lastLocation: 'Kushtia Bypass', supplier: 'Apex Logistics', vehicle: 'Refrigerated Truck', eta: 'Jul 27, 09:00 AM', status: 'In Transit', progress: 80, color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50', progressColor: 'bg-emerald-500' },
    { id: 'ORD-3350', route: 'Dhaka → Sylhet', lastLocation: 'Dhaka Depot', supplier: 'FastTrack Transport', vehicle: 'Container (40ft)', eta: 'Jul 27, 02:00 PM', status: 'Pending', progress: 5, color: 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand border-brand/20 dark:border-[#ff4a1f]/30', progressColor: 'bg-brand' },
    { id: 'ORD-3348', route: 'Rajshahi → Dhaka', lastLocation: 'Gazipur Chowrasta', supplier: 'Rapid Haulage', vehicle: 'Pickup Van', eta: 'Today, 06:15 PM', status: 'Out for Delivery', progress: 95, color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50', progressColor: 'bg-emerald-500' }
];

const notificationList = [
    { icon: FileText, text: 'New quote received for REQ-9234', bg: 'bg-purple-100 dark:bg-purple-950/60', color: 'text-purple-600 dark:text-purple-400', time: '5 min' },
    { icon: Package, text: 'Your booking for REQ-9233 was confirmed', bg: 'bg-emerald-100 dark:bg-emerald-950/60', color: 'text-emerald-600 dark:text-emerald-400', time: '30 min' },
    { icon: Truck, text: 'ORD-3354 status changed to In Transit', bg: 'bg-blue-100 dark:bg-blue-950/60', color: 'text-brand', time: '1 hr' },
    { icon: Euro, text: 'Payment of €900 sent', bg: 'bg-emerald-100 dark:bg-emerald-950/60', color: 'text-emerald-600 dark:text-emerald-400', time: '4 hrs' },
    { icon: FileText, text: 'New quote received for REQ-9232', bg: 'bg-purple-100 dark:bg-purple-950/60', color: 'text-purple-600 dark:text-purple-400', time: '12 hrs' },
    { icon: Bell, text: 'Supplier asked a question on REQ-9230', bg: 'bg-amber-100 dark:bg-amber-950/60', color: 'text-amber-600 dark:text-amber-400', time: '1 day' },
    { icon: Package, text: 'Your booking for REQ-9229 was cancelled', bg: 'bg-rose-100 dark:bg-rose-950/60', color: 'text-rose-600 dark:text-rose-400', time: '2 days' },
    { icon: Truck, text: 'ORD-3349 marked as Delivered', bg: 'bg-blue-100 dark:bg-blue-950/60', color: 'text-brand', time: '3 days' },
    { icon: Euro, text: 'Payment of €350 sent', bg: 'bg-emerald-100 dark:bg-emerald-950/60', color: 'text-emerald-600 dark:text-emerald-400', time: '4 days' },
    { icon: Star, text: 'Please rate your recent delivery', bg: 'bg-amber-100 dark:bg-amber-950/60', color: 'text-amber-600 dark:text-amber-400', time: '1 week' }
];

interface MetricCardProps {
    title: string;
    description: string;
    value: string;
    icon: React.ElementType;
    colorClass: string;
    isLastOnMobile?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, description, value, icon: Icon, colorClass, isLastOnMobile = false }) => (
    <div className={`bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer w-full ${isLastOnMobile ? 'col-span-2 sm:col-span-1' : ''}`}>
        <div>
            <div className="flex justify-between items-start w-full mb-2 sm:mb-3">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                </div>
                <span className="text-[18px] sm:text-[20px] font-extrabold text-slate-900 dark:text-slate-200 tracking-tight">{value}</span>
            </div>
            <h3 className="text-[12.5px] sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                {title}
            </h3>
        </div>
        <p className="text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-snug line-clamp-2 mt-1">
            {description}
        </p>
    </div>
);

export default function Dashboard() {
    return (
        <div className="p-3 sm:p-4 md:p-5 space-y-3.5 sm:space-y-4 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen transition-colors duration-200">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4 mt-0.5 sm:mt-1">
                <MetricCard 
                    title="Total Spending" 
                    description="View recent and lifetime spending overview." 
                    value="€15,400"
                    icon={Euro}
                    colorClass="bg-brand-light dark:bg-[#ff4a1f]/15 text-brand"
                />
                <MetricCard 
                    title="Active Orders" 
                    description="Track and manage currently active orders." 
                    value="12"
                    icon={Package}
                    colorClass="bg-brand-light dark:bg-[#ff4a1f]/15 text-brand"
                />
                <MetricCard 
                    title="Active Requests" 
                    description="Monitor requests recently sent to suppliers." 
                    value="5"
                    icon={FileText}
                    colorClass="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                />
                <MetricCard 
                    title="Wallet Balance" 
                    description="Available balance in corporate account." 
                    value="€3,400"
                    icon={CreditCard}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                />
                <MetricCard 
                    title="Avg. Rating" 
                    description="Average rating given to suppliers." 
                    value="4.8"
                    icon={Star}
                    colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                    isLastOnMobile={true}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* Area Chart - Spending Overview */}
                <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 sm:mb-4 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4 gap-2 sm:gap-0">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-[#ff4a1f]/15 text-brand flex items-center justify-center shrink-0">
                                <TrendingUp size={15} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">Spending Overview</h3>
                        </div>
                        <Select 
                            className="w-full sm:w-36 text-xs"
                            value="30_days"
                            showSearch={false}
                            options={[
                                { id: '30_days', name: 'Last 30 Days' },
                                { id: '3_months', name: 'Last 3 Months' },
                                { id: 'this_year', name: 'This Year' },
                            ]}
                        />
                    </div>

                    <div className="flex items-baseline gap-2.5 mb-3 sm:mb-4">
                        <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-200">€15,400</span>
                        <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                            -5.2% <span className="text-slate-400 dark:text-slate-500 font-medium">vs prev 30 days</span>
                        </span>
                    </div>

                    <div className="h-[180px] sm:h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={spendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF4A1F" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#FF4A1F" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={8} minTickGap={25} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dx={-5} tickFormatter={(val) => `€${val/1000}k`} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.3)', fontSize: '12px', backgroundColor: '#1e2329', color: '#f8fafc' }}
                                    formatter={(value) => [`€${value}`, 'Spending']}
                                />
                                <Area type="monotone" dataKey="spend" stroke="#FF4A1F" strokeWidth={2} dot={{ r: 2.5, fill: '#FF4A1F', stroke: '#ffffff', strokeWidth: 1.5 }} activeDot={{ r: 5 }} fillOpacity={1} fill="url(#colorSpend)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Chart - Request & Order Overview */}
                <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 sm:mb-4 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4 gap-2 sm:gap-0">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-[#ff4a1f]/15 text-brand flex items-center justify-center shrink-0">
                                <Activity size={15} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">Request & Order Overview</h3>
                        </div>
                        <Select 
                            className="w-full sm:w-36 text-xs"
                            value="30_days"
                            showSearch={false}
                            options={[
                                { id: '30_days', name: 'Last 30 Days' },
                                { id: '3_months', name: 'Last 3 Months' },
                                { id: 'this_year', name: 'This Year' },
                            ]}
                        />
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand"></span> Requests Sent
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Quotes Received
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Orders Booked
                        </div>
                    </div>

                    <div className="h-[180px] sm:h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={orderQuoteData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={8} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.3)', fontSize: '12px', backgroundColor: '#1e2329', color: '#f8fafc' }}
                                />
                                <Line type="monotone" dataKey="requests" stroke="#FF4A1F" strokeWidth={2.5} dot={{ r: 2.5, strokeWidth: 1 }} activeDot={{ r: 4 }} name="Requests" />
                                <Line type="monotone" dataKey="quotes" stroke="#10b981" strokeWidth={2.5} dot={{ r: 2.5, strokeWidth: 1 }} activeDot={{ r: 4 }} name="Quotes" />
                                <Line type="monotone" dataKey="booked" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 2.5, strokeWidth: 1 }} activeDot={{ r: 4 }} name="Booked" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
            
            {/* Live Tracking - Active Shipments Section */}
            <div className="bg-white dark:bg-[#1e2329] rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
                <div className="flex items-center justify-between px-3.5 sm:px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181a20]/50">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-orange-100/70 dark:bg-[#ff4a1f]/15 text-brand flex items-center justify-center shrink-0">
                            <Truck size={15} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">Live Active Shipments</h3>
                    </div>
                    <button className="text-[11px] sm:text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors">See All</button>
                </div>

                {/* Desktop & Tablet Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-[12px]">
                        <thead className="bg-slate-50 dark:bg-[#181a20] text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="py-2.5 px-3.5">Order ID</th>
                                <th className="py-2.5 px-3.5">Route & Checkpoint</th>
                                <th className="py-2.5 px-3.5">Carrier</th>
                                <th className="py-2.5 px-3.5">Vehicle</th>
                                <th className="py-2.5 px-3.5">Status</th>
                                <th className="py-2.5 px-3.5">Est. Delivery</th>
                                <th className="py-2.5 px-3.5">Progress</th>
                                <th className="py-2.5 px-3.5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            {activeOrders.map((order, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-2.5 px-3.5 font-bold text-slate-900 dark:text-slate-200 text-[12px]">{order.id}</td>
                                    <td className="py-2.5 px-3.5">
                                        <span className="font-semibold text-slate-800 dark:text-slate-200">{order.route}</span>
                                        <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium ml-2">({order.lastLocation})</span>
                                    </td>
                                    <td className="py-2.5 px-3.5 font-medium text-slate-700 dark:text-slate-300 text-[12px]">{order.supplier}</td>
                                    <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400 text-[11.5px]">{order.vehicle}</td>
                                    <td className="py-2.5 px-3.5">
                                        <span className={`${order.color} px-2 py-0.5 rounded-full border text-[10px] font-bold inline-block`}>{order.status}</span>
                                    </td>
                                    <td className="py-2.5 px-3.5 text-[11.5px] font-medium text-slate-600 dark:text-slate-400">{order.eta}</td>
                                    <td className="py-2.5 px-3.5 w-36">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className={`h-1.5 rounded-full ${order.progressColor}`} style={{ width: `${order.progress}%` }}></div>
                                            </div>
                                            <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 shrink-0">{order.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-3.5 text-right">
                                        <button className="text-[11px] font-bold text-brand hover:text-brand-dark px-2.5 py-1 rounded-md bg-brand-light/60 dark:bg-[#ff4a1f]/20 hover:bg-brand-light dark:hover:bg-[#ff4a1f]/30 transition-colors whitespace-nowrap cursor-pointer">
                                            Track
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {activeOrders.map((order, idx) => (
                        <div key={idx} className="p-3.5 space-y-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900 dark:text-slate-200 text-[13px]">{order.id}</span>
                                    <span className={`${order.color} px-2 py-0.5 rounded-full border text-[10px] font-bold`}>{order.status}</span>
                                </div>
                                <button className="text-[11px] font-bold text-brand hover:text-brand-dark px-2.5 py-1 rounded-md bg-brand-light/60 dark:bg-[#ff4a1f]/20 hover:bg-brand-light transition-colors cursor-pointer">
                                    Track
                                </button>
                            </div>

                            <div className="flex items-start gap-1.5 text-[12px]">
                                <Navigation className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{order.route}</span>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">At: <span className="font-medium text-slate-700 dark:text-slate-300">{order.lastLocation}</span></p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-[#181a20] p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Carrier</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">{order.supplier}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">ETA</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300 block">{order.eta}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-0.5">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                    <div className={`h-1.5 rounded-full ${order.progressColor}`} style={{ width: `${order.progress}%` }}></div>
                                </div>
                                <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 shrink-0">{order.progress}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                
                {/* Recent Requests */}
                <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2.5 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4">
                        <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">Recent Requests</h3>
                        <button className="text-[11px] sm:text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors">See All</button>
                    </div>
                    <div className="flex flex-col text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 flex-1">
                        {recentRequests.slice(0, 5).map((req, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 sm:py-2.5 border-b border-dashed border-slate-200 dark:border-slate-800 last:border-0">
                                <span className="font-bold text-slate-900 dark:text-slate-200">{req.id}</span>
                                <span className={`${req.color} px-2 py-0.5 rounded-full border text-[10.5px] font-bold`}>{req.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Notifications */}
                <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2.5 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4">
                        <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">Notifications</h3>
                        <button className="text-[11px] sm:text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors">See All</button>
                    </div>
                    <div className="flex flex-col text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 flex-1">
                        {notificationList.slice(0, 5).map((notification, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2.5 py-2 sm:py-2.5 border-b border-dashed border-slate-200 dark:border-slate-800 last:border-0">
                                <div className="flex items-center gap-2.5 truncate min-w-0">
                                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${notification.bg} dark:bg-slate-800 flex items-center justify-center shrink-0`}>
                                        <notification.icon size={13} className={notification.color} />
                                    </div>
                                    <span className="truncate text-slate-700 dark:text-slate-300">{notification.text}</span>
                                </div>
                                <span className="text-[10.5px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0 ml-1">{notification.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
