import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { SupplierOrderItem } from '../types';
import { mapApiToSupplierOrderItem } from '../utils/orderMapper';

export const useSupplierOrders = () => {
    const [orders, setOrders] = useState<SupplierOrderItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [ratingTarget, setRatingTarget] = useState<any>(null);

    const fetchOrders = useCallback(async (isRefresh = false) => {
        if (isRefresh) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            const response = await apiClient.get('/supplier/orders');
            const data = (Array.isArray(response?.data?.orders) && response.data.orders) ||
                (Array.isArray(response?.data?.data?.orders) && response.data.data.orders) ||
                (Array.isArray(response?.data?.data) && response.data.data) ||
                (Array.isArray(response?.orders) && response.orders) ||
                (Array.isArray(response?.data) && response.data) || [];

            if (Array.isArray(data)) {
                setOrders(data.map(mapApiToSupplierOrderItem));
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Failed to fetch supplier orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();

        const handleRealtime = () => {
            fetchOrders(true);
        };
        window.addEventListener("order-status-updated", handleRealtime);
        window.addEventListener("driver-shipment-updated", handleRealtime);
        return () => {
            window.removeEventListener("order-status-updated", handleRealtime);
            window.removeEventListener("driver-shipment-updated", handleRealtime);
        };
    }, [fetchOrders]);

    const handleRatingSubmit = async (data: any) => {
        if (!ratingTarget) return;
        try {
            await apiClient.post('/supplier/reviews', data);
            setOrders(prev => prev.map(o => String(o.id) === String(ratingTarget.id) ? { ...o, is_rated: true } : o));
            setRatingTarget(null);
        } catch (err) {
            console.error('Failed to submit review:', err);
            setOrders(prev => prev.map(o => String(o.id) === String(ratingTarget.id) ? { ...o, is_rated: true } : o));
            setRatingTarget(null);
        }
    };

    return {
        orders,
        isLoading,
        isRefreshing,
        ratingTarget,
        setRatingTarget,
        fetchOrders,
        handleRatingSubmit,
    };
};

export default useSupplierOrders;
