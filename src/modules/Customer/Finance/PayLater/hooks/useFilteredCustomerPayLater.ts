import { useMemo } from 'react';
import { CustomerPayLaterItem, PayLaterFilterTab } from '../types';

interface UseFilteredPayLaterProps {
    invoices: CustomerPayLaterItem[];
    activeTab: PayLaterFilterTab;
    statusFilter: string;
    startDate: string;
    endDate: string;
}

export const useFilteredCustomerPayLater = ({
    invoices,
    activeTab,
    statusFilter,
    startDate,
    endDate,
}: UseFilteredPayLaterProps) => {
    return useMemo(() => {
        return invoices.filter((invoice) => {
            const rawStatus = String(invoice.raw_status || invoice.status || '').toLowerCase().trim();
            const isPaid = rawStatus === 'paid' || rawStatus === 'settled' || rawStatus === 'succeeded';
            const isOverdue = rawStatus === 'overdue';
            const isDue = rawStatus === 'due' || rawStatus === 'pending' || rawStatus === 'unpaid';

            // 1. Tab filter
            if (activeTab === 'paid' && !isPaid) return false;
            if (activeTab === 'due' && !isDue) return false;
            if (activeTab === 'overdue' && !isOverdue) return false;

            // 2. Status filter
            if (statusFilter && statusFilter !== 'all') {
                if (statusFilter === 'paid' && !isPaid) return false;
                if (statusFilter === 'due' && !isDue) return false;
                if (statusFilter === 'overdue' && !isOverdue) return false;
            }

            // 3. Date filter
            if (startDate) {
                const invTime = new Date(invoice.created_at || invoice.date || invoice.issue_date || '').getTime();
                const startLimit = new Date(startDate).getTime();
                if (!isNaN(invTime) && !isNaN(startLimit) && invTime < startLimit) return false;
            }
            if (endDate) {
                const invTime = new Date(invoice.created_at || invoice.date || invoice.issue_date || '').getTime();
                const endLimit = new Date(endDate).getTime() + 86400000;
                if (!isNaN(invTime) && !isNaN(endLimit) && invTime > endLimit) return false;
            }

            return true;
        });
    }, [invoices, activeTab, statusFilter, startDate, endDate]);
};

export default useFilteredCustomerPayLater;
