export type ShipmentStatus =
    | 'assigned'
    | 'accepted'
    | 'at_pickup'
    | 'picked_up'
    | 'in_transit'
    | 'at_hub'
    | 'handover_pending'
    | 'handover_accepted'
    | 'at_delivery'
    | 'delivered'
    | 'completed'
    | 'cancelled';

export interface ShipmentHandoverInfo {
    id: number;
    status: 'pending_acceptance' | 'accepted' | 'rejected' | 'cancelled';
    hub_location: string;
    cargo_condition: string;
    cargo_condition_notes?: string;
    photos?: string[];
    otp_code?: string;
    driver_from_name?: string;
    driver_from_phone?: string;
    driver_to_name?: string;
    driver_to_phone?: string;
    handover_at?: string;
    accepted_at?: string;
    rejection_reason?: string;
    notes?: string;
}

export interface PartnerDriverInfo {
    leg_number: number;
    driver_name: string;
    driver_phone: string;
    vehicle_plate: string;
    vehicle_type: string;
    company: string;
}

export interface RelayLegInfo {
    leg_number: number;
    leg_type: string;
    journey_leg: string;
    status: string;
    execution_mode: string;
    driver_name?: string;
    driver_phone?: string;
    vehicle_plate?: string;
    vehicle_type?: string;
    assigned_at?: string;
    completed_at?: string;
}

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
    rawMilestoneStatus?: string;
    orderStatus?: string;
    priority: 'Standard' | 'Urgent' | 'High Value';
    driverType?: 'internal' | 'subcontractor';
    subcontractorCompany?: string;
    subcontractorJourneyLeg?: string;
    pickup_address?: string;
    delivery_address?: string;
    pickup_city?: string;
    delivery_city?: string;
    pickup_country?: string;
    delivery_country?: string;
    pickup_state?: string;
    delivery_state?: string;
    pickup_zip?: string;
    delivery_zip?: string;
    pickupAddress?: string;
    deliveryAddress?: string;
    from?: string;
    to?: string;
    pickup?: any;
    delivery?: any;
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
    payout?: {
        driverEarnings?: number;
        fuelSurcharge?: number;
        bonus?: number;
        currency?: string;
    };
    isRelay?: boolean;
    currentActiveLeg?: number;
    isDeliveryOnly?: boolean;
    assignedLeg?: {
        leg_number: number;
        leg_type: string;
        execution_mode: string;
        journey_leg: string;
        status: string;
    } | null;
    driverLegNumber?: number;
    hubLocation?: string;
    partnerDriver?: PartnerDriverInfo | null;
    handover?: ShipmentHandoverInfo | null;
    relayLegs?: RelayLegInfo[];
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
