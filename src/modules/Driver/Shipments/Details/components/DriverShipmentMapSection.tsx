import React from 'react';
import { ArrowRight, Navigation } from 'lucide-react';
import { ShipmentItem, ShipmentStatus } from '../../../types';
import { DriverShipmentStepper } from './DriverShipmentStepper';
import useCustomerOrderMap from '@/modules/Customer/OrderManagement/Details/hooks/useCustomerOrderMap';

interface Props {
    shipment: ShipmentItem;
}

export const DriverShipmentMapSection: React.FC<Props> = ({ shipment }) => {
    const fromCity = shipment.shipper.city || 'Origin';
    const toCity = shipment.consignee.city || 'Destination';

    const status: ShipmentStatus = shipment.status;
    const isCompleted = status === 'completed';

    let currentStepNum = 1;
    let isDelivered = false;

    if (status === 'completed' || status === 'delivered') {
        currentStepNum = 4;
        isDelivered = true;
    } else if (status === 'at_delivery') {
        currentStepNum = 4;
    } else if (status === 'in_transit') {
        currentStepNum = 3;
    } else if (status === 'at_pickup') {
        currentStepNum = 2;
    } else if (status === 'assigned' || status === 'accepted') {
        currentStepNum = 1;
    }

    const findHistoryTime = (keywords: string[]) => {
        if (!shipment.history || !Array.isArray(shipment.history)) return null;
        for (const item of shipment.history) {
            const itemStatus = String(item.status || item.title || '').toLowerCase();
            if (keywords.some(k => itemStatus.includes(k))) {
                if (item.time) return item.time;
                if ((item as any).created_at) {
                    return new Date((item as any).created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    });
                }
            }
        }
        return null;
    };

    const assignedTime = findHistoryTime(['assigned', 'confirmed']) || (shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Scheduled');
    const pickupTime = findHistoryTime(['pickup', 'picked_up', 'loaded']) || (shipment.shipper.pickupDate || 'Scheduled');
    const transitTime = findHistoryTime(['in_transit']) || 'In Transit';
    const deliveryTime = findHistoryTime(['delivered', 'completed']) || (shipment.consignee.deliveryDate || 'Completed');

    const steps = [
        {
            id: 1,
            label: 'Assigned',
            subLabel: 'Driver assigned',
            time: assignedTime,
            completed: currentStepNum > 1 || isDelivered,
            active: currentStepNum === 1 && !isDelivered,
        },
        {
            id: 2,
            label: 'Pickup',
            subLabel: 'Goods picked up',
            time: (currentStepNum > 2 || isDelivered) ? pickupTime : (currentStepNum === 2 ? 'In Progress' : 'Pending'),
            completed: currentStepNum > 2 || isDelivered,
            active: currentStepNum === 2 && !isDelivered,
        },
        {
            id: 3,
            label: 'In Transit',
            subLabel: 'On the way to destination',
            time: (currentStepNum > 3 || isDelivered) ? transitTime : 'Live',
            completed: currentStepNum > 3 || isDelivered,
            active: currentStepNum === 3 && !isDelivered,
            isLive: currentStepNum === 3 && !isDelivered,
        },
        {
            id: 4,
            label: isCompleted ? 'Completed' : 'Delivered',
            subLabel: isCompleted ? 'Delivery completed & verified' : (isDelivered ? 'Goods delivered' : 'Pending'),
            time: isDelivered ? deliveryTime : 'Pending',
            completed: isDelivered,
            active: currentStepNum === 4 && !isDelivered,
        },
    ];

    const pickupLat = shipment.route?.originCoords?.lat;
    const pickupLng = shipment.route?.originCoords?.lng;
    const deliveryLat = shipment.route?.destinationCoords?.lat;
    const deliveryLng = shipment.route?.destinationCoords?.lng;

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
        pickupAddress: shipment.shipper.address || fromCity,
        deliveryAddress: shipment.consignee.address || toCity,
    });

    return (
        <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs overflow-hidden font-sans">
            {/* Top Subheader with Corridor Info */}
            <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                        {isCompleted ? 'Completed Route Overview' : 'Live Shipment Tracking'}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                        {isCompleted ? 'Route Finalized' : 'GPS Signal Active'}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-xs">
                    <span className="flex items-center gap-1.5 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <Navigation size={11} className="text-[#FF4A1F]" />
                        <span className="font-bold text-slate-900 dark:text-slate-100">{shipment.shipper.city}</span>
                        <ArrowRight size={10} className="text-slate-400" />
                        <span className="font-bold text-slate-900 dark:text-slate-100">{shipment.consignee.city}</span>
                    </span>
                </div>
            </div>

            {/* Map Frame with Interactive Auto-Bounds Zoom */}
            <div className="w-full h-[200px] sm:h-[240px] relative overflow-hidden bg-slate-100 dark:bg-[#15191e]">
                {hasExactCoordinates && !mapError && (
                    <div ref={mapContainerRef} className="w-full h-full" />
                )}

                {(!hasExactCoordinates || !mapLoaded || mapError) && (
                    <iframe
                        title="Driver Live Route"
                        src={embedMapSrc}
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'opacity(0.92)' }}
                        loading="lazy"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent pointer-events-none" />

                {/* Floating Corridor Distance badge & Google Maps Navigation */}
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 flex-wrap pointer-events-none">
                    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-2 text-[11px] pointer-events-auto">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-700 dark:text-slate-200 font-medium">
                            Direct Transit Corridor: <strong className="text-slate-900 dark:text-white font-bold">{shipment.route.distanceKm} km</strong> ({shipment.route.estimatedDuration})
                        </span>
                    </div>

                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#FF4A1F] hover:bg-[#E03E15] text-white px-2.5 py-1 rounded-[4px] shadow-2xs flex items-center gap-1.5 text-[11px] font-bold pointer-events-auto transition-colors"
                    >
                        <Navigation size={11} />
                        <span>Navigate in Maps</span>
                    </a>
                </div>
            </div>

            {/* Clean 4-Stage Stepper Progress Bar */}
            <DriverShipmentStepper steps={steps} />
        </div>
    );
};
