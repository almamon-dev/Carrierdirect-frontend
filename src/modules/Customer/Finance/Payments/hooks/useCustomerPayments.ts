import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { CustomerPaymentItem, PaymentStats } from '../types';

export const useCustomerPayments = () => {
    const [payments, setPayments] = useState<CustomerPaymentItem[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [selectedPayment, setSelectedPayment] = useState<CustomerPaymentItem | null>(null);

    const fetchPayments = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const res = await apiClient.get('/customer/finance/payments');
            let list: CustomerPaymentItem[] = [];
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

            setPayments(list);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            setPayments([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const calculatedStats: PaymentStats = useMemo(() => {
        let totalSettled = 0;
        let payLaterTotal = 0;
        let succeededCount = 0;
        let pendingCount = 0;
        let payLaterCount = 0;

        payments.forEach((p) => {
            const st = String(p.raw_status || p.status || '').toLowerCase().trim();
            const amt = Number(p.gross_amount ?? p.total_amount ?? p.amount_raw) || 0;
            const isPayLater = String(p.payment_method || p.method || '').toLowerCase().includes('later');

            if (isPayLater) {
                payLaterTotal += amt;
                payLaterCount++;
            }

            if (st === 'succeeded' || st === 'paid' || st === 'completed') {
                totalSettled += amt;
                succeededCount++;
            } else {
                pendingCount++;
            }
        });

        const totalSettledFormatted = stats?.total_settled || stats?.total_paid || `€${totalSettled.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;
        const payLaterTotalFormatted = stats?.pay_later_total || stats?.pay_later_total_formatted || `€${payLaterTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;

        return {
            totalSettledFormatted,
            payLaterTotalFormatted,
            totalTransactions: stats?.total_transactions ?? payments.length,
            succeededCount,
            pendingCount,
            payLaterCount,
        };
    }, [payments, stats]);

    return {
        payments,
        stats,
        calculatedStats,
        isLoading,
        isRefreshing,
        selectedPayment,
        setSelectedPayment,
        fetchPayments,
    };
};

export default useCustomerPayments;
