import { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { TransactionRow, TransactionFilterTab } from '../types/transaction.types';

export function useTransactionHistoryState() {
    const [transactions, setTransactions] = useState<TransactionRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [activeTab, setActiveTab] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');
    const [copiedRef, setCopiedRef] = useState<string | null>(null);

    const fetchTransactions = async (isManual = false) => {
        if (isManual) setIsRefreshing(true);
        else setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get('/supplier/wallet/transactions');
            const data = res.data?.data || res.data || {};
            const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : (data.transactions || []));
            setTransactions(list);
        } catch (err: any) {
            console.error('Failed to load transaction history:', err);
            setError(err?.response?.data?.message || err?.message || 'Failed to load transaction history.');
            setTransactions([]);
        } finally {
            setIsLoading(false);
            if (isManual) setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleRefresh = async () => {
        await fetchTransactions(true);
    };

    const handleResetFilters = () => {
        setActiveTab('all');
        setTypeFilter('all');
        setStatusFilter('all');
        setFromDate('');
        setToDate('');
    };

    const handleCopy = (refText: string) => {
        if (!refText) return;
        navigator.clipboard.writeText(refText);
        setCopiedRef(refText);
        setTimeout(() => setCopiedRef(null), 2000);
    };

    // Filter Tabs with counts
    const tabs: TransactionFilterTab[] = useMemo(() => {
        let earningCount = 0;
        let feeCount = 0;
        let payoutCount = 0;
        let refundCount = 0;

        (transactions || []).forEach((tx) => {
            const raw = (tx.raw_type || '').toLowerCase();
            const tp = (tx.type || '').toLowerCase();
            if (raw === 'earning' || tp.includes('order')) earningCount++;
            else if (raw === 'fee' || tp.includes('fee')) feeCount++;
            else if (raw === 'payout' || tp.includes('payout')) payoutCount++;
            else if (raw === 'refund' || tp.includes('refund')) refundCount++;
        });

        const list: TransactionFilterTab[] = [
            { id: 'all', label: 'All', count: transactions.length },
            { id: 'earning', label: 'Earnings', count: earningCount },
            { id: 'payout', label: 'Payouts', count: payoutCount },
        ];

        if (refundCount > 0) {
            list.push({ id: 'refund', label: 'Refunds', count: refundCount });
        }

        return list;
    }, [transactions]);

    // Instant local client-side filtering
    const filteredTransactions = useMemo(() => {
        return (transactions || []).filter((t) => {
            const rawType = (t.raw_type || '').toLowerCase();
            const typeLower = (t.type || '').toLowerCase();

            if (activeTab === 'earning') {
                if (rawType !== 'earning' && !typeLower.includes('order')) return false;
            } else if (activeTab === 'fee') {
                if (rawType !== 'fee' && !typeLower.includes('fee')) return false;
            } else if (activeTab === 'payout') {
                if (rawType !== 'payout' && !typeLower.includes('payout')) return false;
            } else if (activeTab === 'refund') {
                if (rawType !== 'refund' && !typeLower.includes('refund')) return false;
            }

            if (typeFilter !== 'all') {
                if (typeFilter === 'earning' && rawType !== 'earning' && !typeLower.includes('order')) return false;
                if (typeFilter === 'fee' && rawType !== 'fee' && !typeLower.includes('fee')) return false;
                if (typeFilter === 'payout' && rawType !== 'payout' && !typeLower.includes('payout')) return false;
                if (typeFilter === 'refund' && rawType !== 'refund' && !typeLower.includes('refund')) return false;
            }

            if (statusFilter !== 'all') {
                const s = (t.raw_status || t.status || '').toLowerCase();
                if (s !== statusFilter) return false;
            }

            if (fromDate || toDate) {
                const itemTime = new Date(t.date || t.date_time || '').getTime();
                if (!isNaN(itemTime)) {
                    if (fromDate) {
                        const startTime = new Date(fromDate).setHours(0, 0, 0, 0);
                        if (itemTime < startTime) return false;
                    }
                    if (toDate) {
                        const endTime = new Date(toDate).setHours(23, 59, 59, 999);
                        if (itemTime > endTime) return false;
                    }
                }
            }

            return true;
        });
    }, [transactions, activeTab, typeFilter, statusFilter, fromDate, toDate]);

    return {
        transactions,
        isLoading,
        isRefreshing,
        error,
        activeTab,
        setActiveTab,
        typeFilter,
        setTypeFilter,
        statusFilter,
        setStatusFilter,
        fromDate,
        setFromDate,
        toDate,
        setToDate,
        copiedRef,
        tabs,
        filteredTransactions,
        handleRefresh,
        handleResetFilters,
        handleCopy,
    };
}
