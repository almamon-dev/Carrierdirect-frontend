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

                {/* Key-Value Grid */}
                <div className="grid grid-cols-[115px_12px_1fr] sm:grid-cols-[125px_14px_1fr] gap-y-2 items-center text-xs">
                    {/* Vehicle Type */}
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                        <Truck size={12} className="text-slate-400 shrink-0" />
                        <span>Vehicle Type</span>
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {order.vehicle.type}
                    </span>

                    {/* License Plate */}
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                        <Hash size={12} className="text-slate-400 shrink-0" />
                        <span>License Plate</span>
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                    <div>
                        <span className="font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.25 rounded border border-slate-200 dark:border-slate-700 text-[11px] inline-block">
                            {order.vehicle.number}
                        </span>
                    </div>

                    {/* Cargo Weight */}
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                        <PackageCheck size={12} className="text-slate-400 shrink-0" />
                        <span>Payload Weight</span>
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {order.vehicle.capacity}
                    </span>

                    {/* Goods / Pallets Type */}
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                        <Layers size={12} className="text-slate-400 shrink-0" />
                        <span>Cargo Category</span>
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {order.vehicle.goodsType}
                    </span>

                    {/* Assigned Driver (Seamless row without nested card) */}
                    <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                        <UserCheck size={12} className="text-emerald-600 shrink-0" />
                        <span>Assigned Driver</span>
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {order.driver?.name || <span className="italic font-normal text-amber-600 dark:text-amber-400">Carrier assigning shortly</span>}
                    </span>
                </div>
            </div>

            {/* Bottom Carrier Badge */}
            <div className="grid grid-cols-[115px_12px_1fr] sm:grid-cols-[125px_14px_1fr] items-center pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Operating Carrier</span>
                <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                <span className="font-bold text-[#ff4a1f] flex items-center gap-1">
                    {order.supplier.name}
                    {order.supplier.verified && <ShieldCheck size={13} className="text-emerald-600" />}
                </span>
            </div>
        </div>
    );
};

export default CustomerOrderVehicleDetails;
