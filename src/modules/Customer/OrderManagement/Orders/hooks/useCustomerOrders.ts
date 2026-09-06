import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { CustomerOrderItem } from '../types';

export const useCustomerOrders = () => {
    const [orders, setOrders] = useState<CustomerOrderItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [ratingTarget, setRatingTarget] = useState<{ id: string; supplier: string; route: string } | null>(null);

    const fetchOrders = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const res = await apiClient.get('/customer/orders');
            const list = res.data?.data?.data || res.data?.data || res.data?.orders || res.data || [];
            if (Array.isArray(list) && list.length > 0) {
                setOrders(list);
            } else {
                setOrders([]);
            }
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

    const handleRatingSubmit = async (data: any) => {
        if (!ratingTarget) return;
        try {
            await apiClient.post(`/customer/orders/${ratingTarget.id}/review`, data);
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

export default useCustomerOrders;

