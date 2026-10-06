import { estimateFlightDuration, resolveQuoteDistance } from '@/utils/geoDistance';

export function formatTo12HourTime(timeStr?: string): string {
    if (!timeStr || timeStr === '-' || timeStr === '') return '';
    const clean = String(timeStr).trim();

    // If already 12-hour format e.g. "04:10 PM" or "4:10 PM"
    const match12 = clean.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
    if (match12) {
        const h = String(parseInt(match12[1], 10)).padStart(2, '0');
        const m = match12[2];
        const p = match12[3].toUpperCase();
        return `${h}:${m} ${p}`;
    }

    // If 24-hour format e.g. "16:10", "16:10:00", "03:05", "03:05:00"
    const match24 = clean.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (match24) {
        let h = parseInt(match24[1], 10);
        const m = match24[2];
        const p = h >= 12 ? 'PM' : 'AM';
        if (h === 0) h = 12;
        else if (h > 12) h -= 12;
        return `${String(h).padStart(2, '0')}:${m} ${p}`;
    }

    return clean;
}

export function mapQuoteToFormData(q: any, cleanId: string) {
    const dynamicFlags: Record<string, boolean> = {};
    Object.keys(q).forEach((key) => {
        if (typeof q[key] === 'boolean' || q[key] === 1 || q[key] === 0 || q[key] === '1' || q[key] === '0') {
            dynamicFlags[key] = Boolean(q[key] === true || q[key] === 1 || q[key] === '1');
        }
    });

    const rawPickup = q.pickup_time || q.pickup_time_from || q.pickupTime || '';
    const rawDelivery = q.delivery_time || q.delivery_time_from || q.deliveryTime || '';

    const pickupTimeDisplay = formatTo12HourTime(rawPickup) || '-';
    const deliveryTimeDisplay = formatTo12HourTime(rawDelivery) || '-';
    const resDist = resolveQuoteDistance(q);

    return {
        ...dynamicFlags,
        requestTitle: q.request_title || q.requestTitle || q.title || '-',
        priority: q.priority || 'Normal',
        shipmentType: q.shipment_type || q.shipmentType || 'One Way',
        serviceType: q.service_type || q.serviceType || 'Standard',
        pickupDate: q.pickup_date || q.pickupDate || '-',
        pickupTime: pickupTimeDisplay,
        pickupTimeFrom: pickupTimeDisplay,
        pickupTimeTill: '-',
        deliveryDate: q.delivery_date || q.deliveryDate || '-',
        deliveryTime: deliveryTimeDisplay,
        deliveryTimeFrom: deliveryTimeDisplay,
        deliveryTimeTill: '-',
        expectedTransitTime: q.expected_transit_time || q.expectedTransitTime || '-',
        estDistance: resDist.distanceStr !== '—' ? resDist.distanceStr : (q.distance || q.estimated_distance || q.estDistance || '-'),
        distanceKm: resDist.distanceKm,
        isAirDistance: resDist.isAirDistance,
        estimatedDurationFormatted: q.estimated_duration_formatted ?? (
            q.estimated_duration_minutes 
                ? `${Math.floor(q.estimated_duration_minutes / 60)}h ${Math.round(q.estimated_duration_minutes % 60)}m`
                : (resDist.isAirDistance && resDist.distanceKm ? estimateFlightDuration(resDist.distanceKm) : null)
        ),
        pickupLat: q.pickup_lat ?? null,
        pickupLng: q.pickup_lng ?? null,
        deliveryLat: q.delivery_lat ?? null,
        deliveryLng: q.delivery_lng ?? null,

        pickupCompany: q.pickup_company || q.pickupCompany || '-',
        pickupContactName: q.pickup_contact_name || q.pickupContactName || '-',
        pickupPhone: q.pickup_phone || q.pickupPhone || '-',
        pickupEmail: q.pickup_email || q.pickupEmail || '-',
        pickupCountry: q.pickup_country || q.pickupCountry || '-',
        pickupState: q.pickup_state || q.pickupState || '-',
        pickupCity: q.pickup_city || q.pickupCity || '-',
        pickupZip: q.pickup_zip || q.pickupZip || '-',
        pickupAddress: q.pickup_address || q.pickupAddress || q.pickup || '-',
        pickupInstructions: String(q.pickup_instructions || q.pickupInstructions || '-').replace(/\\n/g, '\n'),

        deliveryCompany: q.delivery_company || q.deliveryCompany || '-',
        deliveryContactName: q.delivery_contact_name || q.deliveryContactName || '-',
        deliveryPhone: q.delivery_phone || q.deliveryPhone || '-',
        deliveryEmail: q.delivery_email || q.deliveryEmail || '-',
        deliveryCountry: q.delivery_country || q.deliveryCountry || '-',
        deliveryState: q.delivery_state || q.deliveryState || '-',
        deliveryCity: q.delivery_city || q.deliveryCity || '-',
        deliveryZip: q.delivery_zip || q.deliveryZip || '-',
        deliveryAddress: q.delivery_address || q.deliveryAddress || q.delivery || '-',
        deliveryInstructions: String(q.delivery_instructions || q.deliveryInstructions || '-').replace(/\\n/g, '\n'),

        vehicleType: q.vehicle_type || q.vehicleType || q.vehicle || '-',
        loadType: q.load_type || q.loadType || q.load || '-',
        itemsCount: q.items_count || q.itemsCount ? String(q.items_count || q.itemsCount) : '-',
        palletsCount: q.pallets_count || q.palletsCount ? String(q.pallets_count || q.palletsCount) : '-',
        weight: q.weight ? String(q.weight) : '-',
        volume: q.volume ? String(q.volume) : '-',
        dimensions: Array.isArray(q.items) && q.items.length > 0
            ? q.items.map((it: any, idx: number) => ({
                id: it.id || idx + 1,
                length: it.length !== null && it.length !== undefined && it.length !== '' ? String(it.length) : '-',
                width: it.width !== null && it.width !== undefined && it.width !== '' ? String(it.width) : '-',
                height: it.height !== null && it.height !== undefined && it.height !== '' ? String(it.height) : '-',
                qty: it.quantity ? String(it.quantity) : '-',
                unit: it.unit || it.item_type || 'CM'
            }))
            : [{ id: 1, length: '-', width: '-', height: '-', qty: '-', unit: '-' }],

        budget: q.budget || q.lowestBid ? String(q.budget || q.lowestBid) : '-',
        currency: q.currency || '-',
        allowNegotiation: Boolean(q.allow_negotiation ?? q.allowNegotiation ?? true),
        receiveMultiple: Boolean(q.receive_multiple ?? q.receiveMultiple ?? true),
        autoExpire: q.auto_expire || q.autoExpire || '-',
        customerNotes: q.customer_notes || q.customerNotes || q.additional_notes || '-',
        specialInstructions: q.special_instructions || q.specialInstructions || '-',
        internalReference: q.internal_reference || q.internalReference || `REF-${cleanId}`,
        images: Array.isArray(q.images_urls) && q.images_urls.length > 0
            ? q.images_urls.map((u: string, idx: number) => ({ name: `Attachment_${idx + 1}`, url: u }))
            : (Array.isArray(q.images) ? q.images : []),
        packingList: q.packing_list_url || q.packing_list_path
            ? { name: 'Packing_List.pdf', url: q.packing_list_url || q.packing_list_path }
            : (q.packingList || q.packing_list || (q.attachment_url ? { name: 'Attachment_File.pdf', url: q.attachment_url } : null)),
        invoice: q.invoice_url || q.invoice_path
            ? { name: 'Commercial_Invoice.pdf', url: q.invoice_url || q.invoice_path }
            : (q.invoice || null),
    };
}
