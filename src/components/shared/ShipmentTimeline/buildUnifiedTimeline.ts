export type UnifiedTimelineStepStatus = 'completed' | 'active' | 'pending' | 'exception';

export interface UnifiedTimelineStep {
    id: string;
    title: string;
    description: string;
    date?: string;
    status: UnifiedTimelineStepStatus;
    badgeText?: string;
}

export interface UnifiedTimelineLegInput {
    legNumber: number;
    legType?: string;
    journeyLeg?: string;
    driverName?: string;
    driverPhone?: string;
    vehiclePlate?: string;
    status?: string;
    assignedAt?: string;
    completedAt?: string;
}

export interface UnifiedTimelineHandoverInput {
    status?: string;
    hubLocation?: string;
    driverToName?: string;
    handoverAt?: string;
    acceptedAt?: string;
}

export interface UnifiedTimelineHistoryItem {
    status?: string;
    title?: string;
    description?: string;
    date?: string;
    rawDate?: string;
    createdAt?: string;
}

export interface UnifiedTimelineInput {
    status?: string;
    rawMilestoneStatus?: string;
    orderStatus?: string;
    podStatus?: string;
    isRelay?: boolean;
    currentActiveLeg?: number;
    hubLocation?: string;
    driverName?: string;
    pickupCity?: string;
    deliveryCity?: string;
    createdAt?: string;
    podUploadedAt?: string;
    handover?: UnifiedTimelineHandoverInput | null;
    legs?: UnifiedTimelineLegInput[];
    history?: UnifiedTimelineHistoryItem[];
}

export interface UnifiedTimelineResult {
    steps: UnifiedTimelineStep[];
    hasMultipleLegs: boolean;
    hubLabel: string;
}

const PLACEHOLDER_TEXTS = new Set([
    '',
    '—',
    '-',
    'n/a',
    'na',
    'null',
    'undefined',
    'not assigned',
    'unassigned',
    'pending assignment',
    'waiting for assignment',
]);

export function sanitizeTimelineText(value?: string | null): string {
    if (!value) return '';
    const trimmed = String(value).trim();
    if (PLACEHOLDER_TEXTS.has(trimmed.toLowerCase())) {
        return '';
    }
    return trimmed.replace(/\bcumm?il+a\b/gi, 'Cumilla');
}

export function formatTimelineTimestamp(raw?: string | null): string | undefined {
    const cleaned = sanitizeTimelineText(raw);
    if (!cleaned) return undefined;

    const parsed = new Date(cleaned);
    if (Number.isNaN(parsed.getTime())) {
        return cleaned;
    }

    return parsed.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function findHistoryTimestamp(
    history: UnifiedTimelineHistoryItem[] | undefined,
    statusesOrKeywords: string[],
    fallbackRaw?: string
): string | undefined {
    if (Array.isArray(history) && history.length > 0) {
        const match = history.find((item) => {
            const st = String(item.status || '').toLowerCase();
            const title = String(item.title || '').toLowerCase();
            const desc = String(item.description || '').toLowerCase();
            return statusesOrKeywords.some((kw) => {
                const target = kw.toLowerCase();
                return st === target || title.includes(target) || desc.includes(target);
            });
        });

        if (match) {
            return formatTimelineTimestamp(match.createdAt || match.rawDate || match.date);
        }
    }

    return formatTimelineTimestamp(fallbackRaw);
}

function normalizeRouteText(journeyLeg: string | undefined, hubLabel: string, fallbackRoute: string): string {
    const cleaned = sanitizeTimelineText(journeyLeg);
    if (!cleaned) return fallbackRoute;

    const withProperArrow = cleaned.replace(/\s*(➔|->|→)\s*/g, ' → ');
    if (hubLabel && hubLabel.toLowerCase() !== 'transit hub') {
        return withProperArrow.replace(/transit hub/gi, hubLabel);
    }
    return withProperArrow;
}

function resolveHubLabel(input: UnifiedTimelineInput, sortedLegs: UnifiedTimelineLegInput[]): string {
    const directHub = sanitizeTimelineText(input.hubLocation);
    if (directHub && !directHub.toLowerCase().includes('transit hub') && !directHub.toLowerCase().includes('intermediate hub')) {
        return directHub;
    }

    const handoverHub = sanitizeTimelineText(input.handover?.hubLocation);
    if (handoverHub && !handoverHub.toLowerCase().includes('transit hub') && !handoverHub.toLowerCase().includes('intermediate hub')) {
        return handoverHub;
    }

    for (const leg of sortedLegs) {
        const jLeg = sanitizeTimelineText(leg.journeyLeg);
        if (!jLeg) continue;
        const parts = jLeg.split(/➔|→|->/).map((p) => p.trim()).filter(Boolean);
        if (leg.legNumber === 1 && parts.length > 1 && !parts[1].toLowerCase().includes('transit hub')) {
            return parts[1];
        }
        if (leg.legNumber >= 2 && parts.length > 1 && !parts[0].toLowerCase().includes('transit hub')) {
            return parts[0];
        }
    }

    return 'Transit Hub';
}

const PRE_PICKUP_LEG_STATUSES = new Set(['', 'pending', 'assigned', 'accepted', 'at_pickup', 'driver_assigned']);
const IN_TRANSIT_LEG_STATUSES = new Set(['in_transit', 'in_progress', 'on_the_way']);
const POST_HUB_LEG1_STATUSES = new Set(['at_hub', 'handover_pending', 'completed', 'delivered']);

export function buildUnifiedShipmentTimeline(input: UnifiedTimelineInput): UnifiedTimelineResult {
    const sortedLegs = [...(input.legs || [])]
        .filter((l) => l && Number(l.legNumber) > 0)
        .sort((a, b) => Number(a.legNumber) - Number(b.legNumber));

    const hasMultipleLegs = Boolean(input.isRelay) || sortedLegs.length > 1;
    const hubLabel = resolveHubLabel(input, sortedLegs);

    const pickupLabel = sanitizeTimelineText(input.pickupCity) || 'Origin';
    const deliveryLabel = sanitizeTimelineText(input.deliveryCity) || 'Destination';

    const rawMilestone = String(input.rawMilestoneStatus || input.status || 'confirmed').toLowerCase().trim();
    const orderStatus = String(input.orderStatus || '').toLowerCase().trim();
    const podStatus = String(input.podStatus || '').toLowerCase().trim();
    const effectiveStatus = rawMilestone || 'confirmed';

    const isPodApproved =
        effectiveStatus === 'completed' ||
        effectiveStatus === 'pod_accepted' ||
        orderStatus === 'completed' ||
        ['confirmed', 'approved', 'accepted'].includes(podStatus);

    const isCancelled = effectiveStatus === 'cancelled' || orderStatus === 'cancelled';

    const isDeliveredOrPod =
        isPodApproved ||
        ['delivered', 'pod_uploaded', 'pod_review'].includes(effectiveStatus);

    const confirmedDate = findHistoryTimestamp(input.history, ['confirmed', 'order confirmed', 'placed', 'booked'], input.createdAt);
    const podUploadedDate = findHistoryTimestamp(
        input.history,
        ['delivered', 'pod uploaded', 'proof of delivery'],
        isDeliveredOrPod ? input.podUploadedAt : undefined
    );
    const podApprovedDate = findHistoryTimestamp(
        input.history,
        ['completed', 'pod verified', 'pod accepted', 'escrow released'],
        isPodApproved ? input.podUploadedAt : undefined
    );

    if (!hasMultipleLegs) {
        const leg1 = sortedLegs[0];
        const singleDriverName = sanitizeTimelineText(leg1?.driverName) || sanitizeTimelineText(input.driverName);
        const leg1Status = String(leg1?.status || '').toLowerCase().trim();
        const combinedStatus = !PRE_PICKUP_LEG_STATUSES.has(leg1Status) ? leg1Status : effectiveStatus;

        const isPendingConfirmation = combinedStatus === 'pending' && !singleDriverName;
        const hasDriverOrPast = Boolean(singleDriverName) || !['pending', 'confirmed', 'booked'].includes(combinedStatus);

        const isPickedUpMilestone = combinedStatus === 'picked_up';
        const isInTransitMilestone = ['in_transit', 'in_progress', 'on_the_way'].includes(combinedStatus);
        const isAtDeliveryMilestone = ['at_delivery', 'arrived'].includes(combinedStatus);

        const passedPickup =
            isDeliveredOrPod ||
            isPickedUpMilestone ||
            isInTransitMilestone ||
            isAtDeliveryMilestone;

        const passedTransit = isDeliveredOrPod || isAtDeliveryMilestone;

        const steps: UnifiedTimelineStep[] = [
            {
                id: 'confirmed',
                title: 'Order Confirmed',
                description: 'Shipment order created and confirmed by customer.',
                date: confirmedDate,
                status: isPendingConfirmation ? 'active' : 'completed',
            },
            {
                id: 'assigned',
                title: singleDriverName ? `${singleDriverName} Assigned` : 'Driver Assigned',
                description: singleDriverName
                    ? `${singleDriverName} assigned to execute delivery from ${pickupLabel} to ${deliveryLabel}.`
                    : `Waiting for carrier to assign an available driver for ${pickupLabel} → ${deliveryLabel}.`,
                date: hasDriverOrPast
                    ? findHistoryTimestamp(input.history, ['driver_assigned', 'assigned', 'dispatched'], leg1?.assignedAt)
                    : undefined,
                status: isPendingConfirmation
                    ? 'pending'
                    : hasDriverOrPast
                        ? 'completed'
                        : 'active',
            },
            {
                id: 'picked_up',
                title: 'Goods Picked Up',
                description: passedPickup
                    ? 'Goods collected from pickup facility.'
                    : 'Awaiting collection from consignor pickup facility.',
                date: passedPickup
                    ? findHistoryTimestamp(input.history, ['picked_up', 'picked up', 'collected'])
                    : undefined,
                status: isPickedUpMilestone
                    ? 'active'
                    : (isInTransitMilestone || isAtDeliveryMilestone || isDeliveredOrPod)
                        ? 'completed'
                        : 'pending',
            },
            {
                id: 'in_transit',
                title: 'En Route',
                description: isAtDeliveryMilestone
                    ? `Driver arrived near destination (${deliveryLabel}).`
                    : `Driver en route to ${deliveryLabel}.`,
                date: passedTransit || isInTransitMilestone
                    ? findHistoryTimestamp(input.history, ['in_transit', 'en route', 'transit'])
                    : undefined,
                status: isInTransitMilestone
                    ? 'active'
                    : passedTransit
                        ? 'completed'
                        : 'pending',
            },
            {
                id: 'delivered',
                title: 'Cargo Delivered',
                description: isAtDeliveryMilestone
                    ? `Arrived at ${deliveryLabel}; awaiting unloading and Proof of Delivery (POD).`
                    : 'Goods delivered to consignee and Proof of Delivery (POD) submitted by driver.',
                date: isDeliveredOrPod ? podUploadedDate : undefined,
                status: isAtDeliveryMilestone
                    ? 'active'
                    : isDeliveredOrPod
                        ? 'completed'
                        : 'pending',
            },
            {
                id: 'pod_approval',
                title: 'Customer POD Approval',
                description: isPodApproved
                    ? 'Customer reviewed and approved Proof of Delivery (POD). Payment settled.'
                    : 'Customer reviews and approves Proof of Delivery (POD), releasing payment and closing the shipment.',
                date: isPodApproved ? podApprovedDate : undefined,
                status: isPodApproved
                    ? 'completed'
                    : isDeliveredOrPod
                        ? 'active'
                        : 'pending',
            },
        ];

        if (isCancelled) {
            steps.push({
                id: 'cancelled',
                title: 'Shipment Cancelled',
                description: 'This shipment has been cancelled.',
                date: findHistoryTimestamp(input.history, ['cancelled', 'canceled']),
                status: 'exception',
                badgeText: 'Cancelled',
            });
        }

        return { steps, hasMultipleLegs: false, hubLabel };
    }

    // ─── MULTI-DRIVER RELAY TIMELINE ───────────────────────────────────────────
    const leg1 = sortedLegs.find((l) => Number(l.legNumber) === 1);
    const leg2 = sortedLegs.find((l) => Number(l.legNumber) === 2);

    const leg1DriverName = sanitizeTimelineText(leg1?.driverName) || sanitizeTimelineText(input.driverName);
    const leg2DriverName = sanitizeTimelineText(leg2?.driverName);
    const leg1Status = String(leg1?.status || '').toLowerCase().trim();
    const leg2Status = String(leg2?.status || '').toLowerCase().trim();
    const activeLegNum = Math.max(1, Number(input.currentActiveLeg || 1));

    const handoverStatus = String(input.handover?.status || '').toLowerCase().trim();
    const isPreHubByLeg1 =
        activeLegNum <= 1 &&
        (PRE_PICKUP_LEG_STATUSES.has(leg1Status) || leg1Status === 'picked_up' || IN_TRANSIT_LEG_STATUSES.has(leg1Status)) &&
        !isDeliveredOrPod &&
        !['at_hub', 'handover_pending', 'handover_accepted', 'at_delivery', 'arrived'].includes(effectiveStatus);

    const handoverAccepted =
        isDeliveredOrPod ||
        (!isPreHubByLeg1 && (
            activeLegNum >= 2 ||
            leg1Status === 'completed' ||
            handoverStatus === 'accepted' ||
            effectiveStatus === 'handover_accepted' ||
            ['handover_accepted', 'in_transit', 'at_delivery', 'arrived', 'delivered', 'completed'].includes(leg2Status)
        ));

    const handoverPending =
        !handoverAccepted &&
        !isPreHubByLeg1 &&
        (
            handoverStatus === 'pending_acceptance' ||
            leg1Status === 'at_hub' ||
            leg1Status === 'handover_pending' ||
            effectiveStatus === 'at_hub' ||
            effectiveStatus === 'handover_pending'
        );

    const leg1PickedUpActive =
        !handoverPending &&
        !handoverAccepted &&
        !isDeliveredOrPod &&
        (leg1Status === 'picked_up' || effectiveStatus === 'picked_up');

    const leg1TransitActive =
        !handoverPending &&
        !handoverAccepted &&
        !isDeliveredOrPod &&
        (IN_TRANSIT_LEG_STATUSES.has(leg1Status) || (activeLegNum === 1 && IN_TRANSIT_LEG_STATUSES.has(effectiveStatus) && !POST_HUB_LEG1_STATUSES.has(leg1Status)));

    const leg1PickupDone =
        leg1TransitActive ||
        handoverPending ||
        handoverAccepted ||
        isDeliveredOrPod ||
        POST_HUB_LEG1_STATUSES.has(leg1Status);

    const leg1TransitDone = handoverPending || handoverAccepted || isDeliveredOrPod;

    const leg2AtDelivery =
        !isDeliveredOrPod &&
        handoverAccepted &&
        (['at_delivery', 'arrived'].includes(leg2Status) || ['at_delivery', 'arrived'].includes(effectiveStatus));

    const leg2TransitActive =
        !isDeliveredOrPod &&
        !leg2AtDelivery &&
        handoverAccepted;

    const steps: UnifiedTimelineStep[] = [];

    // Step 1: Order Confirmed
    steps.push({
        id: 'confirmed',
        title: 'Order Confirmed',
        description: 'Shipment order created and confirmed by customer.',
        date: confirmedDate,
        status: 'completed',
    });

    // Phase 1: Upfront Driver Assignments (ordered Leg 1, Leg 2, ... right after Order Confirmed)
    const displayLegs: UnifiedTimelineLegInput[] = sortedLegs.length > 0
        ? sortedLegs
        : [
            { legNumber: 1, legType: 'pickup', driverName: leg1DriverName },
            { legNumber: 2, legType: 'delivery', driverName: leg2DriverName },
        ];

    displayLegs.forEach((leg, index) => {
        const legNo = Number(leg.legNumber || index + 1);
        const dName = sanitizeTimelineText(leg.driverName) || (legNo === 1 ? leg1DriverName : '');
        const defaultRoute =
            legNo === 1
                ? `${pickupLabel} → ${hubLabel}`
                : legNo === displayLegs.length
                    ? `${hubLabel} → ${deliveryLabel}`
                    : `${hubLabel} Hub Transfer`;
        const routeText = normalizeRouteText(leg.journeyLeg, hubLabel, defaultRoute);
        const assignedDate = findHistoryTimestamp(
            input.history,
            [`leg ${legNo}`, `driver_assigned`, `assigned`],
            leg.assignedAt
        );

        if (dName) {
            steps.push({
                id: `leg-${legNo}-assigned`,
                title: `${dName} Assigned (Leg ${legNo})`,
                description:
                    legNo === 1
                        ? `${dName} assigned for ${routeText}.`
                        : `${dName} scheduled for ${routeText}. (Activates after handover)`,
                date: assignedDate,
                status: 'completed',
            });
        } else {
            steps.push({
                id: `leg-${legNo}-assigned`,
                title: `Leg ${legNo} Driver Pending`,
                description: `Waiting for carrier to assign a driver for ${routeText}.`,
                status: 'pending',
            });
        }
    });

    // Phase 2: Physical Movement
    // Step: Goods Picked Up
    steps.push({
        id: 'picked_up',
        title: 'Goods Picked Up',
        description: leg1PickedUpActive || leg1PickupDone
            ? 'Goods collection from consignor facility completed.'
            : 'Awaiting goods collection from consignor pickup facility.',
        date: leg1PickedUpActive || leg1PickupDone
            ? findHistoryTimestamp(input.history, ['picked_up', 'picked up', 'collected'])
            : undefined,
        status: leg1PickedUpActive
            ? 'active'
            : leg1PickupDone
                ? 'completed'
                : 'pending',
    });

    // Step: Leg 1 Transit to Hub
    steps.push({
        id: 'leg-1-transit',
        title: `In Transit to ${hubLabel} (Leg 1)`,
        description: leg1TransitDone || leg1TransitActive
            ? `Goods in transit to ${hubLabel}.`
            : `Goods will be transported to ${hubLabel} by ${leg1DriverName || 'Leg 1 Driver'}.`,
        date: leg1TransitDone || leg1TransitActive
            ? findHistoryTimestamp(input.history, ['in_transit', 'leg 1 transit', 'in transit'])
            : undefined,
        status: leg1TransitActive
            ? 'active'
            : leg1TransitDone
                ? 'completed'
                : 'pending',
    });

    // Step: Handover at Hub
    const handoverReceiver = sanitizeTimelineText(input.handover?.driverToName) || leg2DriverName || 'Leg 2 Driver';
    const handoverDate = handoverAccepted
        ? findHistoryTimestamp(input.history, ['handover accepted', 'handover_accepted', 'otp verified'], input.handover?.acceptedAt || input.handover?.handoverAt)
        : handoverPending
            ? findHistoryTimestamp(input.history, ['handover initiated', 'at_hub', 'handover_pending'], input.handover?.handoverAt)
            : undefined;

    steps.push({
        id: 'handover',
        title: `Handover at ${hubLabel}`,
        description: handoverAccepted
            ? `Goods handed over to ${handoverReceiver} (OTP verified).`
            : handoverPending
                ? `Arrived at ${hubLabel}. Waiting for ${handoverReceiver} to verify OTP & accept cargo.`
                : `Goods will be handed over to ${handoverReceiver}.`,
        date: handoverDate,
        status: handoverPending
            ? 'active'
            : handoverAccepted
                ? 'completed'
                : 'pending',
    });

    // Final Delivery Leg Transit (Leg 2 or final leg N)
    const finalLegNumber = displayLegs.length;
    const finalLegDriver = sanitizeTimelineText(displayLegs[displayLegs.length - 1]?.driverName) || leg2DriverName || `Leg ${finalLegNumber} Driver`;
    steps.push({
        id: `leg-${finalLegNumber}-transit`,
        title: `In Transit to Delivery (Leg ${finalLegNumber})`,
        description: isDeliveredOrPod || leg2AtDelivery
            ? `Goods transported by ${finalLegDriver} to ${deliveryLabel}.`
            : leg2TransitActive
                ? (effectiveStatus === 'handover_accepted' || leg2Status === 'handover_accepted')
                    ? `Handover accepted by ${finalLegDriver}; preparing departure to ${deliveryLabel}.`
                    : `${finalLegDriver} is in transit to final destination (${deliveryLabel}).`
                : `Goods will be transported to the final destination (${deliveryLabel}).`,
        date: handoverAccepted
            ? findHistoryTimestamp(input.history, ['handover_accepted', 'leg 2', 'final delivery'])
            : undefined,
        status: leg2TransitActive
            ? 'active'
            : (leg2AtDelivery || isDeliveredOrPod)
                ? 'completed'
                : 'pending',
    });

    // Cargo Delivered
    steps.push({
        id: 'delivered',
        title: 'Cargo Delivered',
        description: leg2AtDelivery
            ? `${finalLegDriver} arrived at ${deliveryLabel}; awaiting Proof of Delivery (POD).`
            : 'Goods delivered to consignee and Proof of Delivery (POD) submitted by driver.',
        date: isDeliveredOrPod ? podUploadedDate : undefined,
        status: leg2AtDelivery
            ? 'active'
            : isDeliveredOrPod
                ? 'completed'
                : 'pending',
    });

    // Customer POD Approval
    steps.push({
        id: 'pod_approval',
        title: 'Customer POD Approval',
        description: isPodApproved
            ? 'Customer reviewed and approved Proof of Delivery (POD). Payment settled.'
            : 'Customer reviews and approves Proof of Delivery (POD), releasing payment and closing the shipment.',
        date: isPodApproved ? podApprovedDate : undefined,
        status: isPodApproved
            ? 'completed'
            : isDeliveredOrPod
                ? 'active'
                : 'pending',
    });

    if (isCancelled) {
        steps.push({
            id: 'cancelled',
            title: 'Shipment Cancelled',
            description: 'This shipment has been cancelled.',
            date: findHistoryTimestamp(input.history, ['cancelled', 'canceled']),
            status: 'exception',
            badgeText: 'Cancelled',
        });
    }

    return { steps, hasMultipleLegs: true, hubLabel };
}

