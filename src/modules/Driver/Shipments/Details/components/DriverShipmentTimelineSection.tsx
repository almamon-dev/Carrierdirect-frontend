import React from 'react';
import { Check, Clock, MapPin } from 'lucide-react';
import { ShipmentItem, ShipmentStatus } from '../../../types';

interface Props {
    shipment: ShipmentItem;
}

export const DriverShipmentTimelineSection: React.FC<Props> = ({ shipment }) => {
    const orderMap: Record<ShipmentStatus, number> = {
        assigned: 1,
        accepted: 1,
        at_pickup: 2,
        in_transit: 3,
        at_delivery: 4,
        delivered: 5,
        cancelled: 0,
    };

    const currentLevel = orderMap[shipment.status] || 1;

    const timelineItems = [
        {
            id: 1,
            title: 'Load Assigned to Driver',
            time: `${shipment.shipper.pickupDate} 08:00 AM`,
            description: `Assigned freight load #${shipment.orderNumber} for dispatch.`,
            completed: currentLevel >= 1,
            active: currentLevel === 1,
            location: `${shipment.shipper.city}, ${shipment.shipper.state}`,
        },
        {
            id: 2,
            title: 'Arrived at Shipper Dock',
            time: `${shipment.shipper.pickupDate} ${shipment.shipper.pickupTimeWindow?.split('-')[0] || '10:00 AM'}`,
            description: `Truck check-in at ${shipment.shipper.company}.`,
            completed: currentLevel >= 2,
            active: currentLevel === 2,
            location: shipment.shipper.address,
        },
        {
            id: 3,
            title: 'Cargo Loaded & Rolling In Transit',
            time: `${shipment.shipper.pickupDate} 12:30 PM`,
            description: `Loaded ${cargoWeight(shipment.cargo.weightKg)} kg. En route via direct highway.`,
            completed: currentLevel >= 3,
            active: currentLevel === 3,
            location: `Highway Route (${shipment.route.distanceKm} km)`,
        },
        {
            id: 4,
            title: 'Arrived at Consignee Dock',
            time: `${shipment.consignee.deliveryDate} ${shipment.consignee.deliveryTimeWindow?.split('-')[0] || '03:00 PM'}`,
            description: `Truck check-in at ${shipment.consignee.company}.`,
            completed: currentLevel >= 4,
            active: currentLevel === 4,
            location: shipment.consignee.address,
        },
        {
            id: 5,
            title: 'Delivered & Verified POD',
            time: shipment.podData ? new Date(shipment.podData.uploadedAt).toLocaleTimeString() : 'Pending',
            description: shipment.podData
                ? `Signed off by ${shipment.podData.receiverName}.`
                : 'Receiver sign-off and POD upload.',
            completed: currentLevel >= 5,
            active: false,
            location: `${shipment.consignee.city}, ${shipment.consignee.state}`,
        },
    ];

    function cargoWeight(w: number) {
        return w ? w.toLocaleString() : '0';
    }

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50">
                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                    Shipment Activity & Milestone Log
                </h3>
                <span className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock size={11} className="text-[#FF4A1F]" />
                    <span>Live Milestones</span>
                </span>
            </div>

            {/* Timeline List */}
            <div className="p-3.5">
                <div className="relative">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-[9px] top-2.5 bottom-4 w-[2px] bg-slate-100 dark:bg-slate-800" />

                    <div className="space-y-3 relative">
                        {timelineItems.map((item, index) => (
                            <div key={item.id} className="flex gap-2.5 relative">
                                {/* Dot Indicator */}
                                <div className="relative z-10 flex flex-col items-center">
                                    <div
                                        className={`w-5 h-5 min-w-[20px] min-h-[20px] rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
                                            item.completed && !item.active
                                                ? 'bg-emerald-500 text-white shadow-2xs'
                                                : item.active
                                                ? 'bg-[#FF4A1F] text-white ring-2 ring-orange-200 dark:ring-orange-950/80 shadow-2xs scale-105'
                                                : 'bg-white dark:bg-slate-900 border-[1.5px] border-slate-300 dark:border-slate-700 text-slate-400'
                                        }`}
                                    >
                                        {item.completed && !item.active ? (
                                            <Check size={11} strokeWidth={3} className="text-white" />
                                        ) : (
                                            <span>{index + 1}</span>
                                        )}
                                    </div>

                                    {/* Line connecting to next */}
                                    {index !== timelineItems.length - 1 && (
                                        <div
                                            className={`absolute top-5 w-[2px] h-[calc(100%+12px)] z-0 ${
                                                item.completed && timelineItems[index + 1]?.completed
                                                    ? 'bg-emerald-500'
                                                    : item.completed && timelineItems[index + 1]?.active
                                                    ? 'bg-orange-400'
                                                    : 'bg-slate-200 dark:bg-slate-700'
                                            }`}
                                        />
                                    )}
                                </div>

                                {/* Step Description */}
                                <div className="flex-1 pb-0.5">
                                    <div className="flex items-start justify-between gap-1">
                                        <h4
                                            className={`text-[11.5px] font-bold ${
                                                item.active
                                                    ? 'text-[#FF4A1F]'
                                                    : item.completed
                                                    ? 'text-slate-900 dark:text-slate-100'
                                                    : 'text-slate-400 dark:text-slate-500'
                                            }`}
                                        >
                                            {item.title}
                                        </h4>
                                        <span
                                            className={`text-[10px] font-medium shrink-0 ${
                                                item.active || item.completed
                                                    ? 'text-slate-500 dark:text-slate-400'
                                                    : 'text-slate-300 dark:text-slate-600'
                                            }`}
                                        >
                                            {item.time}
                                        </span>
                                    </div>

                                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                                        {item.description}
                                    </p>

                                    {item.active && item.location && (
                                        <div className="mt-1 bg-orange-50/70 dark:bg-orange-950/30 rounded p-1 px-1.5 border border-orange-200 dark:border-orange-900/60 flex items-center gap-1.5">
                                            <MapPin size={10} className="text-[#FF4A1F] shrink-0" />
                                            <p className="text-[10.5px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                {item.location}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
