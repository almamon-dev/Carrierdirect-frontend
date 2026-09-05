import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';
import { CustomerQuoteRequestItem } from '../types';
import { buildRepeatData } from '../utils/repeatHelpers';
import { mapCustomerQuoteRequestItems } from '../utils/customerQuoteRequestMapper';

export function useCustomerQuoteRequests() {
    const navigate = useNavigate();
    const showToast = useToastStore(state => state.showToast);

    const [requestData, setRequestData] = useState<CustomerQuoteRequestItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRepeating, setIsRepeating] = useState<string | null>(null);

    const fetchQuoteRequests = useCallback(async (showSkeleton = false) => {
        if (showSkeleton || requestData.length === 0) setIsLoading(true);
        try {
            const [requestsRes, quotesRes] = await Promise.allSettled([
                apiClient.get(ENDPOINTS.CUSTOMER.QUOTE_REQUESTS, { params: { per_page: 200 } }),
                apiClient.get('/customer/quotes/received'),
            ]);

            let allReceivedQuotes: any[] = [];
            if (quotesRes.status === 'fulfilled') {
                const rawQ = quotesRes.value.data?.data?.quotes || quotesRes.value.data?.quotes_request || quotesRes.value.data?.quotes || quotesRes.value.data?.data || quotesRes.value.data || [];
                allReceivedQuotes = Array.isArray(rawQ) ? rawQ : (rawQ?.data || []);
            }

            if (requestsRes.status === 'fulfilled') {
                const res = requestsRes.value;
                const rawData = res.data?.data || res.data;
                const rawItems = Array.isArray(rawData)
                    ? rawData
                    : (Array.isArray(rawData?.data)
                        ? rawData.data
                        : (Array.isArray(res.data?.requests)
                            ? res.data.requests
                            : []));

                if (Array.isArray(rawItems)) {
                    setRequestData(mapCustomerQuoteRequestItems(rawItems, allReceivedQuotes));
                } else {
                    setRequestData([]);
                }
            } else {
                setRequestData([]);
            }
        } catch {
            setRequestData([]);
        } finally {
            setIsLoading(false);
        }
    }, [requestData.length]);

    useEffect(() => {
        fetchQuoteRequests();
    }, [fetchQuoteRequests]);

    const handleDeleteRequest = async (row: CustomerQuoteRequestItem) => {
        const rawId = String(row.id).replace('REQ-', '');
        if (!window.confirm(`Are you sure you want to delete/cancel quote request ${row.id}?`)) {
            return;
        }

        try {
            await apiClient.delete(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${rawId}`);
            setRequestData(prev => prev.filter(item => item.id !== row.id));
            showToast(`Quote request ${row.id} has been cancelled/deleted.`, 'success');
        } catch {
            setRequestData(prev => prev.filter(item => item.id !== row.id));
            showToast(`Quote request ${row.id} removed.`, 'info');
        }
    };

    const handleDeleteSelected = async (selectedIds: (number | string)[]) => {
        if (!selectedIds.length) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected request(s)?`)) {
            return;
        }

        for (const id of selectedIds) {
            const rawId = String(id).replace('REQ-', '');
            try {
                await apiClient.delete(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${rawId}`);
            } catch {}
        }

        setRequestData(prev => prev.filter(item => !selectedIds.includes(item.id)));
        showToast(`${selectedIds.length} request(s) deleted.`, 'success');
    };

    const handleRepeatRequest = async (row: CustomerQuoteRequestItem) => {
        const rawId = String(row.id).replace('REQ-', '');
        setIsRepeating(String(row.id));
        try {
            const res = await apiClient.get(ENDPOINTS.CUSTOMER.QUOTE_REQUEST_DETAIL(rawId));
            const q = res.data?.data || res.data || res;
            const repeatData = buildRepeatData(q, row);
            navigate('/customer/quotes/create/new', { state: { repeatData } });
            showToast(`Repeat request created from ${row.id}!`, 'success');
        } catch {
            navigate('/customer/quotes/create/new', { 
                state: { 
                    repeatData: { 
                        ...row, 
                        requestTitle: `Repeat: ${row.id}`, 
                        internalReference: `REPEAT-${row.id}` 
                    } 
                } 
            });
            showToast(`Opened repeat request with available data.`, 'info');
        } finally {
            setIsRepeating(null);
        }
    };

    return {
        requestData,
        setRequestData,
        isLoading,
        isRepeating,
        fetchQuoteRequests,
        handleDeleteRequest,
        handleDeleteSelected,
        handleRepeatRequest,
    };
}
