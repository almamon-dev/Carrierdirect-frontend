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
    baseFreight?: number;
    extraCharges?: Array<{ label: string; amount: number; description?: string }>;
    documents?: Array<{ name: string; size: string; type?: string; url?: string }>;
}

export type NegotiationTab = 'active' | 'history';
