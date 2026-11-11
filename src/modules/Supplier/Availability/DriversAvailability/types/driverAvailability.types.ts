export type DriverItem = {
    id: string;
    user_id?: number;
    employee_id?: string;
    name: string;
    email?: string;
    phone: string;
    status: 'Available' | 'On Job' | 'On Break' | 'Offline' | 'Blocked' | 'Disabled' | 'Unavailable' | string;
    duty_status?: 'online' | 'offline' | 'break' | string;
    job_status?: 'available' | 'on_job' | string;
    account_status?: 'active' | 'disabled' | 'blocked' | string;
    user_status?: string;
    is_eligible?: boolean;
    disqualification_reason?: string | null;
    active_assignment?: {
        order_id?: number | null;
        order_number?: string | null;
        shipment_id?: number | null;
        tracking_number?: string | null;
        leg_id?: number | null;
        leg_number?: number | null;
        leg_type?: string | null;
        assignment_type?: string | null;
    } | null;
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
    on_job: number;
    break?: number;
    offline?: number;
    blocked?: number;
    unavailable: number;
};

export type DriverFilterStatus = 'All' | 'Available' | 'On Job' | 'On Break' | 'Offline' | 'Blocked' | 'Unavailable';

export interface DriverAvailabilityLogItem {
    id: number;
    driver_id: number;
    previous_duty_status: string | null;
    new_duty_status: string;
    previous_job_status: string | null;
    new_job_status: string | null;
    order_id: number | null;
    order_number?: string | null;
    shipment_id: number | null;
    shipment_leg_id: number | null;
    changed_by: number | null;
    changed_by_name?: string | null;
    user_role: string | null;
    source: 'driver_app' | 'supplier_dashboard' | 'system' | string;
    change_reason: string | null;
    created_at: string;
}
