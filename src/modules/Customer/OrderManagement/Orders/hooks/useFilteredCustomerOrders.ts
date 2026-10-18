import { useMemo } from 'react';
import { CustomerOrderItem, OrderFilterTab } from '../types';

interface UseFilteredOrdersProps {
    orders: CustomerOrderItem[];
    activeTab: OrderFilterTab;
    statusFilter: string;
    vehicleFilter?: string;
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
            const rawStatus = String(order.status_raw || order.status || '').toLowerCase().trim();
            const statusLabel = String(order.status || '').toLowerCase().trim();
            const podStatus = String(order.pod_status || (order as any).pod?.status || (order as any).pod?.pod_status || '').toLowerCase().trim();

            const hasPodDoc = Boolean(
                order.proof_of_delivery || 
                (order as any).proof || 
                (order as any).pod_url || 
                (order as any).pod_file || 
                (order as any).pod_document_url || 
                (order as any).signature || 
                (order as any).pod?.file_url || 
                (order as any).pod?.is_uploaded
            );

            const isCancelled = rawStatus.includes('cancel') || rawStatus.includes('reject');
            const isCompleted = rawStatus === 'completed' || rawStatus === 'pod accepted' || rawStatus === 'pod_accepted' || rawStatus === 'won';

            const isInTransit = !isCompleted && !isCancelled && (
                rawStatus === 'in_transit' || rawStatus === 'picked_up' || rawStatus === 'on_the_way' || rawStatus === 'in_progress'
            );

            const isDriverAssigned = !isCompleted && !isCancelled && !isInTransit && (
                rawStatus === 'driver_assigned' || rawStatus === 'assigned'
            );

            const isConfirmed = !isCompleted && !isCancelled && !isInTransit && !isDriverAssigned && (
                rawStatus === 'confirmed' || rawStatus === 'booked' || rawStatus === 'pending' || rawStatus === 'scheduled' || rawStatus === 'order_booked'
            );

            const isDelivered = !isCompleted && !isCancelled && !isInTransit && (
                rawStatus === 'delivered' || statusLabel === 'delivered'
            );

            const isPodPending = !isCompleted && !isCancelled && !isInTransit && (
                rawStatus === 'pod_uploaded' || 
                rawStatus === 'pod_review' || 
                (isDelivered && (hasPodDoc || podStatus === 'pending')) ||
                (podStatus === 'pending' && hasPodDoc) ||
                statusLabel.includes('review')
            );

            // 1. Tab filter (Exact 7 status tabs)
            if (activeTab === 'confirmed' && !isConfirmed) return false;
            if (activeTab === 'driver_assigned' && !isDriverAssigned) return false;
            if (activeTab === 'in_transit' && !isInTransit) return false;
            if (activeTab === 'delivered' && !isDelivered) return false;
            if (activeTab === 'pod_pending' && !isPodPending) return false;
            if (activeTab === 'completed' && !isCompleted) return false;
            if (activeTab === 'cancelled' && !isCancelled) return false;

            // 2. Status filter dropdown
            if (statusFilter && statusFilter !== 'all') {
                if (statusFilter === 'confirmed' && !isConfirmed) return false;
                if (statusFilter === 'driver_assigned' && !isDriverAssigned) return false;
                if (statusFilter === 'in_transit' && !isInTransit) return false;
                if (statusFilter === 'delivered' && !isDelivered) return false;
                if (statusFilter === 'pod_pending' && !isPodPending) return false;
                if (statusFilter === 'completed' && !isCompleted) return false;
                if (statusFilter === 'cancelled' && !isCancelled) return false;
            }

            // 3. Vehicle filter (optional)
            if (vehicleFilter && vehicleFilter !== 'all') {
                const v = String(order.vehicle || order.vehicle_type || order.truck_type || '').toLowerCase();
                if (!v.includes(vehicleFilter.toLowerCase())) return false;
            }

            // 4. Payment filter
            if (paymentFilter && paymentFilter !== 'all') {
                const ps = String(order.payment_status || 'unpaid').toLowerCase().trim();
                const pm = String((order as any).payment_method || '').toLowerCase().trim();
                const isPaid = (ps === 'paid' || ps.includes('released')) && !ps.includes('unpaid');
                const isEscrow = ps.includes('escrow');
                const isPayLater = ps.includes('pay later') || ps.includes('pay_later') || pm === 'pay_later' || ps.includes('net-30');
                const isRefunded = ps.includes('refund');
                const isUnpaid = !isPaid && !isEscrow && !isRefunded && !isPayLater;

                if (paymentFilter === 'paid' && !isPaid) return false;
                if (paymentFilter === 'escrow' && !isEscrow) return false;
                if (paymentFilter === 'pay_later' && !isPayLater) return false;
                if (paymentFilter === 'refunded' && !isRefunded) return false;
                if ((paymentFilter === 'unpaid' || paymentFilter === 'pending') && !isUnpaid) return false;
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
