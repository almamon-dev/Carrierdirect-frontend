import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Navigation, Phone, Truck } from 'lucide-react';
import { ShipmentItem } from '../../types';
import { ShipmentStatusBadge } from './ShipmentStatusBadge';
import { requireDriverCompliance } from '../../Compliance';
import { GPSComingSoonModal } from '@/components/modals';

interface Props {
    shipment: ShipmentItem;
}

export const ShipmentCard: React.FC<Props> = ({ shipment }) => {
    const [isGPSOpen, setIsGPSOpen] = useState(false);

    const handleGPS = (e: React.MouseEvent) => {
        e.stopPropagation();
        requireDriverCompliance(() => {
            setIsGPSOpen(true);
        }, 'Live GPS Navigation');
    };

    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-3 font-sans">
            {/* Top Header Row */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-[3px] bg-orange-50 dark:bg-[#FF4A1F]/15 text-[#FF4A1F] flex items-center justify-center shrink-0">
                        <Truck size={15} />
                    </div>
                    <div className="min-w-0">
                        <Link
                            to={`/driver/shipments/${shipment.id}`}
                            className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100 hover:text-[#FF4A1F] transition-colors truncate block"
                        >
                            {shipment.orderNumber}
                        </Link>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                            {shipment.trackingNumber}
                        </div>
                    </div>
                </div>

                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <ShipmentStatusBadge status={shipment.status} />
                </div>
            </div>

            {/* Aligned Key : Value Rows with Highlighted Colon */}
            <div className="space-y-1.5 text-xs">
                {/* 1. Origin (Pickup) */}
                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">
                        Pickup Location
                    </span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">
                        :
                    </span>
                    <div className="min-w-0 text-slate-800 dark:text-slate-200 font-semibold text-left">
                        <div className="truncate">{shipment.shipper.company}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate">
                            {shipment.shipper.city}, {shipment.shipper.state}
                        </div>
                        <div className="text-[10.5px] text-[#FF4A1F] font-medium flex items-center gap-1 pt-0.5">
                            <Clock size={10} className="shrink-0" />
                            <span>Window: {shipment.shipper.pickupTimeWindow}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Destination (Delivery) */}
                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0 pt-0.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">
                        Delivery Destination
                    </span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">
                        :
                    </span>
                    <div className="min-w-0 text-slate-800 dark:text-slate-200 font-semibold text-left">
                        <div className="truncate">{shipment.consignee.company}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate">
                            {shipment.consignee.address}, {shipment.consignee.city}
                        </div>
                        <div className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
                            <Clock size={10} className="shrink-0" />
                            <span>ETA: {shipment.consignee.deliveryTimeWindow}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Equipment Type */}
                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0 pt-0.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">
                        Equipment / Type
                    </span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">
                        :
                    </span>
                    <div className="text-slate-800 dark:text-slate-200 font-semibold text-left truncate">
                        {shipment.cargo.freightType}
                    </div>
                </div>

                {/* 4. Cargo Weight & Pallets */}
                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0 pt-0.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">
                        Cargo Specs
                    </span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">
                        :
                    </span>
                    <div className="text-slate-700 dark:text-slate-300 font-medium text-left flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {shipment.cargo.weightKg.toLocaleString()} kg
                        </span>
                        <span>•</span>
                        <span>{shipment.cargo.pallets} Pallets</span>
                    </div>
                </div>

                {/* 5. Route Distance */}
                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0 pt-0.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">
                        Route Distance
                    </span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">
                        :
                    </span>
                    <div className="text-slate-800 dark:text-slate-200 font-semibold text-left">
                        {shipment.route.distanceKm} km
                    </div>
                </div>

                {/* 6. Scheduled Date */}
                <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0 pt-0.5">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-left">
                        Scheduled Date
                    </span>
                    <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">
                        :
                    </span>
                    <div className="text-slate-600 dark:text-slate-400 font-medium text-left">
                        {shipment.shipper.pickupDate}
                    </div>
                </div>
            </div>

            {/* Bottom Actions Footer */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                    {shipment.consignee.phone && (
                        <a
                            href={`tel:${shipment.consignee.phone}`}
                            className="py-1 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-[3px] text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                        >
                            <Phone size={11} />
                            <span>Call</span>
                        </a>
                    )}
                    <button
                        type="button"
                        onClick={handleGPS}
                        className="py-1 px-2.5 bg-orange-50 hover:bg-orange-100/80 dark:bg-orange-950/40 text-[#FF4A1F] border border-orange-200/60 dark:border-orange-900/40 rounded-[3px] text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <Navigation size={11} />
                        <span>GPS Route</span>
                    </button>
                </div>

                <Link to={`/driver/shipments/${shipment.id}`}>
                    <button
                        type="button"
                        className="bg-[#FF4A1F] hover:bg-[#E03E15] text-white text-[11px] font-bold px-3 py-1 rounded-[3px] shadow-2xs transition-colors cursor-pointer"
                    >
                        View Details
                    </button>
                </Link>
            </div>

            <GPSComingSoonModal
                isOpen={isGPSOpen}
                destination={`${shipment.consignee.address}, ${shipment.consignee.city}`}
                onClose={() => setIsGPSOpen(false)}
            />
        </div>
    );
};
