import { useState, useEffect, useCallback, useRef } from 'react';
import { echo } from '@/lib/echo';
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

    const hasDataRef = useRef(false);

    const fetchQuoteRequests = useCallback(async (showSkeleton = false) => {
        if (showSkeleton || !hasDataRef.current) setIsLoading(true);
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
            hasDataRef.current = true;
        } catch {
            setRequestData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuoteRequests();

        const handleRealtimeUpdate = () => {
            fetchQuoteRequests();
        };

        window.addEventListener('carrierdirect_notif_update', handleRealtimeUpdate);
        window.addEventListener('carrierdirect_quote_updated', handleRealtimeUpdate);

        let userChannel: any = null;
        try {
            const rawUser = localStorage.getItem('carrierdirect_user_data') || localStorage.getItem('user');
            const user = rawUser ? JSON.parse(rawUser) : null;
            if (user?.id) {
                userChannel = echo.private(`App.Models.User.${user.id}`);
                userChannel.notification(() => {
                    fetchQuoteRequests();
                });
                userChannel.listen('.quote.updated', () => {
                    fetchQuoteRequests();
                });
                userChannel.listen('quote.updated', () => {
                    fetchQuoteRequests();
                });
            }
        } catch (e) {
            console.warn('Echo direct subscribe error in useCustomerQuoteRequests:', e);
        }

        return () => {
            window.removeEventListener('carrierdirect_notif_update', handleRealtimeUpdate);
            window.removeEventListener('carrierdirect_quote_updated', handleRealtimeUpdate);
            if (userChannel) {
                userChannel.stopListening('.quote.updated');
                userChannel.stopListening('quote.updated');
            }
        };
    }, [fetchQuoteRequests]);

    const handleMoveToDraft = async (row: CustomerQuoteRequestItem) => {
        const rawId = String(row.rawId || row.id).replace('REQ-', '');
        try {
            await apiClient.post(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${rawId}/draft`);
            setRequestData(prev => prev.map(item => {
                if (String(item.id) === String(row.id) || String(item.rawId) === String(row.rawId)) {
                    return {
                        ...item,
                        status: 'Draft',
                        rawStatus: 'draft',
                        badgeColor: 'slate',
                    };
                }
                return item;
            }));
            showToast(`Quote request ${row.id} moved to Draft successfully!`, 'success');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || 'Failed to move to draft.';
            showToast(msg, 'error');
        }
    };

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
        handleMoveToDraft,
    };
}
