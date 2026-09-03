/**
 * Robust CSV parser for Quote Requests import
 * Parses CSV strings with support for quotes, commas, and multiline values.
 */

export interface ParsedCargoItem {
    item_type: string;
    quantity: number;
    dimensions?: string;
    weight?: number | string;
    handling?: string;
}

export interface ParsedQuoteRequestData {
    requestTitle: string;
    priority: string;
    shipmentType: string;
    serviceType: string;
    expectedTransit: string;
    pickupDate: string;
    pickupTime: string;
    pickupCompany: string;
    pickupContactPerson: string;
    pickupPhone: string;
    pickupEmail: string;
    pickupCountry: string;
    pickupState: string;
    pickupCity: string;
    pickupZip: string;
    pickupAddress: string;
    pickupMapUrl: string;
    pickupInstructions: string;
    deliveryDate: string;
    deliveryTime: string;
    deliveryCompany: string;
    deliveryContactPerson: string;
    deliveryPhone: string;
    deliveryEmail: string;
    deliveryCountry: string;
    deliveryState: string;
    deliveryCity: string;
    deliveryZip: string;
    deliveryAddress: string;
    deliveryMapUrl: string;
    deliveryInstructions: string;
    vehicleType: string;
    cargoLoadType: string;
    itemsCount: number | string;
    palletsCount: number | string;
    totalWeight: number | string;
    totalVolume: number | string;
    cargoDimensions: string;
    items: ParsedCargoItem[];
    services: string[];
    budget: string | number;
    allowNegotiation: string;
    receiveMultipleBids: string;
    autoExpire: string;
    customerNotes: string;
    specialInstructions: string;
    internalRefId: string;
    attachedZip: string;
    // Row representation for table preview
    pickup: string;
    delivery: string;
    vehicle: string;
    amount: string | number;
    title: string;
}

export function parseCsvRows(csvText: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentCell += '"';
                i++; // Skip escaped quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') {
                i++; // Skip \r\n
            }
            currentRow.push(currentCell.trim());
            if (currentRow.some(cell => cell.length > 0)) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentCell = '';
        } else {
            currentCell += char;
        }
    }

    if (currentCell.length > 0 || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell.length > 0)) {
            rows.push(currentRow);
        }
    }

    return rows;
}

export function mapCsvToQuoteRequests(csvText: string): { rows: ParsedQuoteRequestData[]; primary: ParsedQuoteRequestData | null } {
    const parsedGrid = parseCsvRows(csvText);
    if (parsedGrid.length < 2) {
        return { rows: [], primary: null };
    }

    const headers = parsedGrid[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const dataRows = parsedGrid.slice(1);

    const getField = (row: string[], searchTerms: string[], fallbackIndex = -1): string => {
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

    const requests: ParsedQuoteRequestData[] = dataRows.map((row) => {
        const title = getField(row, ['requesttitle', 'title', 'request_title'], 0) || 'Logistics Freight Shipment Request';
        const priority = getField(row, ['priority'], 1) || 'Normal';
        const shipmentType = getField(row, ['shipmenttype', 'shipment_type'], 2) || 'One Way';
        const serviceType = getField(row, ['servicetype', 'service_type'], 3) || 'Standard Freight';
        const expectedTransit = getField(row, ['expectedtransit', 'transittime', 'transit'], 4) || '2-3 Days';

        const pickupDate = getField(row, ['pickupdate', 'pickup_date'], 5) || new Date().toISOString().split('T')[0];
        const pickupTime = getField(row, ['pickuptime', 'pickup_time'], 6) || '09:00 AM';
        const pickupCompany = getField(row, ['pickupcompany', 'pickupcompanyname'], 7) || 'Prime Logistics EPZ Depot';
        const pickupContactPerson = getField(row, ['pickupcontactperson', 'pickupcontact'], 8) || 'Kamal Hossain';
        const pickupPhone = getField(row, ['pickupphone', 'pickuptel'], 9) || '+8801711234567';
        const pickupEmail = getField(row, ['pickupemail'], 10) || 'dispatch@logistics.bd';
        const pickupCountry = getField(row, ['pickupcountry'], 11) || 'Bangladesh';
        const pickupState = getField(row, ['pickupstatedivision', 'pickupstate'], 12) || 'Dhaka Division';
        const pickupCity = getField(row, ['pickupcity'], 13) || 'Dhaka';
        const pickupZip = getField(row, ['pickupzipcode', 'pickupzip'], 14) || '1700';
        const pickupAddress = getField(row, ['pickupfulladdress', 'pickupaddress'], 15) || `${pickupCompany}, ${pickupCity}`;
        const pickupMapUrl = getField(row, ['pickupgooglemapurl', 'pickupmap'], 16) || '';
        const rawPickupInst = getField(row, ['pickupspecialinstructions', 'pickupinstructions'], 17);
        const pickupInstructions = rawPickupInst ? rawPickupInst.replace(/\\n/g, '\n') : `1. Driver must report to Gate 3 security checkpost upon arrival.
2. Mandatory PPE required (safety helmet, high-vis vest, safety boots).
3. Inspect cargo packaging & pallet seal conditions before loading.
4. Obtain authorized supervisor signature and stamped gate pass on BOL.
5. Notify dispatch team immediately via phone prior to departure.`;

        const deliveryDate = getField(row, ['deliverydate', 'delivery_date'], 18) || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
        const deliveryTime = getField(row, ['deliverytime', 'delivery_time'], 19) || '05:00 PM';
        const deliveryCompany = getField(row, ['deliverycompany', 'deliverycompanyname'], 20) || 'Chittagong Maritime Terminal Hub';
        const deliveryContactPerson = getField(row, ['deliverycontactperson', 'deliverycontact'], 21) || 'Rahim Uddin';
        const deliveryPhone = getField(row, ['deliveryphone', 'deliverytel'], 22) || '+8801819987654';
        const deliveryEmail = getField(row, ['deliveryemail'], 23) || 'cargo@delivery.com';
        const deliveryCountry = getField(row, ['deliverycountry'], 24) || 'Bangladesh';
        const deliveryState = getField(row, ['deliverystatedivision', 'deliverystate'], 25) || 'Chittagong Division';
        const deliveryCity = getField(row, ['deliverycity'], 26) || 'Chittagong';
        const deliveryZip = getField(row, ['deliveryzipcode', 'deliveryzip'], 27) || '4000';
        const deliveryAddress = getField(row, ['deliveryfulladdress', 'deliveryaddress'], 28) || `${deliveryCompany}, ${deliveryCity}`;
        const deliveryMapUrl = getField(row, ['deliverygooglemapurl', 'deliverymap'], 29) || '';
        const rawDeliveryInst = getField(row, ['deliveryspecialinstructions', 'deliveryinstructions'], 30);
        const deliveryInstructions = rawDeliveryInst ? rawDeliveryInst.replace(/\\n/g, '\n') : `1. Contact destination warehouse receiving manager 1 hour prior to arrival.
2. Vehicle must be parked in designated Unloading Bay #2 only.
3. Receiving permitted strictly between 08:00 AM and 06:00 PM.
4. Verify item count and pallet condition with warehouse receiver before offloading.
5. Secure signed and stamped Proof of Delivery (POD) copy before leaving facility.`;

        const vehicleType = getField(row, ['vehicletypepreference', 'vehicletype', 'vehicle'], 31) || 'Covered Van (20ft)';
        const cargoLoadType = getField(row, ['cargoloadtype', 'loadtype'], 32) || 'Pallets / Boxes';
        const itemsCount = getField(row, ['itemscount', 'totalitems'], 33) || '10';
        const palletsCount = getField(row, ['palletscount', 'pallets'], 34) || '5';
        const totalWeight = getField(row, ['totalweight', 'weight'], 35) || '2500';
        const totalVolume = getField(row, ['totalvolume', 'volume', 'cbm'], 36) || '15.5';
        const cargoDimensions = getField(row, ['cargodimensions', 'dimensions'], 37) || '120x80x100 CM';

        // Parse Cargo Items
        const items: ParsedCargoItem[] = [];
        for (let i = 1; i <= 5; i++) {
            const itemType = getField(row, [`item${i}type`], -1);
            const itemQty = getField(row, [`item${i}qty`, `item${i}quantity`], -1);
            const itemDim = getField(row, [`item${i}dimensions`, `item${i}dim`], -1);
            const itemWeight = getField(row, [`item${i}weight`], -1);
            const itemHandling = getField(row, [`item${i}handling`], -1);

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

        // Value added services
        const services: string[] = [];
        if (/yes|true|1/i.test(getField(row, ['stackablecargo', 'stackable']))) services.push('Stackable Cargo');
        if (/yes|true|1/i.test(getField(row, ['fragilecare', 'fragile']))) services.push('Fragile Care');
        if (/yes|true|1/i.test(getField(row, ['hazardous']))) services.push('Hazardous Material');
        if (/yes|true|1/i.test(getField(row, ['tempcontrolled', 'temperature']))) services.push('Temperature Controlled');
        if (/yes|true|1/i.test(getField(row, ['oversizedcargo', 'oversized']))) services.push('Oversized Cargo');
        if (/yes|true|1/i.test(getField(row, ['loadingservicerequired', 'loading']))) services.push('Loading Service Required');
        if (/yes|true|1/i.test(getField(row, ['unloadingservicerequired', 'unloading']))) services.push('Unloading Service Required');
        if (/yes|true|1/i.test(getField(row, ['packagingservice', 'packaging']))) services.push('Packaging Service');
        if (/yes|true|1/i.test(getField(row, ['cargoinsurance', 'insurance']))) services.push('Cargo Insurance');
        if (services.length === 0) {
            services.push('Loading Required', 'Unloading Required', 'Cargo Insurance', 'Waterproof Covered Vehicle');
        }

        const rawBudget = getField(row, ['targetbudgetrate', 'budget', 'rate', 'amount'], 64) || '45000';
        const budget = rawBudget.replace(/[^0-9.]/g, '') || '45000';
        const allowNegotiation = getField(row, ['allowratenegotiation', 'allownegotiation']) || 'Yes';
        const receiveMultipleBids = getField(row, ['receivemultiplebids', 'multiplebids']) || 'Yes';
        const autoExpire = getField(row, ['autoexpireduration', 'autoexpire']) || '7 Days';

        const customerNotes = getField(row, ['customernotes', 'notes'], 69) || 'Handle with care. Waterproof transport required.';
        const specialInstructions = getField(row, ['specialinstructions'], 70) || 'Driver must wear safety vest upon arrival.';
        const internalRefId = getField(row, ['internalreferenceid', 'internalrefid', 'refid'], 71) || `REF-${Math.floor(10000 + Math.random() * 90000)}`;
        const attachedZip = getField(row, ['attachedziparchivefile', 'attachedzip', 'zipfile'], 72) || '';

        return {
            requestTitle: title,
            priority,
            shipmentType,
            serviceType,
            expectedTransit,
            pickupDate,
            pickupTime,
            pickupCompany,
            pickupContactPerson,
            pickupPhone,
            pickupEmail,
            pickupCountry,
            pickupState,
            pickupCity,
            pickupZip,
            pickupAddress,
            pickupMapUrl,
            pickupInstructions,
            deliveryDate,
            deliveryTime,
            deliveryCompany,
            deliveryContactPerson,
            deliveryPhone,
            deliveryEmail,
            deliveryCountry,
            deliveryState,
            deliveryCity,
            deliveryZip,
            deliveryAddress,
            deliveryMapUrl,
            deliveryInstructions,
            vehicleType,
            cargoLoadType,
            itemsCount,
            palletsCount,
            totalWeight,
            totalVolume,
            cargoDimensions,
            items,
            services,
            budget,
            allowNegotiation,
            receiveMultipleBids,
            autoExpire,
            customerNotes,
            specialInstructions,
            internalRefId,
            attachedZip,
            // Row preview
            pickup: `${pickupCity} (${pickupCompany})`,
            delivery: `${deliveryCity} (${deliveryCompany})`,
            vehicle: vehicleType,
            amount: budget,
            title,
        };
    });

    return {
        rows: requests,
        primary: requests[0] || null,
    };
}
