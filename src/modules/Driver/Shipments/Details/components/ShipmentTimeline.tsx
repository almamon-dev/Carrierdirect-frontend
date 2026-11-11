import React from 'react';
import { Check, Calendar, GitFork, AlertTriangle } from 'lucide-react';
import { ShipmentItem, ShipmentStatus, RelayLegInfo } from '../../../types';

interface Props {
    shipment: ShipmentItem;
}

export interface TimelineStepItem {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'in_progress' | 'pending' | 'failed';
    dateText?: string;
    driverName?: string;
    legNumber?: number;
}

export const ShipmentTimeline: React.FC<Props> = ({ shipment }) => {
    const isRelay = Boolean(shipment.isRelay);
    const status: ShipmentStatus = shipment.status || 'assigned';

    const fromCity = shipment.shipper?.city || 'Dhaka';
    const toCity = shipment.consignee?.city || 'Chattogram';
    const hubLocation = shipment.hubLocation || 'Transit Hub';

    const driver1Name = shipment.isDeliveryOnly
        ? (shipment.partnerDriver?.driver_name || 'Liam O\'Connor')
        : (shipment.driver?.name || 'Liam O\'Connor');

    const driver2Name = shipment.isDeliveryOnly
        ? (shipment.driver?.name || 'Driver 2')
        : (shipment.partnerDriver?.driver_name || 'Driver 2');

    const singleDriverName = shipment.driver?.name || 'John Mathew';
    const handover = shipment.handover;

    // Helper to format date cleanly
    const formatTimestamp = (dateStr?: string, fallback: string = 'Nov 10, 04:00 PM'): string => {
        if (!dateStr) return fallback;
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return fallback;
            const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const timeStr = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            return `${monthDay}, ${timeStr}`;
        } catch {
            return fallback;
        }
    };

    const findHistoryTime = (keywords: string[]): string | null => {
        if (!shipment.history || !Array.isArray(shipment.history)) return null;
        for (const item of shipment.history) {
            const itemText = `${item.status || ''} ${item.title || ''} ${item.description || ''}`.toLowerCase();
            if (keywords.some(k => itemText.includes(k))) {
                if (item.time && !item.time.includes('T')) return item.time;
                const raw = item.raw_date || (item as any).created_at || item.time || item.date;
                if (raw) return formatTimestamp(raw);
            }
        }
        return null;
    };

    const orderConfirmedDate = findHistoryTime(['confirmed', 'order']) || formatTimestamp(shipment.createdAt, 'Nov 10, 04:00 PM');
    const driverAssignedDate = findHistoryTime(['assigned', 'allocat']) || 'Nov 11, 12:00 AM';
    const pickupDateStr = findHistoryTime(['pickup', 'picked_up', 'collect']) || (shipment.shipper?.pickupDate ? formatTimestamp(shipment.shipper.pickupDate, 'Nov 11, 01:30 PM') : 'Nov 11, 01:30 PM');
    const deliveryDateStr = findHistoryTime(['delivered', 'completed', 'pod']) || (shipment.consignee?.deliveryDate ? formatTimestamp(shipment.consignee.deliveryDate, 'Nov 11, 05:21 PM') : 'Nov 11, 05:21 PM');

    const isDelivered = status === 'delivered' || status === 'completed';
    const isFailed = status === 'cancelled';

    let timelineSteps: TimelineStepItem[] = [];

    // Check if multi-driver shipment
    const hasMultipleLegs = isRelay || (Boolean(shipment.relayLegs) && (shipment.relayLegs?.length ?? 0) > 1);

    if (!hasMultipleLegs) {
        // ==============================================================
        // SCENARIO A: SINGLE DRIVER SHIPMENT (Exactly 5 Steps)
        // ==============================================================
        const isPickedUp = ['picked_up', 'in_transit', 'at_delivery', 'delivered', 'completed'].includes(status);
        const isEnRoute = ['picked_up', 'in_transit', 'at_delivery'].includes(status);

        timelineSteps = [
            {
                id: 'sd-1',
                title: 'Order Confirmed',
                description: 'Shipment order created and confirmed by customer.',
                status: 'completed',
                dateText: orderConfirmedDate,
            },
            {
                id: 'sd-2',
                title: 'Driver Assigned',
                description: `Driver ${singleDriverName} assigned for the full trip.`,
                status: 'completed',
                dateText: driverAssignedDate,
                driverName: singleDriverName,
            },
            {
                id: 'sd-3',
                title: 'Goods Picked Up',
                description: 'Goods collection from consignor facility completed.',
                status: isPickedUp
                    ? 'completed'
                    : (status === 'at_pickup' || status === 'assigned' || status === 'accepted' ? 'in_progress' : 'pending'),
                dateText: isPickedUp ? pickupDateStr : undefined,
            },
            {
                id: 'sd-4',
                title: 'En Route',
                description: 'Goods are on the way to the consignee.',
                status: isDelivered ? 'completed' : (isEnRoute ? 'in_progress' : 'pending'),
            },
            {
                id: 'sd-5',
                title: 'Delivered',
                description: 'Final delivery to the consignee and POD confirmation.',
                status: isDelivered ? 'completed' : (status === 'at_delivery' ? 'in_progress' : 'pending'),
                dateText: isDelivered ? deliveryDateStr : undefined,
            },
        ];
    } else {
        // ==============================================================
        // SCENARIO B: MULTI-DRIVER / MULTI-LEG DYNAMIC SHIPMENT
        // Supports 2, 3, or N legs dynamically
        // ==============================================================
        const legs: RelayLegInfo[] = (shipment.relayLegs && shipment.relayLegs.length > 0)
            ? shipment.relayLegs
            : [
                {
                    leg_number: 1,
                    leg_type: 'pickup',
                    journey_leg: `${fromCity} ➔ ${hubLocation}`,
                    status: status === 'assigned' ? 'assigned' : 'in_progress',
                    execution_mode: 'in_house',
                    driver_name: driver1Name,
                    driver_phone: '+880 1711-000001',
                    vehicle_plate: 'DH-11-2041',
                },
                {
                    leg_number: 2,
                    leg_type: 'delivery',
                    journey_leg: `${hubLocation} ➔ ${toCity}`,
                    status: 'pending',
                    execution_mode: 'in_house',
                    driver_name: driver2Name,
                    driver_phone: '+880 1722-000002',
                    vehicle_plate: 'CH-24-9982',
                },
            ];

        const activeLeg = shipment.currentActiveLeg || 1;
        const isHandoverAccepted = handover?.status === 'accepted' || status === 'handover_accepted' || activeLeg > 1;

        // Step 1: Order Confirmed
        timelineSteps.push({
            id: 'md-order-confirmed',
            title: 'Order Confirmed',
            description: 'Shipment order created and confirmed by customer.',
            status: 'completed',
            dateText: orderConfirmedDate,
        });

        // Generate entries for each leg dynamically
        legs.forEach((leg, index) => {
            const legNum = leg.leg_number || index + 1;
            const isFirstLeg = index === 0;
            const isLastLeg = index === legs.length - 1;

            const legDriver = leg.driver_name && leg.driver_name !== '-'
                ? leg.driver_name
                : (legNum === 1 ? driver1Name : (legNum === 2 ? driver2Name : `Driver ${legNum}`));

            const legRoute = leg.journey_leg || (isFirstLeg ? `${fromCity} ➔ ${hubLocation}` : (isLastLeg ? `${hubLocation} ➔ ${toCity}` : `Hub ${index} ➔ Hub ${index + 1}`));

            // Sub-step A: Driver Assignment
            // A leg's driver is "assigned" only if that leg is already active or past
            const isDriverAssigned = legNum < activeLeg
                || (legNum === activeLeg && leg.status !== 'pending' && leg.driver_name && leg.driver_name !== '-')
                || (legNum <= activeLeg && isHandoverAccepted);
            
            // Show actual driver name in title if available, otherwise fallback
            const hasSpecificDriverName = legDriver && !legDriver.toLowerCase().startsWith('driver ');
            const assignTitle = hasSpecificDriverName
                ? `${legDriver} Assigned (Leg ${legNum})`
                : `Driver Assigned (Leg ${legNum})`;
            const assignDesc = isDriverAssigned
                ? `${legDriver} assigned for ${legRoute}.`
                : `Assign driver for ${legRoute}.`;

            timelineSteps.push({
                id: `md-leg-${legNum}-driver`,
                title: assignTitle,
                description: assignDesc,
                status: isDriverAssigned ? 'completed' : 'pending',
                dateText: isDriverAssigned && legNum === 1 ? driverAssignedDate : undefined,
                driverName: legDriver,
                legNumber: legNum,
            });

            // Sub-step B: Pickup (Only on Leg 1)
            if (isFirstLeg) {
                const isLeg1PickedUp = activeLeg > 1 || ['picked_up', 'in_transit', 'at_hub', 'handover_pending', 'handover_accepted', 'at_delivery', 'delivered', 'completed'].includes(status);
                timelineSteps.push({
                    id: `md-leg-${legNum}-pickup`,
                    title: 'Goods Picked Up',
                    description: 'Goods collection from consignor facility completed.',
                    status: isLeg1PickedUp
                        ? 'completed'
                        : (status === 'at_pickup' || status === 'assigned' || status === 'accepted' ? 'in_progress' : 'pending'),
                    dateText: isLeg1PickedUp ? pickupDateStr : undefined,
                });
            }

            // Sub-step C: In Transit to Destination/Hub
            const enRouteTitle = isLastLeg
                ? `In Transit to Delivery (Leg ${legNum})`
                : `In Transit to Hub (Leg ${legNum})`;
            const enRouteDesc = isLastLeg
                ? 'Goods will be transported to the final destination.'
                : 'Goods are in transit to the hub.';

            let enRouteStatus: 'completed' | 'in_progress' | 'pending' = 'pending';
            if (legNum < activeLeg || isDelivered) {
                enRouteStatus = 'completed';
            } else if (legNum === activeLeg) {
                if (status === 'in_transit' || status === 'picked_up') {
                    enRouteStatus = 'in_progress';
                } else if (['at_hub', 'handover_pending', 'handover_accepted', 'at_delivery', 'delivered', 'completed'].includes(status)) {
                    enRouteStatus = 'completed';
                }
            }

            timelineSteps.push({
                id: `md-leg-${legNum}-enroute`,
                title: enRouteTitle,
                description: enRouteDesc,
                status: enRouteStatus,
                legNumber: legNum,
            });

            // Sub-step D: Handover (Only between legs, not on last leg)
            if (!isLastLeg) {
                const nextDriverName = legs[index + 1]?.driver_name || `Driver ${legNum + 1}`;
                const handoverTitle = `Handover at ${hubLocation}`;
                const handoverDesc = `Goods will be handed over to ${nextDriverName}.`;

                let handoverStatus: 'completed' | 'in_progress' | 'pending' = 'pending';
                if (legNum < activeLeg || isHandoverAccepted || isDelivered) {
                    handoverStatus = 'completed';
                } else if (legNum === activeLeg) {
                    if (status === 'at_hub' || status === 'handover_pending') {
                        handoverStatus = 'in_progress';
                    }
                }

                timelineSteps.push({
                    id: `md-leg-${legNum}-handover`,
                    title: handoverTitle,
                    description: handoverDesc,
                    status: handoverStatus,
                    legNumber: legNum,
                });
            }
        });

        // Final Step: Delivered
        timelineSteps.push({
            id: 'md-delivered',
            title: 'Delivered',
            description: 'Final delivery to the consignee and POD confirmation.',
            status: isDelivered ? 'completed' : (status === 'at_delivery' && activeLeg === legs.length ? 'in_progress' : 'pending'),
            dateText: isDelivered ? deliveryDateStr : undefined,
        });
    }

    if (isFailed) {
        timelineSteps.push({
            id: 'exception-failed',
            title: 'Shipment Cancelled / Exception',
            description: 'This shipment has encountered an operational halt.',
            status: 'failed',
        });
    }

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[6px] shadow-xs font-sans overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1e2329]">
                <div className="flex items-center gap-2">
                    <GitFork size={15} className="text-[#FF4A1F]" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Shipment Timeline
                    </h3>
                    <span className="text-[11px] font-bold text-[#FF4A1F] bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-[4px] border border-orange-200/60 dark:border-orange-900/40">
                        {hasMultipleLegs ? '(Multi-Driver)' : '(Single Driver)'}
                    </span>
                </div>
            </div>

            {/* Vertically Connected Timeline */}
            <div className="p-4 sm:p-5">
                <div className="relative">
                    {/* Continuous vertical connecting line */}
                    <div className="absolute left-[10px] top-3.5 bottom-4 w-[2px] bg-slate-200 dark:bg-slate-700 pointer-events-none" />

                    <div className="space-y-4 relative">
                        {timelineSteps.map((step) => {
                            const isCompleted = step.status === 'completed';
                            const isInProgress = step.status === 'in_progress';
                            const isPending = step.status === 'pending';
                            const isError = step.status === 'failed';

                            return (
                                <div
                                    key={step.id}
                                    className={`relative flex items-start gap-3.5 ${
                                        isInProgress
                                            ? 'p-2.5 -ml-1.5 rounded-[6px] bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/70 dark:border-orange-900/40'
                                            : ''
                                    }`}
                                >
                                    {/* Indicator Circle */}
                                    <div className="shrink-0 mt-0.5 z-10">
                                        {isCompleted ? (
                                            <div className="w-[22px] h-[22px] rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                        ) : isInProgress ? (
                                            <div className="w-[22px] h-[22px] rounded-full border-2 border-[#FF4A1F] bg-white dark:bg-[#1e2329] flex items-center justify-center shadow-2xs">
                                                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4A1F] animate-pulse" />
                                            </div>
                                        ) : isError ? (
                                            <div className="w-[22px] h-[22px] rounded-full bg-rose-500 text-white flex items-center justify-center shadow-2xs">
                                                <AlertTriangle size={12} strokeWidth={2.5} />
                                            </div>
                                        ) : (
                                            <div className="w-[22px] h-[22px] rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1e2329] flex items-center justify-center" />
                                        )}
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h4
                                                className={`text-xs font-bold leading-tight ${
                                                    isCompleted
                                                        ? 'text-slate-900 dark:text-slate-100'
                                                        : isInProgress
                                                        ? 'text-slate-900 dark:text-white font-extrabold'
                                                        : isError
                                                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                                                        : 'text-slate-500 dark:text-slate-400 font-semibold'
                                                }`}
                                            >
                                                {step.title}
                                            </h4>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                                {step.description}
                                            </p>
                                        </div>

                                        {/* Status Pill or Timestamp on Right */}
                                        <div className="shrink-0 text-right">
                                            {step.dateText ? (
                                                <span className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                                    <Calendar size={11} className="text-slate-400" />
                                                    <span>{step.dateText}</span>
                                                </span>
                                            ) : isInProgress ? (
                                                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-100 dark:bg-orange-950 text-[#FF4A1F] border border-orange-200 dark:border-orange-900 shadow-2xs">
                                                    In Progress
                                                </span>
                                            ) : isError ? (
                                                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                                                    Exception
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                                    Pending
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShipmentTimeline;

