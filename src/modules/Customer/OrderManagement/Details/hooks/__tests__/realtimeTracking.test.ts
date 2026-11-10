import test from 'node:test';
import assert from 'node:assert/strict';

import {
    createRealtimeTrackingSubscription,
    DriverLocationBroadcastPayload,
    isShipmentStatusEligibleForLiveTracking,
    normalizeTrackingChannelOrderId,
} from '../useOrderRealtimeTracking';
import {
    resolveDriverTrackingStage,
    shouldRecalculateDynamicEta,
} from '../useCustomerOrderMap';
import { buildNormalizedCustomerOrder } from '../../utils/customerOrderDetailsUtils';
import { computeTrackingDisplayMetrics } from '../../../TrackOrder/utils/trackingViewUtils';

class FakeEchoEnvironment {
    public connectionState: string = 'connected';
    public subscribedChannels: string[] = [];
    public leftChannels: string[] = [];
    public stoppedEvents: string[] = [];

    private connListeners = new Map<string, Set<(...args: any[]) => void>>();
    private subListeners = new Map<string, Set<(...args: any[]) => void>>();
    private eventListeners = new Map<string, (...args: any[]) => void>();

    public get echoClient() {
        const self = this;
        return {
            connector: {
                pusher: {
                    connection: {
                        get state() {
                            return self.connectionState;
                        },
                        bind(event: string, fn: (...args: any[]) => void) {
                            if (!self.connListeners.has(event)) {
                                self.connListeners.set(event, new Set());
                            }
                            self.connListeners.get(event)!.add(fn);
                        },
                        unbind(event: string, fn: (...args: any[]) => void) {
                            self.connListeners.get(event)?.delete(fn);
                        },
                    },
                },
            },
            private(channelName: string) {
                self.subscribedChannels.push(channelName);
                const channelObj = {
                    subscription: {
                        bind(event: string, fn: (...args: any[]) => void) {
                            if (!self.subListeners.has(event)) {
                                self.subListeners.set(event, new Set());
                            }
                            self.subListeners.get(event)!.add(fn);
                        },
                    },
                    listen(eventName: string, cb: (...args: any[]) => void) {
                        self.eventListeners.set(eventName, cb);
                        return channelObj;
                    },
                    stopListening(eventName: string) {
                        self.stoppedEvents.push(eventName);
                        self.eventListeners.delete(eventName);
                        return channelObj;
                    },
                };
                return channelObj;
            },
            leave(channelName: string) {
                self.leftChannels.push(channelName);
            },
        };
    }

    public emitSubscriptionSucceeded() {
        this.subListeners.get('pusher:subscription_succeeded')?.forEach((fn) => fn());
    }

    public emitConnectionEvent(event: string, nextState: string) {
        this.connectionState = nextState;
        this.connListeners.get(event)?.forEach((fn) => fn());
    }

    public emitBroadcast(eventName: string, payload: any) {
        const handler = this.eventListeners.get(eventName);
        if (handler) handler(payload);
    }

    public connectionListenerCount(event: string): number {
        return this.connListeners.get(event)?.size ?? 0;
    }
}

test('1. Initial location loading hydrates persisted shipment and driver GPS coordinates', () => {
    const apiOrder = {
        id: 106,
        order_number: 'ORD-2026-10006',
        status_raw: 'in_transit',
        status: 'In Transit',
        pickup_address: 'Dhaka Airport Cargo Terminal, Dhaka (23.8433, 90.3978)',
        delivery_address: 'Progati Sarani Rd, Dhaka (23.8103, 90.4225)',
        driver_lat: 23.8255,
        driver_lng: 90.4122,
        driver_location_updated_at: new Date().toISOString(),
        driver_location_updated_human: '12s ago',
        driver: {
            id: 42,
            name: 'Rahim Uddin',
            vehicle_plate: 'DHAKA-METRO-TA-11-2233',
        },
        distance_km: 18,
    };

    const normalized = buildNormalizedCustomerOrder('106', apiOrder);
    assert.equal(normalized.driverLat, 23.8255);
    assert.equal(normalized.driverLng, 90.4122);

    const metrics = computeTrackingDisplayMetrics(normalized, [], '18 km', '24m');
    assert.equal(metrics.hasLiveGps, true);
    assert.equal(metrics.isGpsFresh, true);
    assert.equal(metrics.trackingStage, 'in_transit');
});

test('2. WebSocket subscription binds private channel orders.{orderId}.tracking', () => {
    const env = new FakeEchoEnvironment();
    let connState = { isWsConnected: false, isChannelSubscribed: false };

    const sub = createRealtimeTrackingSubscription({
        orderId: 'ORD-2026-00106',
        rawStatus: 'in_transit',
        echoClient: env.echoClient,
        onLocationUpdate: () => {},
        onResyncRequired: () => {},
        onConnectionChange: (s) => {
            connState = s;
        },
    });

    assert.equal(normalizeTrackingChannelOrderId('ORD-2026-00106'), '106');
    assert.equal(sub.channelName, 'orders.106.tracking');
    assert.deepEqual(env.subscribedChannels, ['orders.106.tracking']);

    env.emitSubscriptionSucceeded();
    assert.equal(connState.isWsConnected, true);
    assert.equal(connState.isChannelSubscribed, true);
    assert.equal(sub.isPollingFallback(), false);

    sub.dispose();
});

test('3. Real-time marker updates accept newer packets, reject stale packets, and throttle ETA recalculation', () => {
    const env = new FakeEchoEnvironment();
    const acceptedPayloads: DriverLocationBroadcastPayload[] = [];

    const sub = createRealtimeTrackingSubscription({
        orderId: 106,
        rawStatus: 'in_transit',
        echoClient: env.echoClient,
        onLocationUpdate: (p) => acceptedPayloads.push(p),
        onResyncRequired: () => {},
    });
    env.emitSubscriptionSucceeded();

    // Newer live location packet -> accepted
    env.emitBroadcast('.DriverLocationUpdated', {
        order_id: 106,
        driver_id: 42,
        latitude: 23.821,
        longitude: 90.415,
        accuracy: 7.5,
        speed: 40,
        heading: 165,
        recorded_at: '2026-11-08T15:10:20Z',
        shipment_status: 'in_transit',
    });

    // Out-of-order stale packet -> rejected
    env.emitBroadcast('.DriverLocationUpdated', {
        order_id: 106,
        driver_id: 42,
        latitude: 23.79,
        longitude: 90.39,
        recorded_at: '2026-11-08T15:08:00Z',
        shipment_status: 'in_transit',
    });

    // Packet for different order -> rejected
    env.emitBroadcast('.DriverLocationUpdated', {
        order_id: 999,
        driver_id: 42,
        latitude: 23.83,
        longitude: 90.42,
        recorded_at: '2026-11-08T15:11:00Z',
    });

    assert.equal(acceptedPayloads.length, 1);
    assert.equal(acceptedPayloads[0].latitude, 23.821);

    // Throttled ETA check: small movement (< 300m) or short elapsed time (< 45s) does NOT trigger routing API
    const t0 = 1_700_000_000_000;
    assert.equal(
        shouldRecalculateDynamicEta({
            currentPos: [23.821, 90.415],
            lastCalcPos: null,
            lastCalcTimeMs: 0,
            nowMs: t0,
            lastStage: null,
            currentStage: 'in_transit',
        }),
        true
    );
    assert.equal(
        shouldRecalculateDynamicEta({
            currentPos: [23.8212, 90.4151], // ~25m movement
            lastCalcPos: [23.821, 90.415],
            lastCalcTimeMs: t0,
            nowMs: t0 + 60_000,
            lastStage: 'in_transit',
            currentStage: 'in_transit',
        }),
        false
    );
    assert.equal(
        shouldRecalculateDynamicEta({
            currentPos: [23.83, 90.425], // > 1 km movement after 50s
            lastCalcPos: [23.821, 90.415],
            lastCalcTimeMs: t0,
            nowMs: t0 + 50_000,
            lastStage: 'in_transit',
            currentStage: 'in_transit',
        }),
        true
    );

    sub.dispose();
});

test('4. WebSocket reconnection fetches latest persisted location from REST API', () => {
    const env = new FakeEchoEnvironment();
    let resyncCount = 0;

    const sub = createRealtimeTrackingSubscription({
        orderId: 106,
        rawStatus: 'in_transit',
        echoClient: env.echoClient,
        onLocationUpdate: () => {},
        onResyncRequired: () => {
            resyncCount++;
        },
        fallbackPollIntervalMs: 60_000,
    });

    env.emitSubscriptionSucceeded();
    assert.equal(resyncCount, 0);

    // Simulate WebSocket drop and subsequent reconnect
    env.emitConnectionEvent('disconnected', 'disconnected');
    env.emitConnectionEvent('connected', 'connected');

    assert.equal(resyncCount, 1);
    sub.dispose();
});

test('5. Fallback polling activates only when WebSocket is disconnected and stops on reconnect', async () => {
    const env = new FakeEchoEnvironment();
    let pollCalls = 0;

    const sub = createRealtimeTrackingSubscription({
        orderId: 106,
        rawStatus: 'in_transit',
        echoClient: env.echoClient,
        fallbackPollIntervalMs: 35,
        onLocationUpdate: () => {},
        onResyncRequired: () => {
            pollCalls++;
        },
    });

    // Connected & subscribed -> fallback polling MUST be off
    env.emitSubscriptionSucceeded();
    assert.equal(sub.isPollingFallback(), false);
    await new Promise((r) => setTimeout(r, 80));
    assert.equal(pollCalls, 0);

    // Disconnect WebSocket -> fallback polling activates
    env.emitConnectionEvent('disconnected', 'disconnected');
    assert.equal(sub.isPollingFallback(), true);
    await new Promise((r) => setTimeout(r, 90));
    assert.ok(pollCalls >= 1);

    // Reconnect & resubscribe -> fallback polling stops
    env.emitConnectionEvent('connected', 'connected');
    env.emitSubscriptionSucceeded();
    assert.equal(sub.isPollingFallback(), false);

    sub.dispose();
});

test('6. Component unmount cleanup unbinds listeners, leaves channel, and clears timers', () => {
    const env = new FakeEchoEnvironment();

    const sub = createRealtimeTrackingSubscription({
        orderId: 106,
        rawStatus: 'picked_up',
        echoClient: env.echoClient,
        fallbackPollIntervalMs: 50,
        onLocationUpdate: () => {},
        onResyncRequired: () => {},
    });

    assert.equal(env.connectionListenerCount('connected'), 1);
    sub.dispose();

    assert.equal(env.connectionListenerCount('connected'), 0);
    assert.deepEqual(env.leftChannels, ['orders.106.tracking']);
    assert.ok(env.stoppedEvents.includes('.DriverLocationUpdated'));
    assert.ok(env.stoppedEvents.includes('.ShipmentStatusUpdated'));
    assert.equal(sub.isPollingFallback(), false);
});

test('7. Shipment completed behavior stops live WebSocket tracking and displays completed state', () => {
    const env = new FakeEchoEnvironment();

    for (const terminalStatus of ['delivered', 'completed', 'pod_uploaded', 'cancelled']) {
        assert.equal(isShipmentStatusEligibleForLiveTracking(terminalStatus), false);
    }

    const sub = createRealtimeTrackingSubscription({
        orderId: 106,
        rawStatus: 'delivered',
        echoClient: env.echoClient,
        onLocationUpdate: () => {},
        onResyncRequired: () => {},
    });

    assert.equal(sub.isEligible, false);
    assert.equal(sub.channelName, null);
    assert.equal(env.subscribedChannels.length, 0);
    assert.equal(sub.isPollingFallback(), false);

    assert.equal(resolveDriverTrackingStage('delivered', true), 'delivered');
    const deliveredOrder = buildNormalizedCustomerOrder('106', {
        id: 106,
        order_number: 'ORD-2026-10006',
        status_raw: 'delivered',
        status: 'Delivered',
        pickup_address: 'Dhaka Airport',
        delivery_address: 'Progati Sarani, Dhaka',
    });
    const metrics = computeTrackingDisplayMetrics(deliveredOrder, [], '18 km', '24m');
    assert.equal(metrics.remainingDistance, '0 km');
    assert.equal(metrics.displayEta, 'Delivered');

    sub.dispose();
});

