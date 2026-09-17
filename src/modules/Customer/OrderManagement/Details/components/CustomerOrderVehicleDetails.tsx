import React from 'react';
import { Truck, ShieldCheck, UserCheck, Phone, Mail, Hash, PackageCheck, Layers } from 'lucide-react';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';

interface CustomerOrderVehicleDetailsProps {
    order: NormalizedCustomerOrder;
}

export const CustomerOrderVehicleDetails: React.FC<CustomerOrderVehicleDetailsProps> = ({ order }) => {
    return (
        <div className="bg-white dark:bg-[#1e2329] p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between h-full font-sans">
            <div>
                {/* Header */}
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-2 mb-2.5 flex items-center justify-between">
                    <p className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <Truck size={14} className="text-[#ff4a1f]" />
                        <span>Vehicle & Cargo Specs</span>
                    </p>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.25 rounded">
                        Full Truckload (FTL)
                    </span>
                </div>

                {/* Key-Value Items */}
                <div className="space-y-1.5 text-xs">
                    {/* Vehicle Type */}
                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                            <Truck size={12} className="text-slate-400" />
                            <span>Vehicle Type</span>
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-right">
                            {order.vehicle.type}
                        </span>
                    </div>

                    {/* License Plate */}
                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                            <Hash size={12} className="text-slate-400" />
                            <span>License Plate</span>
                        </span>
                        <span className="font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.25 rounded border border-slate-200 dark:border-slate-700 text-[11px]">
                            {order.vehicle.number}
                        </span>
                    </div>

                    {/* Cargo Weight */}
                    <div className="flex justify-between items-center min-h-[20px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                            <PackageCheck size={12} className="text-slate-400" />
                            <span>Payload Weight</span>
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-right">
                            {order.vehicle.capacity}
                        </span>
                    </div>

                    {/* Goods / Pallets Type */}
                    <div className="flex justify-between items-start min-h-[20px] gap-2">
                        <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
                            <Layers size={12} className="text-slate-400" />
                            <span>Cargo Category</span>
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100 text-right line-clamp-1">
                            {order.vehicle.goodsType}
                        </span>
                    </div>
                </div>

                {/* Assigned Driver Box (if available) */}
                {order.driver ? (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[11.5px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                                <UserCheck size={12} className="text-emerald-600" />
                                <span>Assigned Driver</span>
                            </span>
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.25 rounded">
                                Dispatched
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11.5px] text-slate-600 dark:text-slate-300">
                            <span className="font-medium text-slate-900 dark:text-slate-100">{order.driver.name}</span>
                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                                <Phone size={10} />
                                <span className="font-mono text-slate-700 dark:text-slate-300">{order.driver.phone}</span>
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Assigned Fleet Driver</span>
                        <span className="italic font-medium text-amber-600 dark:text-amber-400 text-[11px]">Carrier assigning shortly</span>
                    </div>
                )}
            </div>

            {/* Bottom Carrier Badge */}
            <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Operating Carrier</span>
                <span className="font-bold text-[#ff4a1f] flex items-center gap-1">
                    {order.supplier.name}
                    {order.supplier.verified && <ShieldCheck size={13} className="text-emerald-600" />}
                </span>
            </div>
        </div>
    );
};

export default CustomerOrderVehicleDetails;
