import { Check } from 'lucide-react';
import React from 'react';
import { ShipmentItem } from '../../../types';

interface Props {
    shipment: ShipmentItem;
}

export const DriverShipmentSidebarTimeline: React.FC<Props> = ({ shipment }) => {
    const status = (shipment.status || '').toLowerCase();
    const isCompleted = status === 'completed';

    let currentStep = 1;
    let isDelivered = false;

    if (status === 'completed' || status === 'delivered') {
        currentStep = 5;
        isDelivered = true;
    } else if (status === 'at_delivery' || status === 'arrived') {
        currentStep = 4;
    } else if (status === 'in_transit' || status.includes('transit')) {
        currentStep = 3;
    } else if (status === 'at_pickup' || status === 'picked_up' || status.includes('pick')) {
        currentStep = 2;
    } else if (status === 'assigned' || status === 'driver_assigned' || status === 'accepted') {
        currentStep = 1;
    }

    const findHistoryTime = (statusKeywords: string[]) => {
        if (!shipment.history || !Array.isArray(shipment.history)) return null;
        for (const item of shipment.history) {
            const itemStatus = String(item.status || item.title || '').toLowerCase();
            if (statusKeywords.some(k => itemStatus.includes(k))) {
                if (item.time) return item.time;
                if ((item as any).created_at) {
                    return new Date((item as any).created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    });
                }
            }
        }
        return null;
    };

    const createdTime = shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'Scheduled';
    const pickupTimeStr = shipment.shipper.pickupDate || 'Scheduled';
    const deliveryTimeStr = shipment.consignee.deliveryDate || 'Completed';

    const activities = [
        {
            id: 1,
            title: 'Order Confirmed',
            time: findHistoryTime(['confirmed', 'order']) || createdTime,
            completed: true,
            active: false,
        },
        {
            id: 2,
            title: 'Driver Assigned',
            time: findHistoryTime(['assigned']) || createdTime,
            completed: currentStep >= 1,
            active: currentStep === 1 && !isDelivered,
        },
        {
            id: 3,
            title: 'Goods Picked Up',
            time: (currentStep > 2 || isDelivered) ? (findHistoryTime(['pickup', 'picked_up']) || pickupTimeStr) : 'Pending',
            completed: currentStep > 2 || isDelivered,
            active: currentStep === 2 && !isDelivered,
        },
        {
            id: 4,
            title: 'In Transit',
            time: (currentStep > 3 || isDelivered) ? (findHistoryTime(['in_transit']) || 'Completed') : (currentStep === 3 ? 'Live' : 'Pending'),
            completed: currentStep > 3 || isDelivered,
            active: currentStep === 3 && !isDelivered,
            isLive: currentStep === 3 && !isDelivered,
        },
        {
            id: 5,
            title: isCompleted ? 'Delivery Approved & Completed' : (isDelivered ? 'Delivered • POD Uploaded' : 'Delivered'),
            time: isDelivered ? (findHistoryTime(['delivered', 'completed']) || deliveryTimeStr) : 'Pending',
            completed: isDelivered,
            active: currentStep === 4 && !isDelivered,
            isLive: false,
        },
    ];

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] shadow-2xs flex flex-col font-sans overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#15191e]/50 shrink-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Recent Activity
                </h3>
                <span className="text-xs font-semibold text-[#FF4A1F]">
                    {isCompleted ? 'All Complete' : 'Live Updates'}
                </span>
            </div>

            {/* Activity List */}
            <div className="p-4">
                <div className="relative">
                    <div className="space-y-4">
                        {activities.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-3 relative">
                                <div className="flex items-center gap-2.5">
                                    {/* Icon */}
                                    <div className="flex items-center justify-center shrink-0">
                                        {item.completed ? (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        ) : item.active ? (
                                            <div className="w-5 h-5 rounded-full bg-[#FF4A1F] flex items-center justify-center text-white">
                                                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                            </div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                                        )}
                                    </div>

                                    {/* Title */}
                                    <span
                                        className={`text-xs font-bold ${item.active
                                            ? 'text-[#FF4A1F]'
                                            : item.completed
                                                ? 'text-slate-900 dark:text-slate-100'
                                                : 'text-slate-400 dark:text-slate-500 font-medium'
                                            }`}
                                    >
                                        {item.title}
                                    </span>
                                </div>

                                {/* Timestamp or Live badge */}
                                {item.isLive ? (
                                    <span className="text-xs font-bold text-[#FF4A1F] flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4A1F] animate-pulse" />
                                        Live
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                        {item.time}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverShipmentSidebarTimeline;
