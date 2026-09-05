export const extractPdfField = (src: string, pattern: RegExp, def = ""): string => {
    const m = src.match(pattern);
    return m && m[1] ? m[1].trim() : def;
};

export const parseTimeTo24h = (val: any, def = "09:00:00"): string => {
    if (!val) return def;
    const str = String(val).trim();
    if (/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/.test(str)) {
        const p = str.split(":");
        return `${p[0].padStart(2, "0")}:${p[1].padStart(2, "0")}:${p[2] ? p[2].padStart(2, "0") : "00"}`;
    }
    const m = str.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?/i);
    if (m) {
        let h = parseInt(m[1], 10);
        const min = m[2];
        const s = m[3] || "00";
        const ampm = m[4]?.toUpperCase();
        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        return `${String(h).padStart(2, "0")}:${min}:${s}`;
    }
    return def;
};

export const mapPdfBlockToRequest = (block: string, idx: number) => {
    const title = extractPdfField(block, /Request Title:\s*([^:\n\r]+?)(?=\s*Priority:|\s*Basic|\n|$)/i, `Shipping Order #${idx + 1}`);
    const priority = extractPdfField(block, /Priority:\s*([^:\n\r]+?)(?=\s*Shipment|\n|$)/i, "Normal");
    const shipmentType = extractPdfField(block, /Shipment Type:\s*([^:\n\r]+?)(?=\s*Service|\n|$)/i, "One Way");
    const serviceType = extractPdfField(block, /Service Type:\s*([^:\n\r]+?)(?=\s*Pickup|\s*Expected|\n|$)/i, "Standard");
    const transitTime = extractPdfField(block, /Transit Time.*?(\d+)/i, "2");

    const pickupDate = extractPdfField(block, /Pickup Date:\s*([0-9\-]+)/i, new Date().toISOString().split("T")[0]);
    const pickupTime = parseTimeTo24h(extractPdfField(block, /Pickup Time:\s*([0-9:apm\s]+)/i, "09:00 AM"), "09:00:00");
    const deliveryDate = extractPdfField(block, /Delivery Date:\s*([0-9\-]+)/i, new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]);
    const deliveryTime = parseTimeTo24h(extractPdfField(block, /Delivery Time:\s*([0-9:apm\s]+)/i, "05:00 PM"), "17:00:00");

    const pMatch = block.match(/Pickup Details\s*(.*?)(?=Delivery Details|Load & Vehicle|Cargo Load|CARGO LOAD)/is);
    const pickupBlock = pMatch ? pMatch[1] : block;
    const pickupCompany = extractPdfField(pickupBlock, /Company Name:\s*([^:\n\r]+?)(?=\s*Contact|\s*Phone|\s*Email|\n|$)/i);
    const pickupContact = extractPdfField(pickupBlock, /Contact Person:\s*([^:\n\r]+?)(?=\s*Phone|\s*Email|\s*Country|\n|$)/i);
    const pickupPhone = extractPdfField(pickupBlock, /Phone Number:\s*([^:\n\r]+?)(?=\s*Email|\s*Country|\s*State|\n|$)/i);
    const pickupEmail = extractPdfField(pickupBlock, /Email:\s*([^\s\n\r]+@[^\s\n\r]+|[^\s:\n\r]+?)(?=\s*Country|\s*State|\s*City|\n|$)/i);
    const pickupCity = extractPdfField(pickupBlock, /City:\s*([^:\n\r]+?)(?=\s*ZIP\s*Code|\s*Full Address|\n|$)/i, "Gazipur");
    const pickupAddress = extractPdfField(pickupBlock, /Full Address:\s*([^:\n\r]+?)(?=\s*Google|\s*Instructions|\n|$)/i, pickupCity);

    const delivMatch = block.match(/Delivery Details\s*(.*?)(?=Load & Vehicle|Cargo Dimensions|Special Cargo|Budget|BUDGET|$)/is);
    const deliveryBlock = delivMatch ? delivMatch[1] : block;
    const deliveryCompany = extractPdfField(deliveryBlock, /Company Name:\s*([^:\n\r]+?)(?=\s*Contact|\s*Phone|\s*Email|\n|$)/i);
    const deliveryContact = extractPdfField(deliveryBlock, /Contact Person:\s*([^:\n\r]+?)(?=\s*Phone|\s*Email|\s*Country|\n|$)/i);
    const deliveryPhone = extractPdfField(deliveryBlock, /Phone Number:\s*([^:\n\r]+?)(?=\s*Email|\s*Country|\s*State|\n|$)/i);
    const deliveryEmail = extractPdfField(deliveryBlock, /Email:\s*([^\s\n\r]+@[^\s\n\r]+|[^\s:\n\r]+?)(?=\s*Country|\s*State|\s*City|\n|$)/i);
    const deliveryCity = extractPdfField(deliveryBlock, /City:\s*([^:\n\r]+?)(?=\s*ZIP\s*Code|\s*Full Address|\n|$)/i, "Chittagong");
    const deliveryAddress = extractPdfField(deliveryBlock, /Full Address:\s*([^:\n\r]+?)(?=\s*Google|\s*Instructions|\n|$)/i, deliveryCity);

    const vehicle = extractPdfField(block, /(?:Vehicle Type Preference|Vehicle Type):\s*([^:\n\r]+?)(?=\s*Cargo Load|\s*Load Type|\n|$)/i, "Covered Van (20ft)");
    const loadType = extractPdfField(block, /(?:Cargo Load Type|Load Type):\s*([^:\n\r]+?)(?=\s*Items Count|\s*Pallets Count|\n|$)/i, "Pallets");
    const itemsCount = parseInt(extractPdfField(block, /Items Count:\s*(\d+)/i, "1"), 10) || 1;
    const palletsCount = parseInt(extractPdfField(block, /Pallets Count:\s*(\d+)/i, String(itemsCount)), 10) || itemsCount;
    const totalWeight = extractPdfField(block, /Total Weight.*?:\s*(\d+)/i, "2500");
    const budget = extractPdfField(block, /(?:Target Budget|Target Budget Rate).*?:\s*(\d+)/i, "48000").replace(/[^0-9.]/g, "") || "48000";

    return {
        id: `req_${idx + 1}`,
        title, requestTitle: title, request_title: title,
        priority, shipmentType, serviceType,
        expectedTransit: `${transitTime} Days`, expected_transit_time: `${transitTime} Days`,
        pickupDate, pickupTime, pickup_time_from: pickupTime, pickup_time_till: "17:00:00",
        pickupCompany, pickup_company: pickupCompany, pickupContactPerson: pickupContact, pickup_contact_name: pickupContact,
        pickupPhone, pickup_phone: pickupPhone, pickupEmail, pickup_email: pickupEmail,
        pickupCountry: extractPdfField(pickupBlock, /Country:\s*([^:\n\r]+?)(?=\s*State|\s*City|\n|$)/i, "Bangladesh"),
        pickupState: extractPdfField(pickupBlock, /State(?:\/Division)?:\s*([^:\n\r]+?)(?=\s*City|\s*ZIP|\n|$)/i, "Dhaka Division"),
        pickupCity, pickupZip: extractPdfField(pickupBlock, /ZIP(?:\s*Code)?:\s*([^:\n\r]+?)(?=\s*Full Address|\s*Google|\n|$)/i, "1200"),
        pickupAddress, pickupMapUrl: extractPdfField(pickupBlock, /Google Map URL:\s*([^\n\r]+?)(?=\s*Instructions|\n|$)/i),
        pickupInstructions: extractPdfField(pickupBlock, /Instructions:\s*([^\n\r]+?)(?=\s*Delivery Details|\s*Load|\n|$)/i, "Handle with care"),
        deliveryDate, deliveryTime, delivery_time_from: "09:00:00", delivery_time_till: deliveryTime,
        deliveryCompany, delivery_company: deliveryCompany, deliveryContactPerson: deliveryContact, delivery_contact_name: deliveryContact,
        deliveryPhone, delivery_phone: deliveryPhone, deliveryEmail, delivery_email: deliveryEmail,
        deliveryCountry: extractPdfField(deliveryBlock, /Country:\s*([^:\n\r]+?)(?=\s*State|\s*City|\n|$)/i, "Bangladesh"),
        deliveryState: extractPdfField(deliveryBlock, /State(?:\/Division)?:\s*([^:\n\r]+?)(?=\s*City|\s*ZIP|\n|$)/i, "Chittagong Division"),
        deliveryCity, deliveryZip: extractPdfField(deliveryBlock, /ZIP(?:\s*Code)?:\s*([^:\n\r]+?)(?=\s*Full Address|\s*Google|\n|$)/i, "4000"),
        deliveryAddress, deliveryMapUrl: extractPdfField(deliveryBlock, /Google Map URL:\s*([^\n\r]+?)(?=\s*Instructions|\n|$)/i),
        deliveryInstructions: extractPdfField(deliveryBlock, /Instructions:\s*([^\n\r]+?)(?=\s*Load|\s*Cargo|\s*Budget|\n|$)/i, "Deliver during business hours"),
        vehicle, vehicleType: vehicle, vehicle_type: vehicle,
        cargoLoadType: loadType, load_type: loadType, pallet_type: loadType,
        itemsCount, items_count: itemsCount, palletsCount, pallets_count: palletsCount,
        totalWeight, weight: totalWeight, budget, amount: budget,
        pickup: `${pickupCity} ${pickupCompany ? `(${pickupCompany})` : ""}`.trim(),
        delivery: `${deliveryCity} ${deliveryCompany ? `(${deliveryCompany})` : ""}`.trim(),
        items: [{ item_type: loadType, quantity: itemsCount, length: 120, width: 80, height: 100, weight: Number(totalWeight) || 500 }]
    };
};
