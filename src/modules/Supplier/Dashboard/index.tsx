import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FileText, Package, Truck, Euro, Bell } from 'lucide-react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import {
    DashboardProfile,
    FinanceSummary,
    TimeFilter,
} from './types/dashboard.types';
import { MetricCardsGrid } from './components/MetricCardsGrid';
import { EarningsAreaChart } from './components/EarningsAreaChart';
import { OrderQuoteLineChart } from './components/OrderQuoteLineChart';
import { RecentQuotesList, RecentQuoteRow } from './components/RecentQuotesList';
import { ActiveOrdersList, ActiveOrderRow } from './components/ActiveOrdersList';
import { DashboardNotificationsList, DashboardNotificationRow } from './components/DashboardNotificationsList';

function formatCurrency(num: number | string | undefined): string {
    const val = Number(num) || 0;
    return `€${val.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function timeAgo(dateString?: string): string {
    if (!dateString) return 'Just now';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    if (isNaN(diffMs)) return '10 min';
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min`;
    if (diffHr < 24) return `${diffHr} hrs`;
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function SupplierDashboard() {
    const [isLoading, setIsLoading] = useState(true);

    // Live API States
    const [profile, setProfile] = useState<DashboardProfile | null>(null);
    const [quoteRequests, setQuoteRequests] = useState<any[]>([]);
    const [activeOrders, setActiveOrders] = useState<any[]>([]);
    const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [earningsDataFromApi, setEarningsDataFromApi] = useState<any[] | null>(null);
    const [conversionDataFromApi, setConversionDataFromApi] = useState<any[] | null>(null);

    // Timeframe filter states
    const [earningsFilter, setEarningsFilter] = useState<TimeFilter>('30_days');
    const [quoteOverviewFilter, setQuoteOverviewFilter] = useState<TimeFilter>('30_days');

    // Fetch Dashboard Data dynamically from Backend API
    const fetchDashboard = useCallback(async () => {
        try {
            const [profRes, quotesRes, ordersRes, financeRes, notifsRes, statsRes] = await Promise.allSettled([
                apiClient.get(ENDPOINTS.SUPPLIER.PROFILE),
                apiClient.get(ENDPOINTS.SUPPLIER.AVAILABLE_REQUESTS),
                apiClient.get('/supplier/orders'),
                apiClient.get('/supplier/finance/earnings'),
                apiClient.get('/supplier/notifications'),
                apiClient.get('/supplier/dashboard/stats'),
            ]);

            if (profRes.status === 'fulfilled') {
                const data = profRes.value.data?.data || profRes.value.data;
                setProfile(data || null);
            }
            if (quotesRes.status === 'fulfilled') {
                const raw = quotesRes.value.data?.data?.requests || quotesRes.value.data?.data || quotesRes.value.data || [];
                setQuoteRequests(Array.isArray(raw) ? raw : (Array.isArray(raw?.requests) ? raw.requests : []));
            }
            if (ordersRes.status === 'fulfilled') {
                const raw = ordersRes.value.data?.data || ordersRes.value.data || [];
                setActiveOrders(Array.isArray(raw) ? raw : []);
            }
            if (financeRes.status === 'fulfilled') {
                const raw = financeRes.value.data?.data || financeRes.value.data || null;
                setFinanceSummary(raw);
            }
            if (notifsRes.status === 'fulfilled') {
                const raw = notifsRes.value.data?.notifications || notifsRes.value.data?.data || notifsRes.value.data || [];
                setNotifications(Array.isArray(raw) ? raw : []);
            }
            if (statsRes.status === 'fulfilled') {
                const statsData = statsRes.value.data?.data || statsRes.value.data;
                if (statsData?.earnings_chart) setEarningsDataFromApi(statsData.earnings_chart);
                if (statsData?.conversion_chart) setConversionDataFromApi(statsData.conversion_chart);
            }
        } catch (err) {
            console.error('Error fetching supplier dashboard data:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // Computed Dynamic Metric Values - Real Data (0 if empty)
    const totalEarnings = useMemo(() => {
        if (financeSummary?.total_earnings !== undefined) return formatCurrency(financeSummary.total_earnings);
        if (profile?.total_earnings !== undefined) return formatCurrency(profile.total_earnings);
        return '€0';
    }, [financeSummary, profile]);

    const withdrawableBalance = useMemo(() => {
        if (financeSummary?.withdrawable_balance !== undefined || financeSummary?.available_balance !== undefined) {
            return formatCurrency(financeSummary.withdrawable_balance ?? financeSummary.available_balance);
        }
        return '€0';
    }, [financeSummary]);

    const activeOrdersCount = useMemo(() => {
        return activeOrders.length;
    }, [activeOrders]);

    const pendingQuotesCount = useMemo(() => {
        return quoteRequests.length;
    }, [quoteRequests]);

    const avgRating = useMemo(() => {
        if (profile?.rating || profile?.average_rating) {
            return String(profile.rating || profile.average_rating);
        }
        return '0.0';
    }, [profile]);

    // Earnings Chart Data: Uses API data if available, otherwise generates live timeframe baseline
    const earningsChartData = useMemo(() => {
        if (earningsDataFromApi && Array.isArray(earningsDataFromApi) && earningsDataFromApi.length > 0) {
            return earningsDataFromApi;
        }

        if (earningsFilter === '3_months') {
            return [
                { name: 'Month 1', earnings: 0 },
                { name: 'Month 2', earnings: 0 },
                { name: 'Month 3', earnings: Number(financeSummary?.total_earnings || profile?.total_earnings || 0) },
            ];
        }
        if (earningsFilter === 'this_year') {
            return [
                { name: 'Jan', earnings: 0 },
                { name: 'Feb', earnings: 0 },
                { name: 'Mar', earnings: 0 },
                { name: 'Apr', earnings: 0 },
                { name: 'May', earnings: Number(financeSummary?.total_earnings || profile?.total_earnings || 0) },
            ];
        }
        // 30 days with 2-day gap dates
        const currentTotal = Number(financeSummary?.total_earnings || profile?.total_earnings || 0);
        return [
            { name: 'Day 01', earnings: 0 },
            { name: 'Day 03', earnings: 0 },
            { name: 'Day 05', earnings: 0 },
            { name: 'Day 08', earnings: 0 },
            { name: 'Day 10', earnings: 0 },
            { name: 'Day 12', earnings: 0 },
            { name: 'Day 15', earnings: 0 },
            { name: 'Day 18', earnings: 0 },
            { name: 'Day 20', earnings: 0 },
            { name: 'Day 23', earnings: 0 },
            { name: 'Day 26', earnings: 0 },
            { name: 'Day 28', earnings: 0 },
            { name: 'Day 30', earnings: currentTotal },
        ];
    }, [earningsDataFromApi, earningsFilter, financeSummary, profile]);

    // Order Quote Line Chart Data: Uses API data if available, otherwise real live counts
    const orderQuoteChartData = useMemo(() => {
        if (conversionDataFromApi && Array.isArray(conversionDataFromApi) && conversionDataFromApi.length > 0) {
            return conversionDataFromApi;
        }

        const requestsCount = quoteRequests.length;
        const wonCount = activeOrders.length;
        const submittedCount = 0;

        if (quoteOverviewFilter === '3_months') {
            return [
                { name: 'Month 1', requests: 0, submitted: 0, won: 0 },
                { name: 'Month 2', requests: 0, submitted: 0, won: 0 },
                { name: 'Month 3', requests: requestsCount, submitted: submittedCount, won: wonCount },
            ];
        }
        if (quoteOverviewFilter === 'this_year') {
            return [
                { name: 'Q1', requests: 0, submitted: 0, won: 0 },
                { name: 'Q2', requests: requestsCount, submitted: submittedCount, won: wonCount },
            ];
        }
        return [
            { name: 'Week 1', requests: 0, submitted: 0, won: 0 },
            { name: 'Week 2', requests: 0, submitted: 0, won: 0 },
            { name: 'Week 3', requests: 0, submitted: 0, won: 0 },
            { name: 'Week 4', requests: requestsCount, submitted: submittedCount, won: wonCount },
        ];
    }, [conversionDataFromApi, quoteOverviewFilter, quoteRequests, activeOrders]);

    // Recent Quotes List Rows from real backend data (Empty array if no data)
    const recentQuotes: RecentQuoteRow[] = useMemo(() => {
        if (quoteRequests.length === 0) return [];

        return quoteRequests.slice(0, 10).map((q: any) => {
            const s = (q.status || 'New').toLowerCase();
            let color = 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400';
            let statusLabel = 'New';

            if (s.includes('view') || s.includes('pending')) {
                color = 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand';
                statusLabel = 'Viewed';
            } else if (s.includes('quote') || s.includes('submit')) {
                color = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400';
                statusLabel = 'Quoted';
            } else if (s.includes('lost') || s.includes('reject') || s.includes('cancel')) {
                color = 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300';
                statusLabel = 'Lost';
            } else if (s.includes('won') || s.includes('accept')) {
                color = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400';
                statusLabel = 'Won';
            }

            // Requester details: rating, completed orders, and created date
            const customerRating = q.user?.average_rating ?? q.user?.rating ?? q.customer_rating ?? q.customerRating ?? q.rating ?? 5.0;
            const completedOrdersCount = q.user?.completed_orders_count ?? q.user?.orders_count ?? q.customer_completed_orders ?? q.customerOrdersCount ?? q.completed_orders ?? q.orders_count ?? 0;
            
            const rawCreatedAt = q.created_at || q.createdAt || q.requestDate || q.pickup_date;
            let formattedCreatedAt = 'Today';
            if (rawCreatedAt) {
                try {
                    const d = new Date(rawCreatedAt);
                    if (!isNaN(d.getTime())) {
                        formattedCreatedAt = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                    }
                } catch {
                    formattedCreatedAt = 'Today';
                }
            }

            const customerName = q.user?.name || q.customer?.name || q.customer_name || q.client_name || q.pickup_company || q.pickup_contact_name || q.customer || 'Customer';
            const customerAvatar = q.user?.avatar || q.user?.avatar_url || q.user?.profile_photo_url || q.user?.profile_photo_path || q.customer?.avatar || q.customer_avatar || q.avatar || '';

            return {
                id: q.id ? `QR-${q.id}` : (q.reference_id || `QR-${q.slug || '0000'}`),
                slug: q.id || q.slug,
                status: statusLabel,
                color,
                createdAt: formattedCreatedAt,
                customerRating,
                completedOrdersCount,
                customerName,
                customerAvatar,
            };
        });
    }, [quoteRequests]);

    // Active Orders List Rows from real backend data (Empty array if no data)
    const displayOrders: ActiveOrderRow[] = useMemo(() => {
        if (activeOrders.length === 0) return [];

        return activeOrders.slice(0, 10).map((o: any) => {
            const s = (o.status || 'Pending').toLowerCase();
            let color = 'bg-brand-light dark:bg-[#ff4a1f]/20 text-brand';
            let statusLabel = 'Pending';

            if (s.includes('transit') || s.includes('road')) {
                color = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400';
                statusLabel = 'In Transit';
            } else if (s.includes('load') || s.includes('pickup')) {
                color = 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400';
                statusLabel = 'Loading';
            } else if (s.includes('deliver') || s.includes('complete')) {
                color = 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300';
                statusLabel = 'Delivered';
            }

            return {
                id: o.order_number || (o.id ? `ORD-${o.id}` : `ORD-${o.slug || '0000'}`),
                slug: o.id || o.slug,
                status: statusLabel,
                color,
            };
        });
    }, [activeOrders]);

    // Notifications List Rows from real backend data (Empty array if no data)
    const displayNotifications: DashboardNotificationRow[] = useMemo(() => {
        if (notifications.length === 0) return [];

        return notifications.slice(0, 9).map((n: any) => {
            const text = n.data?.message || n.message || n.title || 'Notification alert';
            const t = text.toLowerCase();

            let icon = Bell;
            let bg = 'bg-amber-100 dark:bg-amber-950/60';
            let color = 'text-amber-600 dark:text-amber-400';

            if (t.includes('quote')) {
                icon = FileText;
                bg = 'bg-purple-100 dark:bg-purple-950/60';
                color = 'text-purple-600 dark:text-purple-400';
            } else if (t.includes('order') || t.includes('accept') || t.includes('job')) {
                icon = Package;
                bg = 'bg-emerald-100 dark:bg-emerald-950/60';
                color = 'text-emerald-600 dark:text-emerald-400';
            } else if (t.includes('transit') || t.includes('deliver') || t.includes('truck')) {
                icon = Truck;
                bg = 'bg-blue-100 dark:bg-blue-950/60';
                color = 'text-brand';
            } else if (t.includes('payment') || t.includes('€') || t.includes('euro') || t.includes('paid')) {
                icon = Euro;
                bg = 'bg-emerald-100 dark:bg-emerald-950/60';
                color = 'text-emerald-600 dark:text-emerald-400';
            }

            return {
                icon,
                text,
                bg,
                color,
                time: timeAgo(n.created_at),
            };
        });
    }, [notifications]);

    return (
        <div className="p-4 md:p-5 space-y-4 bg-[#f8fafc] dark:bg-[#12161c] min-h-screen transition-colors duration-200">
            {/* Metrics Grid */}
            <MetricCardsGrid
                totalEarnings={totalEarnings}
                activeOrdersCount={activeOrdersCount}
                pendingQuotesCount={pendingQuotesCount}
                withdrawableBalance={withdrawableBalance}
                avgRating={avgRating}
                isLoading={isLoading}
            />

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                <EarningsAreaChart
                    filter={earningsFilter}
                    onFilterChange={setEarningsFilter}
                    totalEarnings={totalEarnings}
                    chartData={earningsChartData}
                    isLoading={isLoading}
                />
                <OrderQuoteLineChart
                    filter={quoteOverviewFilter}
                    onFilterChange={setQuoteOverviewFilter}
                    chartData={orderQuoteChartData}
                    isLoading={isLoading}
                />
            </div>

            {/* Footer Lists Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RecentQuotesList quotes={recentQuotes} isLoading={isLoading} />
                <ActiveOrdersList orders={displayOrders} isLoading={isLoading} />
                <DashboardNotificationsList notifications={displayNotifications} isLoading={isLoading} />
            </div>
        </div>
    );
}
