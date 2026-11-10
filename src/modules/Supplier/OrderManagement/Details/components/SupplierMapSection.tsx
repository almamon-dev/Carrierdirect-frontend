import React from 'react';
import { ExternalLink, Route, ArrowUpDown } from 'lucide-react';
import { useSupplierOrderMap } from '../hooks/useSupplierOrderMap';

interface SupplierMapSectionProps {
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
    timeline?: any[];
}

export const SupplierMapSection: React.FC<SupplierMapSectionProps> = ({ order }) => {
    const fromCity = (order.from && order.from !== '-') ? order.from : 'Gazipur';
    const toCity = (order.to && order.to !== '-') ? order.to : 'Dhaka';

    const pickupAddress = (order.pickupFullAddress && order.pickupFullAddress !== '-')
        ? order.pickupFullAddress
        : (order.pickup_address && order.pickup_address !== '-'
            ? order.pickup_address
            : `${fromCity} Cargo Hub, Terminal 1`);

    const deliveryAddress = (order.deliveryFullAddress && order.deliveryFullAddress !== '-')
        ? order.deliveryFullAddress
        : (order.delivery_address && order.delivery_address !== '-'
            ? order.delivery_address
            : `${toCity} Logistics Center, Receiving Dock 4`);

    const {
        mapContainerRef,
        mapLoaded,
        mapError,
        distanceFormatted,
        googleMapsUrl,
        embedMapSrc,
    } = useSupplierOrderMap({
        order,
        pickupAddressOverride: pickupAddress,
        deliveryAddressOverride: deliveryAddress,
    });

    const displayDistance = distanceFormatted !== '-' && distanceFormatted !== '—'
        ? distanceFormatted
        : (order.distance || '28.40 km');

    return (
        <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs overflow-hidden font-sans">
            {/* Header / Corridor Status Bar matching reference screenshot */}
            <div className="px-4 py-3 bg-white dark:bg-[#1e2329] border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-extrabold text-xs text-slate-900 dark:text-slate-100">Live Tracking</span>
                    <span className="text-slate-400 dark:text-slate-500 font-normal">GPS Active</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-[4px] border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                        <Route size={13} className="text-slate-600 dark:text-slate-400 shrink-0" />
                        <span>{displayDistance}</span>
                    </span>

                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#ff4a1f] px-2.5 py-1 rounded-[4px] border border-[#ff4a1f]/35 hover:border-[#ff4a1f] shadow-2xs text-xs font-bold transition-all"
                        title="Open Live Route in Google Maps"
                    >
                        <span>Open in Maps</span>
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>

            {/* Map Frame with Floating Location Overlay Card */}
            <div className="w-full h-[260px] sm:h-[300px] relative overflow-hidden bg-slate-100 dark:bg-[#15191e]">
                {/* Floating Location Overlay Card matching reference design */}
                <div className="absolute top-3 left-3 z-[10] bg-white/95 dark:bg-[#1e2329]/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-700/80 rounded-lg shadow-md p-2.5 sm:p-3 max-w-[320px] sm:max-w-[420px] pointer-events-auto">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            {/* Pickup Location */}
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-100 dark:ring-emerald-950/60" />
                                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50">
                                        Pickup Location
                                    </span>
                                </div>
                                <p className="text-[11px] sm:text-[11.5px] font-bold text-slate-900 dark:text-slate-100 pl-3.5 mt-0.5 leading-snug break-words" title={pickupAddress}>
                                    {pickupAddress}
                                </p>
                            </div>

                            {/* Dotted Route Connector */}
                            <div className="w-[1px] h-2.5 border-l-2 border-dotted border-slate-300 dark:border-slate-600 ml-[3px] my-0.5" />

                            {/* Destination Location */}
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 ring-2 ring-rose-100 dark:ring-rose-950/60" />
                                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/50">
                                        Destination Location
                                    </span>
                                </div>
                                <p className="text-[11px] sm:text-[11.5px] font-bold text-slate-900 dark:text-slate-100 pl-3.5 mt-0.5 leading-snug break-words" title={deliveryAddress}>
                                    {deliveryAddress}
                                </p>
                            </div>
                        </div>

                        {/* Bidirectional Route Arrow Icon */}
                        <div className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 shrink-0 pr-0.5 cursor-default" title="Route Corridor">
                            <ArrowUpDown size={14} />
                        </div>
                    </div>
                </div>

                <div
                    ref={mapContainerRef}
                    className={`w-full h-full ${mapLoaded && !mapError ? 'block' : 'hidden'}`}
                />

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
            </div>
        </div>
    );
};

export default SupplierMapSection;
