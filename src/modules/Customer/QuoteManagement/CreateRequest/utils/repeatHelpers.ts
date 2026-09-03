/**
 * Repeat Quote Request Helpers
 * Formats quote details into a complete draft object for re-submission in Create form.
 */

import { CustomerQuoteRequestItem } from '../types';

export function buildRepeatData(q: any, row: CustomerQuoteRequestItem) {
    const dynamicFlags: Record<string, boolean> = {};
    if (q) {
        Object.keys(q).forEach((key) => {
            if (typeof q[key] === 'boolean' || q[key] === 1 || q[key] === 0 || q[key] === '1' || q[key] === '0') {
                dynamicFlags[key] = Boolean(q[key] === true || q[key] === 1 || q[key] === '1');
            }
        });
    }

    return {
        id: row.id,
        requestTitle: q.request_title ? `Repeat: ${q.request_title}` : `Repeat of ${row.id}`,
        priority: q.priority || 'High',
        shipmentType: q.shipment_type || row.type || 'One Way',
        serviceType: q.service_type || 'Express',
        pickupDate: '',
        pickupTime: q.pickup_time_from || '',
        deliveryDate: '',
        deliveryTime: q.delivery_time_from || q.delivery_time_till || '',
        expectedTransitTime: q.expected_transit_time || '',

        pickupCompany: q.pickup_company || '',
        pickupContactName: q.pickup_contact_name || '',
        pickupPhone: q.pickup_phone || '',
        pickupEmail: q.pickup_email || '',
        pickupCountry: q.pickup_country || 'Bangladesh',
        pickupState: q.pickup_state || '',
        pickupCity: q.pickup_city || row.pickup || '',
        pickupZip: q.pickup_zip || '',
        pickupAddress: q.pickup_address || '',
        pickupMapUrl: q.pickup_map_url || '',
        pickupInstructions: q.pickup_instructions || '',

        deliveryCompany: q.delivery_company || '',
        deliveryContactName: q.delivery_contact_name || '',
        deliveryPhone: q.delivery_phone || '',
        deliveryEmail: q.delivery_email || '',
        deliveryCountry: q.delivery_country || 'Bangladesh',
        deliveryState: q.delivery_state || '',
        deliveryCity: q.delivery_city || row.delivery || '',
        deliveryZip: q.delivery_zip || '',
        deliveryAddress: q.delivery_address || '',
        deliveryMapUrl: q.delivery_map_url || '',
        deliveryInstructions: q.delivery_instructions || '',

        vehicleType: q.vehicle_type || row.vehicle || '',
        loadType: q.load_type || row.load || '',
        itemsCount: q.items_count ? String(q.items_count) : '',
        palletsCount: q.pallets_count ? String(q.pallets_count) : '',
        weight: q.weight ? String(q.weight) : '',
        volume: q.volume ? String(q.volume) : '',

        ...dynamicFlags,
        stackable: Boolean(q.stackable ?? true),
        fragile: Boolean(q.fragile),
        hazardous: Boolean(q.hazardous),
        tempControlled: Boolean(q.temp_controlled ?? q.tempControlled),
        oversized: Boolean(q.oversized),
        perishable: Boolean(q.perishable),
        loadingRequired: Boolean(q.loading_required ?? q.loadingRequired ?? true),
        unloadingRequired: Boolean(q.unloading_required ?? q.unloadingRequired ?? true),
        packaging: Boolean(q.packaging),
        insurance: Boolean(q.insurance ?? true),
        liftGate: Boolean(q.lift_gate ?? q.liftGate),
        whiteGlove: Boolean(q.white_glove ?? q.whiteGlove),
        assembly: Boolean(q.assembly),
        insideDelivery: Boolean(q.inside_delivery ?? q.insideDelivery),
        storage: Boolean(q.storage),

        budget: q.budget ? String(q.budget) : '',
        currency: q.currency || '৳',
        allowNegotiation: Boolean(q.allow_negotiation ?? true),
        receiveMultiple: Boolean(q.receive_multiple ?? true),
        autoExpire: q.auto_expire || '48 Hours',

        customerNotes: q.customer_notes || '',
        specialInstructions: q.special_instructions || '',
        internalReference: `REPEAT-${row.id}`,
    };
}
