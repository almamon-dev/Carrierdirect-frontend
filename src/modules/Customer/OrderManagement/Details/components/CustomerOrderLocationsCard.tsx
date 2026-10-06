import React from 'react';
import { MapPin, Calendar, Building, Phone, Mail } from 'lucide-react';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';

interface CustomerOrderLocationsCardProps {
    order: NormalizedCustomerOrder;
}

export const CustomerOrderLocationsCard: React.FC<CustomerOrderLocationsCardProps> = ({ order }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden font-sans">
            {/* Header */}
            <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#15191e]/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#ff4a1f]" />
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                        Shipment Route & Facilities
                    </h3>
                </div>
                <span className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    {order.distance} Direct Transit
                </span>
            </div>

            {/* Flat 2-Column Section without nested inner cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800/80">
                {/* Pickup Point (Origin) Column */}
                <div className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-950/60 shrink-0" />
                            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                Pickup Point (Origin)
                            </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                            <Calendar size={11} className="text-slate-400" /> {order.pickup.date}
                        </span>
                    </div>

                    <div className="grid grid-cols-[105px_12px_1fr] sm:grid-cols-[115px_14px_1fr] gap-y-2 items-start text-xs pt-0.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Pickup City</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{order.pickup.city}</span>

                        {order.pickup.company ? (
                            <>
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Facility / Company</span>
                                <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{order.pickup.company}</span>
                            </>
                        ) : null}

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Pickup Address</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 leading-snug">{order.pickup.address}</span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Contact Person</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {order.pickup.contactName}
                            {order.pickup.contactPhone ? (
                                <span className="text-slate-500 font-normal ml-1.5">({order.pickup.contactPhone})</span>
                            ) : null}
                        </span>
                    </div>
                </div>

                {/* Delivery Facility Column */}
                <div className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#ff4a1f] ring-2 ring-orange-100 dark:ring-orange-950/60 shrink-0" />
                            <span className="text-[11px] font-bold text-[#ff4a1f] uppercase tracking-wider">
                                Final Destination
                            </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                            <Calendar size={11} className="text-slate-400" /> {order.delivery.date}
                        </span>
                    </div>

                    <div className="grid grid-cols-[105px_12px_1fr] sm:grid-cols-[115px_14px_1fr] gap-y-2 items-start text-xs pt-0.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Delivery City</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{order.delivery.city}</span>

                        {order.delivery.company ? (
                            <>
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Facility / Company</span>
                                <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                                <span className="font-semibold text-slate-900 dark:text-slate-100">{order.delivery.company}</span>
                            </>
                        ) : null}

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Delivery Address</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 leading-snug">{order.delivery.address}</span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Contact Person</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {order.delivery.contactName}
                            {order.delivery.contactPhone ? (
                                <span className="text-slate-500 font-normal ml-1.5">({order.delivery.contactPhone})</span>
                            ) : null}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderLocationsCard;
