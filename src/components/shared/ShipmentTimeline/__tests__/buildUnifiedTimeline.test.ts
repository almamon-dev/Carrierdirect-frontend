import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildUnifiedShipmentTimeline,
    sanitizeTimelineText,
} from '../buildUnifiedTimeline';

test('single driver unassigned confirmed order stops at Driver Assigned active', () => {
    const res = buildUnifiedShipmentTimeline({
        status: 'confirmed',
        isRelay: false,
        pickupCity: 'Dhaka',
        deliveryCity: 'Chittagong',
    });

    assert.equal(res.hasMultipleLegs, false);
    assert.equal(res.steps.length, 6);
    assert.deepEqual(
        res.steps.map((s) => [s.id, s.status]),
        [
            ['confirmed', 'completed'],
            ['assigned', 'active'],
            ['picked_up', 'pending'],
            ['in_transit', 'pending'],
            ['delivered', 'pending'],
            ['pod_approval', 'pending'],
        ]
    );
});

test('single driver assigned shows driver name and keeps physical steps pending without fake dates', () => {
    const res = buildUnifiedShipmentTimeline({
        status: 'driver_assigned',
        rawMilestoneStatus: 'driver_assigned',
        isRelay: false,
        driverName: 'Kamal Hossain',
        pickupCity: 'Dhaka',
        deliveryCity: 'Sylhet',
    });

    assert.equal(res.hasMultipleLegs, false);
    assert.equal(res.steps[1].title, 'Kamal Hossain Assigned');
    assert.equal(res.steps[1].status, 'completed');
    assert.equal(res.steps[2].status, 'pending');
    assert.equal(res.steps[0].date, undefined);
    assert.equal(res.steps[1].date, undefined);
});

test('single driver progression through picked_up, in_transit, at_delivery, delivered, and completed', () => {
    const pickedUp = buildUnifiedShipmentTimeline({
        status: 'picked_up',
        isRelay: false,
        driverName: 'Kamal Hossain',
    });
    assert.equal(pickedUp.steps.find((s) => s.id === 'picked_up')?.status, 'active');
    assert.equal(pickedUp.steps.find((s) => s.id === 'in_transit')?.status, 'pending');

    const inTransit = buildUnifiedShipmentTimeline({
        status: 'in_transit',
        isRelay: false,
        driverName: 'Kamal Hossain',
    });
    assert.equal(inTransit.steps.find((s) => s.id === 'picked_up')?.status, 'completed');
    assert.equal(inTransit.steps.find((s) => s.id === 'in_transit')?.status, 'active');

    const atDelivery = buildUnifiedShipmentTimeline({
        status: 'in_transit',
        rawMilestoneStatus: 'at_delivery',
        isRelay: false,
        driverName: 'Kamal Hossain',
    });
    assert.equal(atDelivery.steps.find((s) => s.id === 'in_transit')?.status, 'completed');
    assert.equal(atDelivery.steps.find((s) => s.id === 'delivered')?.status, 'active');

    const delivered = buildUnifiedShipmentTimeline({
        status: 'delivered',
        isRelay: false,
        driverName: 'Kamal Hossain',
    });
    assert.equal(delivered.steps.find((s) => s.id === 'delivered')?.status, 'completed');
    assert.equal(delivered.steps.find((s) => s.id === 'pod_approval')?.status, 'active');

    const completed = buildUnifiedShipmentTimeline({
        status: 'completed',
        podStatus: 'confirmed',
        isRelay: false,
        driverName: 'Kamal Hossain',
    });
    assert.ok(completed.steps.every((s) => s.status === 'completed'));
});

test('multi-driver puts Leg 1 and Leg 2 assignments upfront, normalizes Cumilla, and blocks premature handover', () => {
    const res = buildUnifiedShipmentTimeline({
        status: 'driver_assigned',
        rawMilestoneStatus: 'driver_assigned',
        isRelay: true,
        currentActiveLeg: 1,
        pickupCity: 'Dhaka',
        deliveryCity: 'Chittagong',
        // Simulate stale handover object if passed while Leg 1 is still assigned
        handover: {
            status: 'accepted',
            hubLocation: 'cummila',
            acceptedAt: '2026-11-12T17:11:00Z',
        },
        legs: [
            {
                legNumber: 1,
                legType: 'pickup',
                driverName: 'Aidan Moroney',
                journeyLeg: 'Dhaka → cummila',
                status: 'assigned',
                assignedAt: '2026-11-14T12:04:00Z',
            },
            {
                legNumber: 2,
                legType: 'delivery',
                driverName: 'Laudantium quidem d',
                journeyLeg: 'cummila → Chittagong',
                status: 'assigned',
                assignedAt: '2026-11-14T12:04:00Z',
            },
        ],
    });

    assert.equal(res.hasMultipleLegs, true);
    assert.equal(res.hubLabel, 'Cumilla');
    assert.equal(res.steps.length, 9);

    // Positions 1, 2, 3 must be Order Confirmed -> Leg 1 Assigned -> Leg 2 Assigned
    assert.equal(res.steps[0].id, 'confirmed');
    assert.equal(res.steps[1].title, 'Aidan Moroney Assigned (Leg 1)');
    assert.equal(res.steps[2].title, 'Laudantium quidem d Assigned (Leg 2)');
    assert.match(res.steps[2].description, /Cumilla → Chittagong/);
    assert.equal(res.steps[2].status, 'completed');

    // Handover must NOT appear completed before Leg 1 reaches hub
    const handoverStep = res.steps.find((s) => s.id === 'handover');
    assert.ok(handoverStep);
    assert.equal(handoverStep.title, 'Handover at Cumilla');
    assert.equal(handoverStep.status, 'pending');
    assert.equal(handoverStep.date, undefined);
});

test('multi-driver progresses cleanly across picked_up, in_transit, handover_pending, leg 2 transit, delivered, completed', () => {
    const baseLegs = [
        { legNumber: 1, driverName: 'Driver One', journeyLeg: 'Dhaka → Cumilla', status: 'picked_up' },
        { legNumber: 2, driverName: 'Driver Two', journeyLeg: 'Cumilla → Chittagong', status: 'assigned' },
    ];

    const pickedUp = buildUnifiedShipmentTimeline({
        status: 'picked_up',
        isRelay: true,
        currentActiveLeg: 1,
        legs: baseLegs,
    });
    assert.equal(pickedUp.steps.find((s) => s.id === 'picked_up')?.status, 'active');
    assert.equal(pickedUp.steps.find((s) => s.id === 'handover')?.status, 'pending');

    const handoverPending = buildUnifiedShipmentTimeline({
        status: 'in_transit',
        rawMilestoneStatus: 'handover_pending',
        isRelay: true,
        currentActiveLeg: 1,
        handover: {
            status: 'pending_acceptance',
            hubLocation: 'Cumilla',
            driverToName: 'Driver Two',
            handoverAt: '2026-11-14T15:00:00Z',
        },
        legs: [
            { legNumber: 1, driverName: 'Driver One', journeyLeg: 'Dhaka → Cumilla', status: 'handover_pending' },
            { legNumber: 2, driverName: 'Driver Two', journeyLeg: 'Cumilla → Chittagong', status: 'assigned' },
        ],
    });
    assert.equal(handoverPending.steps.find((s) => s.id === 'leg-1-transit')?.status, 'completed');
    assert.equal(handoverPending.steps.find((s) => s.id === 'handover')?.status, 'active');
    assert.equal(handoverPending.steps.find((s) => s.id === 'leg-2-transit')?.status, 'pending');

    const leg2Transit = buildUnifiedShipmentTimeline({
        status: 'in_transit',
        rawMilestoneStatus: 'in_transit',
        isRelay: true,
        currentActiveLeg: 2,
        handover: {
            status: 'accepted',
            hubLocation: 'Cumilla',
            driverToName: 'Driver Two',
            acceptedAt: '2026-11-14T16:10:00Z',
        },
        legs: [
            { legNumber: 1, driverName: 'Driver One', journeyLeg: 'Dhaka → Cumilla', status: 'completed' },
            { legNumber: 2, driverName: 'Driver Two', journeyLeg: 'Cumilla → Chittagong', status: 'in_transit' },
        ],
    });
    assert.equal(leg2Transit.steps.find((s) => s.id === 'handover')?.status, 'completed');
    assert.ok(leg2Transit.steps.find((s) => s.id === 'handover')?.date);
    assert.equal(leg2Transit.steps.find((s) => s.id === 'leg-2-transit')?.status, 'active');

    const podApproved = buildUnifiedShipmentTimeline({
        status: 'completed',
        podStatus: 'confirmed',
        isRelay: true,
        currentActiveLeg: 2,
        legs: [
            { legNumber: 1, driverName: 'Driver One', journeyLeg: 'Dhaka → Cumilla', status: 'completed' },
            { legNumber: 2, driverName: 'Driver Two', journeyLeg: 'Cumilla → Chittagong', status: 'delivered' },
        ],
    });
    assert.ok(podApproved.steps.every((s) => s.status === 'completed'));
});

test('sanitizeTimelineText filters placeholders and normalizes Cumilla spelling', () => {
    assert.equal(sanitizeTimelineText('Not Assigned'), '');
    assert.equal(sanitizeTimelineText('Unassigned'), '');
    assert.equal(sanitizeTimelineText('N/A'), '');
    assert.equal(sanitizeTimelineText('Dhaka → cummila'), 'Dhaka → Cumilla');
});
