import React from 'react';
import { ArrowRight, Building2, MapPin, Package, Truck } from 'lucide-react';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';

interface Props {
    order: NormalizedSupplierOrder;
}

export const SupplierRouteCards: React.FC<Props> = ({ order }) => {
    const pickupCity = order.pickupCity || order.from || 'Dhaka';
    const pickupAddress = order.pickupFullAddress && order.pickupFullAddress !== '-'
        ? order.pickupFullAddress
        : 'Plot 14, Tejgaon Industrial Area, Dhaka 1208';

    const deliveryCity = order.deliveryCity || order.to || 'Chittagong';
    const deliveryAddress = order.deliveryFullAddress && order.deliveryFullAddress !== '-'
        ? order.deliveryFullAddress
        : 'Agrabad Commercial Area, Chittagong 4100';

    const vehicleType = order.vehicle?.type && order.vehicle.type !== '-' ? order.vehicle.type : 'One Way';
    const cargoWeight = order.vehicle?.capacity && order.vehicle.capacity !== '-' ? order.vehicle.capacity : '5,400 kg';
    const loadTypeBadge = order.loadType && order.loadType !== '-' ? order.loadType : 'Standard Freight';

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 font-sans items-stretch">
            {/* Card 1: Route Corridor (Pickup & Destination) - 7 cols */}
            <div className="md:col-span-7 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs flex items-center justify-between gap-3">
                {/* Pickup Origin */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <MapPin size={14} className="text-[#ff4a1f] shrink-0" />
                        <span>Pickup</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">
                        {pickupCity}
                    </h4>
                    <div className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        <Building2 size={13} className="shrink-0 text-slate-400 mt-0.5" />
                        <span className="line-clamp-2">{pickupAddress}</span>
                    </div>
                </div>

                {/* Arrow Divider */}
                <div className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                    <ArrowRight size={13} />
                </div>

                {/* Destination */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <MapPin size={14} className="text-[#ff4a1f] shrink-0" />
                        <span>Destination</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">
                        {deliveryCity}
                    </h4>
                    <div className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                        <Building2 size={13} className="shrink-0 text-slate-400 mt-0.5" />
                        <span className="line-clamp-2">{deliveryAddress}</span>
                    </div>
                </div>
            </div>

            {/* Card 2: Vehicle & Cargo - 5 cols */}
            <div className="md:col-span-5 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                        <Truck size={14} className="text-[#ff4a1f]" />
                        <span>Vehicle & Cargo</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
                        {loadTypeBadge}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2.5">
                    {/* Vehicle */}
                    <div className="flex items-center gap-2">
                        <Truck size={16} className="text-slate-400 shrink-0" />
                        <div className="min-w-0">
                            <span className="text-[11px] text-slate-400 block font-medium">Vehicle:</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                                {vehicleType}
                            </span>
                        </div>
                    </div>

                    {/* Weight */}
                    <div className="flex items-center gap-2">
                        <Package size={16} className="text-slate-400 shrink-0" />
                        <div className="min-w-0">
                            <span className="text-[11px] text-slate-400 block font-medium">Weight:</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">
                                {cargoWeight}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierRouteCards;
