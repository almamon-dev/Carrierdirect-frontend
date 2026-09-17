import React from 'react';
import { MapPin, Calendar, Clock, Building, Warehouse, ShieldAlert } from 'lucide-react';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';

interface SupplierLocationsCardProps {
    order: NormalizedSupplierOrder;
}

export const SupplierLocationsCard: React.FC<SupplierLocationsCardProps> = ({ order }) => {
    const pickupAddress = order.pickupFullAddress || `${order.from} Cargo Hub, Terminal 1`;
    const deliveryAddress = order.deliveryFullAddress || `${order.to} Logistics Center, Receiving Dock 4`;

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs overflow-hidden font-sans">
            {/* Header */}
            <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#15191e]/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-[#ff4a1f]" />
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                        Facility Pickup & Delivery Locations
                    </h3>
                </div>
                <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    Direct Road Haulage
                </span>
            </div>

            {/* 2-Column Facility Cards Grid */}
            <div className="p-3 sm:p-3.5 grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Pickup Facility Card */}
                <div className="bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3 space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 dark:ring-emerald-950/60 shrink-0" />
                                <span className="text-[10.5px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                    Pickup Origin
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                <Calendar size={11} className="text-slate-400" />
                                <span>{order.pickupDate || 'Scheduled'}</span>
                            </span>
                        </div>

                        <div>
                            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <Building size={13} className="text-slate-400 shrink-0" />
                                <span>{order.from} Facility</span>
                            </h4>
                            <p className="text-[11.5px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                {pickupAddress}
                            </p>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Dispatch Role</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Loading Bay Dispatch</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Operating Window</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <Clock size={10} className="text-slate-400" />
                                <span>08:00 AM - 12:00 PM</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Delivery Facility Card */}
                <div className="bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 rounded-lg p-3 space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#ff4a1f] ring-2 ring-orange-100 dark:ring-orange-950/60 shrink-0" />
                                <span className="text-[10.5px] font-bold text-[#ff4a1f] uppercase tracking-wider">
                                    Delivery Destination
                                </span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                <Calendar size={11} className="text-slate-400" />
                                <span>{order.deliveryDate || 'Scheduled'}</span>
                            </span>
                        </div>

                        <div>
                            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <Warehouse size={13} className="text-slate-400 shrink-0" />
                                <span>{order.to} Facility</span>
                            </h4>
                            <p className="text-[11.5px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                                {deliveryAddress}
                            </p>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Receiving Desk</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Dock Supervisor</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Arrival</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                <Clock size={10} className="text-[#ff4a1f]" />
                                <span>{order.estArrival ? order.estArrival.split(',')[1] || order.estArrival : '04:00 PM'}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierLocationsCard;
