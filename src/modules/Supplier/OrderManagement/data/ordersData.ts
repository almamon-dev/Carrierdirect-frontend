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

export const mockSupplierOrders: SupplierOrder[] = [
    {
        id: 'JOB-2024-001',
        slug: 'job-2024-001-dhaka-to-chittagong',
        customer: 'Acme Logistics Ltd.',
        customerPhone: '+880 1711-908234',
        customerEmail: 'shipping@acmelogistics.com',
        pickup: 'Dhaka',
        pickupFullAddress: 'Plot 42, Sector 7, Uttara Commercial Area, Dhaka 1230',
        pickupDate: '22 Jul 2026',
        pickupTimeWindow: '08:00 AM - 12:00 PM',
        delivery: 'Chittagong Port',
        deliveryFullAddress: 'Gate 4, Chittagong Port Authority, Agrabad C/A, Chittagong 4100',
        deliveryDate: '23 Jul 2026',
        deliveryTimeWindow: '02:00 PM - 06:00 PM',
        distance: '265 KM',
        estimatedDuration: '5 hrs 45 mins',
        driver: 'John Doe',
        driverPhone: '+880 1812-334455',
        vehicle: 'Covered Truck (10-Ton)',
        vehiclePlate: 'DH-11-2099',
        status: 'In Transit',
        loadType: 'Palletized Electronics',
        weight: '2,500 KG',
        volume: '15.5 CBM',
        agreedPrice: '€450.00',
        platformFee: '€22.50',
        netPayout: '€427.50',
        podStatus: 'Pending Review',
        podFileUrl: '/docs/pod-job-2024-001.pdf',
        podUploadDate: '22 Jul 2026, 04:30 PM',
        cargoItemsCount: 50,
        timeline: [
            { title: 'Job Confirmed & Assigned', description: 'Driver John Doe assigned with Covered Truck #DH-11-2099', timestamp: '21 Jul 2026, 10:00 AM', completed: true },
            { title: 'Departed Pickup Hub', description: 'Cargo loaded at Uttara Commercial Area, Dhaka', timestamp: '22 Jul 2026, 09:15 AM', completed: true },
            { title: 'In Transit via Highway N3', description: 'Currently near Comilla Highway Checkpoint (GPS Active)', timestamp: '22 Jul 2026, 01:45 PM', completed: true, current: true },
            { title: 'Arrival at Destination', description: 'Expected at Chittagong Port Authority Gate 4', timestamp: '23 Jul 2026, 02:00 PM', completed: false },
            { title: 'Delivery Completed & POD', description: 'Recipient signature & Proof of Delivery confirmation', timestamp: 'Pending', completed: false },
        ],
    },
    {
        id: 'JOB-2024-002',
        slug: 'job-2024-002-sylhet-to-dhaka',
        customer: 'Stark Cargo Global',
        customerPhone: '+880 1912-887766',
        customerEmail: 'logistics@starkcargo.org',
        pickup: 'Sylhet Industrial Zone',
        pickupFullAddress: 'Block C, Sylhet Export Processing Zone, Sylhet 3100',
        pickupDate: '24 Jul 2026',
        pickupTimeWindow: '09:00 AM - 01:00 PM',
        delivery: 'Dhaka Airport Cargo Village',
        deliveryFullAddress: 'Customs Freight Terminal 2, HSIA, Kurmitola, Dhaka 1229',
        deliveryDate: '24 Jul 2026',
        deliveryTimeWindow: '05:00 PM - 09:00 PM',
        distance: '240 KM',
        estimatedDuration: '5 hrs 15 mins',
        driver: 'Sarah Lee',
        driverPhone: '+880 1715-443322',
        vehicle: 'Refrigerated Van',
        vehiclePlate: 'DH-14-8812',
        status: 'Scheduled',
        loadType: 'Perishable Pharmaceuticals',
        weight: '1,200 KG',
        volume: '8.0 CBM',
        agreedPrice: '€550.00',
        platformFee: '€27.50',
        netPayout: '€522.50',
        podStatus: 'Not Uploaded',
        cargoItemsCount: 30,
        timeline: [
            { title: 'Job Confirmed', description: 'Vehicle scheduled for pickup at Sylhet EPZ', timestamp: '22 Jul 2026, 11:30 AM', completed: true, current: true },
            { title: 'Dispatched to Pickup', description: 'Driver En Route to Sylhet Hub', timestamp: 'Pending', completed: false },
            { title: 'In Transit', description: 'En route to HSIA Cargo Terminal', timestamp: 'Pending', completed: false },
            { title: 'Delivered', description: 'Final delivery verification', timestamp: 'Pending', completed: false },
        ],
    },
    {
        id: 'JOB-2024-003',
        slug: 'job-2024-003-chittagong-to-khulna',
        customer: 'Wayne Enterprises',
        customerPhone: '+880 1611-223344',
        customerEmail: 'ops@wayne-ent.com',
        pickup: 'Chittagong EPZ',
        pickupFullAddress: 'Sector 2, CEPZ, South Halishahar, Chittagong 4223',
        pickupDate: '20 Jul 2026',
        pickupTimeWindow: '07:00 AM - 11:00 AM',
        delivery: 'Khulna Port Complex',
        deliveryFullAddress: 'Mongla Port Depot 3, Mongla, Khulna 9350',
        deliveryDate: '21 Jul 2026',
        deliveryTimeWindow: '10:00 AM - 02:00 PM',
        distance: '380 KM',
        estimatedDuration: '8 hrs 30 mins',
        driver: 'Mike Ross',
        driverPhone: '+880 1819-776655',
        vehicle: 'Heavy Trailer (20-Ton)',
        vehiclePlate: 'CT-09-5511',
        status: 'Delivered',
        loadType: 'Industrial Heavy Machinery',
        weight: '12,000 KG',
        volume: '45.0 CBM',
        agreedPrice: '€850.00',
        platformFee: '€42.50',
        netPayout: '€807.50',
        podStatus: 'Approved',
        podFileUrl: '/docs/pod-job-2024-003.pdf',
        podUploadDate: '21 Jul 2026, 01:15 PM',
        cargoItemsCount: 4,
        timeline: [
            { title: 'Job Confirmed & Dispatched', description: 'Heavy Trailer assigned', timestamp: '19 Jul 2026, 03:00 PM', completed: true },
            { title: 'Loaded at CEPZ', description: 'Heavy machinery securely strapped', timestamp: '20 Jul 2026, 08:30 AM', completed: true },
            { title: 'In Transit', description: 'Highway travel completed cleanly', timestamp: '20 Jul 2026, 05:00 PM', completed: true },
            { title: 'Delivered & Signed', description: 'Received by Mongla Port Depot Manager', timestamp: '21 Jul 2026, 12:45 PM', completed: true, current: true },
        ],
    },
];

export const getSupplierOrderBySlug = (slug?: string): SupplierOrder => {
    if (!slug) return mockSupplierOrders[0];
    const found = mockSupplierOrders.find(o => o.slug === slug || o.id.toLowerCase() === slug.toLowerCase());
    return found || mockSupplierOrders[0];
};
