/**
 * Edit Quote Form Helpers & Utilities
 * Contains default initial form data and dynamic payload serializer for updates.
 */

import { QuoteFormData } from '../types/formTypes';

export const INITIAL_QUOTE_FORM_DATA: QuoteFormData = {
    requestTitle: '',
    priority: '',
    shipmentType: '',
    serviceType: '',
    pickupDate: '',
    pickupTime: '',
    deliveryDate: '',
    deliveryTime: '',
    expectedTransitTime: '',

    pickupCompany: '',
    pickupContactName: '',
    pickupPhone: '',
    pickupEmail: '',
    pickupCountry: '',
    pickupState: '',
    pickupCity: '',
    pickupZip: '',
    pickupAddress: '',
    pickupInstructions: '',
    pickupLat: null,
    pickupLng: null,

    deliveryCompany: '',
    deliveryContactName: '',
    deliveryPhone: '',
    deliveryEmail: '',
    deliveryCountry: '',
    deliveryState: '',
    deliveryCity: '',
    deliveryZip: '',
    deliveryAddress: '',
    deliveryInstructions: '',
    deliveryLat: null,
    deliveryLng: null,
    distanceKm: null,
    estimatedDurationMinutes: null,

    vehicleType: '',
    loadType: '',
    itemsCount: '',
    palletsCount: '',
    weight: '',
    volume: '',
    dimensions: [{ id: 1, length: '', width: '', height: '', qty: '1', unit: 'CM' }],

    budget: '',
    currency: '€',
    allowNegotiation: true,
    receiveMultiple: true,
    autoExpire: '',

    customerNotes: '',
    specialInstructions: '',
    internalReference: '',

    images: [],
    packingList: null,
    invoice: null,
};

export const buildUpdatePayload = (formData: QuoteFormData, cleanId?: string) => {
    const pickupLoc = formData.pickupAddress || [formData.pickupCity, formData.pickupCountry].filter(Boolean).join(', ') || '-';
    const deliveryLoc = formData.deliveryAddress || [formData.deliveryCity, formData.deliveryCountry].filter(Boolean).join(', ') || '-';

    const payload: Record<string, any> = {
        request_title: formData.requestTitle || `Quote Request REQ-${cleanId}`,
        priority: formData.priority || '',
        shipment_type: formData.shipmentType || '',
        service_type: formData.serviceType || '',
        expected_transit_time: formData.expectedTransitTime || null,

        pickup_address: pickupLoc,
        pickup_company: formData.pickupCompany || null,
        pickup_company_name: formData.pickupCompany || null,
        pickup_contact_name: formData.pickupContactName || null,
        pickup_contact_person: formData.pickupContactName || null,
        pickup_phone: formData.pickupPhone || null,
        pickup_email: formData.pickupEmail || null,
        pickup_contact_email: formData.pickupEmail || null,
        pickup_country: formData.pickupCountry || '',
        pickup_state: formData.pickupState || null,
        pickup_city: formData.pickupCity || null,
        pickup_zip: formData.pickupZip || null,
        pickup_instructions: formData.pickupInstructions || null,
        pickup_lat: formData.pickupLat !== undefined && formData.pickupLat !== null && formData.pickupLat !== '' ? Number(formData.pickupLat) : null,
        pickup_lng: formData.pickupLng !== undefined && formData.pickupLng !== null && formData.pickupLng !== '' ? Number(formData.pickupLng) : null,

        delivery_address: deliveryLoc,
        delivery_company: formData.deliveryCompany || null,
        delivery_company_name: formData.deliveryCompany || null,
        delivery_contact_name: formData.deliveryContactName || null,
        delivery_contact_person: formData.deliveryContactName || null,
        delivery_phone: formData.deliveryPhone || null,
        delivery_email: formData.deliveryEmail || null,
        delivery_contact_email: formData.deliveryEmail || null,
        delivery_country: formData.deliveryCountry || '',
        delivery_state: formData.deliveryState || null,
        delivery_city: formData.deliveryCity || null,
        delivery_zip: formData.deliveryZip || null,
        delivery_instructions: formData.deliveryInstructions || null,
        delivery_lat: formData.deliveryLat !== undefined && formData.deliveryLat !== null && formData.deliveryLat !== '' ? Number(formData.deliveryLat) : null,
        delivery_lng: formData.deliveryLng !== undefined && formData.deliveryLng !== null && formData.deliveryLng !== '' ? Number(formData.deliveryLng) : null,

        pickup_date: formData.pickupDate || new Date().toISOString().split('T')[0],
        delivery_date: formData.deliveryDate || null,
        pickup_time_from: formData.pickupTime || '',
        pickup_time_till: formData.pickupTimeTill || null,
        delivery_time_from: formData.deliveryTime || null,

        vehicle_type: formData.vehicleType || '',
        load_type: formData.loadType || '',
        items_count: parseInt(formData.itemsCount || '1', 10),
        pallets_count: parseInt(formData.palletsCount || '1', 10),
        weight: parseFloat(formData.weight || '0'),
        volume: parseFloat(formData.volume || '0'),

        budget: parseFloat(formData.budget || '0'),
        currency: formData.currency || '€',
        allow_negotiation: formData.allowNegotiation,
        receive_multiple: formData.receiveMultiple,
        auto_expire: formData.autoExpire || '',

        additional_notes: [formData.requestTitle, formData.customerNotes, formData.specialInstructions].filter(Boolean).join(' | '),
        customer_notes: formData.customerNotes || null,
        special_instructions: formData.specialInstructions || null,
        internal_reference: formData.internalReference || null,
    };

    // Dynamically attach all boolean cargo requirements & services from formData
    Object.keys(formData).forEach((key) => {
        if (typeof formData[key] === 'boolean') {
            payload[key] = formData[key];
        }
    });

    return payload;
};
