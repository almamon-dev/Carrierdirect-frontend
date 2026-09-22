import React from 'react';
import { Column } from '@/components/tables/data-table';
import { MapPin, Clock, Truck, Weight, Layers } from 'lucide-react';
import { ShipmentItem } from '../../types';
import { ShipmentStatusBadge } from './ShipmentStatusBadge';

export const getShipmentColumns = (navigate: (path: string) => void): Column<ShipmentItem>[] => [
    {
        id: 'orderNumber',
        label: 'Load / Tracking #',
        className: 'w-[150px] min-w-[140px]',
        render: (item) => (
            <div className="flex items-start gap-2 py-0.5 min-w-0">
                <div className="w-6 h-6 rounded-[3px] bg-orange-50 dark:bg-[#FF4A1F]/15 text-[#FF4A1F] flex items-center justify-center shrink-0 mt-0.5">
                    <Truck size={13} />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-nowrap">
                        <span className="font-mono font-bold text-xs text-slate-900 dark:text-slate-100 hover:text-[#FF4A1F] transition-colors truncate">
                            {item.orderNumber}
                        </span>
                        {item.priority === 'Urgent' && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-red-50 dark:bg-red-950/60 text-red-600 rounded-[2px] border border-red-200/60 dark:border-red-900/40 shrink-0">
                                Urgent
                            </span>
                        )}
                    </div>
                    <div className="text-[10.5px] text-slate-400 font-mono mt-0.5 truncate">
                        {item.trackingNumber}
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'shipper',
        label: 'Origin (Pickup)',
        className: 'w-[190px] min-w-[170px]',
        render: (item) => (
            <div className="space-y-0.5 min-w-0 py-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="truncate">{item.shipper.company}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate pl-3">
                    {item.shipper.city}, {item.shipper.state}
                </div>
                <div className="text-[10.5px] text-[#FF4A1F] font-medium flex items-center gap-1 pl-3 whitespace-nowrap">
                    <Clock size={10} className="shrink-0" />
                    <span>{item.shipper.pickupTimeWindow}</span>
                </div>
            </div>
        ),
    },
    {
        id: 'consignee',
        label: 'Destination (Delivery)',
        className: 'w-[190px] min-w-[170px]',
        render: (item) => (
            <div className="space-y-0.5 min-w-0 py-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    <MapPin size={11} className="text-[#FF4A1F] shrink-0" />
                    <span className="truncate">{item.consignee.company}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate pl-4">
                    {item.consignee.city}, {item.consignee.state}
                </div>
                <div className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 pl-4 whitespace-nowrap">
                    <Clock size={10} className="shrink-0" />
                    <span>ETA: {item.consignee.deliveryTimeWindow}</span>
                </div>
            </div>
        ),
    },
    {
        id: 'cargo',
        label: 'Cargo Specs & Route',
        className: 'w-[170px] min-w-[150px]',
        render: (item) => (
            <div className="space-y-0.5 min-w-0 py-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                    <span className="truncate">{item.cargo.freightType}</span>
                    <span className="text-[10.5px] text-slate-400 font-normal shrink-0">({item.route.distanceKm} km)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    <span className="flex items-center gap-0.5">
                        <Weight size={10.5} className="text-slate-400 shrink-0" />
                        <span>{item.cargo.weightKg.toLocaleString()} kg</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                        <Layers size={10.5} className="text-slate-400 shrink-0" />
                        <span>{item.cargo.pallets} Plts</span>
                    </span>
                </div>
            </div>
        ),
    },
    {
        id: 'status',
        label: 'Status',
        className: 'w-[115px] min-w-[105px] text-center',
        render: (item) => (
            <div className="flex items-center justify-center">
                <ShipmentStatusBadge status={item.status} />
            </div>
        ),
    },
    {
        id: 'pickupDate',
        label: 'Scheduled Date',
        className: 'w-[110px] min-w-[100px] text-center',
        render: (item) => (
            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap text-center">
                {item.shipper.pickupDate}
            </div>
        ),
    },
];
