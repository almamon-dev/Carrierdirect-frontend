import React from 'react';
import { Coins, MapPin, Truck } from 'lucide-react';
import { NormalizedCustomerOrder } from '../../Details/utils/customerOrderDetailsUtils';

interface TrackShipmentBottomCardsProps {
    order: NormalizedCustomerOrder;
}

export const TrackShipmentBottomCards: React.FC<TrackShipmentBottomCardsProps> = ({ order }) => {
    const firstItem = order.productItems?.[0];
    const cargoQtyLabel = firstItem
        ? `${firstItem.quantity} ${firstItem.quantity > 1 ? 'Units' : 'Unit'}`
        : '1 Unit';

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-stretch font-sans">
            {/* Card 1: Pickup Details */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs flex flex-col justify-between space-y-3">
                <div>
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                        <MapPin size={15} className="text-[#ff4a1f] shrink-0" />
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                            Pickup Details
                        </h4>
                    </div>

                    <div className="grid grid-cols-[70px_1fr] gap-y-2 text-xs pt-2.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Location</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            {order.pickup.city || '-'}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Facility</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {order.pickup.company || 'Origin Facility'}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Address</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 leading-snug">
                            {order.pickup.address || '-'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Card 2: Destination Details */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs flex flex-col justify-between space-y-3">
                <div>
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                        <MapPin size={15} className="text-rose-500 shrink-0" />
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                            Destination Details
                        </h4>
                    </div>

                    <div className="grid grid-cols-[70px_1fr] gap-y-2 text-xs pt-2.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Location</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            {order.delivery.city || '-'}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Facility</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {order.delivery.company || 'Destination Facility'}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Address</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 leading-snug">
                            {order.delivery.address || '-'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Card 3: Vehicle & Cargo */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs flex flex-col justify-between space-y-3">
                <div>
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                        <Truck size={15} className="text-[#ff4a1f] shrink-0" />
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                            Vehicle & Cargo
                        </h4>
                    </div>

                    <div className="grid grid-cols-[80px_1fr] gap-y-2 text-xs pt-2.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Vehicle No.</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            {order.vehicle?.number && order.vehicle.number !== '-'
                                ? order.vehicle.number
                                : order.vehicle?.type || '-'}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Driver</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 break-words [overflow-wrap:anywhere]">
                            {order.isRelay && Array.isArray(order.shipmentLegs) && order.shipmentLegs.length > 1
                                ? order.shipmentLegs
                                      .filter((leg) => leg.driver_name && leg.driver_name !== '-' && leg.driver_name !== 'Unassigned')
                                      .map((leg) => `Leg ${leg.leg_number}: ${leg.driver_name}`)
                                      .join(' • ') || 'Carrier Assigning'
                                : order.driver?.name && order.driver.name !== '-' && order.driver.name !== 'Unassigned'
                                    ? order.driver.name
                                    : 'Carrier Assigning'}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Cargo Type</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {order.vehicle?.goodsType && order.vehicle.goodsType !== '-'
                                ? order.vehicle.goodsType
                                : order.loadType || 'Standard Cargo'}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Weight</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            {order.vehicle?.capacity || '-'}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Cargo Qty</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {cargoQtyLabel}
                        </span>
                    </div>
                </div>
            </div>

            {/* Card 4: Payment Breakdown */}
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-4 shadow-2xs flex flex-col justify-between space-y-3">
                <div>
                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                        <Coins size={15} className="text-[#ff4a1f] shrink-0" />
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                            Payment Breakdown
                        </h4>
                    </div>

                    <div className="space-y-2 text-xs pt-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                                Transport Charge
                            </span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                {order.pricing?.baseFormatted || '-'}
                            </span>
                        </div>

                        {order.pricing?.extraCharges && order.pricing.extraCharges.length > 0 ? (
                            order.pricing.extraCharges.slice(0, 2).map((ch, idx) => (
                                <div key={ch.id || idx} className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400 font-medium truncate pr-2">
                                        {ch.name}
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 shrink-0">
                                        {ch.amountFormatted}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">
                                    Escrow Protection
                                </span>
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                    Included
                                </span>
                            </div>
                        )}

                        {order.pricing?.platformFee && order.pricing.platformFee > 0 ? (
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">
                                    Platform Charge
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    {order.pricing.platformFeeFormatted ||
                                        `€ ${order.pricing.platformFee.toLocaleString()}`}
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Highlighted Total Amount Pill */}
                <div className="bg-orange-50/80 dark:bg-[#ff4a1f]/10 border border-orange-100 dark:border-orange-900/40 rounded-[4px] px-3 py-2 flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Total Amount
                    </span>
                    <span className="text-xs sm:text-sm font-black text-[#ff4a1f]">
                        {order.pricing?.totalFormatted ||
                            order.pricing?.quoteFormatted ||
                            order.pricing?.baseFormatted ||
                            '-'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TrackShipmentBottomCards;
