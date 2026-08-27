/**
 * Customer Quote Request Data Types
 * Defines data structures for quote requests displayed on the customer dashboard.
 */

export interface CustomerQuoteRequestItem {
    id: string;
    rawId: string | number;
    slug: string;
    date: string;
    pickup: string;
    delivery: string;
    distance: string;
    budget: string;
    priority: 'Normal' | 'High' | 'Urgent' | string;
    status: 'Active' | 'Draft' | 'Negotiating' | 'Accepted' | 'completed' | string;
    quotesReceived: number;
    type?: string;
    load?: string;
    vehicle?: string;
    weight?: string;
    rawData?: any;
}

export type FilterTabId = 'All' | 'Active' | 'Waiting' | 'Review' | 'Accepted';
