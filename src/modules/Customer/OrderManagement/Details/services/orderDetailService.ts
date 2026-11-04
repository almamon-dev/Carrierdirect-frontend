import apiClient from '@/lib/axios';

export const orderDetailService = {
    /**
     * Fetch order details by ID
     */
    async fetchOrderDetail(orderId: string | number): Promise<any> {
        const res = await apiClient.get(`/customer/orders/${orderId}`);
        return res.data?.data || res.data;
    },

    /**
     * Track order by Order ID / Order Number (e.g. ORD-0001 or 1)
     */
    async trackOrderByOrderId(orderId: string | number): Promise<any> {
        const cleanQuery = String(orderId).trim().replace(/^#/, '');
        const res = await apiClient.get(`/customer/orders/track/${encodeURIComponent(cleanQuery)}`);
        return res.data?.data || res.data;
    },

    /**
     * Approve Proof of Delivery (POD)
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

export default orderDetailService;
