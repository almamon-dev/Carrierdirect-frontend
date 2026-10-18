import { NormalizedSupplierOrder } from './supplierOrderTrackUtils';

export const buildSupplierOrderTimeline = (
    isPodAccepted: boolean,
    order?: NormalizedSupplierOrder
) => {
    const rawStatus = (order?.rawStatus || order?.status || 'confirmed').toLowerCase().trim();
    const s = rawStatus.replace(/_/g, ' ');
    const baseDate = new Date();

    const formatDate = (d: Date, hoursOffset = 0, minsOffset = 0) => {
        const target = new Date(d.getTime() + (hoursOffset * 60 + minsOffset) * 60 * 1000);
        return target.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const fromCity = order?.from || 'Origin';
    const toCity = order?.to || 'Destination';

    const hasRealDriver = Boolean(
        order?.driver?.name &&
        order.driver.name !== 'Unassigned' &&
        order.driver.name !== 'Assigned Driver' &&
        order.driver.name !== 'Assigned Fleet Driver'
    );

    let currentStep = 1;
    let isDelivered = false;

    if (s === 'completed' || s === 'pod accepted' || isPodAccepted || s === 'delivered' || s === 'pod uploaded' || s === 'pod review') {
        currentStep = 4;
        isDelivered = true;
    } else if (s === 'in transit' || s === 'on the way' || s === 'arrived' || s === 'out for delivery') {
        currentStep = 3;
    } else if (s === 'picked up' || s === 'cargo loaded' || s === 'goods picked up' || s === 'in progress') {
        currentStep = 2;
    } else {
        currentStep = 1;
    }

    return [
        {
            id: 1,
            status: 'Assigned',
            time: formatDate(baseDate, -8, 30),
            completed: currentStep > 1 || isDelivered,
            active: currentStep === 1 && !isDelivered,
            location: hasRealDriver ? `${order?.driver?.name} assigned (${order?.vehicle?.number || 'Fleet Vehicle'})` : 'Driver assigned for dispatch'
        },
        {
            id: 2,
            status: 'Pickup',
            time: (currentStep > 2 || isDelivered) ? formatDate(baseDate, -4, 0) : (currentStep === 2 ? 'In Progress' : 'Pending'),
            completed: currentStep > 2 || isDelivered,
            active: currentStep === 2 && !isDelivered,
            location: `Pickup facility: ${order?.pickupFullAddress || fromCity}`
        },
        {
            id: 3,
            status: 'In Transit',
            time: (currentStep > 3 || isDelivered) ? formatDate(baseDate, -1, 15) : (currentStep === 3 ? 'Live' : 'Pending'),
            completed: currentStep > 3 || isDelivered,
            active: currentStep === 3 && !isDelivered,
            location: `Corridor: ${fromCity} ➔ ${toCity}`
        },
        {
            id: 4,
            status: 'Delivered',
            time: isDelivered ? formatDate(baseDate, 0, 0) : 'Pending',
            completed: isDelivered,
            active: currentStep === 4 && !isDelivered,
            location: isDelivered ? 'Proof of delivery verified and order delivered' : `${order?.deliveryFullAddress || toCity}`
        },
    ];
};

export default buildSupplierOrderTimeline;
