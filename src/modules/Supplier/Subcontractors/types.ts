export interface SubcontractorDriver {
    id: number | string;
    subcontractor_id: number | string;
    name: string;
    phone: string;
    email?: string;
    driver_license_number?: string;
    license_file?: string;
    license_file_url?: string;
    license_expiry_date?: string;
    license_status?: 'pending' | 'verified' | 'rejected' | 'expired';
    insurance_file?: string;
    insurance_file_url?: string;
    insurance_expiry_date?: string;
    insurance_status?: 'pending' | 'verified' | 'rejected' | 'expired';
    is_verified?: boolean;
    verified_at?: string;
    rejection_reason?: string;
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
    insurance_certificate_file?: string;
    insurance_certificate_url?: string;
    insurance_expiry_date?: string;
    insurance_status?: 'pending' | 'verified' | 'rejected' | 'expired';
    operating_license_file?: string;
    operating_license_url?: string;
    operating_license_expiry_date?: string;
    operating_license_status?: 'pending' | 'verified' | 'rejected' | 'expired';
    is_verified?: boolean;
    verified_at?: string;
    rejection_reason?: string;
    status: 'active' | 'inactive';
    notes?: string;
    drivers_count?: number;
    drivers?: SubcontractorDriver[];
    created_at?: string;
}

