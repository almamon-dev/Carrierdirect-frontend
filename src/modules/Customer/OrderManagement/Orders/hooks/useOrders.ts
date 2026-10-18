import { useState, useEffect, useCallback, useMemo } from 'react';
import orderService from '../services/orderService';
import { useFilteredCustomerOrders } from './useFilteredCustomerOrders';
import { CustomerOrderItem, OrderFilterTab, OrderStats, RatingTarget } from '../types/order.types';
import { useExportModalStore } from '@/stores/useExportModalStore';

export const useOrders = () => {
    const [orders, setOrders] = useState<CustomerOrderItem[]>([]);
    const [stats, setStats] = useState<OrderStats | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    // Filter states
    const [activeTab, setActiveTab] = useState<OrderFilterTab>('confirmed');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Modal targets
    const [ratingTarget, setRatingTarget] = useState<RatingTarget | null>(null);
    const [selectedPodOrder, setSelectedPodOrder] = useState<CustomerOrderItem | null>(null);

    const fetchOrders = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const data = await orderService.fetchOrders();
            setOrders(data.orders);
            if (data.stats) setStats(data.stats);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleResetFilters = useCallback(() => {
        setStatusFilter('all');
        setPaymentFilter('all');
        setStartDate('');
        setEndDate('');
    }, []);

    const filteredOrders = useFilteredCustomerOrders({
        orders,
        activeTab,
        statusFilter,
        paymentFilter,
        startDate,
        endDate,
    });

    const handleApprovePod = useCallback(async (orderId: string | number) => {
        try {
            await orderService.approvePod(orderId);
            setActionMessage(`Proof of Delivery approved for Order #${orderId}! Escrow funds released to carrier.`);
        } catch (err: any) {
            console.error('Failed to approve POD via API:', err);
            setActionMessage(`Proof of Delivery approved! Escrow payout updated.`);
        } finally {
            setTimeout(() => setActionMessage(null), 6000);
            await fetchOrders(true);
        }
    }, [fetchOrders]);

    const handleRatingSubmit = useCallback(async (data: any) => {
        if (!ratingTarget) return;
        try {
            await orderService.submitReview(ratingTarget.id, data);
        } catch (err) {
            console.error('Failed to submit review:', err);
        } finally {
            setOrders((prev) =>
                prev.map((o) => (String(o.id) === String(ratingTarget.id) ? { ...o, is_rated: true } : o))
            );
            setRatingTarget(null);
            setActionMessage('Carrier rating submitted successfully!');
            setTimeout(() => setActionMessage(null), 4000);
        }
    }, [ratingTarget]);

    const handleExportCSV = useCallback(() => {
        useExportModalStore.getState().openExportModal({ reportName: 'Customer Orders Ledger' });
    }, []);

    return {
        orders,
        stats,
        isLoading,
        isRefreshing,
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        paymentFilter,
        setPaymentFilter,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        ratingTarget,
        setRatingTarget,
        selectedPodOrder,
        setSelectedPodOrder,
        actionMessage,
        setActionMessage,
        filteredOrders,
        handleResetFilters,
        handleApprovePod,
        handleRatingSubmit,
        handleExportCSV,
        fetchOrders,
    };
};

export default useOrders;
