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
