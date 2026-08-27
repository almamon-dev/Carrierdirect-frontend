export interface DashboardProfile {
    id?: number | string;
    name?: string;
    company_name?: string;
    email?: string;
    phone_number?: string;
    country?: string;
    city?: string;
    zip_code?: string;
    business_address?: string;
    rating?: string | number;
    average_rating?: string | number;
    total_earnings?: number | string;
}

export interface QuoteItem {
    id: string;
    slug: string | number;
    customer: string;
    status: string;
    budget: string;
    date?: string;
}

export interface OrderItem {
    id: string;
    slug: string | number;
    customer: string;
    status: string;
    route: string;
}

export interface NotificationItem {
    id: string | number;
    text: string;
    time: string;
    raw?: any;
}

export interface FinanceSummary {
    total_earnings?: number | string;
    withdrawable_balance?: number | string;
    available_balance?: number | string;
    pending_payouts?: number | string;
}

export type TimeFilter = '30_days' | '3_months' | 'this_year';
