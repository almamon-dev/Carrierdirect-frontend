import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { CustomerPayLaterItem, PayLaterStats } from '../types';

export const useCustomerPayLater = () => {
    const [invoices, setInvoices] = useState<CustomerPayLaterItem[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchPayLaterData = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const [profileRes, invoicesRes] = await Promise.all([
                apiClient.get('/customer/profile').catch(() => ({})),
                apiClient.get('/customer/finance/invoices', { params: { type: 'pay_later' } }).catch(() => ({})),
            ]);

            if (profileRes?.data || profileRes?.user) {
                setUserProfile(profileRes.data || profileRes.user || profileRes);
            }

            let list: CustomerPayLaterItem[] = [];
            if (Array.isArray(invoicesRes?.data?.items)) {
                list = invoicesRes.data.items;
            } else if (Array.isArray(invoicesRes?.data?.data)) {
                list = invoicesRes.data.data;
            } else if (Array.isArray(invoicesRes?.data)) {
                list = invoicesRes.data;
            } else if (Array.isArray(invoicesRes?.items)) {
                list = invoicesRes.items;
            } else if (Array.isArray(invoicesRes)) {
                list = invoicesRes;
            }

            const serverStats = invoicesRes?.data?.stats || invoicesRes?.stats || null;
            if (serverStats) {
                setStats(serverStats);
            }

            setInvoices(list);
        } catch (error) {
            console.error('Failed to fetch Pay Later data:', error);
            setInvoices([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchPayLaterData();
    }, [fetchPayLaterData]);

    const calculatedStats: PayLaterStats = useMemo(() => {
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

        const paymentInfo = userProfile?.payment_info || userProfile?.paymentInfo || {};
        const totalCreditLimit = Number(paymentInfo.pay_later_limit ?? userProfile?.pay_later_limit ?? 80000);
        const monthlyLimit = Number(paymentInfo.pay_later_monthly_limit ?? 40000);
        const weeklyLimit = Number(paymentInfo.pay_later_weekly_limit ?? 15000);
        const dailyLimit = Number(paymentInfo.pay_later_daily_limit ?? 8000);
        const status = String(paymentInfo.pay_later_status ?? userProfile?.pay_later_status ?? 'approved').toLowerCase();
        const payLaterDays = Number(paymentInfo.pay_later_days ?? 30);

        const availableCredit = Math.max(0, totalCreditLimit - totalOutstanding);
        const totalSpentFormatted = `€${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
        const totalOutstandingFormatted = `€${totalOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;

        return {
            totalCreditLimit,
            monthlyLimit,
            weeklyLimit,
            dailyLimit,
            availableCredit,
            outstandingBalance: totalOutstanding,
            totalSpentFormatted,
            totalOutstandingFormatted,
            status,
            payLaterDays,
            totalInvoices: stats?.total_invoices ?? invoices.length,
            paidCount: stats?.invoices_paid ?? paidCount,
            dueCount: stats?.invoices_due ?? dueCount,
            overdueCount,
        };
    }, [invoices, stats, userProfile]);

    return {
        invoices,
        stats,
        calculatedStats,
        userProfile,
        isLoading,
        isRefreshing,
        fetchPayLaterData,
    };
};

export default useCustomerPayLater;
