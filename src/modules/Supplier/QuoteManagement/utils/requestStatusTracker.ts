/**
 * Supplier Quote Requests Status Tracker Utility
 * Tracks local supplier interaction states: New, Viewed, Quoted, Booked, Expired
 * Syncs seamlessly across components via LocalStorage & CustomEvents.
 */

const STORAGE_VIEWED_KEY = 'carrierdirect_supplier_viewed_requests';
const STORAGE_QUOTED_KEY = 'carrierdirect_supplier_quoted_requests';
export const STATUS_CHANGE_EVENT = 'carrierdirect_supplier_status_changed';

export interface QuotedOfferRecord {
    id: string;
    totalOffer: string;
    quotedAt: string;
    meta?: any;
}

/**
 * Get the set of request IDs that the supplier has opened/viewed
 */
export function getViewedRequestIds(): Set<string> {
    try {
        const raw = localStorage.getItem(STORAGE_VIEWED_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return new Set(parsed.map(String));
            }
        }
    } catch {}
    return new Set();
}

/**
 * Get map of quotes submitted by the supplier: { [reqId]: QuotedOfferRecord }
 */
export function getQuotedRequestsMap(): Record<string, QuotedOfferRecord> {
    try {
        const raw = localStorage.getItem(STORAGE_QUOTED_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed;
            }
        }
    } catch {}
    return {};
}

/**
 * Mark a request ID as viewed by the supplier
 */
export function markRequestAsViewed(rawOrPrefixedId: string | number): void {
    if (!rawOrPrefixedId) return;
    const cleanId = String(rawOrPrefixedId).replace('REQ-', '').trim();
    if (!cleanId) return;

    try {
        const viewedSet = getViewedRequestIds();
        if (!viewedSet.has(cleanId)) {
            viewedSet.add(cleanId);
            localStorage.setItem(STORAGE_VIEWED_KEY, JSON.stringify(Array.from(viewedSet)));
            window.dispatchEvent(new CustomEvent(STATUS_CHANGE_EVENT, { detail: { id: cleanId, status: 'Viewed' } }));
        }
    } catch (e) {
        console.error('Failed to mark request as viewed', e);
    }
}

/**
 * Mark a request ID as quoted by the supplier with submission offer metadata
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
        // Also mark as viewed
        const viewedSet = getViewedRequestIds();
        viewedSet.add(cleanId);
        localStorage.setItem(STORAGE_VIEWED_KEY, JSON.stringify(Array.from(viewedSet)));

        // Store quoted record
        const quotedMap = getQuotedRequestsMap();
        quotedMap[cleanId] = {
            id: cleanId,
            totalOffer,
            quotedAt: new Date().toISOString(),
            meta,
        };
        localStorage.setItem(STORAGE_QUOTED_KEY, JSON.stringify(quotedMap));

        // Dispatch update event
        window.dispatchEvent(
            new CustomEvent(STATUS_CHANGE_EVENT, {
                detail: { id: cleanId, status: 'Quoted', totalOffer, meta }
            })
        );
    } catch (e) {
        console.error('Failed to mark request as quoted', e);
    }
}

/**
 * Resolve the dynamic status for a supplier quote request:
 * Priority: Booked/Won > Expired > Quoted > Viewed > New
 */
export function resolveSupplierQuoteStatus(rawItem: {
    id?: string | number;
    rawId?: string | number;
    slug?: string | number;
    status?: string;
    status_raw?: string;
    quote_submitted?: boolean;
    has_quoted?: boolean;
    is_quoted?: boolean;
    is_booked?: boolean;
    is_won?: boolean;
    is_expired?: boolean;
}): string {
    const rawStatus = (rawItem.status_raw || rawItem.status || '').toLowerCase().trim();
    const cleanId = String(rawItem.rawId || rawItem.id || rawItem.slug || '').replace('REQ-', '').trim();

    // 1. Check if Booked / Won
    if (
        rawStatus === 'booked' || 
        rawStatus === 'won' || 
        rawStatus === 'accepted' || 
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
        rawItem.is_expired
    ) {
        return 'Expired';
    }

    // 3. Check if Quoted (either from API response or local storage)
    const quotedMap = getQuotedRequestsMap();
    if (
        rawItem.quote_submitted || 
        rawItem.has_quoted || 
        rawItem.is_quoted || 
        rawStatus === 'quoted' ||
        rawStatus === 'offer submitted' ||
        rawStatus === 'quote submitted' ||
        (cleanId && Boolean(quotedMap[cleanId]))
    ) {
        return 'Quoted';
    }

    // 4. Check if Viewed
    const viewedSet = getViewedRequestIds();
    if (rawStatus === 'viewed' || (cleanId && viewedSet.has(cleanId))) {
        return 'Viewed';
    }

    // 5. Default to New
    if (!rawStatus || rawStatus === 'active' || rawStatus === 'open' || rawStatus === 'new') {
        return 'New';
    }

    // If there is any other specific server status, capitalize it cleanly
    return rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
}
