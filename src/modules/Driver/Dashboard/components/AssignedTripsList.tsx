import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowUpRight, Truck, MapPin, Clock, FileCheck } from 'lucide-react';
import Button from '@/components/ui/button';
import { ShipmentItem } from '../../types';

interface Props {
    shipments: ShipmentItem[];
}

export const AssignedTripsList: React.FC<Props> = ({ shipments }) => {
    return (
        <div className="bg-white dark:bg-[#12161c] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Package size={17} className="text-[#FF4A1F]" />
                    <span>Today's Assigned Freight Shipments</span>
                </h2>
                <Link to="/driver/shipments" className="text-xs text-[#FF4A1F] hover:underline font-bold flex items-center gap-1">
                    <span>View All Shipments</span>
                    <ArrowUpRight size={14} />
                </Link>
            </div>

            {shipments.length === 0 ? (
                <div className="p-10 text-center">
                    <Truck size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                    <p className="text-xs font-semibold text-slate-500">No shipments assigned for today</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {shipments.map((shipment) => {
                        const isDelivered = shipment.status === 'delivered';
                        const isInTransit = shipment.status === 'in_transit';

                        return (
                            <div
                                key={shipment.id}
                                className="p-4 sm:px-6 hover:bg-slate-50/60 dark:hover:bg-[#1a1f26]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                                            {shipment.orderNumber}
                                        </span>
                                        <span
                                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                                                isDelivered
                                                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                                                    : isInTransit
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                                                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                                            }`}
                                        >
                                            {shipment.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            {shipment.cargo.freightType}
                                        </span>
                                    </div>

                                    <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                        <span className="font-semibold">{shipment.shipper.city}, {shipment.shipper.state}</span>
                                        <span className="text-slate-300 dark:text-slate-600">➔</span>
                                        <span className="font-semibold">{shipment.consignee.city}, {shipment.consignee.state}</span>
                                        <span className="text-slate-400">({shipment.route.distanceKm} km)</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <Link to={`/driver/shipments/${shipment.id}`}>
                                        <Button size="sm" variant="outline" className="text-xs h-8 px-3 font-semibold">
                                            <span>Details & Route</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
