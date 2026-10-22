import { formatStandardAddress } from "@/utils/addressFormatter";
import { useState, useEffect, useMemo, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';

export function useProcessingRequests() {
    const showToast = useToastStore((state) => state.showToast);
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchProcessingRequests = useCallback(async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            const endpoint = ENDPOINTS.CUSTOMER.QUOTE_REQUESTS || '/customer/quote-requests';
            const [requestsRes, quotesRes] = await Promise.allSettled([
                apiClient.get(endpoint, { params: { per_page: 200 } }),
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
                const items = Array.isArray(rawData)
                    ? rawData
                    : (Array.isArray(rawData?.data)
                        ? rawData.data
                        : (Array.isArray(res.data?.requests)
                            ? res.data.requests
                            : []));

                if (Array.isArray(items) && items.length > 0) {
                    const mapped = items.map((r: any) => {
                        const matchingQuotes = allReceivedQuotes.filter(item => {
                            const quoteReqId = item.quote_request_id || item.request_id || item.quote_request?.id;
                            return String(quoteReqId) === String(r.id);
                        });

                        const pickup = formatStandardAddress(r, "pickup");
                        const delivery = formatStandardAddress(r, "delivery");
                        const fromCity = r.pickup_city || pickup.split(',')[0]?.trim() || pickup;
                        const toCity = r.delivery_city || delivery.split(',')[0]?.trim() || delivery;

                        const bidsCount = Number(
                            r.quotes_count ??
                            r.quotes_received_count ??
                            r.quotesCount ??
                            r.bids_count ??
                            (Array.isArray(r.quotes_request) && r.quotes_request.length > 0 ? r.quotes_request.length :
                             Array.isArray(r.quotes) && r.quotes.length > 0 ? r.quotes.length :
                             matchingQuotes.length)
                        );

                        const hasAcceptedQuote = matchingQuotes.some(item => {
                            const s = String(item.status_raw || item.status || '').toLowerCase();
                            return s === 'accepted' || s === 'completed' || s === 'won' || s === 'booked';
                        });

                        const isOrderCompleted = matchingQuotes.some(item => {
                            const s = String(item.status_raw || item.status || '').toLowerCase();
                            const ost = String(item.order_status || item.orderStatus || item.order?.status || '').toLowerCase();
                            return s === 'completed' || ost === 'completed';
                        });

                        const formattedId = r.request_id || r.formatted_id || (r.id ? (String(r.id).startsWith('REQ-') ? r.id : `REQ-${String(r.id).padStart(4, '0')}`) : 'REQ-0000');
                        const title = r.request_title || r.title || r.requestTitle || `${fromCity} to ${toCity}`;

                        const rawStatusLower = String(r.raw_status || r.status_raw || r.status || 'in_progress').toLowerCase();
                        let statusLabel = 'In Progress';
                        let effectiveRawStatus = 'in_progress';

                        const hasNegotiatingQuote = matchingQuotes.some(item => {
                            const s = String(item.status_raw || item.status || '').toLowerCase().trim();
                            const rev = String(item.revision_status || item.revisionStatus || '').toLowerCase().trim();
                            return s.includes('counter') || s.includes('negotiat') || rev === 'pending' || Boolean(item.is_negotiating || item.isNegotiating || item.has_negotiation_messages || item.hasNegotiationMessages);
                        });

                        const hasNegotiation = Boolean(r.has_negotiation || r.is_negotiating || hasNegotiatingQuote || rawStatusLower.includes('negotiat') || rawStatusLower === 'review');

                        if (isOrderCompleted || (rawStatusLower === 'completed' && !hasAcceptedQuote)) {
                            statusLabel = 'Completed';
                            effectiveRawStatus = 'completed';
                        } else if (hasAcceptedQuote || rawStatusLower === 'won' || rawStatusLower === 'booked' || rawStatusLower === 'accepted' || rawStatusLower === 'awarded') {
                            statusLabel = 'Booked';
                            effectiveRawStatus = 'booked';
                        } else if (rawStatusLower === 'cancelled' || rawStatusLower === 'expired' || rawStatusLower === 'closed' || rawStatusLower === 'rejected') {
                            statusLabel = 'Cancelled';
                            effectiveRawStatus = 'cancelled';
                        } else if (hasNegotiation) {
                            statusLabel = 'Negotiation';
                            effectiveRawStatus = 'negotiation';
                        } else if (bidsCount > 0 || rawStatusLower === 'quotes_received' || rawStatusLower === 'quotes received') {
                            statusLabel = 'Quotes Received';
                            effectiveRawStatus = 'quotes_received';
                        } else {
                            statusLabel = 'Pending';
                            effectiveRawStatus = 'pending';
                        }

                        return {
                            id: formattedId,
                            rawId: r.id,
                            requestId: formattedId,
                            title,
                            pickup,
                            delivery,
                            route: { from: fromCity, to: toCity, fullFrom: pickup, fullTo: delivery },
                            vehicleType: r.vehicle_type || r.vehicle || 'Covered Van',
                            palletType: r.type_of_pallets || r.load_type || 'Standard Euro Pallets',
                            cargoWeight: r.weight ? `${r.weight} KG` : '—',
                            itemsCount: r.items_count || (r.items?.length ? r.items.length : '—'),
                            priority: r.priority || 'Normal',
                            status: statusLabel,
                            rawStatus: effectiveRawStatus,
                            hasAcceptedQuote,
                            isNegotiating: hasNegotiation,
                            hasNegotiation: hasNegotiation,
                            bidsCount,
                            pickupDate: r.pickup_date || r.requested_date || 'Standard Pickup',
                            deliveryDate: r.delivery_date || 'Standard Delivery',
                            createdAt: r.created_at || r.requested_date || r.date,
                            additionalNotes: r.additional_notes || '',
                            budget: r.budget ? (String(r.budget).includes('€') || String(r.budget).includes('$') || String(r.budget).includes('৳') ? String(r.budget) : `€ ${Number(r.budget).toLocaleString()}`) : 'Negotiable',
                            rawData: r,
                        };

                    });

                    setRequests(mapped);
                    if (isManualRefresh) {
                        showToast(`Refreshed ${mapped.length} processing quote request(s).`, 'success');
                    }
                } else {
                    setRequests([]);
                    if (isManualRefresh) {
                        showToast('Quote requests refreshed. No active requests found.', 'info');
                    }
                }
            } else {
                setRequests([]);
            }
        } catch (err: any) {
            console.error('Failed to load processing requests:', err);
            setRequests([]);
            if (isManualRefresh) {
                showToast('Failed to load quote requests from server.', 'error');
            }
        } finally {
            setIsLoading(false);
            if (isManualRefresh) {
                setTimeout(() => setIsRefreshing(false), 300);
            }
        }
    }, [showToast]);

    useEffect(() => {
        fetchProcessingRequests();
    }, [fetchProcessingRequests]);

    const stats = useMemo(() => {
        let totalQuotes = 0;
        let withQuotes = 0;
        let awaitingQuotes = 0;
        let highPriority = 0;

        requests.forEach((r) => {
            totalQuotes += r.bidsCount;
            if (r.bidsCount > 0) withQuotes++;
            else awaitingQuotes++;
            if (String(r.priority).toLowerCase() === 'high') highPriority++;
        });

        return {
            total: requests.length,
            totalQuotes,
            withQuotes,
            awaitingQuotes,
            highPriority
        };
    }, [requests]);

    return {
        requests,
        isLoading,
        isRefreshing,
        stats,
        fetchProcessingRequests,
    };
}


