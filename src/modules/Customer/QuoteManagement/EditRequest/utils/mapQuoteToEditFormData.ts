import { QuoteFormData } from '../../CreateRequest/types/formTypes';
import { INITIAL_QUOTE_FORM_DATA } from '../../CreateRequest/utils/editFormHelpers';

export function mapQuoteToEditFormData(q: any, cleanId?: string): QuoteFormData {
    const dynamicFlags: Record<string, boolean> = {};
    Object.keys(q).forEach((key) => {
        if (typeof q[key] === 'boolean' || q[key] === 1 || q[key] === 0 || q[key] === '1' || q[key] === '0') {
            dynamicFlags[key] = Boolean(q[key] === true || q[key] === 1 || q[key] === '1');
        }
    });

    const pickupCompany = q.pickup_company || q.pickup_company_name || q.pickup_location?.company_name || q.pickupCompany || '';
    const pickupContactName = q.pickup_contact_name || q.pickup_contact_person || q.pickup_location?.contact_person || q.pickupContactName || '';
    const pickupPhone = q.pickup_phone || q.pickup_contact_phone || q.pickup_location?.phone || q.pickupPhone || '';
    const pickupEmail = q.pickup_email || q.pickup_contact_email || q.pickup_location?.email || q.pickupEmail || '';
    const pickupAddress = q.pickup_address || q.pickup_location?.address || q.pickupAddress || '';
    const pickupCity = q.pickup_city || q.pickup_location?.city || q.pickupCity || '';
    const pickupState = q.pickup_state || q.pickup_location?.state || q.pickupState || '';
    const pickupCountry = q.pickup_country || q.pickup_location?.country || q.pickupCountry || 'Bangladesh';
    const pickupZip = q.pickup_zip || q.pickup_location?.zip || q.pickupZip || '';
    const pickupMapUrl = q.pickup_map_url || q.pickup_location?.map_url || q.pickupMapUrl || '';
    const pickupInstructions = q.pickup_instructions || q.pickup_location?.instructions || q.pickupInstructions || '';

    const deliveryCompany = q.delivery_company || q.delivery_company_name || q.delivery_location?.company_name || q.deliveryCompany || '';
    const deliveryContactName = q.delivery_contact_name || q.delivery_contact_person || q.delivery_location?.contact_person || q.deliveryContactName || '';
    const deliveryPhone = q.delivery_phone || q.delivery_contact_phone || q.delivery_location?.phone || q.deliveryPhone || '';
    const deliveryEmail = q.delivery_email || q.delivery_contact_email || q.delivery_location?.email || q.deliveryEmail || '';
    const deliveryAddress = q.delivery_address || q.delivery_location?.address || q.deliveryAddress || '';
    const deliveryCity = q.delivery_city || q.delivery_location?.city || q.deliveryCity || '';
    const deliveryState = q.delivery_state || q.delivery_location?.state || q.deliveryState || '';
    const deliveryCountry = q.delivery_country || q.delivery_location?.country || q.deliveryCountry || 'Bangladesh';
    const deliveryZip = q.delivery_zip || q.delivery_location?.zip || q.deliveryZip || '';
    const deliveryMapUrl = q.delivery_map_url || q.delivery_location?.map_url || q.deliveryMapUrl || '';
    const deliveryInstructions = q.delivery_instructions || q.delivery_location?.instructions || q.deliveryInstructions || '';

    return {
        ...INITIAL_QUOTE_FORM_DATA,
        ...dynamicFlags,
        requestTitle: q.request_title || q.title || `Quote Request REQ-${cleanId || ''}`,
        priority: q.priority || 'Normal',
        shipmentType: q.shipment_type || q.shipmentType || 'One Way',
        serviceType: q.service_type || q.serviceType || 'Standard',
        pickupDate: q.pickup_date ? String(q.pickup_date).split('T')[0] : '',
        pickupTime: q.pickup_time_from || q.pickup_time || q.pickupTime || '',
        deliveryDate: q.delivery_date ? String(q.delivery_date).split('T')[0] : '',
        deliveryTime: q.delivery_time_from || q.delivery_time || q.deliveryTime || '',
        expectedTransitTime: q.expected_transit_time ? String(q.expected_transit_time) : '',

        pickupCompany,
        pickupContactName,
        pickupPhone,
        pickupEmail,
        pickupCountry,
        pickupState,
        pickupCity,
        pickupZip,
        pickupAddress,
        pickupMapUrl,
        pickupInstructions,

        deliveryCompany,
        deliveryContactName,
        deliveryPhone,
        deliveryEmail,
        deliveryCountry,
        deliveryState,
        deliveryCity,
        deliveryZip,
        deliveryAddress,
        deliveryMapUrl,
        deliveryInstructions,

        vehicleType: q.vehicle_type || q.vehicleType || q.vehicle || '',
        loadType: q.load_type || q.loadType || q.load || '',
        itemsCount: q.items_count || q.itemsCount ? String(q.items_count || q.itemsCount) : '',
        palletsCount: q.pallets_count || q.palletsCount ? String(q.pallets_count || q.palletsCount) : '',
        weight: q.weight ? String(q.weight) : '',
        volume: q.volume ? String(q.volume) : '',
        dimensions: Array.isArray(q.items) && q.items.length > 0
            ? q.items.map((it: any, idx: number) => ({
                id: it.id || idx + 1,
                length: it.length ? String(it.length) : '',
                width: it.width ? String(it.width) : '',
                height: it.height ? String(it.height) : '',
                qty: it.quantity ? String(it.quantity) : '1',
                unit: it.unit || 'CM'
            }))
            : [{ id: 1, length: '', width: '', height: '', qty: '1', unit: 'CM' }],

        budget: q.budget || q.lowestBid ? String(q.budget || q.lowestBid) : '',
        currency: q.currency || '€',
        allowNegotiation: Boolean(q.allow_negotiation ?? q.allowNegotiation ?? true),
        receiveMultiple: Boolean(q.receive_multiple ?? q.receiveMultiple ?? true),
        autoExpire: q.auto_expire || q.autoExpire || '24 Hours',
        customerNotes: q.customer_notes || q.customerNotes || q.additional_notes || '',
        specialInstructions: q.special_instructions || q.specialInstructions || '',
        internalReference: q.internal_reference || q.internalReference || '',
        images: Array.isArray(q.images_urls) && q.images_urls.length > 0
            ? q.images_urls.map((u: string, idx: number) => ({ name: `Photo_${idx + 1}`, url: u }))
            : (Array.isArray(q.images) ? q.images : []),
        packingList: q.packing_list_url || q.packing_list_path
            ? { name: 'Packing_List.pdf', url: q.packing_list_url || q.packing_list_path }
            : (q.packingList || q.packing_list || null),
        invoice: q.invoice_url || q.invoice_path
            ? { name: 'Commercial_Invoice.pdf', url: q.invoice_url || q.invoice_path }
            : (q.invoice || null),
    };
}
