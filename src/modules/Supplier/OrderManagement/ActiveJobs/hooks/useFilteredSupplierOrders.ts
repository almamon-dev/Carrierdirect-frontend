import { useMemo } from 'react';
import { SupplierOrderItem, OrderFilterTab } from '../types';

interface UseFilteredOrdersProps {
    orders: SupplierOrderItem[];
    activeTab: OrderFilterTab;
    statusFilter: string;
    vehicleFilter: string;
    podFilter: string;
    startDate: string;
    endDate: string;
}

export const useFilteredSupplierOrders = ({
    orders,
    activeTab,
    statusFilter,
    vehicleFilter,
    podFilter,
    startDate,
    endDate,
}: UseFilteredOrdersProps) => {
    return useMemo(() => {
        return orders.filter((order) => {
            const rawStatus = String(order.status_raw || order.status || '').toLowerCase().trim();
            const isCompleted = rawStatus === 'completed' || rawStatus === 'pod accepted';
            const isPodReview = rawStatus.includes('review') || rawStatus.includes('pod_uploaded') || rawStatus === 'delivered';
            const isCancelled = rawStatus.includes('cancel');
            const isInTransit = rawStatus === 'in_transit' || rawStatus === 'on_the_way' || rawStatus === 'picked_up' || rawStatus === 'in_progress' || rawStatus === 'driver_assigned';

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
                if (statusFilter === 'confirmed' && rawStatus !== 'confirmed' && rawStatus !== 'pending') return false;
            }

            // 3. Vehicle filter
            if (vehicleFilter !== 'all') {
                const v = String(order.vehicle || order.vehicle_type || order.truck_type || '').toLowerCase();
                if (!v.includes(vehicleFilter.toLowerCase())) return false;
            }

            // 4. POD Status filter
            if (podFilter !== 'all') {
                const pod = String(order.pod_status || '').toLowerCase();
                if (podFilter === 'not_uploaded' && !pod.includes('not')) return false;
                if (podFilter === 'pending' && !pod.includes('review') && !pod.includes('pending')) return false;
                if (podFilter === 'approved' && !pod.includes('approv')) return false;
                if (podFilter === 'rejected' && !pod.includes('reject')) return false;
            }

            // 5. Date filter
            if (startDate) {
                const orderTime = new Date(order.pickup_date || order.created_at || order.date || order.order_date || '').getTime();
                const startLimit = new Date(startDate).getTime();
                if (!isNaN(orderTime) && !isNaN(startLimit) && orderTime < startLimit) return false;
            }
            if (endDate) {
                const orderTime = new Date(order.pickup_date || order.created_at || order.date || order.order_date || '').getTime();
                const endLimit = new Date(endDate).getTime() + 86400000;
                if (!isNaN(orderTime) && !isNaN(endLimit) && orderTime > endLimit) return false;
            }

            return true;
        });
    }, [orders, activeTab, statusFilter, vehicleFilter, podFilter, startDate, endDate]);
};

export default useFilteredSupplierOrders;
