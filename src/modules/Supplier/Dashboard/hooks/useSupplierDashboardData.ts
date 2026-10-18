import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import {
    DashboardProfile,
    FinanceSummary,
    TimeFilter,
} from '../types/dashboard.types';
import { formatCurrency } from '../utils/dashboardUtils';
import { getEarningsChartData, getOrderQuoteChartData } from '../utils/dashboardChartData';
import { mapRecentQuotes, mapDisplayOrders, mapDisplayNotifications } from '../utils/dashboardListMappers';

export function useSupplierDashboardData() {
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
                const val = ordersRes.value;
                const raw = 
                    (Array.isArray(val?.data?.data?.data) && val.data.data.data) ||
                    (Array.isArray(val?.data?.data) && val.data.data) ||
                    (Array.isArray(val?.data?.data?.orders) && val.data.data.orders) ||
                    (Array.isArray(val?.data?.orders?.data) && val.data.orders.data) ||
                    (Array.isArray(val?.data?.orders) && val.data.orders) ||
                    (Array.isArray(val?.data) && val.data) ||
                    [];
                setActiveOrders(raw);
            }
            if (financeRes.status === 'fulfilled') {
                const raw = financeRes.value.data?.data || financeRes.value.data || null;
                setFinanceSummary(raw);
                if (raw?.revenue_trend && Array.isArray(raw.revenue_trend) && raw.revenue_trend.length > 0) {
                    setEarningsDataFromApi(raw.revenue_trend);
                }
            }
            if (notifsRes.status === 'fulfilled') {
                const raw = notifsRes.value.data?.notifications || notifsRes.value.data?.data || notifsRes.value.data || [];
                setNotifications(Array.isArray(raw) ? raw : []);
            }
            if (statsRes.status === 'fulfilled') {
                const statsData = statsRes.value.data?.data || statsRes.value.data;
                if (statsData?.earnings_chart) setEarningsDataFromApi(statsData.earnings_chart);
                if (statsData?.conversion_chart) setConversionDataFromApi(statsData.conversion_chart);
                if (statsData?.total_earnings !== undefined) {
                    setFinanceSummary((prev: any) => ({
                        ...prev,
                        total_earnings: prev?.total_earnings ?? statsData.total_earnings,
                    }));
                }
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
        if (financeSummary?.stats?.total_earnings !== undefined) return formatCurrency(financeSummary.stats.total_earnings);
        if (financeSummary?.lifetime_earnings !== undefined) return formatCurrency(financeSummary.lifetime_earnings);
        if (profile?.total_earnings !== undefined) return formatCurrency(profile.total_earnings);
        return '€0';
    }, [financeSummary, profile]);

    const withdrawableBalance = useMemo(() => {
        const bal = financeSummary?.withdrawable_balance ?? financeSummary?.available_balance ?? financeSummary?.stats?.available_balance;
        if (bal !== undefined && bal !== null) {
            return formatCurrency(bal);
        }
        return '€0';
    }, [financeSummary]);

    const activeOrdersCount = useMemo(() => activeOrders.length, [activeOrders]);
    const pendingQuotesCount = useMemo(() => quoteRequests.length, [quoteRequests]);

    const avgRating = useMemo(() => {
        const r = profile?.rating ?? profile?.average_rating;
        const count = Number(profile?.reviews_count ?? 0);
        if (count > 0 && r !== undefined && r !== null && Number(r) > 0) {
            return Number(r).toFixed(1);
        }
        if (r !== undefined && r !== null && Number(r) > 0) {
            return Number(r).toFixed(1);
        }
        return '0.0';
    }, [profile]);

    const rawTotal = Number(financeSummary?.total_earnings || profile?.total_earnings || 0);

    const earningsChartData = useMemo(() => {
        return getEarningsChartData(earningsDataFromApi, earningsFilter, rawTotal);
    }, [earningsDataFromApi, earningsFilter, rawTotal]);

    const orderQuoteChartData = useMemo(() => {
        return getOrderQuoteChartData(conversionDataFromApi, quoteOverviewFilter, quoteRequests.length, activeOrders.length);
    }, [conversionDataFromApi, quoteOverviewFilter, quoteRequests.length, activeOrders.length]);

    const recentQuotes = useMemo(() => mapRecentQuotes(quoteRequests), [quoteRequests]);
    const displayOrders = useMemo(() => mapDisplayOrders(activeOrders), [activeOrders]);
    const displayNotifications = useMemo(() => mapDisplayNotifications(notifications), [notifications]);

    return {
        isLoading,
        totalEarnings,
        activeOrdersCount,
        pendingQuotesCount,
        withdrawableBalance,
        avgRating,
        earningsFilter,
        setEarningsFilter,
        earningsChartData,
        quoteOverviewFilter,
        setQuoteOverviewFilter,
        orderQuoteChartData,
        recentQuotes,
        displayOrders,
        displayNotifications,
        quoteRequests,
        activeOrders,
        financeSummary,
    };
}
