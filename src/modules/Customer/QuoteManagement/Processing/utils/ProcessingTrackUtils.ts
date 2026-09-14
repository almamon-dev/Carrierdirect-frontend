export const buildOrderDetails = (id: string | undefined, foundOrder: any, isPodAccepted: boolean) => {
    const fromCity = foundOrder?.pickup_city || (foundOrder?.pickup_address ? foundOrder.pickup_address.split(',')[0]?.trim() : '') || foundOrder?.route?.from || foundOrder?.from || 'Dhaka';
    const toCity = foundOrder?.delivery_city || (foundOrder?.delivery_address ? foundOrder.delivery_address.split(',')[0]?.trim() : '') || foundOrder?.route?.to || foundOrder?.to || 'Chittagong';

    const rawStatus = (foundOrder?.status_raw || foundOrder?.status || 'confirmed').toLowerCase().trim();
    let displayStatus = 'Confirmed';

    if (rawStatus === 'completed' || rawStatus === 'pod accepted' || isPodAccepted) {
        displayStatus = 'Completed';
    } else if (rawStatus.includes('cancel')) {
        displayStatus = 'Cancelled';
    } else if (rawStatus.includes('review') || rawStatus.includes('pod_uploaded') || rawStatus === 'delivered') {
        displayStatus = 'Review & Accept POD';
    } else if (rawStatus === 'arrived' || rawStatus === 'destination_reached') {
        displayStatus = 'Arrived at Destination';
    } else if (rawStatus === 'in_transit' || rawStatus === 'on_the_way') {
        displayStatus = 'In Transit';
    } else if (rawStatus === 'picked_up' || rawStatus === 'in_progress') {
        displayStatus = 'Goods Picked Up';
    } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'dispatched') {
        displayStatus = 'Driver Assigned';
    } else if (rawStatus === 'confirmed' || rawStatus === 'scheduled' || rawStatus === 'pending') {
        displayStatus = 'Confirmed';
    } else {
        displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
    }

    const totalAmount = Number(
        foundOrder?.total_amount_raw ??
        foundOrder?.amount_raw ??
        (foundOrder?.total_amount ? parseFloat(String(foundOrder.total_amount).replace(/[^0-9.]/g, '')) : (foundOrder?.amount ? parseFloat(String(foundOrder.amount).replace(/[^0-9.]/g, '')) : 47250))
    ) || 47250;

    const baseRate = Math.round(totalAmount * 0.85);
    const loadingFee = Math.round(totalAmount * 0.10);
    const insuranceFee = Math.round(totalAmount - baseRate - loadingFee);
    const isPaid = String(foundOrder?.payment_status || '').toLowerCase().includes('paid');
    const advancePaid = isPaid ? totalAmount : Math.round(totalAmount * 0.30);
    const balanceDue = isPaid ? 0 : totalAmount - advancePaid;

    const vehicleType = foundOrder?.vehicle || foundOrder?.vehicle_type || foundOrder?.vehicleType || foundOrder?.truck_type || 'Covered Van (20ft)';
    const vehicleNumber = foundOrder?.vehicle_plate || foundOrder?.vehiclePlate || foundOrder?.vehicleNo || (rawStatus === 'confirmed' ? 'Assigning Fleet...' : 'DHA-11-2233');
    const cargoWeight = foundOrder?.weight || foundOrder?.cargo_weight || foundOrder?.cargoWeight || '1,500 KG';
    const goodsType = foundOrder?.pallets || foundOrder?.type_of_pallets || foundOrder?.load_type || foundOrder?.goodsType || 'General Freight & Logistics';

    const supplierObj = foundOrder?.supplier || {};
    const supplierName = foundOrder?.supplier_name || foundOrder?.carrier_name || supplierObj?.company_name || supplierObj?.name || 'Supplier Co 1';
    const supplierAvatar = foundOrder?.carrier_avatar || foundOrder?.supplier_avatar || supplierObj?.profile_picture || supplierObj?.avatar;
    const supplierRating = foundOrder?.carrier_rating || supplierObj?.rating || foundOrder?.rating || 4.8;
    const completedLoads = supplierObj?.completed_orders || foundOrder?.completed_orders || '150+';

    const rawPod = String(foundOrder?.pod_status || foundOrder?.tracking?.pod_status || '').toLowerCase();
    const hasPodDoc = Boolean(foundOrder?.proof_of_delivery || foundOrder?.pod_document_url || foundOrder?.tracking?.proof);
    const isPodAvailable = hasPodDoc || rawPod.includes('pending') || rawPod.includes('upload') || rawStatus === 'delivered' || rawStatus === 'pod_uploaded';

    const formattedId = id
        ? (id.startsWith('ORD-') ? id : `ORD-${id.padStart(4, '0')}`)
        : (foundOrder?.order_number || foundOrder?.order_no || (foundOrder?.id ? `ORD-${String(foundOrder.id).padStart(4, '0')}` : 'ORD-0001'));

    return {
        id: formattedId,
        rawId: foundOrder?.id,
        status: displayStatus,
        raw_status: rawStatus,
        estArrival: foundOrder?.delivery_date || foundOrder?.estimated_delivery || foundOrder?.estArrival || foundOrder?.estimated_time || '48h',
        from: fromCity.includes('(') ? fromCity : `${fromCity}`,
        to: toCity.includes('(') ? toCity : `${toCity}`,
        vehicle: {
            type: vehicleType,
            number: vehicleNumber,
            capacity: String(cargoWeight).toUpperCase().includes('KG') ? String(cargoWeight).toUpperCase() : `${cargoWeight} KG`,
            goodsType: goodsType
        },
        supplier: {
            name: supplierName,
            avatar: supplierAvatar,
            verified: true,
            rating: supplierRating,
            reviews: 320,
            active: 'Active 5m ago',
            memberSince: '2023',
            completedOrders: completedLoads
        },
        pricing: {
            base: baseRate,
            loading: loadingFee,
            insurance: insuranceFee,
            total: totalAmount,
            advancePaid: advancePaid,
            due: balanceDue
        },
        isPodAvailable: isPodAvailable && !isPodAccepted,
        isPodAccepted: isPodAccepted || rawStatus === 'completed' || rawPod.includes('approv'),
        podFileUrl: foundOrder?.proof_of_delivery || foundOrder?.pod_document_url || foundOrder?.tracking?.proof || ''
    };
};

export const buildOrderTimeline = (isPodAccepted: boolean, order?: any) => {
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

    const fromCity = order?.from || 'Dhaka';
    const toCity = order?.to || 'Chittagong';

    // Step Index Mapping:
    // 0: Order Confirmed
    // 1: Driver Assigned
    // 2: Goods Picked Up
    // 3: In Transit
    // 4: Destination Delivery
    // 5: Review & Accept POD
    // 6: Order Completed
    let currentStepIndex = 1; // For newly confirmed order: Step 1 (Order Confirmed) is completed, Step 2 (Driver Assigned) is active/pending

    if (rawStatus === 'pending') {
        currentStepIndex = 0;
    } else if (rawStatus === 'confirmed' || rawStatus === 'scheduled' || rawStatus === 'new') {
        currentStepIndex = 1;
    } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'dispatched') {
        currentStepIndex = 2;
    } else if (rawStatus === 'picked_up' || rawStatus === 'in_progress') {
        currentStepIndex = 3;
    } else if (rawStatus === 'in_transit' || rawStatus === 'on_the_way') {
        currentStepIndex = 3;
    } else if (rawStatus === 'arrived' || rawStatus === 'destination_reached') {
        currentStepIndex = 4;
    } else if (rawStatus === 'delivered' || rawStatus === 'pod_uploaded' || rawStatus === 'pod_review') {
        currentStepIndex = isPodAccepted ? 6 : 5;
    } else if (rawStatus === 'completed' || rawStatus === 'pod_accepted' || isPodAccepted) {
        currentStepIndex = 6;
    }

    const hasRealDriver = Boolean(
        order?.driver?.name &&
        order.driver.name !== 'Unassigned' &&
        order.driver.name !== 'Assigned Driver' &&
        order.driver.name !== 'Assigned Fleet Driver'
    );

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
            time: hasRealDriver && currentStepIndex > 1 ? formatDate(baseDate, 1, 15) : (currentStepIndex === 1 ? 'Pending Assignment' : 'Pending'),
            completed: hasRealDriver && currentStepIndex >= 2,
            active: !hasRealDriver && currentStepIndex === 1,
            location: hasRealDriver && order?.vehicle?.number && !order.vehicle.number.includes('Assigning') ? `Assigned vehicle: ${order.vehicle.number}` : 'Carrier assigning driver & vehicle'
        },
        {
            id: 3,
            status: 'Goods Picked Up',
            time: currentStepIndex > 2 ? formatDate(baseDate, 3, 30) : (currentStepIndex === 2 ? 'Next Step' : 'Scheduled'),
            completed: currentStepIndex > 2,
            active: currentStepIndex === 2 && hasRealDriver,
            location: `Pickup Point: ${fromCity}`
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
            status: isPodAccepted ? 'POD Accepted' : 'Review & Accept POD',
            time: isPodAccepted ? formatDate(baseDate, 14, 0) : (currentStepIndex === 5 ? 'Action Required' : 'Pending Delivery'),
            completed: isPodAccepted || (currentStepIndex === 6),
            active: currentStepIndex === 5 && !isPodAccepted,
            location: isPodAccepted ? 'Receipt Verified & Confirmed' : (currentStepIndex === 5 ? 'Carrier submitted signed POD receipt' : 'Awaiting delivery completion')
        },
        {
            id: 7,
            status: 'Order Completed',
            time: isPodAccepted || currentStepIndex === 6 ? 'Escrow Released' : 'Pending Confirmation',
            completed: isPodAccepted || currentStepIndex === 6,
            active: false,
            location: 'Order completed and payment settled'
        },
    ];
};
