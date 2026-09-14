export const buildSupplierOrderDetails = (
    id: string | undefined,
    foundOrder: any,
    isPodAccepted: boolean,
    statusOverride?: string,
    assignedDriver?: { name: string; phone: string; email?: string; plate: string } | null
) => {
    const fromCity = foundOrder?.pickup_city ||
        foundOrder?.shipping?.from ||
        (foundOrder?.pickup_address ? foundOrder.pickup_address.split(',')[0]?.trim() : '') ||
        foundOrder?.from ||
        'London, UK';

    const toCity = foundOrder?.delivery_city ||
        foundOrder?.shipping?.to ||
        (foundOrder?.delivery_address ? foundOrder.delivery_address.split(',')[0]?.trim() : '') ||
        foundOrder?.to ||
        'Manchester, UK';

    const rawStatus = (statusOverride || foundOrder?.status_raw || foundOrder?.status || 'confirmed').toLowerCase().trim();
    let displayStatus = 'Confirmed';

    if (rawStatus === 'completed' || rawStatus === 'pod accepted' || isPodAccepted) {
        displayStatus = 'Completed';
    } else if (rawStatus.includes('cancel')) {
        displayStatus = 'Cancelled';
    } else if (rawStatus.includes('review') || rawStatus.includes('pod_uploaded') || rawStatus === 'delivered') {
        displayStatus = 'POD Review';
    } else if (rawStatus === 'arrived' || rawStatus === 'destination_reached') {
        displayStatus = 'Arrived';
    } else if (rawStatus === 'in_transit' || rawStatus === 'on_the_way') {
        displayStatus = 'In Transit';
    } else if (rawStatus === 'picked_up' || rawStatus === 'in_progress') {
        displayStatus = 'Picked Up';
    } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'dispatched') {
        displayStatus = 'Driver Assigned';
    } else if (rawStatus === 'confirmed' || rawStatus === 'scheduled' || rawStatus === 'pending') {
        displayStatus = 'Confirmed';
    } else {
        displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
    }

    const totalAmount = Number(
        foundOrder?.amount_raw ??
        foundOrder?.payment?.total ??
        foundOrder?.total_amount ??
        foundOrder?.amount ??
        2500
    );

    const baseRate = Math.round(totalAmount * 0.85);
    const loadingFee = Math.round(totalAmount * 0.10);
    const insuranceFee = Math.round(totalAmount - baseRate - loadingFee);
    const platformFee = Math.round(totalAmount * 0.05);
    const netPayout = totalAmount - platformFee;

    const customerName = foundOrder?.client?.name ||
        foundOrder?.customer?.name ||
        foundOrder?.customer_name ||
        (typeof foundOrder?.customer === 'string' ? foundOrder.customer : 'Premier Logistics Ltd');

    const customerRating = Number(foundOrder?.client?.rating || foundOrder?.customer?.rating || 4.9);
    const customerReviews = Number(foundOrder?.client?.reviews || foundOrder?.customer?.reviews || 120);

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
        'Pallets';

    const hasRealDriver = Boolean(
        assignedDriver?.name ||
        (foundOrder?.driver_name && foundOrder.driver_name !== 'Unassigned') ||
        (foundOrder?.driver?.name && foundOrder.driver.name !== 'Unassigned') ||
        (foundOrder?.driver && typeof foundOrder.driver === 'string' && foundOrder.driver !== 'Unassigned')
    );

    let driverName = 'Unassigned';
    if (assignedDriver?.name) {
        driverName = assignedDriver.name;
    } else if (foundOrder?.driver_name) {
        driverName = foundOrder.driver_name;
    } else if (foundOrder?.driver?.name) {
        driverName = foundOrder.driver.name;
    } else if (typeof foundOrder?.driver === 'string' && foundOrder.driver) {
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

    const formattedId = id
        ? (id.startsWith('ORD-') ? id : `ORD-${id.padStart(4, '0')}`)
        : (foundOrder?.order_no || foundOrder?.id || 'ORD-0001');

    return {
        id: formattedId,
        slug: String(foundOrder?.id || foundOrder?.slug || id || '1'),
        status: displayStatus,
        raw_status: rawStatus,
        estArrival: foundOrder?.estArrival || foundOrder?.shipping?.pickup_at || foundOrder?.pickup_date || '17 Sep 2026',
        from: String(fromCity).includes('(') ? String(fromCity) : `${fromCity}`,
        to: String(toCity).includes('(') ? String(toCity) : `${toCity}`,
        pickupFullAddress: foundOrder?.pickupFullAddress || foundOrder?.shipping?.from || foundOrder?.pickup_address || fromCity,
        deliveryFullAddress: foundOrder?.deliveryFullAddress || foundOrder?.shipping?.to || foundOrder?.delivery_address || toCity,
        pickupDate: foundOrder?.shipping?.pickup_at || foundOrder?.pickup_date || '15 Sep 2026',
        deliveryDate: foundOrder?.delivery_date || '17 Sep 2026',
        vehicle: {
            type: vehicleType,
            number: vehiclePlate,
            capacity: String(cargoWeight).includes('kg') || String(cargoWeight).includes('KG') ? cargoWeight : `${cargoWeight} kg`,
            goodsType: loadType
        },
        driver: {
            name: driverName,
            phone: driverPhone,
            email: driverEmail
        },
        customer: {
            name: customerName,
            verified: true,
            rating: customerRating,
            reviews: customerReviews,
            active: 'Active 2m ago',
            memberSince: '2023',
            completedOrders: 120
        },
        pricing: {
            base: baseRate,
            loading: loadingFee,
            insurance: insuranceFee,
            platformFee: platformFee,
            total: totalAmount,
            netPayout: netPayout,
            advancePaid: Math.round(totalAmount * 0.30),
            due: netPayout
        },
        podUploaded: isPodAccepted || foundOrder?.pod_status === 'Approved' || foundOrder?.pod_status === 'Pending Review' || foundOrder?.podStatus === 'Approved' || foundOrder?.pod_status === 'pending',
        podStatus: foundOrder?.pod_status || foundOrder?.podStatus || (isPodAccepted ? 'Approved' : 'Not Uploaded'),
        podFileUrl: foundOrder?.tracking?.proof || foundOrder?.pod_document_url || foundOrder?.podFileUrl || foundOrder?.proof_of_delivery || ''
    };
};

export const buildSupplierOrderTimeline = (
    isPodAccepted: boolean,
    order?: any
) => {
    const rawStatus = (order?.raw_status || order?.status_raw || order?.status || 'confirmed').toLowerCase().trim();
    const rawDate = order?.created_at || order?.pickup_date || order?.date || null;
    const baseDate = rawDate ? new Date(rawDate) : new Date();

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

    const fromCity = order?.from || 'London, UK';
    const toCity = order?.to || 'Manchester, UK';

    const hasRealDriver = Boolean(
        order?.driver?.name &&
        order.driver.name !== 'Unassigned' &&
        order.driver.name !== 'Assigned Driver' &&
        order.driver.name !== 'Assigned Fleet Driver'
    );

    // Timeline Step Index Mapping:
    // 0: Order Confirmed
    // 1: Driver Assigned
    // 2: Goods Picked Up
    // 3: In Transit
    // 4: Destination Delivery
    // 5: POD Upload & Review
    // 6: Order Completed
    let currentStepIndex = 1;

    if (rawStatus === 'pending') {
        currentStepIndex = 0;
    } else if (rawStatus === 'confirmed' || rawStatus === 'scheduled' || rawStatus === 'order_confirmed' || rawStatus === 'new') {
        currentStepIndex = hasRealDriver ? 2 : 1;
    } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'dispatched') {
        currentStepIndex = 2;
    } else if (rawStatus === 'picked_up' || rawStatus === 'cargo_loaded' || rawStatus === 'in_progress') {
        currentStepIndex = 3;
    } else if (rawStatus === 'in_transit' || rawStatus === 'on_the_way') {
        currentStepIndex = 3;
    } else if (rawStatus === 'arrived' || rawStatus === 'destination_reached' || rawStatus === 'out_for_delivery') {
        currentStepIndex = 4;
    } else if (rawStatus === 'delivered' || rawStatus === 'pod_uploaded' || rawStatus === 'pod_review' || rawStatus === 'pod_pending') {
        currentStepIndex = isPodAccepted ? 6 : 5;
    } else if (rawStatus === 'completed' || rawStatus === 'pod_accepted' || isPodAccepted) {
        currentStepIndex = 6;
    }

    return [
        {
            id: 1,
            status: 'Order Confirmed',
            time: formatDate(baseDate, 0, 0),
            completed: currentStepIndex >= 1 || rawStatus !== 'pending',
            active: currentStepIndex === 0 && rawStatus === 'pending',
            location: 'Order confirmed and registered in system'
        },
        {
            id: 2,
            status: hasRealDriver ? 'Driver Assigned' : 'Driver Assignment',
            time: hasRealDriver ? formatDate(baseDate, 1, 15) : 'Action Required',
            completed: hasRealDriver && currentStepIndex >= 2,
            active: !hasRealDriver || currentStepIndex === 1,
            location: hasRealDriver ? `${order.driver.name} assigned to shipment (${order.vehicle?.number || 'Fleet'})` : 'Assign driver and vehicle for dispatch'
        },
        {
            id: 3,
            status: 'Goods Picked Up',
            time: currentStepIndex > 2 ? formatDate(baseDate, 3, 30) : (currentStepIndex === 2 ? 'Next Step' : 'Scheduled'),
            completed: currentStepIndex > 2,
            active: currentStepIndex === 2 && hasRealDriver,
            location: `Pickup location: ${fromCity}`
        },
        {
            id: 4,
            status: 'In Transit',
            time: currentStepIndex > 3 ? formatDate(baseDate, 6, 0) : (currentStepIndex === 3 ? 'Live Transit' : 'Upcoming'),
            completed: currentStepIndex > 3,
            active: currentStepIndex === 3,
            location: `Highway Transit: ${fromCity} ➔ ${toCity}`
        },
        {
            id: 5,
            status: 'Destination Delivery',
            time: currentStepIndex > 4 ? formatDate(baseDate, 12, 0) : (currentStepIndex === 4 ? 'Arriving' : 'Upcoming'),
            completed: currentStepIndex > 4,
            active: currentStepIndex === 4,
            location: `${toCity} Delivery Point`
        },
        {
            id: 6,
            status: isPodAccepted ? 'POD Accepted' : 'POD Upload & Review',
            time: isPodAccepted ? formatDate(baseDate, 14, 0) : (currentStepIndex === 5 ? 'Action Required' : 'Pending Delivery'),
            completed: isPodAccepted || (currentStepIndex === 6),
            active: currentStepIndex === 5 && !isPodAccepted,
            location: isPodAccepted ? 'Receipt Verified & Confirmed' : (currentStepIndex === 5 ? 'Upload signed delivery note from customer' : 'Requires delivery completion')
        },
        {
            id: 7,
            status: 'Order Completed',
            time: isPodAccepted || currentStepIndex === 6 ? 'Payout Released' : 'Pending Confirmation',
            completed: isPodAccepted || currentStepIndex === 6,
            active: false,
            location: 'Escrow payment released to supplier'
        },
    ];
};
