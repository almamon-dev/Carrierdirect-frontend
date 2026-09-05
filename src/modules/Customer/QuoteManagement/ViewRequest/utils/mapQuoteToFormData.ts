export function mapQuoteToFormData(q: any, cleanId: string) {
    const dynamicFlags: Record<string, boolean> = {};
    Object.keys(q).forEach((key) => {
        if (typeof q[key] === 'boolean' || q[key] === 1 || q[key] === 0 || q[key] === '1' || q[key] === '0') {
            dynamicFlags[key] = Boolean(q[key] === true || q[key] === 1 || q[key] === '1');
        }
    });

    return {
        ...dynamicFlags,
        requestTitle: q.request_title || q.requestTitle || q.title || '-',
        priority: q.priority || 'Normal',
        shipmentType: q.shipment_type || q.shipmentType || 'One Way',
        serviceType: q.service_type || q.serviceType || 'Standard',
        pickupDate: q.pickup_date || q.pickupDate || '-',
        pickupTime: q.pickup_time_from || q.pickupTime || '-',
        deliveryDate: q.delivery_date || q.deliveryDate || '-',
        deliveryTime: q.delivery_time_from || q.deliveryTime || '-',
        expectedTransitTime: q.expected_transit_time || q.expectedTransitTime || '-',
        estDistance: q.estimated_distance || q.estDistance || '-',

        pickupCompany: q.pickup_company || q.pickupCompany || '-',
        pickupContactName: q.pickup_contact_name || q.pickupContactName || '-',
        pickupPhone: q.pickup_phone || q.pickupPhone || '-',
        pickupEmail: q.pickup_email || q.pickupEmail || '-',
        pickupCountry: q.pickup_country || q.pickupCountry || '-',
        pickupState: q.pickup_state || q.pickupState || '-',
        pickupCity: q.pickup_city || q.pickupCity || '-',
        pickupZip: q.pickup_zip || q.pickupZip || '-',
        pickupAddress: q.pickup_address || q.pickupAddress || q.pickup || '-',
        pickupMapUrl: q.pickup_map_url || q.pickupMapUrl || '-',
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
        deliveryMapUrl: q.delivery_map_url || q.deliveryMapUrl || '-',
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
                length: it.length ? String(it.length) : '-',
                width: it.width ? String(it.width) : '-',
                height: it.height ? String(it.height) : '-',
                qty: it.quantity ? String(it.quantity) : '-',
                unit: it.unit || 'CM'
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
