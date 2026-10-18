import { decryptId } from '@/lib/encryption';
import { resolveQuoteDistance } from '@/utils/geoDistance';

import { ExtraChargeItem, NormalizedCustomerOrder } from '../types/orderDetail.types';
import { calculateOrderPricing, calculatePayLaterDaysLeft } from './customerOrderPricingUtils';
import { resolveCustomerOrderStatus, resolveCustomerPaymentStatus } from './customerOrderStatusUtils';
import { buildCustomerOrderTimeline } from './customerOrderTimelineUtils';

export type { ExtraChargeItem, NormalizedCustomerOrder };
export { buildCustomerOrderTimeline };

export const buildNormalizedCustomerOrder = (
    paramId: string | undefined,
    foundOrder: any,
    isPodAcceptedState?: boolean,
    isPaidOverride?: boolean
): NormalizedCustomerOrder => {
    const decryptedParamId = paramId ? decryptId(paramId) : undefined;
    const rawId = foundOrder?.id || decryptedParamId || '1';
    const cleanNumericId = String(rawId).replace(/^ORD-0*/i, '') || '1';
    const formattedId = foundOrder?.order_number || foundOrder?.order_id || (
        decryptedParamId
            ? (decryptedParamId.startsWith('ORD-') ? decryptedParamId : `ORD-${String(decryptedParamId).replace(/^ORD-0*/i, '').padStart(4, '0')}`)
            : `ORD-${String(cleanNumericId).padStart(4, '0')}`
    );

    // Status Normalization
    const rawStatus = (foundOrder?.status_raw || foundOrder?.status || 'confirmed').toLowerCase().trim();
    const { displayStatus, isPodAccepted } = resolveCustomerOrderStatus(rawStatus, Boolean(isPodAcceptedState));

    // Payment Status Normalization
    const { paymentStatus, isPaid, isEscrow, isPayLater } = resolveCustomerPaymentStatus(foundOrder, cleanNumericId, isPaidOverride);

    const payLaterDueDate = foundOrder?.due_date || foundOrder?.pay_later_due_date || '17 Oct 2026';
    const payLaterDaysLeft = isPayLater ? calculatePayLaterDaysLeft(payLaterDueDate) : undefined;
    const payLaterTimeLeftFormatted = isPayLater
        ? (payLaterDaysLeft === 0 ? 'Due Today' : payLaterDaysLeft === 1 ? '1 Day Left' : `${payLaterDaysLeft} Days Left`)
        : undefined;

    // Address & City Normalization
    const pickupAddress = foundOrder?.pickup_address || foundOrder?.pickupAddress || foundOrder?.quote_request?.pickup_address || '-';
    const deliveryAddress = foundOrder?.delivery_address || foundOrder?.deliveryAddress || foundOrder?.quote_request?.delivery_address || '-';
    const fromCity = foundOrder?.pickup_city || foundOrder?.quote_request?.pickup_city || (pickupAddress !== 'Origin Address' ? pickupAddress.split(',')[0]?.trim() : '') || '-';
    const toCity = foundOrder?.delivery_city || foundOrder?.quote_request?.delivery_city || (deliveryAddress !== 'Destination Address' ? deliveryAddress.split(',')[0]?.trim() : '') || '-';

    // GPS Coordinates
    const pickupLat = foundOrder?.pickup_lat !== undefined && foundOrder?.pickup_lat !== null ? Number(foundOrder.pickup_lat) : (foundOrder?.quote_request?.pickup_lat ? Number(foundOrder.quote_request.pickup_lat) : null);
    const pickupLng = foundOrder?.pickup_lng !== undefined && foundOrder?.pickup_lng !== null ? Number(foundOrder.pickup_lng) : (foundOrder?.quote_request?.pickup_lng ? Number(foundOrder.quote_request.pickup_lng) : null);
    const deliveryLat = foundOrder?.delivery_lat !== undefined && foundOrder?.delivery_lat !== null ? Number(foundOrder.delivery_lat) : (foundOrder?.quote_request?.delivery_lat ? Number(foundOrder.quote_request.delivery_lat) : null);
    const deliveryLng = foundOrder?.delivery_lng !== undefined && foundOrder?.delivery_lng !== null ? Number(foundOrder.delivery_lng) : (foundOrder?.quote_request?.delivery_lng ? Number(foundOrder.quote_request.delivery_lng) : null);

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

    // Pricing calculation
    const { pricing } = calculateOrderPricing(foundOrder, isPaid, isPayLater);

    // Supplier Info
    const supplierObj = foundOrder?.supplier || {};
    const supplierName = foundOrder?.supplier_name || foundOrder?.carrier_name || supplierObj?.company_name || supplierObj?.name || '';
    const supplierAvatar = foundOrder?.supplier_avatar || foundOrder?.carrier_avatar || supplierObj?.profile_picture || supplierObj?.avatar;
    const supplierRating = Number(foundOrder?.carrier_rating ?? supplierObj?.rating ?? foundOrder?.rating ?? 0.0);
    const rawCompletedLoads = supplierObj?.completed_orders_count ?? supplierObj?.completed_orders ?? foundOrder?.completed_orders_count ?? foundOrder?.completed_orders;
    const completedOrders = typeof rawCompletedLoads === "string" ? (rawCompletedLoads.replace(/\D/g, "") || rawCompletedLoads) : (rawCompletedLoads ?? 0);

    // Vehicle Info
    const vehicleType = foundOrder?.vehicle || foundOrder?.vehicle_type || foundOrder?.truck_type || '-';
    const vehicleNumber = foundOrder?.vehicle_plate || foundOrder?.vehicle_number || foundOrder?.driver_plate || '-';
    const cargoWeight = foundOrder?.weight || foundOrder?.cargo_weight || foundOrder?.total_weight || '-';
    const goodsType = foundOrder?.type_of_pallets || foundOrder?.pallets || foundOrder?.items_summary || foundOrder?.goods_type || '-';

    // Driver Info
    const driverName = foundOrder?.driver_name || foundOrder?.driver?.name;
    const driverPhone = foundOrder?.driver_phone || foundOrder?.driver?.phone;
    const driverEmail = foundOrder?.driver_email || foundOrder?.driver?.email;

    // POD Info
    const rawPod = String(foundOrder?.pod_status || foundOrder?.tracking?.pod_status || '').toLowerCase().trim();
    const hasPodDoc = Boolean(
        foundOrder?.proof_of_delivery || foundOrder?.pod?.file_url || foundOrder?.pod?.proof ||
        foundOrder?.pod_url || foundOrder?.pod_file || foundOrder?.pod_document_url ||
        foundOrder?.tracking?.proof || foundOrder?.signature || foundOrder?.pod_signature
    );

    const isPodAcceptedCalculated = Boolean(
        isPodAccepted || rawStatus === 'completed' || rawStatus === 'pod_accepted' ||
        rawPod === 'confirmed' || rawPod === 'accepted' || rawPod === 'approved'
    );

    const isDeliveredStage = rawStatus === 'delivered' || rawStatus === 'pod_uploaded' || rawStatus === 'pod_review';
    const isPodAvailable = !isPodAcceptedCalculated && (hasPodDoc || isDeliveredStage);

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
            company: foundOrder?.pickup_company || foundOrder?.quote_request?.pickup_company || '',
            contactName: foundOrder?.pickup_contact_name || foundOrder?.quote_request?.pickup_contact_name || '-',
            contactPhone: foundOrder?.pickup_phone || foundOrder?.pickup_contact_phone || foundOrder?.quote_request?.pickup_phone || '-',
            contactEmail: foundOrder?.pickup_email || foundOrder?.quote_request?.pickup_email || '',
            date: foundOrder?.pickup_date || foundOrder?.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            time: foundOrder?.pickup_time || (foundOrder?.quote_request?.pickup_time_from ? foundOrder.quote_request.pickup_time_from.slice(0, 5) : ''),
            lat: pickupLat,
            lng: pickupLng,
            instructions: foundOrder?.pickup_instructions || foundOrder?.quote_request?.pickup_instructions || '',
        },
        delivery: {
            city: toCity,
            address: deliveryAddress,
            company: foundOrder?.delivery_company || foundOrder?.quote_request?.delivery_company || '',
            contactName: foundOrder?.delivery_contact_name || foundOrder?.quote_request?.delivery_contact_name || '-',
            contactPhone: foundOrder?.delivery_phone || foundOrder?.delivery_contact_phone || foundOrder?.quote_request?.delivery_phone || '-',
            contactEmail: foundOrder?.delivery_email || foundOrder?.quote_request?.delivery_email || '',
            date: foundOrder?.delivery_date || foundOrder?.delivery_date_to || new Date().toISOString().slice(0, 10),
            time: foundOrder?.delivery_time || (foundOrder?.quote_request?.delivery_time_to ? foundOrder.quote_request.delivery_time_to.slice(0, 5) : ''),
            lat: deliveryLat,
            lng: deliveryLng,
            instructions: foundOrder?.delivery_instructions || foundOrder?.quote_request?.delivery_instructions || '',
        },
        route: `${fromCity} → ${toCity}`,
        distance: distanceFormatted,
        distanceKm: distanceKmVal,
        pickupLat: pickupLat,
        pickupLng: pickupLng,
        deliveryLat: deliveryLat,
        deliveryLng: deliveryLng,
        estArrival: foundOrder?.estimated_delivery || foundOrder?.estimated_time || foundOrder?.eta || 'Scheduled',
        vehicle: {
            type: vehicleType,
            number: vehicleNumber,
            capacity: cargoWeight ? `${cargoWeight} kg` : '-',
            goodsType: goodsType,
            dimensions: foundOrder?.dimensions || '-',
        },
        driver: driverName ? {
            name: driverName,
            phone: driverPhone || '',
            email: driverEmail || '',
            plate: vehicleNumber,
        } : undefined,
        supplier: {
            id: supplierObj?.id || foundOrder?.supplier_id || 2,
            name: supplierName || '',
            avatar: supplierAvatar,
            verified: Boolean(supplierObj?.is_verified ?? foundOrder?.supplier?.is_verified ?? true),
            rating: supplierRating > 0 ? supplierRating : 5.0,
            reviews: Number(supplierObj?.reviews_count ?? foundOrder?.supplier?.reviews_count ?? foundOrder?.reviews_count ?? 0),
            completedOrders: (supplierObj?.completed_orders_count ?? supplierObj?.completed_orders ?? completedOrders ?? 0),
            successRate: supplierObj?.success_rate || foundOrder?.supplier?.success_rate || foundOrder?.success_rate || "100%",
            responseTime: supplierObj?.response_time || foundOrder?.supplier?.response_time || foundOrder?.response_time || "< 15 mins",
            location: supplierObj?.location || foundOrder?.supplier_location || (supplierObj?.city ? (supplierObj.city + (supplierObj.country ? ", " + supplierObj.country : "")) : "Dhaka, Bangladesh"),
            memberSince: supplierObj?.member_since || foundOrder?.supplier?.member_since || "----",
            phone: supplierObj?.phone || foundOrder?.supplier_phone || '',
            email: supplierObj?.email || foundOrder?.supplier_email || '',
        },
        pricing: pricing,
        pod: {
            isAvailable: isPodAvailable,
            isAccepted: isPodAcceptedCalculated,
            fileUrl: foundOrder?.pod_document_url || foundOrder?.proof_of_delivery || foundOrder?.pod?.file_url || foundOrder?.pod_url || '',
            fileName: foundOrder?.pod_file_name || 'POD_Receipt.pdf',
            signatureUrl: foundOrder?.signature || foundOrder?.pod_signature || foundOrder?.pod?.signature || '',
            receiverName: foundOrder?.receiver_name || foundOrder?.pod?.receiver_name || '',
            note: foundOrder?.pod?.note || foundOrder?.pod_note || '',
            uploadedAt: foundOrder?.pod_uploaded_at || foundOrder?.pod?.uploaded_at || '',
        },
        isRated: Boolean(foundOrder?.is_rated || foundOrder?.customer_review || foundOrder?.rating_given),
        quoteId: foundOrder?.quote_id || foundOrder?.quote_request_id || cleanNumericId,
        orderType: foundOrder?.order_type || 'Standard Freight',
        serviceType: foundOrder?.service_type || 'Direct Dispatch',
        reference: foundOrder?.reference || `REF-${cleanNumericId}`,
        instructions: foundOrder?.instructions || '-',
        loadType: foundOrder?.load_type || 'Full Truckload',
    };
};
