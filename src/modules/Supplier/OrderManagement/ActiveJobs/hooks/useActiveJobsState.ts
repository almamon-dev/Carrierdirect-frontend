import { useState, useEffect, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { SupplierOrder, mapApiOrderToSupplierOrder, checkHasRealDriver } from '../../data/ordersData';

export const isOrderCompleted = (job: SupplierOrder): boolean => {
    const st = String(job.status || '').toLowerCase().trim();
    const rawSt = String((job as any).status_raw || '').toLowerCase().trim();
    const ps = String((job as any).pod_status || (job as any).tracking?.pod_status || '').toLowerCase().trim();
    const isPodApproved = ps === 'confirmed' || ps === 'approved' || ps === 'accepted';
    return (
        st === 'completed' ||
        st === 'pod accepted' ||
        st === 'pod_accepted' ||
        rawSt === 'completed' ||
        rawSt === 'pod accepted' ||
        rawSt === 'pod_accepted' ||
        isPodApproved
    );
};

export const isOrderInTransit = (job: SupplierOrder): boolean => {
    const st = String(job.status || '').toLowerCase().trim();
    const rawSt = String((job as any).status_raw || '').toLowerCase().trim();
    return (
        st === 'in transit' ||
        st === 'in_transit' ||
        st === 'picked_up' ||
        st === 'on_the_way' ||
        st === 'in_progress' ||
        st === 'arrived' ||
        st === 'delivered' ||
        st === 'pod_uploaded' ||
        rawSt === 'in transit' ||
        rawSt === 'in_transit' ||
        rawSt === 'picked_up' ||
        rawSt === 'on_the_way' ||
        rawSt === 'in_progress' ||
        rawSt === 'arrived' ||
        rawSt === 'delivered' ||
        rawSt === 'pod_uploaded'
    );
};

export const isOrderDriverAssigned = (job: SupplierOrder): boolean => {
    if (isOrderInTransit(job) || isOrderCompleted(job)) return false;
    return checkHasRealDriver(job);
};

export const isOrderUnassigned = (job: SupplierOrder): boolean => {
    return !isOrderCompleted(job) && !isOrderInTransit(job) && !checkHasRealDriver(job);
};

export const isOrderNew = (job: SupplierOrder): boolean => {
    const rawSt = String((job as any).status_raw || job.status || '').toLowerCase().trim();
    const isNewStatus = rawSt === 'confirmed' || rawSt === 'pending' || rawSt === 'scheduled' || rawSt === 'new';
    return isNewStatus && isOrderUnassigned(job);
};

export const useActiveJobsState = () => {
    const [orders, setOrders] = useState<SupplierOrder[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [activeFilterTab, setActiveFilterTab] = useState<string>('new');

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [vehicleFilter, setVehicleFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [ratingTarget, setRatingTarget] = useState<{ id: string; customer: string; route: string } | null>(null);

    const fetchOrders = async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            const response = await apiClient.get('/supplier/orders', { params: { tab: 'active' } });
            const ordersList: any[] =
                (Array.isArray(response?.data?.orders) && response.data.orders) ||
                (Array.isArray(response?.data?.data?.orders) && response.data.data.orders) ||
                (Array.isArray(response?.data?.data) && response.data.data) ||
                (Array.isArray(response?.orders) && response.orders) ||
                (Array.isArray(response?.data) && response.data) ||
                (Array.isArray(response) && response) ||
                [];

            const mappedOrders = ordersList
                .map((apiOrder: any) => mapApiOrderToSupplierOrder(apiOrder))
                .filter((job) => !isOrderCompleted(job));

            setOrders(mappedOrders);
        } catch (error) {
            console.error('Failed to fetch supplier orders:', error);
        } finally {
            setIsLoading(false);
            if (isManualRefresh) {
                setTimeout(() => setIsRefreshing(false), 300);
            }
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleResetFilters = () => {
        setStatusFilter('all');
        setVehicleFilter('all');
        setStartDate('');
        setEndDate('');
    };

    const filteredJobs = useMemo(() => {
        return orders.filter(job => {
            // Strictly exclude completed / delivered orders from Active Jobs
            if (isOrderCompleted(job)) return false;

            const inTransit = isOrderInTransit(job);
            const driverAssigned = isOrderDriverAssigned(job);
            const newJob = isOrderNew(job);

            if ((activeFilterTab === 'new' || activeFilterTab === 'scheduled') && !newJob) return false;
            if (activeFilterTab === 'unassigned' && !isOrderUnassigned(job)) return false;
            if (activeFilterTab === 'driver_assigned' && !driverAssigned) return false;
            if (activeFilterTab === 'in_transit' && !inTransit) return false;

            if (statusFilter !== 'all') {
                if (statusFilter === 'in transit' && !inTransit) return false;
                if (statusFilter === 'assigned' && !driverAssigned) return false;
                if (statusFilter === 'unassigned' && !isOrderUnassigned(job)) return false;
                if ((statusFilter === 'new' || statusFilter === 'scheduled') && !newJob) return false;
            }

            if (vehicleFilter !== 'all') {
                const vehicle = (job.vehicle || '').toLowerCase();
                if (vehicleFilter === 'van' && !vehicle.includes('van')) return false;
                if (vehicleFilter === 'truck' && !vehicle.includes('truck') && !vehicle.includes('trailer') && !vehicle.includes('pallet')) return false;
                if (vehicleFilter === 'refrigerated' && !vehicle.includes('refrig') && !vehicle.includes('temp')) return false;
            }

            if (startDate) {
                const jobDate = new Date(job.pickupDate || '').getTime();
                const fromDate = new Date(startDate).getTime();
                if (!isNaN(jobDate) && !isNaN(fromDate) && jobDate < fromDate) return false;
            }

            if (endDate) {
                const jobDate = new Date(job.pickupDate || '').getTime();
                const toDate = new Date(endDate).getTime();
                if (!isNaN(jobDate) && !isNaN(toDate) && jobDate > toDate) return false;
            }

            return true;
        });
    }, [orders, activeFilterTab, statusFilter, vehicleFilter, startDate, endDate]);

    const tabCounts = useMemo(() => {
        let new_jobs = 0;
        let driver_assigned = 0;
        let unassigned = 0;
        let in_transit = 0;

        orders.forEach(j => {
            if (isOrderInTransit(j)) in_transit++;
            else if (isOrderDriverAssigned(j)) driver_assigned++;
            else if (isOrderUnassigned(j)) {
                unassigned++;
                if (isOrderNew(j)) new_jobs++;
            }
        });

        return { all: orders.length, new_jobs, driver_assigned, unassigned, in_transit };
    }, [orders]);

    return {
        orders,
        isLoading,
        isRefreshing,
        activeFilterTab,
        setActiveFilterTab,
        statusFilter,
        setStatusFilter,
        vehicleFilter,
        setVehicleFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        ratingTarget,
        setRatingTarget,
        fetchOrders,
        handleResetFilters,
        filteredJobs,
        tabCounts,
    };
};

export default useActiveJobsState;
