import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Navigation, ExternalLink, Route } from 'lucide-react';
import { ShipmentItem, ShipmentStatus } from '../../../types';
import { DriverGoogleMapView } from '@/modules/Driver/components/DriverGoogleMapView';
import { extractCoordinatesFromAddress } from '@/utils/knownCoordinates';
import { geocodeAddressWithGooglePlaces } from '@/utils/googlePlacesGeocoding';
import { calculateAirDistanceKm } from '@/utils/geoDistance';
import { useDriverLiveLocation } from '@/modules/Driver/hooks/useDriverLiveLocation';

interface Props {
    shipment: ShipmentItem;
}

export const DriverShipmentMapSection: React.FC<Props> = ({ shipment }) => {
    const [selectedRouteIndex, setSelectedRouteIndex] = useState<number>(0);
    const [routesList, setRoutesList] = useState<any[]>([]);
    const [resolvedOrigin, setResolvedOrigin] = useState<[number, number] | null>(null);
    const [resolvedDest, setResolvedDest] = useState<[number, number] | null>(null);

    const fromCity = (shipment.shipper.city && shipment.shipper.city !== '-') ? shipment.shipper.city : 'Gazipur';
    const toCity = (shipment.consignee.city && shipment.consignee.city !== '-') ? shipment.consignee.city : 'Dhaka';

    const pickupAddress = (shipment.shipper.address && shipment.shipper.address !== '-')
        ? shipment.shipper.address
        : `${fromCity} Industrial Area, Gazipur`;

    const deliveryAddress = (shipment.consignee.address && shipment.consignee.address !== '-')
        ? shipment.consignee.address
        : `${toCity} Commercial Center, Dhanmondi`;

    const status: ShipmentStatus = shipment.status;
    const isCompleted = status === 'completed' || status === 'delivered';

    // Dynamic Geocoding via Google Places API
    useEffect(() => {
        let isCancelled = false;

        geocodeAddressWithGooglePlaces(pickupAddress, fromCity).then((coords) => {
            if (!isCancelled && coords) setResolvedOrigin(coords);
        });

        geocodeAddressWithGooglePlaces(deliveryAddress, toCity).then((coords) => {
            if (!isCancelled && coords) setResolvedDest(coords);
        });

        return () => {
            isCancelled = true;
        };
    }, [pickupAddress, deliveryAddress, fromCity, toCity]);

    const pickupLat = shipment.route?.originCoords?.lat;
    const pickupLng = shipment.route?.originCoords?.lng;
    const deliveryLat = shipment.route?.destinationCoords?.lat;
    const deliveryLng = shipment.route?.destinationCoords?.lng;

    const defaultOriginCoords =
        extractCoordinatesFromAddress(pickupAddress) ||
        extractCoordinatesFromAddress(fromCity) ||
        [23.8981, 90.3972];

    const defaultDestCoords =
        extractCoordinatesFromAddress(deliveryAddress) ||
        extractCoordinatesFromAddress(toCity) ||
        [23.7534, 90.3698];

    const originCoords: [number, number] = resolvedOrigin || [
        pickupLat && !isNaN(Number(pickupLat)) && Number(pickupLat) !== 0
            ? Number(pickupLat)
            : defaultOriginCoords[0],
        pickupLng && !isNaN(Number(pickupLng)) && Number(pickupLng) !== 0
            ? Number(pickupLng)
            : defaultOriginCoords[1],
    ];

    const destCoords: [number, number] = resolvedDest || [
        deliveryLat && !isNaN(Number(deliveryLat)) && Number(deliveryLat) !== 0
            ? Number(deliveryLat)
            : defaultDestCoords[0],
        deliveryLng && !isNaN(Number(deliveryLng)) && Number(deliveryLng) !== 0
            ? Number(deliveryLng)
            : defaultDestCoords[1],
    ];

    // Fallback corridor waypoint between pickup and delivery
    const corridorFallback = useMemo<[number, number]>(() => {
        return [
            originCoords[0] + (destCoords[0] - originCoords[0]) * 0.42,
            originCoords[1] + (destCoords[1] - originCoords[1]) * 0.42,
        ];
    }, [originCoords, destCoords]);

    // Live Driver Location tracking (Browser GPS + Backend API last known)
    const { driverCoords, locateMe, isLocating, isLiveGPS } = useDriverLiveLocation({
        activeOrderId: shipment.id || shipment.orderNumber,
        fallbackCoords: corridorFallback,
        enableWatch: true,
    });

    // Distance calculation
    const airKm = calculateAirDistanceKm(originCoords[0], originCoords[1], destCoords[0], destCoords[1]);
    const activeRouteDistance = routesList[selectedRouteIndex]?.distance;
    const displayDistance =
        activeRouteDistance ||
        (shipment.route?.distanceFormatted &&
        shipment.route.distanceFormatted !== '-' &&
        shipment.route.distanceFormatted !== '—'
            ? shipment.route.distanceFormatted
            : (airKm ? `${(airKm * 1.25).toFixed(1)} km` : '28.40 km'));

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoords[0]},${originCoords[1]}&destination=${destCoords[0]},${destCoords[1]}&travelmode=driving`;

    return (
        <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[6px] shadow-xs overflow-hidden font-sans">
            {/* Top Subheader matching Live Tracking mockup */}
            <div className="px-4 py-3 bg-white dark:bg-[#1e2329] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            Live Tracking
                        </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                        <span>{fromCity}</span>
                        <ArrowRight size={10} className="text-slate-400" />
                        {shipment.isRelay && (
                            <>
                                <span className="text-violet-600 dark:text-violet-400 font-semibold">{shipment.hubLocation || 'Intermediate Hub'}</span>
                                <ArrowRight size={10} className="text-slate-400" />
                            </>
                        )}
                        <span>{toCity}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Distance Badge */}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {displayDistance}
                    </span>

                    <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

                    {/* ETA */}
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        ETA: <strong className="font-bold text-slate-900 dark:text-white">5 hr 21 min</strong>
                    </span>

                    {/* Open in Maps Link */}
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-white hover:bg-orange-50/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#ff4a1f] px-2.5 py-1 rounded-[4px] border border-orange-200 dark:border-orange-900/60 shadow-2xs text-[11px] font-bold transition-all"
                        title="Open Live Route in Google Maps"
                    >
                        <span>Open in Maps</span>
                        <ExternalLink size={11} />
                    </a>
                </div>
            </div>

            {/* Google Map View with Custom Markers, Real Highway Polyline, Clean Route Selector, and Rounded Navigation CTA */}
            <div className="w-full relative bg-slate-50 dark:bg-[#15191e] p-2 sm:p-2.5">
                <DriverGoogleMapView
                    originCoords={originCoords}
                    destCoords={destCoords}
                    driverCoords={driverCoords}
                    originTitle={fromCity}
                    originAddress={pickupAddress}
                    destTitle={toCity}
                    destAddress={deliveryAddress}
                    selectedRouteIndex={selectedRouteIndex}
                    onRouteChange={(idx) => setSelectedRouteIndex(idx)}
                    onRoutesLoaded={(rts) => setRoutesList(rts)}
                    height="300px"
                    showFloatingCard={true}
                    showRouteSummaryCards={true}
                    showStartNavigationButton={true}
                    onStartNavigation={() => {
                        const sid = shipment.id || shipment.orderNumber || '1';
                        window.location.href = `/driver/navigation/${sid}`;
                    }}
                    onLocateMe={locateMe}
                    isLocating={isLocating}
                />
            </div>
        </div>
    );
};

export default DriverShipmentMapSection;
