import React, { useState, useEffect, useMemo } from 'react';
import { Maximize2, ExternalLink, Route } from 'lucide-react';
import { extractCoordinatesFromAddress } from '@/utils/knownCoordinates';
import { geocodeAddressWithGooglePlaces } from '@/utils/googlePlacesGeocoding';
import { calculateAirDistanceKm } from '@/utils/geoDistance';
import { DriverGoogleMapView } from '../../components/DriverGoogleMapView';
import { useDriverLiveLocation } from '../../hooks/useDriverLiveLocation';

interface DriverRouteMapCardProps {
    activeShipment?: any;
    onOpenGPS: () => void;
}

export const DriverRouteMapCard: React.FC<DriverRouteMapCardProps> = ({
    activeShipment,
    onOpenGPS,
}) => {
    const isValidActiveShipment = Boolean(
        activeShipment &&
        (activeShipment.id || activeShipment.orderNumber || activeShipment.order_no) &&
        !['delivered', 'completed', 'cancelled', 'canceled'].includes(activeShipment.status)
    );

    const originCity = isValidActiveShipment
        ? (activeShipment?.shipper?.city ||
           activeShipment?.pickup_city ||
           activeShipment?.pickup?.city ||
           activeShipment?.origin?.name ||
           '')
        : '';

    const destCity = isValidActiveShipment
        ? (activeShipment?.consignee?.city ||
           activeShipment?.delivery_city ||
           activeShipment?.delivery?.city ||
           activeShipment?.destination?.name ||
           '')
        : '';

    const pickupAddress = isValidActiveShipment
        ? (activeShipment?.shipper?.address ||
           activeShipment?.pickup_address ||
           activeShipment?.pickup?.address ||
           activeShipment?.origin?.address ||
           originCity)
        : '';

    const deliveryAddress = isValidActiveShipment
        ? (activeShipment?.consignee?.address ||
           activeShipment?.delivery_address ||
           activeShipment?.delivery?.address ||
           activeShipment?.destination?.address ||
           destCity)
        : '';

    const [resolvedOrigin, setResolvedOrigin] = useState<[number, number] | null>(null);
    const [resolvedDest, setResolvedDest] = useState<[number, number] | null>(null);

    // Resolve Origin Coordinates with Google Places dynamic geocoding
    useEffect(() => {
        if (!isValidActiveShipment || (!pickupAddress && !originCity)) {
            setResolvedOrigin(null);
            setResolvedDest(null);
            return;
        }

        let isCancelled = false;

        geocodeAddressWithGooglePlaces(pickupAddress, originCity).then((coords) => {
            if (!isCancelled && coords) {
                setResolvedOrigin(coords);
            }
        });

        geocodeAddressWithGooglePlaces(deliveryAddress, destCity).then((coords) => {
            if (!isCancelled && coords) {
                setResolvedDest(coords);
            }
        });

        return () => {
            isCancelled = true;
        };
    }, [isValidActiveShipment, pickupAddress, deliveryAddress, originCity, destCity]);

    // Local synchronous fallback coordinates
    const fallbackOriginCoords = useMemo<[number, number]>(() => {
        if (!isValidActiveShipment) return [0, 0];
        const fromAddr = extractCoordinatesFromAddress(pickupAddress) || extractCoordinatesFromAddress(originCity);
        if (fromAddr) return fromAddr;
        const routeCoords = activeShipment?.route?.originCoords;
        if (
            routeCoords?.lat && routeCoords?.lng &&
            !isNaN(Number(routeCoords.lat)) && Number(routeCoords.lat) !== 0
        ) {
            return [Number(routeCoords.lat), Number(routeCoords.lng)];
        }
        if (activeShipment?.pickup_lat && activeShipment?.pickup_lng) {
            return [Number(activeShipment.pickup_lat), Number(activeShipment.pickup_lng)];
        }
        return [23.8981, 90.3972]; // Tongi / Gazipur default
    }, [isValidActiveShipment, activeShipment, pickupAddress, originCity]);

    const fallbackDestCoords = useMemo<[number, number]>(() => {
        if (!isValidActiveShipment) return [0, 0];
        const fromAddr = extractCoordinatesFromAddress(deliveryAddress) || extractCoordinatesFromAddress(destCity);
        if (fromAddr) return fromAddr;
        const routeCoords = activeShipment?.route?.destinationCoords;
        if (
            routeCoords?.lat && routeCoords?.lng &&
            !isNaN(Number(routeCoords.lat)) && Number(routeCoords.lat) !== 0
        ) {
            return [Number(routeCoords.lat), Number(routeCoords.lng)];
        }
        if (activeShipment?.delivery_lat && activeShipment?.delivery_lng) {
            return [Number(activeShipment.delivery_lat), Number(activeShipment.delivery_lng)];
        }
        return [23.7534, 90.3698]; // Dhanmondi / Dhaka default
    }, [isValidActiveShipment, activeShipment, deliveryAddress, destCity]);

    const originCoords: [number, number] = resolvedOrigin || fallbackOriginCoords;
    const destCoords: [number, number] = resolvedDest || fallbackDestCoords;

    if (!isValidActiveShipment) {
        return (
            <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden font-sans">
                <div className="px-3.5 py-2.5 bg-white dark:bg-[#1e2329] border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[12.5px] text-slate-900 dark:text-slate-100">
                        Route Corridor
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-medium text-[11px]">
                        Standby
                    </span>
                </div>
                <div className="h-[270px] flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-[#15191e]">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
                        <Route size={22} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        No Active Corridor
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
                        You currently have no active shipment assigned. Route corridor and live GPS tracking will activate upon shipment dispatch.
                    </p>
                </div>
            </div>
        );
    }

    // Active Corridor waypoint fallback
    const corridorFallback = useMemo<[number, number]>(() => {
        return [
            originCoords[0] + (destCoords[0] - originCoords[0]) * 0.42,
            originCoords[1] + (destCoords[1] - originCoords[1]) * 0.42,
        ];
    }, [originCoords, destCoords]);

    // Live Driver Location tracking (Browser GPS + Backend API last known)
    const { driverCoords, locateMe, isLocating, isLiveGPS, isRealLocationFix } = useDriverLiveLocation({
        activeOrderId: activeShipment?.id || activeShipment?.orderNumber,
        fallbackCoords: corridorFallback,
        enableWatch: true,
    });

    // Approximate road distance
    const airKm = calculateAirDistanceKm(originCoords[0], originCoords[1], destCoords[0], destCoords[1]);
    const displayDistance =
        activeShipment?.route?.distanceFormatted ||
        activeShipment?.distance ||
        (airKm ? `${(airKm * 1.25).toFixed(1)} km` : '28.4 km');

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoords[0]},${originCoords[1]}&destination=${destCoords[0]},${destCoords[1]}&travelmode=driving`;

    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden font-sans">
            {/* Header: Live GPS Status, Corridor Pill, Distance Badge & Open in Google Maps */}
            <div className="px-3.5 py-2.5 bg-white dark:bg-[#1e2329] border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-extrabold text-[12.5px] text-slate-900 dark:text-slate-100 truncate">
                        Route Corridor
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">
                        • {isRealLocationFix ? 'Real GPS Active' : (isLiveGPS ? 'Live GPS Active' : 'GPS Tracking')}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    {/* Distance Badge */}
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-[4px] border border-slate-200/80 dark:border-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                        <Route size={11} className="text-slate-600 dark:text-slate-400 shrink-0" />
                        <span>{displayDistance}</span>
                    </span>

                    {/* Open in Maps Link */}
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#ff4a1f] px-2 py-0.5 rounded-[4px] border border-[#ff4a1f]/35 hover:border-[#ff4a1f] shadow-2xs text-[11px] font-bold transition-all"
                        title="Open Route in Google Maps"
                    >
                        <span>Maps</span>
                        <ExternalLink size={10} />
                    </a>

                    {/* Fullscreen Expand Button */}
                    <button
                        type="button"
                        onClick={onOpenGPS}
                        className="w-6.5 h-6.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-[4px] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center shadow-2xs transition-all cursor-pointer"
                        title="Expand Live GPS Navigation in New Tab"
                    >
                        <Maximize2 size={11} strokeWidth={2.2} />
                    </button>
                </div>
            </div>

            {/* Google Map View with Driver Live Location, Pickup Pin, and Delivery Pin */}
            <div className="w-full relative overflow-hidden bg-slate-100 dark:bg-[#15191e]" style={{ height: '270px', minHeight: '270px' }}>
                <DriverGoogleMapView
                    originCoords={originCoords}
                    destCoords={destCoords}
                    driverCoords={driverCoords}
                    originTitle={originCity}
                    originAddress={pickupAddress}
                    destTitle={destCity}
                    destAddress={deliveryAddress}
                    height="270px"
                    showFloatingCard={true}
                    showRouteSummaryCards={false}
                    showStartNavigationButton={false}
                    onLocateMe={locateMe}
                    isLocating={isLocating}
                />
            </div>
        </div>
    );
};

export default DriverRouteMapCard;
