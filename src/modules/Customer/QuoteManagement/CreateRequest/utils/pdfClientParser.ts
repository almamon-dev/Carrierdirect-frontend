import * as pdfjsLib from "pdfjs-dist";

if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/" + pdfjsLib.version + "/pdf.worker.min.js";
}

const extractField = (src: string, pattern: RegExp, def = ""): string => {
    const m = src.match(pattern);
    return m && m[1] ? m[1].trim() : def;
};

const parseTimeTo24h = (val: any, def = "09:00:00"): string => {
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

export async function parsePdfInBrowser(file: File): Promise<any[]> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const doc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        let fullText = "";
        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str || "").join(" ");
            fullText += pageText + "\n---PAGE_BREAK---\n";
        }

        const blocks = fullText
            .split(/(?:---PAGE_BREAK---|(?=Shipping\s+Request\s+Order\s*(?:#?\d+|\(#?\d+\))?)|(?=Quote\s+Request\s*(?:#?\d+|\(#?\d+\))?))/i)
            .filter(b => b.includes("Basic Information") || b.includes("Request Title:") || b.includes("Pickup Details") || b.includes("BASIC INFORMATION") || b.includes("PICKUP & DELIVERY"));

        if (!blocks || blocks.length === 0) {
            return [];
        }

        return blocks.map((block, idx) => {
            const title = extractField(block, /Request Title:\s*([^:\n\r]+?)(?=\s*Priority:|\s*Basic|\n|$)/i, `Shipping Order #${idx + 1}`);
            const priority = extractField(block, /Priority:\s*([^:\n\r]+?)(?=\s*Shipment|\n|$)/i, "Normal");
            const shipmentType = extractField(block, /Shipment Type:\s*([^:\n\r]+?)(?=\s*Service|\n|$)/i, "One Way");
            const serviceType = extractField(block, /Service Type:\s*([^:\n\r]+?)(?=\s*Pickup|\s*Expected|\n|$)/i, "Standard");
            const transitTime = extractField(block, /Transit Time.*?(\d+)/i, "2");

            const pickupDate = extractField(block, /Pickup Date:\s*([0-9\-]+)/i, new Date().toISOString().split("T")[0]);
            const pickupTimeRaw = extractField(block, /Pickup Time:\s*([0-9:apm\s]+)/i, "09:00 AM");
            const pickupTime = parseTimeTo24h(pickupTimeRaw, "09:00:00");
            const deliveryDate = extractField(block, /Delivery Date:\s*([0-9\-]+)/i, new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]);
            const deliveryTimeRaw = extractField(block, /Delivery Time:\s*([0-9:apm\s]+)/i, "05:00 PM");
            const deliveryTime = parseTimeTo24h(deliveryTimeRaw, "17:00:00");

            let pickupBlock = "";
            const pMatch = block.match(/Pickup Details\s*(.*?)(?=Delivery Details|Load & Vehicle|Cargo Load|CARGO LOAD)/is);
            if (pMatch) pickupBlock = pMatch[1];
            else pickupBlock = block;

            const pickupCompany = extractField(pickupBlock, /Company Name:\s*([^:\n\r]+?)(?=\s*Contact|\s*Phone|\s*Email|\n|$)/i);
            const pickupContact = extractField(pickupBlock, /Contact Person:\s*([^:\n\r]+?)(?=\s*Phone|\s*Email|\s*Country|\n|$)/i);
            const pickupPhone = extractField(pickupBlock, /Phone Number:\s*([^:\n\r]+?)(?=\s*Email|\s*Country|\s*State|\n|$)/i);
            const pickupEmail = extractField(pickupBlock, /Email:\s*([^\s\n\r]+@[^\s\n\r]+|[^\s:\n\r]+?)(?=\s*Country|\s*State|\s*City|\n|$)/i);
            const pickupCountry = extractField(pickupBlock, /Country:\s*([^:\n\r]+?)(?=\s*State|\s*City|\n|$)/i, "Bangladesh");
            const pickupState = extractField(pickupBlock, /State(?:\/Division)?:\s*([^:\n\r]+?)(?=\s*City|\s*ZIP|\n|$)/i, "Dhaka Division");
            const pickupCity = extractField(pickupBlock, /City:\s*([^:\n\r]+?)(?=\s*ZIP\s*Code|\s*Full Address|\n|$)/i, "Gazipur");
            const pickupZip = extractField(pickupBlock, /ZIP(?:\s*Code)?:\s*([^:\n\r]+?)(?=\s*Full Address|\s*Google|\n|$)/i, "1200");
            const pickupAddress = extractField(pickupBlock, /Full Address:\s*([^:\n\r]+?)(?=\s*Google|\s*Instructions|\n|$)/i, pickupCity);
            const pickupMapUrl = extractField(pickupBlock, /Google Map URL:\s*([^\n\r]+?)(?=\s*Instructions|\n|$)/i);
            const pickupInstructions = extractField(pickupBlock, /Instructions:\s*([^\n\r]+?)(?=\s*Delivery Details|\s*Load|\n|$)/i, "Handle with care");

            let deliveryBlock = "";
            const delivMatch = block.match(/Delivery Details\s*(.*?)(?=Load & Vehicle|Cargo Dimensions|Special Cargo|Budget|BUDGET|$)/is);
            if (delivMatch) deliveryBlock = delivMatch[1];
            else deliveryBlock = block;

            const deliveryCompany = extractField(deliveryBlock, /Company Name:\s*([^:\n\r]+?)(?=\s*Contact|\s*Phone|\s*Email|\n|$)/i);
            const deliveryContact = extractField(deliveryBlock, /Contact Person:\s*([^:\n\r]+?)(?=\s*Phone|\s*Email|\s*Country|\n|$)/i);
            const deliveryPhone = extractField(deliveryBlock, /Phone Number:\s*([^:\n\r]+?)(?=\s*Email|\s*Country|\s*State|\n|$)/i);
            const deliveryEmail = extractField(deliveryBlock, /Email:\s*([^\s\n\r]+@[^\s\n\r]+|[^\s:\n\r]+?)(?=\s*Country|\s*State|\s*City|\n|$)/i);
            const deliveryCountry = extractField(deliveryBlock, /Country:\s*([^:\n\r]+?)(?=\s*State|\s*City|\n|$)/i, "Bangladesh");
            const deliveryState = extractField(deliveryBlock, /State(?:\/Division)?:\s*([^:\n\r]+?)(?=\s*City|\s*ZIP|\n|$)/i, "Chittagong Division");
            const deliveryCity = extractField(deliveryBlock, /City:\s*([^:\n\r]+?)(?=\s*ZIP\s*Code|\s*Full Address|\n|$)/i, "Chittagong");
            const deliveryZip = extractField(deliveryBlock, /ZIP(?:\s*Code)?:\s*([^:\n\r]+?)(?=\s*Full Address|\s*Google|\n|$)/i, "4000");
            const deliveryAddress = extractField(deliveryBlock, /Full Address:\s*([^:\n\r]+?)(?=\s*Google|\s*Instructions|\n|$)/i, deliveryCity);
            const deliveryMapUrl = extractField(deliveryBlock, /Google Map URL:\s*([^\n\r]+?)(?=\s*Instructions|\n|$)/i);
            const deliveryInstructions = extractField(deliveryBlock, /Instructions:\s*([^\n\r]+?)(?=\s*Load|\s*Cargo|\s*Budget|\n|$)/i, "Deliver during business hours");

            const vehicle = extractField(block, /(?:Vehicle Type Preference|Vehicle Type):\s*([^:\n\r]+?)(?=\s*Cargo Load|\s*Load Type|\n|$)/i, "Covered Van (20ft)");
            const loadType = extractField(block, /(?:Cargo Load Type|Load Type):\s*([^:\n\r]+?)(?=\s*Items Count|\s*Pallets Count|\n|$)/i, "Pallets");
            const itemsCount = parseInt(extractField(block, /Items Count:\s*(\d+)/i, "1"), 10) || 1;
            const palletsCount = parseInt(extractField(block, /Pallets Count:\s*(\d+)/i, String(itemsCount)), 10) || itemsCount;
            const totalWeight = extractField(block, /Total Weight.*?:\s*(\d+)/i, "2500");

            const rawBudget = extractField(block, /(?:Target Budget|Target Budget Rate).*?:\s*(\d+)/i, "48000");
            const budget = rawBudget.replace(/[^0-9.]/g, "") || "48000";

            const pickupDisplay = `${pickupCity} ${pickupCompany ? `(${pickupCompany})` : pickupAddress ? `(${pickupAddress})` : ""}`.trim();
            const deliveryDisplay = `${deliveryCity} ${deliveryCompany ? `(${deliveryCompany})` : deliveryAddress ? `(${deliveryAddress})` : ""}`.trim();

            return {
                id: `req_${idx + 1}`,
                title,
                requestTitle: title,
                request_title: title,
                priority,
                shipmentType,
                serviceType,
                expectedTransit: `${transitTime} Days`,
                expected_transit_time: `${transitTime} Days`,
                pickupDate,
                pickupTime,
                pickup_time_from: pickupTime,
                pickup_time_till: "17:00:00",
                pickupCompany,
                pickup_company: pickupCompany,
                pickupContactPerson: pickupContact,
                pickup_contact_name: pickupContact,
                pickupPhone,
                pickup_phone: pickupPhone,
                pickupEmail,
                pickup_email: pickupEmail,
                pickupCountry,
                pickup_country: pickupCountry,
                pickupState,
                pickup_state: pickupState,
                pickupCity,
                pickup_city: pickupCity,
                pickupZip,
                pickup_zip: pickupZip,
                pickupAddress,
                pickup_address: pickupAddress,
                pickupMapUrl,
                pickup_map_url: pickupMapUrl,
                pickupInstructions,
                pickup_instructions: pickupInstructions,
                deliveryDate,
                deliveryTime,
                delivery_time_from: "09:00:00",
                delivery_time_till: deliveryTime,
                deliveryCompany,
                delivery_company: deliveryCompany,
                deliveryContactPerson: deliveryContact,
                delivery_contact_name: deliveryContact,
                deliveryPhone,
                delivery_phone: deliveryPhone,
                deliveryEmail,
                delivery_email: deliveryEmail,
                deliveryCountry,
                delivery_country: deliveryCountry,
                deliveryState,
                delivery_state: deliveryState,
                deliveryCity,
                delivery_city: deliveryCity,
                deliveryZip,
                delivery_zip: deliveryZip,
                deliveryAddress,
                delivery_address: deliveryAddress,
                deliveryMapUrl,
                delivery_map_url: deliveryMapUrl,
                deliveryInstructions,
                delivery_instructions: deliveryInstructions,
                vehicle,
                vehicleType: vehicle,
                vehicle_type: vehicle,
                cargoLoadType: loadType,
                load_type: loadType,
                pallet_type: loadType,
                itemsCount,
                items_count: itemsCount,
                palletsCount,
                pallets_count: palletsCount,
                totalWeight,
                weight: totalWeight,
                budget,
                amount: budget,
                pickup: pickupDisplay || "Gazipur",
                delivery: deliveryDisplay || "Chittagong",
                items: [
                    {
                        item_type: loadType,
                        quantity: itemsCount,
                        length: 120,
                        width: 80,
                        height: 100,
                        weight: Number(totalWeight) || 500,
                    }
                ],
            };
        });
    } catch (err) {
        console.error("Error parsing PDF in browser:", err);
        return [];
    }
}
