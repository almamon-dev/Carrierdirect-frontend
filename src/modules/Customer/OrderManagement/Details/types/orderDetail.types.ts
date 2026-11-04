export interface ExtraChargeItem {
    id?: string | number;
    name: string;
    amount: number;
    amountFormatted: string;
}

export interface OrderLocationInfo {
    city: string;
    address: string;
    company?: string;
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    date: string;
    time: string;
    lat?: number | null;
    lng?: number | null;
    instructions?: string;
}

export interface OrderVehicleInfo {
    type: string;
    number: string;
    capacity: string;
    goodsType: string;
    dimensions?: string;
}

export interface OrderDriverInfo {
    name: string;
    phone: string;
    email?: string;
    plate: string;
    avatar?: string;
    latitude?: number | null;
    longitude?: number | null;
    currentLocation?: string;
    lastUpdatedHuman?: string;
}

export interface ProductLocationDetails {
    stage: 'at_pickup' | 'in_transit' | 'delivered';
    statusLabel: string;
    currentAddress: string;
    currentCity: string;
    latitude?: number | null;
    longitude?: number | null;
    hasLiveGps: boolean;
    updatedAt?: string;
    updatedHuman: string;
}

export interface OrderProductItem {
    id: number | string;
    itemType: string;
    quantity: number;
    dimensions?: string | null;
    weight?: number | null;
    weightFormatted?: string | null;
}

export interface OrderSupplierDetails {
    id?: string | number;
    name: string;
    avatar?: string;
    verified: boolean;
    rating: number;
    reviews: number;
    completedOrders: string | number;
    successRate: string;
    responseTime: string;
    location?: string;
    memberSince: string;
    phone?: string;
    email?: string;
}

export interface OrderPricingDetails {
    base: number;
    extra: number;
    extraCharges: ExtraChargeItem[];
    platformFee?: number;
    platformFeeFormatted?: string;
    platformFeePercent?: number;
    quoteAmount?: number;
    quoteFormatted?: string;
    total: number;
    baseFormatted: string;
    extraFormatted: string;
    totalFormatted: string;
    advancePaid: number;
    due: number;
    advanceFormatted: string;
    dueFormatted: string;
}

export interface OrderPodDetails {
    isAvailable: boolean;
    isAccepted: boolean;
    fileUrl?: string;
    fileName?: string;
    signatureUrl?: string;
    receiverName?: string;
    note?: string;
    uploadedAt?: string;
}

export interface NormalizedCustomerOrder {
    id: string;
    rawId: string | number;
    orderNumber: string;
    status: string;
    rawStatus: string;
    paymentStatus: string;
    isPaid: boolean;
    isEscrow: boolean;
    isPayLater: boolean;
    payLaterDueDate: string;
    payLaterDaysLeft?: number;
    payLaterTimeLeftFormatted?: string;
    paymentMethod?: string;
    pickup: OrderLocationInfo;
    delivery: OrderLocationInfo;
    route: string;
    distance: string;
    distanceKm?: number | null;
    estimatedDurationMinutes?: number | null;
    pickupLat?: number | null;
    pickupLng?: number | null;
    deliveryLat?: number | null;
    deliveryLng?: number | null;
    driverLat?: number | null;
    driverLng?: number | null;
    driverCurrentLocation?: string;
    driverLocationUpdatedHuman?: string;
    productLocation: ProductLocationDetails;
    productItems: OrderProductItem[];
    estArrival: string;
    vehicle: OrderVehicleInfo;
    driver?: OrderDriverInfo;
    supplier: OrderSupplierDetails;
    pricing: OrderPricingDetails;
    pod: OrderPodDetails;
    isRated: boolean;
    quoteId?: string | number;
    orderType?: string;
    serviceType?: string;
    reference?: string;
    instructions?: string;
    loadType?: string;
    createdAt?: string;
    trackingHistory?: any[];
    updates?: any[];
}

export interface TimelineItem {
    id: number;
    status: string;
    time: string;
    completed: boolean;
    active: boolean;
    location?: string;
    description?: string;
    desc?: string;
    icon?: any;
    note?: string;
}
