export interface DimensionItem {
    id: number;
    length: string;
    width: string;
    height: string;
    qty: string;
    unit: string;
}

export interface QuoteFormData {
    requestTitle: string;
    priority: string;
    shipmentType: string;
    serviceType: string;
    pickupDate: string;
    pickupTime: string;
    deliveryDate: string;
    deliveryTime: string;
    expectedTransitTime: string;

    pickupCompany: string;
    pickupContactName: string;
    pickupPhone: string;
    pickupEmail: string;
    pickupCountry: string;
    pickupState: string;
    pickupCity: string;
    pickupZip: string;
    pickupAddress: string;
    pickupMapUrl: string;
    pickupInstructions: string;

    deliveryCompany: string;
    deliveryContactName: string;
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
    loadType: string;
    itemsCount: string;
    palletsCount: string;
    weight: string;
    volume: string;
    dimensions: DimensionItem[];

    stackable: boolean;
    fragile: boolean;
    hazardous: boolean;
    tempControlled: boolean;
    oversized: boolean;
    perishable: boolean;
    loadingRequired: boolean;
    unloadingRequired: boolean;
    packaging: boolean;
    insurance: boolean;
    insuranceType: string;
    liftGate: boolean;
    whiteGlove: boolean;
    assembly: boolean;
    insideDelivery: boolean;
    storage: boolean;

    budget: string;
    currency: string;
    allowNegotiation: boolean;
    receiveMultiple: boolean;
    autoExpire: string;

    customerNotes: string;
    specialInstructions: string;
    internalReference: string;

    images: any[];
    packingList: any | null;
    invoice: any | null;
}
