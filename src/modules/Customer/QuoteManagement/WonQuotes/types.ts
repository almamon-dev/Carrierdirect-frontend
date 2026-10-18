export type WonFilterTab =
    | 'Booked'
    | 'Completed'
    | 'Declined'
    | 'Expired';

export interface CustomerWonQuoteItem {
    id: string | number;
    rawId?: string | number;
    quoteId?: string;
    requestId?: string;
    quote_id?: string | number;
    request_id?: string | number;
    title?: string;
    request_title?: string;
    supplier_name?: string;
    carrier_name?: string;
    amount?: string | number;
    numericAmount?: number;
    deliveryStatus?: string;
    historyStatus?: 'Booked' | 'Completed' | 'Declined' | 'Expired';
    status?: string;
    status_raw?: string;
    order_id?: string | number;
    order_number?: string;
    order_status?: string;
    created_at?: string;
    date?: string;
    pickup?: string;
    delivery?: string;
    route?: string;
    vehicle?: string;
    vehicleType?: string;
    is_paid?: boolean;
    has_order?: boolean;
    [key: string]: any;
}
