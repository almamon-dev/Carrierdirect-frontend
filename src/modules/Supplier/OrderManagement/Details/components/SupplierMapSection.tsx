import React from 'react';
import { ArrowRight, ExternalLink, Navigation } from 'lucide-react';
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
        fromCity,
        toCity,
        distanceFormatted,
        googleMapsUrl,
        embedMapSrc,
    } = useSupplierOrderMap({ order });

    return (
        <div className="w-full bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden font-sans">
            {/* Header / Corridor Status Bar */}
            <div className="px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Active Transit Corridor</span>
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

                {/* Floating Real-Time Details Badge */}
                <div className="absolute bottom-2.5 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-3 py-1.5 rounded-md border border-slate-200/80 dark:border-slate-800 shadow-md flex items-center gap-2 text-[11.5px] pointer-events-auto">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Direct Freight Route ({distanceFormatted})
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SupplierMapSection;
