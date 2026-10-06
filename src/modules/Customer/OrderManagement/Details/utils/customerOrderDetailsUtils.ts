import { decryptId } from '@/lib/encryption';
import { resolveQuoteDistance } from '@/utils/geoDistance';

export interface ExtraChargeItem {
    id?: string | number;
    name: string;
    amount: number;
    amountFormatted: string;
}

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
    payLaterDaysLeft?: number;
    payLaterTimeLeftFormatted?: string;
    paymentMethod?: string;
    pickup: {
        city: string;
        address: string;
        company?: string;
        contactName: string;
        contactPhone: string;
        contactEmail?: string;
        date: string;
        time: string;
        lat?: number | null;
        lng?: number | null;
        instructions?: string;
    };
    delivery: {
        city: string;
        address: string;
        company?: string;
        contactName: string;
        contactPhone: string;
        contactEmail?: string;
        date: string;
        time: string;
        lat?: number | null;
        lng?: number | null;
        instructions?: string;
    };
    route: string;
    distance: string;
    distanceKm?: number | null;
    pickupLat?: number | null;
    pickupLng?: number | null;
    deliveryLat?: number | null;
    deliveryLng?: number | null;
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
        base: number;
        extra: number;
        extraCharges: ExtraChargeItem[];
        total: number;
        baseFormatted: string;
        extraFormatted: string;
        totalFormatted: string;
        advancePaid: number;
        due: number;
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
    const decryptedParamId = paramId ? decryptId(paramId) : undefined;
    const rawId = foundOrder?.id || decryptedParamId || '1';
    const cleanNumericId = String(rawId).replace(/^ORD-0*/i, '') || '1';
    const formattedId = decryptedParamId
        ? (decryptedParamId.startsWith('ORD-') ? decryptedParamId : `ORD-${String(decryptedParamId).replace(/^ORD-0*/i, '').padStart(4, '0')}`)
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

    const calculatePayLaterDaysLeft = (dueDateStr?: string): number => {
        if (!dueDateStr) return 23;
        try {
            const due = new Date(dueDateStr);
            if (isNaN(due.getTime())) return 23;
            const now = new Date();
            const diffMs = due.getTime() - now.getTime();
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            return Math.max(0, diffDays);
        } catch {
            return 23;
        }
    };

    const payLaterDaysLeft = isPayLater ? calculatePayLaterDaysLeft(payLaterDueDate) : undefined;
    const payLaterTimeLeftFormatted = isPayLater
        ? (payLaterDaysLeft === 0 ? 'Due Today' : payLaterDaysLeft === 1 ? '1 Day Left' : `${payLaterDaysLeft} Days Left`)
        : undefined;

    // Address & City Normalization
    const pickupAddress = foundOrder?.pickup_address || foundOrder?.pickupAddress || foundOrder?.quote_request?.pickup_address || 'Origin Address';
    const deliveryAddress = foundOrder?.delivery_address || foundOrder?.deliveryAddress || foundOrder?.quote_request?.delivery_address || 'Destination Address';
    const fromCity = foundOrder?.pickup_city || foundOrder?.quote_request?.pickup_city || (pickupAddress !== 'Origin Address' ? pickupAddress.split(',')[0]?.trim() : '') || 'Origin';
    const toCity = foundOrder?.delivery_city || foundOrder?.quote_request?.delivery_city || (deliveryAddress !== 'Destination Address' ? deliveryAddress.split(',')[0]?.trim() : '') || 'Destination';

    // GPS Coordinates
    const pickupLat = foundOrder?.pickup_lat !== undefined && foundOrder?.pickup_lat !== null
        ? Number(foundOrder.pickup_lat)
        : (foundOrder?.quote_request?.pickup_lat ? Number(foundOrder.quote_request.pickup_lat) : null);
    const pickupLng = foundOrder?.pickup_lng !== undefined && foundOrder?.pickup_lng !== null
        ? Number(foundOrder.pickup_lng)
        : (foundOrder?.quote_request?.pickup_lng ? Number(foundOrder.quote_request.pickup_lng) : null);
    const deliveryLat = foundOrder?.delivery_lat !== undefined && foundOrder?.delivery_lat !== null
        ? Number(foundOrder.delivery_lat)
        : (foundOrder?.quote_request?.delivery_lat ? Number(foundOrder.quote_request.delivery_lat) : null);
    const deliveryLng = foundOrder?.delivery_lng !== undefined && foundOrder?.delivery_lng !== null
        ? Number(foundOrder.delivery_lng)
        : (foundOrder?.quote_request?.delivery_lng ? Number(foundOrder.quote_request.delivery_lng) : null);

    // Distance Resolution
    const resolvedDistance = resolveQuoteDistance(foundOrder);
    let distanceFormatted = '—';
    if (foundOrder?.distance && String(foundOrder.distance).trim() !== '' && foundOrder.distance !== '—') {
        distanceFormatted = String(foundOrder.distance).toLowerCase().includes('km') || String(foundOrder.distance).toLowerCase().includes('mi')
            ? String(foundOrder.distance)
            : `${foundOrder.distance} km`;
    } else if (foundOrder?.distance_km !== undefined && foundOrder?.distance_km !== null && !isNaN(Number(foundOrder.distance_km)) && Number(foundOrder.distance_km) > 0) {
        distanceFormatted = `${Number(foundOrder.distance_km).toLocaleString()} km`;
    } else if (resolvedDistance.distanceStr && resolvedDistance.distanceStr !== '—') {
        distanceFormatted = resolvedDistance.distanceStr;
    }

    const distanceKmVal = Number(foundOrder?.distance_km ?? resolvedDistance.distanceKm ?? 0);

    // Contact Details
    const pickupCompany = foundOrder?.pickup_company || foundOrder?.quote_request?.pickup_company || '';
    const pickupContactName = foundOrder?.pickup_contact_name || foundOrder?.quote_request?.pickup_contact_name || 'Warehouse Dispatch Desk';
    const pickupContactPhone = foundOrder?.pickup_phone || foundOrder?.pickup_contact_phone || foundOrder?.quote_request?.pickup_phone || '+49 30 555-0192';
    const pickupEmail = foundOrder?.pickup_email || foundOrder?.quote_request?.pickup_email || '';
    const pickupInstructions = foundOrder?.pickup_instructions || foundOrder?.quote_request?.pickup_instructions || '';

    const deliveryCompany = foundOrder?.delivery_company || foundOrder?.quote_request?.delivery_company || '';
    const deliveryContactName = foundOrder?.delivery_contact_name || foundOrder?.quote_request?.delivery_contact_name || 'Receiving Logistics Dept.';
    const deliveryContactPhone = foundOrder?.delivery_phone || foundOrder?.delivery_contact_phone || foundOrder?.quote_request?.delivery_phone || '+49 40 555-0188';
    const deliveryEmail = foundOrder?.delivery_email || foundOrder?.quote_request?.delivery_email || '';
    const deliveryInstructions = foundOrder?.delivery_instructions || foundOrder?.quote_request?.delivery_instructions || '';

    // Pricing Normalization
    const totalAmount = Number(
        foundOrder?.total_amount_raw ??
        foundOrder?.amount_raw ??
        (foundOrder?.total_amount ? parseFloat(String(foundOrder.total_amount).replace(/[^0-9.]/g, '')) : (foundOrder?.amount ? parseFloat(String(foundOrder.amount).replace(/[^0-9.]/g, '')) : 1250))
    ) || 1250;

    // Individual itemized extra charges breakdown
    let extraChargesList: ExtraChargeItem[] = [];
    const rawExtraCharges = foundOrder?.extra_charges || foundOrder?.extraCharges || foundOrder?.quote?.extra_charges;
    if (Array.isArray(rawExtraCharges) && rawExtraCharges.length > 0) {
        extraChargesList = rawExtraCharges.map((ch: any, idx: number) => {
            const amount = Number(ch.amount ?? ch.price ?? 0);
            const name = ch.custom_name || ch.customName || ch.name || ch.title || ch.type || `Extra Service #${idx + 1}`;
            return {
                id: ch.id || idx,
                name: name,
                amount: amount,
                amountFormatted: `+€ ${amount.toLocaleString()}`,
            };
        });
    }

    const extraTotalCalculated = extraChargesList.reduce((acc, c) => acc + c.amount, 0);

    const basePrice = Number(
        foundOrder?.base_price ??
        foundOrder?.base_amount ??
        foundOrder?.base_rate ??
        foundOrder?.base ??
        (extraTotalCalculated > 0 && totalAmount > extraTotalCalculated ? (totalAmount - extraTotalCalculated) : Math.round(totalAmount * 0.85))
    );

    const extraPrice = extraTotalCalculated > 0 ? extraTotalCalculated : Number(foundOrder?.extra_price ?? foundOrder?.extra ?? Math.max(0, totalAmount - basePrice));

    if (extraChargesList.length === 0 && extraPrice > 0) {
        const loadingAmt = Math.round(extraPrice * 0.55);
        const insuranceAmt = extraPrice - loadingAmt;
        extraChargesList = [
            {
                id: 'loading',
                name: 'Loading & Handling',
                amount: loadingAmt,
                amountFormatted: `+€ ${loadingAmt.toLocaleString()}`,
            },
            {
                id: 'insurance',
                name: 'CMR Cargo Insurance',
                amount: insuranceAmt,
                amountFormatted: `+€ ${insuranceAmt.toLocaleString()}`,
            },
        ];
    }

    const advancePaid = isPaid ? totalAmount : isPayLater ? 0 : Math.round(totalAmount * 0.30);
    const dueBalance = isPaid ? 0 : isPayLater ? totalAmount : totalAmount - advancePaid;

    // Supplier Info
    const supplierObj = foundOrder?.supplier || {};
    const supplierName = foundOrder?.supplier_name || foundOrder?.carrier_name || supplierObj?.company_name || supplierObj?.name || 'Carrier Partner';
    const supplierAvatar = foundOrder?.supplier_avatar || foundOrder?.carrier_avatar || supplierObj?.profile_picture || supplierObj?.avatar;
    const supplierRating = Number(foundOrder?.carrier_rating || supplierObj?.rating || foundOrder?.rating || 4.9);
    const completedOrders = supplierObj?.completed_orders || foundOrder?.completed_orders || '0 completed';

    // Vehicle Info
    const vehicleType = foundOrder?.vehicle || foundOrder?.vehicle_type || foundOrder?.truck_type || 'Cargo Van';
    const vehicleNumber = foundOrder?.vehicle_plate || foundOrder?.vehicle_number || foundOrder?.driver_plate || (rawStatus === 'confirmed' ? 'Pending Assignment' : 'B-DF 4892');
    const cargoWeight = foundOrder?.weight || foundOrder?.cargo_weight || foundOrder?.total_weight || '345 KG';
    const goodsType = foundOrder?.type_of_pallets || foundOrder?.pallets || foundOrder?.items_summary || foundOrder?.goods_type || '1 Pallet';

    // Driver Info
    const driverName = foundOrder?.driver_name || foundOrder?.driver?.name;
    const driverPhone = foundOrder?.driver_phone || foundOrder?.driver?.phone;
    const driverEmail = foundOrder?.driver_email || foundOrder?.driver?.email;
    const hasDriver = Boolean(driverName && driverName !== 'Unassigned' && driverName !== 'Pending');

    // POD Info
    const rawPod = String(foundOrder?.pod_status || foundOrder?.tracking?.pod_status || '').toLowerCase().trim();
    const hasPodDoc = Boolean(
        foundOrder?.proof_of_delivery || 
        foundOrder?.pod?.file_url ||
        foundOrder?.pod?.proof ||
        foundOrder?.pod_url ||
        foundOrder?.pod_file ||
        foundOrder?.pod_document_url || 
        foundOrder?.tracking?.proof || 
        foundOrder?.signature ||
        foundOrder?.pod_signature
    );

    const isPodAcceptedCalculated = Boolean(
        isPodAccepted ||
        rawStatus === 'completed' || 
        rawStatus === 'pod_accepted' || 
        rawPod === 'confirmed' || 
        rawPod === 'accepted' || 
        rawPod === 'approved'
    );

    const isDeliveredStage = rawStatus === 'delivered' || rawStatus === 'pod_uploaded' || rawStatus === 'pod_review';
    // Show POD review panel ONLY when a file/signature has actually been uploaded by driver
    // If just in delivered stage without a file, show the 'pending' state instead
    const isPodAvailable = !isPodAcceptedCalculated && hasPodDoc;

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
        payLaterDaysLeft: payLaterDaysLeft,
        payLaterTimeLeftFormatted: payLaterTimeLeftFormatted,
        pickup: {
            city: fromCity,
            address: pickupAddress,
            company: pickupCompany,
            contactName: pickupContactName,
            contactPhone: pickupContactPhone,
            contactEmail: pickupEmail,
            date: foundOrder?.pickup_date || foundOrder?.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            time: foundOrder?.pickup_time || '08:30 AM',
            lat: pickupLat,
            lng: pickupLng,
            instructions: pickupInstructions,
        },
        delivery: {
            city: toCity,
            address: deliveryAddress,
            company: deliveryCompany,
            contactName: deliveryContactName,
            contactPhone: deliveryContactPhone,
            contactEmail: deliveryEmail,
            date: foundOrder?.delivery_date || foundOrder?.estimated_delivery || new Date(Date.now() + 86400000).toISOString().slice(0, 10),
            time: foundOrder?.delivery_time || '04:00 PM',
            lat: deliveryLat,
            lng: deliveryLng,
            instructions: deliveryInstructions,
        },
        route: `${fromCity} ➔ ${toCity}`,
        distance: distanceFormatted,
        distanceKm: distanceKmVal,
        pickupLat: pickupLat,
        pickupLng: pickupLng,
        deliveryLat: deliveryLat,
        deliveryLng: deliveryLng,
        estArrival: foundOrder?.delivery_date || foundOrder?.estimated_delivery || foundOrder?.eta || '48h',
        vehicle: {
            type: vehicleType,
            number: vehicleNumber,
            capacity: String(cargoWeight).toUpperCase().includes('KG') || String(cargoWeight).toUpperCase().includes('T') ? String(cargoWeight) : `${cargoWeight} KG`,
            goodsType: goodsType,
            dimensions: foundOrder?.dimensions || '23 × 21 × 33 cm',
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
            base: basePrice,
            extra: extraPrice,
            extraCharges: extraChargesList,
            total: totalAmount,
            baseFormatted: `€ ${basePrice.toLocaleString()}`,
            extraFormatted: `€ ${extraPrice.toLocaleString()}`,
            totalFormatted: `€ ${totalAmount.toLocaleString()}`,
            advancePaid: advancePaid,
            due: dueBalance,
            advanceFormatted: `€ ${advancePaid.toLocaleString()}`,
            dueFormatted: `€ ${dueBalance.toLocaleString()}`,
        },
        pod: {
            isAvailable: isPodAvailable,
            isAccepted: isPodAcceptedCalculated,
            fileUrl: foundOrder?.proof_of_delivery || foundOrder?.pod?.file_url || foundOrder?.pod?.proof || foundOrder?.pod_url || foundOrder?.pod_file || foundOrder?.tracking?.proof || foundOrder?.pod_document_url || '',
            fileName: foundOrder?.pod_file_name || foundOrder?.pod?.file_name || (foundOrder?.proof_of_delivery ? foundOrder.proof_of_delivery.split('/').pop() : null) || '',
            signatureUrl: foundOrder?.signature || foundOrder?.signature_url || foundOrder?.pod?.signature || foundOrder?.tracking?.signature || '',
            receiverName: foundOrder?.receiver_name || foundOrder?.pod?.receiver_name || foundOrder?.tracking?.receiver_name || foundOrder?.delivery_contact_name || '',
            note: foundOrder?.pod_note || foundOrder?.status_note || foundOrder?.tracking?.note || '',
            uploadedAt: foundOrder?.pod_uploaded_at || foundOrder?.pod?.uploaded_at || '',
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

    // Determine current milestone step in the 7-step lifecycle:
    // 1 = Order Confirmed & Booked (Booking confirmed in Escrow)
    // 2 = Driver Assignment (Carrier allocating Driver & Vehicle)
    // 3 = Goods Picked Up (Driver assigned, arriving at pickup location)
    // 4 = In Transit on Route (En route with live tracking)
    // 5 = Arrived at Destination (Arrived at recipient dock)
    // 6 = Review & Accept POD (Driver uploaded signed POD receipt)
    // 7 = Order Completed (POD accepted, Escrow settled)
    let currentStep = 2; // Default for confirmed orders is awaiting driver assignment (Step 2)

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
        currentStep = 8; // All steps completed
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
            description: 'Quotation accepted and carrier booking confirmed in Escrow.'
        },
        {
            id: 2,
            status: order.driver ? 'Driver & Fleet Assigned' : 'Driver Assignment',
            time: (currentStep > 2 || isAllCompleted) ? formatDate(-8, 30) : (currentStep === 2 ? 'In Progress' : 'Pending Carrier'),
            completed: currentStep > 2 || isAllCompleted,
            active: currentStep === 2,
            location: order.driver ? `${order.driver.name} (${order.vehicle.number})` : 'Carrier Fleet Dispatch',
            description: order.driver ? `Assigned driver ${order.driver.name} with vehicle plate ${order.vehicle.number}` : 'Carrier is allocating driver and vehicle.'
        },
        {
            id: 3,
            status: 'Goods Picked Up',
            time: (currentStep > 3 || isAllCompleted) ? formatDate(-4, 0) : (currentStep === 3 ? 'In Progress' : 'Scheduled Date'),
            completed: currentStep > 3 || isAllCompleted,
            active: currentStep === 3,
            location: order.pickup.address,
            description: 'Cargo verified, secured, and departed pickup facility.'
        },
        {
            id: 4,
            status: 'In Transit on Route',
            time: (currentStep > 4 || isAllCompleted) ? formatDate(-1, 15) : (currentStep === 4 ? 'Live GPS Tracking' : 'Estimated En Route'),
            completed: currentStep > 4 || isAllCompleted,
            active: currentStep === 4,
            location: `Highway Route: ${order.pickup.city} ➔ ${order.delivery.city}`,
            description: 'Live GPS tracked on designated corridor.'
        },
        {
            id: 5,
            status: 'Arrived at Destination',
            time: (currentStep > 5 || isAllCompleted) ? formatDate(0, 0) : (currentStep === 5 ? 'Arrived' : order.estArrival),
            completed: currentStep > 5 || isAllCompleted,
            active: currentStep === 5,
            location: order.delivery.address,
            description: 'Vehicle arrived at recipient unloading dock.'
        },
        {
            id: 6,
            status: isPodAccepted || isAllCompleted ? 'POD Verified & Approved' : 'Review & Accept POD',
            time: (isPodAccepted || isAllCompleted) ? formatDate(0, 45) : (currentStep === 6 ? 'Action Required' : 'Awaiting Delivery'),
            completed: isPodAccepted || isAllCompleted,
            active: currentStep === 6 && !isPodAccepted,
            location: 'Customer Verification',
            description: (isPodAccepted || isAllCompleted) ? 'Proof of delivery verified and Escrow payment settled.' : 'Signed delivery receipt uploaded by driver for customer approval.'
        },
        {
            id: 7,
            status: 'Order Completed',
            time: (isPodAccepted || isAllCompleted) ? formatDate(1, 0) : 'Pending Final POD',
            completed: isPodAccepted || isAllCompleted,
            active: false,
            location: 'Settled & Closed',
            description: 'Freight lifecycle successfully concluded.'
        }
    ];
};
