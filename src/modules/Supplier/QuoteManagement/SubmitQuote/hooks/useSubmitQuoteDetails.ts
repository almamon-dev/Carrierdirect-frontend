import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { decryptId } from '@/lib/encryption';
import { markRequestAsViewed } from '../../utils/requestStatusTracker';
import { mapSubmitQuoteDetail } from '../utils/detailMapper';
import { echo } from '@/lib/echo';

const getInitialEmptyDetails = (id: string): QuoteRequest => ({
    id: id ? `REQ-${id}` : '',
    slug: id || '',
    requestDate: '',
    customer: '',
    pickup: '',
    delivery: '',
    distance: '',
    budget: '—',
    status: '',
    priority: '',
    dimensions: [],
    cargoItems: [],
    documents: []
} as unknown as QuoteRequest);

export function useSubmitQuoteDetails(slug?: string) {
    const rawCleanId = slug ? decryptId(slug).replace('REQ-', '').trim() : '';
    const [requestDetails, setRequestDetails] = useState<QuoteRequest>(() => getInitialEmptyDetails(rawCleanId));
    const [loading, setLoading] = useState<boolean>(true);
    const [apiData, setApiData] = useState<Record<string, any>>({});
    const isMountedRef = useRef(true);

    const fetchDetails = useCallback(async (silent = false) => {
        const cleanId = slug ? decryptId(slug).replace('REQ-', '').trim() : '';
        if (!cleanId) {
            if (isMountedRef.current) setLoading(false);
            return;
        }

        if (!silent) {
            markRequestAsViewed(cleanId);
            setLoading(true);
        }

        try {
            const res = await apiClient.get(ENDPOINTS.SUPPLIER.REQUEST_DETAIL(cleanId));
            if (!isMountedRef.current) return;
            const raw = res.data?.data || res.data || res;
            const { requestDetails: mapped, apiData: mappedApi } = mapSubmitQuoteDetail(raw, cleanId);
            setApiData(mappedApi);
            setRequestDetails(mapped);
        } catch (err) {
            console.error('Failed to load supplier request detail', err);
        } finally {
            if (isMountedRef.current && !silent) {
                setLoading(false);
            }
        }
    }, [slug]);

    // Initial load
    useEffect(() => {
        isMountedRef.current = true;
        fetchDetails(false);
        return () => { isMountedRef.current = false; };
    }, [fetchDetails]);

    // Real-Time Listeners (Echo WebSockets & Window Events)
    useEffect(() => {
        const handleRealtimeUpdate = (e?: any) => {
            fetchDetails(true);
        };

        window.addEventListener('carrierdirect_notif_update', handleRealtimeUpdate);
        window.addEventListener('carrierdirect_quote_updated', handleRealtimeUpdate);
        window.addEventListener('quote_accepted', handleRealtimeUpdate);
        window.addEventListener('order-status-updated', handleRealtimeUpdate);

        let userChannel: any = null;
        let quoteChannel: any = null;

        try {
            const rawUser = localStorage.getItem('carrierdirect_user_data') || localStorage.getItem('user');
            const user = rawUser ? JSON.parse(rawUser) : null;
            if (user?.id) {
                userChannel = echo.private(`App.Models.User.${user.id}`);
                userChannel.notification(() => {
                    fetchDetails(true);
                });
                userChannel.listen('.quote.updated', () => {
                    fetchDetails(true);
                });
                userChannel.listen('quote.updated', () => {
                    fetchDetails(true);
                });
                userChannel.listen('.QuoteAcceptedNotification', () => {
                    fetchDetails(true);
                });
            }

            const qId = (requestDetails as any)?.quote_submitted?.id;
            if (qId) {
                quoteChannel = echo.private(`chat.quote.${qId}`);
                quoteChannel.listen('.quote.updated', () => {
                    fetchDetails(true);
                });
                quoteChannel.listen('quote.updated', () => {
                    fetchDetails(true);
                });
            }
        } catch (e) {
            console.warn('Echo subscribe error in useSubmitQuoteDetails:', e);
        }

        // Periodic background poll if waiting for response (safety fallback)
        const quoteSub = (requestDetails as any)?.quote_submitted;
        const rawStatus = String(requestDetails.status || quoteSub?.status || '').toLowerCase();
        const isTerminal = ['won', 'accepted', 'lost', 'rejected', 'expired'].includes(rawStatus);

        let poller: any = null;
        if (!isTerminal && rawCleanId) {
            poller = setInterval(() => {
                fetchDetails(true);
            }, 8000); // 8s fallback poll while active
        }

        return () => {
            window.removeEventListener('carrierdirect_notif_update', handleRealtimeUpdate);
            window.removeEventListener('carrierdirect_quote_updated', handleRealtimeUpdate);
            window.removeEventListener('quote_accepted', handleRealtimeUpdate);
            window.removeEventListener('order-status-updated', handleRealtimeUpdate);
            if (userChannel) {
                userChannel.stopListening('.quote.updated');
                userChannel.stopListening('quote.updated');
                userChannel.stopListening('.QuoteAcceptedNotification');
            }
            if (quoteChannel) {
                quoteChannel.stopListening('.quote.updated');
                quoteChannel.stopListening('quote.updated');
            }
            if (poller) {
                clearInterval(poller);
            }
        };
    }, [fetchDetails, rawCleanId, (requestDetails as any)?.quote_submitted?.id, requestDetails.status]);

    return {
        loading,
        requestDetails,
        apiData,
        rawId: rawCleanId,
        refetch: fetchDetails,
    };
}
