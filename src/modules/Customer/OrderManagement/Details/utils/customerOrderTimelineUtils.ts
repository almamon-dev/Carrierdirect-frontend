import { NormalizedCustomerOrder, TimelineItem } from '../types/orderDetail.types';

export const buildCustomerOrderTimeline = (order: NormalizedCustomerOrder): TimelineItem[] => {
    const rawStatus = order.rawStatus;
    const isPodAccepted = order.pod.isAccepted;
    const baseDate = new Date();

    const formatDate = (hoursOffset = 0, minsOffset = 0) => {
        const target = new Date(baseDate.getTime() + (hoursOffset * 60 + minsOffset) * 60 * 1000);
        return target.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    let currentStep = 2;

    if (rawStatus === 'pending') {
        currentStep = 1;
    } else if (rawStatus === 'confirmed' || rawStatus === 'scheduled' || rawStatus === 'new') {
        currentStep = order.driver ? 3 : 2;
    } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'dispatched') {
        currentStep = 3;
    } else if (rawStatus === 'picked_up' || rawStatus === 'in_progress') {
        currentStep = 4;
    } else if (rawStatus === 'in_transit' || rawStatus === 'on_the_way') {
        currentStep = 4;
    } else if (rawStatus === 'arrived' || rawStatus === 'destination_reached') {
        currentStep = 5;
    } else if (rawStatus === 'delivered' || rawStatus === 'pod_uploaded' || rawStatus === 'pod_review') {
        currentStep = isPodAccepted ? 8 : 6;
    } else if (rawStatus === 'completed' || rawStatus === 'pod_accepted' || isPodAccepted) {
        currentStep = 8;
    }

    const isAllCompleted = currentStep >= 8;

    return [
        {
            id: 1,
            status: 'Order Confirmed & Booked',
            time: formatDate(-12, 0),
            completed: currentStep > 1 || isAllCompleted,
            active: currentStep === 1,
            location: `${order.pickup.city} Logistics Registry`,
            description: 'Quotation accepted and carrier booking confirmed in Escrow.',
        },
        {
            id: 2,
            status: order.driver ? 'Driver & Fleet Assigned' : 'Driver Assignment',
            time: (currentStep > 2 || isAllCompleted) ? formatDate(-8, 30) : (currentStep === 2 ? 'In Progress' : 'Pending Carrier'),
            completed: currentStep > 2 || isAllCompleted,
            active: currentStep === 2,
            location: order.driver ? `${order.driver.name} (${order.vehicle.number})` : '',
            description: order.driver ? `Assigned driver ${order.driver.name} with vehicle plate ${order.vehicle.number}` : '',
        },
        {
            id: 3,
            status: 'Goods Picked Up',
            time: (currentStep > 3 || isAllCompleted) ? formatDate(-4, 0) : (currentStep === 3 ? 'In Progress' : 'Scheduled Date'),
            completed: currentStep > 3 || isAllCompleted,
            active: currentStep === 3,
            location: order.pickup.address,
            description: 'Cargo verified, secured, and departed pickup facility.',
        },
        {
            id: 4,
            status: 'In Transit on Route',
            time: (currentStep > 4 || isAllCompleted) ? formatDate(-1, 15) : (currentStep === 4 ? 'Live GPS Tracking' : 'Estimated En Route'),
            completed: currentStep > 4 || isAllCompleted,
            active: currentStep === 4,
            location: `Highway Route: ${order.pickup.city} ➔ ${order.delivery.city}`,
            description: 'Live GPS tracked on designated corridor.',
        },
        {
            id: 5,
            status: 'Arrived at Destination',
            time: (currentStep > 5 || isAllCompleted) ? formatDate(0, 0) : (currentStep === 5 ? 'Arrived' : order.estArrival),
            completed: currentStep > 5 || isAllCompleted,
            active: currentStep === 5,
            location: order.delivery.address,
            description: 'Vehicle arrived at recipient unloading dock.',
        },
        {
            id: 6,
            status: isPodAccepted || isAllCompleted ? 'POD Verified & Approved' : 'Review & Accept POD',
            time: (isPodAccepted || isAllCompleted) ? formatDate(0, 45) : (currentStep === 6 ? 'Action Required' : 'Awaiting Delivery'),
            completed: isPodAccepted || isAllCompleted,
            active: currentStep === 6 && !isPodAccepted,
            location: 'Customer Verification',
            description: (isPodAccepted || isAllCompleted)
                ? 'Proof of delivery verified and Escrow payment settled.'
                : 'Signed delivery receipt uploaded by driver for customer approval.',
        },
        {
            id: 7,
            status: 'Order Completed',
            time: (isPodAccepted || isAllCompleted) ? formatDate(1, 0) : 'Pending Final POD',
            completed: isPodAccepted || isAllCompleted,
            active: false,
            location: 'Settled & Closed',
            description: 'Freight lifecycle successfully concluded.',
        },
    ];
};

export default buildCustomerOrderTimeline;
