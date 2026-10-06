import { useMemo } from 'react';
import { CustomerPaymentItem, PaymentFilterTab } from '../types';

interface UseFilteredPaymentsProps {
    payments: CustomerPaymentItem[];
    activeTab: PaymentFilterTab;
    statusFilter: string;
    paymentMethodFilter: string;
    startDate: string;
    endDate: string;
}

export const useFilteredCustomerPayments = ({
    payments,
    activeTab,
    statusFilter,
    paymentMethodFilter,
    startDate,
    endDate,
}: UseFilteredPaymentsProps) => {
    return useMemo(() => {
        return payments.filter((payment) => {
            const rawStatus = String(payment.raw_status || payment.status || '').toLowerCase().trim();
            const rawMethod = String(payment.payment_method || payment.method || '').toLowerCase().trim();

            const isSucceeded = rawStatus === 'succeeded' || rawStatus === 'paid' || rawStatus === 'completed';
            const isProcessing = rawStatus === 'processing' || rawStatus === 'pending' || rawStatus === 'in_escrow' || rawStatus === 'held';
            const isPayLater = rawMethod.includes('later') || rawMethod.includes('net-30') || String(payment.payment_type || '').toLowerCase().includes('later');
            const isRefunded = rawStatus === 'refunded' || rawStatus === 'failed';

            // 1. Tab filter
            if (activeTab === 'succeeded' && !isSucceeded) return false;
            if (activeTab === 'processing' && !isProcessing) return false;
            if (activeTab === 'pay_later' && !isPayLater) return false;
            if (activeTab === 'refunded' && !isRefunded) return false;

            // 2. Status filter
            if (statusFilter && statusFilter !== 'all') {
                if (statusFilter === 'succeeded' && !isSucceeded) return false;
                if (statusFilter === 'processing' && !isProcessing) return false;
                if (statusFilter === 'refunded' && !isRefunded) return false;
            }

            // 3. Payment method filter
            if (paymentMethodFilter && paymentMethodFilter !== 'all') {
                if (paymentMethodFilter === 'pay_later' && !isPayLater) return false;
                if (paymentMethodFilter === 'card' && (isPayLater || (!rawMethod.includes('card') && !rawMethod.includes('stripe') && !rawMethod.includes('online')))) return false;
                if (paymentMethodFilter === 'bank_transfer' && !rawMethod.includes('bank')) return false;
            }

            // 4. Date filter
            if (startDate) {
                const pTime = new Date(payment.created_at || payment.date || payment.paid_at || '').getTime();
                const startLimit = new Date(startDate).getTime();
                if (!isNaN(pTime) && !isNaN(startLimit) && pTime < startLimit) return false;
            }
            if (endDate) {
                const pTime = new Date(payment.created_at || payment.date || payment.paid_at || '').getTime();
                const endLimit = new Date(endDate).getTime() + 86400000;
                if (!isNaN(pTime) && !isNaN(endLimit) && pTime > endLimit) return false;
            }

            return true;
        });
    }, [payments, activeTab, statusFilter, paymentMethodFilter, startDate, endDate]);
};

export default useFilteredCustomerPayments;
