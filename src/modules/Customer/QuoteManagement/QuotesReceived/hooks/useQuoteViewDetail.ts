import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { useToastStore } from '@/stores/useToastStore';
import { decryptId, encryptId } from '@/lib/encryption';
import { QuoteData, ExtraCharge } from '../types/quoteViewDetailTypes';

export { type QuoteData, type ExtraCharge } from '../types/quoteViewDetailTypes';

export function useQuoteViewDetail(quoteId?: string, requestId?: string) {
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quote, setQuote] = useState<QuoteData | null>(null);
    const [requestDetail, setRequestDetail] = useState<any | null>(null);
    const [siblingQuotes, setSiblingQuotes] = useState<QuoteData[]>([]);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);

    const rawDecryptedQuote = quoteId ? decryptId(quoteId) : '';
    const cleanQuoteId = rawDecryptedQuote.replace(/[^0-9]/g, '') || rawDecryptedQuote;

    const rawDecryptedReq = requestId ? decryptId(requestId) : '';
    const cleanReqId = rawDecryptedReq.replace(/[^0-9]/g, '') || rawDecryptedReq;

    useEffect(() => {
        const fetchQuoteDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                if (cleanQuoteId) {
                    const res = await apiClient.get(`/customer/quotes/${cleanQuoteId}`);
                    const qData: QuoteData = res.data?.data || res.data?.quote || res.data;
                    setQuote(qData);
                    const reqObj = qData?.quote_request;
                    if (reqObj) setRequestDetail(reqObj);

                    const targetReqId = qData?.quote_request_id || reqObj?.id;
                    if (targetReqId) {
                        try {
                            const sibRes = await apiClient.get(ENDPOINTS.CUSTOMER.REQUEST_QUOTES(targetReqId));
                            const sibList = sibRes.data?.data?.quotes_request || sibRes.data?.quotes_request || [];
                            setSiblingQuotes(sibList);
                            if (!reqObj && sibRes.data?.data?.quote_details) {
                                setRequestDetail(sibRes.data.data.quote_details);
                            }
                        } catch {}
                    }
                } else if (cleanReqId) {
                    const res = await apiClient.get(ENDPOINTS.CUSTOMER.REQUEST_QUOTES(cleanReqId));
                    const data = res.data?.data || res.data;
                    const quotesList: QuoteData[] = data?.quotes_request || [];
                    setSiblingQuotes(quotesList);
                    setRequestDetail(data?.quote_details || null);
                    setQuote(quotesList[0] || null);
                }
            } catch (err: any) {
                console.error('Failed to load quote details:', err);
                if (cleanQuoteId) {
                    try {
                        const fallbackRes = await apiClient.get(ENDPOINTS.CUSTOMER.REQUEST_QUOTES(cleanQuoteId));
                        const data = fallbackRes.data?.data || fallbackRes.data;
                        const quotesList: QuoteData[] = data?.quotes_request || [];
                        if (quotesList.length > 0) {
                            setSiblingQuotes(quotesList);
                            setRequestDetail(data?.quote_details || null);
                            setQuote(quotesList[0]);
                            setLoading(false);
                            return;
                        }
                    } catch {}
                }
                setError('Unable to load quote details. The quote may not exist or has been removed.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuoteDetail();
    }, [cleanQuoteId, cleanReqId]);

    const handleAcceptQuote = async () => {
        if (!quote) return;
        setIsAccepting(true);
        try {
            await apiClient.post(`/customer/quotes/${quote.id}/accept`);
            showToast('Quote accepted! Order booked successfully.', 'success');
            navigate('/customer/orders');
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || 'Failed to accept quote.';
            showToast(msg, 'error');
        } finally {
            setIsAccepting(false);
        }
    };

    const handleRejectQuote = async (reason: string) => {
        if (!quote) return;
        try {
            await apiClient.post(`/customer/quotes/${quote.id}/reject`, { reason });
            showToast('Quote rejected.', 'info');
            setIsRejectModalOpen(false);
            navigate('/customer/quotes/received');
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || 'Failed to reject quote.';
            showToast(msg, 'error');
        }
    };

    return {
        loading,
        error,
        quote,
        setQuote,
        requestDetail,
        siblingQuotes,
        isRejectModalOpen,
        setIsRejectModalOpen,
        isAccepting,
        handleAcceptQuote,
        handleRejectQuote,
    };
}
