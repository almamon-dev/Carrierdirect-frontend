import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { ShipmentItem } from '../../../types';

interface Props {
    shipment: ShipmentItem;
    onOpenGPS?: (destination?: string) => void;
}

export const DriverShipmentLocationsCard: React.FC<Props> = ({ shipment }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden font-sans">
            {/* Header */}
            <div className="px-4 py-2.5 min-h-[42px] border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#FF4A1F]" />
                    <h2 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                        Facility Routing & Dispatch Checkpoints
                    </h2>
                </div>
                <span className="h-6.5 px-2.5 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 rounded-[3px] border border-slate-200 dark:border-slate-700 inline-flex items-center">
                    Location Intel
                </span>
            </div>

            {/* Flat 2-Column Split: Shipper (Pickup) & Consignee (Delivery) */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                {/* 1. Origin Pickup Shipper */}
                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-50 dark:ring-blue-950/40 shrink-0" />
                            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                                Pickup Shipper Facility
                            </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Calendar size={11} /> {shipment.shipper.pickupDate}
                        </span>
                    </div>

                    {/* Aligned Key : Value Rows */}
                    <div className="space-y-1.5 text-xs">
                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Company</span>
                            <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 truncate">{shipment.shipper.company}</span>
                        </div>

                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Address</span>
                            <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                            <span className="text-slate-700 dark:text-slate-300 leading-snug">{shipment.shipper.address}, {shipment.shipper.city}, {shipment.shipper.state} {shipment.shipper.zip}</span>
                        </div>

                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Contact Person</span>
                            <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{shipment.shipper.name}</span>
                        </div>

                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Phone Number</span>
                            <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                            <a href={`tel:${shipment.shipper.phone}`} className="font-mono font-bold text-[#FF4A1F] hover:underline">
                                {shipment.shipper.phone}
                            </a>
                        </div>

                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Pickup Window</span>
                            <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">{shipment.shipper.pickupTimeWindow}</span>
                        </div>

                        {shipment.shipper.notes && (
                            <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0 pt-0.5">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Facility Notes</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                <span className="text-slate-600 dark:text-slate-300 italic">{shipment.shipper.notes}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Destination Delivery Consignee */}
                <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#FF4A1F] ring-4 ring-orange-50 dark:ring-orange-950/40 shrink-0" />
                            <span className="text-[11px] font-bold text-[#FF4A1F] uppercase tracking-wider">
                                Delivery Consignee (Final)
                            </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Calendar size={11} /> {shipment.consignee.deliveryDate}
                        </span>
                    </div>

                    {/* Aligned Key : Value Rows */}
                    <div className="space-y-1.5 text-xs">
                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Company</span>
                            <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 truncate">{shipment.consignee.company}</span>
                        </div>

                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Address</span>
                            <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                            <span className="text-slate-700 dark:text-slate-300 leading-snug">{shipment.consignee.address}, {shipment.consignee.city}, {shipment.consignee.state} {shipment.consignee.zip}</span>
                        </div>

                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Contact Person</span>
                            <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{shipment.consignee.name}</span>
                        </div>

                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Phone Number</span>
                            <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                            <a href={`tel:${shipment.consignee.phone}`} className="font-mono font-bold text-[#FF4A1F] hover:underline">
                                {shipment.consignee.phone}
                            </a>
                        </div>

                        <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0">
                            <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Delivery ETA</span>
                            <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{shipment.consignee.deliveryTimeWindow}</span>
                        </div>

                        {shipment.consignee.notes && (
                            <div className="grid grid-cols-[130px_14px_1fr] items-start min-w-0 pt-0.5">
                                <span className="text-slate-500 dark:text-slate-400 font-medium text-left">Receiver Notes</span>
                                <span className="text-[#FF4A1F] font-bold text-center select-none shrink-0">:</span>
                                <span className="text-slate-600 dark:text-slate-300 italic">{shipment.consignee.notes}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverShipmentLocationsCard;
