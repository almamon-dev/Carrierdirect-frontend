export * from './formTypes';

export type FilterTabId = 'All' | 'Waiting' | 'Review' | 'Accepted' | 'Active' | 'Pending' | 'Completed' | 'Draft' | 'Expired';

export interface CustomerQuoteRequestItem {
    id: string | number;
    rawId?: string | number;
    title?: string;
    request_title?: string;
    requestTitle?: string;
    route?: string;
    pickup_address?: string;
    delivery_address?: string;
    pickup_city?: string;
    delivery_city?: string;
    pickup?: any;
    delivery?: any;
    vehicle_type?: string;
    vehicle?: string;
    load_type?: string;
    load?: string;
    weight?: string | number;
    volume?: string | number;
    budget?: string | number;
    lowestBid?: string | number;
    amount?: string | number;
    currency?: string;
    status: string;
    bids_count?: number;
    bidsCount?: number;
    created_at?: string;
    createdAt?: string;
    pickup_date?: string;
    pickupDate?: string;
    delivery_date?: string;
    deliveryDate?: string;
    [key: string]: any;
}
