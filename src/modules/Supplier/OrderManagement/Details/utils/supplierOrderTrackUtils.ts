export interface NormalizedSupplierOrder {
    id: string;
    rawId: number | string;
    orderNumber: string;
    from: string;
    to: string;
    pickupFullAddress: string;
    deliveryFullAddress: string;
    status: string;
    rawStatus: string;
    pickupDate: string;
    deliveryDate: string;
    estArrival: string;
    estimatedTime: string;
    vehicle: {
        type: string;
        number: string;
        capacity: string;
        goodsType: string;
    };
    driver: {
        id?: number | string;
        name: string;
        phone: string;
        email: string;
    };
    customer: {
        id?: number | string;
        name: string;
        companyName: string;
        avatar?: string;
        verified: boolean;
        rating: number;
        reviews: number;
        active: string;
        memberSince: string;
        completedOrders: number;
    };
    pricing: {
        base: number;
        total: number;
        netPayout: number;
        paymentStatus: string;
        paymentStatusLabel: string;
        isPaid: boolean;
        isPayLater: boolean;
        isEscrow: boolean;
        escrowGuaranteed: boolean;
    };
    payment: {
        status: string;
        isPaid: boolean;
        isPayLater: boolean;
        isEscrow: boolean;
        escrowGuaranteed: boolean;
    };
    podUploaded: boolean;
    podStatus: string;
    podFileUrl: string;
    instructions?: string;
}

export const buildSupplierOrderDetails = (
    id: string | undefined,
    foundOrder: any,
    isPodAccepted: boolean,
    statusOverride?: string,
    assignedDriver?: { name: string; phone: string; email?: string; plate: string } | null
): NormalizedSupplierOrder => {
    const rawId = foundOrder?.id || id || '1';
    const cleanNum = String(rawId).replace(/^ORD-0*/i, '') || '1';
    const formattedId = `ORD-${cleanNum.padStart(4, '0')}`;

    const rawStatus = (statusOverride || foundOrder?.status_raw || foundOrder?.raw_status || foundOrder?.status || 'confirmed').toLowerCase().trim();
    const s = rawStatus.replace(/_/g, ' ');
    
    let displayStatus = 'Confirmed';
    if (s === 'completed' || s === 'pod accepted' || isPodAccepted) {
        displayStatus = 'Completed';
    } else if (s.includes('cancel')) {
        displayStatus = 'Cancelled';
    } else if (s.includes('review') || s.includes('pod uploaded') || s === 'delivered') {
        displayStatus = 'POD Review';
    } else if (s === 'arrived' || s === 'destination reached') {
        displayStatus = 'Arrived';
    } else if (s === 'in transit' || s === 'on the way' || s === 'in progress') {
        displayStatus = 'In Transit';
    } else if (s === 'picked up' || s === 'goods picked up' || s === 'cargo loaded') {
        displayStatus = 'Picked Up';
    } else if (s === 'driver assigned' || s === 'assigned' || s === 'dispatched') {
        displayStatus = 'Driver Assigned';
    } else if (s === 'confirmed' || s === 'scheduled' || s === 'order confirmed') {
        displayStatus = 'Confirmed';
    } else if (s === 'pending') {
        displayStatus = 'Pending';
    } else {
        displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
    }

    // Payment Status Normalization (Detect Pay Later vs Paid vs In Escrow)
    const rawPayment = String(
        foundOrder?.payment_status || 
        foundOrder?.paymentStatus || 
        foundOrder?.payment?.status || 
        foundOrder?.payment?.payment_status || 
        foundOrder?.invoice?.status ||
        foundOrder?.invoice_type ||
        foundOrder?.payment_method || 
        (cleanNum === '2' ? 'pay_later' : cleanNum === '3' ? 'paid' : 'in_escrow')
    ).toLowerCase().trim();

    const isPaid = (rawStatus === 'completed') || 
        rawPayment === 'paid' || 
        foundOrder?.payment?.is_paid === true || 
        foundOrder?.is_paid === true;

    const isPayLater = !isPaid && (
        rawPayment.includes('pay later') || 
        rawPayment.includes('pay_later') || 
        rawPayment.includes('net-30') || 
        rawPayment.includes('credit') ||
        Boolean(foundOrder?.is_pay_later) ||
        Boolean(foundOrder?.payment?.is_pay_later) ||
        String(foundOrder?.invoice_type || '').toLowerCase() === 'pay_later' ||
        String(foundOrder?.payment_option || '').toLowerCase() === 'pay_later' ||
        String(foundOrder?.invoice?.invoice_type || '').toLowerCase() === 'pay_later'
    );

    const isEscrow = !isPaid && !isPayLater;

    let paymentStatus = 'In Escrow';
    let paymentStatusLabel = 'In Escrow';

    if (isPaid) {
        paymentStatus = 'Paid';
        paymentStatusLabel = 'Paid';
    } else if (isPayLater) {
        paymentStatus = 'Pay Later (Net-30)';
        paymentStatusLabel = 'Pay Later (Net-30)';
    } else if (rawStatus === 'delivered' || rawStatus === 'pod_uploaded') {
        paymentStatus = 'POD Under Review';
        paymentStatusLabel = 'POD Under Review';
    } else {
        paymentStatus = 'In Escrow';
        paymentStatusLabel = 'In Escrow';
    }

    const pickupFullAddress = foundOrder?.shipping?.from ||
        foundOrder?.pickup_address ||
        foundOrder?.pickupFullAddress ||
        'Unit 4, Heathrow Cargo Terminal, London, UK';

    const deliveryFullAddress = foundOrder?.shipping?.to ||
        foundOrder?.delivery_address ||
        foundOrder?.deliveryFullAddress ||
        'Trafford Park Industrial Estate, Manchester, UK';

    const fromCity = foundOrder?.pickup_city ||
        (pickupFullAddress ? pickupFullAddress.split(',')[0]?.trim() : '') ||
        'London';

    const toCity = foundOrder?.delivery_city ||
        (deliveryFullAddress ? deliveryFullAddress.split(',')[0]?.trim() : '') ||
        'Manchester';

    const totalAmount = Number(
        foundOrder?.payout_amount ??
        foundOrder?.payment?.payout_amount ??
        foundOrder?.payment?.total ??
        foundOrder?.amount_raw ??
        foundOrder?.total_amount ??
        foundOrder?.amount ??
        2500
    );

    const netPayout = totalAmount;

    // Customer profile (Privacy safe - no unmasked personal phone/email)
    const customerName = foundOrder?.client?.name ||
        foundOrder?.client?.company_name ||
        foundOrder?.customer?.name ||
        foundOrder?.customer?.company_name ||
        foundOrder?.customer_name ||
        (typeof foundOrder?.customer === 'string' ? foundOrder.customer : 'Premier Logistics Ltd');

    const customerRating = Number(foundOrder?.client?.rating || foundOrder?.customer?.rating || 4.9);
    const customerReviews = Number(foundOrder?.client?.reviews || foundOrder?.customer?.reviews || 128);

    const vehicleType = foundOrder?.shipping?.service ||
        foundOrder?.vehicle?.type ||
        foundOrder?.vehicle_type ||
        foundOrder?.truck_type ||
        (typeof foundOrder?.vehicle === 'string' ? foundOrder.vehicle : 'Covered Van (20ft)');

    const cargoWeight = foundOrder?.shipment?.total_weight ||
        foundOrder?.weight ||
        foundOrder?.cargo_weight ||
        '1,500 kg';

    const loadType = foundOrder?.shipment?.description ||
        foundOrder?.pallet_type ||
        foundOrder?.load_type ||
        foundOrder?.type_of_pallets ||
        'Standard Euro Pallets (x4)';

    let driverName = 'Unassigned';
    if (assignedDriver?.name) {
        driverName = assignedDriver.name;
    } else if (foundOrder?.driver_name && foundOrder.driver_name !== 'Unassigned') {
        driverName = foundOrder.driver_name;
    } else if (foundOrder?.driver?.name && foundOrder.driver.name !== 'Unassigned') {
        driverName = foundOrder.driver.name;
    } else if (typeof foundOrder?.driver === 'string' && foundOrder.driver && foundOrder.driver !== 'Unassigned') {
        driverName = foundOrder.driver;
    }

    const driverPhone = assignedDriver?.phone ||
        foundOrder?.driverPhone ||
        foundOrder?.driver_phone ||
        foundOrder?.driver?.phone ||
        '';

    const driverEmail = assignedDriver?.email ||
        foundOrder?.driverEmail ||
        foundOrder?.driver_email ||
        foundOrder?.driver?.email ||
        '';

    const vehiclePlate = assignedDriver?.plate ||
        foundOrder?.vehiclePlate ||
        foundOrder?.vehicle_plate ||
        foundOrder?.driver?.vehicle_plate ||
        foundOrder?.vehicle?.number ||
        'GB-24-TRK';

    const pickupDateStr = foundOrder?.shipping?.pickup_at ||
        foundOrder?.pickup_date ||
        foundOrder?.pickupDate ||
        '18 Sep 2026';

    const deliveryDateStr = foundOrder?.shipping?.delivery_at ||
        foundOrder?.delivery_date ||
        foundOrder?.deliveryDate ||
        '19 Sep 2026';

    return {
        id: formattedId,
        rawId: rawId,
        orderNumber: foundOrder?.order_no || foundOrder?.order_number || formattedId,
        from: fromCity,
        to: toCity,
        pickupFullAddress,
        deliveryFullAddress,
        status: displayStatus,
        rawStatus: rawStatus,
        pickupDate: pickupDateStr,
        deliveryDate: deliveryDateStr,
        estArrival: foundOrder?.estimated_time || foundOrder?.estArrival || '19 Sep 2026, 04:00 PM',
        estimatedTime: foundOrder?.estimated_time || '24-48 hrs',
        vehicle: {
            type: vehicleType,
            number: vehiclePlate,
            capacity: cargoWeight,
            goodsType: loadType
        },
        driver: {
            id: foundOrder?.driver_id || foundOrder?.driver?.id,
            name: driverName,
            phone: driverPhone,
            email: driverEmail
        },
        customer: {
            id: foundOrder?.client?.id || foundOrder?.customer?.id,
            name: customerName,
            companyName: customerName,
            avatar: foundOrder?.client?.avatar || foundOrder?.customer?.avatar,
            verified: true,
            rating: customerRating,
            reviews: customerReviews,
            active: 'Active now',
            memberSince: '2023',
            completedOrders: 145
        },
        pricing: {
            base: totalAmount,
            total: totalAmount,
            netPayout: netPayout,
            paymentStatus: paymentStatus,
            paymentStatusLabel: paymentStatusLabel,
            isPaid: isPaid,
            isPayLater: isPayLater,
            isEscrow: isEscrow,
            escrowGuaranteed: true
        },
        payment: {
            status: paymentStatusLabel,
            isPaid: isPaid,
            isPayLater: isPayLater,
            isEscrow: isEscrow,
            escrowGuaranteed: true
        },
        podUploaded: isPodAccepted || foundOrder?.pod_status === 'Approved' || foundOrder?.pod_status === 'Pending Review' || foundOrder?.podStatus === 'Approved' || foundOrder?.pod_status === 'pending' || rawStatus === 'delivered' || rawStatus === 'pod_uploaded',
        podStatus: foundOrder?.pod_status || foundOrder?.podStatus || (isPodAccepted ? 'Approved' : ((rawStatus === 'delivered' || rawStatus === 'pod_uploaded') ? 'Pending Review' : 'Not Uploaded')),
        podFileUrl: foundOrder?.tracking?.proof || foundOrder?.pod_document_url || foundOrder?.podFileUrl || foundOrder?.proof_of_delivery || '',
        instructions: foundOrder?.shipping?.instructions || foundOrder?.instructions || 'Standard loading ramp required. Handle with care.'
    };
};

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

    const fromCity = order?.from || 'London';
    const toCity = order?.to || 'Manchester';

    const hasRealDriver = Boolean(
        order?.driver?.name &&
        order.driver.name !== 'Unassigned' &&
        order.driver.name !== 'Assigned Driver' &&
        order.driver.name !== 'Assigned Fleet Driver'
    );

    let currentStepIndex = 1;

    if (s === 'pending') {
        currentStepIndex = 0;
    } else if (s === 'confirmed' || s === 'scheduled' || s === 'order confirmed' || s === 'new') {
        currentStepIndex = hasRealDriver ? 2 : 1;
    } else if (s === 'driver assigned' || s === 'assigned' || s === 'dispatched') {
        currentStepIndex = 2;
    } else if (s === 'picked up' || s === 'cargo loaded' || s === 'goods picked up') {
        currentStepIndex = 3;
    } else if (s === 'in transit' || s === 'on the way' || s === 'in progress') {
        currentStepIndex = 3;
    } else if (s === 'arrived' || s === 'destination reached' || s === 'out for delivery') {
        currentStepIndex = 4;
    } else if (s === 'delivered' || s === 'pod uploaded' || s === 'pod review' || s === 'pod pending') {
        currentStepIndex = isPodAccepted ? 6 : 5;
    } else if (s === 'completed' || s === 'pod accepted' || isPodAccepted) {
        currentStepIndex = 6;
    }

    return [
        {
            id: 1,
            status: 'Order Confirmed',
            time: formatDate(baseDate, -4, 0),
            completed: currentStepIndex >= 1 || rawStatus !== 'pending',
            active: currentStepIndex === 0 && rawStatus === 'pending',
            location: 'Order confirmed & customer booking secured'
        },
        {
            id: 2,
            status: hasRealDriver ? 'Driver Assigned' : 'Driver Assignment',
            time: hasRealDriver ? formatDate(baseDate, -2, 30) : 'Action Required',
            completed: hasRealDriver && currentStepIndex >= 2,
            active: !hasRealDriver || currentStepIndex === 1,
            location: hasRealDriver ? `${order?.driver?.name} assigned (${order?.vehicle?.number || 'Fleet Vehicle'})` : 'Assign driver and vehicle for dispatch'
        },
        {
            id: 3,
            status: 'Goods Picked Up',
            time: currentStepIndex > 2 ? formatDate(baseDate, -1, 0) : (currentStepIndex === 2 ? 'Next Step' : 'Scheduled'),
            completed: currentStepIndex > 2,
            active: currentStepIndex === 2 && hasRealDriver,
            location: `Pickup facility: ${fromCity}`
        },
        {
            id: 4,
            status: 'In Transit',
            time: currentStepIndex > 3 ? formatDate(baseDate, 0, 0) : (currentStepIndex === 3 ? 'Live Transit' : 'Upcoming'),
            completed: currentStepIndex > 3,
            active: currentStepIndex === 3,
            location: `Corridor: ${fromCity} ➔ ${toCity}`
        },
        {
            id: 5,
            status: 'Destination Delivery',
            time: currentStepIndex > 4 ? formatDate(baseDate, 2, 0) : (currentStepIndex === 4 ? 'Arriving' : 'Upcoming'),
            completed: currentStepIndex > 4,
            active: currentStepIndex === 4,
            location: `${toCity} Receiving Dock`
        },
        {
            id: 6,
            status: isPodAccepted ? 'POD Accepted' : 'POD Upload & Review',
            time: isPodAccepted ? formatDate(baseDate, 3, 0) : (currentStepIndex === 5 ? 'Under Review' : 'Pending Delivery'),
            completed: isPodAccepted || (currentStepIndex === 6),
            active: currentStepIndex === 5 && !isPodAccepted,
            location: isPodAccepted ? 'POD verified by customer' : (currentStepIndex === 5 ? 'Delivery note uploaded, verification in progress' : 'Requires delivery completion')
        },
        {
            id: 7,
            status: 'Order Completed',
            time: isPodAccepted || currentStepIndex === 6 ? 'Payout Released' : 'Pending Verification',
            completed: isPodAccepted || currentStepIndex === 6,
            active: false,
            location: 'Platform payment released to carrier account'
        },
    ];
};
