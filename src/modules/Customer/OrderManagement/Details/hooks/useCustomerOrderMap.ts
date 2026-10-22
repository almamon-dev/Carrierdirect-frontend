import apiClient from '@/lib/axios';
import { useEffect, useRef, useState } from 'react';

let cachedApiKey: string | null = null;
let apiKeyPromise: Promise<string | null> | null = null;

const fetchGoogleMapsApiKey = async (): Promise<string | null> => {
    if (cachedApiKey) return cachedApiKey;
    if (apiKeyPromise) return apiKeyPromise;

    apiKeyPromise = (async () => {
        try {
            const res = await apiClient.get('/maps-config', { silent: true });
            const key = res?.google_maps_key || res?.data?.google_maps_key;
            if (key) {
                cachedApiKey = key;
                return key;
            }
        } catch {
            // fallback
        }
        return null;
    })();

    return apiKeyPromise;
};

interface UseCustomerOrderMapProps {
    pickupLat?: number | null;
    pickupLng?: number | null;
    deliveryLat?: number | null;
    deliveryLng?: number | null;
    fromCity: string;
    toCity: string;
    pickupAddress: string;
    deliveryAddress: string;
    selectedRouteIndex?: number;
}

export const useCustomerOrderMap = ({
    pickupLat,
    pickupLng,
    deliveryLat,
    deliveryLng,
    fromCity,
    toCity,
    pickupAddress,
    deliveryAddress,
    selectedRouteIndex = 0,
}: UseCustomerOrderMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);
    const [routesSummary, setRoutesSummary] = useState<Array<{ summary: string; distance: string; duration: string }>>([]);

    const hasExactCoordinates = Boolean(
        pickupLat !== null && pickupLat !== undefined && !isNaN(Number(pickupLat)) &&
        pickupLng !== null && pickupLng !== undefined && !isNaN(Number(pickupLng)) &&
        deliveryLat !== null && deliveryLat !== undefined && !isNaN(Number(deliveryLat)) &&
        deliveryLng !== null && deliveryLng !== undefined && !isNaN(Number(deliveryLng))
    );

    const googleMapsUrl = hasExactCoordinates
        ? `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${deliveryLat},${deliveryLng}&travelmode=driving`
        : `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pickupAddress || fromCity)}&destination=${encodeURIComponent(deliveryAddress || toCity)}&travelmode=driving`;

    const embedMapSrc = hasExactCoordinates
        ? `https://maps.google.com/maps?saddr=${pickupLat},${pickupLng}&daddr=${deliveryLat},${deliveryLng}&t=m&z=10&output=embed`
        : `https://maps.google.com/maps?q=${encodeURIComponent(pickupAddress || fromCity)}+to+${encodeURIComponent(deliveryAddress || toCity)}&t=m&z=8&ie=UTF8&iwloc=&output=embed`;

    useEffect(() => {
        let isCancelled = false;
        let directionsRenderers: any[] = [];
        let bestRouteMarker: any = null;

        const initMap = async () => {
            if (!hasExactCoordinates || !mapContainerRef.current) return;

            try {
                const apiKey = await fetchGoogleMapsApiKey();
                if (!apiKey || isCancelled) return;

                if (!(window as any).google?.maps) {
                    await new Promise<void>((resolve, reject) => {
                        const existingScript = document.getElementById('google-maps-js-sdk');
                        if (existingScript) {
                            existingScript.addEventListener('load', () => resolve());
                            existingScript.addEventListener('error', () => reject());
                            if ((window as any).google?.maps) resolve();
                            return;
                        }
                        const script = document.createElement('script');
                        script.id = 'google-maps-js-sdk';
                        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
                        script.async = true;
                        script.defer = true;
                        script.onload = () => resolve();
                        script.onerror = () => reject();
                        document.head.appendChild(script);
                    });
                }

                if (isCancelled || !mapContainerRef.current || !(window as any).google?.maps) return;

                const google = (window as any).google;
                const pPos = { lat: Number(pickupLat), lng: Number(pickupLng) };
                const dPos = { lat: Number(deliveryLat), lng: Number(deliveryLng) };

                const map = new google.maps.Map(mapContainerRef.current, {
                    center: pPos,
                    zoom: 10,
                    mapTypeControl: true,
                    streetViewControl: false,
                    fullscreenControl: true,
                    zoomControl: true,
                    styles: [
                        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                        { featureType: 'transit', stylers: [{ visibility: 'simplified' }] }
                    ]
                });

                // Origin Pickup Marker (Green)
                new google.maps.Marker({
                    position: pPos,
                    map: map,
                    title: `Origin: ${fromCity} (${pickupAddress})`,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#10b981',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2.5,
                    },
                    label: { text: 'A', color: '#ffffff', fontSize: '10px', fontWeight: 'bold' }
                });

                // Destination Delivery Marker (Orange Red)
                new google.maps.Marker({
                    position: dPos,
                    map: map,
                    title: `Destination: ${toCity} (${deliveryAddress})`,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#ff4a1f',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2.5,
                    },
                    label: { text: 'B', color: '#ffffff', fontSize: '10px', fontWeight: 'bold' }
                });

                const directionsService = new google.maps.DirectionsService();

                // Enable provideRouteAlternatives to discover Best Route and Alternatives
                directionsService.route(
                    {
                        origin: pPos,
                        destination: dPos,
                        travelMode: google.maps.TravelMode.DRIVING,
                        provideRouteAlternatives: true,
                    },
                    (result: any, status: any) => {
                        if (status === google.maps.DirectionsStatus.OK && !isCancelled && result?.routes) {
                            const routes = result.routes;
                            const summaries = routes.map((r: any) => ({
                                summary: r.summary || 'Corridor',
                                distance: r.legs?.[0]?.distance?.text || '',
                                duration: r.legs?.[0]?.duration?.text || '',
                            }));
                            setRoutesSummary(summaries);

                            // Render all routes with distinction:
                            // Best Route = Bold #FF4A1F with marker; Alternatives = Muted #94A3B8
                            routes.forEach((route: any, index: number) => {
                                const isBest = index === selectedRouteIndex;
                                const renderer = new google.maps.DirectionsRenderer({
                                    map: map,
                                    directions: result,
                                    routeIndex: index,
                                    suppressMarkers: true,
                                    polylineOptions: {
                                        strokeColor: isBest ? '#FF4A1F' : '#94A3B8',
                                        strokeOpacity: isBest ? 0.95 : 0.5,
                                        strokeWeight: isBest ? 6 : 3,
                                        zIndex: isBest ? 10 : 1,
                                    }
                                });
                                directionsRenderers.push(renderer);
                            });

                            setMapLoaded(true);
                        } else {
                            const bounds = new google.maps.LatLngBounds();
                            bounds.extend(pPos);
                            bounds.extend(dPos);
                            map.fitBounds(bounds);
                            setMapLoaded(true);
                        }
                    }
                );
            } catch {
                if (!isCancelled) setMapError(true);
            }
        };

        initMap();
        return () => {
            isCancelled = true;
            directionsRenderers.forEach((r) => r.setMap(null));
            if (bestRouteMarker) {
                try { bestRouteMarker.close(); } catch (_) { }
            }
        };
    }, [pickupLat, pickupLng, deliveryLat, deliveryLng, hasExactCoordinates, fromCity, toCity, pickupAddress, deliveryAddress, selectedRouteIndex]);

    return {
        mapContainerRef,
        mapLoaded,
        mapError,
        hasExactCoordinates,
        googleMapsUrl,
        embedMapSrc,
        routesSummary,
    };
};

export default useCustomerOrderMap;
