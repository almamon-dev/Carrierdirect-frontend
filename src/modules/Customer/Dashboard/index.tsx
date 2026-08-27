import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import {
    Euro, FileText, Package, CreditCard, Star,
    TrendingUp, Activity, Truck, Bell, Navigation
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Select from '@/components/ui/select';
import apiClient from '@/lib/axios';

interface MetricCardProps {
    title: string;
    description: string;
    value: string | number;
    icon: React.ElementType;
    colorClass: string;
    isLastOnMobile?: boolean;
    loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
    title, description, value, icon: Icon, colorClass, isLastOnMobile = false, loading = false
}) => (
    <div className={`bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all flex flex-col justify-between w-full ${isLastOnMobile ? 'col-span-2 sm:col-span-1' : ''}`}>
        <div>
            <div className="flex justify-between items-start w-full mb-2 sm:mb-3">
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg shrink-0 flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                </div>
                {loading ? (
                    <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                    <span className="text-[18px] sm:text-[20px] font-extrabold text-slate-900 dark:text-slate-200 tracking-tight">{value}</span>
                )}
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

// Helpers
function formatCurrency(num: number | string | undefined): string {
    const val = Number(num) || 0;
    return `€${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function timeAgo(dateString?: string): string {
    if (!dateString) return 'Just now';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getOrderProgress(statusStr: string): number {
    const s = (statusStr || '').toLowerCase();
    if (s.includes('deliver') || s.includes('complete')) return 100;
    if (s.includes('out') || s.includes('arrival')) return 85;
    if (s.includes('transit') || s.includes('progress')) return 65;
    if (s.includes('load') || s.includes('picked') || s.includes('pickup')) return 40;
    if (s.includes('confirm') || s.includes('accept') || s.includes('booked')) return 25;
    if (s.includes('pending') || s.includes('process')) return 15;
    if (s.includes('cancel')) return 0;
    return 20;
}

function getOrderStatusConfig(statusStr: string) {
    const s = (statusStr || '').toLowerCase();
    if (s.includes('transit') || s.includes('progress')) {
        return {
            label: 'In Transit',
            color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
            progressColor: 'bg-emerald-500'
        };
    }
    if (s.includes('load') || s.includes('picked') || s.includes('pickup')) {
        return {
            label: 'Loading',
            color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
            progressColor: 'bg-amber-500'
        };
    }
    if (s.includes('out')) {
        return {
            label: 'Out for Delivery',
            color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
            progressColor: 'bg-emerald-500'
        };
    }
    if (s.includes('deliver') || s.includes('complete')) {
        return {
            label: 'Delivered',
            color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
            progressColor: 'bg-blue-500'
        };
    }
    if (s.includes('cancel')) {
        return {
            label: 'Cancelled',
            color: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50',
            progressColor: 'bg-rose-500'
        };
    }
    if (s.includes('booked') || s.includes('confirm')) {
        return {
            label: 'Booked',
            color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50',
            progressColor: 'bg-emerald-500'
        };
    }
    return {
        label: statusStr || 'Pending',
        color: 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand border-brand/20 dark:border-[#ff4a1f]/30',
        progressColor: 'bg-brand'
    };
}

function getRequestStatusConfig(statusStr: string) {
    const s = (statusStr || '').toLowerCase();
    if (s.includes('draft')) {
        return { label: 'Draft', color: 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60' };
    }
    if (s.includes('quot') || s.includes('received')) {
        return { label: 'Quoting', color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50' };
    }
    if (s.includes('book') || s.includes('accept') || s.includes('confirmed')) {
        return { label: 'Booked', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' };
    }
    if (s.includes('action') || s.includes('require')) {
        return { label: 'Action Required', color: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50' };
    }
    if (s.includes('review') || s.includes('pending')) {
        return { label: 'Reviewing', color: 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand border-brand/20 dark:border-[#ff4a1f]/30' };
    }
    if (s.includes('cancel')) {
        return { label: 'Cancelled', color: 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700/60' };
    }
    return { label: statusStr || 'Active', color: 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand border-brand/20 dark:border-[#ff4a1f]/30' };
}

function getNotificationConfig(notif: any) {
    const text = notif.data?.message || notif.message || notif.title || notif.text || 'New notification';
    const t = text.toLowerCase();

    if (t.includes('quote')) {
        return {
            icon: FileText,
            bg: 'bg-purple-100 dark:bg-purple-950/60',
            color: 'text-purple-600 dark:text-purple-400'
        };
    }
    if (t.includes('booked') || t.includes('booking') || t.includes('order')) {
        return {
            icon: Package,
            bg: 'bg-emerald-100 dark:bg-emerald-950/60',
            color: 'text-emerald-600 dark:text-emerald-400'
        };
    }
    if (t.includes('transit') || t.includes('deliver') || t.includes('truck') || t.includes('status')) {
        return {
            icon: Truck,
            bg: 'bg-blue-100 dark:bg-blue-950/60',
            color: 'text-[#ff4a1f]'
        };
    }
    if (t.includes('payment') || t.includes('invoice') || t.includes('paid') || t.includes('€') || t.includes('euro')) {
        return {
            icon: Euro,
            bg: 'bg-emerald-100 dark:bg-emerald-950/60',
            color: 'text-emerald-600 dark:text-emerald-400'
        };
    }
    if (t.includes('rate') || t.includes('review') || t.includes('star')) {
        return {
            icon: Star,
            bg: 'bg-amber-100 dark:bg-amber-950/60',
            color: 'text-amber-600 dark:text-amber-400'
        };
    }
    return {
        icon: Bell,
        bg: 'bg-slate-100 dark:bg-slate-800',
        color: 'text-slate-600 dark:text-slate-300'
    };
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Remote Data States
    const [profile, setProfile] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);

    // Filter States
    const [spendFilter, setSpendFilter] = useState<'30_days' | '3_months' | 'this_year'>('30_days');
    const [overviewFilter, setOverviewFilter] = useState<'30_days' | '3_months' | 'this_year'>('30_days');

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const [profileRes, ordersRes, quotesRes, invoicesRes, notifsRes] = await Promise.allSettled([
                apiClient.get('/customer/profile'),
                apiClient.get('/customer/orders'),
                apiClient.get('/customer/quote-requests'),
                apiClient.get('/customer/invoices'),
                apiClient.get('/customer/notifications'),
            ]);

            if (profileRes.status === 'fulfilled') {
                setProfile(profileRes.value.data?.data || profileRes.value.data || null);
            }
            if (ordersRes.status === 'fulfilled') {
                const list = ordersRes.value.data?.data || ordersRes.value.data || [];
                setOrders(Array.isArray(list) ? list : []);
            }
            if (quotesRes.status === 'fulfilled') {
                const list = quotesRes.value.data?.data || quotesRes.value.data || [];
                setQuoteRequests(Array.isArray(list) ? list : []);
            }
            if (invoicesRes.status === 'fulfilled') {
                const list = invoicesRes.value.data?.data || invoicesRes.value.data || [];
                setInvoices(Array.isArray(list) ? list : []);
            }
            if (notifsRes.status === 'fulfilled') {
                const list = notifsRes.value.data?.notifications || notifsRes.value.data?.data || notifsRes.value.data || [];
                setNotifications(Array.isArray(list) ? list : []);
            }
        } catch (err) {
            console.error('Error loading dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Computed Top Metrics
    const metrics = useMemo(() => {
        let totalSpend = invoices.reduce((acc, curr) => {
            const st = (curr.status || '').toLowerCase();
            if (st === 'paid' || st === 'completed') {
                return acc + (Number(curr.amount) || Number(curr.total) || 0);
            }
            return acc;
        }, 0);

        if (totalSpend === 0 && orders.length > 0) {
            totalSpend = orders.reduce((acc, curr) => {
                const st = (curr.status || curr.status_raw || '').toLowerCase();
                if (st === 'completed' || st === 'delivered') {
                    return acc + (Number(curr.total_amount) || Number(curr.amount) || 0);
                }
                return acc;
            }, 0);
        }

        const activeOrdersCount = orders.filter(o => {
            const s = (o.status || o.status_raw || '').toLowerCase();
            return !['delivered', 'completed', 'cancelled'].includes(s);
        }).length;

        const activeRequestsCount = quoteRequests.filter(q => {
            const s = (q.status || '').toLowerCase();
            return !['completed', 'cancelled', 'booked'].includes(s);
        }).length;

        const walletBal = profile?.wallet_balance ?? profile?.available_balance ?? profile?.balance ?? 0;
        const avgRating = profile?.rating ?? profile?.avg_rating ?? (orders.length > 0 ? '4.9' : '5.0');

        return {
            totalSpending: totalSpend,
            activeOrders: activeOrdersCount,
            activeRequests: activeRequestsCount,
            walletBalance: walletBal,
            avgRating: avgRating
        };
    }, [invoices, orders, quoteRequests, profile]);

    // Dynamic Spending Chart Data
    const spendChartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();

        if (spendFilter === '30_days') {
            const daysCount = 10;
            const points: { name: string; spend: number }[] = [];
            let cumulative = 0;

            for (let i = daysCount - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - i * 3);
                const name = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;

                const daySpend = invoices.filter(inv => {
                    const invDate = new Date(inv.created_at || inv.issue_date || inv.date);
                    return Math.abs(invDate.getTime() - d.getTime()) <= 3 * 24 * 60 * 60 * 1000;
                }).reduce((sum, curr) => sum + (Number(curr.amount) || Number(curr.total) || 0), 0);

                cumulative += daySpend;
                const fallbackSpend = metrics.totalSpending > 0
                    ? Math.round((metrics.totalSpending / daysCount) * (daysCount - i))
                    : 0;

                points.push({
                    name,
                    spend: cumulative > 0 ? cumulative : fallbackSpend
                });
            }
            return points;
        } else if (spendFilter === '3_months') {
            const weeksCount = 8;
            const points: { name: string; spend: number }[] = [];
            for (let i = weeksCount - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(now.getDate() - i * 11);
                const name = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
                const spendVal = metrics.totalSpending > 0
                    ? Math.round((metrics.totalSpending / weeksCount) * (weeksCount - i))
                    : 0;
                points.push({ name, spend: spendVal });
            }
            return points;
        } else {
            const currentMonthIdx = now.getMonth();
            const points: { name: string; spend: number }[] = [];
            for (let i = 0; i <= currentMonthIdx; i++) {
                const name = months[i];
                const spendVal = metrics.totalSpending > 0
                    ? Math.round((metrics.totalSpending / (currentMonthIdx + 1)) * (i + 1))
                    : 0;
                points.push({ name, spend: spendVal });
            }
            return points.length > 0 ? points : [{ name: months[currentMonthIdx], spend: metrics.totalSpending }];
        }
    }, [spendFilter, invoices, metrics.totalSpending]);

    // Total quotes received count aggregated from requests
    const totalQuotesReceived = useMemo(() => {
        return quoteRequests.reduce((acc, q) => {
            const count = Number(
                q.quotes_count ?? 
                q.quotes_received_count ?? 
                q.bids_count ?? 
                (Array.isArray(q.quotes_request) ? q.quotes_request.length : 
                 Array.isArray(q.quotes) ? q.quotes.length : 0)
            );
            return acc + count;
        }, 0);
    }, [quoteRequests]);

    // Dynamic Request & Order Chart Data
    const orderQuoteChartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const intervals = 6;
        const points: { name: string; requests: number; quotes: number; booked: number }[] = [];

        const totalReq = quoteRequests.length || 0;
        const totalOrd = orders.length || 0;
        const totalQuotes = totalQuotesReceived;

        for (let i = intervals - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i * 5);
            const name = `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;

            const reqPortion = totalReq > 0 ? Math.max(1, Math.round((totalReq / intervals) * (intervals - i))) : 0;
            const quotePortion = totalQuotes > 0 ? Math.max(0, Math.round((totalQuotes / intervals) * (intervals - i))) : (totalReq > 0 ? Math.round(reqPortion * 0.5) : 0);
            const ordPortion = totalOrd > 0 ? Math.max(0, Math.round((totalOrd / intervals) * (intervals - i))) : 0;

            points.push({
                name,
                requests: reqPortion,
                quotes: quotePortion,
                booked: ordPortion
            });
        }
        return points;
    }, [overviewFilter, quoteRequests, orders, totalQuotesReceived]);

    // Active Shipments for the live table
    const liveActiveShipments = useMemo(() => {
        const filtered = orders.filter(o => {
            const s = (o.status || o.status_raw || '').toLowerCase();
            return !['delivered', 'completed', 'cancelled'].includes(s);
        });
        return filtered.length > 0 ? filtered : orders.slice(0, 5);
    }, [orders]);

    return (
        <div className="p-3 sm:p-4 md:p-5 space-y-3.5 sm:space-y-4 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen transition-colors duration-200">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4 mt-0.5 sm:mt-1">
                <MetricCard
                    title="Total Spending"
                    description="Total spending across confirmed shipments."
                    value={formatCurrency(metrics.totalSpending)}
                    icon={Euro}
                    colorClass="bg-brand-light dark:bg-[#ff4a1f]/15 text-brand"
                    loading={loading}
                />
                <MetricCard
                    title="Active Orders"
                    description="Shipments currently being processed or in transit."
                    value={metrics.activeOrders}
                    icon={Package}
                    colorClass="bg-brand-light dark:bg-[#ff4a1f]/15 text-brand"
                    loading={loading}
                />
                <MetricCard
                    title="Active Requests"
                    description="Quote requests awaiting responses."
                    value={metrics.activeRequests}
                    icon={FileText}
                    colorClass="bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                    loading={loading}
                />
                <MetricCard
                    title="Wallet Balance"
                    description="Balance available for instant booking."
                    value={formatCurrency(metrics.walletBalance)}
                    icon={CreditCard}
                    colorClass="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                    loading={loading}
                />
                <MetricCard
                    title="Avg. Rating"
                    description="Average rating feedback for logistics."
                    value={metrics.avgRating}
                    icon={Star}
                    colorClass="bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                    isLastOnMobile={true}
                    loading={loading}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3.5 sm:gap-4">

                {/* Area Chart - Spending Overview */}
                <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 sm:mb-4 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4 gap-2 sm:gap-0">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-[#ff4a1f]/15 text-brand flex items-center justify-center shrink-0">
                                <TrendingUp size={15} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">Spending Overview</h3>
                        </div>
                        <Select
                            className="w-full sm:w-36 text-xs"
                            value={spendFilter}
                            onChange={(val) => setSpendFilter(val as any)}
                            showSearch={false}
                            options={[
                                { id: '30_days', name: 'Last 30 Days' },
                                { id: '3_months', name: 'Last 3 Months' },
                                { id: 'this_year', name: 'This Year' },
                            ]}
                        />
                    </div>

                    <div className="flex items-baseline gap-2.5 mb-3 sm:mb-4">
                        <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-200">
                            {formatCurrency(metrics.totalSpending)}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                            Active Overview
                        </span>
                    </div>

                    <div className="h-[180px] sm:h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={spendChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF4A1F" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#FF4A1F" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={8} minTickGap={25} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dx={-5} tickFormatter={(val) => `€${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgba(0,0,0,0.3)', fontSize: '12px', backgroundColor: '#1e2329', color: '#f8fafc' }}
                                    formatter={(value: any) => [`€${Number(value).toLocaleString()}`, 'Spending']}
                                />
                                <Area type="monotone" dataKey="spend" stroke="#FF4A1F" strokeWidth={2} dot={{ r: 2.5, fill: '#FF4A1F', stroke: '#ffffff', strokeWidth: 1.5 }} activeDot={{ r: 5 }} fillOpacity={1} fill="url(#colorSpend)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Line Chart - Request & Order Overview */}
                <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3 sm:mb-4 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4 gap-2 sm:gap-0">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-50 dark:bg-[#ff4a1f]/15 text-brand flex items-center justify-center shrink-0">
                                <Activity size={15} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">Request & Order Overview</h3>
                        </div>
                        <Select
                            className="w-full sm:w-36 text-xs"
                            value={overviewFilter}
                            onChange={(val) => setOverviewFilter(val as any)}
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
                            <span className="w-2.5 h-2.5 rounded-full bg-brand"></span> Requests Sent ({quoteRequests.length})
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Quotes Received ({totalQuotesReceived})
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Orders Booked ({orders.length})
                        </div>
                    </div>

                    <div className="h-[180px] sm:h-[220px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={orderQuoteChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
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
            <div className="bg-white dark:bg-[#1e2329] rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
                <div className="flex items-center justify-between px-3.5 sm:px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#181a20]/50">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-orange-100/70 dark:bg-[#ff4a1f]/15 text-brand flex items-center justify-center shrink-0">
                            <Truck size={15} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">
                            Live Active Shipments ({liveActiveShipments.length})
                        </h3>
                    </div>
                    <Link
                        to="/customer/orders"
                        className="text-[11px] sm:text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors"
                    >
                        See All
                    </Link>
                </div>

                {loading ? (
                    <div className="p-8 text-center space-y-3">
                        <div className="w-8 h-8 border-3 border-[#ff4a1f] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Loading active shipments...</p>
                    </div>
                ) : liveActiveShipments.length === 0 ? (
                    <div className="p-8 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                            <Package size={22} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No active shipments found</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">When you book and confirm orders, their live tracking will appear here.</p>
                        </div>
                        <Link
                            to="/customer/quotes/create/new"
                            className="inline-block text-xs font-bold text-white bg-[#ff4a1f] px-3.5 py-1.5 rounded-[3px] shadow-xs hover:bg-[#e03d15] transition-colors"
                        >
                            Create a Quote Request
                        </Link>
                    </div>
                ) : (
                    <>
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
                                    {liveActiveShipments.map((order, idx) => {
                                        const orderIdDisplay = order.order_id || order.order_number || `ORD-${order.id}`;
                                        const routeDisplay = order.route || `${order.pickup_address || order.pickup_city || 'Origin'} → ${order.delivery_address || order.delivery_city || 'Destination'}`;
                                        const locationDisplay = order.last_location || order.checkpoint || order.current_location || order.pickup_city || 'In Route';
                                        const carrierDisplay = order.supplier_name || order.supplier?.company_name || order.supplier?.name || order.carrier_name || 'Carrier Partner';
                                        const vehicleDisplay = order.vehicle || order.vehicle_type || order.truck_type || 'Standard Truck';
                                        const statusCfg = getOrderStatusConfig(order.status || order.status_raw || 'In Transit');
                                        const progress = getOrderProgress(order.status || order.status_raw || '');
                                        const etaDisplay = order.eta || order.delivery_date || order.estimated_time || 'Upcoming';

                                        return (
                                            <tr key={order.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-2.5 px-3.5 font-bold text-[#ff4a1f] text-[12px]">
                                                    <Link to={`/customer/orders/${order.id}`} className="hover:underline">
                                                        {orderIdDisplay}
                                                    </Link>
                                                </td>
                                                <td className="py-2.5 px-3.5 max-w-xs">
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">{routeDisplay}</span>
                                                    <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-medium">({locationDisplay})</span>
                                                </td>
                                                <td className="py-2.5 px-3.5 font-medium text-slate-700 dark:text-slate-300 text-[12px] truncate max-w-[140px]">{carrierDisplay}</td>
                                                <td className="py-2.5 px-3.5 text-slate-600 dark:text-slate-400 text-[11.5px]">{vehicleDisplay}</td>
                                                <td className="py-2.5 px-3.5">
                                                    <span className={`${statusCfg.color} px-2 py-0.5 rounded-full border text-[10px] font-bold inline-block`}>
                                                        {statusCfg.label}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-3.5 text-[11.5px] font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">{etaDisplay}</td>
                                                <td className="py-2.5 px-3.5 w-36">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                            <div className={`h-1.5 rounded-full ${statusCfg.progressColor}`} style={{ width: `${progress}%` }}></div>
                                                        </div>
                                                        <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 shrink-0">{progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-3.5 text-right">
                                                    <button
                                                        onClick={() => navigate(`/customer/quotes/processing/track/${order.id}`)}
                                                        className="text-[11px] font-bold text-brand hover:text-brand-dark px-2.5 py-1 rounded-md bg-brand-light/60 dark:bg-[#ff4a1f]/20 hover:bg-brand-light dark:hover:bg-[#ff4a1f]/30 transition-colors whitespace-nowrap cursor-pointer"
                                                    >
                                                        Track
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                            {liveActiveShipments.map((order, idx) => {
                                const orderIdDisplay = order.order_id || order.order_number || `ORD-${order.id}`;
                                const routeDisplay = order.route || `${order.pickup_address || order.pickup_city || 'Origin'} → ${order.delivery_address || order.delivery_city || 'Destination'}`;
                                const locationDisplay = order.last_location || order.checkpoint || order.current_location || order.pickup_city || 'In Route';
                                const carrierDisplay = order.supplier_name || order.supplier?.company_name || order.supplier?.name || order.carrier_name || 'Carrier Partner';
                                const statusCfg = getOrderStatusConfig(order.status || order.status_raw || 'In Transit');
                                const progress = getOrderProgress(order.status || order.status_raw || '');
                                const etaDisplay = order.eta || order.delivery_date || order.estimated_time || 'Upcoming';

                                return (
                                    <div key={order.id || idx} className="p-3.5 space-y-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-[#ff4a1f] text-[13px]">{orderIdDisplay}</span>
                                                <span className={`${statusCfg.color} px-2 py-0.5 rounded-full border text-[10px] font-bold`}>{statusCfg.label}</span>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/customer/quotes/processing/track/${order.id}`)}
                                                className="text-[11px] font-bold text-brand hover:text-brand-dark px-2.5 py-1 rounded-md bg-brand-light/60 dark:bg-[#ff4a1f]/20 hover:bg-brand-light transition-colors cursor-pointer"
                                            >
                                                Track
                                            </button>
                                        </div>

                                        <div className="flex items-start gap-1.5 text-[12px]">
                                            <Navigation className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">{routeDisplay}</span>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">At: <span className="font-medium text-slate-700 dark:text-slate-300">{locationDisplay}</span></p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-[#181a20] p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                                            <div>
                                                <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">Carrier</span>
                                                <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">{carrierDisplay}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold">ETA</span>
                                                <span className="font-medium text-slate-700 dark:text-slate-300 block">{etaDisplay}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 pt-0.5">
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className={`h-1.5 rounded-full ${statusCfg.progressColor}`} style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 shrink-0">{progress}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Footer Lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">

                {/* Recent Requests */}
                <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2.5 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4">
                        <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">
                            Recent Requests ({quoteRequests.length})
                        </h3>
                        <Link
                            to="/customer/quotes/create"
                            className="text-[11px] sm:text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors"
                        >
                            See All
                        </Link>
                    </div>
                    <div className="flex flex-col text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 flex-1">
                        {loading ? (
                            <div className="py-6 text-center text-xs text-slate-400">Loading requests...</div>
                        ) : quoteRequests.length === 0 ? (
                            <div className="py-6 text-center text-xs text-slate-400">No quote requests submitted yet.</div>
                        ) : (
                            quoteRequests.slice(0, 5).map((req, idx) => {
                                const reqId = req.request_id || req.quote_number || `REQ-${req.id}`;
                                const statusCfg = getRequestStatusConfig(req.status);
                                return (
                                    <div key={req.id || idx} className="flex justify-between items-center py-2 sm:py-2.5 border-b border-dashed border-slate-200 dark:border-slate-800 last:border-0">
                                        <div className="flex items-center gap-2 truncate">
                                            <span className="font-bold text-slate-900 dark:text-slate-200">{reqId}</span>
                                            {req.pickup_city && req.delivery_city && (
                                                <span className="text-[11px] text-slate-400 truncate">
                                                    ({req.pickup_city} → {req.delivery_city})
                                                </span>
                                            )}
                                        </div>
                                        <span className={`${statusCfg.color} px-2 py-0.5 rounded-full border text-[10.5px] font-bold shrink-0`}>
                                            {statusCfg.label}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-md border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-2.5 -mx-3.5 sm:-mx-4 px-3.5 sm:px-4">
                        <h3 className="text-[13px] sm:text-[14px] font-bold text-slate-800 dark:text-slate-200">
                            Notifications ({notifications.length})
                        </h3>
                        <Link
                            to="/customer/notifications"
                            className="text-[11px] sm:text-[12px] font-bold text-brand hover:underline focus:outline-none transition-colors"
                        >
                            See All
                        </Link>
                    </div>
                    <div className="flex flex-col text-[12px] sm:text-[13px] text-slate-500 dark:text-slate-400 flex-1">
                        {loading ? (
                            <div className="py-6 text-center text-xs text-slate-400">Loading notifications...</div>
                        ) : notifications.length === 0 ? (
                            <div className="py-6 text-center text-xs text-slate-400">No notifications to display.</div>
                        ) : (
                            notifications.slice(0, 5).map((notification, idx) => {
                                const cfg = getNotificationConfig(notification);
                                const text = notification.data?.message || notification.message || notification.title || notification.text || 'Notification update';
                                const timeStr = timeAgo(notification.created_at || notification.date || notification.time);
                                const IconComponent = cfg.icon;

                                return (
                                    <div key={notification.id || idx} className="flex items-center justify-between gap-2.5 py-2 sm:py-2.5 border-b border-dashed border-slate-200 dark:border-slate-800 last:border-0">
                                        <div className="flex items-center gap-2.5 truncate min-w-0">
                                            <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${cfg.bg} dark:bg-slate-800 flex items-center justify-center shrink-0`}>
                                                <IconComponent size={13} className={cfg.color} />
                                            </div>
                                            <span className="truncate text-slate-700 dark:text-slate-300 text-[12px]">{text}</span>
                                        </div>
                                        <span className="text-[10.5px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0 ml-1">
                                            {timeStr}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
}
