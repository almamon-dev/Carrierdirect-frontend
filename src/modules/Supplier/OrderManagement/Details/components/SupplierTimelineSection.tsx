import React from 'react';
import { AlertTriangle, Calendar, Check, GitFork } from 'lucide-react';
import { NormalizedSupplierOrder, formatLocationName } from '../utils/supplierOrderTrackUtils';

interface SupplierTimelineSectionProps {
    order: NormalizedSupplierOrder;
}

type StepStatus = 'completed' | 'in_progress' | 'pending' | 'failed';

interface TimelineStepItem {
    id: string;
    title: string;
    description: string;
    status: StepStatus;
    dateText?: string;
}

interface LegInfo {
    legNumber: number;
    driverName: string;
    journeyLeg: string;
    status: string;
}

const PLACEHOLDER_DRIVER_NAMES = ['', '-', 'unassigned', 'assigned driver', 'assigned fleet driver'];

const isRealName = (name?: string | null): name is string =>
    Boolean(name) && !PLACEHOLDER_DRIVER_NAMES.includes(String(name).trim().toLowerCase());

const formatTimestamp = (raw?: string | null): string | undefined => {
    if (!raw) return undefined;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return undefined;
    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${monthDay}, ${time}`;
};

const findHistoryTime = (history: any[], keywords: string[]): string | undefined => {
    for (const item of history) {
        const text = `${item?.status || ''} ${item?.title || ''} ${item?.description || ''}`.toLowerCase();
        if (keywords.some((k) => text.includes(k))) {
            const formatted = formatTimestamp(item?.raw_date || item?.created_at || item?.date || item?.time);
            if (formatted) return formatted;
        }
    }
    return undefined;
};

const extractHubLocation = (order: NormalizedSupplierOrder, legs: LegInfo[]): string => {
    const rawHub = (order as any)?.hub_location || (order as any)?.hubLocation || (order as any)?.handover?.hub_location;
    if (rawHub && !rawHub.toLowerCase().includes('transit hub')) {
        return rawHub;
    }
    // Check Leg 2 starting point
    if (legs[1]?.journeyLeg) {
        const parts = legs[1].journeyLeg.split(/➔|→|->/);
        if (parts.length > 1 && parts[0].trim() && !parts[0].toLowerCase().includes('transit hub')) {
            return parts[0].trim();
        }
    }
    // Check Leg 1 destination
    if (legs[0]?.journeyLeg) {
        const parts = legs[0].journeyLeg.split(/➔|→|->/);
        if (parts.length > 1 && parts[1].trim() && !parts[1].toLowerCase().includes('transit hub')) {
            return parts[1].trim();
        }
    }
    // Check order leg2_journey_leg
    if ((order as any)?.leg2_journey_leg) {
        const parts = String((order as any).leg2_journey_leg).split(/➔|→|->/);
        if (parts.length > 1 && parts[0].trim() && !parts[0].toLowerCase().includes('transit hub')) {
            return parts[0].trim();
        }
    }
    // Check subcontractor_journey_leg
    if ((order as any)?.subcontractor_journey_leg) {
        const parts = String((order as any).subcontractor_journey_leg).split(/➔|→|->/);
        if (parts.length > 1 && parts[1].trim() && !parts[1].toLowerCase().includes('transit hub')) {
            return parts[1].trim();
        }
    }
    return 'Intermediate Hub';
};

const resolveLegs = (order: NormalizedSupplierOrder, fromCity: string, toCity: string): LegInfo[] => {
    const rawLegs = (Array.isArray(order.shipment_legs) && order.shipment_legs.length > 0
        ? order.shipment_legs
        : Array.isArray(order.legs) ? order.legs : []) as any[];

    if (rawLegs.length > 1) {
        return rawLegs.map((leg, index) => ({
            legNumber: Number(leg?.leg_number) || index + 1,
            driverName: leg?.driver_name || leg?.subcontractor_driver_name || leg?.driver?.name || '',
            journeyLeg: leg?.journey_leg || '',
            status: String(leg?.status || 'pending').toLowerCase(),
        }));
    }

    if (order.is_relay) {
        return [
            {
                legNumber: 1,
                driverName: order.driver?.name || '',
                journeyLeg: order.driver?.journeyLeg || order.subcontractor_journey_leg || '',
                status: 'assigned',
            },
            {
                legNumber: 2,
                driverName: order.leg2_driver_name || '',
                journeyLeg: order.leg2_journey_leg || '',
                status: 'pending',
            },
        ];
    }

    return [];
};

export const SupplierTimelineSection: React.FC<SupplierTimelineSectionProps> = ({ order }) => {
    const status = (order?.rawStatus || order?.status || 'confirmed').toLowerCase().trim().replace(/[\s-]+/g, '_');
    const fromCity = formatLocationName(order?.pickupCity || order?.from || 'Origin');
    const toCity = formatLocationName(order?.deliveryCity || order?.to || 'Destination');
    const history: any[] = Array.isArray(order?.trackingHistory)
        ? order.trackingHistory
        : Array.isArray(order?.updates) ? order.updates : [];

    const isDelivered = ['delivered', 'completed', 'pod_uploaded', 'pod_review', 'pod_accepted'].includes(status);
    const isFailed = status === 'cancelled';

    const orderConfirmedDate = findHistoryTime(history, ['confirmed', 'order']) || formatTimestamp(order?.createdAt || order?.date);
    const driverAssignedDate = findHistoryTime(history, ['assigned', 'allocat']);
    const pickupDate = findHistoryTime(history, ['picked_up', 'picked up', 'pickup', 'collect']);
    const deliveryDate = findHistoryTime(history, ['delivered', 'completed', 'pod']);

    const legs = resolveLegs(order, fromCity, toCity);
    const dynamicHub = extractHubLocation(order, legs);
    const hubLabel = dynamicHub && dynamicHub !== 'Intermediate Hub' ? dynamicHub : 'Intermediate Hub';
    const hasMultipleLegs = legs.length > 1;
    const steps: TimelineStepItem[] = [];

    steps.push({
        id: 'order-confirmed',
        title: 'Order Confirmed',
        description: 'Shipment order created and confirmed by customer.',
        status: 'completed',
        dateText: orderConfirmedDate,
    });

    if (!hasMultipleLegs) {
        // SCENARIO A: SINGLE DRIVER (5 steps)
        const driverName = order?.driver?.name;
        const hasDriver = isRealName(driverName);
        const isPickedUp = ['picked_up', 'in_transit', 'at_delivery', 'out_for_delivery', 'arrived'].includes(status) || isDelivered;
        const isEnRoute = ['picked_up', 'in_transit', 'at_delivery', 'out_for_delivery', 'arrived'].includes(status);

        steps.push(
            {
                id: 'sd-driver',
                title: hasDriver ? `${driverName} Assigned` : 'Driver Assigned',
                description: hasDriver
                    ? `Driver ${driverName} assigned for the full trip.`
                    : 'Assign a driver to dispatch this shipment.',
                status: hasDriver ? 'completed' : 'in_progress',
                dateText: hasDriver ? driverAssignedDate : undefined,
            },
            {
                id: 'sd-pickup',
                title: 'Goods Picked Up',
                description: 'Goods collection from consignor facility completed.',
                status: isPickedUp
                    ? 'completed'
                    : hasDriver && ['assigned', 'driver_assigned', 'accepted', 'at_pickup', 'in_progress'].includes(status) ? 'in_progress' : 'pending',
                dateText: isPickedUp ? pickupDate : undefined,
            },
            {
                id: 'sd-enroute',
                title: 'En Route',
                description: 'Goods are on the way to the consignee.',
                status: isDelivered ? 'completed' : isEnRoute ? 'in_progress' : 'pending',
            },
            {
                id: 'sd-delivered',
                title: 'Cargo Delivered',
                description: 'Goods delivered to consignee and Proof of Delivery (POD) submitted by driver.',
                status: isDelivered ? 'completed' : status === 'at_delivery' ? 'in_progress' : 'pending',
                dateText: isDelivered ? deliveryDate : undefined,
            },
            {
                id: 'sd-pod-approval',
                title: 'Customer POD Approval',
                description: 'Customer reviews and approves Proof of Delivery (POD), releasing payment and closing the shipment.',
                status: status === 'completed' ? 'completed' : isDelivered ? 'in_progress' : 'pending',
                dateText: status === 'completed' ? deliveryDate : undefined,
            }
        );
    } else {
        // SCENARIO B: MULTI-DRIVER / MULTI-LEG
        const activeLeg = Number(order?.current_active_leg) || 1;
        const isHandoverAccepted = status === 'handover_accepted' || activeLeg > 1;

        // PHASE 1: DRIVER ASSIGNMENTS (Dispatched upfront at 2nd & 3rd positions)
        legs.forEach((leg, index) => {
            const legNum = leg.legNumber;
            const isFirstLeg = index === 0;
            const hasDriver = isRealName(leg.driverName);
            let rawLegRoute = leg.journeyLeg || (isFirstLeg ? `${fromCity} ➔ ${hubLabel}` : `${hubLabel} ➔ ${toCity}`);
            if (rawLegRoute.includes('Transit Hub') || rawLegRoute.includes('transit hub')) {
                rawLegRoute = rawLegRoute.replace(/Transit Hub|transit hub/g, hubLabel);
            }
            const legRoute = formatLocationName(rawLegRoute);

            let driverDesc = `Assign driver for ${legRoute}.`;
            if (hasDriver) {
                if (isFirstLeg) {
                    driverDesc = `${leg.driverName} assigned for ${legRoute}.`;
                } else {
                    driverDesc = `${leg.driverName} scheduled for ${legRoute}. (Activates after handover)`;
                }
            }

            steps.push({
                id: `leg-${legNum}-driver`,
                title: hasDriver ? `${leg.driverName} Assigned (Leg ${legNum})` : `Driver Assigned (Leg ${legNum})`,
                description: driverDesc,
                status: hasDriver ? 'completed' : isFirstLeg && legNum === activeLeg ? 'in_progress' : 'pending',
                dateText: hasDriver ? driverAssignedDate : undefined,
            });
        });

        // PHASE 2: PHYSICAL TRANSIT STEPS (Pickup -> In Transit -> Handover -> Delivery)
        legs.forEach((leg, index) => {
            const legNum = leg.legNumber;
            const isFirstLeg = index === 0;
            const isLastLeg = index === legs.length - 1;
            const leg1HasDriver = isRealName(legs[0]?.driverName);

            // Pickup on Leg 1
            if (isFirstLeg) {
                const isLeg1PickedUp = activeLeg > 1 || isDelivered
                    || ['picked_up', 'in_transit', 'at_hub', 'handover_pending', 'handover_accepted', 'at_delivery'].includes(status);
                steps.push({
                    id: `leg-${legNum}-pickup`,
                    title: 'Goods Picked Up',
                    description: 'Goods collection from consignor facility completed.',
                    status: isLeg1PickedUp
                        ? 'completed'
                        : leg1HasDriver && ['assigned', 'driver_assigned', 'accepted', 'at_pickup', 'in_progress'].includes(status) ? 'in_progress' : 'pending',
                    dateText: isLeg1PickedUp ? pickupDate : undefined,
                });
            }

            // In Transit
            let enRouteStatus: StepStatus = 'pending';
            if (legNum < activeLeg || isDelivered) {
                enRouteStatus = 'completed';
            } else if (legNum === activeLeg) {
                if (['in_transit', 'picked_up'].includes(status)) enRouteStatus = 'in_progress';
                else if (['at_hub', 'handover_pending', 'handover_accepted', 'at_delivery'].includes(status)) enRouteStatus = 'completed';
            }

            steps.push({
                id: `leg-${legNum}-enroute`,
                title: isLastLeg ? `In Transit to Delivery (Leg ${legNum})` : `In Transit to ${hubLabel} (Leg ${legNum})`,
                description: isLastLeg ? 'Goods will be transported to the final destination.' : `Goods are in transit to ${hubLabel}.`,
                status: enRouteStatus,
            });

            // Handover between legs
            if (!isLastLeg) {
                const nextDriver = legs[index + 1]?.driverName;
                let handoverStatus: StepStatus = 'pending';
                if (legNum < activeLeg || isHandoverAccepted || isDelivered) handoverStatus = 'completed';
                else if (legNum === activeLeg && ['at_hub', 'handover_pending'].includes(status)) handoverStatus = 'in_progress';

                steps.push({
                    id: `leg-${legNum}-handover`,
                    title: `Handover at ${hubLabel}`,
                    description: isRealName(nextDriver)
                        ? `Goods will be handed over to ${nextDriver}.`
                        : 'Goods will be handed over to the next driver.',
                    status: handoverStatus,
                });
            }
        });

        steps.push({
            id: 'leg-delivered',
            title: 'Cargo Delivered',
            description: 'Goods delivered to consignee and Proof of Delivery (POD) submitted by driver.',
            status: isDelivered ? 'completed' : status === 'at_delivery' && activeLeg === legs.length ? 'in_progress' : 'pending',
            dateText: isDelivered ? deliveryDate : undefined,
        });

        steps.push({
            id: 'leg-pod-approval',
            title: 'Customer POD Approval',
            description: 'Customer reviews and approves Proof of Delivery (POD), releasing payment and closing the shipment.',
            status: status === 'completed' ? 'completed' : isDelivered ? 'in_progress' : 'pending',
            dateText: status === 'completed' ? deliveryDate : undefined,
        });
    }

    if (isFailed) {
        steps.push({
            id: 'exception-failed',
            title: 'Shipment Cancelled / Exception',
            description: 'This shipment has encountered an operational halt.',
            status: 'failed',
        });
    }

    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[6px] shadow-xs font-sans overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <GitFork size={15} className="text-[#FF4A1F]" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Shipment Timeline</h3>
                    <span className="text-[11px] font-bold text-[#FF4A1F] bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-[4px] border border-orange-200/60 dark:border-orange-900/40">
                        {hasMultipleLegs ? '(Multi-Driver)' : '(Single Driver)'}
                    </span>
                </div>
            </div>

            {/* Vertically connected timeline */}
            <div className="p-4 sm:p-5">
                <div className="relative">
                    <div className="absolute left-[10px] top-3.5 bottom-4 w-[2px] bg-slate-200 dark:bg-slate-700 pointer-events-none" />

                    <div className="space-y-4 relative">
                        {steps.map((step) => {
                            const isCompleted = step.status === 'completed';
                            const isInProgress = step.status === 'in_progress';
                            const isError = step.status === 'failed';

                            return (
                                <div
                                    key={step.id}
                                    className={`relative flex items-start gap-3.5 ${isInProgress ? '' : !isCompleted && !isError ? 'opacity-80' : ''}`}
                                >
                                    {/* Indicator */}
                                    <div className="relative z-10 shrink-0 mt-0.5">
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
                                            <div className="w-[22px] h-[22px] rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1e2329]" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h4
                                                className={`text-xs leading-tight ${isCompleted
                                                    ? 'text-slate-900 dark:text-slate-100 font-bold'
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

                                        <div className="shrink-0 text-right">
                                            {isCompleted && step.dateText ? (
                                                <span className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                                                    <Calendar size={11} className="text-slate-400" />
                                                    <span>{step.dateText}</span>
                                                </span>
                                            ) : isCompleted ? (
                                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                                                    Completed
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

export default SupplierTimelineSection;
