import { ShipmentItem, ShipmentStatus } from '../types';

function extractPodData(raw: any) {
    const podRaw =
        raw.proof_of_delivery ||
        raw.proof ||
        raw.tracking?.proof_of_delivery ||
        raw.tracking?.proof ||
        raw.tracking?.signature ||
        raw.signature ||
        raw.podData;

    if (!podRaw) return undefined;

    return {
        uploadedAt:
            raw.pod_uploaded_at ||
            raw.tracking?.pod_uploaded_at ||
            raw.podData?.uploadedAt ||
            raw.updated_at ||
            '',
        receiverName: raw.receiver_name || raw.tracking?.receiver_name || raw.podData?.receiverName || '',
        signatureUrl: raw.signature || raw.signature_url || raw.tracking?.signature || raw.podData?.signatureUrl,
        documentPhotos: (raw.proof_of_delivery || raw.proof || raw.tracking?.proof_of_delivery || raw.tracking?.proof)
            ? [raw.proof_of_delivery || raw.proof || raw.tracking?.proof_of_delivery || raw.tracking?.proof]
            : raw.podData?.documentPhotos || [],
        notes: raw.tracking?.note || raw.podData?.notes || '',
    };
}

export function mapBackendShipmentToShipmentItem(raw: any): ShipmentItem {
    if (!raw) return raw;

    let status: ShipmentStatus = 'assigned';
    const rawStatus = String(raw.status || '').toLowerCase();
    const podStatus = String(raw.pod_status || raw.tracking?.pod_status || '').toLowerCase();

    if (rawStatus === 'completed' || podStatus === 'confirmed' || podStatus === 'approved') {
        status = 'completed';
    } else if (rawStatus === 'delivered' || podStatus === 'pending' || podStatus === 'awaiting') {
        status = 'delivered';
    } else if (rawStatus === 'driver_assigned' || rawStatus === 'assigned') {
        status = 'assigned';
    } else if (rawStatus === 'accepted') {
        status = 'accepted';
    } else if (rawStatus === 'in_progress' || rawStatus === 'picked_up') {
        status = 'at_pickup';
    } else if (rawStatus === 'in_transit') {
        status = 'in_transit';
    } else if (rawStatus === 'arrived') {
        status = 'at_delivery';
    } else if (rawStatus === 'cancelled') {
        status = 'cancelled';
    }

    const orderNumber = raw.order_number || raw.orderNumber || raw.order_no || `ORD-${raw.id}`;
    const trackingNumber = raw.tracking_number || raw.trackingNumber || `TRK-${String(orderNumber).replace(/[^0-9]/g, '') || raw.id}`;

    const shipperName = raw.pickup?.contact_name || raw.customer?.name || raw.shipper?.name || 'Shipper Contact';
    const shipperCompany = raw.pickup?.company || raw.customer?.company_name || raw.customer?.name || raw.shipper?.company || '-';
    const shipperPhone = raw.pickup?.phone || raw.pickup?.contact_phone || raw.customer?.phone || raw.shipper?.phone || '—';
    const pickupAddress = raw.pickup?.address || raw.pickup_address || raw.shipper?.address || '-';
    const pickupCity = raw.pickup?.city || raw.shipper?.city || 'Origin';
    const pickupDate = raw.pickup?.date || raw.pickup?.raw_date || raw.pickup_date || 'Scheduled';
    const pickupTimeWindow = raw.pickup?.time || raw.estimated_time || '08:00 AM - 12:00 PM';

    const consigneeName = raw.delivery?.contact_name || raw.consignee?.name || 'Consignee Contact';
    const consigneeCompany = raw.delivery?.company || raw.delivery?.company_name || raw.delivery?.contact_name || raw.consignee?.company || '-';
    const consigneePhone = raw.delivery?.phone || raw.delivery?.contact_phone || raw.consignee?.phone || '—';
    const deliveryAddress = raw.delivery?.address || raw.delivery_address || raw.consignee?.address || 'Delivery Location';
    const deliveryCity = raw.delivery?.city || raw.consignee?.city || 'Destination';
    const deliveryDate = raw.delivery?.date || raw.delivery?.raw_date || 'Upcoming';
    const deliveryTimeWindow = raw.delivery?.time || '12:00 PM - 05:00 PM';

    const rawWeight = raw.cargo?.total_weight ?? raw.cargo?.weightKg ?? raw.weight;
    const weightKg = typeof rawWeight === 'number' ? rawWeight : parseFloat(String(rawWeight || '0').replace(/[^0-9.]/g, '')) || 500;
    const pallets = raw.cargo?.items_count ?? raw.cargo?.pallets ?? (Array.isArray(raw.cargo?.items) ? raw.cargo.items.length : 1);
    const freightType = raw.cargo?.service_type || raw.cargo?.pallet_type || raw.cargo?.freightType || raw.pallet_type || '-';
    const description = raw.cargo?.special_instructions || raw.cargo?.description || raw.status_note || 'Commercial Freight Shipment';

    const distanceKm = raw.route?.distance_km ?? raw.route?.distanceKm ?? (raw.distance_km ? Number(raw.distance_km) : 0);
    const estimatedDuration = raw.pickup?.time || raw.route?.estimatedDuration || '4h 30m';
    const driverEarnings = raw.payout?.driverEarnings ?? raw.payout?.driver_earnings ?? (raw.quote?.total_amount ? Number(raw.quote.total_amount) : 450);
    const fuelSurcharge = raw.payout?.fuelSurcharge ?? raw.payout?.fuel_surcharge ?? 50;

    return {
        id: String(raw.id),
        orderNumber,
        trackingNumber,
        status,
        priority: raw.priority || 'Standard',
        shipper: {
            name: shipperName,
            company: shipperCompany,
            phone: shipperPhone,
            address: pickupAddress,
            city: pickupCity,
            state: raw.pickup?.state || raw.shipper?.state || '',
            zip: raw.pickup?.zip || raw.shipper?.zip || '',
            pickupDate,
            pickupTimeWindow,
            notes: raw.pickup?.notes || raw.shipper?.notes || '',
        },
        consignee: {
            name: consigneeName,
            company: consigneeCompany,
            phone: consigneePhone,
            address: deliveryAddress,
            city: deliveryCity,
            state: raw.delivery?.state || raw.consignee?.state || '',
            zip: raw.delivery?.zip || raw.consignee?.zip || '',
            deliveryDate,
            deliveryTimeWindow,
            notes: raw.delivery?.notes || raw.consignee?.notes || '',
        },
        cargo: {
            description,
            freightType,
            weightKg,
            pallets,
            hazardous: Boolean(raw.cargo?.hazardous),
            temperatureControlled: raw.cargo?.temperature_controlled || raw.cargo?.temperatureControlled,
            dimensions: raw.cargo?.dimensions || 'Standard',
            valueEstimate: raw.cargo?.valueEstimate || raw.cargo?.value_estimate,
        },
        route: {
            distanceKm: raw.route?.distance_km ?? raw.route?.distanceKm ?? (raw.distance_km ? Number(raw.distance_km) : distanceKm || 80.81),
            distanceFormatted: raw.distance || (raw.distance_km ? `${raw.distance_km} km` : `${distanceKm || 80.81} km`),
            estimatedDuration: raw.estimated_time || raw.route?.estimatedDuration || estimatedDuration || '2h 19m',
            tollRoads: Boolean(raw.route?.tollRoads),
            currentLat: raw.route?.currentLat,
            currentLng: raw.route?.currentLng,
            originCoords: {
                lat: raw.pickup_lat ?? raw.route?.origin_coords?.lat ?? raw.route?.originCoords?.lat ?? 23.7881199,
                lng: raw.pickup_lng ?? raw.route?.origin_coords?.lng ?? raw.route?.originCoords?.lng ?? 90.3736584,
            },
            destinationCoords: {
                lat: raw.delivery_lat ?? raw.route?.destination_coords?.lat ?? raw.route?.destinationCoords?.lat ?? 24.2602295,
                lng: raw.delivery_lng ?? raw.route?.destination_coords?.lng ?? raw.route?.destinationCoords?.lng ?? 90.6422041,
            },
        },
        payout: {
            driverEarnings,
            fuelSurcharge,
            bonus: raw.payout?.bonus,
            currency: raw.payout?.currency || '€',
        },
        history: Array.isArray(raw.tracking?.history) ? raw.tracking.history : (Array.isArray(raw.history) ? raw.history : undefined),
        driver: raw.driver ? {
            name: raw.driver.name || '',
            phone: raw.driver.phone || '',
            vehiclePlate: raw.driver.vehicle_plate || '',
            vehicleType: raw.driver.vehicle_type || '',
        } : undefined,
        podStatus: podStatus || undefined,
        podData: extractPodData(raw),
        createdAt: raw.created_at || raw.createdAt || '',
        updatedAt: raw.updated_at || raw.updatedAt || '',
    };
}
