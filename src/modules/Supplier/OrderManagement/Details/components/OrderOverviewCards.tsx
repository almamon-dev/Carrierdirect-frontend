import React from 'react';
import { ShieldCheck, User, Truck, Navigation } from 'lucide-react';
import { SupplierOrder } from '../../types/order.types';

interface OrderOverviewCardsProps {
    order: SupplierOrder;
}

export const OrderOverviewCards: React.FC<OrderOverviewCardsProps> = ({ order }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Customer */}
            <div
    className="p-4 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs space-y-2">
                <span className="text-xs text-slate-500 font-medium block">Customer Information</span>
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200 dark:border-slate-700">
                        {order.customer ? order.customer.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{order.customer}</h4>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                        <ShieldCheck size={13} />
                        <span>Verified Shipper Client</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Direct Carrier Direct Client</p>
                </div>
            </div>

            {/* Assigned Driver & Vehicle */}
            <div
    className="p-4 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs space-y-2">
                <span className="text-xs text-slate-500 font-medium block">Assigned Fleet & Vehicle</span>
                <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{order.driver || 'Carrier Fleet'}</h4>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                        <Truck size={12} className="text-slate-400" />
                        <span>{order.vehicle} {order.vehiclePlate ? `(${order.vehiclePlate})` : ''}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Active Delivery Vehicle</p>
                </div>
            </div>

            {/* Route Summary */}
            <div
    className="p-4 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs space-y-2">
                <span className="text-xs text-slate-500 font-medium block">Route Distance & Time</span>
                <div className="flex items-center gap-2">
                    <Navigation size={14} className="text-slate-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{order.pickup} → {order.delivery}</h4>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <p className="flex justify-between"><span>Distance:</span> <strong className="text-slate-800 dark:text-slate-200">{order.distance}</strong></p>
                    <p className="flex justify-between"><span>Est. Duration:</span> <strong className="text-slate-800 dark:text-slate-200">{order.estimatedDuration}</strong></p>
                </div>
            </div>

            {/* Financial Summary */}
            <div
    className="p-4 bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs space-y-2">
                <span className="text-xs text-slate-500 font-medium block">Payout Summary</span>
                <h4 className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">{order.netPayout}</h4>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <p className="flex justify-between"><span>Agreed Price:</span> <span className="font-semibold">{order.agreedPrice}</span></p>
                    <p className="flex justify-between"><span>Platform Fee (5%):</span> <span className="text-slate-400">{order.platformFee}</span></p>
                </div>
            </div>
        </div>
    );
};
