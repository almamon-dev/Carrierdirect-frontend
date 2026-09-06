import { useMemo } from 'react';
import { CustomerOrderItem, OrderFilterTab } from '../types';

interface UseFilteredOrdersProps {
    orders: CustomerOrderItem[];
    activeTab: OrderFilterTab;
    statusFilter: string;
    vehicleFilter: string;
    paymentFilter: string;
    startDate: string;
    endDate: string;
}

export const useFilteredCustomerOrders = ({
    orders,
    activeTab,
    statusFilter,
    vehicleFilter,
    paymentFilter,
    startDate,
    endDate,
}: UseFilteredOrdersProps) => {
    return useMemo(() => {
        return orders.filter((order) => {
            const rawStatus = String(order.status_raw || order.status || '').toLowerCase();
            const isCompleted = rawStatus === 'completed' || rawStatus === 'pod accepted';
            const isPodReview = rawStatus.includes('review') || rawStatus.includes('pod') || rawStatus.includes('delivered');
            const isCancelled = rawStatus.includes('cancel');
            const isInTransit = !isCompleted && !isPodReview && !isCancelled;

            // 1. Tab filter
            if (activeTab === 'in_transit' && !isInTransit) return false;
            if (activeTab === 'pod_review' && !isPodReview) return false;
            if (activeTab === 'completed' && !isCompleted) return false;
            if (activeTab === 'cancelled' && !isCancelled) return false;

            // 2. Status filter dropdown
            if (statusFilter !== 'all') {
                if (statusFilter === 'in_transit' && !isInTransit) return false;
                if (statusFilter === 'pod_review' && !isPodReview) return false;
                if (statusFilter === 'completed' && !isCompleted) return false;
                if (statusFilter === 'cancelled' && !isCancelled) return false;
            }

            // 3. Vehicle filter
            if (vehicleFilter !== 'all') {
                const v = String(order.vehicle || order.vehicle_type || order.truck_type || '').toLowerCase();
                if (!v.includes(vehicleFilter.toLowerCase())) return false;
            }

            // 4. Payment filter
            if (paymentFilter !== 'all') {
                const ps = String(order.payment_status || '').toLowerCase();
                if (paymentFilter === 'paid' && !ps.includes('paid')) return false;
                if (paymentFilter === 'escrow' && !ps.includes('escrow')) return false;
                if (paymentFilter === 'refunded' && !ps.includes('refund')) return false;
                if (paymentFilter === 'pending' && (!ps.includes('pending') && !ps.includes('due'))) return false;
            }

            // 5. Date filter
            if (startDate) {
                const orderTime = new Date(order.created_at || order.date || order.order_date || '').getTime();
                const startLimit = new Date(startDate).getTime();
                if (!isNaN(orderTime) && !isNaN(startLimit) && orderTime < startLimit) return false;
            }
            if (endDate) {
                const orderTime = new Date(order.created_at || order.date || order.order_date || '').getTime();
                const endLimit = new Date(endDate).getTime() + 86400000;
                if (!isNaN(orderTime) && !isNaN(endLimit) && orderTime > endLimit) return false;
            }

            return true;
        });
    }, [orders, activeTab, statusFilter, vehicleFilter, paymentFilter, startDate, endDate]);
};

export default useFilteredCustomerOrders;
