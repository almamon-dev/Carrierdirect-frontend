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
     * Reject Proof of Delivery (POD) and request replacement from carrier
     */
    async rejectPod(orderId: string | number, note: string): Promise<any> {
        const res = await apiClient.post(`/customer/orders/${orderId}/pod-reject`, { note });
        return res.data;
    },

    /**
     * Fetch POD review details & 48-hour auto-approval countdown
     */
    async fetchPodReview(orderId: string | number): Promise<any> {
        const res = await apiClient.get(`/customer/orders/${orderId}/pod-review`);
        return res.data?.data || res.data;
    },

    /**
     * Customer "Report issue" — immediately holds supplier transfer and opens an admin-reviewed dispute
     */
    async reportIssue(orderId: string | number, reason: string, description?: string): Promise<any> {
        const res = await apiClient.post(`/customer/orders/${orderId}/report-issue`, {
            reason,
            description,
        });
        return res.data?.data || res.data;
    },

    /**
     * Cancel a Net-30 Pay Later order according to the 3-stage cancellation policy
     */
    async cancelPayLaterOrder(orderId: string | number, reason: string): Promise<any> {
        const res = await apiClient.post(`/customer/orders/${orderId}/cancel-pay-later`, { reason });
        return res.data?.data || res.data;
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
