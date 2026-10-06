import { useMemo } from 'react';
import { CustomerBillingItem, BillingFilterTab } from '../types';

interface UseFilteredBillingProps {
    invoices: CustomerBillingItem[];
    activeTab: BillingFilterTab;
    statusFilter: string;
    paymentMethodFilter: string;
    startDate: string;
    endDate: string;
}

export const useFilteredCustomerBilling = ({
    invoices,
    activeTab,
    statusFilter,
    paymentMethodFilter,
    startDate,
    endDate,
}: UseFilteredBillingProps) => {
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

            // 3. Payment method filter
            if (paymentMethodFilter && paymentMethodFilter !== 'all') {
                const isPayLater = Boolean(invoice.is_pay_later) || String(invoice.payment_method || '').toLowerCase().includes('later') || String(invoice.payment_terms || '').toLowerCase().includes('net-30');
                const isCard = !isPayLater && (String(invoice.payment_method || '').toLowerCase().includes('card') || String(invoice.payment_method || '').toLowerCase().includes('stripe') || String(invoice.payment_method || '').toLowerCase().includes('online'));

                if (paymentMethodFilter === 'pay_later' && !isPayLater) return false;
                if (paymentMethodFilter === 'card' && !isCard) return false;
                if (paymentMethodFilter === 'bank_transfer' && !String(invoice.payment_method || '').toLowerCase().includes('bank')) return false;
            }

            // 4. Date filter
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
    }, [invoices, activeTab, statusFilter, paymentMethodFilter, startDate, endDate]);
};

export default useFilteredCustomerBilling;
