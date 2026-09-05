import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';

export function useCustomerQuotesReceived() {
    const showToast = useToastStore((state) => state.showToast);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [rejectModalQuote, setRejectModalQuote] = useState<any>(null);

    const fetchQuotes = async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setLoading(true);

        try {
            const endpoint = ENDPOINTS.CUSTOMER.QUOTES || '/customer/quotes';
            const response = await apiClient.get(endpoint);
            const rawData = response?.data?.data;
            const list = Array.isArray(rawData)
                ? rawData
                : (rawData?.data || rawData?.quotes || response?.data?.quotes || []);

            const cleanList = Array.isArray(list) ? list : [];
            setQuotes(cleanList);
            if (isManualRefresh) {
                showToast('Quotes refreshed successfully', 'success');
            }
        } catch (error: any) {
            console.error('Failed to fetch received quotes:', error);
            try {
                const altRes = await apiClient.get('/customer/received-quotes');
                const altData = altRes?.data?.data;
                const altList = Array.isArray(altData) ? altData : (altData?.data || []);
                setQuotes(Array.isArray(altList) ? altList : []);
            } catch {
                setQuotes([]);
            }
        } finally {
            setLoading(false);
            if (isManualRefresh) {
                setTimeout(() => setIsRefreshing(false), 300);
            }
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const handleAccept = async (quoteId: number) => {
        setActionLoading(quoteId);
        try {
            await apiClient.post(`/customer/quotes/${quoteId}/accept`);
            showToast('Quote accepted! Order created successfully.', 'success');
            window.dispatchEvent(new CustomEvent('carrierdirect_notif_update'));
            await fetchQuotes();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || 'Failed to accept quote.';
            showToast(msg, 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleConfirmReject = async (reason: string) => {
        if (!rejectModalQuote) return;
        setActionLoading(rejectModalQuote.id);
        try {
            await apiClient.post(`/customer/quotes/${rejectModalQuote.id}/reject`, { reason });
            showToast('Quote rejected.', 'info');
            window.dispatchEvent(new CustomEvent('carrierdirect_notif_update'));
            await fetchQuotes();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || 'Failed to reject quote.';
            showToast(msg, 'error');
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
