export type PayLaterFilterTab = "all" | "paid" | "due" | "overdue";

export interface CustomerPayLaterItem {
    id: string | number;
    raw_id?: string | number;
    rawId?: string | number;
    invoice_number?: string;
    order_id?: string | number;
    order_number?: string;
    orderId?: string;
    quote_id?: string | number;
    quote_request_id?: string | number;
    description?: string;
    amount?: string | number;
    amount_raw?: number;
    total_amount?: number;
    total_amount_formatted?: string;
    gross_amount?: number;
    gross_amount_formatted?: string;
    supplier_amount?: number;
    subtotal?: number;
    subtotal_formatted?: string;
    base_amount?: number;
    base_amount_formatted?: string;
    platform_fee?: number;
    platform_fee_formatted?: string;
    platform_charge?: number;
    platform_charge_formatted?: string;
    platform_charge_percent?: number;
    platform_fee_percent?: number;

    currency?: string;
    status?: string;
    raw_status?: string;
    status_raw?: string;
    payment_stage?: string;
    payment_stage_label?: string;
    payment_method?: string;
    payment_method_label?: string;
    method?: string;
    card_brand?: string;
    brand?: string;
    card_last4?: string;
    last4?: string;
    payment_terms?: string;
    terms?: string;
    is_pay_later?: boolean;
    supplier_name?: string;
    supplier?: string | any;
    carrier?: string;
    customer_email?: string;
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
    paid_at?: string;
    date?: string;
    invoice_date?: string;
    invoice_type?: string;
    created_at?: string;
    created_at_time?: string;
    created_at_formatted?: string;
    is_rated?: boolean;
}

export interface PayLaterStats {
    totalCreditLimit: number;
    monthlyLimit: number;
    weeklyLimit: number;
    dailyLimit: number;
    availableCredit: number;
    outstandingBalance: number;
    totalSpentFormatted: string;
    totalOutstandingFormatted: string;
    totalInvoices: number;
    paidCount: number;
    dueCount: number;
    unpaidCount?: number;
    overdueCount: number;
    payLaterDays: number;
    creditLimitFormatted?: string;
    availableCreditFormatted?: string;
    usedCreditFormatted?: string;
    overdueAmountFormatted?: string;
    hasOverdueBlock?: boolean;
}

export interface BankTransferInstructions {
    invoice_id: number;
    invoice_number: string;
    amount_cents: number;
    amount_formatted: string;
    currency: string;
    due_at?: string | null;
    reference: string;
    instructions: Record<string, any> | string;
}

export interface StructuredPayLaterInvoice {
    id: number;
    invoice_id?: number | null;
    invoice_number: string;
    order_id: number;
    order_number?: string | null;
    status: 'open' | 'disputed' | 'paid' | 'void' | string;
    is_overdue: boolean;
    in_collections: boolean;
    collections_status?: string | null;
    currency: string;
    subtotal_cents: number;
    platform_fee_cents: number;
    discount_cents: number;
    cancellation_fee_cents: number;
    credit_adjustment_cents: number;
    total_amount_cents: number;
    total_amount: number;
    total_amount_formatted: string;
    payment_channel?: string | null;
    bank_transfer_reference?: string | null;
    bank_transfer_instructions?: Record<string, any> | string | null;
    requires_sca_action: boolean;
    sca_client_secret?: string | null;
    pending_payment_intent_id?: string | null;
    pod_submitted_at?: string | null;
    issued_at?: string | null;
    due_at?: string | null;
    due_date_formatted?: string | null;
    days_until_due?: number | null;
    disputed_at?: string | null;
    paid_at?: string | null;
    voided_at?: string | null;
    void_reason?: string | null;
    retry_stage: number;
    next_retry_at?: string | null;
    supplier_name?: string | null;
    pickup_address?: string | null;
    delivery_address?: string | null;
}

export interface StructuredPayLaterStats {
    open_count: number;
    overdue_count: number;
    disputed_count: number;
    open_total_cents: number;
    credit_limit_cents: number;
    used_credit_cents: number;
    available_credit_cents: number;
    has_overdue_block: boolean;
}
