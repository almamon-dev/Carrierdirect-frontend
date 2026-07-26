export type DimensionsItem = {
    id: number;
    length: string;
    width: string;
    height: string;
    qty: string;
    unit: string;
};

export type CargoItem = {
    id: number;
    name: string;
    category: string;
    qty: string;
    weight: string;
    dimensions: string;
};

export type DocumentItem = {
    id: number;
    name: string;
    size: string;
    type: string;
    url?: string;
};

export type QuoteRequest = {
    id: string;
    slug: string;
    requestDate: string;
    customer: string;
    customerRating?: number;
    customerOrdersCount?: number;
    customerPhone?: string;
    customerEmail?: string;
    customerAvatar?: string;
    pickup: string;
    pickupFullAddress?: string;
    pickupTimeWindow?: string;
    delivery: string;
    deliveryFullAddress?: string;
    deliveryTimeWindow?: string;
    distance: string;
    estimatedDuration?: string;
    vehicleType?: string;
    loadType?: string;
    weight?: string;
    volume?: string;
    itemsCount?: string;
    palletsCount?: string;
    pickupDate?: string;
    deliveryDate?: string;
    budget: string;
    status: string;
    priority: string;
    timeRemaining?: string;
    assignedTo?: string;
    dimensions?: DimensionsItem[];
    cargoItems?: CargoItem[];
    stackable?: boolean;
    fragile?: boolean;
    hazardous?: boolean;
    tempControlled?: boolean;
    tempRange?: string;
    oversized?: boolean;
    perishable?: boolean;
    loadingRequired?: boolean;
    unloadingRequired?: boolean;
    packaging?: boolean;
    insurance?: boolean;
    liftGate?: boolean;
    whiteGlove?: boolean;
    assembly?: boolean;
    insideDelivery?: boolean;
    storage?: boolean;
    pickupInstructions?: string;
    deliveryInstructions?: string;
    pickupContact?: { name: string; phone: string; role: string };
    deliveryContact?: { name: string; phone: string; role: string };
    documents?: DocumentItem[];
    packingList?: any;
    invoice?: any;
    images?: any[];
    notes?: string;
};

export const mockQuoteRequests: QuoteRequest[] = [
    {
        id: 'QR-000125',
        slug: 'qr-000125-dhaka-to-chittagong',
        requestDate: '20 Jul 2026',
        customer: 'ABC Company Ltd.',
        customerRating: 4.8,
        customerOrdersCount: 34,
        customerPhone: '+880 1711-908234',
        customerEmail: 'logistics@abccompany.com',
        pickup: 'Dhaka',
        pickupFullAddress: 'Plot 42, Sector 7, Uttara Commercial Area, Dhaka 1230',
        pickupTimeWindow: '08:00 AM - 12:00 PM',
        delivery: 'Chittagong Port',
        deliveryFullAddress: 'Gate 4, Chittagong Port Authority, Agrabad C/A, Chittagong 4100',
        deliveryTimeWindow: '02:00 PM - 06:00 PM',
        distance: '265 KM',
        estimatedDuration: '5 hrs 45 mins',
        vehicleType: 'Covered Truck (10-Ton)',
        loadType: 'Pallet / Box / Container',
        weight: '2,500 KG',
        volume: '15.5 CBM',
        itemsCount: '50 Boxed Items',
        palletsCount: '5 Standard Pallets',
        pickupDate: '22 Jul 2026',
        deliveryDate: '23 Jul 2026',
        budget: '€450',
        status: 'New',
        priority: 'High',
        timeRemaining: '02:15:30',
        assignedTo: 'John Doe',
        dimensions: [
            { id: 1, length: '120', width: '100', height: '150', qty: '5', unit: 'CM' },
            { id: 2, length: '80', width: '60', height: '80', qty: '12', unit: 'CM' },
            { id: 3, length: '200', width: '150', height: '200', qty: '2', unit: 'CM' }
        ],
        cargoItems: [
            { id: 1, name: 'Industrial Electronics Components', category: 'Electronics', qty: '25 Boxes', weight: '1,200 KG', dimensions: '120x100x150 CM' },
            { id: 2, name: 'High-Density Spare Parts', category: 'Machinery Parts', qty: '15 Cartons', weight: '800 KG', dimensions: '80x60x80 CM' },
            { id: 3, name: 'Assembled Control Panels', category: 'Equipment', qty: '10 Units', weight: '500 KG', dimensions: '200x150x200 CM' }
        ],
        stackable: true,
        fragile: true,
        hazardous: false,
        tempControlled: false,
        oversized: false,
        perishable: false,
        loadingRequired: true,
        unloadingRequired: true,
        packaging: false,
        insurance: true,
        liftGate: false,
        whiteGlove: false,
        assembly: false,
        insideDelivery: false,
        storage: false,
        pickupInstructions: 'Deliver to warehouse bay 3.\nUnloading will be handled by our forklift operators.\nRequire recipient signature upon delivery.',
        deliveryInstructions: 'Check in at the security gate first.\nDo not park in the visitor parking area.\nContact site manager Mr. Rahman upon arrival.',
        pickupContact: { name: 'Farhan Tanvir', phone: '+880 1711-908234', role: 'Warehouse Manager' },
        deliveryContact: { name: 'Anisur Rahman', phone: '+880 1819-445566', role: 'Port Officer' },
        documents: [
            { id: 1, name: 'Cargo_Packing_List_QR125.pdf', size: '1.2 MB', type: 'PDF' },
            { id: 2, name: 'Pallet_Dimensions_Spec.png', size: '850 KB', type: 'IMAGE' }
        ]
    },
    {
        id: 'QR-000124',
        slug: 'qr-000124-sylhet-to-dhaka',
        requestDate: '19 Jul 2026',
        customer: 'Global Logistics Corp',
        customerRating: 4.6,
        customerOrdersCount: 19,
        customerPhone: '+880 1822-112233',
        customerEmail: 'dispatch@globallogistics.com',
        pickup: 'Sylhet',
        pickupFullAddress: 'Subidbazar Industrial Park, Road 3, Sylhet 3100',
        pickupTimeWindow: '09:00 AM - 01:00 PM',
        delivery: 'Dhaka',
        deliveryFullAddress: 'Tejgaon Industrial Area, Plot 14, Dhaka 1208',
        deliveryTimeWindow: '04:00 PM - 08:00 PM',
        distance: '240 KM',
        estimatedDuration: '5 hrs 10 mins',
        vehicleType: 'Covered Van (3.5-Ton)',
        loadType: 'Fragile Goods',
        weight: '1,200 KG',
        volume: '9.0 CBM',
        itemsCount: '30 Crates',
        palletsCount: '3 Wooden Crates',
        pickupDate: '21 Jul 2026',
        deliveryDate: '22 Jul 2026',
        budget: 'Open',
        status: 'Viewed',
        priority: 'Medium',
        timeRemaining: '12:00:00',
        assignedTo: 'Unassigned',
        dimensions: [
            { id: 1, length: '100', width: '80', height: '120', qty: '3', unit: 'CM' }
        ],
        cargoItems: [
            { id: 1, name: 'Glassware & Ceramic Products', category: 'Glassware', qty: '30 Crates', weight: '1,200 KG', dimensions: '100x80x120 CM' }
        ],
        stackable: false,
        fragile: true,
        hazardous: false,
        tempControlled: false,
        oversized: false,
        perishable: false,
        loadingRequired: true,
        unloadingRequired: true,
        packaging: true,
        insurance: true,
        liftGate: true,
        whiteGlove: true,
        assembly: false,
        insideDelivery: true,
        storage: false,
        pickupInstructions: 'Handle with extreme care. Air-suspension vehicle preferred.\nUse corner protectors on all crates during strap down.',
        deliveryInstructions: 'Deliver to 2nd floor via service elevator.\nInside delivery and careful uncrating required.',
        pickupContact: { name: 'Sabbir Ahmed', phone: '+880 1822-112233', role: 'Logistics Lead' },
        deliveryContact: { name: 'Nasrin Jahan', phone: '+880 1912-778899', role: 'Store Supervisor' },
        documents: [
            { id: 1, name: 'Fragile_Handling_Protocol.pdf', size: '2.4 MB', type: 'PDF' }
        ]
    },
    {
        id: 'QR-000123',
        slug: 'qr-000123-gazipur-to-khulna',
        requestDate: '18 Jul 2026',
        customer: 'Walton High-Tech Industries',
        customerRating: 4.9,
        customerOrdersCount: 82,
        customerPhone: '+880 1900-554433',
        customerEmail: 'freight@walton.bd',
        pickup: 'Gazipur',
        pickupFullAddress: 'Walton Hi-Tech Park, Chandra, Gazipur 1751',
        pickupTimeWindow: '06:00 AM - 10:00 AM',
        delivery: 'Khulna',
        deliveryFullAddress: 'Shiromoni Industrial Zone, Khulna 9204',
        deliveryTimeWindow: '01:00 PM - 05:00 PM',
        distance: '350 KM',
        estimatedDuration: '7 hrs 30 mins',
        vehicleType: 'Heavy Flatbed Truck (20-Ton)',
        loadType: 'Heavy Machinery',
        weight: '5,000 KG',
        volume: '28.0 CBM',
        itemsCount: '4 Heavy Units',
        palletsCount: '4 Heavy Skids',
        pickupDate: '25 Jul 2026',
        deliveryDate: '26 Jul 2026',
        budget: '€850',
        status: 'Quoted',
        priority: 'Urgent',
        timeRemaining: '00:45:10',
        assignedTo: 'Sarah Connor',
        dimensions: [
            { id: 1, length: '300', width: '200', height: '220', qty: '2', unit: 'CM' },
            { id: 2, length: '250', width: '180', height: '190', qty: '2', unit: 'CM' }
        ],
        cargoItems: [
            { id: 1, name: 'Heavy Stamping Press Machines', category: 'Heavy Machinery', qty: '2 Machinery Units', weight: '3,000 KG', dimensions: '300x200x220 CM' },
            { id: 2, name: 'Industrial Mold Tooling Units', category: 'Tooling', qty: '2 Heavy Skids', weight: '2,000 KG', dimensions: '250x180x190 CM' }
        ],
        stackable: false,
        fragile: false,
        hazardous: false,
        tempControlled: false,
        oversized: true,
        perishable: false,
        loadingRequired: true,
        unloadingRequired: true,
        packaging: false,
        insurance: true,
        liftGate: false,
        whiteGlove: false,
        assembly: false,
        insideDelivery: false,
        storage: false,
        pickupInstructions: 'Crane loading required at Gazipur plant.\nDriver must wear complete PPE (Helmet, Safety Boots, High-Vis Vest).',
        deliveryInstructions: 'Overhead crane unloading will be ready at site.\nArrival before 5:00 PM mandatory for crane booking.',
        pickupContact: { name: 'Kamrul Islam', phone: '+880 1900-554433', role: 'Plant Officer' },
        deliveryContact: { name: 'Tariqul Hasan', phone: '+880 1712-334455', role: 'Receiving Engineer' },
        documents: [
            { id: 1, name: 'Machinery_Weight_Cert.pdf', size: '3.1 MB', type: 'PDF' },
            { id: 2, name: 'Crane_Lifting_Diagram.pdf', size: '1.8 MB', type: 'PDF' }
        ]
    },
    {
        id: 'QR-000122',
        slug: 'qr-000122-dhaka-to-rajshahi',
        requestDate: '17 Jul 2026',
        customer: 'Beximco Pharmaceuticals',
        customerRating: 5.0,
        customerOrdersCount: 110,
        customerPhone: '+880 1730-889900',
        customerEmail: 'coldchain@beximco-pharma.com',
        pickup: 'Dhaka',
        pickupFullAddress: 'Beximco Pharma Hub, Tongi, Dhaka 1710',
        pickupTimeWindow: '07:00 AM - 10:00 AM',
        delivery: 'Rajshahi',
        deliveryFullAddress: 'Rajshahi Medical Depot, BSCIC Industrial Area, Rajshahi 6000',
        deliveryTimeWindow: '02:00 PM - 05:00 PM',
        distance: '250 KM',
        estimatedDuration: '5 hrs 15 mins',
        vehicleType: 'Refrigerated Van (2°C - 8°C)',
        loadType: 'Temperature Sensitive Medical',
        weight: '800 KG',
        volume: '6.5 CBM',
        itemsCount: '18 Thermo Boxes',
        palletsCount: '2 Insulated Pallets',
        pickupDate: '19 Jul 2026',
        deliveryDate: '20 Jul 2026',
        budget: '€300',
        status: 'Negotiation',
        priority: 'High',
        timeRemaining: '05:30:00',
        assignedTo: 'John Doe',
        dimensions: [
            { id: 1, length: '120', width: '80', height: '100', qty: '2', unit: 'CM' }
        ],
        cargoItems: [
            { id: 1, name: 'Temperature Sensitive Vaccines & Serums', category: 'Pharmaceuticals', qty: '18 Boxes', weight: '800 KG', dimensions: '120x80x100 CM' }
        ],
        stackable: true,
        fragile: true,
        hazardous: false,
        tempControlled: true,
        tempRange: '+2°C to +8°C Active Cooling',
        oversized: false,
        perishable: true,
        loadingRequired: true,
        unloadingRequired: true,
        packaging: true,
        insurance: true,
        liftGate: false,
        whiteGlove: false,
        assembly: false,
        insideDelivery: true,
        storage: false,
        pickupInstructions: 'Continuous temperature logging device required.\nPre-chill vehicle cargo hold to +4°C prior to loading.',
        deliveryInstructions: 'Direct transfer to cold room facility.\nTemperature graph log printout must be handed over to Pharmacist on duty.',
        pickupContact: { name: 'Dr. Shahadat Hossain', phone: '+880 1730-889900', role: 'Cold Chain Lead' },
        deliveryContact: { name: 'Dr. Mahmuda Begum', phone: '+880 1811-223344', role: 'Chief Pharmacist' },
        documents: [
            { id: 1, name: 'Cold_Chain_Protocol.pdf', size: '1.5 MB', type: 'PDF' },
            { id: 2, name: 'Pharma_Temp_Cert.pdf', size: '900 KB', type: 'PDF' }
        ]
    },
    {
        id: 'QR-000121',
        slug: 'qr-000121-narayanganj-to-chittagong-port',
        requestDate: '15 Jul 2026',
        customer: 'Square Textiles Ltd.',
        customerRating: 4.7,
        customerOrdersCount: 45,
        customerPhone: '+880 1911-332211',
        customerEmail: 'shipping@squaretextiles.com',
        pickup: 'Narayanganj',
        pickupFullAddress: 'Square Textile Mills, Kanchpur, Narayanganj 1430',
        pickupTimeWindow: '08:00 AM - 12:00 PM',
        delivery: 'Chittagong Port Container Yard',
        deliveryFullAddress: 'NCCT Container Terminal, Yard 7, Chittagong Port, Chittagong 4100',
        deliveryTimeWindow: '04:00 PM - 09:00 PM',
        distance: '230 KM',
        estimatedDuration: '4 hrs 50 mins',
        vehicleType: '40ft Container Trailer',
        loadType: 'Export Containers',
        weight: '15,000 KG',
        volume: '67.0 CBM',
        itemsCount: '1 High-Cube Container',
        palletsCount: '24 Export Bales',
        pickupDate: '16 Jul 2026',
        deliveryDate: '17 Jul 2026',
        budget: '€1,200',
        status: 'Expired',
        priority: 'Low',
        timeRemaining: '00:00:00',
        assignedTo: 'Unassigned',
        dimensions: [
            { id: 1, length: '1219', width: '243', height: '289', qty: '1', unit: 'CM' }
        ],
        cargoItems: [
            { id: 1, name: 'Cotton Yarn & Textile Fabrics (40ft FCL)', category: 'Textiles', qty: '1 Container', weight: '15,000 KG', dimensions: '1219x243x289 CM' }
        ],
        stackable: true,
        fragile: false,
        hazardous: false,
        tempControlled: false,
        oversized: false,
        perishable: false,
        loadingRequired: true,
        unloadingRequired: true,
        packaging: false,
        insurance: true,
        liftGate: false,
        whiteGlove: false,
        assembly: false,
        insideDelivery: false,
        storage: false,
        pickupInstructions: 'Container seal number must match Port Shipping Manifest.\nDriver must collect Gate Pass from gate office.',
        deliveryInstructions: 'Hand over shipping docs to Customs Agent at Yard 7.\nVerify container seal before departure.',
        pickupContact: { name: 'Mizanur Rahman', phone: '+880 1911-332211', role: 'Commercial Exec' },
        deliveryContact: { name: 'Jahangir Alam', phone: '+880 1715-667788', role: 'Customs C&F Agent' },
        documents: [
            { id: 1, name: 'Export_Bill_of_Lading_Draft.pdf', size: '4.2 MB', type: 'PDF' },
            { id: 2, name: 'Customs_Seal_Declaration.pdf', size: '1.1 MB', type: 'PDF' }
        ]
    }
];

export function getQuoteRequestBySlug(slug?: string): QuoteRequest {
    if (!slug) return mockQuoteRequests[0];
    const found = mockQuoteRequests.find(q => q.slug.toLowerCase() === slug.toLowerCase() || q.id.toLowerCase() === slug.toLowerCase());
    return found || mockQuoteRequests[0];
}
