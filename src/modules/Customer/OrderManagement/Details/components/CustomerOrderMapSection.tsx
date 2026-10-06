import React, { useEffect, useRef, useState } from 'react';
import { Navigation, ArrowRight, Truck, CheckCircle2, ExternalLink, MapPin, Compass } from 'lucide-react';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';
import apiClient from '@/lib/axios';

interface CustomerOrderMapSectionProps {
    order: NormalizedCustomerOrder;
    timeline?: any[];
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

export const CustomerOrderMapSection: React.FC<CustomerOrderMapSectionProps> = ({ order, timeline }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);

    const fromCity = order.pickup.city || 'Origin';
    const toCity = order.delivery.city || 'Destination';
    const pickupLat = order.pickupLat ?? order.pickup?.lat;
    const pickupLng = order.pickupLng ?? order.pickup?.lng;
    const deliveryLat = order.deliveryLat ?? order.delivery?.lat;
    const deliveryLng = order.deliveryLng ?? order.delivery?.lng;

    const hasExactCoordinates = Boolean(
        pickupLat !== null && pickupLat !== undefined && !isNaN(Number(pickupLat)) &&
        pickupLng !== null && pickupLng !== undefined && !isNaN(Number(pickupLng)) &&
        deliveryLat !== null && deliveryLat !== undefined && !isNaN(Number(deliveryLat)) &&
        deliveryLng !== null && deliveryLng !== undefined && !isNaN(Number(deliveryLng))
    );

    // Google Maps External Directions Navigation URL
    const googleMapsUrl = hasExactCoordinates
        ? `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${deliveryLat},${deliveryLng}&travelmode=driving`
        : `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(order.pickup.address || fromCity)}&destination=${encodeURIComponent(order.delivery.address || toCity)}&travelmode=driving`;

    // Embed Fallback URL
    const embedMapSrc = hasExactCoordinates
        ? `https://maps.google.com/maps?saddr=${pickupLat},${pickupLng}&daddr=${deliveryLat},${deliveryLng}&t=m&z=10&output=embed`
        : `https://maps.google.com/maps?q=${encodeURIComponent(order.pickup.address || fromCity)}+to+${encodeURIComponent(order.delivery.address || toCity)}&t=m&z=8&ie=UTF8&iwloc=&output=embed`;

    // Initialize Interactive Google Map with real Markers & Route Polyline
    useEffect(() => {
        let isCancelled = false;

        const initMap = async () => {
            if (!hasExactCoordinates || !mapContainerRef.current) return;

            try {
                const apiKey = await fetchGoogleMapsApiKey();
                if (!apiKey || isCancelled) return;

                // Load Google Maps Script if not present
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

                // Pickup Marker (Green)
                new google.maps.Marker({
                    position: pPos,
                    map: map,
                    title: `Origin: ${fromCity} (${order.pickup.address})`,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#10b981',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2.5,
                    },
                    label: {
                        text: 'A',
                        color: '#ffffff',
                        fontSize: '10px',
                        fontWeight: 'bold'
                    }
                });

                // Delivery Marker (CarrierDirect Orange)
                new google.maps.Marker({
                    position: dPos,
                    map: map,
                    title: `Destination: ${toCity} (${order.delivery.address})`,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#ff4a1f',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2.5,
                    },
                    label: {
                        text: 'B',
                        color: '#ffffff',
                        fontSize: '10px',
                        fontWeight: 'bold'
                    }
                });

                // Request Driving Directions
                const directionsService = new google.maps.DirectionsService();
                const directionsRenderer = new google.maps.DirectionsRenderer({
                    map: map,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: '#ff4a1f',
                        strokeWeight: 4.5,
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
                        } else {
                            // Fallback polyline if directions service fails
                            new google.maps.Polyline({
                                path: [pPos, dPos],
                                map: map,
                                strokeColor: '#ff4a1f',
                                strokeOpacity: 0.75,
                                strokeWeight: 3.5,
                                geodesic: true
                            });
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
                setMapError(true);
            }
        };

        initMap();

        return () => {
            isCancelled = true;
        };
    }, [pickupLat, pickupLng, deliveryLat, deliveryLng, hasExactCoordinates, fromCity, toCity, order.pickup.address, order.delivery.address]);

    const milestoneSteps = [
        { 
            id: 1, 
            label: 'Order Booked', 
            completed: Boolean(timeline?.[0]?.completed && !timeline?.[0]?.active),
            active: Boolean(timeline?.[0]?.active)
        },
        { 
            id: 2, 
            label: 'Driver Assigned', 
            completed: Boolean(timeline?.[1]?.completed && !timeline?.[1]?.active),
            active: Boolean(timeline?.[1]?.active)
        },
        { 
            id: 3, 
            label: 'Goods Picked Up', 
            completed: Boolean(timeline?.[2]?.completed && !timeline?.[2]?.active),
            active: Boolean(timeline?.[2]?.active)
        },
        { 
            id: 4, 
            label: 'In Transit', 
            completed: Boolean(timeline?.[3]?.completed && !timeline?.[3]?.active),
            active: Boolean(timeline?.[3]?.active)
        },
        { 
            id: 5, 
            label: 'Delivered', 
            completed: Boolean(timeline?.[6]?.completed || timeline?.[5]?.completed || (timeline?.[4]?.completed && !timeline?.some(t => t.active))),
            active: Boolean(timeline?.[4]?.active || (timeline?.[5]?.active && !timeline?.[6]?.completed))
        }
    ];

    return (
        <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden font-sans">
            {/* Top Subheader with Live Status Bar & Actions */}
            <div className="px-3.5 py-2.5 bg-slate-50/90 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">Live Shipment Corridor</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">GPS Telematics Active</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-2xs text-xs">
                        <Navigation size={11} className="text-[#ff4a1f] shrink-0" />
                        <span className="font-bold text-slate-900 dark:text-slate-100">{fromCity}</span>
                        <ArrowRight size={10} className="text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-900 dark:text-slate-100">{toCity}</span>
                    </span>

                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-[#ff4a1f] px-2.5 py-1 rounded border border-[#ff4a1f]/30 hover:border-[#ff4a1f] shadow-2xs text-[11.5px] font-bold transition-all"
                        title="Open Live Route in Google Maps"
                    >
                        <span>Open in Google Maps</span>
                        <ExternalLink size={11} />
                    </a>
                </div>
            </div>

            {/* Map Frame */}
            <div className="w-full h-[220px] sm:h-[260px] relative overflow-hidden bg-slate-100 dark:bg-[#15191e]">
                {/* Dynamic Google Maps Canvas */}
                <div
                    ref={mapContainerRef}
                    className={`w-full h-full ${mapLoaded && !mapError ? 'block' : 'hidden'}`}
                />

                {/* Fallback Google Maps Route Embed */}
                {(!mapLoaded || mapError) && (
                    <iframe
                        title="Shipment Route Corridor"
                        src={embedMapSrc}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                    />
                )}

                {/* Floating Real-Time Details Badge */}
                <div className="absolute bottom-2.5 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-3 py-1.5 rounded-md border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center gap-2 text-[11.5px] pointer-events-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Direct Freight Route ({order.distance})
                    </span>
                </div>
            </div>

            {/* Dedicated Clean Progress Stepper Bar */}
            <div className="p-3 sm:p-4 bg-white dark:bg-[#1e2329] border-t border-slate-100 dark:border-slate-800/80">
                <div className="grid grid-cols-5 gap-1 items-start relative">
                    {milestoneSteps.map((step, idx) => {
                        const isCompleted = step.completed;
                        const isCurrent = step.active;

                        return (
                            <div key={step.id} className="flex flex-col items-center text-center relative group">
                                {/* Connecting horizontal bar to next step */}
                                {idx < milestoneSteps.length - 1 && (
                                    <div
                                        className={`absolute top-3 left-1/2 w-full h-0.5 -z-0 transition-colors ${
                                            isCompleted && (milestoneSteps[idx + 1]?.completed || milestoneSteps[idx + 1]?.active)
                                                ? milestoneSteps[idx + 1]?.completed
                                                    ? 'bg-emerald-500'
                                                    : 'bg-orange-400'
                                                : 'bg-slate-200 dark:bg-slate-700'
                                        }`}
                                    />
                                )}

                                {/* Step Circle Indicator */}
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold z-10 border-2 transition-all ${
                                        isCompleted
                                            ? 'bg-emerald-500 border-white dark:border-[#1e2329] text-white shadow-2xs'
                                            : isCurrent
                                            ? 'bg-[#ff4a1f] border-orange-200 dark:border-orange-950 text-white ring-3 ring-orange-100 dark:ring-orange-950/70 scale-105'
                                            : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 size={13} className="text-white" />
                                    ) : isCurrent ? (
                                        <Truck size={11} className="text-white animate-pulse" />
                                    ) : (
                                        <span>{idx + 1}</span>
                                    )}
                                </div>

                                {/* Clean Step Title */}
                                <span
                                    className={`mt-1.5 text-[10.5px] sm:text-[11.5px] font-semibold tracking-tight transition-colors ${
                                        isCurrent
                                            ? 'text-[#ff4a1f] font-bold'
                                            : isCompleted
                                            ? 'text-slate-800 dark:text-slate-200 font-medium'
                                            : 'text-slate-400 dark:text-slate-500'
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderMapSection;
