/**
 * Edit Quote Form Helpers & Utilities
 * Contains default state objects, sample data generators, and payload serializes for PUT/POST update.
 */

import { QuoteFormData } from '../types/formTypes';

export const INITIAL_QUOTE_FORM_DATA: QuoteFormData = {
    requestTitle: '',
    priority: 'Normal',
    shipmentType: 'One Way',
    serviceType: 'Standard',
    pickupDate: '',
    pickupTime: '',
    deliveryDate: '',
    deliveryTime: '',
    expectedTransitTime: '',

    pickupCompany: '',
    pickupContactName: '',
    pickupPhone: '',
    pickupEmail: '',
    pickupCountry: 'Bangladesh',
    pickupState: '',
    pickupCity: '',
    pickupZip: '',
    pickupAddress: '',
    pickupMapUrl: '',
    pickupInstructions: '',

    deliveryCompany: '',
    deliveryContactName: '',
    deliveryPhone: '',
    deliveryEmail: '',
    deliveryCountry: 'Bangladesh',
    deliveryState: '',
    deliveryCity: '',
    deliveryZip: '',
    deliveryAddress: '',
    deliveryMapUrl: '',
    deliveryInstructions: '',

    vehicleType: '',
    loadType: '',
    itemsCount: '',
    palletsCount: '',
    weight: '',
    volume: '',
    dimensions: [{ id: 1, length: '', width: '', height: '', qty: '1', unit: 'CM' }],

    stackable: false,
    fragile: false,
    hazardous: false,
    tempControlled: false,
    oversized: false,
    perishable: false,
    loadingRequired: false,
    unloadingRequired: false,
    packaging: false,
    insurance: false,
    insuranceType: 'Basic Carrier Liability',
    liftGate: false,
    whiteGlove: false,
    assembly: false,
    insideDelivery: false,
    storage: false,

    budget: '',
    currency: '€',
    allowNegotiation: true,
    receiveMultiple: true,
    autoExpire: '48 Hours',

    customerNotes: '',
    specialInstructions: '',
    internalReference: '',

    images: [],
    packingList: null,
    invoice: null,
};

export const getSampleFormData = (cleanId?: string): Partial<QuoteFormData> => ({
    requestTitle: '5 Pallets of Industrial Machinery from Gazipur to Ctg Port',
    priority: 'High',
    shipmentType: 'One Way',
    serviceType: 'Express',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '09:00',
    deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    deliveryTime: '17:00',
    expectedTransitTime: '2',

    pickupCompany: 'Prime Industrial Ltd.',
    pickupContactName: 'Kamal Hossain',
    pickupPhone: '+8801711234567',
    pickupEmail: 'dispatch@primeind.bd',
    pickupCountry: 'Bangladesh',
    pickupState: 'Dhaka Division',
    pickupCity: 'Dhaka (Gazipur)',
    pickupZip: '1700',
    pickupAddress: 'Plot 42, Gazipur Industrial Area, Dhaka',
    pickupMapUrl: 'https://maps.google.com/?q=Gazipur+Industrial+Area',
    pickupInstructions: 'Call before arriving. Driver must carry valid national ID. Use gate 2 loading dock.',

    deliveryCompany: 'Chittagong Port Terminal',
    deliveryContactName: 'Rahim Uddin',
    deliveryPhone: '+8801819987654',
    deliveryEmail: 'cargo@ctgport.com',
    deliveryCountry: 'Bangladesh',
    deliveryState: 'Chittagong Division',
    deliveryCity: 'Chittagong Port',
    deliveryZip: '4000',
    deliveryAddress: 'Berth 5, Terminal 2, Chittagong Port Authority',
    deliveryMapUrl: 'https://maps.google.com/?q=Chittagong+Port',
    deliveryInstructions: 'Report to port security first. Unloading will be handled by terminal crane.',

    vehicleType: 'Covered Van (20ft)',
    loadType: 'Pallets',
    itemsCount: '25',
    palletsCount: '5',
    weight: '2500',
    volume: '15.5',
    dimensions: [
        { id: 1, length: '120', width: '100', height: '150', qty: '2', unit: 'CM' },
        { id: 2, length: '100', width: '80', height: '120', qty: '2', unit: 'CM' },
        { id: 3, length: '80', width: '60', height: '90', qty: '1', unit: 'CM' }
    ],

    stackable: true,
    loadingRequired: true,
    unloadingRequired: true,
    packaging: true,
    insurance: true,

    budget: '48000',
    currency: '৳',
    allowNegotiation: true,
    receiveMultiple: true,
    autoExpire: '48 Hours',

    customerNotes: 'Heavy industrial machinery parts boxed on wooden pallets.',
    specialInstructions: 'Call driver 1 hour before pickup. Ensure vehicle floor is dry.',
    internalReference: `REF-${cleanId || 'SAMPLE'}`,
});

export const buildUpdatePayload = (formData: QuoteFormData, cleanId?: string) => {
    const pickupLoc = formData.pickupAddress || [formData.pickupCity, formData.pickupCountry].filter(Boolean).join(', ') || '-';
    const deliveryLoc = formData.deliveryAddress || [formData.deliveryCity, formData.deliveryCountry].filter(Boolean).join(', ') || '-';

    return {
        request_title: formData.requestTitle || `Quote Request REQ-${cleanId}`,
        priority: formData.priority || 'Normal',
        shipment_type: formData.shipmentType || 'One Way',
        service_type: formData.serviceType || 'Standard',
        expected_transit_time: formData.expectedTransitTime || null,

        pickup_address: pickupLoc,
        pickup_company: formData.pickupCompany || null,
        pickup_contact_name: formData.pickupContactName || null,
        pickup_phone: formData.pickupPhone || null,
        pickup_email: formData.pickupEmail || null,
        pickup_country: formData.pickupCountry || 'Bangladesh',
        pickup_state: formData.pickupState || null,
        pickup_city: formData.pickupCity || null,
        pickup_zip: formData.pickupZip || null,
        pickup_map_url: formData.pickupMapUrl || null,
        pickup_instructions: formData.pickupInstructions || null,

        delivery_address: deliveryLoc,
        delivery_company: formData.deliveryCompany || null,
        delivery_contact_name: formData.deliveryContactName || null,
        delivery_phone: formData.deliveryPhone || null,
        delivery_email: formData.deliveryEmail || null,
        delivery_country: formData.deliveryCountry || 'Bangladesh',
        delivery_state: formData.deliveryState || null,
        delivery_city: formData.deliveryCity || null,
        delivery_zip: formData.deliveryZip || null,
        delivery_map_url: formData.deliveryMapUrl || null,
        delivery_instructions: formData.deliveryInstructions || null,

        pickup_date: formData.pickupDate || new Date().toISOString().split('T')[0],
        delivery_date: formData.deliveryDate || null,
        pickup_time_from: formData.pickupTime || '09:00',
        pickup_time_till: '17:00',
        delivery_time_from: formData.deliveryTime || null,

        vehicle_type: formData.vehicleType || 'Covered Van',
        load_type: formData.loadType || 'Pallets',
        items_count: parseInt(formData.itemsCount || '1', 10),
        pallets_count: parseInt(formData.palletsCount || '1', 10),
        weight: parseFloat(formData.weight || '0'),
        volume: parseFloat(formData.volume || '0'),

        stackable: formData.stackable,
        fragile: formData.fragile,
        hazardous: formData.hazardous,
        temp_controlled: formData.tempControlled,
        oversized: formData.oversized,
        perishable: formData.perishable,

        loading_required: formData.loadingRequired,
        unloading_required: formData.unloadingRequired,
        packaging: formData.packaging,
        insurance: formData.insurance,
        lift_gate: formData.liftGate,
        white_glove: formData.whiteGlove,
        assembly: formData.assembly,
        inside_delivery: formData.insideDelivery,
        storage: formData.storage,

        budget: parseFloat(formData.budget || '0'),
        currency: formData.currency || '€',
        allow_negotiation: formData.allowNegotiation,
        receive_multiple: formData.receiveMultiple,
        auto_expire: formData.autoExpire || '48 Hours',

        additional_notes: [formData.requestTitle, formData.customerNotes, formData.specialInstructions].filter(Boolean).join(' | '),
        customer_notes: formData.customerNotes || null,
        special_instructions: formData.specialInstructions || null,
        internal_reference: formData.internalReference || null,

        items: (formData.dimensions && formData.dimensions.length > 0)
            ? formData.dimensions.map((d) => ({
                item_type: formData.loadType || 'Pallets',
                quantity: Math.max(1, parseInt(d.qty || formData.palletsCount || formData.itemsCount || '1', 10) || 1),
                length: parseFloat(d.length || '0') || 0,
                width: parseFloat(d.width || '0') || 0,
                height: parseFloat(d.height || '0') || 0,
                weight: parseFloat(formData.weight || '0') > 0
                    ? Math.round((parseFloat(formData.weight || '0') / Math.max(1, formData.dimensions.length)) * 100) / 100
                    : 0,
            }))
            : [
                {
                    item_type: formData.loadType || 'Pallets',
                    quantity: Math.max(1, parseInt(formData.palletsCount || formData.itemsCount || '1', 10) || 1),
                    length: 0,
                    width: 0,
                    height: 0,
                    weight: parseFloat(formData.weight || '0') || 0,
                }
            ]
    };
};
