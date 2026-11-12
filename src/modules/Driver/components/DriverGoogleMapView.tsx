import { getGoogleMapsApiKey } from '@/components/googlePlacesService';
import {
    fetchGoogleDrivingRoute,
    fetchGoogleDrivingRoutes,
    formatGoogleDistance,
    formatGoogleDuration,
} from '@/utils/googlePlacesGeocoding';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    Crosshair,
    Navigation,
    RotateCcw,
    Route as RouteIcon,
    Zap
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MapSkeletonPlaceholder } from './MapSkeletonPlaceholder';

export interface RouteOption {
    index: number;
    label: string;
    duration: string;
    distance: string;
    points: [number, number][];
}

export interface DriverGoogleMapViewProps {
    originCoords: [number, number];
    destCoords: [number, number];
    driverCoords?: [number, number] | null;
    originTitle?: string;
    originAddress?: string;
    destTitle?: string;
    destAddress?: string;
    customRoutePoints?: [number, number][];
    alternativeRoutePoints?: [number, number][];
    alternative2RoutePoints?: [number, number][];
    trafficEnabled?: boolean;
    selectedRouteIndex?: number;
    onRouteChange?: (index: number) => void;
    onRoutesLoaded?: (routes: RouteOption[]) => void;
    showFloatingCard?: boolean;
    showRouteSummaryCards?: boolean;
    showStartNavigationButton?: boolean;
    onStartNavigation?: () => void;
    onLocateMe?: () => void;
    isLocating?: boolean;
    autoCenterDriver?: boolean;
    recenterTrigger?: number;
    height?: string | number;
    className?: string;
    borderless?: boolean;
}

export const DriverGoogleMapView: React.FC<DriverGoogleMapViewProps> = ({
    originCoords,
    destCoords,
    driverCoords,
    originTitle = 'Pickup Location',
    originAddress = 'Pickup Address',
    destTitle = 'Destination Location',
    destAddress = 'Delivery Address',
    customRoutePoints,
    alternativeRoutePoints,
    alternative2RoutePoints,
    trafficEnabled = true,
    selectedRouteIndex = 0,
    onRouteChange,
    onRoutesLoaded,
    showFloatingCard = true,
    showRouteSummaryCards = true,
    showStartNavigationButton = true,
    onStartNavigation,
    onLocateMe,
    isLocating = false,
    autoCenterDriver = false,
    recenterTrigger,
    height = '320px',
    className = '',
    borderless = false,
}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const tileLayerRef = useRef<L.TileLayer | null>(null);
    const routeLayersRef = useRef<{ [key: number]: L.Polyline }>({});
    const shadowLayersRef = useRef<{ [key: number]: L.Polyline }>({});
    const clickTargetLayersRef = useRef<{ [key: number]: L.Polyline }>({});
    const routeBadgeMarkersRef = useRef<L.Marker[]>([]);
    const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
    const driverMarkerRef = useRef<L.Marker | null>(null);
    const hasFitInitialBoundsRef = useRef<boolean>(false);
    const hasAdjustedForDriverRef = useRef<boolean>(false);
    const forceRecenterOnNextPosRef = useRef<boolean>(false);
    const lastRouteFingerprintRef = useRef<string>('');
    const lastCenteredPosRef = useRef<[number, number] | null>(null);
    const apiKeyRef = useRef<string>('');

    const [activeRouteIndex, setActiveRouteIndex] = useState<number>(selectedRouteIndex);
    const [liveTraffic, setLiveTraffic] = useState<boolean>(trafficEnabled);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [routes, setRoutes] = useState<RouteOption[]>([]);
    const [activeEta, setActiveEta] = useState<{ duration: string; distance: string }>({
        duration: '35 min',
        distance: '22.1 km',
    });

    // Sync selected route from parent
    useEffect(() => {
        if (selectedRouteIndex !== activeRouteIndex) {
            setActiveRouteIndex(selectedRouteIndex);
        }
    }, [selectedRouteIndex]);

    const handleSelectRoute = (idx: number) => {
        setActiveRouteIndex(idx);
        if (onRouteChange) {
            onRouteChange(idx);
        }
    };

    // 1. Leaflet custom markers
    // Pickup Marker: Orange Google-Style Pin with Truck Icon
    const createPickupPinIcon = () => {
        return L.divIcon({
            className: 'cd-pickup-truck-pin',
            html: `
                <div style="position: relative; width: 34px; height: 46px; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.32)); cursor: pointer;">
                    <svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 0C7.61 0 0 7.61 0 17C0 27.2 14.5 44.5 16.1 45.4C16.6 45.7 17.4 45.7 17.9 45.4C19.5 44.5 34 27.2 34 17C34 7.61 26.39 0 17 0Z" fill="#FF5722" stroke="#FFFFFF" stroke-width="2"/>
                        <circle cx="17" cy="17" r="10.5" fill="#FFFFFF"/>
                    </svg>
                    <div style="position: absolute; top: 7px; left: 7px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; color: #FF5722;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5722" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="1" y="3" width="15" height="13"></rect>
                            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                            <circle cx="5.5" cy="18.5" r="2.5"></circle>
                            <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                    </div>
                </div>
            `,
            iconSize: [34, 46],
            iconAnchor: [17, 46],
        });
    };

    // Delivery Marker: Red Google-Style Pin with Flag Icon
    const createDeliveryPinIcon = () => {
        return L.divIcon({
            className: 'cd-delivery-flag-pin',
            html: `
                <div style="position: relative; width: 34px; height: 46px; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.32)); cursor: pointer;">
                    <svg width="34" height="46" viewBox="0 0 34 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 0C7.61 0 0 7.61 0 17C0 27.2 14.5 44.5 16.1 45.4C16.6 45.7 17.4 45.7 17.9 45.4C19.5 44.5 34 27.2 34 17C34 7.61 26.39 0 17 0Z" fill="#EF4444" stroke="#FFFFFF" stroke-width="2"/>
                        <circle cx="17" cy="17" r="10.5" fill="#FFFFFF"/>
                    </svg>
                    <div style="position: absolute; top: 7px; left: 7px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; color: #EF4444;">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                            <line x1="4" y1="22" x2="4" y2="15"></line>
                        </svg>
                    </div>
                </div>
            `,
            iconSize: [34, 46],
            iconAnchor: [17, 46],
        });
    };

    // Driver Marker: Blue Circular Disc with Pulsing Halo and 'Live Location' Badge Pill
    const createDriverVehicleIcon = () => {
        return L.divIcon({
            className: 'cd-driver-live-vehicle',
            html: `
                <div style="position: relative; display: flex; align-items: center; pointer-events: auto;">
                    <style>
                        @keyframes cd-pulse-ring {
                            0% { transform: scale(0.9); opacity: 0.85; }
                            50% { transform: scale(1.45); opacity: 0.2; }
                            100% { transform: scale(0.9); opacity: 0.85; }
                        }
                    </style>
                    <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                        <div style="position: absolute; width: 40px; height: 40px; border-radius: 9999px; background: rgba(37,99,235,0.35); animation: cd-pulse-ring 2s infinite ease-in-out;"></div>
                        <div style="position: relative; width: 28px; height: 28px; border-radius: 9999px; background: #2563EB; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFFFFF">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
                                <circle cx="7.5" cy="14.5" r="1.5"/>
                                <circle cx="16.5" cy="14.5" r="1.5"/>
                            </svg>
                        </div>
                    </div>
                    <div style="margin-left: -4px; background: #2563EB; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 3px 8px 3px 6px; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.25); display: flex; align-items: center; gap: 4px; white-space: nowrap; font-family: Inter, system-ui, sans-serif;">
                        <span style="width: 6px; height: 6px; border-radius: 9999px; background: #4ADE80; display: inline-block;"></span>
                        <span>My Live Location</span>
                    </div>
                </div>
            `,
            iconSize: [150, 44],
            iconAnchor: [22, 22],
        });
    };

    // Google-style interactive floating route badge pinned along polyline
    const createGoogleRouteBadgeIcon = (route: RouteOption, isSelected: boolean) => {
        const carSvg = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="${isSelected ? '#FFFFFF' : '#475569'}" style="flex-shrink: 0;">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
                <circle cx="7.5" cy="14.5" r="1.5"/>
                <circle cx="16.5" cy="14.5" r="1.5"/>
            </svg>
        `;

        if (isSelected) {
            return L.divIcon({
                className: 'cd-google-route-badge-selected',
                html: `
                    <div style="position: relative; display: inline-flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 4px 12px rgba(26,115,232,0.45)); transform: translate(-50%, -100%); transition: transform 0.15s ease;">
                        <div style="background: #1A73E8; color: #FFFFFF; padding: 5px 10px; border-radius: 6px; border: 1.5px solid #FFFFFF; display: flex; flex-direction: column; align-items: center; min-width: 68px; text-align: center; font-family: Roboto, system-ui, sans-serif;">
                            <div style="display: flex; align-items: center; gap: 4px; font-weight: 800; font-size: 13px; line-height: 1.1; white-space: nowrap;">
                                ${carSvg}
                                <span>${route.duration}</span>
                            </div>
                            <div style="font-size: 10.5px; font-weight: 600; opacity: 0.95; margin-top: 2px; white-space: nowrap;">
                                ${route.distance}
                            </div>
                        </div>
                        <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid #1A73E8; margin-top: -1px;"></div>
                    </div>
                `,
                iconSize: [80, 44],
                iconAnchor: [40, 44],
            });
        }

        return L.divIcon({
            className: 'cd-google-route-badge-alt',
            html: `
                <div style="position: relative; display: inline-flex; flex-direction: column; align-items: center; cursor: pointer; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.18)); transform: translate(-50%, -100%); transition: transform 0.15s ease;">
                    <div style="background: #FFFFFF; color: #1E293B; padding: 4px 9px; border-radius: 6px; border: 1.5px solid #CBD5E1; display: flex; flex-direction: column; align-items: center; min-width: 64px; text-align: center; font-family: Roboto, system-ui, sans-serif;">
                        <div style="display: flex; align-items: center; gap: 4px; font-weight: 800; font-size: 12px; line-height: 1.1; color: #1E293B; white-space: nowrap;">
                            ${carSvg}
                            <span>${route.duration}</span>
                        </div>
                        <div style="font-size: 10px; font-weight: 600; color: #64748B; margin-top: 1px; white-space: nowrap;">
                            ${route.distance}
                        </div>
                    </div>
                    <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 5px solid #CBD5E1; margin-top: -1px;"></div>
                </div>
            `,
            iconSize: [76, 40],
            iconAnchor: [38, 40],
        });
    };

    // Helper: generate smooth alternative curved routes matching mobile app
    const generateAlternativeCurve = (
        base: [number, number][],
        offsetKm: number
    ): [number, number][] => {
        if (base.length < 3) return base;
        const result: [number, number][] = [];
        const n = base.length;
        for (let i = 0; i < n; i++) {
            if (i === 0 || i === n - 1) {
                result.push(base[i]);
            } else {
                const t = i / (n - 1);
                const factor = Math.sin(t * Math.PI);
                const dLat = (offsetKm / 111.0) * factor * 0.4;
                const dLng = (offsetKm / 111.0) * factor * 0.8;
                result.push([base[i][0] + dLat, base[i][1] + dLng]);
            }
        }
        return result;
    };

    // 2. Initialize Leaflet Map
    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapInstanceRef.current) return;

        let timers: NodeJS.Timeout[] = [];
        let resizeObserver: ResizeObserver | null = null;
        const triggerInvalidate = () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.invalidateSize({ pan: false });
            }
        };

        try {
            const map = L.map(mapContainerRef.current, {
                center: originCoords,
                zoom: 12,
                zoomControl: false,
                attributionControl: false,
                dragging: true,
                scrollWheelZoom: true,
            });

            // Google Maps Tile Layer
            const lyrs = liveTraffic ? 'm,traffic' : 'm';
            const tileLayer = L.tileLayer(
                `https://mt{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}`,
                {
                    maxZoom: 19,
                    subdomains: ['0', '1', '2', '3'],
                    attribution: '© Google Maps',
                    keepBuffer: 10,
                    updateWhenIdle: false,
                    updateInterval: 50,
                }
            ).addTo(map);
            tileLayerRef.current = tileLayer;

            // Per-tile retry on glitch (never replace whole map with OSM)
            tileLayer.on('tileerror', (err: any) => {
                const tile = err?.tile as HTMLImageElement | undefined;
                const coords = err?.coords;
                if (tile && coords && !tile.dataset.retried) {
                    tile.dataset.retried = 'true';
                    const key = apiKeyRef.current;
                    const keyParam = key ? `&key=${key}` : '';
                    tile.src = `https://mt1.google.com/vt/lyrs=${lyrs}&x=${coords.x}&y=${coords.y}&z=${coords.z}${keyParam}`;
                }
            });

            getGoogleMapsApiKey().then((key) => {
                if (key) {
                    apiKeyRef.current = key;
                    if (mapInstanceRef.current && tileLayerRef.current) {
                        tileLayerRef.current.setUrl(
                            `https://mt{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}&key=${key}`
                        );
                    }
                }
            });

            const markersGroup = L.layerGroup().addTo(map);
            markersLayerGroupRef.current = markersGroup;

            mapInstanceRef.current = map;

            // Aggressive multi-step invalidation ensures tiles load 100% immediately without requiring user scroll
            requestAnimationFrame(triggerInvalidate);
            timers = [50, 150, 300, 600, 1000, 1500].map((t) =>
                setTimeout(triggerInvalidate, t)
            );

            if (mapContainerRef.current && typeof ResizeObserver !== 'undefined') {
                resizeObserver = new ResizeObserver(() => {
                    triggerInvalidate();
                });
                resizeObserver.observe(mapContainerRef.current);
            }

            window.addEventListener('resize', triggerInvalidate, { passive: true });
            window.addEventListener('scroll', triggerInvalidate, { passive: true });
        } catch (e) {
            console.warn('DriverGoogleMapView Leaflet initialization warning:', e);
        }

        return () => {
            timers.forEach(clearTimeout);
            window.removeEventListener('resize', triggerInvalidate);
            window.removeEventListener('scroll', triggerInvalidate);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            if (driverMarkerRef.current) {
                driverMarkerRef.current.remove();
                driverMarkerRef.current = null;
            }
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markersLayerGroupRef.current = null;
                tileLayerRef.current = null;
            }
        };
    }, []);

    // 3. Update Tile Layer on Live Traffic toggle
    useEffect(() => {
        if (tileLayerRef.current) {
            const lyrs = liveTraffic ? 'm,traffic' : 'm';
            getGoogleMapsApiKey().then((key) => {
                const keyParam = key ? `&key=${key}` : '';
                tileLayerRef.current?.setUrl(
                    `https://mt{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}${keyParam}`
                );
            });
        }
    }, [liveTraffic]);

    // 4. Load Real Road geometry from Google Routes API with all real alternatives
    useEffect(() => {
        let isCancelled = false;

        const buildAndSetRoutes = (
            primaryPoints: [number, number][],
            distKm: number,
            durSeconds: number,
            primaryLabel: string = 'Fastest'
        ) => {
            const alt1Points =
                alternativeRoutePoints && alternativeRoutePoints.length > 2
                    ? alternativeRoutePoints
                    : generateAlternativeCurve(primaryPoints, -1.8);

            const alt2Points =
                alternative2RoutePoints && alternative2RoutePoints.length > 2
                    ? alternative2RoutePoints
                    : generateAlternativeCurve(primaryPoints, 2.3);

            const r0: RouteOption = {
                index: 0,
                label: primaryLabel,
                duration: formatGoogleDuration(durSeconds),
                distance: formatGoogleDistance(distKm * 1000),
                points: primaryPoints,
            };

            const r1: RouteOption = {
                index: 1,
                label: 'Alternative 1',
                duration: formatGoogleDuration(Math.round(durSeconds * 1.12)),
                distance: formatGoogleDistance(distKm * 1.11 * 1000),
                points: alt1Points,
            };

            const r2: RouteOption = {
                index: 2,
                label: 'Alternative 2',
                duration: formatGoogleDuration(Math.round(durSeconds * 1.25)),
                distance: formatGoogleDistance(distKm * 1.21 * 1000),
                points: alt2Points,
            };

            if (!isCancelled) {
                const computed = [r0, r1, r2];
                setRoutes(computed);
                setIsLoading(false);
                const fingerprint = `${r0.points.length}_${r0.distance}_${r0.duration}`;
                if (onRoutesLoaded && lastRouteFingerprintRef.current !== fingerprint) {
                    lastRouteFingerprintRef.current = fingerprint;
                    onRoutesLoaded(computed);
                }
            }
        };

        if (customRoutePoints && customRoutePoints.length > 1) {
            buildAndSetRoutes(customRoutePoints, 22.1, 2100);
            return;
        }

        const fetchOsrmFallback = () => {
            const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${originCoords[1]},${originCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson&alternatives=true`;

            fetch(osrmUrl)
                .then((res) => res.json())
                .then((data) => {
                    if (isCancelled) return;
                    const r0 = data?.routes?.[0];
                    if (r0?.geometry?.coordinates && r0.geometry.coordinates.length > 1) {
                        const primaryPoints: [number, number][] = r0.geometry.coordinates.map(
                            (c: [number, number]) => [c[1], c[0]]
                        );
                        const distKm = r0.distance ? r0.distance / 1000 : 22.1;
                        const durSecs = r0.duration ? Math.round(r0.duration) : 2100;
                        buildAndSetRoutes(primaryPoints, distKm, durSecs);
                    } else {
                        const directPoints: [number, number][] = [
                            originCoords,
                            [(originCoords[0] + destCoords[0]) / 2, (originCoords[1] + destCoords[1]) / 2],
                            destCoords,
                        ];
                        buildAndSetRoutes(directPoints, 22.1, 2100);
                    }
                })
                .catch(() => {
                    if (!isCancelled) {
                        const directPoints: [number, number][] = [
                            originCoords,
                            destCoords,
                        ];
                        buildAndSetRoutes(directPoints, 22.1, 2100);
                    }
                });
        };

        // 1. Fetch real road geometry and all alternatives directly from Google Routes API
        fetchGoogleDrivingRoutes(originCoords, destCoords)
            .then((googleRoutes) => {
                if (isCancelled) return;
                if (googleRoutes && googleRoutes.length > 0) {
                    if (googleRoutes.length >= 2) {
                        const computed: RouteOption[] = googleRoutes.map((r, i) => ({
                            index: i,
                            label: r.label,
                            duration: r.durationText,
                            distance: r.distanceText,
                            points: r.points,
                        }));
                        setRoutes(computed);
                        setIsLoading(false);
                        const fingerprint = `${computed[0].points.length}_${computed[0].distance}_${computed[0].duration}`;
                        if (onRoutesLoaded && lastRouteFingerprintRef.current !== fingerprint) {
                            lastRouteFingerprintRef.current = fingerprint;
                            onRoutesLoaded(computed);
                        }
                    } else {
                        const primary = googleRoutes[0];
                        buildAndSetRoutes(primary.points, primary.distanceKm, primary.durationMinutes * 60, primary.label);
                    }
                    return;
                }
                fetchOsrmFallback();
            })
            .catch(() => {
                if (!isCancelled) fetchOsrmFallback();
            });

        return () => {
            isCancelled = true;
        };
    }, [originCoords?.[0], originCoords?.[1], destCoords?.[0], destCoords?.[1], customRoutePoints]);

    // When route loading finishes (skeleton disappears), invalidate map size to fit full visible container
    useEffect(() => {
        if (!isLoading && mapInstanceRef.current) {
            const map = mapInstanceRef.current;
            map.invalidateSize({ pan: false });
            setTimeout(() => {
                if (!mapInstanceRef.current) return;
                mapInstanceRef.current.invalidateSize({ pan: false });
            }, 100);

            // Re-fit bounds now that container has full visible dimensions
            const selectedRoute = routes.find((r) => r.index === activeRouteIndex) || routes[0];
            if (selectedRoute && selectedRoute.points.length > 0) {
                try {
                    const boundsPoints: [number, number][] = [...selectedRoute.points, originCoords, destCoords];
                    if (driverCoords && driverCoords[0] !== 0 && driverCoords[1] !== 0) {
                        boundsPoints.push(driverCoords);
                    }
                    map.fitBounds(L.latLngBounds(boundsPoints), { padding: [45, 45], maxZoom: 15 });
                } catch (_) { }
            }
        }
    }, [isLoading]);

    // 5. Draw routes and fixed markers (pickup & delivery) whenever routes or activeRouteIndex changes
    useEffect(() => {
        const map = mapInstanceRef.current;
        const markersGroup = markersLayerGroupRef.current;
        if (!map || !markersGroup || routes.length === 0) return;

        // Clear existing polylines, click targets & route badge markers
        Object.values(routeLayersRef.current).forEach((pl) => map.removeLayer(pl));
        Object.values(shadowLayersRef.current).forEach((pl) => map.removeLayer(pl));
        Object.values(clickTargetLayersRef.current).forEach((pl) => map.removeLayer(pl));
        routeLayersRef.current = {};
        shadowLayersRef.current = {};
        clickTargetLayersRef.current = {};
        routeBadgeMarkersRef.current.forEach((m) => m.remove());
        routeBadgeMarkersRef.current = [];
        markersGroup.clearLayers();

        // 1. Draw Alternative non-selected routes first (Google Maps pastel slate-blue with wide click target)
        routes.forEach((route) => {
            if (route.index !== activeRouteIndex) {
                // Wide invisible click-target line for super easy clicking anywhere along the route
                const clickTarget = L.polyline(route.points, {
                    color: '#3B82F6',
                    weight: 24,
                    opacity: 0,
                    lineCap: 'round',
                    lineJoin: 'round',
                }).addTo(map);

                // Visible alternative route line
                const visiblePolyline = L.polyline(route.points, {
                    color: '#8AB4F8',
                    weight: 5.5,
                    opacity: 0.85,
                    lineCap: 'round',
                    lineJoin: 'round',
                }).addTo(map);

                // Pointer cursor & hover highlight
                const onOver = () => {
                    visiblePolyline.setStyle({ color: '#3B82F6', weight: 6.5, opacity: 1 });
                    const el1 = clickTarget.getElement() as HTMLElement | null;
                    const el2 = visiblePolyline.getElement() as HTMLElement | null;
                    if (el1) el1.style.cursor = 'pointer';
                    if (el2) el2.style.cursor = 'pointer';
                };
                const onOut = () => {
                    visiblePolyline.setStyle({ color: '#8AB4F8', weight: 5.5, opacity: 0.85 });
                };

                clickTarget.on('mouseover', onOver);
                clickTarget.on('mouseout', onOut);
                visiblePolyline.on('mouseover', onOver);
                visiblePolyline.on('mouseout', onOut);

                const selectThisRoute = (e: L.LeafletMouseEvent) => {
                    L.DomEvent.stopPropagation(e);
                    handleSelectRoute(route.index);
                };
                clickTarget.on('click', selectThisRoute);
                visiblePolyline.on('click', selectThisRoute);

                clickTargetLayersRef.current[route.index] = clickTarget;
                routeLayersRef.current[route.index] = visiblePolyline;
            }
        });

        // 2. Draw Selected Route in Vibrant Navigation Blue (#1A73E8)
        const selectedRoute = routes.find((r) => r.index === activeRouteIndex) || routes[0];
        if (selectedRoute) {
            // Glow shadow line
            const shadowPolyline = L.polyline(selectedRoute.points, {
                color: '#93C5FD',
                weight: 10,
                opacity: 0.5,
                lineCap: 'round',
                lineJoin: 'round',
            }).addTo(map);
            shadowLayersRef.current[selectedRoute.index] = shadowPolyline;

            // Main sharp route
            const mainPolyline = L.polyline(selectedRoute.points, {
                color: '#1A73E8',
                weight: 6,
                opacity: 0.98,
                lineCap: 'round',
                lineJoin: 'round',
            }).addTo(map);
            routeLayersRef.current[selectedRoute.index] = mainPolyline;

            // Realistic traffic flow overlays along selected route (Orange/Red congestion)
            if (liveTraffic && selectedRoute.points.length >= 8) {
                const totalPts = selectedRoute.points.length;
                const mStart = Math.floor(totalPts * 0.36);
                const mEnd = Math.floor(totalPts * 0.50);
                if (mEnd > mStart) {
                    const modTraffic = L.polyline(selectedRoute.points.slice(mStart, mEnd + 1), {
                        color: '#F59E0B',
                        weight: 6,
                        opacity: 1,
                        lineCap: 'round',
                        lineJoin: 'round',
                    }).addTo(map);
                    shadowLayersRef.current[1001] = modTraffic;
                }
                const cStart = Math.floor(totalPts * 0.50);
                const cEnd = Math.floor(totalPts * 0.60);
                if (cEnd > cStart) {
                    const congTraffic = L.polyline(selectedRoute.points.slice(cStart, cEnd + 1), {
                        color: '#EF4444',
                        weight: 6,
                        opacity: 1,
                        lineCap: 'round',
                        lineJoin: 'round',
                    }).addTo(map);
                    shadowLayersRef.current[1002] = congTraffic;
                }
            }

            setActiveEta({
                duration: selectedRoute.duration,
                distance: selectedRoute.distance,
            });

            // Initial fit bounds ONLY ONCE so user manual zoom and pan is never disrupted
            if (!hasFitInitialBoundsRef.current) {
                try {
                    const boundsPoints: [number, number][] = [...selectedRoute.points, originCoords, destCoords];
                    if (driverCoords && driverCoords[0] !== 0 && driverCoords[1] !== 0) {
                        boundsPoints.push(driverCoords);
                    }
                    map.invalidateSize({ pan: false });
                    map.fitBounds(L.latLngBounds(boundsPoints), { padding: [50, 50], maxZoom: 15 });
                    hasFitInitialBoundsRef.current = true;
                } catch (_) { }
            }
        }

        // 3. Place Google-Style Route Badges (pills) on Map along the polylines
        routes.forEach((route) => {
            const isSelected = route.index === activeRouteIndex;
            if (route.points.length < 3) return;

            // Stagger badge positions along route so pills never overlap
            let fraction = 0.42;
            if (route.index === 1) fraction = 0.58;
            if (route.index === 2) fraction = 0.74;

            const badgeIndex = Math.min(Math.max(1, Math.floor(route.points.length * fraction)), route.points.length - 2);
            const badgeCoords = route.points[badgeIndex];

            const badgeMarker = L.marker(badgeCoords, {
                icon: createGoogleRouteBadgeIcon(route, isSelected),
                zIndexOffset: isSelected ? 700 : 450,
            }).addTo(markersGroup);

            badgeMarker.on('click', (e) => {
                L.DomEvent.stopPropagation(e);
                handleSelectRoute(route.index);
            });

            routeBadgeMarkersRef.current.push(badgeMarker);
        });

        // 3. Place Pickup Marker (Orange with Truck Icon)
        const pMarker = L.marker(originCoords, {
            icon: createPickupPinIcon(),
            zIndexOffset: 250,
        }).addTo(markersGroup);

        pMarker.bindPopup(`
            <div style="font-family: Inter, system-ui, sans-serif; padding: 4px 6px; min-width: 170px;">
                <div style="font-weight: 800; font-size: 12px; color: #EA580C;">
                    📦 Pickup Shipper
                </div>
                <div style="font-size: 11px; color: #0F172A; font-weight: 700; margin-top: 2px;">
                    ${originTitle}
                </div>
                <div style="font-size: 10px; color: #64748B; margin-top: 1px; line-height: 1.3;">
                    ${originAddress}
                </div>
            </div>
        `);

        // 4. Place Delivery Marker (Red with Flag Icon)
        const delMarker = L.marker(destCoords, {
            icon: createDeliveryPinIcon(),
            zIndexOffset: 250,
        }).addTo(markersGroup);

        delMarker.bindPopup(`
            <div style="font-family: Inter, system-ui, sans-serif; padding: 4px 6px; min-width: 170px;">
                <div style="font-weight: 800; font-size: 12px; color: #DC2626;">
                    🏁 Delivery Destination
                </div>
                <div style="font-size: 11px; color: #0F172A; font-weight: 700; margin-top: 2px;">
                    ${destTitle}
                </div>
                <div style="font-size: 10px; color: #64748B; margin-top: 1px; line-height: 1.3;">
                    ${destAddress}
                </div>
            </div>
        `);
    }, [routes, activeRouteIndex, originCoords?.[0], originCoords?.[1], destCoords?.[0], destCoords?.[1], originTitle, originAddress, destTitle, destAddress]);

    // 6. Smooth Driver Marker positioning & auto-center (independent of bounds/zoom)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        let effectiveDriverPos = driverCoords;
        if (!effectiveDriverPos || (effectiveDriverPos[0] === 0 && effectiveDriverPos[1] === 0)) {
            const selectedRoute = routes.find((r) => r.index === activeRouteIndex) || routes[0];
            if (selectedRoute && selectedRoute.points.length >= 4) {
                effectiveDriverPos = selectedRoute.points[Math.floor(selectedRoute.points.length / 3)];
            } else if (originCoords && destCoords) {
                effectiveDriverPos = [
                    originCoords[0] * 0.65 + destCoords[0] * 0.35,
                    originCoords[1] * 0.65 + destCoords[1] * 0.35,
                ];
            }
        }

        if (!effectiveDriverPos || (effectiveDriverPos[0] === 0 && effectiveDriverPos[1] === 0)) return;

        if (driverMarkerRef.current) {
            driverMarkerRef.current.setLatLng(effectiveDriverPos);
        } else {
            const dMarker = L.marker(effectiveDriverPos, {
                icon: createDriverVehicleIcon(),
                zIndexOffset: 300,
            }).addTo(map);

            dMarker.bindPopup(`
                <div style="font-family: Inter, system-ui, sans-serif; padding: 4px 6px; min-width: 170px;">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background: #10B981;"></span>
                        <span style="font-weight: 800; font-size: 12px; color: #2563EB;">
                            Your Live Location
                        </span>
                    </div>
                    <div style="font-size: 11px; color: #0F172A; font-weight: 700; margin-top: 4px;">
                        ${effectiveDriverPos[0].toFixed(5)}, ${effectiveDriverPos[1].toFixed(5)}
                    </div>
                    <div style="font-size: 10px; color: #64748B; margin-top: 2px;">
                        Live Device GPS • Active
                    </div>
                </div>
            `);

            driverMarkerRef.current = dMarker;
        }

        // When a real driver position arrives for the first time, ensure it is comfortably in view
        if (!hasAdjustedForDriverRef.current && driverCoords && driverCoords[0] !== 0 && driverCoords[1] !== 0) {
            hasAdjustedForDriverRef.current = true;
            try {
                const selectedRoute = routes.find((r) => r.index === activeRouteIndex) || routes[0];
                if (selectedRoute && selectedRoute.points.length > 0) {
                    const allBounds: [number, number][] = [...selectedRoute.points, originCoords, destCoords, driverCoords];
                    map.fitBounds(L.latLngBounds(allBounds), { padding: [50, 50], maxZoom: 15 });
                }
            } catch (_) { }
        }

        // If user explicitly triggered locate or recenter, fly smoothly to position
        if (forceRecenterOnNextPosRef.current) {
            forceRecenterOnNextPosRef.current = false;
            map.flyTo(effectiveDriverPos, 16, { duration: 1.0 });
            driverMarkerRef.current?.openPopup();
            return;
        }

        if (autoCenterDriver) {
            let shouldPan = true;
            if (lastCenteredPosRef.current) {
                const R = 6371000;
                const dLat = ((effectiveDriverPos[0] - lastCenteredPosRef.current[0]) * Math.PI) / 180;
                const dLon = ((effectiveDriverPos[1] - lastCenteredPosRef.current[1]) * Math.PI) / 180;
                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos((lastCenteredPosRef.current[0] * Math.PI) / 180) *
                    Math.cos((effectiveDriverPos[0] * Math.PI) / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                if (dist < 8) {
                    shouldPan = false;
                }
            }
            if (shouldPan) {
                lastCenteredPosRef.current = effectiveDriverPos;
                map.panTo(effectiveDriverPos, { animate: true, duration: 0.6 });
            }
        }
    }, [driverCoords, autoCenterDriver, routes, activeRouteIndex, originCoords, destCoords]);

    // Recenter Trigger handler (from parent page like LiveNavigation)
    useEffect(() => {
        if (!recenterTrigger || !mapInstanceRef.current) return;
        let targetPos = driverCoords;
        if (!targetPos || (targetPos[0] === 0 && targetPos[1] === 0)) {
            const selectedRoute = routes.find((r) => r.index === activeRouteIndex) || routes[0];
            if (selectedRoute && selectedRoute.points.length >= 4) {
                targetPos = selectedRoute.points[Math.floor(selectedRoute.points.length / 3)];
            } else if (originCoords && destCoords) {
                targetPos = [
                    originCoords[0] * 0.65 + destCoords[0] * 0.35,
                    originCoords[1] * 0.65 + destCoords[1] * 0.35,
                ];
            }
        }
        if (targetPos && targetPos[0] !== 0 && targetPos[1] !== 0 && mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(targetPos, 16, { duration: 1.0 });
            if (driverMarkerRef.current) {
                driverMarkerRef.current.openPopup();
            }
        }
    }, [recenterTrigger, driverCoords, routes, activeRouteIndex, originCoords, destCoords]);

    const handleFocusDriver = useCallback(() => {
        forceRecenterOnNextPosRef.current = true;
        if (onLocateMe) {
            onLocateMe();
        }
        let targetPos = driverCoords;
        if (!targetPos || (targetPos[0] === 0 && targetPos[1] === 0)) {
            const selectedRoute = routes.find((r) => r.index === activeRouteIndex) || routes[0];
            if (selectedRoute && selectedRoute.points.length >= 4) {
                targetPos = selectedRoute.points[Math.floor(selectedRoute.points.length / 3)];
            } else if (originCoords && destCoords) {
                targetPos = [
                    originCoords[0] * 0.65 + destCoords[0] * 0.35,
                    originCoords[1] * 0.65 + destCoords[1] * 0.35,
                ];
            }
        }
        if (targetPos && targetPos[0] !== 0 && targetPos[1] !== 0 && mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(targetPos, 16, { duration: 1.0 });
            if (driverMarkerRef.current) {
                driverMarkerRef.current.openPopup();
            }
        }
    }, [onLocateMe, driverCoords, routes, activeRouteIndex, originCoords, destCoords]);

    const handleRecenter = useCallback(() => {
        if (!mapInstanceRef.current || routes.length === 0) return;
        const currentRoute = routes.find((r) => r.index === activeRouteIndex) || routes[0];
        if (currentRoute) {
            const boundsPoints: [number, number][] = [...currentRoute.points, originCoords, destCoords];
            if (driverCoords && driverCoords[0] !== 0 && driverCoords[1] !== 0) {
                boundsPoints.push(driverCoords);
            }
            mapInstanceRef.current.fitBounds(L.latLngBounds(boundsPoints), {
                padding: [50, 50],
                maxZoom: 15,
            });
        }
    }, [routes, activeRouteIndex, originCoords, destCoords, driverCoords]);

    // Reset initial bounds fitting when coordinates change
    useEffect(() => {
        hasFitInitialBoundsRef.current = false;
    }, [originCoords[0], originCoords[1], destCoords[0], destCoords[1]]);

    const handleDefaultNavigation = () => {
        if (onStartNavigation) {
            onStartNavigation();
            return;
        }
        window.location.href = '/driver/navigation';
    };

    const isFullHeight = height === '100%';
    const explicitHeight = height || '320px';

    return (
        <div
            className={`w-full font-sans text-slate-800 dark:text-slate-100 ${isFullHeight ? 'h-full flex flex-col flex-1' : 'flex flex-col'
                } ${className}`}
        >
            <style>{`
                .leaflet-container {
                    width: 100% !important;
                    height: 100% !important;
                    background-color: #e5e7eb !important;
                }
                .leaflet-container img.leaflet-tile {
                    max-width: none !important;
                    max-height: none !important;
                    visibility: visible !important;
                }
            `}</style>
            {/* Embedded Google Map Frame */}
            <div
                style={!isFullHeight ? { height: explicitHeight, minHeight: explicitHeight } : undefined}
                className={`w-full relative ${borderless ? 'overflow-hidden' : 'rounded-[5px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs'} bg-slate-100 dark:bg-slate-900 ${isFullHeight ? 'h-full flex-1' : ''
                    }`}
            >
                {/* 1. Leaflet Map Element */}
                <div
                    ref={mapContainerRef}
                    className="w-full h-full absolute inset-0"
                />

                {/* 2. Modern Map Skeleton Placeholder (NO circular spinner/procession) */}
                {isLoading && (
                    <div className="absolute inset-0 z-[20] pointer-events-none">
                        <MapSkeletonPlaceholder
                            height="100%"
                            message="Synchronizing Route Map..."
                            showDetails={false}
                        />
                    </div>
                )}


                {/* 5. Map Controls Overlay (Locate Driver + Recenter) */}
                <div className="absolute bottom-2.5 right-2.5 z-[10] flex flex-col gap-1.5">
                    {/* Locate Driver / My Live Location GPS Button */}
                    <button
                        type="button"
                        onClick={handleFocusDriver}
                        title="Focus My Location / Driver Live GPS"
                        className="w-7 h-7 rounded-[4px] bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                        {isLocating ? (
                            <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Crosshair size={13} strokeWidth={2.3} />
                        )}
                    </button>

                    {/* Recenter Full Route Bounds */}
                    <button
                        type="button"
                        onClick={handleRecenter}
                        title="Re-center route"
                        className="w-7 h-7 rounded-[4px] bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                        <RotateCcw size={13} />
                    </button>
                </div>
            </div>

            {/* Bottom Route Summary (Enclosing card removed as requested, rendered cleanly outside card) */}
            {showRouteSummaryCards && (
                <div className="mt-2.5 space-y-2.5">
                    {/* Header: Route Summary + Live Traffic */}
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <div className="p-1 rounded-[5px] bg-[#FFEDD5] text-[#FF5722]">
                                <RouteIcon size={14} />
                            </div>
                            <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                                Route Summary
                            </span>
                        </div>

                        {/* Live Traffic Toggle */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                Live Traffic
                            </span>
                            <button
                                type="button"
                                onClick={() => setLiveTraffic((prev) => !prev)}
                                className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${liveTraffic ? 'bg-[#FF5722]' : 'bg-slate-300 dark:bg-slate-600'
                                    }`}
                            >
                                <div
                                    className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${liveTraffic ? 'translate-x-3.5' : 'translate-x-0'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* 3 Compact Route Cards (Each with 5px radius, positioned outside enclosing card) */}
                    <div className="grid grid-cols-3 gap-2">
                        {routes.map((r) => {
                            const isSelected = r.index === activeRouteIndex;
                            return (
                                <div
                                    key={r.index}
                                    onClick={() => handleSelectRoute(r.index)}
                                    className={`p-2.5 rounded-[5px] border transition-all cursor-pointer flex flex-col justify-between ${isSelected
                                        ? 'bg-[#FFF7ED] dark:bg-[#FF5722]/10 border-[#FF5722] shadow-2xs'
                                        : 'bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
                                        }`}
                                >
                                    <div className="flex items-center gap-1 text-[10.5px] font-bold">
                                        {r.index === 0 ? (
                                            <Zap
                                                size={11}
                                                className={isSelected ? 'text-[#FF5722]' : 'text-slate-400'}
                                            />
                                        ) : (
                                            <RouteIcon
                                                size={11}
                                                className={isSelected ? 'text-[#FF5722]' : 'text-slate-400'}
                                            />
                                        )}
                                        <span
                                            className={`truncate ${isSelected ? 'text-[#FF5722]' : 'text-slate-600 dark:text-slate-400'
                                                }`}
                                        >
                                            {r.label}
                                        </span>
                                    </div>
                                    <div className="text-[15px] sm:text-[16px] font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                                        {r.duration}
                                    </div>
                                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                        {r.distance}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Start Navigation CTA (Clean standard height & rounded corners matching theme) */}
                    {showStartNavigationButton && (
                        <div className="pt-0.5">
                            <button
                                type="button"
                                onClick={handleDefaultNavigation}
                                className="w-full h-9 sm:h-9.5 rounded-[6px] bg-[#FF5722] hover:bg-[#E03E15] active:scale-[0.99] text-white font-bold text-xs sm:text-[13px] shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                                <Navigation size={14} className="rotate-45" />
                                <span>Start Navigation</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DriverGoogleMapView;
