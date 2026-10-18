export interface SubscriptionStatusData {
    has_subscription: boolean;
    id?: number;
    status: string;
    is_active: boolean;
    is_trial: boolean;
    started_at?: string;
    expires_at?: string;
    days_remaining?: number;
    plan_name?: string;
    plan_id?: number;
    billing_period?: string;
    price?: number;
    quotes_used?: number;
    quotes_limit?: number | null;
    quotes_remaining?: number | null;
    can_create_quote?: boolean;
    quote_restriction_reason?: string | null;
    quote_restriction_message?: string | null;
    can_use_bulk_import?: boolean;
    can_use_pay_later?: boolean;
    pay_later_restriction_message?: string | null;
    pay_later_required_plan?: string | null;
}

export interface LockModalConfig {
    title: string;
    description: string;
    featureName: string;
    requiredPlan: string;
    benefits: string[];
}

export const DEFAULT_QUOTA_BENEFITS = [
    "Unlimited Single Quote Requests & RFQs",
    "Multi-Carrier Quote Comparison & Price Breakdown",
    "Direct Carrier Live Chat & Negotiation",
    "Real-time Order Tracking & Digital POD (Challan)",
    "Secure Stripe Escrow Payments & Card Checkout"
];

export const PAY_LATER_BENEFITS = [
    'Corporate Pay-Later Credit Line (Net 30/60 Days)',
    'Book Shipments Instantly Without Upfront Card Charge',
    'Automated Monthly Consolidated VAT Invoices',
    'Dedicated Operations Manager & Priority Dispatch',
    'AI Bulk RFQ Import & Document Extraction'
];

export const BULK_IMPORT_BENEFITS = [
    "Bulk CSV & Excel Manifest Batch Uploads",
    "Automated AI PDF & Invoice Document Extraction",
    "Unlimited RFQ Postings & Marketplace Broadcast",
    "Dedicated Account Manager & Priority Support",
    "Net 30/60 Days Corporate Pay-Later Credit Line"
];
