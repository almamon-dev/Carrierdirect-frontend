/**
 * Customer Negotiation Management - Types & Interfaces
 * Data contracts for customer negotiations, price counter offers, and filtering.
 */

export interface CustomerNegotiationItem {
    id: string;
    rawId: string | number;
    sessionKey?: string;
    slug: string;
    quoteId: string;
    requestId: string;
    requestTitle: string;
    customer: string;
    supplier: string;
    customerAvatar?: string;
    supplierAvatar?: string;
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
}

export type NegotiationTab = 'active' | 'history';
