export type DriverItem = {
    id: string;
    user_id?: number;
    employee_id?: string;
    name: string;
    email?: string;
    phone: string;
    status: 'Available' | 'On Job' | 'Unavailable';
    duty_status?: string;
    user_status?: string;
    currentLocation: string;
    license?: string;
    assignedVehicle?: string | null;
    vehicle?: {
        name?: string;
        model?: string;
        type?: string;
        plate?: string;
        registration_no?: string;
        capacity?: string;
    } | null;
    assignedServiceArea?: string | null;
    service_area?: {
        id: number;
        country: string;
        state?: string;
        city?: string;
        postal_code?: string;
        radius_km?: number;
        formatted?: string;
        is_active?: boolean;
    } | null;
    service_area_id?: number | null;
    service_area_ids?: number[];
    service_areas?: any[];
    rating?: string;
    is_verified?: boolean;
    verification_status?: string;
    role?: string;
    created_at?: string;
};

export type DriverCounts = {
    all: number;
    available: number;
    unavailable: number;
    on_job: number;
};

export type DriverFilterStatus = 'All' | 'Available' | 'On Job' | 'Unavailable';
