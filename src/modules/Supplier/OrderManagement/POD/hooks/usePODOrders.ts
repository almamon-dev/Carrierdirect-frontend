import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { PODOrderItem } from '../types';
import { mapApiToPODOrderItem } from '../utils/podMapper';

export const usePODOrders = () => {
    const [orders, setOrders] = useState<PODOrderItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const fetchOrders = useCallback(async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const res = await apiClient.get('/supplier/orders');
            const rawList =
                (Array.isArray(res?.data?.data?.data) && res.data.data.data) ||
                (Array.isArray(res?.data?.data) && res.data.data) ||
                (Array.isArray(res?.data?.orders?.data) && res.data.orders.data) ||
                (Array.isArray(res?.data?.orders) && res.data.orders) ||
                (Array.isArray(res?.data) && res.data) ||
                (Array.isArray(res) && res) || [];

            if (Array.isArray(rawList) && rawList.length > 0) {
                setOrders(rawList.map(mapApiToPODOrderItem));
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Failed to fetch POD orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const uploadPOD = async (orderId: string | number, file: File): Promise<boolean> => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('proof', file);

            const cleanId = String(orderId).replace('ORD-', '');
            await apiClient.post(`/supplier/orders/${cleanId}/pod-reupload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            await fetchOrders(true);
            return true;
        } catch (error) {
            console.error('Failed to upload POD:', error);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        orders,
        isLoading,
        isRefreshing,
        isSubmitting,
        fetchOrders,
        uploadPOD,
    };
};

export default usePODOrders;
