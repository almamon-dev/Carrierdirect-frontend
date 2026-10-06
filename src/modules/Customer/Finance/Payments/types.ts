export type PaymentFilterTab = "all" | "succeeded" | "processing" | "pay_later" | "refunded";

export interface CustomerPaymentItem {
    id: string | number;
    raw_id?: string | number;
    rawId?: string | number;
    transaction_id?: string;
    invoice_id?: string | number;
    invoice_number?: string;
    order_id?: string | number;
    order_number?: string;
    description?: string;
    amount?: string | number;
    amount_raw?: number;
    total_amount?: number;
    total_amount_formatted?: string;
    gross_amount?: number;
    gross_amount_formatted?: string;
    supplier_amount?: number;
    currency?: string;
    status?: string;
    raw_status?: string;
    status_raw?: string;
    payment_stage?: string;
    payment_stage_label?: string;
    payment_method?: string;
    payment_method_label?: string;
    method?: string;
    payment_type?: string;
    card_brand?: string;
    brand?: string;
    card_last4?: string;
    last4?: string;
    is_pay_later?: boolean;
    customer_email?: string;
    supplier_name?: string;
    supplier?: string | any;
    carrier?: string;
    route?: string;
    from?: string;
    to?: string;
    pickup?: string;
    delivery?: string;
    pickup_name?: string;
    delivery_name?: string;
    pickup_city?: string;
    delivery_city?: string;
    pickup_address?: string;
    delivery_address?: string;
    due_date?: string;
    dueDate?: string;
    issue_date?: string;
    issueDate?: string;
    date?: string;
    paid_at?: string;
    created_at?: string;
    created_at_time?: string;
    created_at_formatted?: string;
    metadata?: any;
}

export interface PaymentStats {
    totalSettledFormatted: string;
    payLaterTotalFormatted: string;
    totalTransactions: number;
    succeededCount: number;
    pendingCount: number;
    payLaterCount: number;
}
