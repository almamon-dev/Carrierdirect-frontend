import React from 'react';
import { ExternalLink, Route } from 'lucide-react';
import { useSupplierOrderMap } from '../hooks/useSupplierOrderMap';

interface SupplierMapSectionProps {
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
    timeline?: any[];
}

export const SupplierMapSection: React.FC<SupplierMapSectionProps> = ({ order }) => {
    const {
        mapContainerRef,
        mapLoaded,
        mapError,
        distanceFormatted,
        googleMapsUrl,
        embedMapSrc,
    } = useSupplierOrderMap({ order });

    const displayDistance = distanceFormatted !== '-' ? distanceFormatted : (order.distance || '248.50 km');

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
                        title="Open Live Route in Maps"
                    >
                        <span>Open in Maps</span>
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>

            {/* Map Frame */}
            <div className="w-full h-[220px] sm:h-[260px] relative overflow-hidden bg-slate-100 dark:bg-[#15191e]">
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
