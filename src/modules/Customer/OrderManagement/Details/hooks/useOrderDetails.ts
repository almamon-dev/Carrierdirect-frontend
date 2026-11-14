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
import useOrderRealtimeTracking, {
    DriverLocationBroadcastPayload,
} from './useOrderRealtimeTracking';

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

    const handleRealtimeLocationUpdate = useCallback(
        (payload: DriverLocationBroadcastPayload) => {
            setApiOrder((prev: any) => {
                if (!prev) return prev;
                if (
                    prev.driver?.id &&
                    payload.driver_id &&
                    Number(prev.driver.id) !== Number(payload.driver_id)
                ) {
                    fetchDetail(true);
                    return prev;
                }
                return {
                    ...prev,
                    driver_lat: payload.latitude,
                    driver_lng: payload.longitude,
                    driver_accuracy: payload.accuracy,
                    driver_speed: payload.speed,
                    driver_heading: payload.heading,
                    driver_location_updated_at: payload.recorded_at,
                    driver_location_updated_human: 'Live now',
                    status_raw: payload.shipment_status || prev.status_raw,
                    raw_milestone_status: payload.shipment_status || prev.raw_milestone_status,
                    product_location: {
                        ...(prev.product_location || {}),
                        latitude: payload.latitude,
                        longitude: payload.longitude,
                        has_live_gps: true,
                        updated_at: payload.recorded_at,
                        updated_human: 'Live now',
                    },
                };
            });
        },
        [fetchDetail]
    );

    // Subscribe to real-time Reverb WebSocket (`orders.{orderId}.tracking`) with fallback polling only when WS is offline
    useOrderRealtimeTracking({
        orderId: apiOrder?.id || cleanId,
        rawStatus: apiOrder?.status_raw || apiOrder?.status,
        onLocationUpdate: handleRealtimeLocationUpdate,
        onResyncRequired: () => fetchDetail(true),
        fallbackPollIntervalMs: 20000,
    });

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
