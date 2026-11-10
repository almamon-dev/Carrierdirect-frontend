import { useEffect, useRef, useState } from 'react';
import apiClient from '@/lib/axios';
import { extractCoordinatesFromAddress } from '@/utils/knownCoordinates';
import { calculateAirDistanceKm } from '@/utils/geoDistance';

interface UseSupplierOrderMapProps {
    order: {
        from: string;
        to: string;
        pickup_address?: string;
        delivery_address?: string;
        pickupFullAddress?: string;
        deliveryFullAddress?: string;
        pickup_lat?: number | null;
        pickup_lng?: number | null;
        delivery_lat?: number | null;
        delivery_lng?: number | null;
        distance?: string;
        distance_km?: number | null;
        [key: string]: any;
    };
    pickupAddressOverride?: string;
    deliveryAddressOverride?: string;
}

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

export const useSupplierOrderMap = ({
    order,
    pickupAddressOverride,
    deliveryAddressOverride,
}: UseSupplierOrderMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);

    const fromCity = (order.from && order.from !== '-') ? order.from : 'Gazipur';
    const toCity = (order.to && order.to !== '-') ? order.to : 'Dhaka';

    const rawPickupLat = order.pickup_lat ?? (order as any).pickupLat;
    const rawPickupLng = order.pickup_lng ?? (order as any).pickupLng;
    const rawDeliveryLat = order.delivery_lat ?? (order as any).deliveryLat;
    const rawDeliveryLng = order.delivery_lng ?? (order as any).deliveryLng;

    const effectivePickupAddr = pickupAddressOverride ||
        (order.pickupFullAddress && order.pickupFullAddress !== '-' ? order.pickupFullAddress : '') ||
        (order.pickup_address && order.pickup_address !== '-' ? order.pickup_address : '') ||
        fromCity;

    const effectiveDeliveryAddr = deliveryAddressOverride ||
        (order.deliveryFullAddress && order.deliveryFullAddress !== '-' ? order.deliveryFullAddress : '') ||
        (order.delivery_address && order.delivery_address !== '-' ? order.delivery_address : '') ||
        toCity;

    // Resolve Origin Coordinates
    const originCoords: [number, number] = (() => {
        if (
            rawPickupLat !== null && rawPickupLat !== undefined &&
            !isNaN(Number(rawPickupLat)) && Number(rawPickupLat) !== 0 &&
            rawPickupLng !== null && rawPickupLng !== undefined &&
            !isNaN(Number(rawPickupLng)) && Number(rawPickupLng) !== 0
        ) {
            return [Number(rawPickupLat), Number(rawPickupLng)];
        }
        return (
            extractCoordinatesFromAddress(effectivePickupAddr) ||
            extractCoordinatesFromAddress(fromCity) ||
            [23.9999, 90.4203] // Gazipur default
        );
    })();

    // Resolve Destination Coordinates
    const destCoords: [number, number] = (() => {
        if (
            rawDeliveryLat !== null && rawDeliveryLat !== undefined &&
            !isNaN(Number(rawDeliveryLat)) && Number(rawDeliveryLat) !== 0 &&
            rawDeliveryLng !== null && rawDeliveryLng !== undefined &&
            !isNaN(Number(rawDeliveryLng)) && Number(rawDeliveryLng) !== 0
        ) {
            return [Number(rawDeliveryLat), Number(rawDeliveryLng)];
        }
        return (
            extractCoordinatesFromAddress(effectiveDeliveryAddr) ||
            extractCoordinatesFromAddress(toCity) ||
            [23.8103, 90.4125] // Dhaka default
        );
    })();

    const pickupLat = originCoords[0];
    const pickupLng = originCoords[1];
    const deliveryLat = destCoords[0];
    const deliveryLng = destCoords[1];

    const hasExactCoordinates = true;

    // Calculate approximate road distance if missing
    const calculatedKm = calculateAirDistanceKm(pickupLat, pickupLng, deliveryLat, deliveryLng);
    const distanceFormatted =
        order.distance && order.distance !== '-' && order.distance !== '—'
            ? order.distance
            : (order.distance_km ? `${order.distance_km} km` : (calculatedKm ? `${(calculatedKm * 1.25).toFixed(1)} km` : '28.40 km'));

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${deliveryLat},${deliveryLng}&travelmode=driving`;
    const embedMapSrc = `https://maps.google.com/maps?saddr=${pickupLat},${pickupLng}&daddr=${deliveryLat},${deliveryLng}&dirflg=d&travelmode=driving&t=m&z=11&output=embed`;

    useEffect(() => {
        let isCancelled = false;

        const initMap = async () => {
            if (!mapContainerRef.current) return;

            try {
                const apiKey = await fetchGoogleMapsApiKey();
                if (!apiKey || isCancelled) {
                    setMapError(true);
                    return;
                }

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
                    zoom: 11,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                    zoomControl: true,
                    styles: [
                        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
                        { featureType: 'transit', stylers: [{ visibility: 'simplified' }] }
                    ]
                });

                new google.maps.Marker({
                    position: pPos,
                    map,
                    title: `Pickup: ${fromCity}`,
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

                new google.maps.Marker({
                    position: dPos,
                    map,
                    title: `Destination: ${toCity}`,
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

                const bounds = new google.maps.LatLngBounds();
                bounds.extend(pPos);
                bounds.extend(dPos);
                map.fitBounds(bounds, { top: 60, bottom: 50, left: 60, right: 60 });

                // Driving Route Polyline via DirectionsService
                try {
                    const directionsService = new google.maps.DirectionsService();
                    const directionsRenderer = new google.maps.DirectionsRenderer({
                        map,
                        suppressMarkers: true,
                        polylineOptions: {
                            strokeColor: '#ff4a1f',
                            strokeWeight: 4,
                            strokeOpacity: 0.85
                        }
                    });

                    directionsService.route(
                        {
                            origin: pPos,
                            destination: dPos,
                            travelMode: google.maps.TravelMode.DRIVING
                        },
                        (result: any, status: any) => {
                            if (status === google.maps.DirectionsStatus.OK && result) {
                                directionsRenderer.setDirections(result);
                            }
                        }
                    );
                } catch {
                    // Fallback to direct geodesic polyline
                    new google.maps.Polyline({
                        path: [pPos, dPos],
                        geodesic: true,
                        strokeColor: '#ff4a1f',
                        strokeOpacity: 0.8,
                        strokeWeight: 3.5,
                        map
                    });
                }

                setMapLoaded(true);
                setMapError(false);
            } catch (err) {
                console.warn('Google Maps JS API load error, falling back to Google Maps Embed:', err);
                setMapError(true);
            }
        };

        initMap();

        return () => {
            isCancelled = true;
        };
    }, [pickupLat, pickupLng, deliveryLat, deliveryLng, fromCity, toCity]);

    return {
        mapContainerRef,
        mapLoaded,
        mapError,
        distanceFormatted,
        googleMapsUrl,
        embedMapSrc,
        originCoords,
        destCoords,
    };
};

export default useSupplierOrderMap;
