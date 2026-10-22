import React, { useState } from 'react';
import { Navigation, Sparkles, MapPin, Gauge, Radio, ShieldCheck, Zap, Fuel, ExternalLink, X } from 'lucide-react';
import Modal from '@/components/modals/modal';

interface DriverLiveGPSModalProps {
    isOpen: boolean;
    onClose: () => void;
    activeShipment?: any;
    destination?: string;
}

export const DriverLiveGPSModal: React.FC<DriverLiveGPSModalProps> = ({
    isOpen,
    onClose,
    activeShipment,
    destination,
}) => {
    const [selectedRoute, setSelectedRoute] = useState<'fastest' | 'toll_free' | 'eco'>('fastest');

    const destAddress = typeof destination === 'string' && destination.trim()
        ? destination.trim()
        : (activeShipment?.destination?.address || 'Gazipur Central Logistics, Gazipur');
    const originAddress = activeShipment?.origin?.address || 'Dhaka Airport Cargo Terminal, Kurmitola, Dhaka';
    const orderNumber = activeShipment?.orderNumber || '#ORD-NIBE-10001';
    const distanceKm = activeShipment?.distanceKm || 21.4;

    const encodedOrigin = encodeURIComponent(originAddress);
    const encodedDest = encodeURIComponent(destAddress);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedDest}&travelmode=driving`;
    const embedMapSrc = `https://maps.google.com/maps?q=${encodedDest}&t=&z=12&ie=UTF8&iwloc=&output=embed`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            showCloseButton={false}
        >
            <div className="flex flex-col w-full font-sans text-slate-800 dark:text-slate-100 -m-6 sm:-m-7">
                {/* 1. Modal Top Header */}
                <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#FF4A1F] flex items-center justify-center text-white shadow-sm">
                            <Navigation size={17} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm tracking-tight">{orderNumber}</span>
                                <span className="flex items-center gap-1 px-2 py-0.5 text-[10.5px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                    GPS ACTIVE
                                </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                                Live In-App Truck Navigation & Telemetry
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <X size={15} />
                    </button>
                </div>

                {/* 2. Best Route Active Green Banner (Synced with Driver App) */}
                <div className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200/80 dark:border-emerald-900/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="font-bold text-xs sm:text-[12.5px] text-emerald-950 dark:text-emerald-200 truncate">
                            {selectedRoute === 'fastest' && 'Best Route Active: Via Main Highway Corridor (Saves 18m • Fastest Corridor)'}
                            {selectedRoute === 'toll_free' && 'Alternative Route: Via Secondary Arterial (Avoids Tolls • +14 km)'}
                            {selectedRoute === 'eco' && 'Alternative Route: Eco Haul Transit Corridor (-12% Fuel Burn)'}
                        </span>
                    </div>
                    <span className="px-2 py-0.5 text-[9.5px] font-bold uppercase rounded bg-emerald-600 text-white tracking-wider shrink-0 shadow-2xs">
                        {selectedRoute === 'fastest' ? 'FASTEST' : selectedRoute === 'toll_free' ? 'TOLL FREE' : 'ECO SAVER'}
                    </span>
                </div>

                {/* 3. Route Corridors Quick Selector Tabs */}
                <div className="px-5 py-2 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/80 flex items-center gap-2 overflow-x-auto text-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider shrink-0">Corridors:</span>
                    <button
                        type="button"
                        onClick={() => setSelectedRoute('fastest')}
                        className={`px-3 py-1.5 rounded-[4px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            selectedRoute === 'fastest'
                                ? 'bg-[#FF4A1F] text-white shadow-2xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        <Zap size={12} />
                        <span>Route 1: Fastest Highway (28m • {distanceKm} km)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedRoute('toll_free')}
                        className={`px-3 py-1.5 rounded-[4px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            selectedRoute === 'toll_free'
                                ? 'bg-[#FF4A1F] text-white shadow-2xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        <ShieldCheck size={12} />
                        <span>Route 2: Avoid Tolls (+14 km)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedRoute('eco')}
                        className={`px-3 py-1.5 rounded-[4px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            selectedRoute === 'eco'
                                ? 'bg-[#FF4A1F] text-white shadow-2xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        <Fuel size={12} />
                        <span>Route 3: Eco Fuel Saver (-12% Fuel)</span>
                    </button>
                </div>

                {/* 4. Live Map Frame with Route Overlay */}
                <div className="w-full h-[280px] sm:h-[340px] relative bg-slate-950 overflow-hidden">
                    <iframe
                        title="Live Truck GPS Navigation"
                        src={embedMapSrc}
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'opacity(0.95)' }}
                        loading="lazy"
                    />

                    {/* Top Turn Next Instruction Banner */}
                    <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-md bg-emerald-800/95 text-white backdrop-blur-xs px-3.5 py-2.5 rounded-lg shadow-lg border border-emerald-700/80 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-950/60 flex items-center justify-center shrink-0">
                            <Navigation size={18} className="rotate-45" />
                        </div>
                        <div className="min-w-0">
                            <div className="text-[13px] font-extrabold leading-tight">In 1.2 km, continue on Dhaka-Mymensingh Hwy</div>
                            <div className="text-[11px] text-emerald-200 truncate mt-0.5">Speed: 52 km/h • Speed Limit 60 km/h</div>
                        </div>
                    </div>

                    {/* Bottom Floating Stats */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 flex-wrap">
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200">
                                <Gauge size={13} className="text-emerald-500" />
                                <span className="font-bold">28 min</span> remaining
                            </div>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-200">
                                <Radio size={13} className="text-[#FF4A1F]" />
                                <span>{distanceKm} km</span>
                            </div>
                        </div>

                        <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#FF4A1F] hover:bg-[#E03E15] text-white px-3 py-1.5 rounded-md shadow-md flex items-center gap-1.5 text-xs font-bold transition-all"
                        >
                            <ExternalLink size={13} />
                            <span>Open in Google Maps App</span>
                        </a>
                    </div>
                </div>

                {/* 5. Origin to Destination Specs */}
                <div className="p-4 bg-white dark:bg-[#1e2329] border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2.5">
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-[#FF4A1F] bg-white flex items-center justify-center shrink-0 mt-0.5">
                            <span className="w-1 h-1 rounded-full bg-[#FF4A1F]" />
                        </div>
                        <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-slate-100">Origin / Shipper</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{originAddress}</div>
                        </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                        <div className="w-3.5 h-3.5 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin size={15} className="fill-blue-500 text-white" />
                        </div>
                        <div className="min-w-0">
                            <div className="font-bold text-slate-900 dark:text-slate-100">Destination / Consignee</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{destAddress}</div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default DriverLiveGPSModal;
