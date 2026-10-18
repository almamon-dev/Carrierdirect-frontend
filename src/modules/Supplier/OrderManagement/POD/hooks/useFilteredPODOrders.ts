import { useMemo } from 'react';
import { PODOrderItem, PODFilterTab } from '../types';

interface UseFilteredPODOrdersProps {
    orders: PODOrderItem[];
    activeTab: PODFilterTab;
    statusFilter: string;
    vehicleFilter: string;
    startDate: string;
    endDate: string;
}

export const useFilteredPODOrders = ({
    orders,
    activeTab,
    statusFilter,
    vehicleFilter,
    startDate,
    endDate,
}: UseFilteredPODOrdersProps) => {
    return useMemo(() => {
        return orders.filter((order) => {
            const podStatus = String(order.pod_status || '').toLowerCase().trim();
            const rawStatus = String(order.status_raw || order.status || '').toLowerCase().trim();
            const hasPod = Boolean(order.has_pod || order.pod_document_url || order.pod_file_url);

            const isApproved = podStatus === 'approved' || podStatus.includes('approv') || podStatus === 'confirmed' || rawStatus === 'completed' || rawStatus === 'pod accepted';
            const isRejected = !isApproved && (podStatus === 'rejected' || podStatus.includes('reject'));
            const isInReview = !isApproved && !isRejected && hasPod && (podStatus === 'pending review' || podStatus.includes('review') || podStatus.includes('pending') || rawStatus === 'pod_uploaded');
            const isNeedsUpload = !isApproved && !isRejected && !isInReview && (!hasPod || podStatus === 'not uploaded' || podStatus === 'awaiting');

            // 1. Tab filter:
            if (activeTab === 'needs_upload' && !isNeedsUpload) return false;
            if (activeTab === 'uploaded' && (!hasPod || isApproved)) return false;
            if (activeTab === 'in_review' && !isInReview) return false;
            if (activeTab === 'approved' && !isApproved) return false;
            if (activeTab === 'rejected' && !isRejected) return false;

            // 2. Status dropdown filter
            if (statusFilter !== 'all') {
                if (statusFilter === 'needs_upload' && !isNeedsUpload) return false;
                if (statusFilter === 'in_review' && !isInReview) return false;
                if (statusFilter === 'approved' && !isApproved) return false;
                if (statusFilter === 'rejected' && !isRejected) return false;
                if (statusFilter === 'uploaded' && !hasPod) return false;
            }

            // 3. Vehicle filter
            if (vehicleFilter !== 'all') {
                const v = String(order.vehicle || order.vehicle_type || '').toLowerCase();
                if (!v.includes(vehicleFilter.toLowerCase())) return false;
            }

            // 4. Date filter
            if (startDate) {
                const orderTime = new Date(order.delivery_date || order.pickup_date || '').getTime();
                const startLimit = new Date(startDate).getTime();
                if (!isNaN(orderTime) && !isNaN(startLimit) && orderTime < startLimit) return false;
            }
            if (endDate) {
                const orderTime = new Date(order.delivery_date || order.pickup_date || '').getTime();
                const endLimit = new Date(endDate).getTime() + 86400000;
                if (!isNaN(orderTime) && !isNaN(endLimit) && orderTime > endLimit) return false;
            }

            return true;
        });
    }, [orders, activeTab, statusFilter, vehicleFilter, startDate, endDate]);
};

export default useFilteredPODOrders;
