import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { decryptId } from '@/lib/encryption';

import orderService from '../Orders/services/orderService';
import orderDetailService from '../Details/services/orderDetailService';
import {
    buildCustomerOrderTimeline,
    buildNormalizedCustomerOrder,
} from '../Details/utils/customerOrderDetailsUtils';
import useCustomerOrderMap from '../Details/hooks/useCustomerOrderMap';
import useOrderRealtimeTracking, {
    DriverLocationBroadcastPayload,
} from '../Details/hooks/useOrderRealtimeTracking';

import TrackShipmentEmptyState from './components/TrackShipmentEmptyState';
import TrackShipmentMainCard from './components/TrackShipmentMainCard';
import TrackShipmentBottomCards from './components/TrackShipmentBottomCards';
import { computeTrackingDisplayMetrics } from './utils/trackingViewUtils';
import { CustomerOrderDetailsSkeleton } from '../Details/components/CustomerOrderDetailsSkeleton';

export default function CustomerTrackOrderPage() {
    const navigate = useNavigate();
    const { orderId: paramOrderId } = useParams<{ orderId?: string }>();

    const initialRawId = paramOrderId ? (decryptId(paramOrderId) || paramOrderId) : '';

    const [searchInput, setSearchInput] = useState<string>(
        initialRawId
            ? String(initialRawId).toUpperCase().startsWith('ORD-')
                ? String(initialRawId).toUpperCase()
                : `ORD-${String(initialRawId).replace(/^ORD-0*/i, '').padStart(4, '0')}`
            : ''
    );
    const [trackedApiOrder, setTrackedApiOrder] = useState<any | null>(null);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSearchOrder = useCallback(
        async (rawQuery: string, silent = false) => {
            const trimmed = String(rawQuery || '').trim();
            if (!trimmed) {
                setTrackedApiOrder(null);
                setErrorMessage('Please enter a tracking / Order ID (e.g., ORD-0001).');
                return;
            }

            if (!silent) {
                setIsSearching(true);
                setErrorMessage(null);
            }

            try {
                const cleanQuery = trimmed.replace(/^#/, '');
                const data = await orderDetailService.trackOrderByOrderId(cleanQuery);
                if (data) {
                    setTrackedApiOrder(data);
                    const formatted =
                        data.order_number ||
                        data.order_id ||
                        `ORD-${String(data.id).padStart(4, '0')}`;
                    setSearchInput(formatted);
                } else {
                    setTrackedApiOrder(null);
                    setErrorMessage(`No shipment found matching ID "${trimmed}".`);
                }
            } catch (err: any) {
                const cleanDigits = trimmed.replace(/[^0-9]/g, '');
                const fallbackMatch = recentOrders.find(
                    (o) =>
                        String(o.id) === cleanDigits ||
                        String(o.order_id || '').toLowerCase() === trimmed.toLowerCase() ||
                        String(o.order_number || '').toLowerCase() === trimmed.toLowerCase()
                );
                if (fallbackMatch) {
                    setTrackedApiOrder(fallbackMatch);
                    setErrorMessage(null);
                } else {
                    setTrackedApiOrder(null);
                    const msg =
                        err?.response?.data?.message ||
                        `Could not find any shipment matching "${trimmed}". Please check your Order ID.`;
                    setErrorMessage(msg);
                }
            } finally {
                setIsSearching(false);
            }
        },
        [recentOrders]
    );

    useEffect(() => {
        let isMounted = true;
        orderService
            .fetchOrders()
            .then((res) => {
                if (!isMounted) return;
                const list = Array.isArray(res?.orders) ? res.orders : [];
                setRecentOrders(list);
            })
            .catch(() => {});

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (initialRawId) {
            handleSearchOrder(String(initialRawId), false);
        } else {
            setTrackedApiOrder(null);
            setSearchInput('');
            setErrorMessage(null);
        }
    }, [initialRawId]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleRealtimeLocationUpdate = useCallback(
        (payload: DriverLocationBroadcastPayload) => {
            setTrackedApiOrder((prev: any) => {
                if (!prev) return prev;
                // If driver changed (reassignment), trigger full REST sync
                if (
                    prev.driver?.id &&
                    payload.driver_id &&
                    Number(prev.driver.id) !== Number(payload.driver_id)
                ) {
                    const targetId = prev.order_number || prev.order_id || prev.id;
                    if (targetId) {
                        handleSearchOrder(String(targetId), true);
                    }
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
        [handleSearchOrder]
    );

    const handleRealtimeResync = useCallback(() => {
        if (!trackedApiOrder) return;
        const targetId =
            trackedApiOrder.order_number || trackedApiOrder.order_id || trackedApiOrder.id;
        if (targetId) {
            handleSearchOrder(String(targetId), true);
        }
    }, [trackedApiOrder, handleSearchOrder]);

    useOrderRealtimeTracking({
        orderId: trackedApiOrder?.id,
        rawStatus: trackedApiOrder?.status_raw || trackedApiOrder?.status,
        onLocationUpdate: handleRealtimeLocationUpdate,
        onResyncRequired: handleRealtimeResync,
        fallbackPollIntervalMs: 20000,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearchOrder(searchInput, false);
    };

    const handleClear = () => {
        setSearchInput('');
        setTrackedApiOrder(null);
        setErrorMessage(null);
        if (paramOrderId) {
            navigate('/customer/orders/track', { replace: true });
        }
    };

    const normalizedOrder = trackedApiOrder
        ? buildNormalizedCustomerOrder(String(trackedApiOrder.id || '1'), trackedApiOrder)
        : null;
    const timeline = normalizedOrder ? buildCustomerOrderTimeline(normalizedOrder) : [];

    const fromCity = normalizedOrder?.pickup.city || 'Origin';
    const toCity = normalizedOrder?.delivery.city || 'Destination';
    const productLoc = normalizedOrder?.productLocation || {
        stage: 'at_pickup' as const,
        statusLabel: 'At Pickup Facility',
        currentAddress: fromCity,
        currentCity: fromCity,
        hasLiveGps: false,
        updatedHuman: 'Just now',
    };

    const {
        mapContainerRef,
        mapLoaded,
        mapError,
        mapType,
        setMapType,
        googleMapsUrl,
        embedMapSrc,
        liveDistanceText,
        liveDurationText,
        liveRemainingDistanceText,
        liveRemainingDurationText,
        liveDriverAddress,
        focusOnProduct,
        fitFullRoute,
    } = useCustomerOrderMap({
        pickupLat: normalizedOrder?.pickupLat ?? normalizedOrder?.pickup?.lat,
        pickupLng: normalizedOrder?.pickupLng ?? normalizedOrder?.pickup?.lng,
        deliveryLat: normalizedOrder?.deliveryLat ?? normalizedOrder?.delivery?.lat,
        deliveryLng: normalizedOrder?.deliveryLng ?? normalizedOrder?.delivery?.lng,
        driverLat: normalizedOrder?.driverLat,
        driverLng: normalizedOrder?.driverLng,
        fromCity: normalizedOrder ? fromCity : '-',
        toCity: normalizedOrder ? toCity : '-',
        pickupAddress: normalizedOrder ? (normalizedOrder.pickup.address || fromCity) : '-',
        deliveryAddress: normalizedOrder ? (normalizedOrder.delivery.address || toCity) : '-',
        rawStatus: normalizedOrder?.rawStatus,
        productStage: productLoc.stage,
        productStatusLabel: productLoc.statusLabel,
        productCurrentAddress: productLoc.currentAddress,
        cargoSummary:
            normalizedOrder?.vehicle?.goodsType !== '-'
                ? normalizedOrder?.vehicle?.goodsType
                : normalizedOrder?.loadType,
        driverName: normalizedOrder?.driver?.name,
        vehiclePlate: normalizedOrder?.driver?.plate || normalizedOrder?.vehicle?.number,
        updatedHuman: productLoc.updatedHuman,
    });

    const {
        displayDistance,
        displayEta,
        remainingDistance,
        displayExpectedDelivery,
        driverLocationLabel,
        pickupStatusLabel,
        isPickupCompleted,
        hasLiveGps,
        isGpsFresh,
        gpsUpdatedHuman,
        progressSteps,
    } = computeTrackingDisplayMetrics(
        normalizedOrder,
        timeline,
        liveDistanceText,
        liveDurationText,
        {
            liveRemainingDistanceText,
            liveRemainingDurationText,
            liveDriverAddress,
        }
    );

    return (
        <div className="p-2.5 sm:p-4 w-full flex flex-col min-h-screen font-sans bg-[#f8fafc] dark:bg-[#12161c] pb-8 space-y-3 text-slate-800 dark:text-slate-200 antialiased">
            {isSearching && !normalizedOrder ? (
                <CustomerOrderDetailsSkeleton />
            ) : !normalizedOrder ? (
                <TrackShipmentEmptyState
                    searchInput={searchInput}
                    onSearchInputChange={setSearchInput}
                    onSubmit={onSubmit}
                    onClear={handleClear}
                    isSearching={isSearching}
                    errorMessage={errorMessage}
                />
            ) : (
                <>
                    {errorMessage && (
                        <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-[4px] text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-2">
                            <AlertCircle size={14} className="shrink-0 text-red-600" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <TrackShipmentMainCard
                        order={normalizedOrder}
                        fromCity={fromCity}
                        toCity={toCity}
                        displayDistance={displayDistance}
                        displayEta={displayEta}
                        remainingDistance={remainingDistance}
                        displayExpectedDelivery={displayExpectedDelivery}
                        driverLocationLabel={driverLocationLabel}
                        pickupStatusLabel={pickupStatusLabel}
                        isPickupCompleted={isPickupCompleted}
                        hasLiveGps={hasLiveGps}
                        isGpsFresh={isGpsFresh}
                        gpsUpdatedHuman={gpsUpdatedHuman}
                        progressSteps={progressSteps}
                        mapContainerRef={mapContainerRef}
                        mapLoaded={mapLoaded}
                        mapError={mapError}
                        mapType={mapType}
                        onChangeMapType={setMapType}
                        onFocusDriver={focusOnProduct}
                        onFitRoute={fitFullRoute}
                        embedMapSrc={embedMapSrc}
                        googleMapsUrl={googleMapsUrl}
                    />

                    <TrackShipmentBottomCards order={normalizedOrder} />
                </>
            )}
        </div>
    );
}
