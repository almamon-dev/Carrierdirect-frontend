export type SubcontractorStatus = 'planned' | 'invoice_submitted' | 'accrued' | 'rejected' | 'paid';

export interface SubcontractorCompany {
    id: string;
    name: string;
    registration_number?: string;
    contact_person?: string;
    phone?: string;
    email?: string;
    is_active?: boolean;
}

export interface SubcontractorCostItem {
    id: string;
    order_id: string;
    subcontractor_id?: string;
    subcontractor_name: string;
    journey_leg: string;
    agreed_cost: number;
    currency: string;
    status: SubcontractorStatus;
    notes?: string;
    invoice_number?: string;
    invoice_date?: string;
    invoice_amount?: number;
    invoice_file_url?: string;
    invoice_file_name?: string;
    invoice_file_size?: string;
    created_at?: string;
}

export interface OrderFinancialSummary {
    customer_revenue: number;
    subcontractor_costs_accrued: number;
    ferry_and_other_costs: number;
    platform_fee: number;
    estimated_net_profit: number;
    currency: string;
}

