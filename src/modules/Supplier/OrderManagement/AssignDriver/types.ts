export interface FleetDriverItem {
    id: string;
    rawId: string | number;
    name: string;
    phone: string;
    license: string;
    vehiclePlate: string;
    vehicleType: string;
    role: string;
    status: string;
    email?: string;
}

export interface FleetVehicleItem {
    id: string;
    name: string;
    type: string;
    registration_no: string;
    capacity: string;
    capacity_kg?: number;
    status: 'Available' | 'On Job' | 'Unavailable';
    assigned_driver?: string;
    driver_id?: number | string;
}
