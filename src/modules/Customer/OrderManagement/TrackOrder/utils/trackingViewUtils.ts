import { calculateAirDistanceKm } from '@/utils/geoDistance';
import { NormalizedCustomerOrder } from '../../Details/utils/customerOrderDetailsUtils';
import { resolveDriverTrackingStage } from '../../Details/hooks/useCustomerOrderMap';
import { ProgressStepItem } from '../components/TrackShipmentMainCard';

export const formatNiceDate = (rawDate?: string, rawTime?: string) => {
    if (!rawDate || rawDate === '-') return 'Scheduled';
    const parsed = new Date(rawDate);
    if (isNaN(parsed.getTime())) {
        return rawTime ? `${rawDate}, ${rawTime}` : rawDate;
    }
    const formattedDate = parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
    return rawTime ? `${formattedDate}, ${rawTime}` : formattedDate;
};

export interface LiveTrackingExtraOptions {
    liveRemainingDistanceText?: string;
    liveRemainingDurationText?: string;
    liveDriverAddress?: string;
}

export const computeTrackingDisplayMetrics = (
    order: NormalizedCustomerOrder | null,
    timeline: any[],
    liveDistanceText: string,
    liveDurationText: string,
    liveOptions?: LiveTrackingExtraOptions
) => {
    const fromCity = order?.pickup.city || 'Origin';
    const toCity = order?.delivery.city || 'Destination';
    const productLoc = order?.productLocation || {
        stage: 'at_pickup' as const,
        statusLabel: 'At Pickup Facility',
        currentAddress: fromCity,
        currentCity: fromCity,
        hasLiveGps: false,
        updatedHuman: 'Just now',
    };

    const hasDriverAssigned = Boolean(
        order?.driver?.name && order.driver.name !== '-' && order.driver.name !== 'Unassigned'
    );
    const trackingStage = resolveDriverTrackingStage(order?.rawStatus, hasDriverAssigned);

    const isPickupCompleted =
        trackingStage === 'picked_up' ||
        trackingStage === 'in_transit' ||
        trackingStage === 'delivered';

    // Determine driver GPS telemetry validity & freshness
    const hasLiveGps = Boolean(
        order?.driverLat !== null &&
            order?.driverLat !== undefined &&
            order?.driverLng !== null &&
            order?.driverLng !== undefined &&
            !isNaN(Number(order.driverLat)) &&
            !isNaN(Number(order.driverLng)) &&
            Number(order.driverLat) !== 0 &&
            Number(order.driverLng) !== 0
    );

    const rawUpdated = productLoc.updatedAt || order?.driver?.lastLocationUpdatedAt || order?.driverLocationUpdatedHuman;
    const updatedMs = rawUpdated ? new Date(rawUpdated).getTime() : NaN;
    const ageMinutes = !isNaN(updatedMs) ? Math.max(0, (Date.now() - updatedMs) / 60000) : null;

    const isGpsFresh = (() => {
        if (!hasLiveGps) return false;
        if (order?.driver?.isLiveGps !== undefined) return order.driver.isLiveGps;
        if (order?.trackingMetrics?.gpsStatus === 'live') return true;
        if (order?.trackingMetrics?.gpsStatus === 'stale') return false;
        if (ageMinutes === null) return true;
        return ageMinutes <= 10;
    })();

    const isGpsStale = hasLiveGps && !isGpsFresh;
    const gpsStatus: 'live' | 'stale' | 'unavailable' = !hasLiveGps ? 'unavailable' : isGpsFresh ? 'live' : 'stale';

    const gpsAgeFormatted = (() => {
        if (ageMinutes === null) return null;
        if (ageMinutes < 1) return 'just now';
        if (ageMinutes < 60) return `${Math.round(ageMinutes)}m`;
        const hrs = Math.floor(ageMinutes / 60);
        const mins = Math.round(ageMinutes % 60);
        return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
    })();

    const gpsUpdatedHuman = (() => {
        if (!hasLiveGps) return 'Driver location unavailable';
        if (isGpsStale && gpsAgeFormatted) {
            return `Location last updated ${gpsAgeFormatted} ago`;
        }
        if (isGpsStale && order?.driver?.lastUpdatedHuman && order.driver.lastUpdatedHuman.includes('Location last updated')) {
            return order.driver.lastUpdatedHuman;
        }
        return productLoc.updatedHuman || order?.driverLocationUpdatedHuman || 'Just now';
    })();

    // Active target destination resolution based on shipment status and relay leg
    const isRelayLeg1 = Boolean(
        order?.isRelay &&
        Number(order?.currentActiveLeg ?? 1) <= 1 &&
        (order?.hubLocation || order?.hubLat)
    );
    const hubName = order?.hubLocation || 'Intermediate Hub';

    const nextDestinationInfo = (() => {
        if (trackingStage === 'delivered') {
            return {
                type: 'completed',
                title: `Delivered at Destination (${toCity})`,
                shortTitle: 'Delivered',
                targetCity: toCity,
                targetLat: order?.deliveryLat,
                targetLng: order?.deliveryLng,
            };
        }
        if (trackingStage === 'heading_to_pickup' || trackingStage === 'booked') {
            return {
                type: 'collection',
                title: `Collection Point (${fromCity})`,
                shortTitle: 'Collection',
                targetCity: fromCity,
                targetLat: order?.pickupLat,
                targetLng: order?.pickupLng,
            };
        }
        if (isRelayLeg1) {
            return {
                type: 'intermediate_hub',
                title: `Intermediate Hub (${hubName})`,
                shortTitle: 'Intermediate Hub',
                targetCity: hubName,
                targetLat: order?.hubLat,
                targetLng: order?.hubLng,
            };
        }
        return {
            type: 'delivery',
            title: `Final Delivery Point (${toCity})`,
            shortTitle: 'Final Delivery',
            targetCity: toCity,
            targetLat: order?.deliveryLat,
            targetLng: order?.deliveryLng,
        };
    })();

    const driverLocationLabel = (() => {
        if (trackingStage === 'delivered') return `Delivered at ${toCity}`;
        if (!hasLiveGps) return 'Driver location unavailable';
        if (liveOptions?.liveDriverAddress && liveOptions.liveDriverAddress.trim() !== '') {
            return liveOptions.liveDriverAddress;
        }
        if (order?.driverCurrentLocation && order.driverCurrentLocation.trim() !== '') {
            const cleanDriverLoc = order.driverCurrentLocation.trim();
            const cleanDestAddr = (order.delivery?.address || '').trim();
            if (cleanDriverLoc.toLowerCase() !== cleanDestAddr.toLowerCase()) {
                return cleanDriverLoc;
            }
        }
        if (trackingStage === 'in_transit') {
            return isRelayLeg1 ? `En route to ${hubName}` : `On Route (${fromCity} → ${toCity})`;
        }
        if (trackingStage === 'picked_up') return `Departed ${fromCity} Collection`;
        if (trackingStage === 'heading_to_pickup') return `Going to ${fromCity} Collection`;
        return `At ${fromCity} (Awaiting Driver)`;
    })();

    const pickupStatusLabel = isPickupCompleted
        ? `Pickup Completed (${fromCity})`
        : trackingStage === 'heading_to_pickup'
        ? `Driver Going to Pickup (${fromCity})`
        : `Awaiting Pickup (${fromCity})`;

    // Metric A: Total Shipment Distance (Collection Point -> Final Delivery Point, CONSTANT)
    const totalShipmentDistance =
        order?.distance && order.distance !== '—' && order.distance !== '-'
            ? order.distance
            : order?.distanceKm && order.distanceKm > 0
            ? `${order.distanceKm} km`
            : liveDistanceText || '—';

    // Metric B: Distance to Next Destination
    const distanceToNextDestination = (() => {
        if (trackingStage === 'delivered') return '0 km (Delivered)';
        if (liveOptions?.liveRemainingDistanceText) {
            return liveOptions.liveRemainingDistanceText;
        }
        if (order?.trackingMetrics?.distanceToNextFormatted) {
            return order.trackingMetrics.distanceToNextFormatted;
        }
        if (
            hasLiveGps &&
            nextDestinationInfo.targetLat &&
            nextDestinationInfo.targetLng
        ) {
            const airRem = calculateAirDistanceKm(
                Number(order?.driverLat),
                Number(order?.driverLng),
                Number(nextDestinationInfo.targetLat),
                Number(nextDestinationInfo.targetLng)
            );
            if (airRem && airRem > 0) {
                const roadRem = Math.max(1, Math.round(airRem * 1.2));
                return `${roadRem} km`;
            }
        }
        if (!hasLiveGps) {
            return 'Driver location unavailable';
        }
        return totalShipmentDistance;
    })();

    // Metric C: Estimated Travel Time (Driver's current GPS position to relevant next destination)
    const displayEta = (() => {
        if (trackingStage === 'delivered') return 'Delivered';
        if (liveOptions?.liveRemainingDurationText) {
            return liveOptions.liveRemainingDurationText;
        }
        if (order?.trackingMetrics?.estimatedTravelTimeFormatted) {
            return order.trackingMetrics.estimatedTravelTimeFormatted;
        }
        if (hasLiveGps) {
            const kmDigits = parseFloat(String(distanceToNextDestination).replace(/[^0-9.]/g, ''));
            if (!isNaN(kmDigits) && kmDigits > 0) {
                const totalMins = Math.max(1, Math.round((kmDigits / 50) * 60));
                const hrs = Math.floor(totalMins / 60);
                const mins = totalMins % 60;
                return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
            }
        }
        if (order?.estimatedDurationMinutes && order.estimatedDurationMinutes > 0) {
            const hrs = Math.floor(order.estimatedDurationMinutes / 60);
            const mins = order.estimatedDurationMinutes % 60;
            return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
        }
        return 'Scheduled';
    })();

    const displayExpectedDelivery = order
        ? formatNiceDate(order.delivery.date, order.delivery.time || '06:30 PM')
        : '—';

    const progressSteps: ProgressStepItem[] = order
        ? [
              {
                  id: 'booked',
                  title: 'Booked',
                  time: timeline[0]?.time || formatNiceDate(order.pickup.date, '10:30 AM'),
                  completed: trackingStage !== 'booked',
                  active: trackingStage === 'booked',
              },
              {
                  id: 'driver_assigned',
                  title:
                      trackingStage === 'heading_to_pickup'
                          ? 'Driver Going to Pickup'
                          : 'Driver Assigned',
                  time:
                      trackingStage === 'heading_to_pickup'
                          ? `Heading to ${fromCity} pickup`
                          : timeline[1]?.time || formatNiceDate(order.pickup.date, '11:15 AM'),
                  completed: isPickupCompleted,
                  active: trackingStage === 'heading_to_pickup',
              },
              {
                  id: 'pickup_completed',
                  title: 'Pickup Completed',
                  time: isPickupCompleted
                      ? `Picked up from ${fromCity}`
                      : `Pending at ${fromCity}`,
                  completed: trackingStage === 'in_transit' || trackingStage === 'delivered',
                  active: trackingStage === 'picked_up',
              },
              {
                  id: 'in_transit',
                  title: 'In Transit',
                  time:
                      trackingStage === 'in_transit'
                          ? `Driver at: ${driverLocationLabel}`
                          : trackingStage === 'delivered'
                          ? `${fromCity} → ${toCity}`
                          : '',
                  completed: trackingStage === 'delivered',
                  active: trackingStage === 'in_transit',
              },
              {
                  id: 'delivered',
                  title: 'Delivered',
                  time:
                      trackingStage === 'delivered'
                          ? timeline[6]?.time ||
                            timeline[4]?.time ||
                            `Delivered at ${toCity}`
                          : '',
                  completed: trackingStage === 'delivered',
                  active: false,
              },
          ]
        : [];

    return {
        fromCity,
        toCity,
        productLoc,
        trackingStage,
        isPickupCompleted,
        hasLiveGps,
        isGpsFresh,
        isGpsStale,
        gpsStatus,
        gpsUpdatedHuman,
        driverLocationLabel,
        pickupStatusLabel,
        totalShipmentDistance,
        displayDistance: totalShipmentDistance,
        distanceToNextDestination,
        remainingDistance: distanceToNextDestination,
        nextDestinationTitle: nextDestinationInfo.title,
        nextDestinationType: nextDestinationInfo.type,
        nextDestinationShortTitle: nextDestinationInfo.shortTitle,
        displayEta,
        displayExpectedDelivery,
        progressSteps,
    };
};

