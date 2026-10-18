import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { encryptId } from '@/lib/encryption';
import { useToastStore } from '@/stores/useToastStore';
import { computeTrackTabCounts, filterAndSortBids } from '../utils/trackBidsFilterUtils';

export function useTrackBids(cleanId: string) {
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);

    const [quotes, setQuotes] = useState<any[]>([]);
    const [quoteRequestDetails, setQuoteRequestDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Filters & Tabs state
    const [activeTab, setActiveTab] = useState<'all' | 'new' | 'negotiation' | 'accepted' | 'rejected'>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [vehicleFilter, setVehicleFilter] = useState<string>('all');
    const [ratingFilter, setRatingFilter] = useState<string>('all');
    const [filterMode, setFilterMode] = useState<string>('lowest_price');

    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [rejectModalQuote, setRejectModalQuote] = useState<any>(null);

    const handleResetFilters = useCallback(() => {
        setStatusFilter('all');
        setVehicleFilter('all');
        setRatingFilter('all');
        setFilterMode('lowest_price');
    }, []);

    const fetchBids = useCallback(async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            if (cleanId) {
                let foundList: any[] = [];
                let foundDetails: any = null;

                try {
                    const res = await apiClient.get(ENDPOINTS.CUSTOMER.REQUEST_QUOTES(cleanId));
                    const list = res.data?.data?.quotes_request || res.data?.quotes_request || res.data?.data || [];
                    const details = res.data?.data?.quote_details || res.data?.quote_details || null;
                    if (details) foundDetails = details;
                    if (Array.isArray(list)) foundList = list;
                } catch (err) {
                    console.warn('Direct request quotes call failed:', err);
                }

                if (!foundDetails) {
                    try {
                        const reqRes = await apiClient.get(ENDPOINTS.CUSTOMER.QUOTE_REQUEST_DETAIL(cleanId));
                        foundDetails = reqRes.data?.data || reqRes.data || null;
                    } catch {}
                }

                if (foundList.length === 0) {
                    try {
                        const resAll = await apiClient.get(ENDPOINTS.CUSTOMER.QUOTES || '/customer/quotes');
                        const allList = resAll.data?.data?.data || resAll.data?.data || resAll.data?.quotes || [];
                        if (Array.isArray(allList)) {
                            foundList = allList.filter((item: any) => 
                                String(item.quote_request_id || item.request_id || item.quote_request?.id) === String(cleanId)
                            );
                        }
                    } catch {}
                }

                setQuotes(foundList);
                setQuoteRequestDetails(foundDetails);
            } else {
                const res = await apiClient.get(ENDPOINTS.CUSTOMER.QUOTES || '/customer/quotes');
                const quotesList = res.data?.data?.data || res.data?.data || res.data?.quotes || [];
                setQuotes(Array.isArray(quotesList) ? quotesList : []);
            }

            if (isManualRefresh) {
                showToast("Offers refreshed successfully", "success");
            }
        } catch (error) {
            console.error('Failed to fetch bids:', error);
            setQuotes([]);
        } finally {
            setIsLoading(false);
            if (isManualRefresh) {
                setTimeout(() => setIsRefreshing(false), 300);
            }
        }
    }, [cleanId, showToast]);

    useEffect(() => {
        fetchBids();
    }, [fetchBids]);

    const handleAccept = (quoteId: number, quoteObj?: any) => {
        const found = quoteObj || quotes.find(q => (q.rawId || q.id) === quoteId);
        navigate(`/customer/quotes/received/checkout/${encryptId(quoteId)}`, {
            state: { quote: found }
        });
    };

    const handleConfirmReject = async (reason: string) => {
        if (!rejectModalQuote) return;
        const targetId = rejectModalQuote.rawId || rejectModalQuote.id;
        setActionLoading(targetId);
        try {
            await apiClient.post(`/customer/quotes/${targetId}/reject`, { reason });
            showToast("Quote rejected.", "info");
            window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
            await fetchBids();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || "Failed to reject quote.";
            showToast(msg, "error");
        } finally {
            setActionLoading(null);
            setRejectModalQuote(null);
        }
    };

    const tabCounts = useMemo(() => computeTrackTabCounts(quotes), [quotes]);

    const filteredAndSortedQuotes = useMemo(() => {
        return filterAndSortBids({
            quotes,
            activeTab,
            statusFilter,
            vehicleFilter,
            ratingFilter,
            filterMode,
            quoteRequestDetails,
        });
    }, [quotes, activeTab, statusFilter, vehicleFilter, ratingFilter, filterMode, quoteRequestDetails]);

    return {
        quotes,
        quoteRequestDetails,
        isLoading,
        isRefreshing,
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        vehicleFilter,
        setVehicleFilter,
        ratingFilter,
        setRatingFilter,
        filterMode,
        setFilterMode,
        actionLoading,
        rejectModalQuote,
        setRejectModalQuote,
        handleResetFilters,
        fetchBids,
        handleAccept,
        handleConfirmReject,
        tabCounts,
        filteredAndSortedQuotes,
    };
}
