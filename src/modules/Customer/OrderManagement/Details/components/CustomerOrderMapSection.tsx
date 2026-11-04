import { ArrowRight, ExternalLink, Navigation } from 'lucide-react';
import React from 'react';
import useCustomerOrderMap from '../hooks/useCustomerOrderMap';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';

interface CustomerOrderMapSectionProps {
    order: NormalizedCustomerOrder;
    timeline?: any[];
    isRefreshing?: boolean;
    onRefreshLive?: () => void;
}

export const CustomerOrderMapSection: React.FC<CustomerOrderMapSectionProps> = ({ order }) => {
    const fromCity = order.pickup.city || 'Origin';
    const toCity = order.delivery.city || 'Destination';
    const pickupLat = order.pickupLat ?? order.pickup?.lat;
    const pickupLng = order.pickupLng ?? order.pickup?.lng;
    const deliveryLat = order.deliveryLat ?? order.delivery?.lat;
    const deliveryLng = order.deliveryLng ?? order.delivery?.lng;

    const productLoc = order.productLocation || {
        stage: 'at_pickup' as const,
        statusLabel: 'At Pickup Facility',
        currentAddress: order.pickup.address || fromCity,
        currentCity: fromCity,
        hasLiveGps: false,
        updatedHuman: 'Just now',
    };

    const {
        mapContainerRef,
        mapLoaded,
        mapError,
        googleMapsUrl,
        embedMapSrc,
        liveDistanceText,
    } = useCustomerOrderMap({
        pickupLat,
        pickupLng,
        deliveryLat,
        deliveryLng,
        driverLat: order.driverLat,
        driverLng: order.driverLng,
        fromCity,
        toCity,
        pickupAddress: order.pickup.address,
        deliveryAddress: order.delivery.address,
        productStage: productLoc.stage,
        productStatusLabel: productLoc.statusLabel,
        productCurrentAddress: productLoc.currentAddress,
        cargoSummary: order.vehicle?.goodsType !== '-' ? order.vehicle.goodsType : order.loadType,
        driverName: order.driver?.name,
        vehiclePlate: order.driver?.plate || order.vehicle?.number,
        updatedHuman: productLoc.updatedHuman,
    });

    const displayDistance =
        order.distance && order.distance !== '—' && order.distance !== '-'
            ? order.distance
            : liveDistanceText || '';

    return (
        <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs overflow-hidden font-sans">
            {/* Clean Top Subheader */}
            <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>Route:</span>
                        <span className="text-[#ff4a1f]">{fromCity}</span>
                        <ArrowRight size={12} className="text-slate-400" />
                        <span className="text-[#ff4a1f]">{toCity}</span>
                    </span>
                    {displayDistance && (
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                            ({displayDistance})
                        </span>
                    )}
                </div>

                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                    <Navigation size={11} />
                    <span>Open in Google Maps</span>
                    <ExternalLink size={10} />
                </a>
            </div>

            {/* Map Canvas */}
            <div className="relative w-full h-[240px] sm:h-[260px] bg-slate-100 dark:bg-slate-900">
                <div
                    ref={mapContainerRef}
                    className={`w-full h-full ${mapLoaded && !mapError ? 'block' : 'hidden'}`}
                />

                {(!mapLoaded || mapError) && (
                    <iframe
                        src={embedMapSrc}
                        title={`Route from ${fromCity} to ${toCity}`}
                        className="w-full h-full border-0 contrast-[105%]"
                        loading="lazy"
                    />
                )}
            </div>
        </div>
    );
};

export default CustomerOrderMapSection;
