import { ArrowRight, ExternalLink, Navigation } from 'lucide-react';
import React from 'react';
import useCustomerOrderMap from '../hooks/useCustomerOrderMap';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';

interface CustomerOrderMapSectionProps {
    order: NormalizedCustomerOrder;
    timeline?: any[];
}

export const CustomerOrderMapSection: React.FC<CustomerOrderMapSectionProps> = ({ order, timeline }) => {
    const fromCity = order.pickup.city || 'Origin';
    const toCity = order.delivery.city || 'Destination';
    const pickupLat = order.pickupLat ?? order.pickup?.lat;
    const pickupLng = order.pickupLng ?? order.pickup?.lng;
    const deliveryLat = order.deliveryLat ?? order.delivery?.lat;
    const deliveryLng = order.deliveryLng ?? order.delivery?.lng;

    const {
        mapContainerRef,
        mapLoaded,
        mapError,
        hasExactCoordinates,
        googleMapsUrl,
        embedMapSrc,
    } = useCustomerOrderMap({
        pickupLat,
        pickupLng,
        deliveryLat,
        deliveryLng,
        fromCity,
        toCity,
        pickupAddress: order.pickup.address,
        deliveryAddress: order.delivery.address,
    });

    const milestoneSteps = [
        {
            id: 1,
            label: 'Order Booked',
            completed: Boolean(timeline?.[0]?.completed && !timeline?.[0]?.active),
            active: Boolean(timeline?.[0]?.active),
        },
        {
            id: 2,
            label: 'Driver Assigned',
            completed: Boolean(timeline?.[1]?.completed && !timeline?.[1]?.active),
            active: Boolean(timeline?.[1]?.active),
        },
        {
            id: 3,
            label: 'Goods Picked Up',
            completed: Boolean(timeline?.[2]?.completed && !timeline?.[2]?.active),
            active: Boolean(timeline?.[2]?.active),
        },
        {
            id: 4,
            label: 'In Transit',
            completed: Boolean(timeline?.[3]?.completed && !timeline?.[3]?.active),
            active: Boolean(timeline?.[3]?.active),
        },
        {
            id: 5,
            label: 'Delivered',
            completed: Boolean(
                timeline?.[6]?.completed ||
                timeline?.[5]?.completed ||
                (timeline?.[4]?.completed && !timeline?.some((t) => t.active))
            ),
            active: Boolean(timeline?.[4]?.active || (timeline?.[5]?.active && !timeline?.[6]?.completed)),
        },
    ];

    return (
        <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs overflow-hidden font-sans">
            {/* Top Subheader with Live Status Bar & Actions */}
            <div className="px-3.5 py-2.5 bg-slate-50/90 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>Live Route & GPS Corridor:</span>
                        <span className="text-[#ff4a1f]">{fromCity}</span>
                        <ArrowRight size={12} className="text-slate-400" />
                        <span className="text-[#ff4a1f]">{toCity}</span>
                    </span>
                    {order.distance && (
                        <span className="text-slate-400 text-[11px] hidden sm:inline">
                            • {order.distance}
                        </span>
                    )}
                </div>

                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 px-2 py-0.5 rounded"
                >
                    <Navigation size={11} />
                    <span>Open in Google Maps</span>
                    <ExternalLink size={10} />
                </a>
            </div>

            {/* Map Canvas */}
            <div className="relative w-full h-[260px] sm:h-[300px] bg-slate-100 dark:bg-slate-900">
                {hasExactCoordinates && !mapError && (
                    <div ref={mapContainerRef} className="w-full h-full" />
                )}

                {(!hasExactCoordinates || !mapLoaded || mapError) && (
                    <iframe
                        src={embedMapSrc}
                        title={`Route from ${fromCity} to ${toCity}`}
                        className="w-full h-full border-0 grayscale-[20%] contrast-[105%]"
                        loading="lazy"
                    />
                )}
            </div>
        </div>
    );
};

export default CustomerOrderMapSection;
