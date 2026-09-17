export const initialDashboardMetrics = {
    activeLoads: {
        value: '2 Loads',
        subtitle: 'In dispatch transit',
        count: 2,
    },
    tripsCompleted: {
        value: '8 Orders',
        subtitle: '2 scheduled',
        count: 8,
    },
    distance: {
        value: '142.6 km',
        subtitle: "Today's drive",
        km: 142.6,
    },
    driverRating: {
        value: '4.95',
        subtitle: '52 reviews',
        rating: 4.95,
        reviewsCount: 52,
    },
};

export const activeShipmentInTransit = {
    id: 'SHP-987654',
    orderNumber: '#SHP-987654',
    cargoTag: 'Reefer -18°C',
    status: 'In Transit',
    origin: {
        name: 'ABC Warehouse Logistics (Bay 4)',
        address: 'Port Logistics Park, Seattle WA',
    },
    destination: {
        name: 'Starlight Supermarket Central (Dock 12)',
        address: '742 Evergreen Terrace, Seattle WA',
    },
    cargo: {
        type: 'Refrigerated Cold Chain Foods',
        weight: '16,500 kg',
        tempControlled: '-18°C',
    }
};

export const todayScheduleList = [
    {
        id: 'TRP-4899',
        tripId: '#TRP-4899',
        time: '04:30 PM',
        cargoType: 'Dry Van 53ft',
        origin: 'JFK Air Cargo Zone 3, Gate 5',
        destination: 'Brooklyn Logistics Center',
        status: 'Scheduled',
    },
    {
        id: 'TRP-4902',
        tripId: '#TRP-4902',
        time: '07:15 PM',
        cargoType: 'Flatbed Equipment',
        origin: 'Newark Industrial Park Dock 2',
        destination: 'Queens Metro Distribution Hub',
        status: 'Scheduled',
    },
];

export const activeTripSummary = activeShipmentInTransit;

export const telemetryData = {
    vehiclePlate: 'ABC-987654',
    speed: '62 mph',
    fuelLevel: 78,
    engineTemp: 'Optimal (195°F)',
    tirePressure: 'All 100 PSI (Good)',
    odometer: '142.6 km',
    lastSync: 'Just now',
};
