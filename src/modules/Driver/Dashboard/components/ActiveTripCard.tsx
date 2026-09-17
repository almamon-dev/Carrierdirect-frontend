import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Clock, Truck, ArrowRight, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/button';

interface Props {
    activeTrip: any;
}

export const ActiveTripCard: React.FC<Props> = ({ activeTrip }) => {
    if (!activeTrip) return null;

    return (
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            {/* Background grid ambient */}
            <div className="absolute top-0 right-0 w-96 h-full bg-radial from-orange-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-5">
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                            Active Shipment In-Transit
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-white/10 rounded-md">
                            {activeTrip.orderNumber}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-300">ETA:</span>
                        <span className="text-xs font-bold text-orange-400 bg-orange-950/60 px-2.5 py-1 rounded-md border border-orange-500/30">
                            {activeTrip.destination?.eta || '12:45 PM Today'}
                        </span>
                    </div>
                </div>

                {/* Route visualization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    {/* Origin */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                            <span>Origin • Departed {activeTrip.origin?.departedAt}</span>
                        </div>
                        <div className="font-bold text-sm text-white pl-4">{activeTrip.origin?.facility}</div>
                        <div className="text-xs text-slate-400 pl-4">{activeTrip.origin?.address}</div>
                    </div>

                    {/* Destination */}
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold">
                            <MapPin size={12} className="shrink-0" />
                            <span>Destination ({activeTrip.destination?.distanceRemainingKm} km remaining)</span>
                        </div>
                        <div className="font-bold text-sm text-white pl-4">{activeTrip.destination?.facility}</div>
                        <div className="text-xs text-slate-400 pl-4">{activeTrip.destination?.address}</div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                        <span>Route Progress</span>
                        <span className="text-orange-400 font-bold">{activeTrip.progressPercent}% Completed</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-[#FF4A1F] rounded-full transition-all duration-500"
                            style={{ width: `${activeTrip.progressPercent}%` }}
                        />
                    </div>
                </div>

                {/* Cargo Specs & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10">
                    <div className="text-xs text-slate-300">
                        <span className="text-slate-400">Cargo:</span> <span className="font-semibold text-white">{activeTrip.cargo?.type}</span> ({activeTrip.cargo?.tempControlled})
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeTrip.destination?.address || '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                            <Navigation size={14} className="text-orange-400" />
                            <span>Open Navigation</span>
                        </a>

                        <Link to={`/driver/shipments/${activeTrip.id}`}>
                            <Button size="sm" className="bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md">
                                <span>Manage Delivery</span>
                                <ArrowRight size={14} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
