import { calculateAirDistanceKm, extractCoordinatesFromAddress } from '@/utils/geoDistance';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCallback, useEffect, useRef, useState } from 'react';

export type DriverTrackingStage =
    | 'booked'
    | 'heading_to_pickup'
    | 'picked_up'
    | 'in_transit'
    | 'delivered';

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
}

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
    productCurrentAddress = '',
    driverName = '',
    vehiclePlate = '',
}: UseCustomerOrderMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const driverMarkerRef = useRef<L.Marker | null>(null);
    const routeBoundsRef = useRef<L.LatLngBounds | null>(null);

    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [mapType, setMapTypeState] = useState<'roadmap' | 'satellite'>('roadmap');
    const [routesSummary] = useState<Array<{ summary: string; distance: string; duration: string }>>(
        []
    );
    const [liveDistanceText, setLiveDistanceText] = useState<string>('');
    const [liveDurationText, setLiveDurationText] = useState<string>('');

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
        23.8103, 90.4125,
    ]);
    const dCoords = resolveValidCoords(deliveryLat, deliveryLng, deliveryAddress, toCity, [
        21.4272, 92.0058,
    ]);

    const hasExactCoordinates = true;

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${pCoords[0]},${pCoords[1]}&destination=${dCoords[0]},${dCoords[1]}${hasLiveDriverCoords ? `&waypoints=${driverLat},${driverLng}` : ''
        }&travelmode=driving`;

    const mapTypeParam = mapType === 'satellite' ? 'k' : 'm';
    const embedMapSrc = `https://maps.google.com/maps?saddr=${pCoords[0]},${pCoords[1]}&daddr=${dCoords[0]},${dCoords[1]}&t=${mapTypeParam}&z=8&output=embed`;

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
            map.setView(marker.getLatLng(), 11, { animate: true });
            marker.openPopup();
        }
    }, []);

    const fitFullRoute = useCallback(() => {
        const map = mapInstanceRef.current;
        const bounds = routeBoundsRef.current;
        if (map && bounds) {
            map.fitBounds(bounds, { padding: [45, 45] });
        }
    }, []);

    useEffect(() => {
        if (!mapContainerRef.current || fromCity === '-' || toCity === '-') return;

        let isCancelled = false;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }

        const map = L.map(mapContainerRef.current, {
            center: pCoords,
            zoom: 7,
            zoomControl: false,
            attributionControl: false,
        });
        mapInstanceRef.current = map;

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

        // Helper for Pickup & Destination Pin with floating white callout card (matching mockup)
        const createPinWithLabelIcon = (
            pinColor: string,
            cityText: string,
            subLabel: string
        ) => {
            return L.divIcon({
                className: 'cd-custom-route-pin',
                html: `
                    <div style="position: relative; display: flex; align-items: center; pointer-events: auto;">
                        <div style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); shrink: 0;">
                            <svg width="28" height="36" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
                                <ellipse cx="12" cy="30" rx="4" ry="1.5" fill="rgba(0,0,0,0.25)"/>
                                <path d="M12 2C6.48 2 2 6.48 2 12c0 7.2 10 17.5 10 17.5S22 19.2 22 12c0-5.52-4.48-10-10-10z" fill="${pinColor}" stroke="#ffffff" stroke-width="1.5"/>
                                <circle cx="12" cy="12" r="4" fill="#ffffff"/>
                            </svg>
                        </div>
                        <div style="
                            margin-left: 4px;
                            margin-top: -10px;
                            background: #ffffff;
                            border: 1px solid #e2e8f0;
                            border-radius: 6px;
                            padding: 4px 8px;
                            box-shadow: 0 2px 6px rgba(15,23,42,0.14);
                            white-space: nowrap;
                            font-family: Inter, system-ui, sans-serif;
                            line-height: 1.2;
                        ">
                            <div style="font-size: 11.5px; font-weight: 800; color: #0f172a;">${cityText}</div>
                            <div style="font-size: 10px; font-weight: 600; color: #64748b;">(${subLabel})</div>
                        </div>
                    </div>
                `,
                iconSize: [140, 40],
                iconAnchor: [14, 34],
            });
        };

        // Helper for Live Driver Truck Marker with floating status/location pill
        const createDriverTruckIcon = (
            badgeColor: string,
            stageBadge: string,
            locationLabel: string
        ) => {
            return L.divIcon({
                className: 'cd-cussdssssssssssswstom-driver-truck',
                html: `
                    <div style="position: relative; display: flex; flex-direction: column; align-items: center; pointer-events: auto;">

                        <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
                            <div style="
                                position: absolute;
                                width: 40px;
                                height: 40px;
                                border-radius: 9999px;
                                background: ${badgeColor};
                                opacity: 0.25;
                            "></div>
                            <div style="
                                position: relative;
                                width: 30px;
                                height: 30px;
                                border-radius: 9999px;
                                background: ${badgeColor};
                                border: 2.5px solid #ffffff;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            ">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M10 17h4V5H2v12h3"/>
                                    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/>
                                    <path d="M14 17h1"/>
                                    <circle cx="7.5" cy="17.5" r="2.5"/>
                                    <circle cx="17.5" cy="17.5" r="2.5"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                `,
                iconSize: [160, 76],
                iconAnchor: [80, 56],
            });
        };

        const renderRouteAndMarkers = (routeCoords: [number, number][]) => {
            if (isCancelled || !mapInstanceRef.current) return;

            // 1. Draw Main Road Route Line (Pickup -> Destination)
            L.polyline(routeCoords, {
                color: '#2563eb',
                weight: 5,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round',
            }).addTo(map);

            // 2. Place Pickup Pin + Floating Card
            L.marker(pCoords, {
                icon: createPinWithLabelIcon('#ff4a1f', fromCity, 'Pickup'),
                zIndexOffset: 200,
            }).addTo(map);

            // 3. Place Destination Pin + Floating Card
            L.marker(dCoords, {
                icon: createPinWithLabelIcon('#ea4335', toCity, 'Destination'),
                zIndexOffset: 200,
            }).addTo(map);

            // 4. Calculate Driver's Current Position & Status Badge
            let driverPos: [number, number] = pCoords;
            let stageBadge = 'Driver Assigned';
            let locationLabel = productCurrentAddress || fromCity;
            let badgeColor = '#2563eb';

            if (hasLiveDriverCoords) {
                driverPos = [Number(driverLat), Number(driverLng)];
            } else if (trackingStage === 'delivered') {
                driverPos = dCoords;
                stageBadge = 'Delivered';
                locationLabel = toCity;
                badgeColor = '#10b981';
            } else if (trackingStage === 'in_transit' && routeCoords.length > 2) {
                const midIdx = Math.floor(routeCoords.length * 0.52);
                driverPos = routeCoords[midIdx];
                stageBadge = 'In Transit (Pickup Done)';
                locationLabel =
                    productCurrentAddress && !productCurrentAddress.includes('→')
                        ? productCurrentAddress
                        : `En Route → ${toCity}`;
                badgeColor = '#2563eb';
            } else if (trackingStage === 'picked_up' && routeCoords.length > 2) {
                const departedIdx = Math.max(1, Math.floor(routeCoords.length * 0.25));
                driverPos = routeCoords[departedIdx];
                stageBadge = 'Pickup Completed';
                locationLabel = `Departed ${fromCity} → ${toCity}`;
                badgeColor = '#10b981';
            } else if (trackingStage === 'heading_to_pickup') {
                // Driver is going TO Pickup location (Pickup NOT done yet)
                const latDiff = dCoords[0] - pCoords[0];
                const lngDiff = dCoords[1] - pCoords[1];
                const offsetLat = (latDiff >= 0 ? -1 : 1) * Math.max(0.08, Math.abs(latDiff) * 0.18);
                const offsetLng = (lngDiff >= 0 ? -1 : 1) * Math.max(0.08, Math.abs(lngDiff) * 0.18);
                driverPos = [pCoords[0] + offsetLat, pCoords[1] + offsetLng];
                stageBadge = 'Going to Pickup';
                locationLabel = `Approaching ${fromCity}`;
                badgeColor = '#ff4a1f';

                // Draw dashed orange line from Driver -> Pickup
                L.polyline([driverPos, pCoords], {
                    color: '#ff4a1f',
                    weight: 4,
                    dashArray: '8, 8',
                    opacity: 0.95,
                }).addTo(map);
            } else {
                // Booked / Awaiting Driver
                const latDiff = dCoords[0] - pCoords[0];
                const lngDiff = dCoords[1] - pCoords[1];
                driverPos = [
                    pCoords[0] + latDiff * 0.08,
                    pCoords[1] + lngDiff * 0.08,
                ];
                stageBadge = 'At Pickup';
                locationLabel = fromCity;
                badgeColor = '#ff4a1f';
            }

            // Highlight completed portion of the route when pickup is done / in transit
            if (
                (trackingStage === 'picked_up' || trackingStage === 'in_transit') &&
                routeCoords.length > 2
            ) {
                const progressRatio = trackingStage === 'in_transit' ? 0.52 : 0.25;
                const splitIdx = Math.max(2, Math.floor(routeCoords.length * progressRatio));
                const completedSegment = routeCoords.slice(0, splitIdx + 1);
                L.polyline(completedSegment, {
                    color: '#10b981',
                    weight: 5,
                    opacity: 0.95,
                }).addTo(map);
            }

            const driverMarker = L.marker(driverPos, {
                icon: createDriverTruckIcon(badgeColor, stageBadge, locationLabel),
                zIndexOffset: 500,
            }).addTo(map);
            driverMarkerRef.current = driverMarker;

            const bounds = L.latLngBounds([pCoords, dCoords, driverPos]);
            routeBoundsRef.current = bounds;
            map.fitBounds(bounds, { padding: [50, 50] });
            setMapLoaded(true);
            setMapError(false);
        };

        // Fetch real road geometry from OSRM public routing service
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${pCoords[1]},${pCoords[0]};${dCoords[1]},${dCoords[0]}?overview=full&geometries=geojson`;
        fetch(osrmUrl)
            .then((res) => res.json())
            .then((data) => {
                if (isCancelled) return;
                const route = data?.routes?.[0];
                if (route?.geometry?.coordinates?.length > 1) {
                    const coords: [number, number][] = route.geometry.coordinates.map(
                        (c: [number, number]) => [c[1], c[0]]
                    );
                    if (route.distance) {
                        const km = Math.round(route.distance / 1000);
                        setLiveDistanceText(`${km.toLocaleString()} km`);
                    }
                    if (route.duration) {
                        const totalMins = Math.round(route.duration / 60);
                        const hrs = Math.floor(totalMins / 60);
                        const mins = totalMins % 60;
                        setLiveDurationText(hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`);
                    }
                    renderRouteAndMarkers(coords);
                } else {
                    const airKm = calculateAirDistanceKm(
                        pCoords[0],
                        pCoords[1],
                        dCoords[0],
                        dCoords[1]
                    );
                    if (airKm) setLiveDistanceText(`${airKm} km`);
                    renderRouteAndMarkers([pCoords, dCoords]);
                }
            })
            .catch(() => {
                if (isCancelled) return;
                const airKm = calculateAirDistanceKm(
                    pCoords[0],
                    pCoords[1],
                    dCoords[0],
                    dCoords[1]
                );
                if (airKm) setLiveDistanceText(`${airKm} km`);
                renderRouteAndMarkers([pCoords, dCoords]);
            });

        return () => {
            isCancelled = true;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [
        pCoords[0],
        pCoords[1],
        dCoords[0],
        dCoords[1],
        driverLat,
        driverLng,
        fromCity,
        toCity,
        rawStatus,
        trackingStage,
        productCurrentAddress,
        hasLiveDriverCoords,
    ]); // eslint-disable-line react-hooks/exhaustive-deps

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
        focusOnProduct,
        fitFullRoute,
    };
};

export default useCustomerOrderMap;
