export type UnifiedTimelineStepStatus =
    | 'completed'
    | 'active'
    | 'pending'
    | 'exception'
    | 'awaiting_assignment';

export interface UnifiedTimelineStep {
    id: string;
    title: string;
    description: string;
    date?: string;
    status: UnifiedTimelineStepStatus;
    badgeText?: string;
    badgeColor?: 'success' | 'warning' | 'info' | 'danger' | 'neutral';
    driverName?: string;
    legReference?: string;
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
    podAcceptedAt?: string;
    podRejectedAt?: string;
    podRejectionReason?: string;
    podReplacementRequested?: boolean;
    podHistory?: Array<{
        version: number;
        file_url?: string;
        receiver_name?: string;
        uploaded_at?: string;
        uploaded_by_type?: string;
        status?: string;
        rejection_reason?: string;
        rejected_at?: string;
        accepted_at?: string;
        note?: string;
    }>;
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
    'awaiting assignment',
    'awaiting driver assignment',
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

    return 'Intermediate Hub';
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
    const rawPod = String(input.podStatus || '').toLowerCase().trim();
    const effectiveStatus = rawMilestone || 'confirmed';

    const isPodApproved =
        effectiveStatus === 'completed' ||
        effectiveStatus === 'pod_accepted' ||
        orderStatus === 'completed' ||
        ['confirmed', 'approved', 'accepted'].includes(rawPod);

    const isPodRejected =
        !isPodApproved && (rawPod === 'rejected' || Boolean(input.podReplacementRequested));

    const isDeliveredOrPod =
        isPodApproved ||
        isPodRejected ||
        ['delivered', 'pod_uploaded', 'pod_review'].includes(effectiveStatus);

    const isCancelled = effectiveStatus === 'cancelled' || orderStatus === 'cancelled';

    const confirmedDate = findHistoryTimestamp(input.history, ['confirmed', 'order confirmed', 'placed', 'booked'], input.createdAt);
    const podUploadedDate = findHistoryTimestamp(
        input.history,
        ['delivered', 'pod uploaded', 'proof of delivery'],
        isDeliveredOrPod ? input.podUploadedAt : undefined
    );
    const podApprovedDate = findHistoryTimestamp(
        input.history,
        ['completed', 'pod verified', 'pod accepted', 'escrow released'],
        isPodApproved ? (input.podAcceptedAt || input.podUploadedAt) : undefined
    );
    const podRejectedDate = findHistoryTimestamp(
        input.history,
        ['pod rejected', 'rejected', 'replacement requested'],
        isPodRejected ? (input.podRejectedAt || input.podUploadedAt) : undefined
    );

    // POD Review & Approval step helper (shared by single-driver and multi-driver)
    const buildPodReviewMilestone = (): UnifiedTimelineStep => {
        if (isPodApproved) {
            return {
                id: 'pod_approval',
                title: 'POD Review & Approval',
                description: 'Proof of Delivery verified and approved by customer. Escrow payout released to carrier.',
                date: podApprovedDate,
                status: 'completed',
                badgeText: 'Approved',
                badgeColor: 'success',
            };
        }

        if (isPodRejected) {
            return {
                id: 'pod_approval',
                title: 'POD Review & Approval',
                description: input.podRejectionReason
                    ? `Customer requested replacement POD: "${input.podRejectionReason}". Escrow payout paused.`
                    : 'Proof of Delivery rejected. Replacement requested from carrier. Escrow payout paused.',
                date: podRejectedDate,
                status: 'exception',
                badgeText: 'Replacement Requested',
                badgeColor: 'danger',
            };
        }

        const hasReplacementInHistory = Array.isArray(input.podHistory) && input.podHistory.length > 1;
        if (hasReplacementInHistory && isDeliveredOrPod) {
            return {
                id: 'pod_approval',
                title: 'POD Review & Approval',
                description: 'Replacement Proof of Delivery submitted by carrier. Awaiting customer verification.',
                date: podUploadedDate,
                status: 'active',
                badgeText: 'Replacement Under Review',
                badgeColor: 'warning',
            };
        }

        if (isDeliveredOrPod) {
            return {
                id: 'pod_approval',
                title: 'POD Review & Approval',
                description: 'Proof of Delivery received. Awaiting customer review to complete order and release escrow.',
                date: podUploadedDate,
                status: 'active',
                badgeText: 'Under Review',
                badgeColor: 'warning',
            };
        }

        return {
            id: 'pod_approval',
            title: 'POD Review & Approval',
            description: 'Customer reviews Proof of Delivery to verify cargo condition and release payment.',
            status: 'pending',
            badgeText: 'Pending',
            badgeColor: 'neutral',
        };
    };

    // ─── SINGLE DRIVER DIRECT SHIPMENT TIMELINE (6 Standard Milestones) ──────
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
            // 1. Order Confirmed
            {
                id: 'confirmed',
                title: 'Order Confirmed',
                description: 'The shipment order has been successfully created and confirmed by the customer.',
                date: confirmedDate,
                status: isPendingConfirmation ? 'active' : 'completed',
                badgeText: isPendingConfirmation ? 'In Progress' : 'Confirmed',
                badgeColor: isPendingConfirmation ? 'warning' : 'success',
            },
            // 2. Collection Driver Assigned
            {
                id: 'collection_assigned',
                title: 'Collection Driver Assigned',
                description: singleDriverName
                    ? `${singleDriverName} has been assigned to deliver the shipment from ${pickupLabel} to ${deliveryLabel}.`
                    : `Waiting for carrier to assign an available driver for ${pickupLabel} → ${deliveryLabel}.`,
                date: hasDriverOrPast
                    ? findHistoryTimestamp(input.history, ['driver_assigned', 'assigned', 'dispatched'], leg1?.assignedAt)
                    : undefined,
                status: isPendingConfirmation
                    ? 'pending'
                    : hasDriverOrPast
                        ? 'completed'
                        : 'awaiting_assignment',
                badgeText: hasDriverOrPast ? 'Assigned' : 'Awaiting Assignment',
                badgeColor: hasDriverOrPast ? 'success' : 'neutral',
                driverName: singleDriverName,
            },
            // 3. Goods Picked Up
            {
                id: 'picked_up',
                title: 'Goods Picked Up',
                description: passedPickup
                    ? `Cargo successfully collected from ${pickupLabel}${singleDriverName ? ' by ' + singleDriverName : ''}.`
                    : `Awaiting cargo collection from consignor pickup facility at ${pickupLabel}.`,
                date: passedPickup
                    ? findHistoryTimestamp(input.history, ['picked_up', 'picked up', 'collected'])
                    : undefined,
                status: isPickedUpMilestone
                    ? 'active'
                    : (isInTransitMilestone || isAtDeliveryMilestone || isDeliveredOrPod)
                        ? 'completed'
                        : 'pending',
                badgeText: passedPickup ? 'Collected' : isPickedUpMilestone ? 'In Progress' : 'Pending',
                badgeColor: passedPickup ? 'success' : isPickedUpMilestone ? 'warning' : 'neutral',
                driverName: singleDriverName,
            },
            // 4. In Transit to Final Destination
            {
                id: 'in_transit_delivery',
                title: 'In Transit to Final Destination',
                description: isAtDeliveryMilestone
                    ? `${singleDriverName || 'Driver'} arrived at destination facility (${deliveryLabel}).`
                    : isInTransitMilestone
                        ? `${singleDriverName || 'Driver'} is in transit to destination (${deliveryLabel}).`
                        : `Cargo will be transported directly to ${deliveryLabel} following collection.`,
                date: passedTransit || isInTransitMilestone
                    ? findHistoryTimestamp(input.history, ['in_transit', 'en route', 'transit'])
                    : undefined,
                status: isInTransitMilestone
                    ? 'active'
                    : passedTransit
                        ? 'completed'
                        : 'pending',
                badgeText: passedTransit ? 'Completed' : isInTransitMilestone ? 'In Transit' : 'Pending',
                badgeColor: passedTransit ? 'success' : isInTransitMilestone ? 'warning' : 'neutral',
                driverName: singleDriverName,
            },
            // 5. Delivered & POD Submitted
            {
                id: 'delivered',
                title: 'Delivered & POD Submitted',
                description: isAtDeliveryMilestone
                    ? `${singleDriverName || 'Driver'} arrived at ${deliveryLabel}; unloading cargo and obtaining consignee signature.`
                    : isDeliveredOrPod
                        ? 'Goods delivered to consignee and signed Proof of Delivery (POD) submitted by driver.'
                        : 'Delivery note and recipient signature will be collected upon arrival at destination.',
                date: isDeliveredOrPod ? podUploadedDate : undefined,
                status: isAtDeliveryMilestone
                    ? 'active'
                    : isDeliveredOrPod
                        ? 'completed'
                        : 'pending',
                badgeText: isDeliveredOrPod ? 'Delivered' : isAtDeliveryMilestone ? 'Arrived' : 'Pending',
                badgeColor: isDeliveredOrPod ? 'success' : isAtDeliveryMilestone ? 'warning' : 'neutral',
                driverName: singleDriverName,
            },
            // 6. POD Review & Approval
            buildPodReviewMilestone(),
        ];

        if (isCancelled) {
            steps.push({
                id: 'cancelled',
                title: 'Shipment Cancelled',
                description: 'This shipment has been cancelled.',
                date: findHistoryTimestamp(input.history, ['cancelled', 'canceled']),
                status: 'exception',
                badgeText: 'Cancelled',
                badgeColor: 'danger',
            });
        }

        return { steps, hasMultipleLegs: false, hubLabel };
    }

    // ─── MULTI-DRIVER RELAY TIMELINE (9 Standard Milestones) ───────────────────
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

    const leg1AssignedDate = findHistoryTimestamp(
        input.history,
        ['leg 1', 'collection driver', 'driver_assigned', 'assigned'],
        leg1?.assignedAt
    );
    const leg2AssignedDate = findHistoryTimestamp(
        input.history,
        ['leg 2', 'delivery driver', 'relay', 'partner'],
        leg2?.assignedAt
    );
    const handoverReceiver = sanitizeTimelineText(input.handover?.driverToName) || leg2DriverName || 'Delivery Driver';
    const handoverDate = handoverAccepted
        ? findHistoryTimestamp(input.history, ['handover accepted', 'handover_accepted', 'otp verified'], input.handover?.acceptedAt || input.handover?.handoverAt)
        : handoverPending
            ? findHistoryTimestamp(input.history, ['handover initiated', 'at_hub', 'handover_pending'], input.handover?.handoverAt)
            : undefined;

    const steps: UnifiedTimelineStep[] = [
        // 1. Order Confirmed
        {
            id: 'confirmed',
            title: 'Order Confirmed',
            description: 'The shipment order has been successfully created and confirmed by the customer.',
            date: confirmedDate,
            status: 'completed',
            badgeText: 'Confirmed',
            badgeColor: 'success',
        },
        // 2. Collection Driver Assigned
        {
            id: 'collection_assigned',
            title: 'Collection Driver Assigned',
            description: leg1DriverName
                ? `${leg1DriverName} has been assigned to collect the shipment from ${pickupLabel} to ${hubLabel}.`
                : `Waiting for carrier to assign an available collection driver for ${pickupLabel} → ${hubLabel}.`,
            date: leg1AssignedDate,
            status: leg1DriverName ? 'completed' : 'awaiting_assignment',
            badgeText: leg1DriverName ? 'Assigned' : 'Awaiting Assignment',
            badgeColor: leg1DriverName ? 'success' : 'neutral',
            driverName: leg1DriverName,
        },
        // 3. Delivery Driver Assigned
        {
            id: 'delivery_assigned',
            title: 'Delivery Driver Assigned',
            description: leg2DriverName
                ? `${leg2DriverName} has been scheduled to deliver the shipment from ${hubLabel} to ${deliveryLabel}. (Activates after handover)`
                : `Awaiting driver assignment for the final delivery from ${hubLabel} to ${deliveryLabel}.`,
            date: leg2AssignedDate,
            status: leg2DriverName ? 'completed' : 'awaiting_assignment',
            badgeText: leg2DriverName ? 'Assigned' : 'Awaiting Assignment',
            badgeColor: leg2DriverName ? 'success' : 'neutral',
            driverName: leg2DriverName,
        },
        // 4. Goods Picked Up
        {
            id: 'picked_up',
            title: 'Goods Picked Up',
            description: leg1PickupDone
                ? `Cargo successfully collected from ${pickupLabel}${leg1DriverName ? ' by ' + leg1DriverName : ''}.`
                : leg1PickedUpActive
                    ? `${leg1DriverName || 'Collection Driver'} arrived at pickup facility (${pickupLabel}); cargo loading in progress.`
                    : `Awaiting cargo collection from consignor pickup facility (${pickupLabel}).`,
            date: leg1PickedUpActive || leg1PickupDone
                ? findHistoryTimestamp(input.history, ['picked_up', 'picked up', 'collected'])
                : undefined,
            status: leg1PickedUpActive
                ? 'active'
                : leg1PickupDone
                    ? 'completed'
                    : 'pending',
            badgeText: leg1PickupDone ? 'Collected' : leg1PickedUpActive ? 'In Progress' : 'Pending',
            badgeColor: leg1PickupDone ? 'success' : leg1PickedUpActive ? 'warning' : 'neutral',
            driverName: leg1DriverName,
        },
        // 5. In Transit to Intermediate Hub
        {
            id: 'in_transit_hub',
            title: 'In Transit to Intermediate Hub',
            description: leg1TransitDone
                ? `Cargo transported to ${hubLabel}${leg1DriverName ? ' by ' + leg1DriverName : ''}.`
                : leg1TransitActive
                    ? `${leg1DriverName || 'Collection Driver'} is transporting cargo to ${hubLabel}.`
                    : `Cargo will be transported to ${hubLabel} following pickup.`,
            date: leg1TransitDone || leg1TransitActive
                ? findHistoryTimestamp(input.history, ['in_transit', 'leg 1 transit', 'in transit'])
                : undefined,
            status: leg1TransitActive
                ? 'active'
                : leg1TransitDone
                    ? 'completed'
                    : 'pending',
            badgeText: leg1TransitDone ? 'Arrived at Hub' : leg1TransitActive ? 'In Transit' : 'Pending',
            badgeColor: leg1TransitDone ? 'success' : leg1TransitActive ? 'warning' : 'neutral',
            driverName: leg1DriverName,
        },
        // 6. Handover at Intermediate Hub
        {
            id: 'handover_hub',
            title: 'Handover at Intermediate Hub',
            description: handoverAccepted
                ? `Cargo successfully handed over at ${hubLabel} to ${handoverReceiver} (OTP verified).`
                : handoverPending
                    ? `Arrived at ${hubLabel}. Waiting for ${handoverReceiver} to verify OTP and accept cargo.`
                    : `Cargo will be transferred to ${handoverReceiver} at ${hubLabel} via secure OTP.`,
            date: handoverDate,
            status: handoverPending
                ? 'active'
                : handoverAccepted
                    ? 'completed'
                    : 'pending',
            badgeText: handoverAccepted ? 'Handover Complete' : handoverPending ? 'Awaiting OTP' : 'Pending',
            badgeColor: handoverAccepted ? 'success' : handoverPending ? 'warning' : 'neutral',
            driverName: handoverReceiver,
        },
        // 7. In Transit to Final Destination
        {
            id: 'in_transit_delivery',
            title: 'In Transit to Final Destination',
            description: isDeliveredOrPod || leg2AtDelivery
                ? `Cargo transported by ${leg2DriverName || 'Delivery Driver'} to ${deliveryLabel}.`
                : leg2TransitActive
                    ? (effectiveStatus === 'handover_accepted' || leg2Status === 'handover_accepted')
                        ? `Handover accepted by ${leg2DriverName || 'Delivery Driver'}; preparing departure to ${deliveryLabel}.`
                        : `${leg2DriverName || 'Delivery Driver'} is in transit to final destination (${deliveryLabel}).`
                    : `Cargo will be dispatched to ${deliveryLabel} following hub handover.`,
            date: handoverAccepted
                ? findHistoryTimestamp(input.history, ['handover_accepted', 'leg 2', 'final delivery', 'in_transit'])
                : undefined,
            status: leg2TransitActive
                ? 'active'
                : (leg2AtDelivery || isDeliveredOrPod)
                    ? 'completed'
                    : 'pending',
            badgeText: (leg2AtDelivery || isDeliveredOrPod) ? 'Completed' : leg2TransitActive ? 'In Transit' : 'Pending',
            badgeColor: (leg2AtDelivery || isDeliveredOrPod) ? 'success' : leg2TransitActive ? 'warning' : 'neutral',
            driverName: leg2DriverName,
        },
        // 8. Delivered & POD Submitted
        {
            id: 'delivered',
            title: 'Delivered & POD Submitted',
            description: leg2AtDelivery
                ? `${leg2DriverName || 'Delivery Driver'} arrived at ${deliveryLabel}; unloading cargo and obtaining consignee signature.`
                : isDeliveredOrPod
                    ? `Goods delivered to consignee at ${deliveryLabel} and signed Proof of Delivery (POD) submitted.`
                    : `Delivery note and consignee signature will be collected upon arrival at ${deliveryLabel}.`,
            date: isDeliveredOrPod ? podUploadedDate : undefined,
            status: leg2AtDelivery
                ? 'active'
                : isDeliveredOrPod
                    ? 'completed'
                    : 'pending',
            badgeText: isDeliveredOrPod ? 'Delivered' : leg2AtDelivery ? 'Arrived' : 'Pending',
            badgeColor: isDeliveredOrPod ? 'success' : leg2AtDelivery ? 'warning' : 'neutral',
            driverName: leg2DriverName,
        },
        // 9. POD Review & Approval
        buildPodReviewMilestone(),
    ];

    if (isCancelled) {
        steps.push({
            id: 'cancelled',
            title: 'Shipment Cancelled',
            description: 'This shipment has been cancelled.',
            date: findHistoryTimestamp(input.history, ['cancelled', 'canceled']),
            status: 'exception',
            badgeText: 'Cancelled',
            badgeColor: 'danger',
        });
    }

    return { steps, hasMultipleLegs: true, hubLabel };
}
