export interface SubcontractorDriver {
    id: number | string;
    subcontractor_id: number | string;
    name: string;
    phone: string;
    email?: string;
    driver_license_number?: string;
    vehicle_plate?: string;
    vehicle_type?: string;
    status: 'active' | 'inactive';
    notes?: string;
    created_at?: string;
}

export interface Subcontractor {
    id: number | string;
    supplier_id?: number | string;
    name: string;
    company_registration?: string;
    contact_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    vat_number?: string;
    status: 'active' | 'inactive';
    notes?: string;
    drivers_count?: number;
    drivers?: SubcontractorDriver[];
    created_at?: string;
}

