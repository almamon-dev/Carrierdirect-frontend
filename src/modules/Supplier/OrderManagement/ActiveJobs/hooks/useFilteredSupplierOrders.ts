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
            const isDelivered = rawStatus === 'delivered' || rawStatus === 'pod_uploaded';
            const isInTransit = rawStatus === 'in_transit' || rawStatus === 'picked_up' || rawStatus === 'on_the_way' || rawStatus === 'in_progress';
            const isDriverAssigned = rawStatus === 'driver_assigned' || rawStatus === 'assigned';
            const isConfirmed = rawStatus === 'confirmed' || rawStatus === 'booked' || rawStatus === 'pending' || rawStatus === 'scheduled';

            // Exclude completed orders from active jobs
            if (isDelivered) return false;

            // 1. Tab filter (All | New / Scheduled | Driver Assigned | In Transit)
            if ((activeTab === 'confirmed' || activeTab === 'new' || activeTab === 'scheduled') && !isConfirmed) return false;
            if (activeTab === 'driver_assigned' && !isDriverAssigned) return false;
            if (activeTab === 'in_transit' && !isInTransit) return false;

            // 2. Status filter dropdown
            if (statusFilter !== 'all') {
                if ((statusFilter === 'confirmed' || statusFilter === 'new' || statusFilter === 'scheduled') && !isConfirmed) return false;
                if (statusFilter === 'driver_assigned' && !isDriverAssigned) return false;
                if (statusFilter === 'in_transit' && !isInTransit) return false;
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
