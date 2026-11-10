import React from 'react';
import { CircleDollarSign, Info, Truck, Wallet } from 'lucide-react';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';

interface Props {
    order: NormalizedSupplierOrder;
}

export const SupplierBottomCards: React.FC<Props> = ({ order }) => {
    const rawNetPayout = order.pricing?.netPayout || 23750.0;
    const rawCommission = order.pricing?.commissionFee || 1250.0;
    const commissionPercent = order.pricing?.commissionPercent || 5;
    const rawTotal = order.pricing?.total || 23750.0;

    const netPayoutFormatted = Number(rawNetPayout).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    const commissionFormatted = Number(rawCommission).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    const totalPayoutFormatted = Number(rawTotal).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const paymentStatusBadge = order.pricing?.paymentStatusLabel || 'In Escrow';
    const orderType = order.orderType && order.orderType !== '-' ? order.orderType : 'Direct Transit';
    const distanceVal = order.distance || '248.50 km';
    const serviceType = order.serviceType && order.serviceType !== '-'
        ? order.serviceType
        : `${distanceVal} Direct Transit`;
    const pickupDate = order.pickupDate && order.pickupDate !== '-' ? order.pickupDate : '02 Nov 2026';

    const vehicleType = order.vehicle?.type && order.vehicle.type !== '-' ? order.vehicle.type : 'One Way';
    const cargoWeight = order.vehicle?.capacity && order.vehicle.capacity !== '-' ? order.vehicle.capacity : '2,800 kg';
    const loadTypeBadge = order.loadType && order.loadType !== '-' ? order.loadType : 'Standard Freight';
    const vehicleNumber = order.vehicle?.number && order.vehicle.number !== '-' ? order.vehicle.number : 'Standard Fleet';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 font-sans items-stretch">
            {/* Card 1: Vehicle & Cargo */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                            <Truck size={15} className="text-[#ff4a1f]" />
                            <span>Vehicle & Cargo</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40">
                            {loadTypeBadge}
                        </span>
                    </div>

                    <div className="space-y-2 text-xs pt-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Vehicle</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{vehicleType}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Weight</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{cargoWeight}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Vehicle Plate</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {vehicleNumber}
                    </span>
                </div>
            </div>

            {/* Card 2: Payment */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                            <Wallet size={15} className="text-[#ff4a1f]" />
                            <span>Payment</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-[4px] text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60">
                            {paymentStatusBadge}
                        </span>
                    </div>

                    <div className="space-y-2 text-xs pt-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                <CircleDollarSign size={13} className="text-slate-400 shrink-0" />
                                <span>Net Carrier Payout</span>
                            </span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                € {netPayoutFormatted}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                                <CircleDollarSign size={13} className="text-slate-400 shrink-0" />
                                <span>Platform Commission ({commissionPercent}%)</span>
                            </span>
                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                                - € {commissionFormatted}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Total Payout
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        € {totalPayoutFormatted}
                    </span>
                </div>
            </div>

            {/* Card 3: Order Information */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs space-y-2.5 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                            <Info size={15} className="text-[#ff4a1f]" />
                            <span>Order Information</span>
                        </div>
                    </div>

                    <div className="space-y-2 text-xs pt-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Order Type</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{orderType}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Service Type</span>
                            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[140px] text-right" title={serviceType}>
                                {serviceType}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Pickup Date</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {pickupDate}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default SupplierBottomCards;
