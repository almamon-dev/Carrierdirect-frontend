function formatTimeTo24h(timeStr: any, defaultVal = "09:00:00"): string {
    if (!timeStr) return defaultVal;
    const str = String(timeStr).trim();
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(str)) {
        const parts = str.split(":");
        const h = parts[0].padStart(2, "0");
        const m = parts[1].padStart(2, "0");
        const s = parts[2] ? parts[2].padStart(2, "0") : "00";
        return `${h}:${m}:${s}`;
    }
    const match = str.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
    if (match) {
        let h = parseInt(match[1], 10);
        const m = match[2];
        const s = match[3] || "00";
        const ampm = match[4]?.toUpperCase();
        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        return `${String(h).padStart(2, "0")}:${m}:${s}`;
    }
    return defaultVal;
}

/**
 * Helpers for processing and formatting extracted PDF/CSV data into API payload
 */
export function buildBulkQuoteRequestsPayload(extractedData: any) {
    if (!extractedData) return [];

    const rowsToPersist = (extractedData.rows && extractedData.rows.length > 0)
        ? extractedData.rows
        : [extractedData];

    return rowsToPersist.map((row: any) => {
        const rowItems = (row.items && row.items.length > 0) ? row.items : [
            { item_type: row.cargoLoadType || 'Cargo Pallets', quantity: row.itemsCount || 1, dimensions: '120x80x100', weight: 500 }
        ];
        const totalItemsCount = rowItems.reduce((acc: number, it: any) => acc + Number(it.quantity || it.qty || 1), 0);
        const totalWeight = row.totalWeight || row.weight || rowItems.reduce((acc: number, it: any) => acc + (Number(it.weight || 100) * Number(it.quantity || 1)), 0);

        return {
            request_title: row.requestTitle || row.request_title || row.title || 'Logistics Freight Shipment Request',
            priority: row.priority || 'Normal',
            shipment_type: row.shipmentType || row.shipment_type || 'One Way',
            service_type: row.serviceType || row.service_type || 'Standard',
            expected_transit_time: row.expectedTransit || row.expected_transit_time || '2 Days',
            vehicle_type: row.vehicleType || row.vehicle_type || row.vehicle || 'Covered Van (20ft)',
            load_type: row.cargoLoadType || row.load_type || row.pallet_type || 'Standard Euro Pallet',
            items_count: totalItemsCount,
            pallets_count: row.palletsCount || totalItemsCount,
            weight: totalWeight,
            volume: row.totalVolume || row.volume || 2.5,

            pickup_address: row.pickupAddress || row.pickup_address || row.pickup || 'Dhaka',
            pickup_city: row.pickupCity || row.pickup_city || 'Dhaka',
            pickup_state: row.pickupState || row.pickup_state || '',
            pickup_country: row.pickupCountry || row.pickup_country || 'Bangladesh',
            pickup_zip: row.pickupZip || row.pickup_zip || '',
            pickup_company: row.pickupCompany || row.pickup_company || '',
            pickup_contact_name: row.pickupContactPerson || row.pickup_contact_name || '',
            pickup_phone: row.pickupPhone || row.pickup_phone || '',
            pickup_email: row.pickupEmail || row.pickup_email || '',
            pickup_map_url: row.pickupMapUrl || row.pickup_map_url || null,
            pickup_date: row.pickupDate || row.pickup_date || row.date || new Date().toISOString().split('T')[0],
            pickup_time_from: formatTimeTo24h(row.pickup_time_from || row.pickupTime || '09:00:00', '09:00:00'),
            pickup_time_till: formatTimeTo24h(row.pickup_time_till || '17:00:00', '17:00:00'),
            pickup_instructions: row.pickupInstructions || row.pickup_instructions || '',

            delivery_address: row.deliveryAddress || row.delivery_address || row.delivery || 'Chittagong',
            delivery_city: row.deliveryCity || row.delivery_city || 'Chittagong',
            delivery_state: row.deliveryState || row.delivery_state || '',
            delivery_country: row.deliveryCountry || row.delivery_country || 'Bangladesh',
            delivery_zip: row.deliveryZip || row.delivery_zip || '',
            delivery_company: row.deliveryCompany || row.delivery_company || '',
            delivery_contact_name: row.deliveryContactPerson || row.delivery_contact_name || '',
            delivery_phone: row.deliveryPhone || row.delivery_phone || '',
            delivery_email: row.deliveryEmail || row.delivery_email || '',
            delivery_map_url: row.deliveryMapUrl || row.delivery_map_url || null,
            delivery_date: row.deliveryDate || row.delivery_date || '',
            delivery_time_from: formatTimeTo24h(row.delivery_time_from || row.deliveryTimeFrom || '09:00:00', '09:00:00'),
            delivery_time_till: formatTimeTo24h(row.delivery_time_till || row.deliveryTime || '17:00:00', '17:00:00'),
            delivery_instructions: row.deliveryInstructions || row.delivery_instructions || '',

            stackable: Boolean(row.stackable ?? true),
            fragile: Boolean(row.fragile ?? false),
            hazardous: Boolean(row.hazardous ?? false),
            temp_controlled: Boolean(row.temp_controlled ?? row.tempControlled ?? false),
            oversized: Boolean(row.oversized ?? false),
            perishable: Boolean(row.perishable ?? false),
            loading_required: Boolean(row.loading_required ?? row.loadingRequired ?? true),
            unloading_required: Boolean(row.unloading_required ?? row.unloadingRequired ?? true),
            packaging: Boolean(row.packaging ?? false),
            insurance: Boolean(row.insurance ?? true),
            lift_gate: Boolean(row.lift_gate ?? row.liftGate ?? false),
            white_glove: Boolean(row.white_glove ?? row.whiteGlove ?? false),
            assembly: Boolean(row.assembly ?? false),
            inside_delivery: Boolean(row.inside_delivery ?? row.insideDelivery ?? false),
            storage: Boolean(row.storage ?? false),

            budget: typeof row.budget === 'number' ? row.budget : Number(String(row.amount || row.budget || 0).replace(/[^0-9.]/g, '')) || null,
            currency: row.currency || 'EUR',
            additional_notes: row.customerNotes || row.additional_notes || '',
            special_instructions: row.specialInstructions || row.special_instructions || '',
            items: rowItems.map((it: any) => {
                let l = it.length ? Number(it.length) : null;
                let w = it.width ? Number(it.width) : null;
                let h = it.height ? Number(it.height) : null;
                if ((!l || !w || !h) && it.dimensions) {
                    const parts = String(it.dimensions).split(/[xX*]/);
                    if (parts.length >= 3) {
                        l = Number(parts[0].trim()) || 120;
                        w = Number(parts[1].trim()) || 80;
                        h = Number(parts[2].trim()) || 100;
                    }
                }
                return {
                    item_type: it.item_type || it.type || row.cargoLoadType || 'Cargo Pallets',
                    quantity: Number(it.quantity || it.qty || 1),
                    length: l || 120,
                    width: w || 80,
                    height: h || 100,
                    weight: it.weight ? Number(it.weight) : 100,
                };
            })
        };
    });
}
