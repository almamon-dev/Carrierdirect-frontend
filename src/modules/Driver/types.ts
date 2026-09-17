export interface DriverProfile {
    id: string | number;
    name: string;
    avatar: string;
    title: string; // e.g. "Driver Captain"
    slogan: string; // e.g. "Safe Drive • On Time • Happy Customers"
    licenseBadge: string; // e.g. "CDL-A"
    isVerified: boolean;
    employmentStatus?: 'Active' | 'On Leave' | 'Suspended';
    dutyStatus: 'online' | 'offline' | 'on_trip' | 'break';
    phone: string;
    email: string;
    address?: string;
    cdlDetails?: {
        cdlNumber: string;
        licenseClass: string;
        stateOfIssue: string;
        issueDate: string;
        expirationDate: string;
        endorsements: string;
        cdlFrontUrl: string;
        cdlBackUrl: string;
        verification: string;
    };
    dotMedical?: {
        nrcmeRegistryId: string;
        medicalExaminer: string;
        examDate: string;
        expiryDate: string;
        certificateStatus: string;
        certificateUrl: string;
        mcsaForm: string;
        mcsaFormUrl: string;
    };
    fleetEquipment?: {
        tractorModel: string;
        year: number | string;
        unitNumber: string;
        vin: string;
        licensePlate: string;
        equipmentType: string;
        eldUnitId: string;
        currentMileage: string;
        trailerNumber: string;
        trailerVin: string;
        trailerType: string;
        gpsTracker: string;
        inspectionStatus: string;
        inspectionCertificateName: string;
        inspectionCertificateUrl: string;
        insuranceStatus: string;
        insuranceCertificateUrl: string;
    };
    vehicleAssigned: {
        plate: string;
        model: string;
        type: string;
        capacity: string;
        status: 'Active' | 'Maintenance' | 'Inactive';
    };
    driverLicense: string;
    joinedDate: string;
    homeTerminal: string;
    emergencyContact: {
        name: string;
        relationship: string;
        phone: string;
    };
    stats: {
        activeLoads: number;
        todayOrders: number;
        distanceKm: number;
        rating: number;
        totalRatings: number;
        onTimeRate: string;
        completedTrips: number;
    };
    preferences: {
        navigationApp: 'Google Truck GPS' | 'Waze' | 'Apple Maps' | 'HERE WeGo';
        notificationSounds: boolean;
        autoAcceptDispatch: boolean;
        offlineMaps: boolean;
        darkMode: boolean;
    };
}

export type ShipmentStatus = 
    | 'assigned' 
    | 'accepted' 
    | 'at_pickup' 
    | 'in_transit' 
    | 'at_delivery' 
    | 'delivered' 
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

export interface DriverChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: 'driver' | 'dispatcher' | 'customer' | 'support';
    senderAvatar?: string;
    message: string;
    type: 'text' | 'image' | 'status_update' | 'location_share' | 'voice_note';
    timestamp: string;
    attachmentUrl?: string;
    metadata?: any;
    isMe: boolean;
    status?: 'sent' | 'delivered' | 'read';
}

export interface DriverChatConversation {
    id: string;
    title: string;
    role: 'Dispatcher' | 'Customer' | 'Safety & Ops' | 'Support';
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    avatar: string;
    isOnline: boolean;
    relatedOrderId?: string;
    phone?: string;
}

export interface DriverNotification {
    id: string;
    title: string;
    message: string;
    type: 'trip_assigned' | 'route_update' | 'safety_alert' | 'payout' | 'system';
    timestamp: string;
    isRead: boolean;
    actionUrl?: string;
    priority?: 'normal' | 'high' | 'urgent';
}
