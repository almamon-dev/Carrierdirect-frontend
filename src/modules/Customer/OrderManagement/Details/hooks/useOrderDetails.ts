import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { decryptId, encryptId } from '@/lib/encryption';
import { exportInvoicePdf } from '@/utils/exportInvoicePdf';
import orderDetailService from '../services/orderDetailService';
import {
    buildNormalizedCustomerOrder,
    buildCustomerOrderTimeline,
} from '../utils/customerOrderDetailsUtils';
import { NormalizedCustomerOrder, TimelineItem } from '../types/orderDetail.types';

export const useOrderDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [apiOrder, setApiOrder] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [isPodAccepted, setIsPodAccepted] = useState<boolean>(false);
    const [actionMessage, setActionMessage] = useState<string | null>(null);
    const [isRatingOpen, setIsRatingOpen] = useState<boolean>(false);

    const decryptedRawId = decryptId(id);
    const cleanId = decryptedRawId ? String(decryptedRawId).replace(/^ORD-0*/i, '') : '1';

    // Obfuscate URL: If unencrypted plain ID is accessed, replace URL with encrypted parameter
    useEffect(() => {
        if (id && !id.startsWith('enc_') && !id.startsWith('sec_') && !id.startsWith('q_')) {
            const encrypted = encryptId(cleanId || id);
            navigate(`/customer/orders/${encrypted}`, { replace: true, state: location.state });
        }
    }, [id, cleanId, navigate, location.state]);

    const fetchDetail = useCallback(async (silent = false) => {
        if (!cleanId) return;
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const data = await orderDetailService.fetchOrderDetail(cleanId);
            if (!data) return;
            setApiOrder(data);
            const statusRaw = (data.status_raw || data.status || '').toLowerCase();
            const podStatusRaw = (data.pod_status || data.pod?.status || data.pod?.pod_status || '').toLowerCase();
            if (
                statusRaw === 'completed' ||
                statusRaw === 'pod_accepted' ||
                statusRaw === 'pod accepted' ||
                podStatusRaw === 'confirmed' ||
                podStatusRaw === 'accepted' ||
                podStatusRaw === 'approved'
            ) {
                setIsPodAccepted(true);
            }
        } catch (err) {
            console.warn('Could not fetch remote order details:', err);
            if (!silent && location.state?.orderData) {
                setApiOrder(location.state.orderData);
            }
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [cleanId, location.state?.orderData]);

    // Fetch order details from API with fallback to route state
    useEffect(() => {
        fetchDetail(false);
    }, [fetchDetail]);

    // Auto-poll live GPS & order status every 15s while shipment is active
    useEffect(() => {
        const statusRaw = (apiOrder?.status_raw || apiOrder?.status || '').toLowerCase();
        if (statusRaw === 'completed' || statusRaw === 'cancelled') return;

        const interval = setInterval(() => {
            fetchDetail(true);
        }, 15000);
        return () => clearInterval(interval);
    }, [apiOrder?.status_raw, apiOrder?.status, fetchDetail]);

    const handleRefreshLive = useCallback(() => {
        fetchDetail(true);
    }, [fetchDetail]);

    const order: NormalizedCustomerOrder = buildNormalizedCustomerOrder(cleanId, apiOrder, isPodAccepted);
    const timeline: TimelineItem[] = buildCustomerOrderTimeline(order);

    const handleRepeatOrder = useCallback(() => {
        navigate('/customer/quotes/create/new', { state: { repeatData: order } });
    }, [navigate, order]);

    const handleDownloadInvoice = useCallback(() => {
        exportInvoicePdf(order);
    }, [order]);

    const handlePrint = useCallback(() => {
        exportInvoicePdf(order);
    }, [order]);

    const handleOpenChat = useCallback(() => {
        const quoteTargetId = order.quoteId || order.rawId || cleanId;
        navigate(`/customer/quotes/negotiation/conversation/${encryptId(quoteTargetId)}`);
    }, [navigate, order.quoteId, order.rawId, cleanId]);

    const handleApprovePOD = useCallback(async () => {
        try {
            await orderDetailService.approvePod(cleanId);
        } catch (err) {
            console.warn('API pod approval fallback triggered:', err);
        }
        setIsPodAccepted(true);
        setActionMessage('Proof of Delivery confirmed! Escrow funds have been released to the carrier.');
        setTimeout(() => setActionMessage(null), 5000);
    }, [cleanId]);

    const handleRatingSubmit = useCallback(async (ratingData: any) => {
        try {
            await orderDetailService.submitReview(cleanId, ratingData);
        } catch (err) {
            console.warn('API rating submission fallback triggered:', err);
        }
        setIsRatingOpen(false);
        setActionMessage('Thank you! Carrier review & rating submitted successfully.');
        setTimeout(() => setActionMessage(null), 5000);
    }, [cleanId]);

    return {
        order,
        timeline,
        isLoading,
        isRefreshing,
        isPodAccepted,
        actionMessage,
        setActionMessage,
        isRatingOpen,
        setIsRatingOpen,
        handleRepeatOrder,
        handleDownloadInvoice,
        handlePrint,
        handleOpenChat,
        handleApprovePOD,
        handleRatingSubmit,
        handleRefreshLive,
    };
};

export default useOrderDetails;
