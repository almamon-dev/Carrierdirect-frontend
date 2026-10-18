import { CheckCircle2, Truck } from 'lucide-react';
import React from 'react';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';

interface Props {
    order: NormalizedSupplierOrder;
}

export const SupplierRouteCards: React.FC<Props> = ({ order }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 font-sans items-stretch">
            {/* Card 1: Pickup (Origin) */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 shadow-2xs space-y-2.5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-slate-100">
                            Pickup (Origin)
                        </h4>
                    </div>

                    <div className="grid grid-cols-[65px_10px_1fr] gap-y-1.5 text-xs pt-2">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">City</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{order.pickupCity || order.from || '-'}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium">Facility</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{order.pickupCompany || '-'}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium">Address</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="text-slate-600 dark:text-slate-400 leading-snug">{order.pickupFullAddress || '-'}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium pt-1">Contact</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium pt-1">:</span>
                        <div className="pt-1">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{order.pickupContactName || '-'}</span>

                        </div>
                    </div>
                </div>
            </div>

            {/* Card 2: Destination */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 shadow-2xs space-y-2.5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                        <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-slate-100">
                            Destination
                        </h4>
                    </div>

                    <div className="grid grid-cols-[65px_10px_1fr] gap-y-1.5 text-xs pt-2">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">City</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{order.deliveryCity || order.to || '-'}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium">Facility</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{order.deliveryCompany || '-'}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium">Address</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="text-slate-600 dark:text-slate-400 leading-snug">{order.deliveryFullAddress || '-'}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium pt-1">Contact</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium pt-1">:</span>
                        <div className="pt-1">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{order.deliveryContactName || '-'}</span>

                        </div>
                    </div>
                </div>
            </div>

            {/* Card 3: Vehicle & Cargo */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3.5 shadow-2xs space-y-2.5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5">
                            <Truck size={15} className="text-[#FF4A1F]" />
                            <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-slate-100">
                                Vehicle & Cargo
                            </h4>
                        </div>
                        {order.loadType && order.loadType !== '-' && (
                            <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded">
                                {order.loadType}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-[100px_10px_1fr] gap-y-1.5 text-xs pt-2">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">Vehicle Type</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{order.vehicle?.type || '-'}</span>



                        <span className="text-slate-400 dark:text-slate-500 font-medium">Payload Weight</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{order.vehicle?.capacity || '-'}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium">Cargo Category</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{order.vehicle?.goodsType || '-'}</span>

                        <span className="text-slate-400 dark:text-slate-500 font-medium">Assigned Driver</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <div>
                            {order.driver?.name && order.driver.name !== 'Unassigned' && order.driver.name !== '-' ? (
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{order.driver.name}</span>
                            ) : (
                                <span className="font-bold text-slate-800 dark:text-slate-200">-</span>
                            )}
                        </div>

                        <span className="text-slate-400 dark:text-slate-500 font-medium">Operating Carrier</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium">:</span>
                        <div>
                            {order.customer?.companyName || order.customer?.name ? (
                                <div className="flex items-center gap-1 font-bold text-[#FF4A1F]">
                                    <span>{order.customer?.companyName || order.customer?.name}</span>
                                    {order.customer?.verified && <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />}
                                </div>
                            ) : (
                                <span className="font-bold text-slate-800 dark:text-slate-200">-</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierRouteCards;
