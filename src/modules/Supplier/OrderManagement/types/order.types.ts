export type OrderStatus = 'Scheduled' | 'Dispatched' | 'In Transit' | 'Arrived' | 'Delivered' | 'Delayed' | 'Cancelled';

export type OrderTimelineStep = {
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
};

export type SupplierOrder = {
    id: string;
    slug: string;
    customer: string;
    customerPhone: string;
    customerEmail: string;
    pickup: string;
    pickupFullAddress: string;
    pickupDate: string;
    pickupTimeWindow: string;
    delivery: string;
    deliveryFullAddress: string;
    deliveryDate: string;
    deliveryTimeWindow: string;
    distance: string;
    estimatedDuration: string;
    driver: string;
    driverPhone: string;
    vehicle: string;
    vehiclePlate: string;
    status: OrderStatus;
    loadType: string;
    weight: string;
    volume: string;
    agreedPrice: string;
    platformFee: string;
    netPayout: string;
    podStatus: 'Pending Review' | 'Approved' | 'Rejected' | 'Not Uploaded';
    podFileUrl?: string;
    podUploadDate?: string;
    cargoItemsCount: number;
    timeline: OrderTimelineStep[];
};
