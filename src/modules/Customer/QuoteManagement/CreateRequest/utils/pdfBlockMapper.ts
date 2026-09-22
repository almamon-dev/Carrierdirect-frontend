export const extractPdfField = (src: string, pattern: RegExp, def = ''): string => {
    const m = src.match(pattern);
    return m && m[1] ? m[1].trim() : def;
};

export const parseTimeTo24h = (val: any, def = '09:00:00'): string => {
    if (!val) return def;
    let str = String(val).trim();
    str = str.replace(/\s*\(.*?\)/g, '').trim();
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(str)) {
        const p = str.split(':');
        return `${p[0].padStart(2, '0')}:${p[1].padStart(2, '0')}:${p[2] ? p[2].padStart(2, '0') : '00'}`;
    }
    const m = str.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
    if (m) {
        let h = parseInt(m[1], 10);
        const min = m[2];
        const s = m[3] || '00';
        const ampm = m[4]?.toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return `${String(h).padStart(2, '0')}:${min}:${s}`;
    }
    return def;
};

export const mapPdfBlockToRequest = (block: string, idx: number) => {
    const title = extractPdfField(block, /Request Title\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Priority|\s*Basic|\n|$)/i, `Shipping Order #${idx + 1}`);
    
    // Priority parsing (handle [✓] High, [x] High, or plain High)
    let priority = 'Normal';
    const rawPriority = extractPdfField(block, /Priority\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Shipment|\n|$)/i, 'Normal');
    const priMatch = rawPriority.match(/\[(?:[xX✓\*1]|\?)\]\s*(Low|Normal|High|Urgent)/i) || rawPriority.match(/\b(Urgent|High|Normal|Low)\b/i);
    if (priMatch) priority = priMatch[1].charAt(0).toUpperCase() + priMatch[1].slice(1).toLowerCase();

    // Shipment type
    let shipmentType = 'One Way';
    const rawShipment = extractPdfField(block, /Shipment Type\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Service|\n|$)/i, 'One Way');
    const shipMatch = rawShipment.match(/\[(?:[xX✓\*1]|\?)\]\s*(One\s*Way|Round\s*Trip)/i) || rawShipment.match(/\b(Round\s*Trip|One\s*Way)\b/i);
    if (shipMatch) shipmentType = shipMatch[1];

    // Service type
    let serviceType = 'Standard';
    const rawService = extractPdfField(block, /Service Type\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Pickup|\s*Expected|\s*Transit|\n|$)/i, 'Standard');
    const srvMatch = rawService.match(/\[(?:[xX✓\*1]|\?)\]\s*(Standard|Express)/i) || rawService.match(/\b(Express|Standard)\b/i);
    if (srvMatch) serviceType = srvMatch[1].charAt(0).toUpperCase() + srvMatch[1].slice(1).toLowerCase();

    const transitTime = extractPdfField(block, /Transit Time.*?(\d+)/i, '2');

    const pickupDateRaw = extractPdfField(block, /Pickup Date\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Pickup Time|\s*Delivery|\n|$)/i);
    const pickupDate = pickupDateRaw.replace(/\s*\(.*?\)/g, '').trim() || new Date().toISOString().split('T')[0];

    const pickupTimeRaw = extractPdfField(block, /Pickup Time\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Delivery|\s*Transit|\n|$)/i, '09:00 AM');
    const pickupTime = parseTimeTo24h(pickupTimeRaw, '09:00:00');

    const deliveryDateRaw = extractPdfField(block, /Delivery Date\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Delivery Time|\s*Transit|\n|$)/i);
    const deliveryDate = deliveryDateRaw.replace(/\s*\(.*?\)/g, '').trim() || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

    const deliveryTimeRaw = extractPdfField(block, /Delivery Time\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Transit|\s*Location|\n|$)/i, '05:00 PM');
    const deliveryTime = parseTimeTo24h(deliveryTimeRaw, '17:00:00');

    // Scoped location blocks
    const pMatch = block.match(/Pickup Details\s*(.*?)(?=Delivery Details|Load & Vehicle|Cargo Load|CARGO LOAD|$)/is);
    const pickupBlock = pMatch ? pMatch[1] : block;
    const pickupCompany = extractPdfField(pickupBlock, /Company Name\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Contact|\s*Phone|\s*Email|\n|$)/i);
    const pickupContact = extractPdfField(pickupBlock, /Contact Person\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Phone|\s*Email|\s*Country|\n|$)/i);
    const pickupPhone = extractPdfField(pickupBlock, /Phone Number\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Email|\s*Country|\s*State|\n|$)/i);
    const pickupEmail = extractPdfField(pickupBlock, /Email\s*\*?\s*[:\t]\s*([^\s:\n\r]+@[^\s\n\r]+|[^\s:\n\r]+?)(?=\s*Country|\s*State|\s*City|\n|$)/i);
    const pickupCity = extractPdfField(pickupBlock, /City\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*\bZIP\b|\s*Full Address|\n|$)/i, 'Gazipur');
    const pickupAddress = extractPdfField(pickupBlock, /Full Address\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Google|\s*Instructions|\n|$)/i, pickupCity);

    const delivMatch = block.match(/Delivery Details\s*(.*?)(?=Load & Vehicle|Cargo Dimensions|Special Cargo|Budget|BUDGET|$)/is);
    const deliveryBlock = delivMatch ? delivMatch[1] : block;
    const deliveryCompany = extractPdfField(deliveryBlock, /Company Name\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Contact|\s*Phone|\s*Email|\n|$)/i);
    const deliveryContact = extractPdfField(deliveryBlock, /Contact Person\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Phone|\s*Email|\s*Country|\n|$)/i);
    const deliveryPhone = extractPdfField(deliveryBlock, /Phone Number\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Email|\s*Country|\s*State|\n|$)/i);
    const deliveryEmail = extractPdfField(deliveryBlock, /Email\s*\*?\s*[:\t]\s*([^\s:\n\r]+@[^\s\n\r]+|[^\s:\n\r]+?)(?=\s*Country|\s*State|\s*City|\n|$)/i);
    const deliveryCity = extractPdfField(deliveryBlock, /City\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*\bZIP\b|\s*Full Address|\n|$)/i, 'Chittagong');
    const deliveryAddress = extractPdfField(deliveryBlock, /Full Address\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Google|\s*Instructions|\n|$)/i, deliveryCity);

    // Vehicle & Cargo
    const vehicle = extractPdfField(block, /(?:Vehicle Type Preference|Vehicle Type)\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Cargo Load|\s*Load Type|\n|$)/i, 'Covered Van (20ft)');
    const loadType = extractPdfField(block, /(?:Cargo Load Type|Load Type)\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Items Count|\s*Pallets Count|\n|$)/i, 'Pallets');
    const itemsCount = parseInt(extractPdfField(block, /Items Count\s*\*?\s*[:\t]\s*(\d+)/i, '1'), 10) || 1;
    const palletsCount = parseInt(extractPdfField(block, /Pallets Count\s*\*?\s*[:\t]\s*(\d+)/i, String(itemsCount)), 10) || itemsCount;
    const totalWeight = extractPdfField(block, /Total Weight(?:\s*\(kg\))?\s*\*?\s*[:\t]\s*([0-9.,]+)/i, '2500').replace(/[^0-9.]/g, '') || '2500';
    const totalVolume = extractPdfField(block, /Total Volume(?:\s*\(m³\))?\s*\*?\s*[:\t]\s*([0-9.,]+)/i, '2.5').replace(/[^0-9.]/g, '') || '2.5';
    const budget = extractPdfField(block, /(?:Target Budget Rate(?:\s*\(EUR\))?|Target Budget Rate|Target Budget)\s*\*?\s*[:\t]\s*([€$£0-9.,]+)/i, '48000').replace(/[^0-9.]/g, '') || '48000';

    // Special Requirements & Services
    const stackable = /Stackable\s*:\s*Yes|\[(?:[xX✓\*1]|\?)\]\s*Stackable/i.test(block);
    const fragile = /Fragile\s*:\s*Yes|\[(?:[xX✓\*1]|\?)\]\s*Fragile/i.test(block);
    const hazardous = /Hazardous\s*:\s*Yes|\[(?:[xX✓\*1]|\?)\]\s*Hazardous/i.test(block);
    const tempControlled = /Temp(?:\s*Controlled)?\s*:\s*Yes|\[(?:[xX✓\*1]|\?)\]\s*Temp/i.test(block);
    const oversized = /Oversized\s*:\s*Yes|\[(?:[xX✓\*1]|\?)\]\s*Oversized/i.test(block);
    const perishable = /Perishable\s*:\s*Yes|\[(?:[xX✓\*1]|\?)\]\s*Perishable/i.test(block);
    const loadingRequired = /Loading\s*:\s*Yes|\[(?:[xX✓\*1]|\?)\]\s*Loading/i.test(block) || true;
    const unloadingRequired = /Unloading\s*:\s*Yes|\[(?:[xX✓\*1]|\?)\]\s*Unloading/i.test(block) || true;
    const packaging = /Packaging\s*:\s*Yes|\[(?:[xX✓\*1]|\?)\]\s*Packaging/i.test(block);
    const insurance = /Insurance\s*:\s*Yes|\[(?:[xX✓\*1]|\?)\]\s*Insurance/i.test(block) || true;

    // Notes & References
    const customerNotes = extractPdfField(block, /Customer Notes\s*\*?\s*[:\t]\s*([^\n\r]+)/i);
    const specialInstructions = extractPdfField(block, /Special Instructions\s*\*?\s*[:\t]\s*([^\n\r]+)/i);
    const internalReference = extractPdfField(block, /Internal Reference(?:\s*ID)?\s*\*?\s*[:\t]\s*([^\n\r]+)/i);

    // Dimension items table extraction
    const items: any[] = [];
    const dimMatch = block.match(/Cargo Dimensions \(L x W x H\)\s*([\s\S]*?)(?=Special Cargo|Budget & Bidding|Attachments|$)/i);
    if (dimMatch) {
        const lines = dimMatch[1].split(/[\r\n]+/);
        for (const line of lines) {
            const cols = line.trim().split(/\s+/);
            if (cols.length >= 4 && !isNaN(Number(cols[0])) && !isNaN(Number(cols[1])) && !isNaN(Number(cols[2])) && !isNaN(Number(cols[3]))) {
                items.push({
                    item_type: loadType,
                    length: Number(cols[0]),
                    width: Number(cols[1]),
                    height: Number(cols[2]),
                    quantity: Number(cols[3]),
                    weight: 100,
                });
            }
        }
    }

    if (items.length === 0) {
        items.push({
            item_type: loadType,
            quantity: itemsCount,
            length: 120,
            width: 80,
            height: 100,
            weight: Number(totalWeight) || 500,
        });
    }

    return {
        id: `req_${idx + 1}`,
        title, requestTitle: title, request_title: title,
        priority, shipmentType, serviceType,
        expectedTransit: `${transitTime} Days`, expected_transit_time: `${transitTime} Days`,
        pickupDate, pickupTime, pickup_time_from: pickupTime, pickup_time_till: '17:00:00',
        pickupCompany, pickup_company: pickupCompany, pickupContactPerson: pickupContact, pickup_contact_name: pickupContact,
        pickupPhone, pickup_phone: pickupPhone, pickupEmail, pickup_email: pickupEmail,
        pickupCountry: extractPdfField(pickupBlock, /Country\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*State|\s*City|\n|$)/i, 'Bangladesh'),
        pickupState: extractPdfField(pickupBlock, /State(?:\s*\/\s*Division)?\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*City|\s*\bZIP\b|\n|$)/i, 'Dhaka Division'),
        pickupCity, pickupZip: extractPdfField(pickupBlock, /ZIP(?:\s*Code)?\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Full Address|\s*Google|\n|$)/i, '1200'),
        pickupAddress, pickupMapUrl: extractPdfField(pickupBlock, /Google Map URL\s*\*?\s*[:\t]\s*([^\n\r]+?)(?=\s*Instructions|\n|$)/i),
        pickupInstructions: extractPdfField(pickupBlock, /Instructions\s*\*?\s*[:\t]\s*([^\n\r]+?)(?=\s*Delivery Details|\s*Load|\n|$)/i, 'Handle with care'),
        
        deliveryDate, deliveryTime, delivery_time_from: '14:00:00', delivery_time_till: deliveryTime,
        deliveryCompany, delivery_company: deliveryCompany, deliveryContactPerson: deliveryContact, delivery_contact_name: deliveryContact,
        deliveryPhone, delivery_phone: deliveryPhone, deliveryEmail, delivery_email: deliveryEmail,
        deliveryCountry: extractPdfField(deliveryBlock, /Country\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*State|\s*City|\n|$)/i, 'Bangladesh'),
        deliveryState: extractPdfField(deliveryBlock, /State(?:\s*\/\s*Division)?\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*City|\s*\bZIP\b|\n|$)/i, 'Chittagong Division'),
        deliveryCity, deliveryZip: extractPdfField(deliveryBlock, /ZIP(?:\s*Code)?\s*\*?\s*[:\t]\s*([^:\n\r]+?)(?=\s*Full Address|\s*Google|\n|$)/i, '4000'),
        deliveryAddress, deliveryMapUrl: extractPdfField(deliveryBlock, /Google Map URL\s*\*?\s*[:\t]\s*([^\n\r]+?)(?=\s*Instructions|\n|$)/i),
        deliveryInstructions: extractPdfField(deliveryBlock, /Instructions\s*\*?\s*[:\t]\s*([^\n\r]+?)(?=\s*Load|\s*Cargo|\s*Budget|\n|$)/i, 'Deliver during business hours'),
        
        vehicle, vehicleType: vehicle, vehicle_type: vehicle,
        cargoLoadType: loadType, load_type: loadType, pallet_type: loadType,
        itemsCount, items_count: itemsCount, palletsCount, pallets_count: palletsCount,
        totalWeight, weight: totalWeight, totalVolume, volume: totalVolume,
        budget, amount: budget,
        
        stackable, fragile, hazardous, temp_controlled: tempControlled, oversized, perishable,
        loading_required: loadingRequired, unloading_required: unloadingRequired, packaging, insurance,
        
        customerNotes, additional_notes: customerNotes,
        specialInstructions, special_instructions: specialInstructions,
        internalReference, internal_reference: internalReference,
        
        pickup: `${pickupCity} ${pickupCompany ? `(${pickupCompany})` : ''}`.trim(),
        delivery: `${deliveryCity} ${deliveryCompany ? `(${deliveryCompany})` : ''}`.trim(),
        items,
    };
};
