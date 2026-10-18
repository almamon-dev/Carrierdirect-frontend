export type ShipmentStatus =
    | 'assigned'
    | 'accepted'
    | 'at_pickup'
    | 'in_transit'
    | 'at_delivery'
    | 'delivered'
    | 'completed'
    | 'cancelled';

export interface ShipmentMilestone {
    key: ShipmentStatus;
    title: string;
    description: string;
    completedAt?: string;
    isCurrent?: boolean;
    isPassed?: boolean;
}

export interface ShipmentItem {
    id: string;
    orderNumber: string;
    trackingNumber: string;
    status: ShipmentStatus;
    priority: 'Standard' | 'Urgent' | 'High Value';
    shipper: {
        name: string;
        company: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        pickupDate: string;
        pickupTimeWindow: string;
        notes?: string;
    };
    consignee: {
        name: string;
        company: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        deliveryDate: string;
        deliveryTimeWindow: string;
        notes?: string;
    };
    cargo: {
        description: string;
        freightType: string;
        weightKg: number;
        pallets: number;
        hazardous: boolean;
        temperatureControlled?: string;
        dimensions?: string;
        valueEstimate?: string;
    };
    route: {
        distanceKm: number;
        distanceFormatted?: string;
        estimatedDuration: string;
        tollRoads: boolean;
        currentLat?: number;
        currentLng?: number;
        originCoords: { lat: number; lng: number };
        destinationCoords: { lat: number; lng: number };
    };
    payout: {
        driverEarnings: number;
        fuelSurcharge: number;
        bonus?: number;
        currency: string;
    };
    history?: Array<{
        status: string;
        title: string;
        description: string;
        time?: string;
        date: string;
        raw_date?: string;
        time_ago?: string;
    }>;
    driver?: {
        name: string;
        phone: string;
        vehiclePlate: string;
        vehicleType: string;
    };
    podStatus?: string;
    podData?: {
        uploadedAt: string;
        receiverName: string;
        signatureUrl?: string;
        documentPhotos?: string[];
        notes?: string;
    };
    createdAt: string;
    updatedAt: string;
}
