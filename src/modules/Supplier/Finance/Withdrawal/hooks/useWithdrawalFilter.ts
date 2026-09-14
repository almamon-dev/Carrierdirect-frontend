import { useState, useMemo } from 'react';
import { WithdrawalItem } from '../index';
import { WithdrawalTabType } from '../components/WithdrawalFilterTabs';

export function useWithdrawalFilter(withdrawals: WithdrawalItem[]) {
    const [activeTab, setActiveTab] = useState<WithdrawalTabType>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [methodFilter, setMethodFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const handleResetFilters = () => {
        setStatusFilter('all');
        setMethodFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const filteredData = useMemo(() => {
        return withdrawals.filter((item) => {
            const itemStatus = (item.status || '').toLowerCase();
            const itemMethod = (item.method || '').toLowerCase();

            // 1. Tab Filter
            if (activeTab === 'completed' && itemStatus !== 'completed') return false;
            if (activeTab === 'processing' && itemStatus !== 'processing' && itemStatus !== 'pending') return false;
            if (activeTab === 'failed' && itemStatus !== 'failed' && itemStatus !== 'rejected') return false;

            // 2. Select Status Filter
            if (statusFilter !== 'all') {
                if (itemStatus !== statusFilter.toLowerCase()) return false;
            }

            // 3. Method Filter
            if (methodFilter !== 'all') {
                if (methodFilter === 'stripe' && !itemMethod.includes('stripe')) return false;
                if (methodFilter === 'bank' && !itemMethod.includes('bank')) return false;
                if (methodFilter === 'automatic' && !itemMethod.includes('automatic') && !item.reference.toLowerCase().includes('automatic')) return false;
            }

            // 4. Date Range Filter
            if (startDate || endDate) {
                const itemTime = new Date(item.date).getTime();
                if (startDate) {
                    const sTime = new Date(startDate).getTime();
                    if (!isNaN(itemTime) && !isNaN(sTime) && itemTime < sTime) return false;
                }
                if (endDate) {
                    const eTime = new Date(endDate).setHours(23, 59, 59, 999);
                    if (!isNaN(itemTime) && !isNaN(eTime) && itemTime > eTime) return false;
                }
            }

            return true;
        });
    }, [withdrawals, activeTab, statusFilter, methodFilter, startDate, endDate]);

    return {
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        methodFilter,
        setMethodFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleResetFilters,
        filteredData,
    };
}
