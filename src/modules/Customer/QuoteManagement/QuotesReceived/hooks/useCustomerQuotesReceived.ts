import { useState, useEffect, useCallback } from "react";
import { echo } from '@/lib/echo';
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";
import { ENDPOINTS } from "@/config/api";
import { useToastStore } from "@/stores/useToastStore";
import { encryptId } from "@/lib/encryption";
import { normalizeQuoteItem } from "../utils/quotesReceivedHelpers";

export { normalizeQuoteItem };

export function useCustomerQuotesReceived() {
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [rejectModalQuote, setRejectModalQuote] = useState<any>(null);

    const fetchQuotes = useCallback(async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setLoading(true);

        try {
            const endpoint = ENDPOINTS.CUSTOMER.QUOTES || "/customer/quotes";
            const [quotesRes, negotRes] = await Promise.allSettled([
                apiClient.get(endpoint),
                apiClient.get('/customer/negotiations').catch(() => apiClient.get('/negotiations')),
            ]);

            const allItems: any[] = [];
            const seenIds = new Set<string | number>();

            const processList = (raw: any) => {
                const list = Array.isArray(raw)
                    ? raw
                    : (raw?.data?.data?.negotiations?.data ||
                       raw?.data?.data?.negotiations ||
                       raw?.data?.negotiations?.data ||
                       raw?.data?.negotiations ||
                       raw?.data?.data ||
                       raw?.data?.quotes ||
                       raw?.data ||
                       []);
                if (Array.isArray(list)) {
                    list.forEach((item) => {
                        const uniqueKey = item?.id || item?.quote_id || item?.rawId;
                        if (uniqueKey && !seenIds.has(uniqueKey)) {
                            seenIds.add(uniqueKey);
                            allItems.push(normalizeQuoteItem(item));
                        }
                    });
                }
            };

            if (quotesRes.status === 'fulfilled') {
                processList(quotesRes.value);
            }
            if (negotRes.status === 'fulfilled') {
                processList(negotRes.value);
            }

            setQuotes(allItems);
            if (isManualRefresh) {
                showToast("Quotes refreshed successfully", "success");
            }
        } catch (error: any) {
            console.error("Failed to fetch received quotes:", error);
            try {
                const altRes = await apiClient.get("/customer/received-quotes");
                const altData = altRes?.data?.data;
                const altList = Array.isArray(altData) ? altData : (altData?.data || []);
                const mapped = (Array.isArray(altList) ? altList : []).map(normalizeQuoteItem);
                setQuotes(mapped);
            } catch {
                setQuotes([]);
            }
        } finally {
            setLoading(false);
            if (isManualRefresh) {
                setTimeout(() => setIsRefreshing(false), 300);
            }
        }
    }, [showToast]);

    useEffect(() => {
        fetchQuotes();

        const handleRealtimeUpdate = () => {
            fetchQuotes();
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
                    fetchQuotes();
                });
                userChannel.listen('.quote.updated', () => {
                    fetchQuotes();
                });
                userChannel.listen('quote.updated', () => {
                    fetchQuotes();
                });
            }
        } catch (e) {
            console.warn('Echo direct subscribe error in useCustomerQuotesReceived:', e);
        }

        return () => {
            window.removeEventListener('carrierdirect_notif_update', handleRealtimeUpdate);
            window.removeEventListener('carrierdirect_quote_updated', handleRealtimeUpdate);
            if (userChannel) {
                userChannel.stopListening('.quote.updated');
                userChannel.stopListening('quote.updated');
            }
        };
    }, [fetchQuotes]);

    const handleAccept = (quoteId: number, quoteObj?: any) => {
        const foundQuote = quoteObj || quotes.find((q) => q.id === quoteId || q.rawId === quoteId);
        navigate(`/customer/quotes/received/checkout/${encryptId(quoteId)}`, {
            state: { quote: foundQuote }
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
            await fetchQuotes();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || "Failed to reject quote.";
            showToast(msg, "error");
        } finally {
            setActionLoading(null);
            setRejectModalQuote(null);
        }
    };

    return {
        quotes,
        loading,
        isRefreshing,
        actionLoading,
        rejectModalQuote,
        setRejectModalQuote,
        fetchQuotes,
        handleAccept,
        handleConfirmReject,
    };
}
