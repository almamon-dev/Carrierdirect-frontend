import { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { TransactionRow, TransactionFilterTab } from '../types/transaction.types';

export function useSupplierWalletState() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters & table state
    const [activeTab, setActiveTab] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [copiedRef, setCopiedRef] = useState<string | null>(null);

    const handleCopy = (refText: string) => {
        if (!refText) return;
        navigator.clipboard.writeText(refText);
        setCopiedRef(refText);
        setTimeout(() => setCopiedRef(null), 2000);
    };

    const handleResetFilters = () => {
        setActiveTab('all');
        setTypeFilter('all');
        setStatusFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const fetchWalletData = async (isManual = false) => {
        if (isManual) setIsRefreshing(true);
        setError(null);
        try {
            const res = await apiClient.get('/supplier/wallet');
            setData(res.data?.data || res.data || {});
        } catch (err: any) {
            console.error('Failed to fetch wallet data:', err);
            setError(err?.response?.data?.message || err?.message || 'Unable to load wallet data.');
        } finally {
            setIsLoading(false);
            if (isManual) setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    const recentTransactions: TransactionRow[] = Array.isArray(data?.recent_transactions)
        ? data.recent_transactions
        : [];

    const availableBalanceNum = typeof data?.stats?.available_balance === 'number'
        ? data.stats.available_balance
        : (parseFloat(String(data?.stats?.available_balance || 0).replace(/[^0-9.-]/g, '')) || 0);

    const connectedAccount = data?.stripe_account || data?.connected_account || {
        is_connected: false,
        status: 'Not Connected',
        account_id: null,
        account_type: '-',
        country: '-',
        payout_schedule: '-',
        default_currency: 'EUR'
    };

    const tabs: TransactionFilterTab[] = useMemo(() => {
        let earningCount = 0;
        let feeCount = 0;
        let payoutCount = 0;
        let refundCount = 0;

        recentTransactions.forEach((t) => {
            const raw = (t.raw_type || '').toLowerCase();
            const tp = (t.type || '').toLowerCase();
            if (raw === 'earning' || tp.includes('order') || tp.includes('payment') || tp.includes('earning')) earningCount++;
            else if (raw === 'fee' || tp.includes('fee') || tp.includes('commission')) feeCount++;
            else if (raw === 'payout' || tp.includes('payout')) payoutCount++;
            else if (raw === 'refund' || tp.includes('refund')) refundCount++;
        });

        const list: TransactionFilterTab[] = [
            { id: 'all', label: 'All Transactions', count: recentTransactions.length },
            { id: 'earning', label: 'Earnings', count: earningCount },
            { id: 'payout', label: 'Payouts', count: payoutCount },
        ];

        if (refundCount > 0) {
            list.push({ id: 'refund', label: 'Refunds', count: refundCount });
        }

        return list;
    }, [recentTransactions]);

    const filteredTransactions = useMemo(() => {
        return recentTransactions.filter((t) => {
            const rawType = (t.raw_type || '').toLowerCase();
            const typeLower = (t.type || '').toLowerCase();

            if (activeTab === 'earning') {
                if (rawType !== 'earning' && !typeLower.includes('order') && !typeLower.includes('payment')) return false;
            } else if (activeTab === 'fee') {
                if (rawType !== 'fee' && !typeLower.includes('fee')) return false;
            } else if (activeTab === 'payout') {
                if (rawType !== 'payout' && !typeLower.includes('payout')) return false;
            } else if (activeTab === 'refund') {
                if (rawType !== 'refund' && !typeLower.includes('refund')) return false;
            }

            if (typeFilter !== 'all') {
                if (typeFilter === 'earning' && rawType !== 'earning' && !typeLower.includes('order') && !typeLower.includes('payment')) return false;
                if (typeFilter === 'fee' && rawType !== 'fee' && !typeLower.includes('fee')) return false;
                if (typeFilter === 'payout' && rawType !== 'payout' && !typeLower.includes('payout')) return false;
                if (typeFilter === 'refund' && rawType !== 'refund' && !typeLower.includes('refund')) return false;
            }

            if (statusFilter !== 'all') {
                const s = (t.raw_status || t.status || '').toLowerCase();
                if (s !== statusFilter) return false;
            }

            if (startDate || endDate) {
                const itemTime = new Date(t.date || t.date_time || '').getTime();
                if (!isNaN(itemTime)) {
                    if (startDate) {
                        const startTime = new Date(startDate).setHours(0, 0, 0, 0);
                        if (itemTime < startTime) return false;
                    }
                    if (endDate) {
                        const endTime = new Date(endDate).setHours(23, 59, 59, 999);
                        if (itemTime > endTime) return false;
                    }
                }
            }

            return true;
        });
    }, [recentTransactions, activeTab, typeFilter, statusFilter, startDate, endDate]);

    return {
        data,
        isLoading,
        isRefreshing,
        error,
        activeTab,
        setActiveTab,
        typeFilter,
        setTypeFilter,
        statusFilter,
        setStatusFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        copiedRef,
        recentTransactions,
        availableBalanceNum,
        connectedAccount,
        tabs,
        filteredTransactions,
        handleCopy,
        handleResetFilters,
        fetchWalletData,
    };
}
