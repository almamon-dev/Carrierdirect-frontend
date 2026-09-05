/**
 * Supplier Quote Requests Status Resolver Utility
 * Resolves live quote request statuses directly from the backend API response without localStorage caching.
 */

export const STATUS_CHANGE_EVENT = 'carrierdirect_supplier_status_changed';

export interface QuotedOfferRecord {
    id: string;
    totalOffer: string;
    quotedAt: string;
    meta?: any;
}

/**
 * Mark a request ID as viewed in the current session
 */
export function markRequestAsViewed(rawOrPrefixedId: string | number): void {
    if (!rawOrPrefixedId) return;
    const cleanId = String(rawOrPrefixedId).replace('REQ-', '').trim();
    if (!cleanId) return;

    try {
        window.dispatchEvent(new CustomEvent(STATUS_CHANGE_EVENT, { detail: { id: cleanId, status: 'Viewed' } }));
    } catch {}
}

/**
 * Mark a request ID as quoted in the current session
 */
export function markRequestAsQuoted(
    rawOrPrefixedId: string | number,
    totalOffer: string,
    meta?: any
): void {
    if (!rawOrPrefixedId) return;
    const cleanId = String(rawOrPrefixedId).replace('REQ-', '').trim();
    if (!cleanId) return;

    try {
        window.dispatchEvent(
            new CustomEvent(STATUS_CHANGE_EVENT, {
                detail: { id: cleanId, status: 'Quoted', totalOffer, meta }
            })
        );
    } catch {}
}

/**
 * Resolve the dynamic status for a supplier quote request strictly from the API response:
 * Priority: Booked/Won > Expired > Quoted > Viewed > New
 */
export function resolveSupplierQuoteStatus(rawItem: {
    id?: string | number;
    rawId?: string | number;
    slug?: string | number;
    status?: string;
    status_raw?: string;
    supplier_status?: string;
    quote_submitted?: boolean;
    has_quoted?: boolean;
    is_quoted?: boolean;
    is_booked?: boolean;
    is_won?: boolean;
    is_expired?: boolean;
}): string {
    const rawStatus = (rawItem.status_raw || rawItem.status || '').toLowerCase().trim();
    const supplierStatus = (rawItem.supplier_status || '').toLowerCase().trim();

    // 1. Check if Booked / Won
    if (
        rawStatus === 'booked' || 
        rawStatus === 'won' || 
        rawStatus === 'accepted' || 
        supplierStatus === 'booked' ||
        supplierStatus === 'won' ||
        rawItem.is_booked || 
        rawItem.is_won
    ) {
        return 'Booked';
    }

    // 2. Check if Expired / Closed / Cancelled
    if (
        rawStatus === 'expired' || 
        rawStatus === 'closed' || 
        rawStatus === 'cancelled' || 
        rawStatus === 'lost' || 
        supplierStatus === 'expired' ||
        rawItem.is_expired
    ) {
        return 'Expired';
    }

    // 3. Check if Quoted / Done / Submitted from API response
    if (
        rawItem.quote_submitted || 
        rawItem.has_quoted || 
        rawItem.is_quoted || 
        supplierStatus === 'quoted' ||
        supplierStatus === 'done' ||
        supplierStatus === 'submitted' ||
        rawStatus === 'quoted' ||
        rawStatus === 'done' ||
        rawStatus === 'offer submitted' ||
        rawStatus === 'quote submitted'
    ) {
        return 'Quoted';
    }

    // 4. Check if Viewed from API response
    if (supplierStatus === 'viewed' || rawStatus === 'viewed') {
        return 'Viewed';
    }

    // 5. Default to New
    if (!rawStatus || rawStatus === 'active' || rawStatus === 'open' || rawStatus === 'new') {
        return 'New';
    }

    // Capitalize server status cleanly
    return rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
}
