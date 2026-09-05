export interface ExtraCharge {
    id?: number;
    type: string;
    custom_name: string | null;
    amount: number;
}

export interface QuoteSupplier {
    id?: number;
    name?: string;
    company_name?: string;
    phone?: string;
    email?: string;
    profile_picture?: string | null;
    is_verified?: boolean;
    rating?: number | string;
    contact_name?: string;
    address?: string;
    city?: string;
    country?: string;
    [key: string]: any;
}

export interface QuoteData {
    id: number;
    quote_id?: string;
    quote_request_id?: number;
    amount: string;
    amount_raw?: number;
    base_amount: string | null;
    currency?: string;
    extra_charges: ExtraCharge[];
    supplier_name: string;
    supplier?: QuoteSupplier;
    rating: number;
    reviews_count?: number;
    completed_orders: string;
    notes: string;
    estimated_delivery: string;
    pickup_date: string;
    delivery_date: string;
    revision_status: string;
    status?: string;
    status_raw?: string;
    quote_request?: any;
    validity?: string;
    estimated_time?: string;
    payment_terms?: string;
    [key: string]: any;
}
