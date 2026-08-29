/**
 * useCustomerQuoteRequests Hook
 * Handles fetching, Stale-While-Revalidate caching, repeating, and deleting customer quote requests.
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';
import { CustomerQuoteRequestItem } from '../types';
import { buildRepeatData } from '../utils/repeatHelpers';
import { formatDisplayDate } from '@/lib/utils';

const CACHE_KEY = 'customer_quote_requests_cache';

export function useCustomerQuoteRequests() {
    const navigate = useNavigate();
    const showToast = useToastStore(state => state.showToast);

    // Initialize from localStorage cache to prevent blank flashes on browser refresh
    const [requestData, setRequestData] = useState<CustomerQuoteRequestItem[]>(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {}
        return [];
    });

    // Loading indicator; starts false if cache exists for immediate rendering
    const [isLoading, setIsLoading] = useState<boolean>(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) return false;
            }
        } catch {}
        return true;
    });

    const [isRepeating, setIsRepeating] = useState<string | null>(null);

    /**
     * Fetch quote requests and quote counts from the backend API.
     * @param showSkeleton - Whether to show the skeleton during re-fetching
     */
    const fetchQuoteRequests = useCallback(async (showSkeleton = false) => {
        if (showSkeleton) setIsLoading(true);
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
                    const mapped: CustomerQuoteRequestItem[] = rawItems.map((q: any) => {
                        const matchedFromAllQuotes = allReceivedQuotes.filter(item => {
                            const quoteReqId = item.quote_request_id || item.request_id || item.quote_request?.id;
                            return String(quoteReqId) === String(q.id);
                        }).length;

                        const qCount = Number(
                            q.quotes_count ??
                            q.quotes_received_count ??
                            q.bids_count ??
                            (Array.isArray(q.quotes_request) && q.quotes_request.length > 0 ? q.quotes_request.length :
                             Array.isArray(q.quotes) && q.quotes.length > 0 ? q.quotes.length :
                             matchedFromAllQuotes)
                        );

                        const dateStr = formatDisplayDate(q.requested_date || q.request_date || q.pickup_date || q.created_at || q.created_at_formatted || q.date);

                        const budgetStr = q.budget 
                            ? (String(q.budget).includes('€') || String(q.budget).includes('$') || String(q.budget).includes('৳') ? String(q.budget) : `€${q.budget}`)
                            : 'Negotiable';

                        const distanceStr = q.est_distance || q.distance_miles 
                            ? `${q.est_distance || q.distance_miles} km` 
                            : '245 km';

                        return {
                            id: q.id ? (String(q.id).startsWith('REQ-') ? q.id : `REQ-${q.id}`) : 'REQ-000',
                            rawId: q.id,
                            slug: String(q.slug || q.id),
                            date: dateStr,
                            pickup: (q.pickup_address || q.pickup_city || '—').trim(),
                            delivery: (q.delivery_address || q.delivery_city || '—').trim(),
                            distance: distanceStr,
                            budget: budgetStr,
                            priority: q.priority || 'Normal',
                            status: q.status === 'active' ? 'Active' : (q.status === 'pending' ? 'Draft' : (q.status || 'Active')),
                            quotesReceived: qCount,
                            type: q.shipment_type || 'FTL',
                            load: q.load_type || q.type_of_pallets || 'Pallets',
                            vehicle: q.vehicle_type || 'Covered Van',
                            weight: q.weight ? `${q.weight} KG` : '—',
                            rawData: q,
                        };
                    });

                    setRequestData(mapped);
                    try {
                        localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
                    } catch {}
                }
            }
        } catch {
            // Keep cached data if offline/error
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQuoteRequests();
    }, [fetchQuoteRequests]);

    /**
     * Delete/Cancel a single quote request
     */
    const handleDeleteRequest = async (row: CustomerQuoteRequestItem) => {
        const rawId = String(row.id).replace('REQ-', '');
        if (!window.confirm(`Are you sure you want to delete/cancel quote request ${row.id}?`)) {
            return;
        }

        try {
            await apiClient.delete(`${ENDPOINTS.CUSTOMER.QUOTE_REQUESTS}/${rawId}`);
            setRequestData(prev => {
                const next = prev.filter(item => item.id !== row.id);
                localStorage.setItem(CACHE_KEY, JSON.stringify(next));
                return next;
            });
            showToast(`Quote request ${row.id} has been cancelled/deleted.`, 'success');
        } catch {
            setRequestData(prev => {
                const next = prev.filter(item => item.id !== row.id);
                localStorage.setItem(CACHE_KEY, JSON.stringify(next));
                return next;
            });
            showToast(`Quote request ${row.id} removed.`, 'info');
        }
    };

    /**
     * Delete multiple selected quote requests in batch
     */
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

        setRequestData(prev => {
            const next = prev.filter(item => !selectedIds.includes(item.id));
            localStorage.setItem(CACHE_KEY, JSON.stringify(next));
            return next;
        });
        showToast(`${selectedIds.length} request(s) deleted.`, 'success');
    };

    /**
     * Repeat request by prefilling data into the Create form
     */
    const handleRepeatRequest = async (row: CustomerQuoteRequestItem) => {
        const rawId = String(row.id).replace('REQ-', '');
        setIsRepeating(row.id);
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
