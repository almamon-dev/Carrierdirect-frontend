/**
 * Repeat Quote Request Helpers
 * Formats quote details into a complete draft object for re-submission in Create form.
 */

import { CustomerQuoteRequestItem } from '../types';

export function buildRepeatData(q: any, row: CustomerQuoteRequestItem) {
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

        stackable: Boolean(q.stackable),
        fragile: Boolean(q.fragile),
        hazardous: Boolean(q.hazardous),
        tempControlled: Boolean(q.temp_controlled),
        oversized: Boolean(q.oversized),
        perishable: Boolean(q.perishable),
        loadingRequired: Boolean(q.loading_required ?? true),
        unloadingRequired: Boolean(q.unloading_required ?? true),
        packaging: Boolean(q.packaging),
        insurance: Boolean(q.insurance ?? true),
        liftGate: Boolean(q.lift_gate),
        whiteGlove: Boolean(q.white_glove),
        assembly: Boolean(q.assembly),
        insideDelivery: Boolean(q.inside_delivery),
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
