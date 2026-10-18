import apiClient from '@/lib/axios';
import { CustomerOrderItem, OrderStats } from '../types/order.types';

export interface FetchOrdersResponse {
    orders: CustomerOrderItem[];
    stats: OrderStats | null;
}

export const orderService = {
    /**
     * Fetch list of customer orders from API
     */
    async fetchOrders(): Promise<FetchOrdersResponse> {
        const res = await apiClient.get('/customer/orders');
        const list = res.data?.data?.data || res.data?.data || res.data?.orders || res.data || [];
        const stats = res.data?.data?.stats || res.data?.stats || null;

        return {
            orders: Array.isArray(list) ? list : [],
            stats: stats || null,
        };
    },

    /**
     * Approve Proof of Delivery (POD) for an order
     */
    async approvePod(orderId: string | number): Promise<any> {
        const res = await apiClient.post(`/customer/orders/${orderId}/pod-approve`);
        return res.data;
    },

    /**
     * Submit carrier rating and review
     */
    async submitReview(orderId: string | number, reviewData: any): Promise<any> {
        const res = await apiClient.post(`/customer/orders/${orderId}/review`, reviewData);
        return res.data;
    },
};

export default orderService;
