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
    pickupTimeTill?: string;
    deliveryDate: string;
    deliveryTime: string;
    deliveryTimeTill?: string;
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
    pickupInstructions: string;
    pickupLat?: number | string | null;
    pickupLng?: number | string | null;

    deliveryCompany: string;
    deliveryContactName: string;
    deliveryPhone: string;
    deliveryEmail: string;
    deliveryCountry: string;
    deliveryState: string;
    deliveryCity: string;
    deliveryZip: string;
    deliveryAddress: string;
    deliveryInstructions: string;
    deliveryLat?: number | string | null;
    deliveryLng?: number | string | null;
    distanceKm?: number | string | null;
    estimatedDurationMinutes?: number | string | null;

    vehicleType: string;
    loadType: string;
    itemsCount: string;
    palletsCount: string;
    weight: string;
    volume: string;
    dimensions: DimensionItem[];

    // Dynamic Cargo Requirements & Services from Database
    [key: string]: any;

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
