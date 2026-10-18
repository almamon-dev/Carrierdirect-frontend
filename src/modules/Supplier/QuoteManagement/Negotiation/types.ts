/**
 * Supplier Negotiation Management - Types & Interfaces
 * Data contracts for negotiations, price counter offers, and filtering.
 */

export interface NegotiationItem {
    id: string;
    rawId: string | number;
    sessionKey?: string;
    slug: string;
    quoteId: string;
    requestId: string;
    requestTitle: string;
    customer: string;
    customerAvatar?: string;
    customerRating?: number;
    pickup: string;
    delivery: string;
    origin?: string;
    destination?: string;
    distance: string;
    budget: string;
    originalAmount?: number;
    currentOffer?: number;
    currency?: string;
    priority: string;
    status: string;
    statusRaw?: string;
    revisionStatus?: string;
    unreadCount?: number;
    palletType?: string;
    vehicleType?: string;
    pickupDate?: string;
    deliveryDate?: string;
    requestDate: string;
    lastUpdated?: string;
    notes?: string;
    declineReason?: string;
    baseFreight?: number;
    totalExtras?: number;
    extraCharges?: Array<{ id?: string | number; label?: string; customName?: string; custom_name?: string; type?: string; amount: number; description?: string }>;
    documents?: Array<{ name: string; size: string; type?: string; url?: string }>;
    isVerified?: boolean;
    isUnderReview?: boolean;
    isOnline?: boolean;
    lastSeenHuman?: string;
    lastSeenAt?: string;
    raw?: any;
    orderNumber?: string;
    orderId?: string | number;
    orderStatus?: string;
    isPaid?: boolean;
    hasOrder?: boolean;
    isCompleted?: boolean;
    isBooked?: boolean;
    order_status?: string;
    podStatus?: string;
    pod_status?: string;
    invoice?: any;
    order?: any;
    can_accept?: boolean;
    can_counter?: boolean;
    can_decline?: boolean;
    can_withdraw?: boolean;
    is_my_offer?: boolean;
    waiting_for_response?: boolean;
    [key: string]: any;
}

export type NegotiationTab = 'active' | 'history';
export type NegotiationFilterTab = 'all' | 'active' | 'waiting_you' | 'waiting_customer' | 'agreed' | 'closed';
