import { calculateAirDistanceKm, extractCoordinatesFromAddress } from '@/utils/geoDistance';
import { fetchGoogleDrivingRoute } from '@/utils/googlePlacesGeocoding';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useRef, useState } from 'react';

export type DriverTrackingStage =
    | 'booked'
    | 'heading_to_pickup'
    | 'picked_up'
    | 'in_transit'
    | 'delivered';

export const DEFAULT_ETA_MOVEMENT_THRESHOLD_KM = Number(
    import.meta.env.VITE_ETA_MOVEMENT_THRESHOLD_KM || 0.3
);
export const DEFAULT_ETA_RECALC_INTERVAL_MS = Number(
    import.meta.env.VITE_ETA_RECALC_INTERVAL_MS || 45000
);

export interface EtaRecalcDecisionInput {
    currentPos: [number, number];
    lastCalcPos: [number, number] | null;
    lastCalcTimeMs: number;
    nowMs: number;
    lastStage: DriverTrackingStage | null;
    currentStage: DriverTrackingStage;
    movementThresholdKm?: number;
    minIntervalMs?: number;
}

/**
 * Pure helper to determine whether the routing API should be queried for an updated
 * route & ETA. Avoids calling external routing APIs on every GPS coordinate tick.
 */
export const shouldRecalculateDynamicEta = ({
    currentPos,
    lastCalcPos,
    lastCalcTimeMs,
    nowMs,
    lastStage,
    currentStage,
    movementThresholdKm = DEFAULT_ETA_MOVEMENT_THRESHOLD_KM,
    minIntervalMs = DEFAULT_ETA_RECALC_INTERVAL_MS,
}: EtaRecalcDecisionInput): boolean => {
    if (currentStage === 'delivered' || currentStage === 'booked') {
        return false;
    }
    if (!lastCalcPos || lastStage !== currentStage || lastCalcTimeMs <= 0) {
        return true;
    }
    const elapsedMs = nowMs - lastCalcTimeMs;
    if (elapsedMs < minIntervalMs) {
        return false;
    }
    const movedKm =
        calculateAirDistanceKm(
            lastCalcPos[0],
            lastCalcPos[1],
            currentPos[0],
            currentPos[1]
        ) || 0;
    return movedKm >= movementThresholdKm;
};

interface UseCustomerOrderMapProps {
    pickupLat?: number | null;
    pickupLng?: number | null;
    deliveryLat?: number | null;
    deliveryLng?: number | null;
    driverLat?: number | null;
    driverLng?: number | null;
    fromCity: string;
    toCity: string;
    pickupAddress: string;
    deliveryAddress: string;
    rawStatus?: string;
    productStage?: 'at_pickup' | 'in_transit' | 'delivered';
    productStatusLabel?: string;
    productCurrentAddress?: string;
    cargoSummary?: string;
    driverName?: string;
    vehiclePlate?: string;
    updatedHuman?: string;
    selectedRouteIndex?: number;
    etaMovementThresholdKm?: number;
    etaMinIntervalMs?: number;
}

const reverseGeocodeCache = new Map<string, string>();

export const resolveDriverTrackingStage = (
    rawStatus?: string,
    hasDriver?: boolean
): DriverTrackingStage => {
    const s = String(rawStatus || '').toLowerCase().trim();
    if (
        s === 'completed' ||
        s === 'pod_accepted' ||
        s === 'delivered' ||
        s === 'pod_uploaded' ||
        s === 'pod_review'
    ) {
        return 'delivered';
    }
    if (s === 'in_transit' || s === 'on_the_way' || s === 'arrived') {
        return 'in_transit';
    }
    if (s === 'picked_up' || s === 'in_progress' || s === 'goods_picked_up') {
        return 'picked_up';
    }
    if (s === 'driver_assigned' || s === 'assigned' || s === 'dispatched' || hasDriver) {
        return 'heading_to_pickup';
    }
    return 'booked';
};

const resolveValidCoords = (
    lat?: number | null,
    lng?: number | null,
    address?: string,
    city?: string,
    fallback: [number, number] = [23.8103, 90.4125]
): [number, number] => {
    if (
        lat !== null &&
        lat !== undefined &&
        !isNaN(Number(lat)) &&
        Number(lat) !== 0 &&
        lng !== null &&
        lng !== undefined &&
        !isNaN(Number(lng)) &&
        Number(lng) !== 0
    ) {
        return [Number(lat), Number(lng)];
    }
    const fromAddr = extractCoordinatesFromAddress(address || '');
    if (fromAddr) return fromAddr;

    const fromCityCoords = extractCoordinatesFromAddress(city || '');
    if (fromCityCoords) return fromCityCoords;

    return fallback;
};

/**
 * Compute polyline length in kilometers across an array of [lat, lng] coordinates.
 */
const computePathDistanceKm = (points: [number, number][]): number => {
    if (!points || points.length < 2) return 0;
    let sum = 0;
    for (let i = 1; i < points.length; i++) {
        const seg = calculateAirDistanceKm(
            points[i - 1][0],
            points[i - 1][1],
            points[i][0],
            points[i][1]
        );
        if (seg && !isNaN(seg)) sum += seg;
    }
    return Number(sum.toFixed(1));
};

/**
 * Find the index of the closest point in a route polyline to a target [lat, lng].
 */
const findClosestRoutePointIndex = (
    routePoints: [number, number][],
    target: [number, number]
): number => {
    if (!routePoints.length) return 0;
    let bestIdx = 0;
    let bestDistSq = Infinity;
    for (let i = 0; i < routePoints.length; i++) {
        const dLat = routePoints[i][0] - target[0];
        const dLng = routePoints[i][1] - target[1];
        const dSq = dLat * dLat + dLng * dLng;
        if (dSq < bestDistSq) {
            bestDistSq = dSq;
            bestIdx = i;
        }
    }
    return bestIdx;
};

/**
 * Clean Google-Maps style Lollipop Pin Icon (Orange for Pickup, Red for Delivery)
 * matching the driver app's ultra-clean map aesthetic.
 */
const createCleanLollipopPinIcon = (fillColor: string) => {
    return L.divIcon({
        className: 'cd-clean-lollipop-pin',
        html: `
            <div style="position: relative; width: 34px; height: 44px; display: flex; align-items: center; justify-content: center; pointer-events: auto;">
                <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="17" cy="40" rx="6.5" ry="2.4" fill="rgba(15, 23, 42, 0.26)" />
                    <line x1="17" y1="26" x2="17" y2="39.5" stroke="#7F1D1D" stroke-width="2.4" stroke-linecap="round" />
                    <circle cx="17" cy="15" r="12.5" fill="${fillColor}" stroke="#FFFFFF" stroke-width="2.5" />
                    <circle cx="17" cy="15" r="4.5" fill="#FFFFFF" />
                </svg>
            </div>
        `,
        iconSize: [34, 44],
        iconAnchor: [17, 40],
        popupAnchor: [0, -36],
    });
};

/**
 * Clean Navigation / Live Driver Puck Marker matching the driver app's clean blue puck.
 */
const createCleanDriverNavigationIcon = (accentColor: string, isLive: boolean) => {
    return L.divIcon({
        className: 'cd-clean-driver-puck',
        html: `
            <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; pointer-events: auto;">
                <div style="
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border-radius: 9999px;
                    background: ${accentColor};
                    opacity: ${isLive ? '0.22' : '0.15'};
                "></div>
                <div style="
                    position: relative;
                    width: 28px;
                    height: 28px;
                    border-radius: 9999px;
                    background: ${accentColor};
                    border: 2.5px solid #ffffff;
                    box-shadow: 0 3px 8px rgba(15, 23, 42, 0.32);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 17h4V5H2v12h3"/>
                        <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/>
                        <path d="M14 17h1"/>
                        <circle cx="7.5" cy="17.5" r="2.5"/>
                        <circle cx="17.5" cy="17.5" r="2.5"/>
                    </svg>
                </div>
            </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -18],
    });
};

export const useCustomerOrderMap = ({
    pickupLat,
    pickupLng,
    deliveryLat,
    deliveryLng,
    driverLat,
    driverLng,
    fromCity,
    toCity,
    pickupAddress,
    deliveryAddress,
    rawStatus = '',
    driverName = '',
    vehiclePlate = '',
    etaMovementThresholdKm = DEFAULT_ETA_MOVEMENT_THRESHOLD_KM,
    etaMinIntervalMs = DEFAULT_ETA_RECALC_INTERVAL_MS,
}: UseCustomerOrderMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const driverMarkerRef = useRef<L.Marker | null>(null);
    const routeBoundsRef = useRef<L.LatLngBounds | null>(null);
    const routePointsRef = useRef<[number, number][]>([]);
    const dynamicLegPointsRef = useRef<[number, number][]>([]);
    const dynamicLayerGroupRef = useRef<L.LayerGroup | null>(null);
    const prevDriverPosRef = useRef<[number, number] | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const userHasPannedRef = useRef<boolean>(false);
    const totalRouteKmRef = useRef<number>(0);

    // Throttled routing/ETA state refs
    const lastEtaCalcPosRef = useRef<[number, number] | null>(null);
    const lastEtaCalcTimeRef = useRef<number>(0);
    const lastEtaCalcStageRef = useRef<DriverTrackingStage | null>(null);
    const isEtaRequestInFlightRef = useRef<boolean>(false);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [mapType, setMapTypeState] = useState<'roadmap' | 'satellite'>('roadmap');
    const [routesSummary] = useState<Array<{ summary: string; distance: string; duration: string }>>(
        []
    );
    const [liveDistanceText, setLiveDistanceText] = useState<string>('');
    const [liveDurationText, setLiveDurationText] = useState<string>('');
    const [liveRemainingDistanceText, setLiveRemainingDistanceText] = useState<string>('');
    const [liveRemainingDurationText, setLiveRemainingDurationText] = useState<string>('');
    const [liveDriverAddress, setLiveDriverAddress] = useState<string>('');
    const [dynamicLegVersion, setDynamicLegVersion] = useState<number>(0);

    const hasDriverAssigned = Boolean(
        driverName && driverName !== '-' && driverName !== 'Unassigned'
    );
    const trackingStage = resolveDriverTrackingStage(rawStatus, hasDriverAssigned);

    const hasLiveDriverCoords = Boolean(
        driverLat !== null &&
            driverLat !== undefined &&
            !isNaN(Number(driverLat)) &&
            Number(driverLat) !== 0 &&
            driverLng !== null &&
            driverLng !== undefined &&
            !isNaN(Number(driverLng)) &&
            Number(driverLng) !== 0
    );

    const pCoords = resolveValidCoords(pickupLat, pickupLng, pickupAddress, fromCity, [
        23.9999, 90.4203,
    ]);
    const dCoords = resolveValidCoords(deliveryLat, deliveryLng, deliveryAddress, toCity, [
        23.8103, 90.4125,
    ]);

    const hasExactCoordinates = true;

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${pCoords[0]},${pCoords[1]}&destination=${dCoords[0]},${dCoords[1]}${
        hasLiveDriverCoords ? `&waypoints=${driverLat},${driverLng}` : ''
    }&travelmode=driving`;

    const mapTypeParam = mapType === 'satellite' ? 'k' : 'm';
    const embedMapSrc = `https://maps.google.com/maps?saddr=${pCoords[0]},${pCoords[1]}&daddr=${dCoords[0]},${dCoords[1]}&dirflg=d&travelmode=driving&t=${mapTypeParam}&z=8&output=embed`;

    const setMapType = useCallback((type: 'roadmap' | 'satellite') => {
        setMapTypeState(type);
        if (mapInstanceRef.current && tileLayerRef.current) {
            const lyrs = type === 'satellite' ? 'y' : 'm';
            tileLayerRef.current.setUrl(
                `https://mt{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}`
            );
        }
    }, []);

    const focusOnProduct = useCallback(() => {
        const map = mapInstanceRef.current;
        const marker = driverMarkerRef.current;
        if (map && marker) {
            userHasPannedRef.current = false;
            map.setView(marker.getLatLng(), Math.max(map.getZoom(), 13), { animate: true });
            marker.openPopup();
        }
    }, []);

    const fitFullRoute = useCallback(() => {
        const map = mapInstanceRef.current;
        const bounds = routeBoundsRef.current;
        if (map && bounds) {
            userHasPannedRef.current = false;
            map.fitBounds(bounds, { padding: [48, 48], animate: true });
        }
    }, []);

    // Reverse-geocode live driver coordinates into a clean street/area name (cached by ~100m grid)
    useEffect(() => {
        if (!hasLiveDriverCoords || trackingStage === 'delivered') {
            setLiveDriverAddress('');
            return;
        }
        const lat = Number(driverLat);
        const lng = Number(driverLng);
        const cacheKey = `${lat.toFixed(3)},${lng.toFixed(3)}`;
        if (reverseGeocodeCache.has(cacheKey)) {
            setLiveDriverAddress(reverseGeocodeCache.get(cacheKey)!);
            return;
        }

        let cancelled = false;
        fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
        )
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (cancelled || !data) return;
                const addr = data.address || {};
                const road =
                    addr.road ||
                    addr.neighbourhood ||
                    addr.suburb ||
                    addr.quarter ||
                    addr.village ||
                    addr.town ||
                    '';
                const city =
                    addr.city ||
                    addr.town ||
                    addr.county ||
                    addr.state_district ||
                    addr.state ||
                    '';
                const label = [road, city].filter(Boolean).join(', ');
                if (label) {
                    reverseGeocodeCache.set(cacheKey, label);
                    setLiveDriverAddress(label);
                }
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [driverLat, driverLng, hasLiveDriverCoords, trackingStage]);

    // Throttled Dynamic ETA & Route Leg Recalculation (Movement >= 300m & Interval >= 45s)
    useEffect(() => {
        if (!hasLiveDriverCoords || trackingStage === 'delivered' || trackingStage === 'booked') {
            dynamicLegPointsRef.current = [];
            return;
        }

        const currentPos: [number, number] = [Number(driverLat), Number(driverLng)];
        const nowMs = Date.now();

        if (
            isEtaRequestInFlightRef.current ||
            !shouldRecalculateDynamicEta({
                currentPos,
                lastCalcPos: lastEtaCalcPosRef.current,
                lastCalcTimeMs: lastEtaCalcTimeRef.current,
                nowMs,
                lastStage: lastEtaCalcStageRef.current,
                currentStage: trackingStage,
                movementThresholdKm: etaMovementThresholdKm,
                minIntervalMs: etaMinIntervalMs,
            })
        ) {
            return;
        }

        const targetDest: [number, number] =
            trackingStage === 'heading_to_pickup' ? pCoords : dCoords;

        let cancelled = false;
        isEtaRequestInFlightRef.current = true;
        lastEtaCalcPosRef.current = currentPos;
        lastEtaCalcTimeRef.current = nowMs;
        lastEtaCalcStageRef.current = trackingStage;

        (async () => {
            try {
                // 1. Primary routing provider: Google Routes API v2
                const googleLeg = await fetchGoogleDrivingRoute(currentPos, targetDest);
                if (!cancelled && googleLeg && googleLeg.points.length > 1) {
                    dynamicLegPointsRef.current = googleLeg.points;
                    if (googleLeg.distanceText) {
                        setLiveRemainingDistanceText(googleLeg.distanceText);
                    }
                    if (googleLeg.durationText) {
                        setLiveRemainingDurationText(googleLeg.durationText);
                    }
                    setDynamicLegVersion((v) => v + 1);
                    return;
                }
            } catch (_) {
                // Graceful fallback to OSRM below
            }

            try {
                // 2. Fallback routing provider: OSRM driving route
                const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${currentPos[1]},${currentPos[0]};${targetDest[1]},${targetDest[0]}?overview=full&geometries=geojson`;
                const res = await fetch(osrmUrl);
                if (res.ok) {
                    const data = await res.json();
                    const route = data?.routes?.[0];
                    if (!cancelled && route?.geometry?.coordinates?.length > 1) {
                        const coords: [number, number][] = route.geometry.coordinates.map(
                            (c: [number, number]) => [c[1], c[0]]
                        );
                        dynamicLegPointsRef.current = coords;
                        const km = route.distance
                            ? Number((route.distance / 1000).toFixed(1))
                            : 0;
                        if (km > 0) {
                            setLiveRemainingDistanceText(
                                km >= 10 ? `${Math.round(km)} km` : `${km.toFixed(1)} km`
                            );
                        }
                        if (route.duration) {
                            const totalMins = Math.max(1, Math.round(route.duration / 60));
                            const hrs = Math.floor(totalMins / 60);
                            const mins = totalMins % 60;
                            setLiveRemainingDurationText(
                                hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
                            );
                        }
                        setDynamicLegVersion((v) => v + 1);
                    }
                }
            } catch (_) {
                // Graceful degradation: local polyline / air-distance calculation handles display
            } finally {
                isEtaRequestInFlightRef.current = false;
            }
        })();

        return () => {
            cancelled = true;
            isEtaRequestInFlightRef.current = false;
        };
    }, [
        driverLat,
        driverLng,
        hasLiveDriverCoords,
        trackingStage,
        pCoords[0],
        pCoords[1],
        dCoords[0],
        dCoords[1],
        etaMovementThresholdKm,
        etaMinIntervalMs,
    ]);

    // 1. Initialize Map & Primary Route ONLY when Pickup/Delivery coordinates change
    useEffect(() => {
        if (!mapContainerRef.current || fromCity === '-' || toCity === '-') return;

        let isCancelled = false;
        userHasPannedRef.current = false;
        prevDriverPosRef.current = null;
        driverMarkerRef.current = null;
        lastEtaCalcPosRef.current = null;
        lastEtaCalcTimeRef.current = 0;
        dynamicLegPointsRef.current = [];

        if (animFrameRef.current) {
            cancelAnimationFrame(animFrameRef.current);
            animFrameRef.current = null;
        }

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
            center: pCoords,
            zoom: 8,
            zoomControl: false,
            attributionControl: false,
        });
        mapInstanceRef.current = map;

        map.on('dragstart', () => {
            userHasPannedRef.current = true;
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const lyrs = mapType === 'satellite' ? 'y' : 'm';
        const tileLayer = L.tileLayer(
            `https://mt{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}`,
            {
                maxZoom: 19,
                subdomains: ['0', '1', '2', '3'],
            }
        ).addTo(map);
        tileLayerRef.current = tileLayer;

        const dynamicGroup = L.layerGroup().addTo(map);
        dynamicLayerGroupRef.current = dynamicGroup;

        // Place Clean Pickup Pin (Orange Lollipop)
        const pickupMarker = L.marker(pCoords, {
            icon: createCleanLollipopPinIcon('#F97316'),
            zIndexOffset: 200,
        }).addTo(map);
        pickupMarker.bindPopup(
            `<div style="font-family: Inter, system-ui, sans-serif; font-size: 12px; line-height: 1.35;">
                <div style="font-weight: 800; color: #f97316;">Pickup • ${fromCity}</div>
                <div style="color: #334155; font-weight: 600; margin-top: 2px;">${pickupAddress || fromCity}</div>
            </div>`
        );

        // Place Clean Delivery Pin (Google Red Lollipop)
        const deliveryMarker = L.marker(dCoords, {
            icon: createCleanLollipopPinIcon('#E53935'),
            zIndexOffset: 220,
        }).addTo(map);
        deliveryMarker.bindPopup(
            `<div style="font-family: Inter, system-ui, sans-serif; font-size: 12px; line-height: 1.35;">
                <div style="font-weight: 800; color: #e53935;">Destination • ${toCity}</div>
                <div style="color: #334155; font-weight: 600; margin-top: 2px;">${deliveryAddress || toCity}</div>
            </div>`
        );

        const applyPrimaryRoute = (
            coords: [number, number][],
            distKm: number,
            distText: string,
            durText: string
        ) => {
            if (isCancelled || !mapInstanceRef.current) return;
            routePointsRef.current = coords;
            totalRouteKmRef.current = distKm;
            if (distText) setLiveDistanceText(distText);
            if (durText) setLiveDurationText(durText);

            const bounds = L.latLngBounds([pCoords, dCoords]);
            coords.forEach((pt) => bounds.extend(pt));
            if (hasLiveDriverCoords) {
                bounds.extend([Number(driverLat), Number(driverLng)]);
            }
            routeBoundsRef.current = bounds;
            map.fitBounds(bounds, { padding: [48, 48] });
            setMapLoaded(true);
            setMapError(false);
        };

        // Try Google Routes API v2 first, then fallback to OSRM, then air-distance
        (async () => {
            try {
                const googleRoute = await fetchGoogleDrivingRoute(pCoords, dCoords);
                if (!isCancelled && googleRoute && googleRoute.points.length > 1) {
                    applyPrimaryRoute(
                        googleRoute.points,
                        googleRoute.distanceKm,
                        googleRoute.distanceText,
                        googleRoute.durationText
                    );
                    return;
                }
            } catch (_) {
                // Fallback to OSRM below
            }

            try {
                const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pCoords[1]},${pCoords[0]};${dCoords[1]},${dCoords[0]}?overview=full&geometries=geojson`;
                const res = await fetch(osrmUrl);
                const data = await res.json();
                if (isCancelled) return;
                const route = data?.routes?.[0];
                if (route?.geometry?.coordinates?.length > 1) {
                    const coords: [number, number][] = route.geometry.coordinates.map(
                        (c: [number, number]) => [c[1], c[0]]
                    );
                    const km = route.distance ? Math.max(1, Math.round(route.distance / 1000)) : 0;
                    const dText = km > 0 ? `${km.toLocaleString()} km` : '';
                    let durText = '';
                    if (route.duration) {
                        const totalMins = Math.max(1, Math.round(route.duration / 60));
                        const hrs = Math.floor(totalMins / 60);
                        const mins = totalMins % 60;
                        durText = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
                    }
                    applyPrimaryRoute(coords, km, dText, durText);
                    return;
                }
            } catch (_) {
                // Fallback to straight line
            }

            if (isCancelled) return;
            const airKm =
                calculateAirDistanceKm(pCoords[0], pCoords[1], dCoords[0], dCoords[1]) || 0;
            const totalMins = airKm > 0 ? Math.max(15, Math.round((airKm / 50) * 60)) : 0;
            const hrs = Math.floor(totalMins / 60);
            const mins = totalMins % 60;
            const durText = totalMins > 0 ? (hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`) : '';
            applyPrimaryRoute(
                [pCoords, dCoords],
                airKm,
                airKm > 0 ? `${Math.round(airKm)} km` : '',
                durText
            );
        })();

        return () => {
            isCancelled = true;
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
                animFrameRef.current = null;
            }
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [pCoords[0], pCoords[1], dCoords[0], dCoords[1], fromCity, toCity]); // eslint-disable-line react-hooks/exhaustive-deps

    // 2. Smooth Live Driver Marker & Stage-Aware Route Polyline Updates (NO Map Destruction!)
    useEffect(() => {
        const map = mapInstanceRef.current;
        const dynamicGroup = dynamicLayerGroupRef.current;
        if (!map || !dynamicGroup || !mapLoaded) return;

        const routeCoords =
            routePointsRef.current.length >= 2 ? routePointsRef.current : [pCoords, dCoords];

        const liveDriverPos: [number, number] | null = hasLiveDriverCoords
            ? [Number(driverLat), Number(driverLng)]
            : null;

        // Redraw clean route polylines inside dynamicGroup (without touching tiles or pins)
        dynamicGroup.clearLayers();

        // White outer casing for crisp contrast on both Roadmap & Satellite
        L.polyline(routeCoords, {
            color: '#FFFFFF',
            weight: 8,
            opacity: 0.75,
            lineCap: 'round',
            lineJoin: 'round',
        }).addTo(dynamicGroup);

        if (trackingStage === 'picked_up' || trackingStage === 'in_transit') {
            if (liveDriverPos && routeCoords.length >= 2) {
                const splitIdx = findClosestRoutePointIndex(routeCoords, liveDriverPos);
                const completedSegment = routeCoords.slice(0, Math.max(1, splitIdx + 1));
                const remainingSegment =
                    dynamicLegPointsRef.current.length >= 2
                        ? dynamicLegPointsRef.current
                        : routeCoords.slice(Math.max(0, splitIdx));

                // Completed path behind driver: muted gray (#94A3B8)
                if (completedSegment.length >= 2) {
                    L.polyline(completedSegment, {
                        color: '#94A3B8',
                        weight: 4.5,
                        opacity: 0.78,
                        lineCap: 'round',
                        lineJoin: 'round',
                    }).addTo(dynamicGroup);
                }

                // Active remaining path ahead of driver: crisp jet-dark #111827
                const activeAhead =
                    remainingSegment.length >= 2 ? remainingSegment : [liveDriverPos, dCoords];
                L.polyline(activeAhead, {
                    color: '#111827',
                    weight: 5,
                    opacity: 0.98,
                    lineCap: 'round',
                    lineJoin: 'round',
                }).addTo(dynamicGroup);

                // Local interpolation of remaining distance & ETA between throttled API calls
                let remKm = computePathDistanceKm([liveDriverPos, ...remainingSegment]);
                if (remKm <= 0) {
                    const airRem =
                        calculateAirDistanceKm(
                            liveDriverPos[0],
                            liveDriverPos[1],
                            dCoords[0],
                            dCoords[1]
                        ) || 0;
                    remKm = Number((airRem * 1.2).toFixed(1));
                }
                const formattedRemKm =
                    remKm >= 10
                        ? `${Math.round(remKm)} km`
                        : `${Math.max(0.5, remKm).toFixed(1)} km`;
                setLiveRemainingDistanceText(formattedRemKm);

                const remMins = Math.max(5, Math.round((remKm / 50) * 60));
                const rHrs = Math.floor(remMins / 60);
                const rMins = remMins % 60;
                setLiveRemainingDurationText(rHrs > 0 ? `${rHrs}h ${rMins}m` : `${rMins}m`);
            } else {
                // No live GPS fix yet: show planned pickup-to-delivery route
                L.polyline(routeCoords, {
                    color: '#111827',
                    weight: 5,
                    opacity: 0.96,
                    lineCap: 'round',
                    lineJoin: 'round',
                }).addTo(dynamicGroup);
            }
        } else if (trackingStage === 'heading_to_pickup') {
            // Planned Pickup -> Delivery route
            L.polyline(routeCoords, {
                color: '#111827',
                weight: 5,
                opacity: 0.96,
                lineCap: 'round',
                lineJoin: 'round',
            }).addTo(dynamicGroup);

            // Driver current location -> Pickup route & ETA to pickup (when live GPS available)
            if (liveDriverPos) {
                const approachLeg =
                    dynamicLegPointsRef.current.length >= 2
                        ? dynamicLegPointsRef.current
                        : [liveDriverPos, pCoords];
                L.polyline(approachLeg, {
                    color: '#F97316',
                    weight: 4.5,
                    dashArray: '6, 8',
                    opacity: 0.95,
                    lineCap: 'round',
                }).addTo(dynamicGroup);

                if (dynamicLegPointsRef.current.length < 2) {
                    const airToPickup =
                        calculateAirDistanceKm(
                            liveDriverPos[0],
                            liveDriverPos[1],
                            pCoords[0],
                            pCoords[1]
                        ) || 0;
                    const roadToPickupKm = Number((airToPickup * 1.2).toFixed(1));
                    const pickupMins = Math.max(3, Math.round((roadToPickupKm / 45) * 60));
                    const pHrs = Math.floor(pickupMins / 60);
                    const pMins = pickupMins % 60;
                    setLiveRemainingDurationText(
                        `${pHrs > 0 ? `${pHrs}h ${pMins}m` : `${pMins}m`} to pickup`
                    );
                }
            }

            const totalKm =
                totalRouteKmRef.current ||
                computePathDistanceKm(routeCoords) ||
                calculateAirDistanceKm(pCoords[0], pCoords[1], dCoords[0], dCoords[1]) ||
                0;
            if (totalKm > 0) {
                setLiveRemainingDistanceText(`${Math.round(totalKm)} km`);
            }
        } else if (trackingStage === 'delivered') {
            // Delivered / Completed: Stop live tracking animation and display completed shipment state
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
                animFrameRef.current = null;
            }
            L.polyline(routeCoords, {
                color: '#94A3B8',
                weight: 5,
                opacity: 0.88,
                lineCap: 'round',
                lineJoin: 'round',
            }).addTo(dynamicGroup);
            setLiveRemainingDistanceText('0 km');
            setLiveRemainingDurationText('Delivered');
        } else {
            // Booked / Assigned stage: show planned pickup-to-delivery route
            L.polyline(routeCoords, {
                color: '#111827',
                weight: 5,
                opacity: 0.96,
                lineCap: 'round',
                lineJoin: 'round',
            }).addTo(dynamicGroup);
            setLiveRemainingDistanceText('');
            setLiveRemainingDurationText('');
        }

        // Driver Marker Lifecycle:
        // - Stop live marker on 'delivered'
        // - Only display driver marker when real persisted/live coordinates exist (no mock coordinates)
        if (trackingStage === 'delivered' || !liveDriverPos) {
            if (animFrameRef.current) {
                cancelAnimationFrame(animFrameRef.current);
                animFrameRef.current = null;
            }
            if (driverMarkerRef.current) {
                driverMarkerRef.current.remove();
                driverMarkerRef.current = null;
            }
            prevDriverPosRef.current = null;
            return;
        }

        const accentColor = trackingStage === 'heading_to_pickup' ? '#F97316' : '#1A73E8';

        const driverPopupHtml = `<div style="font-family: Inter, system-ui, sans-serif; font-size: 12px; line-height: 1.4;">
            <div style="font-weight: 800; color: #0f172a;">${
                driverName && driverName !== '-' ? driverName : 'Assigned Driver'
            }${vehiclePlate && vehiclePlate !== '-' ? ` (${vehiclePlate})` : ''}</div>
            <div style="color: #475569; font-weight: 600; margin-top: 2px;">${
                liveDriverAddress || 'Live GPS Active'
            }</div>
        </div>`;

        if (!driverMarkerRef.current) {
            const marker = L.marker(liveDriverPos, {
                icon: createCleanDriverNavigationIcon(accentColor, true),
                zIndexOffset: 500,
            }).addTo(map);
            marker.bindPopup(driverPopupHtml);
            driverMarkerRef.current = marker;
            prevDriverPosRef.current = liveDriverPos;
        } else {
            const marker = driverMarkerRef.current;
            marker.setIcon(createCleanDriverNavigationIcon(accentColor, true));
            marker.setPopupContent(driverPopupHtml);

            const startPos = prevDriverPosRef.current || [
                marker.getLatLng().lat,
                marker.getLatLng().lng,
            ];
            const dLat = liveDriverPos[0] - startPos[0];
            const dLng = liveDriverPos[1] - startPos[1];

            // Smoothly interpolate marker position via requestAnimationFrame if coordinates changed
            if (Math.abs(dLat) > 0.00001 || Math.abs(dLng) > 0.00001) {
                if (animFrameRef.current) {
                    cancelAnimationFrame(animFrameRef.current);
                }
                const durationMs = 1100;
                const startTime = performance.now();

                const stepAnimation = (now: number) => {
                    const elapsed = now - startTime;
                    const t = Math.min(1, elapsed / durationMs);
                    // Cubic ease-out
                    const ease = 1 - Math.pow(1 - t, 3);
                    const curLat = startPos[0] + dLat * ease;
                    const curLng = startPos[1] + dLng * ease;
                    marker.setLatLng([curLat, curLng]);

                    if (t < 1) {
                        animFrameRef.current = requestAnimationFrame(stepAnimation);
                    } else {
                        prevDriverPosRef.current = liveDriverPos;
                        animFrameRef.current = null;
                    }
                };
                animFrameRef.current = requestAnimationFrame(stepAnimation);
            } else {
                marker.setLatLng(liveDriverPos);
                prevDriverPosRef.current = liveDriverPos;
            }
        }

        // Update route bounds with driver's current position (without forcing zoom reset if user panned)
        const updatedBounds = L.latLngBounds([pCoords, dCoords, liveDriverPos]);
        routeCoords.forEach((pt) => updatedBounds.extend(pt));
        routeBoundsRef.current = updatedBounds;
    }, [
        mapLoaded,
        driverLat,
        driverLng,
        hasLiveDriverCoords,
        trackingStage,
        driverName,
        vehiclePlate,
        liveDriverAddress,
        dynamicLegVersion,
        fromCity,
        toCity,
        pCoords[0],
        pCoords[1],
        dCoords[0],
        dCoords[1],
    ]);

    return {
        mapContainerRef,
        mapLoaded,
        mapError,
        mapType,
        setMapType,
        trackingStage,
        hasExactCoordinates,
        hasLiveDriverCoords,
        googleMapsUrl,
        embedMapSrc,
        routesSummary,
        liveDistanceText,
        liveDurationText,
        liveRemainingDistanceText,
        liveRemainingDurationText,
        liveDriverAddress,
        focusOnProduct,
        fitFullRoute,
    };
};

export default useCustomerOrderMap;
