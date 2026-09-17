import React from 'react';
import { MapPin, Phone, User, Calendar, Clock, ArrowRight, Building } from 'lucide-react';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';

interface CustomerOrderLocationsCardProps {
    order: NormalizedCustomerOrder;
}

export const CustomerOrderLocationsCard: React.FC<CustomerOrderLocationsCardProps> = ({ order }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden font-sans">
            {/* Header */}
            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#15191e]/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#ff4a1f]" />
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                        Shipment Route & Facility Contacts
                    </h3>
                </div>
                <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.25 rounded border border-slate-200 dark:border-slate-700">
                    {order.distance} Direct Transit
                </span>
            </div>

            {/* Grid Layout: Pickup vs Delivery */}
            <div className="p-2.5 sm:p-3 grid grid-cols-1 md:grid-cols-2 gap-2.5 relative">
                {/* Desktop route connector arrow in middle */}
                <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-400 shadow-2xs z-10">
                    <ArrowRight size={11} className="text-[#ff4a1f]" />
                </div>

                {/* Pickup Facility Card */}
                <div className="bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 rounded-lg p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-950/60 shrink-0" />
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                Pickup Point
                            </span>
                        </div>
                        <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Calendar size={10} /> {order.pickup.date}
                        </span>
                    </div>

                    <div>
                        <h4 className="text-xs sm:text-[12.5px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <Building size={12} className="text-slate-400 shrink-0" />
                            <span>{order.pickup.city}</span>
                        </h4>
                        <p className="text-[11.5px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                            {order.pickup.address}
                        </p>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200/70 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11.5px]">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <User size={11} className="text-slate-400 shrink-0" />
                            <span className="truncate font-medium">{order.pickup.contactName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Phone size={11} className="text-slate-400 shrink-0" />
                            <span className="font-mono">{order.pickup.contactPhone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 sm:col-span-2">
                            <Clock size={11} className="text-slate-400 shrink-0" />
                            <span>Window: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{order.pickup.time}</strong></span>
                        </div>
                    </div>
                </div>

                {/* Delivery Facility Card */}
                <div className="bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 rounded-lg p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4a1f] ring-2 ring-orange-100 dark:ring-orange-950/60 shrink-0" />
                            <span className="text-[10px] font-bold text-[#ff4a1f] uppercase tracking-wider">
                                Final Destination
                            </span>
                        </div>
                        <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Calendar size={10} /> {order.delivery.date}
                        </span>
                    </div>

                    <div>
                        <h4 className="text-xs sm:text-[12.5px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <Building size={12} className="text-slate-400 shrink-0" />
                            <span>{order.delivery.city}</span>
                        </h4>
                        <p className="text-[11.5px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                            {order.delivery.address}
                        </p>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200/70 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11.5px]">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <User size={11} className="text-slate-400 shrink-0" />
                            <span className="truncate font-medium">{order.delivery.contactName}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                            <Phone size={11} className="text-slate-400 shrink-0" />
                            <span className="font-mono">{order.delivery.contactPhone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 sm:col-span-2">
                            <Clock size={11} className="text-slate-400 shrink-0" />
                            <span>Arrival: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{order.delivery.time}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderLocationsCard;
