import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { CustomerPayLaterItem, PayLaterStats } from '../types';

export const useCustomerPayLater = () => {
    const [invoices, setInvoices] = useState<CustomerPayLaterItem[]>([]);
    const [creditRequests, setCreditRequests] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchPayLaterData = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const [profileRes, invoicesRes, requestsRes] = await Promise.all([
                apiClient.get('/customer/profile').catch(() => ({})),
                apiClient.get('/customer/finance/invoices', { params: { type: 'pay_later' } }).catch(() => ({})),
                apiClient.get('/customer/pay-later/requests').catch(() => ({})),
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

            const reqList = requestsRes?.data?.data || requestsRes?.data || [];
            setCreditRequests(Array.isArray(reqList) ? reqList : []);
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
        const isEligible = Boolean(userProfile?.is_pay_later_eligible || userProfile?.has_wallet_access);
        const status = String(paymentInfo.pay_later_status ?? userProfile?.pay_later_status ?? 'inactive').toLowerCase();
        const isApproved = status === 'approved';

        const rawLimit = Number(userProfile?.pay_later_limit ?? paymentInfo.pay_later_limit ?? 0);
        const rawMonthly = Number(userProfile?.pay_later_monthly_limit ?? paymentInfo.pay_later_monthly_limit ?? 0);
        const monthlyLimit = isApproved ? (rawMonthly > 0 ? rawMonthly : (rawLimit > 0 ? rawLimit : 0)) : 0;
        const totalCreditLimit = monthlyLimit;
        const weeklyLimit = isApproved ? Number(userProfile?.pay_later_weekly_limit ?? paymentInfo.pay_later_weekly_limit ?? 0) : 0;
        const dailyLimit = isApproved ? Number(userProfile?.pay_later_daily_limit ?? paymentInfo.pay_later_daily_limit ?? 0) : 0;
        const payLaterDays = Number(paymentInfo.pay_later_days ?? userProfile?.pay_later_days ?? 30);

        const effectiveOutstanding = userProfile?.pay_later_used !== undefined
            ? Number(userProfile.pay_later_used)
            : totalOutstanding;

        const availableCredit = isApproved
            ? (userProfile?.pay_later_available !== undefined && Number(userProfile.pay_later_available) > 0
                ? Number(userProfile.pay_later_available)
                : Math.max(0, totalCreditLimit - effectiveOutstanding))
            : 0;

        const totalSpentFormatted = `€${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
        const totalOutstandingFormatted = `€${effectiveOutstanding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;

        return {
            totalCreditLimit,
            monthlyLimit,
            weeklyLimit,
            dailyLimit,
            availableCredit,
            outstandingBalance: effectiveOutstanding,
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
        creditRequests,
        stats,
        calculatedStats,
        userProfile,
        isLoading,
        isRefreshing,
        fetchPayLaterData,
    };
};

export default useCustomerPayLater;
