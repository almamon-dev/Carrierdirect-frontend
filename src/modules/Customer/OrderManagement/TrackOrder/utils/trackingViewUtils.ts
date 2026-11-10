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

    // Determine if driver's GPS telemetry is fresh (< 3 minutes old)
    const hasLiveGps = Boolean(
        order?.driverLat !== null &&
            order?.driverLat !== undefined &&
            order?.driverLng !== null &&
            order?.driverLng !== undefined &&
            Number(order.driverLat) !== 0 &&
            Number(order.driverLng) !== 0
    );

    const isGpsFresh = (() => {
        if (!hasLiveGps) return false;
        const rawUpdated = productLoc.updatedAt;
        if (!rawUpdated) return true;
        const updatedMs = new Date(rawUpdated).getTime();
        if (isNaN(updatedMs)) return true;
        const ageMinutes = (Date.now() - updatedMs) / 60000;
        return ageMinutes <= 3.5;
    })();

    const gpsUpdatedHuman = productLoc.updatedHuman || order?.driverLocationUpdatedHuman || 'Just now';

    const driverLocationLabel = (() => {
        if (trackingStage === 'delivered') return `Delivered at ${toCity}`;
        if (liveOptions?.liveDriverAddress && liveOptions.liveDriverAddress.trim() !== '') {
            return liveOptions.liveDriverAddress;
        }
        if (order?.driverCurrentLocation && order.driverCurrentLocation.trim() !== '') {
            const cleanDriverLoc = order.driverCurrentLocation.trim();
            const cleanDestAddr = (order.delivery?.address || '').trim();
            // Prevent showing destination address prematurely before delivery
            if (cleanDriverLoc.toLowerCase() !== cleanDestAddr.toLowerCase()) {
                return cleanDriverLoc;
            }
        }
        if (trackingStage === 'in_transit') return `On Route (${fromCity} → ${toCity})`;
        if (trackingStage === 'picked_up') return `Departed ${fromCity} Pickup`;
        if (trackingStage === 'heading_to_pickup') return `Going to ${fromCity} Pickup`;
        return `At ${fromCity} (Awaiting Driver)`;
    })();

    const pickupStatusLabel = isPickupCompleted
        ? `Pickup Completed (${fromCity})`
        : trackingStage === 'heading_to_pickup'
        ? `Driver Going to Pickup (${fromCity})`
        : `Awaiting Pickup (${fromCity})`;

    const displayDistance =
        liveDistanceText ||
        (order?.distance && order.distance !== '—' && order.distance !== '-' ? order.distance : '—');

    const numericDistanceKm = (() => {
        if (order?.distanceKm && order.distanceKm > 0) {
            return order.distanceKm;
        }
        const parsed = parseFloat(String(displayDistance).replace(/[^0-9.]/g, ''));
        return !isNaN(parsed) && parsed > 0 ? parsed : 0;
    })();

    const displayEta = (() => {
        if (trackingStage === 'delivered') return 'Delivered';
        if (
            (trackingStage === 'heading_to_pickup' ||
                trackingStage === 'picked_up' ||
                trackingStage === 'in_transit') &&
            liveOptions?.liveRemainingDurationText
        ) {
            return liveOptions.liveRemainingDurationText;
        }
        if (liveDurationText) return liveDurationText;
        if (order?.estimatedDurationMinutes && order.estimatedDurationMinutes > 0) {
            const hrs = Math.floor(order.estimatedDurationMinutes / 60);
            const mins = order.estimatedDurationMinutes % 60;
            return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
        }
        if (numericDistanceKm > 0) {
            const totalMins = Math.max(25, Math.round((numericDistanceKm / 55) * 60));
            const hrs = Math.floor(totalMins / 60);
            const mins = totalMins % 60;
            return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
        }
        return 'Scheduled';
    })();

    const remainingDistance = (() => {
        if (trackingStage === 'delivered') return '0 km';
        if (liveOptions?.liveRemainingDistanceText) {
            return liveOptions.liveRemainingDistanceText;
        }
        // If live driver coordinates & delivery coordinates are available, calculate real remaining distance
        if (
            hasLiveGps &&
            order?.deliveryLat &&
            order?.deliveryLng &&
            (trackingStage === 'picked_up' || trackingStage === 'in_transit')
        ) {
            const airRem = calculateAirDistanceKm(
                Number(order.driverLat),
                Number(order.driverLng),
                Number(order.deliveryLat),
                Number(order.deliveryLng)
            );
            if (airRem && airRem > 0) {
                const roadRem = Math.max(1, Math.round(airRem * 1.2));
                return `${roadRem} km`;
            }
        }
        if (numericDistanceKm <= 0) return displayDistance;
        return `${Math.round(numericDistanceKm)} km`;
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
        gpsUpdatedHuman,
        driverLocationLabel,
        pickupStatusLabel,
        displayDistance,
        displayEta,
        remainingDistance,
        displayExpectedDelivery,
        progressSteps,
    };
};

