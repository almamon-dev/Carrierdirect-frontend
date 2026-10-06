import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { SupplierBillingItem, BillingStats } from '../types';

export const useSupplierBilling = () => {
    const [invoices, setInvoices] = useState<SupplierBillingItem[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchBillingData = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const res = await apiClient.get('/supplier/finance/invoices');
            let list: SupplierBillingItem[] = [];
            const rawData = res?.data?.data?.invoices || res?.data?.invoices || res?.data?.data || res?.data || [];
            
            if (Array.isArray(rawData)) {
                list = rawData;
            } else if (Array.isArray(rawData?.data)) {
                list = rawData.data;
            } else if (Array.isArray(rawData?.items)) {
                list = rawData.items;
            }

            const serverStats = res?.data?.stats || res?.data?.data?.stats || null;
            if (serverStats) {
                setStats(serverStats);
            }

            setInvoices(list);
        } catch (error) {
            console.error('Failed to fetch supplier billing data:', error);
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
        let totalRevenue = 0;
        let totalOutstanding = 0;
        let paidCount = 0;
        let dueCount = 0;
        let overdueCount = 0;

        invoices.forEach((inv) => {
            const rawStatus = String(inv.raw_status || inv.status || '').toLowerCase().trim();
            const amt = Number(inv.net_amount ?? inv.supplier_amount ?? inv.amount_raw ?? inv.gross_amount ?? inv.total_amount) || 0;

            if (rawStatus === 'paid' || rawStatus === 'cleared' || rawStatus === 'completed' || rawStatus === 'settled' || rawStatus === 'succeeded') {
                totalRevenue += amt;
                paidCount++;
            } else if (rawStatus === 'overdue') {
                totalOutstanding += amt;
                overdueCount++;
            } else {
                totalOutstanding += amt;
                dueCount++;
            }
        });

        const totalRevenueFormatted = stats?.total_revenue || stats?.total_spent || `€${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
        const totalOutstandingFormatted = stats?.total_outstanding || `€${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;

        return {
            totalRevenueFormatted,
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
        fetchBillingData,
    };
};

export default useSupplierBilling;
