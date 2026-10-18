import { resolveSupplierOrderStatus, resolveSupplierPaymentInfo } from './supplierOrderPricingUtils';
import { buildSupplierOrderTimeline } from './supplierOrderTimelineUtils';

export { buildSupplierOrderTimeline };

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
        location?: string;
        paymentRecord?: string;
        payoutTerms?: string;
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
    pickupCompany?: string;
    deliveryCompany?: string;
    pickupContactName?: string;
    pickupContactPhone?: string;
    deliveryContactName?: string;
    deliveryContactPhone?: string;
    orderType?: string;
    serviceType?: string;
    reference?: string;
    loadType?: string;
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
    const displayStatus = resolveSupplierOrderStatus(rawStatus, isPodAccepted);

    const { isPaid, isPayLater, isEscrow, paymentStatusLabel } = resolveSupplierPaymentInfo(foundOrder, rawStatus, cleanNum);

    const pickupFullAddress = foundOrder?.shipping?.from || foundOrder?.pickup_address || foundOrder?.pickupFullAddress || foundOrder?.quote_request?.pickup_address || '-';
    const deliveryFullAddress = foundOrder?.shipping?.to || foundOrder?.delivery_address || foundOrder?.deliveryFullAddress || foundOrder?.quote_request?.delivery_address || '-';
    const fromCity = foundOrder?.pickup_city || foundOrder?.quote_request?.pickup_city || (pickupFullAddress !== '-' ? pickupFullAddress.split(',')[0]?.trim() : '') || '-';
    const toCity = foundOrder?.delivery_city || foundOrder?.quote_request?.delivery_city || (deliveryFullAddress !== '-' ? deliveryFullAddress.split(',')[0]?.trim() : '') || '-';

    const totalAmount = Number(foundOrder?.payout_amount ?? foundOrder?.payment?.payout_amount ?? foundOrder?.payment?.total ?? foundOrder?.amount_raw ?? foundOrder?.total_amount ?? foundOrder?.amount ?? 0);
    const customerName = foundOrder?.client?.name || foundOrder?.client?.company_name || foundOrder?.customer?.name || foundOrder?.customer?.company_name || foundOrder?.customer_name || (typeof foundOrder?.customer === 'string' ? foundOrder.customer : '-');
    const vehicleType = foundOrder?.shipping?.service || foundOrder?.vehicle?.type || foundOrder?.vehicle_type || foundOrder?.truck_type || foundOrder?.quote_request?.vehicle_type || (typeof foundOrder?.vehicle === 'string' ? foundOrder.vehicle : '-');
    const cargoWeight = foundOrder?.shipment?.total_weight || foundOrder?.weight || foundOrder?.cargo_weight || foundOrder?.quote_request?.weight || '-';
    const loadType = foundOrder?.shipment?.description || foundOrder?.pallet_type || foundOrder?.load_type || foundOrder?.type_of_pallets || foundOrder?.quote_request?.load_type || '-';

    let driverName = '-';
    if (assignedDriver?.name) driverName = assignedDriver.name;
    else if (foundOrder?.driver_name && foundOrder.driver_name !== 'Unassigned') driverName = foundOrder.driver_name;
    else if (foundOrder?.driver?.name && foundOrder.driver.name !== 'Unassigned') driverName = foundOrder.driver.name;
    else if (typeof foundOrder?.driver === 'string' && foundOrder.driver && foundOrder.driver !== 'Unassigned') driverName = foundOrder.driver;

    const driverPhone = assignedDriver?.phone || foundOrder?.driverPhone || foundOrder?.driver_phone || foundOrder?.driver?.phone || '';
    const driverEmail = assignedDriver?.email || foundOrder?.driverEmail || foundOrder?.driver_email || foundOrder?.driver?.email || '';
    const vehiclePlate = assignedDriver?.plate || foundOrder?.vehiclePlate || foundOrder?.vehicle_plate || foundOrder?.driver?.vehicle_plate || foundOrder?.vehicle?.number || '-';

    const distanceKmVal = foundOrder?.distance_km ? Number(foundOrder.distance_km) : null;
    const distanceFormatted = foundOrder?.distance || (distanceKmVal ? `${distanceKmVal} km` : '-');

    return {
        id: formattedId,
        rawId,
        orderNumber: foundOrder?.order_no || foundOrder?.order_number || formattedId,
        from: fromCity,
        to: toCity,
        pickupCity: fromCity,
        deliveryCity: toCity,
        pickupFullAddress,
        deliveryFullAddress,
        pickup_address: pickupFullAddress,
        delivery_address: deliveryFullAddress,
        pickup_lat: foundOrder?.pickup_lat ? Number(foundOrder.pickup_lat) : null,
        pickup_lng: foundOrder?.pickup_lng ? Number(foundOrder.pickup_lng) : null,
        delivery_lat: foundOrder?.delivery_lat ? Number(foundOrder.delivery_lat) : null,
        delivery_lng: foundOrder?.delivery_lng ? Number(foundOrder.delivery_lng) : null,
        distance_km: distanceKmVal,
        distance: distanceFormatted,
        status: displayStatus,
        rawStatus,
        pickupDate: foundOrder?.shipping?.pickup_at || foundOrder?.pickup_date || foundOrder?.pickupDate || foundOrder?.quote_request?.pickup_date || '-',
        deliveryDate: foundOrder?.shipping?.delivery_at || foundOrder?.delivery_date || foundOrder?.deliveryDate || foundOrder?.quote_request?.delivery_date || '-',
        estArrival: foundOrder?.delivery_date || foundOrder?.estimated_delivery || foundOrder?.est_arrival || foundOrder?.eta || foundOrder?.expected_transit_time || '-',
        estimatedTime: foundOrder?.estimated_time || foundOrder?.shipping?.duration || '-',
        vehicle: {
            type: vehicleType,
            number: vehiclePlate,
            capacity: String(cargoWeight).toUpperCase().includes('KG') || String(cargoWeight).toUpperCase().includes('T') ? String(cargoWeight) : (cargoWeight !== '-' ? `${cargoWeight} KG` : '-'),
            goodsType: loadType
        },
        driver: { id: foundOrder?.driver_id || foundOrder?.driver?.id, name: driverName, phone: driverPhone, email: driverEmail },
        customer: {
            id: foundOrder?.client?.id || foundOrder?.customer?.id,
            name: customerName,
            companyName: customerName,
            avatar: foundOrder?.client?.avatar || foundOrder?.customer?.avatar,
            verified: Boolean(foundOrder?.client?.verified ?? foundOrder?.customer?.verified),
            rating: Number(foundOrder?.client?.rating ?? foundOrder?.customer?.rating ?? foundOrder?.customer_rating ?? 0.0),
            reviews: Number(foundOrder?.client?.reviews || foundOrder?.customer?.reviews || 0),
            active: foundOrder?.client?.active || foundOrder?.customer?.active || '-',
            memberSince: foundOrder?.client?.member_since || foundOrder?.customer?.member_since || '-',
            completedOrders: Number(foundOrder?.client?.completed_orders || foundOrder?.customer?.completed_orders || 0)
        },
        pricing: {
            base: totalAmount,
            total: totalAmount,
            netPayout: totalAmount,
            paymentStatus: paymentStatusLabel,
            paymentStatusLabel,
            isPaid,
            isPayLater,
            isEscrow,
            escrowGuaranteed: true
        },
        payment: { status: paymentStatusLabel, isPaid, isPayLater, isEscrow, escrowGuaranteed: true },
        podUploaded: isPodAccepted || foundOrder?.pod_status === 'Approved' || foundOrder?.pod_status === 'Pending Review' || foundOrder?.podStatus === 'Approved' || rawStatus === 'delivered' || rawStatus === 'pod_uploaded',
        podStatus: foundOrder?.pod_status || foundOrder?.podStatus || (isPodAccepted ? 'Approved' : ((rawStatus === 'delivered' || rawStatus === 'pod_uploaded') ? 'Pending Review' : 'Not Uploaded')),
        podFileUrl: foundOrder?.tracking?.proof || foundOrder?.pod_document_url || foundOrder?.podFileUrl || foundOrder?.proof_of_delivery || '',
        instructions: foundOrder?.shipping?.instructions || foundOrder?.instructions || foundOrder?.special_instructions || foundOrder?.pickup_instructions || '-',
        pickupCompany: foundOrder?.pickup_company || foundOrder?.quote_request?.pickup_company || '-',
        deliveryCompany: foundOrder?.delivery_company || foundOrder?.quote_request?.delivery_company || '-',
        pickupContactName: foundOrder?.pickup_contact_name || foundOrder?.quote_request?.pickup_contact_name || '-',
        pickupContactPhone: foundOrder?.pickup_phone || foundOrder?.pickup_contact_phone || foundOrder?.quote_request?.pickup_phone || '',
        deliveryContactName: foundOrder?.delivery_contact_name || foundOrder?.quote_request?.delivery_contact_name || '-',
        deliveryContactPhone: foundOrder?.delivery_phone || foundOrder?.delivery_contact_phone || foundOrder?.quote_request?.delivery_phone || '',
        orderType: foundOrder?.order_type || foundOrder?.shipment_type || foundOrder?.quote_request?.shipment_type || '-',
        serviceType: foundOrder?.service_type || foundOrder?.quote_request?.service_type || (distanceFormatted !== '-' ? `${distanceFormatted} Direct Transit` : '-'),
        reference: foundOrder?.internal_reference || foundOrder?.reference || foundOrder?.quote_request?.internal_reference || formattedId,
        loadType,
    };
};

export default buildSupplierOrderDetails;
