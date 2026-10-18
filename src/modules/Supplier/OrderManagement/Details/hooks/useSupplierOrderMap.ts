import { useEffect, useRef, useState } from 'react';
import apiClient from '@/lib/axios';

interface UseSupplierOrderMapProps {
    order: {
        from: string;
        to: string;
        pickup_address?: string;
        delivery_address?: string;
        pickup_lat?: number | null;
        pickup_lng?: number | null;
        delivery_lat?: number | null;
        delivery_lng?: number | null;
        distance?: string;
        distance_km?: number | null;
        [key: string]: any;
    };
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

export const useSupplierOrderMap = ({ order }: UseSupplierOrderMapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);

    const fromCity = order.from || 'Origin';
    const toCity = order.to || 'Destination';
    const pickupLat = order.pickup_lat ?? (order as any).pickupLat;
    const pickupLng = order.pickup_lng ?? (order as any).pickupLng;
    const deliveryLat = order.delivery_lat ?? (order as any).deliveryLat;
    const deliveryLng = order.delivery_lng ?? (order as any).deliveryLng;
    const distanceFormatted = order.distance || (order.distance_km ? `${order.distance_km} km` : '—');

    const hasExactCoordinates = Boolean(
        pickupLat !== null && pickupLat !== undefined && !isNaN(Number(pickupLat)) &&
        pickupLng !== null && pickupLng !== undefined && !isNaN(Number(pickupLng)) &&
        deliveryLat !== null && deliveryLat !== undefined && !isNaN(Number(deliveryLat)) &&
        deliveryLng !== null && deliveryLng !== undefined && !isNaN(Number(deliveryLng))
    );

    const googleMapsUrl = hasExactCoordinates
        ? `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${deliveryLat},${deliveryLng}&travelmode=driving`
        : `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(order.pickup_address || fromCity)}&destination=${encodeURIComponent(order.delivery_address || toCity)}&travelmode=driving`;

    const embedMapSrc = hasExactCoordinates
        ? `https://maps.google.com/maps?saddr=${pickupLat},${pickupLng}&daddr=${deliveryLat},${deliveryLng}&t=m&z=10&output=embed`
        : `https://maps.google.com/maps?q=${encodeURIComponent(order.pickup_address || fromCity)}+to+${encodeURIComponent(order.delivery_address || toCity)}&t=m&z=8&ie=UTF8&iwloc=&output=embed`;

    useEffect(() => {
        let isCancelled = false;

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
                    title: `Origin: ${fromCity}`,
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

                const directionsService = new google.maps.DirectionsService();
                const directionsRenderer = new google.maps.DirectionsRenderer({
                    map,
                    suppressMarkers: true,
                    polylineOptions: { strokeColor: '#ff4a1f', strokeOpacity: 0.85, strokeWeight: 4 }
                });

                directionsService.route(
                    { origin: pPos, destination: dPos, travelMode: google.maps.TravelMode.DRIVING },
                    (result: any, status: any) => {
                        if (status === google.maps.DirectionsStatus.OK && result) {
                            directionsRenderer.setDirections(result);
                        } else {
                            const bounds = new google.maps.LatLngBounds();
                            bounds.extend(pPos);
                            bounds.extend(dPos);
                            map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
                        }
                    }
                );

                setMapLoaded(true);
            } catch (err) {
                console.warn('Google Maps JS load error, using high-res embed fallback:', err);
                if (!isCancelled) setMapError(true);
            }
        };

        initMap();
        return () => { isCancelled = true; };
    }, [pickupLat, pickupLng, deliveryLat, deliveryLng, hasExactCoordinates, fromCity, toCity]);

    return {
        mapContainerRef,
        mapLoaded,
        mapError,
        fromCity,
        toCity,
        distanceFormatted,
        googleMapsUrl,
        embedMapSrc,
    };
};

export default useSupplierOrderMap;
