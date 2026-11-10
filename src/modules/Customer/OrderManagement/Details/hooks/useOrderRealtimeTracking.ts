import { useEffect, useRef, useState } from 'react';
import echo from '@/lib/echo';

export interface DriverLocationBroadcastPayload {
    order_id: number;
    driver_id: number;
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    speed?: number | null;
    heading?: number | null;
    recorded_at: string;
    shipment_status?: string;
}

export interface ShipmentStatusBroadcastPayload {
    order_id: number;
    order_number?: string;
    status: string;
    pod_status?: string;
    message?: string;
    timestamp?: string;
}

export const TERMINAL_OR_INACTIVE_TRACKING_STATUSES = new Set([
    'delivered',
    'pod_uploaded',
    'pod_review',
    'pod_accepted',
    'completed',
    'cancelled',
]);

export const isShipmentStatusEligibleForLiveTracking = (rawStatus?: string | null): boolean => {
    const s = String(rawStatus || '').toLowerCase().trim();
    if (!s) return false;
    return !TERMINAL_OR_INACTIVE_TRACKING_STATUSES.has(s);
};

export const normalizeTrackingChannelOrderId = (orderId?: string | number | null): string | null => {
    if (orderId === null || orderId === undefined || orderId === '') return null;
    const str = String(orderId).trim();
    if (/^\d+$/.test(str)) return str;
    const stripped = str.replace(/^ORD-(?:\d{4}-)?0*/i, '');
    return /^\d+$/.test(stripped) ? stripped : null;
};

export interface RealtimeSubscriptionCallbacks {
    onLocationUpdate: (payload: DriverLocationBroadcastPayload) => void;
    onStatusUpdate?: (payload: ShipmentStatusBroadcastPayload) => void;
    onResyncRequired: () => void;
    onConnectionChange?: (state: { isWsConnected: boolean; isChannelSubscribed: boolean }) => void;
}

export interface RealtimeSubscriptionOptions extends RealtimeSubscriptionCallbacks {
    orderId?: string | number | null;
    rawStatus?: string | null;
    fallbackPollIntervalMs?: number;
    echoClient?: any;
}

/**
 * Core Reverb WebSocket subscription + fallback polling controller used by `useOrderRealtimeTracking`.
 */
export const createRealtimeTrackingSubscription = ({
    orderId,
    rawStatus,
    onLocationUpdate,
    onStatusUpdate,
    onResyncRequired,
    onConnectionChange,
    fallbackPollIntervalMs = 20000,
    echoClient = echo,
}: RealtimeSubscriptionOptions) => {
    const cleanNumericOrderId = normalizeTrackingChannelOrderId(orderId);
    const isEligible = Boolean(
        cleanNumericOrderId && isShipmentStatusEligibleForLiveTracking(rawStatus)
    );

    let isWsConnected = false;
    let isChannelSubscribed = false;
    let hadDisconnected = false;
    let lastAcceptedTimestamp = 0;
    let disposed = false;
    let fallbackTimer: ReturnType<typeof setInterval> | null = null;
    let pusherConn: any = null;
    let privateChannel: any = null;

    const channelName = cleanNumericOrderId ? `orders.${cleanNumericOrderId}.tracking` : null;

    const notifyState = () => {
        if (!disposed && onConnectionChange) {
            onConnectionChange({ isWsConnected, isChannelSubscribed });
        }
    };

    const stopFallbackPolling = () => {
        if (fallbackTimer !== null) {
            clearInterval(fallbackTimer);
            fallbackTimer = null;
        }
    };

    const syncFallbackPolling = () => {
        if (disposed || !isEligible) {
            stopFallbackPolling();
            return;
        }
        // Do NOT poll when WebSocket connection and private channel subscription are healthy
        if (isWsConnected && isChannelSubscribed) {
            stopFallbackPolling();
            return;
        }
        if (fallbackTimer === null) {
            fallbackTimer = setInterval(() => {
                if (typeof document === 'undefined' || !document.hidden) {
                    onResyncRequired();
                }
            }, fallbackPollIntervalMs);
        }
    };

    const handleConnected = () => {
        if (disposed) return;
        isWsConnected = true;
        if (hadDisconnected) {
            hadDisconnected = false;
            onResyncRequired();
        }
        syncFallbackPolling();
        notifyState();
    };

    const handleDisconnected = () => {
        if (disposed) return;
        isWsConnected = false;
        isChannelSubscribed = false;
        hadDisconnected = true;
        syncFallbackPolling();
        notifyState();
    };

    const handleVisibility = () => {
        if (!disposed && isEligible && !(isWsConnected && isChannelSubscribed)) {
            if (typeof document !== 'undefined' && !document.hidden) {
                onResyncRequired();
            }
        }
    };

    if (isEligible && channelName && echoClient) {
        try {
            pusherConn = echoClient?.connector?.pusher?.connection;
            if (pusherConn) {
                isWsConnected = pusherConn.state === 'connected';
                pusherConn.bind('connected', handleConnected);
                pusherConn.bind('disconnected', handleDisconnected);
                pusherConn.bind('unavailable', handleDisconnected);
                pusherConn.bind('failed', handleDisconnected);
                pusherConn.bind('error', handleDisconnected);
            }

            privateChannel = echoClient.private(channelName);

            if (privateChannel?.subscription) {
                privateChannel.subscription.bind('pusher:subscription_succeeded', () => {
                    if (disposed) return;
                    isChannelSubscribed = true;
                    isWsConnected = true;
                    syncFallbackPolling();
                    notifyState();
                });
                privateChannel.subscription.bind('pusher:subscription_error', () => {
                    if (disposed) return;
                    isChannelSubscribed = false;
                    hadDisconnected = true;
                    syncFallbackPolling();
                    notifyState();
                });
            }

            privateChannel.listen(
                '.DriverLocationUpdated',
                (payload: DriverLocationBroadcastPayload) => {
                    if (
                        disposed ||
                        !payload ||
                        typeof payload.latitude !== 'number' ||
                        typeof payload.longitude !== 'number'
                    ) {
                        return;
                    }
                    if (String(payload.order_id) !== String(cleanNumericOrderId)) {
                        return;
                    }
                    // Reject out-of-order stale broadcast packets
                    if (payload.recorded_at) {
                        const ts = new Date(payload.recorded_at).getTime();
                        if (!isNaN(ts)) {
                            if (ts < lastAcceptedTimestamp) {
                                return;
                            }
                            lastAcceptedTimestamp = ts;
                        }
                    }
                    onLocationUpdate(payload);
                }
            );

            privateChannel.listen(
                '.ShipmentStatusUpdated',
                (payload: ShipmentStatusBroadcastPayload) => {
                    if (disposed) return;
                    if (onStatusUpdate) {
                        onStatusUpdate(payload);
                    } else {
                        onResyncRequired();
                    }
                }
            );
        } catch (err) {
            console.warn('Reverb tracking channel subscription warning:', err);
            isChannelSubscribed = false;
        }

        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', handleVisibility);
        }

        syncFallbackPolling();
        notifyState();
    } else {
        notifyState();
    }

    const dispose = () => {
        if (disposed) return;
        disposed = true;
        stopFallbackPolling();
        if (typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', handleVisibility);
        }
        try {
            if (pusherConn) {
                pusherConn.unbind('connected', handleConnected);
                pusherConn.unbind('disconnected', handleDisconnected);
                pusherConn.unbind('unavailable', handleDisconnected);
                pusherConn.unbind('failed', handleDisconnected);
                pusherConn.unbind('error', handleDisconnected);
            }
            if (privateChannel) {
                privateChannel.stopListening('.DriverLocationUpdated');
                privateChannel.stopListening('.ShipmentStatusUpdated');
            }
            if (channelName && echoClient) {
                echoClient.leave(channelName);
            }
        } catch (_) {
            // Ignore cleanup errors on unmount
        }
    };

    return {
        channelName: isEligible ? channelName : null,
        isEligible,
        isPollingFallback: () => fallbackTimer !== null,
        dispose,
    };
};

interface UseOrderRealtimeTrackingOptions {
    orderId?: string | number | null;
    rawStatus?: string | null;
    onLocationUpdate: (payload: DriverLocationBroadcastPayload) => void;
    onStatusUpdate?: (payload: ShipmentStatusBroadcastPayload) => void;
    onResyncRequired: () => void;
    fallbackPollIntervalMs?: number;
    echoClient?: any;
}

/**
 * Centralized Laravel Reverb + Echo private channel hook (`orders.{orderId}.tracking`)
 * with automatic reconnection sync and REST fallback polling ONLY when WebSocket is unavailable.
 */
export const useOrderRealtimeTracking = ({
    orderId,
    rawStatus,
    onLocationUpdate,
    onStatusUpdate,
    onResyncRequired,
    fallbackPollIntervalMs = 20000,
    echoClient = echo,
}: UseOrderRealtimeTrackingOptions) => {
    const [connState, setConnState] = useState<{
        isWsConnected: boolean;
        isChannelSubscribed: boolean;
    }>({
        isWsConnected: false,
        isChannelSubscribed: false,
    });

    const onLocationRef = useRef(onLocationUpdate);
    const onStatusRef = useRef(onStatusUpdate);
    const onResyncRef = useRef(onResyncRequired);
    const activeChannelKeyRef = useRef<string | null>(null);

    onLocationRef.current = onLocationUpdate;
    onStatusRef.current = onStatusUpdate;
    onResyncRef.current = onResyncRequired;

    const cleanNumericOrderId = normalizeTrackingChannelOrderId(orderId);
    const isEligible = Boolean(
        cleanNumericOrderId && isShipmentStatusEligibleForLiveTracking(rawStatus)
    );

    useEffect(() => {
        if (!isEligible || !cleanNumericOrderId) {
            setConnState({ isWsConnected: false, isChannelSubscribed: false });
            return;
        }

        const subKey = `orders.${cleanNumericOrderId}.tracking:${fallbackPollIntervalMs}`;
        if (activeChannelKeyRef.current === subKey) {
            return;
        }
        activeChannelKeyRef.current = subKey;

        const subscription = createRealtimeTrackingSubscription({
            orderId: cleanNumericOrderId,
            rawStatus,
            fallbackPollIntervalMs,
            echoClient,
            onLocationUpdate: (payload) => onLocationRef.current(payload),
            onStatusUpdate: (payload) => {
                if (onStatusRef.current) {
                    onStatusRef.current(payload);
                } else {
                    onResyncRef.current();
                }
            },
            onResyncRequired: () => onResyncRef.current(),
            onConnectionChange: (next) => setConnState(next),
        });

        return () => {
            activeChannelKeyRef.current = null;
            subscription.dispose();
        };
    }, [isEligible, cleanNumericOrderId, fallbackPollIntervalMs, echoClient]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        isWsConnected: connState.isWsConnected && connState.isChannelSubscribed,
        isTrackingActive: isEligible,
    };
};

export default useOrderRealtimeTracking;
