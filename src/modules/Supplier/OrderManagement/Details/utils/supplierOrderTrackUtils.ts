export interface NormalizedSupplierOrder {
    id: string;
    rawId: number | string;
    orderNumber: string;
    from: string;
    to: string;
    pickupCity: string;
    deliveryCity: string;
    pickupFullAddress: string;
    deliveryFullAddress: string;
    pickup_address: string;
    delivery_address: string;
    pickup_lat?: number | null;
    pickup_lng?: number | null;
    delivery_lat?: number | null;
    delivery_lng?: number | null;
    distance_km?: number | null;
    distance?: string;
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

    const pickupLat = foundOrder?.pickup_lat ? Number(foundOrder.pickup_lat) : null;
    const pickupLng = foundOrder?.pickup_lng ? Number(foundOrder.pickup_lng) : null;
    const deliveryLat = foundOrder?.delivery_lat ? Number(foundOrder.delivery_lat) : null;
    const deliveryLng = foundOrder?.delivery_lng ? Number(foundOrder.delivery_lng) : null;
    const distanceKmVal = foundOrder?.distance_km ? Number(foundOrder.distance_km) : null;
    const distanceFormatted = foundOrder?.distance || (distanceKmVal ? `${distanceKmVal} km` : '80.81 km');

    return {
        id: formattedId,
        rawId: rawId,
        orderNumber: foundOrder?.order_no || foundOrder?.order_number || formattedId,
        from: fromCity,
        to: toCity,
        pickupCity: fromCity,
        deliveryCity: toCity,
        pickupFullAddress,
        deliveryFullAddress,
        pickup_address: pickupFullAddress,
        delivery_address: deliveryFullAddress,
        pickup_lat: pickupLat,
        pickup_lng: pickupLng,
        delivery_lat: deliveryLat,
        delivery_lng: deliveryLng,
        distance_km: distanceKmVal,
        distance: distanceFormatted,
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

    const fromCity = order?.from || 'Origin';
    const toCity = order?.to || 'Destination';

    const hasRealDriver = Boolean(
        order?.driver?.name &&
        order.driver.name !== 'Unassigned' &&
        order.driver.name !== 'Assigned Driver' &&
        order.driver.name !== 'Assigned Fleet Driver'
    );

    // 1 = Confirmed, 2 = Driver Assign, 3 = Goods Picked Up, 4 = In Transit, 5 = Arrived, 6 = POD Review, 7 = Completed
    let currentStep = 2; // Default for confirmed orders is Step 2 (Driver Assignment)

    if (s === 'pending') {
        currentStep = 1;
    } else if (s === 'confirmed' || s === 'scheduled' || s === 'order confirmed' || s === 'new') {
        currentStep = hasRealDriver ? 3 : 2;
    } else if (s === 'driver assigned' || s === 'assigned' || s === 'dispatched') {
        currentStep = 3;
    } else if (s === 'picked up' || s === 'cargo loaded' || s === 'goods picked up') {
        currentStep = 4;
    } else if (s === 'in transit' || s === 'on the way' || s === 'in progress') {
        currentStep = 4;
    } else if (s === 'arrived' || s === 'destination reached' || s === 'out for delivery') {
        currentStep = 5;
    } else if (s === 'delivered' || s === 'pod uploaded' || s === 'pod review' || s === 'pod pending') {
        currentStep = isPodAccepted ? 8 : 6;
    } else if (s === 'completed' || s === 'pod accepted' || isPodAccepted) {
        currentStep = 8;
    }

    const isAllCompleted = currentStep >= 8;

    return [
        {
            id: 1,
            status: 'Order Confirmed',
            time: formatDate(baseDate, -12, 0),
            completed: currentStep > 1 || isAllCompleted,
            active: currentStep === 1,
            location: 'Order confirmed & customer booking secured in Escrow'
        },
        {
            id: 2,
            status: hasRealDriver ? 'Driver Assigned' : 'Driver Assignment',
            time: (currentStep > 2 || isAllCompleted) ? formatDate(baseDate, -8, 30) : (currentStep === 2 ? 'Action Required' : 'Pending'),
            completed: currentStep > 2 || isAllCompleted,
            active: currentStep === 2,
            location: hasRealDriver ? `${order?.driver?.name} assigned (${order?.vehicle?.number || 'Fleet Vehicle'})` : 'Assign driver and vehicle for dispatch'
        },
        {
            id: 3,
            status: 'Goods Picked Up',
            time: (currentStep > 3 || isAllCompleted) ? formatDate(baseDate, -4, 0) : (currentStep === 3 ? 'In Progress' : 'Scheduled Date'),
            completed: currentStep > 3 || isAllCompleted,
            active: currentStep === 3,
            location: `Pickup facility: ${order?.pickupFullAddress || fromCity}`
        },
        {
            id: 4,
            status: 'In Transit',
            time: (currentStep > 4 || isAllCompleted) ? formatDate(baseDate, -1, 15) : (currentStep === 4 ? 'Live GPS Corridor' : 'Estimated En Route'),
            completed: currentStep > 4 || isAllCompleted,
            active: currentStep === 4,
            location: `Corridor: ${fromCity} ➔ ${toCity}`
        },
        {
            id: 5,
            status: 'Arrived at Destination',
            time: (currentStep > 5 || isAllCompleted) ? formatDate(baseDate, 0, 0) : (currentStep === 5 ? 'Arrived' : order?.estArrival || '48h'),
            completed: currentStep > 5 || isAllCompleted,
            active: currentStep === 5,
            location: `${order?.deliveryFullAddress || toCity}`
        },
        {
            id: 6,
            status: isPodAccepted || isAllCompleted ? 'POD Approved & Settled' : 'POD Upload & Verification',
            time: (isPodAccepted || isAllCompleted) ? formatDate(baseDate, 0, 45) : (currentStep === 6 ? 'Under Customer Review' : 'Pending Delivery'),
            completed: isPodAccepted || isAllCompleted,
            active: currentStep === 6 && !isPodAccepted,
            location: isPodAccepted ? 'POD verified and Escrow payment released' : 'Proof of delivery submitted for customer approval'
        },
        {
            id: 7,
            status: 'Order Completed',
            time: (isPodAccepted || isAllCompleted) ? formatDate(baseDate, 1, 0) : 'Pending Final Release',
            completed: isPodAccepted || isAllCompleted,
            active: false,
            location: 'Platform payment released to carrier account'
        },
    ];
};
