import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { STATUS_CHANGE_EVENT, resolveSupplierQuoteStatus } from '@/modules/Supplier/QuoteManagement/utils/requestStatusTracker';

export function useSupplierNewRequestsCount(): number {
    const [count, setCount] = useState<number>(0);

    const fetchCount = useCallback(async () => {
        try {
            const res = await apiClient.get(ENDPOINTS.SUPPLIER.AVAILABLE_REQUESTS);
            const responseData = res.data?.data || res.data;

            const backendStats = res.data?.stats || responseData?.stats;
            if (backendStats && typeof backendStats.new === 'number') {
                setCount(backendStats.new);
                return;
            }

            const rawItems = 
                (Array.isArray(responseData?.requests?.data) && responseData.requests.data) ||
                (Array.isArray(responseData?.requests) && responseData.requests) ||
                (Array.isArray(responseData?.quote_requests?.data) && responseData.quote_requests.data) ||
                (Array.isArray(responseData?.quote_requests) && responseData.quote_requests) ||
                (Array.isArray(responseData?.available_requests?.data) && responseData.available_requests.data) ||
                (Array.isArray(responseData?.available_requests) && responseData.available_requests) ||
                (Array.isArray(res.data?.quote_requests) && res.data.quote_requests) ||
                (Array.isArray(res.data?.requests) && res.data.requests) ||
                (Array.isArray(responseData) && responseData) ||
                [];

            const newItems = rawItems.filter((q: any) => {
                const status = resolveSupplierQuoteStatus({
                    ...q,
                    status_raw: q.supplier_status || q.raw_status || q.status,
                    status: q.supplier_status || q.status,
                    supplier_status: q.supplier_status,
                    has_quoted: Boolean(q.has_quoted || q.quote_submitted || (q.supplier_status && q.supplier_status.toLowerCase() === 'quoted')),
                });
                return status === 'New';
            });

            setCount(newItems.length);
        } catch {
            // keep current count on failure
        }
    }, []);

    useEffect(() => {
        fetchCount();
        const interval = setInterval(fetchCount, 30000);

        const handleUpdate = () => {
            fetchCount();
        };

        window.addEventListener(STATUS_CHANGE_EVENT, handleUpdate);
        window.addEventListener('carrierdirect_notif_update', handleUpdate);

        return () => {
            clearInterval(interval);
            window.removeEventListener(STATUS_CHANGE_EVENT, handleUpdate);
            window.removeEventListener('carrierdirect_notif_update', handleUpdate);
        };
    }, [fetchCount]);

    return count;
}
