import { ParsedCargoItem, ParsedQuoteRequestData } from './csvParserTypes';

export const getCsvField = (headers: string[], row: string[], searchTerms: string[], fallbackIndex = -1): string => {
    for (const term of searchTerms) {
        const cleanTerm = term.toLowerCase().replace(/[^a-z0-9]/g, '');
        const foundIdx = headers.findIndex(h => h.includes(cleanTerm));
        if (foundIdx !== -1 && row[foundIdx] !== undefined) {
            return row[foundIdx];
        }
    }
    if (fallbackIndex >= 0 && row[fallbackIndex] !== undefined) {
        return row[fallbackIndex];
    }
    return '';
};

export const extractCargoItems = (headers: string[], row: string[], cargoDimensions: string, cargoLoadType: string, itemsCount: string, palletsCount: string, totalWeight: string): ParsedCargoItem[] => {
    const items: ParsedCargoItem[] = [];
    for (let i = 1; i <= 5; i++) {
        const itemType = getCsvField(headers, row, [`item${i}type`], -1);
        const itemQty = getCsvField(headers, row, [`item${i}qty`, `item${i}quantity`], -1);
        const itemDim = getCsvField(headers, row, [`item${i}dimensions`, `item${i}dim`], -1);
        const itemWeight = getCsvField(headers, row, [`item${i}weight`], -1);
        const itemHandling = getCsvField(headers, row, [`item${i}handling`], -1);

        if (itemType || itemQty) {
            items.push({
                item_type: itemType || `Cargo Unit #${i}`,
                quantity: Number(itemQty) || 1,
                dimensions: itemDim || cargoDimensions,
                weight: itemWeight || '500',
                handling: itemHandling || 'Standard Care',
            });
        }
    }
    if (items.length === 0) {
        items.push({
            item_type: cargoLoadType || 'General Freight Pallets',
            quantity: Number(itemsCount) || Number(palletsCount) || 1,
            dimensions: cargoDimensions,
            weight: totalWeight,
            handling: 'Standard Logistics Care',
        });
    }
    return items;
};

export const extractServices = (headers: string[], row: string[]): string[] => {
    const services: string[] = [];
    if (/yes|true|1/i.test(getCsvField(headers, row, ['stackablecargo', 'stackable']))) services.push('Stackable Cargo');
    if (/yes|true|1/i.test(getCsvField(headers, row, ['fragilecare', 'fragile']))) services.push('Fragile Care');
    if (/yes|true|1/i.test(getCsvField(headers, row, ['hazardous']))) services.push('Hazardous Material');
    if (/yes|true|1/i.test(getCsvField(headers, row, ['tempcontrolled', 'temperature']))) services.push('Temperature Controlled');
    if (/yes|true|1/i.test(getCsvField(headers, row, ['oversizedcargo', 'oversized']))) services.push('Oversized Cargo');
    if (/yes|true|1/i.test(getCsvField(headers, row, ['loadingservicerequired', 'loading']))) services.push('Loading Service Required');
    if (/yes|true|1/i.test(getCsvField(headers, row, ['unloadingservicerequired', 'unloading']))) services.push('Unloading Service Required');
    if (/yes|true|1/i.test(getCsvField(headers, row, ['packagingservice', 'packaging']))) services.push('Packaging Service');
    if (/yes|true|1/i.test(getCsvField(headers, row, ['cargoinsurance', 'insurance']))) services.push('Cargo Insurance');
    if (services.length === 0) {
        services.push('Loading Required', 'Unloading Required', 'Cargo Insurance', 'Waterproof Covered Vehicle');
    }
    return services;
};

export const mapSingleCsvRow = (headers: string[], row: string[]): ParsedQuoteRequestData => {
    const title = getCsvField(headers, row, ['requesttitle', 'title', 'request_title'], 0) || 'Logistics Freight Shipment Request';
    const pickupCompany = getCsvField(headers, row, ['pickupcompany', 'pickupcompanyname'], 7) || 'Prime Logistics EPZ Depot';
    const pickupCity = getCsvField(headers, row, ['pickupcity'], 13) || 'Dhaka';
    const deliveryCompany = getCsvField(headers, row, ['deliverycompany', 'deliverycompanyname'], 20) || 'Chittagong Maritime Terminal Hub';
    const deliveryCity = getCsvField(headers, row, ['deliverycity'], 26) || 'Chittagong';
    const vehicleType = getCsvField(headers, row, ['vehicletypepreference', 'vehicletype', 'vehicle'], 31) || 'Covered Van (20ft)';
    const cargoLoadType = getCsvField(headers, row, ['cargoloadtype', 'loadtype'], 32) || 'Pallets / Boxes';
    const itemsCount = getCsvField(headers, row, ['itemscount', 'totalitems'], 33) || '10';
    const palletsCount = getCsvField(headers, row, ['palletscount', 'pallets'], 34) || '5';
    const totalWeight = getCsvField(headers, row, ['totalweight', 'weight'], 35) || '2500';
    const cargoDimensions = getCsvField(headers, row, ['cargodimensions', 'dimensions'], 37) || '120x80x100 CM';
    const rawBudget = getCsvField(headers, row, ['targetbudgetrate', 'budget', 'rate', 'amount'], 64) || '45000';
    const budget = rawBudget.replace(/[^0-9.]/g, '') || '45000';

    return {
        requestTitle: title,
        priority: getCsvField(headers, row, ['priority'], 1) || 'Normal',
        shipmentType: getCsvField(headers, row, ['shipmenttype', 'shipment_type'], 2) || 'One Way',
        serviceType: getCsvField(headers, row, ['servicetype', 'service_type'], 3) || 'Standard Freight',
        expectedTransit: getCsvField(headers, row, ['expectedtransit', 'transittime', 'transit'], 4) || '2-3 Days',
        pickupDate: getCsvField(headers, row, ['pickupdate', 'pickup_date'], 5) || new Date().toISOString().split('T')[0],
        pickupTime: getCsvField(headers, row, ['pickuptime', 'pickup_time'], 6) || '09:00 AM',
        pickupCompany,
        pickupContactPerson: getCsvField(headers, row, ['pickupcontactperson', 'pickupcontact'], 8) || 'Kamal Hossain',
        pickupPhone: getCsvField(headers, row, ['pickupphone', 'pickuptel'], 9) || '+8801711234567',
        pickupEmail: getCsvField(headers, row, ['pickupemail'], 10) || 'dispatch@logistics.bd',
        pickupCountry: getCsvField(headers, row, ['pickupcountry'], 11) || 'Bangladesh',
        pickupState: getCsvField(headers, row, ['pickupstatedivision', 'pickupstate'], 12) || 'Dhaka Division',
        pickupCity,
        pickupZip: getCsvField(headers, row, ['pickupzipcode', 'pickupzip'], 14) || '1700',
        pickupAddress: getCsvField(headers, row, ['pickupfulladdress', 'pickupaddress'], 15) || `${pickupCompany}, ${pickupCity}`,
        pickupMapUrl: getCsvField(headers, row, ['pickupgooglemapurl', 'pickupmap'], 16) || '',
        pickupInstructions: getCsvField(headers, row, ['pickupspecialinstructions', 'pickupinstructions'], 17)?.replace(/\\n/g, '\n') || 'Standard loading guidelines.',
        deliveryDate: getCsvField(headers, row, ['deliverydate', 'delivery_date'], 18) || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        deliveryTime: getCsvField(headers, row, ['deliverytime', 'delivery_time'], 19) || '05:00 PM',
        deliveryCompany,
        deliveryContactPerson: getCsvField(headers, row, ['deliverycontactperson', 'deliverycontact'], 21) || 'Rahim Uddin',
        deliveryPhone: getCsvField(headers, row, ['deliveryphone', 'deliverytel'], 22) || '+8801819987654',
        deliveryEmail: getCsvField(headers, row, ['deliveryemail'], 23) || 'cargo@delivery.com',
        deliveryCountry: getCsvField(headers, row, ['deliverycountry'], 24) || 'Bangladesh',
        deliveryState: getCsvField(headers, row, ['deliverystatedivision', 'deliverystate'], 25) || 'Chittagong Division',
        deliveryCity,
        deliveryZip: getCsvField(headers, row, ['deliveryzipcode', 'deliveryzip'], 27) || '4000',
        deliveryAddress: getCsvField(headers, row, ['deliveryfulladdress', 'deliveryaddress'], 28) || `${deliveryCompany}, ${deliveryCity}`,
        deliveryMapUrl: getCsvField(headers, row, ['deliverygooglemapurl', 'deliverymap'], 29) || '',
        deliveryInstructions: getCsvField(headers, row, ['deliveryspecialinstructions', 'deliveryinstructions'], 30)?.replace(/\\n/g, '\n') || 'Standard unloading guidelines.',
        vehicleType, cargoLoadType, itemsCount, palletsCount, totalWeight,
        totalVolume: getCsvField(headers, row, ['totalvolume', 'volume', 'cbm'], 36) || '15.5',
        cargoDimensions,
        items: extractCargoItems(headers, row, cargoDimensions, cargoLoadType, itemsCount, palletsCount, totalWeight),
        services: extractServices(headers, row),
        budget,
        allowNegotiation: getCsvField(headers, row, ['allowratenegotiation', 'allownegotiation']) || 'Yes',
        receiveMultipleBids: getCsvField(headers, row, ['receivemultiplebids', 'multiplebids']) || 'Yes',
        autoExpire: getCsvField(headers, row, ['autoexpireduration', 'autoexpire']) || '7 Days',
        customerNotes: getCsvField(headers, row, ['customernotes', 'notes'], 69) || 'Handle with care.',
        specialInstructions: getCsvField(headers, row, ['specialinstructions'], 70) || 'Safety vest required.',
        internalRefId: getCsvField(headers, row, ['internalreferenceid', 'internalrefid', 'refid'], 71) || `REF-${Math.floor(10000 + Math.random() * 90000)}`,
        attachedZip: getCsvField(headers, row, ['attachedziparchivefile', 'attachedzip', 'zipfile'], 72) || '',
        pickup: `${pickupCity} (${pickupCompany})`,
        delivery: `${deliveryCity} (${deliveryCompany})`,
        vehicle: vehicleType,
        amount: budget,
        title,
    };
};
