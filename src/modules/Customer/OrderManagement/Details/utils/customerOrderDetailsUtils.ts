export interface NormalizedCustomerOrder {
    id: string;
    rawId: string | number;
    orderNumber: string;
    status: string;
    rawStatus: string;
    paymentStatus: string;
    isPaid: boolean;
    isEscrow: boolean;
    isPayLater: boolean;
    payLaterDueDate: string;
    paymentMethod?: string;
    pickup: {
        city: string;
        address: string;
        contactName: string;
        contactPhone: string;
        date: string;
        time: string;
    };
    delivery: {
        city: string;
        address: string;
        contactName: string;
        contactPhone: string;
        date: string;
        time: string;
    };
    route: string;
    distance: string;
    estArrival: string;
    vehicle: {
        type: string;
        number: string;
        capacity: string;
        goodsType: string;
        dimensions?: string;
    };
    driver?: {
        name: string;
        phone: string;
        email?: string;
        plate: string;
        avatar?: string;
    };
    supplier: {
        id?: string | number;
        name: string;
        avatar?: string;
        verified: boolean;
        rating: number;
        reviews: number;
        completedOrders: string | number;
        successRate: string;
        responseTime: string;
        memberSince: string;
        phone?: string;
        email?: string;
    };
    pricing: {
        subtotal: number;
        base: number;
        loading: number;
        insurance: number;
        platformFee: number;
        total: number;
        advancePaid: number;
        due: number;
        subtotalFormatted: string;
        platformFeeFormatted: string;
        totalFormatted: string;
        advanceFormatted: string;
        dueFormatted: string;
    };
    pod: {
        isAvailable: boolean;
        isAccepted: boolean;
        fileUrl?: string;
        fileName?: string;
        signatureUrl?: string;
        receiverName?: string;
        note?: string;
        uploadedAt?: string;
    };
    isRated: boolean;
    quoteId?: string | number;
}

export const buildNormalizedCustomerOrder = (
    paramId: string | undefined,
    foundOrder: any,
    isPodAcceptedState?: boolean,
    isPaidOverride?: boolean
): NormalizedCustomerOrder => {
    const rawId = foundOrder?.id || paramId || '1';
    const cleanNumericId = String(rawId).replace(/^ORD-0*/i, '') || '1';
    const formattedId = paramId
        ? (paramId.startsWith('ORD-') ? paramId : `ORD-${String(paramId).replace(/^ORD-0*/i, '').padStart(4, '0')}`)
        : (foundOrder?.order_number || foundOrder?.order_id || `ORD-${String(cleanNumericId).padStart(4, '0')}`);

    // Status Normalization
    const rawStatus = (foundOrder?.status_raw || foundOrder?.status || 'confirmed').toLowerCase().trim();
    const isPodAccepted = isPodAcceptedState || rawStatus === 'completed' || rawStatus === 'pod accepted';
    
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
    } else if (rawStatus === 'confirmed' || rawStatus === 'scheduled' || rawStatus === 'new') {
        displayStatus = 'Confirmed';
    } else {
        displayStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
    }

    // Payment Status Normalization
    const rawPayment = String(
        foundOrder?.payment_status || 
        foundOrder?.paymentStatus || 
        foundOrder?.payment_term || 
        foundOrder?.payment_method || 
        (cleanNumericId === '2' ? 'pay_later' : cleanNumericId === '3' ? 'paid' : 'In Escrow')
    ).trim();

    const isPaid = isPaidOverride || rawPayment.toLowerCase() === 'paid' || foundOrder?.is_paid === true || foundOrder?.isPaid === true;
    
    const isPayLater = !isPaid && (
        rawPayment.toLowerCase().includes('pay later') || 
        rawPayment.toLowerCase().includes('pay_later') || 
        rawPayment.toLowerCase().includes('net-30') || 
        rawPayment.toLowerCase().includes('credit') ||
        String(foundOrder?.payment_option || '').toLowerCase() === 'pay_later'
    );

    const isEscrow = !isPaid && !isPayLater;

    let paymentStatus = 'In Escrow';
    if (isPaid) {
        paymentStatus = 'Paid';
    } else if (isPayLater) {
        paymentStatus = 'Pay Later (Net-30)';
    } else if (isEscrow) {
        paymentStatus = 'In Escrow';
    } else {
        paymentStatus = rawPayment;
    }

    const payLaterDueDate = foundOrder?.due_date || foundOrder?.pay_later_due_date || '17 Oct 2026';

    // Address & City Normalization
    const pickupAddress = foundOrder?.pickup_address || foundOrder?.pickupAddress || 'Berlin Central Logistics Hub, Industrial Park 4, 10115 Berlin, Germany';
    const deliveryAddress = foundOrder?.delivery_address || foundOrder?.deliveryAddress || 'Hamburg Port Terminal 2, Hafenstrasse 18, 20457 Hamburg, Germany';
    const fromCity = foundOrder?.pickup_city || (pickupAddress.split(',')[0]?.trim()) || 'Berlin';
    const toCity = foundOrder?.delivery_city || (deliveryAddress.split(',')[0]?.trim()) || 'Hamburg';

    // Pricing Normalization
    const totalAmount = Number(
        foundOrder?.total_amount_raw ??
        foundOrder?.amount_raw ??
        (foundOrder?.total_amount ? parseFloat(String(foundOrder.total_amount).replace(/[^0-9.]/g, '')) : (foundOrder?.amount ? parseFloat(String(foundOrder.amount).replace(/[^0-9.]/g, '')) : 1250))
    ) || 1250;

    const subtotal = foundOrder?.subtotal ? Number(foundOrder.subtotal) : Math.round(totalAmount / 1.05);
    const platformFee = foundOrder?.platform_fee ? Number(foundOrder.platform_fee) : Math.round(totalAmount - subtotal);
    const baseRate = Math.round(subtotal * 0.85);
    const loadingFee = Math.round(subtotal * 0.10);
    const insuranceFee = Math.max(0, subtotal - baseRate - loadingFee);
    const advancePaid = isPaid ? totalAmount : isPayLater ? 0 : Math.round(totalAmount * 0.30);
    const dueBalance = isPaid ? 0 : isPayLater ? totalAmount : totalAmount - advancePaid;

    // Supplier Info
    const supplierObj = foundOrder?.supplier || {};
    const supplierName = foundOrder?.supplier_name || foundOrder?.carrier_name || supplierObj?.company_name || supplierObj?.name || 'DHL Freight Express';
    const supplierAvatar = foundOrder?.supplier_avatar || foundOrder?.carrier_avatar || supplierObj?.profile_picture || supplierObj?.avatar;
    const supplierRating = Number(foundOrder?.carrier_rating || supplierObj?.rating || foundOrder?.rating || 4.9);
    const completedOrders = supplierObj?.completed_orders || foundOrder?.completed_orders || '240+';

    // Vehicle Info
    const vehicleType = foundOrder?.vehicle || foundOrder?.vehicle_type || foundOrder?.truck_type || 'Curtain-Side Trailer (24T)';
    const vehicleNumber = foundOrder?.vehicle_plate || foundOrder?.vehicle_number || foundOrder?.driver_plate || (rawStatus === 'confirmed' ? 'Pending Assignment' : 'B-DF 4892');
    const cargoWeight = foundOrder?.weight || foundOrder?.cargo_weight || '3,400 kg';
    const goodsType = foundOrder?.pallets || foundOrder?.type_of_pallets || foundOrder?.goods_type || '12 Standard Euro Pallets (Industrial Electronics)';

    // Driver Info
    const driverName = foundOrder?.driver_name || foundOrder?.driver?.name;
    const driverPhone = foundOrder?.driver_phone || foundOrder?.driver?.phone;
    const driverEmail = foundOrder?.driver_email || foundOrder?.driver?.email;
    const hasDriver = Boolean(driverName && driverName !== 'Unassigned' && driverName !== 'Pending');

    // POD Info
    const rawPod = String(foundOrder?.pod_status || foundOrder?.tracking?.pod_status || '').toLowerCase();
    const hasPodDoc = Boolean(foundOrder?.proof_of_delivery || foundOrder?.pod_document_url || foundOrder?.tracking?.proof);
    const isPodAvailable = hasPodDoc || rawPod.includes('pending') || rawPod.includes('upload') || rawStatus === 'delivered' || rawStatus === 'pod_uploaded';

    return {
        id: formattedId,
        rawId: cleanNumericId,
        orderNumber: formattedId,
        status: displayStatus,
        rawStatus: rawStatus,
        paymentStatus: paymentStatus,
        isPaid: isPaid,
        isEscrow: isEscrow,
        isPayLater: isPayLater,
        payLaterDueDate: payLaterDueDate,
        pickup: {
            city: fromCity,
            address: pickupAddress,
            contactName: foundOrder?.pickup_contact_name || 'Warehouse Dispatch Desk',
            contactPhone: foundOrder?.pickup_contact_phone || '+49 30 555-0192',
            date: foundOrder?.pickup_date || foundOrder?.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            time: foundOrder?.pickup_time || '08:30 AM CET',
        },
        delivery: {
            city: toCity,
            address: deliveryAddress,
            contactName: foundOrder?.delivery_contact_name || 'Receiving Logistics Dept.',
            contactPhone: foundOrder?.delivery_contact_phone || '+49 40 555-0188',
            date: foundOrder?.delivery_date || foundOrder?.estimated_delivery || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
            time: foundOrder?.delivery_time || '04:00 PM CET',
        },
        route: `${fromCity} ➔ ${toCity}`,
        distance: foundOrder?.distance || '290 km',
        estArrival: foundOrder?.delivery_date || foundOrder?.estimated_delivery || foundOrder?.eta || 'Tomorrow, 4:00 PM',
        vehicle: {
            type: vehicleType,
            number: vehicleNumber,
            capacity: String(cargoWeight).toUpperCase().includes('KG') || String(cargoWeight).toUpperCase().includes('T') ? String(cargoWeight) : `${cargoWeight} kg`,
            goodsType: goodsType,
            dimensions: foundOrder?.dimensions || '13.6m x 2.45m x 2.7m',
        },
        driver: hasDriver ? {
            name: driverName,
            phone: driverPhone || '+49 170 555-3211',
            email: driverEmail || 'driver.ops@carrierdirect.eu',
            plate: vehicleNumber,
        } : (rawStatus !== 'confirmed' && rawStatus !== 'pending' ? {
            name: 'Klaus Becker',
            phone: '+49 170 555-3211',
            email: 'klaus.becker@dhlfreight.de',
            plate: vehicleNumber,
        } : undefined),
        supplier: {
            id: supplierObj?.id || 1,
            name: supplierName,
            avatar: supplierAvatar,
            verified: true,
            rating: supplierRating,
            reviews: 342,
            completedOrders: completedOrders,
            successRate: '99.8%',
            responseTime: '< 15 mins',
            memberSince: '2023',
            phone: supplierObj?.phone || '+49 89 2020-440',
            email: supplierObj?.email || 'dispatch@carrierdirect.eu',
        },
        pricing: {
            subtotal: subtotal,
            base: baseRate,
            loading: loadingFee,
            insurance: insuranceFee,
            platformFee: platformFee,
            total: totalAmount,
            advancePaid: advancePaid,
            due: dueBalance,
            subtotalFormatted: `€ ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            platformFeeFormatted: `€ ${platformFee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            totalFormatted: `€ ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            advanceFormatted: `€ ${advancePaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            dueFormatted: `€ ${dueBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
        pod: {
            isAvailable: isPodAvailable && !isPodAccepted,
            isAccepted: isPodAccepted,
            fileUrl: foundOrder?.proof_of_delivery || foundOrder?.tracking?.proof || foundOrder?.pod_document_url || '',
            fileName: foundOrder?.pod_file_name || 'CarrierDirect_Signed_POD_Receipt.pdf',
            signatureUrl: foundOrder?.signature || foundOrder?.tracking?.signature || '',
            receiverName: foundOrder?.receiver_name || foundOrder?.tracking?.receiver_name || foundOrder?.delivery_contact_name || 'Receiving Logistics Dept.',
            note: foundOrder?.status_note || foundOrder?.tracking?.note || '',
            uploadedAt: foundOrder?.pod_uploaded_at || 'Today at 02:45 PM',
        },
        isRated: Boolean(foundOrder?.is_rated),
        quoteId: foundOrder?.quote_id || foundOrder?.quote_request_id || cleanNumericId,
    };
};

export const buildCustomerOrderTimeline = (order: NormalizedCustomerOrder) => {
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
            hour12: true
        });
    };

    let stepIndex = 1;

    if (rawStatus === 'pending') {
        stepIndex = 0;
    } else if (rawStatus === 'confirmed' || rawStatus === 'scheduled' || rawStatus === 'new') {
        stepIndex = 1;
    } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned' || rawStatus === 'dispatched') {
        stepIndex = 2;
    } else if (rawStatus === 'picked_up' || rawStatus === 'in_progress') {
        stepIndex = 3;
    } else if (rawStatus === 'in_transit' || rawStatus === 'on_the_way') {
        stepIndex = 4;
    } else if (rawStatus === 'arrived' || rawStatus === 'destination_reached') {
        stepIndex = 5;
    } else if (rawStatus === 'delivered' || rawStatus === 'pod_uploaded' || rawStatus === 'pod_review') {
        stepIndex = isPodAccepted ? 7 : 6;
    } else if (rawStatus === 'completed' || rawStatus === 'pod_accepted' || isPodAccepted) {
        stepIndex = 7;
    }

    return [
        {
            id: 1,
            status: 'Order Confirmed & Booked',
            time: formatDate(-12, 0),
            completed: stepIndex >= 1,
            active: stepIndex === 1,
            location: `${order.pickup.city} Logistics Registry`,
            description: 'Quotation accepted and carrier booking confirmed in Escrow.'
        },
        {
            id: 2,
            status: order.driver ? 'Driver & Fleet Assigned' : 'Driver Assignment',
            time: stepIndex >= 2 ? formatDate(-8, 30) : 'Pending Carrier',
            completed: stepIndex >= 2,
            active: stepIndex === 2,
            location: order.driver ? `${order.driver.name} (${order.vehicle.number})` : 'Carrier Fleet Dispatch',
            description: order.driver ? `Assigned driver ${order.driver.name} with vehicle plate ${order.vehicle.number}` : 'Carrier is allocating driver and vehicle.'
        },
        {
            id: 3,
            status: 'Goods Picked Up',
            time: stepIndex >= 3 ? formatDate(-4, 0) : 'Scheduled Window',
            completed: stepIndex >= 3,
            active: stepIndex === 3,
            location: order.pickup.address,
            description: 'Cargo verified, secured, and departed pickup facility.'
        },
        {
            id: 4,
            status: 'In Transit on Route',
            time: stepIndex >= 4 ? formatDate(-1, 15) : 'Estimated En Route',
            completed: stepIndex >= 4,
            active: stepIndex === 4,
            location: `Highway Route: ${order.pickup.city} ➔ ${order.delivery.city}`,
            description: 'Live GPS tracked on designated corridor.'
        },
        {
            id: 5,
            status: 'Arrived at Destination',
            time: stepIndex >= 5 ? formatDate(0, 0) : order.estArrival,
            completed: stepIndex >= 5,
            active: stepIndex === 5,
            location: order.delivery.address,
            description: 'Vehicle arrived at recipient unloading dock.'
        },
        {
            id: 6,
            status: isPodAccepted ? 'POD Verified & Approved' : 'Review & Accept POD',
            time: isPodAccepted ? formatDate(0, 45) : (stepIndex >= 6 ? 'Action Required' : 'Awaiting Delivery'),
            completed: isPodAccepted || stepIndex >= 7,
            active: stepIndex === 6 && !isPodAccepted,
            location: 'Customer Verification',
            description: isPodAccepted ? 'Proof of delivery verified and Escrow payment settled.' : 'Signed delivery receipt uploaded by driver for customer approval.'
        },
        {
            id: 7,
            status: 'Order Completed',
            time: isPodAccepted || stepIndex >= 7 ? formatDate(1, 0) : 'Pending Final POD',
            completed: isPodAccepted || stepIndex >= 7,
            active: false,
            location: 'Settled & Closed',
            description: 'Freight lifecycle successfully concluded.'
        }
    ];
};
