import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Clock, ArrowRight, Phone } from 'lucide-react';
import { ShipmentItem } from '../../types';
import { ShipmentStatusBadge } from './ShipmentStatusBadge';

import { requireDriverCompliance } from '../../Compliance';

interface Props {
    shipment: ShipmentItem;
}

export const ShipmentCard: React.FC<Props> = ({ shipment }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3">
            {/* Header: Tracking + Status + Priority */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white">
                        {shipment.orderNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">({shipment.trackingNumber})</span>
                    {shipment.priority === 'Urgent' && (
                        <span className="px-1.5 py-0.2 text-[10px] font-bold bg-red-50 dark:bg-red-950/60 text-red-600 rounded-[3px] border border-red-200/60 dark:border-red-900/40">
                            Urgent
                        </span>
                    )}
                </div>

                <ShipmentStatusBadge status={shipment.status} />
            </div>

            {/* Route & Address Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                {/* Shipper Origin */}
                <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Pickup Location</span>
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                        {shipment.shipper.company}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {shipment.shipper.address}, {shipment.shipper.city}, {shipment.shipper.state} {shipment.shipper.zip}
                    </div>
                    <div className="text-[10.5px] text-[#FF4A1F] font-semibold pt-0.5 flex items-center gap-1">
                        <Clock size={11} />
                        <span>Window: {shipment.shipper.pickupTimeWindow}</span>
                    </div>
                </div>

                {/* Consignee Destination */}
                <div className="p-2.5 sm:p-3 bg-slate-50 dark:bg-[#161a22] rounded-[4px] border border-slate-100 dark:border-slate-800/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                        <MapPin size={11} className="text-[#FF4A1F]" />
                        <span>Delivery Destination</span>
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white truncate">
                        {shipment.consignee.company}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {shipment.consignee.address}, {shipment.consignee.city}, {shipment.consignee.state} {shipment.consignee.zip}
                    </div>
                    <div className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold pt-0.5 flex items-center gap-1">
                        <Clock size={11} />
                        <span>ETA: {shipment.consignee.deliveryTimeWindow}</span>
                    </div>
                </div>
            </div>

            {/* Cargo Specs bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs bg-slate-50/70 dark:bg-[#161a22] p-2 sm:p-2.5 rounded-[4px] border border-slate-100 dark:border-slate-800/60">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-600 dark:text-slate-300">
                    <div><span className="text-slate-400">Cargo:</span> <span className="font-semibold">{shipment.cargo.freightType}</span></div>
                    <div><span className="text-slate-400">Weight:</span> <span className="font-semibold">{shipment.cargo.weightKg.toLocaleString()} kg ({shipment.cargo.pallets} Plts)</span></div>
                    <div><span className="text-slate-400">Distance:</span> <span className="font-semibold">{shipment.route.distanceKm} km</span></div>
                </div>

                <div className="font-bold text-slate-900 dark:text-white">
                    Payout: <span className="text-emerald-600 dark:text-emerald-400 font-black">{shipment.payout.currency}{shipment.payout.driverEarnings.toFixed(2)}</span>
                </div>
            </div>

            {/* Actions footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {shipment.consignee.phone && (
                        <a
                            href={`tel:${shipment.consignee.phone}`}
                            className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                            <Phone size={12} />
                            <span>Call Consignee</span>
                        </a>
                    )}
                    <button
                        type="button"
                        onClick={() => {
                            requireDriverCompliance(() => {
                                window.open(
                                    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(shipment.consignee.address + ', ' + shipment.consignee.city)}`,
                                    '_blank'
                                );
                            }, 'Live GPS Route');
                        }}
                        className="py-1.5 px-2.5 bg-orange-50 hover:bg-orange-100/80 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/60 dark:border-orange-900/40 rounded-[4px] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <Navigation size={12} />
                        <span>GPS Route</span>
                    </button>
                </div>

                <Link to={`/driver/shipments/${shipment.id}`}>
                    <button
                        type="button"
                        className="bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-xs font-bold px-3 py-1.5 rounded-[4px] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                        <span>View Details</span>
                        <ArrowRight size={13} />
                    </button>
                </Link>
            </div>
        </div>
    );
};
