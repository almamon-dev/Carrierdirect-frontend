import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { CustomerBillingItem, BillingStats } from '../types';

export const useCustomerBilling = () => {
    const [invoices, setInvoices] = useState<CustomerBillingItem[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [ratingTarget, setRatingTarget] = useState<{ id: string | number; supplier: string; route?: string } | null>(null);

    const fetchBillingData = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const res = await apiClient.get('/customer/finance/invoices');
            let list: CustomerBillingItem[] = [];
            if (Array.isArray(res?.data?.items)) {
                list = res.data.items;
            } else if (Array.isArray(res?.data?.data)) {
                list = res.data.data;
            } else if (Array.isArray(res?.data)) {
                list = res.data;
            } else if (Array.isArray(res?.items)) {
                list = res.items;
            } else if (Array.isArray(res)) {
                list = res;
            }

            const serverStats = res?.data?.stats || res?.stats || null;
            if (serverStats) {
                setStats(serverStats);
            }

            setInvoices(list);
        } catch (error) {
            console.error('Failed to fetch billing data:', error);
            setInvoices([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchBillingData();
    }, [fetchBillingData]);

    const calculatedStats: BillingStats = useMemo(() => {
        let totalSpent = 0;
        let totalOutstanding = 0;
        let paidCount = 0;
        let dueCount = 0;
        let overdueCount = 0;

        invoices.forEach((inv) => {
            const rawStatus = String(inv.raw_status || inv.status || '').toLowerCase().trim();
            const amt = Number(inv.total_amount ?? inv.gross_amount ?? inv.amount_raw) || 0;

            if (rawStatus === 'paid' || rawStatus === 'settled' || rawStatus === 'succeeded') {
                totalSpent += amt;
                paidCount++;
            } else if (rawStatus === 'overdue') {
                totalOutstanding += amt;
                overdueCount++;
            } else {
                totalOutstanding += amt;
                dueCount++;
            }
        });

        const totalSpentFormatted = stats?.total_spent || `€${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
        const totalOutstandingFormatted = stats?.total_outstanding || `€${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;

        return {
            totalSpentFormatted,
            totalOutstandingFormatted,
            totalInvoices: stats?.total_invoices ?? invoices.length,
            paidCount: stats?.invoices_paid ?? paidCount,
            dueCount: stats?.invoices_due ?? dueCount,
            overdueCount,
        };
    }, [invoices, stats]);

    return {
        invoices,
        stats,
        calculatedStats,
        isLoading,
        isRefreshing,
        ratingTarget,
        setRatingTarget,
        fetchBillingData,
    };
};

export default useCustomerBilling;
