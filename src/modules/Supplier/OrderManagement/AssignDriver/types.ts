export type ExecutionMode = 'in_house' | 'subcontractor';
export type LegType = 'pickup' | 'delivery';

export interface FleetDriverItem {
    id: string;
    rawId: string | number;
    user_id?: number;
    name: string;
    phone: string;
    license: string;
    vehiclePlate: string;
    vehicleType: string;
    vehicleId?: string;
    role: string;
    status: string;
    availabilityStatus: 'Available' | 'On Job' | 'Unavailable' | string;
    account_status?: 'active' | 'disabled' | 'blocked' | string;
    duty_status?: 'online' | 'offline' | 'break' | string;
    job_status?: 'available' | 'on_job' | string;
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
    dutyStatus?: string;
    userStatus?: string;
    email?: string;
    driverType?: 'internal' | 'subcontractor';
    subcontractorCompany?: string;
    subcontractorId?: string | number;
}

export interface FleetVehicleItem {
    id: string;
    name: string;
    type: string;
    registration_no: string;
    capacity: string;
    capacity_kg?: number;
    status: 'Active' | 'Available' | 'On Job' | 'Maintenance' | 'Inactive' | 'Unavailable';
    assigned_driver?: string;
    driver_id?: number | string;
    current_order_id?: number | string;
    current_order_number?: string;
}

export interface LegAssignmentState {
    legNumber: 1 | 2;
    legType: LegType;
    executionMode: ExecutionMode;
    driverId: string;
    vehicleId: string;
    subcontractorId: string;
    subcontractorCompany: string;
    subcontractorDriverId: string;
    subcontractorDriverName: string;
    subcontractorDriverPhone: string;
    subcontractorDriverEmail: string;
    subcontractorVehiclePlate: string;
    subcontractorVehicleType: string;
    subcontractorCost: string;
    journeyLeg: string;
    status?: string;
}

export interface DispatchFinancialSummary {
    customerPrice: number;
    pickupSubcontractorCost: number;
    deliverySubcontractorCost: number;
    totalSubcontractorCost: number;
    netProfit: number;
    profitMarginPercent: number;
    isProfitable: boolean;
}

export interface ShipmentLegApiItem {
    id?: number;
    shipment_id?: number;
    leg_number: number;
    leg_type: LegType;
    execution_mode: ExecutionMode;
    driver_id?: number | null;
    driver_name?: string | null;
    driver_phone?: string | null;
    driver_email?: string | null;
    vehicle_id?: string | null;
    vehicle_plate?: string | null;
    vehicle_type?: string | null;
    subcontractor_id?: number | null;
    subcontractor_company?: string | null;
    subcontractor_driver_name?: string | null;
    subcontractor_driver_phone?: string | null;
    subcontractor_vehicle_plate?: string | null;
    subcontractor_cost?: number;
    journey_leg?: string | null;
    notes?: string | null;
    status?: string;
}
