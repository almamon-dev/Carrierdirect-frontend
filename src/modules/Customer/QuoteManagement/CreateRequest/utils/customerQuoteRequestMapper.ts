import { formatDisplayDate } from '@/lib/utils';
import { resolveQuoteDistance } from '@/utils/geoDistance';
import { CustomerQuoteRequestItem } from '../types';

const cleanAddressWithoutZip = (addr: string): string => {
    if (!addr || addr === '—') return addr;
    return addr
        .replace(/\s*\(?ZIP:?\s*\d+\)?/gi, '')
        .replace(/\b(?:ZIP|Postal Code):?\s*\d+\b/gi, '')
        .replace(/\s+\d{4,6}\b(?=[,\s]|$)/g, '')
        .replace(/\s*,\s*,/g, ',')
        .replace(/,\s*$/g, '')
        .trim();
};

export const mapCustomerQuoteRequestItems = (rawItems: any[], allReceivedQuotes: any[]): CustomerQuoteRequestItem[] => {
    return rawItems.map((q: any) => {
        const matchingQuotes = allReceivedQuotes.filter(item => {
            const quoteReqId = item.quote_request_id || item.request_id || item.quote_request?.id;
            return String(quoteReqId) === String(q.id);
        });

        const hasAcceptedQuote = matchingQuotes.some(item => {
            const s = String(item.status_raw || item.status || '').toLowerCase();
            return s === 'accepted' || s === 'completed' || s === 'won';
        });

        const qCount = Number(
            q.quotes_count ??
            q.quotes_received_count ??
            q.bids_count ??
            (Array.isArray(q.quotes_request) && q.quotes_request.length > 0 ? q.quotes_request.length :
                Array.isArray(q.quotes) && q.quotes.length > 0 ? q.quotes.length :
                    matchingQuotes.length)
        );

        const dateStr = formatDisplayDate(q.requested_date || q.request_date || q.pickup_date || q.created_at || q.created_at_formatted || q.date);

        // Standardize Budget: 0, 0.00, null, or empty is 'Negotiable'
        const numBudget = q.budget !== null && q.budget !== undefined && q.budget !== '' 
            ? parseFloat(String(q.budget).replace(/[^0-9.]/g, '')) 
            : 0;

        let budgetStr = 'Negotiable';
        if (!isNaN(numBudget) && numBudget > 0) {
            const rawB = String(q.budget);
            const hasSymbol = rawB.includes('€') || rawB.includes('$') || rawB.includes('৳') || rawB.includes('£');
            const currencySymbol = q.currency === '$' ? '$' : (q.currency === '৳' ? '৳' : (q.currency === '£' ? '£' : '€'));
            budgetStr = hasSymbol ? rawB : `${currencySymbol}${numBudget.toLocaleString()}`;
        }

        const { distanceStr } = resolveQuoteDistance(q);

        const titleStr = (
            q.request_title ||
            q.title ||
            q.requestTitle ||
            (q.pickup_city && q.delivery_city ? `${q.pickup_city} to ${q.delivery_city}` :
                q.pickup_address && q.delivery_address ? `${q.pickup_address.split(',')[0]} to ${q.delivery_address.split(',')[0]}` :
                    'Logistics Request')
        );

        let finalStatus = 'In Progress';
        let canonicalRawStatus = 'in_progress';
        const rawStatusLower = String(q.raw_status || q.status_raw || q.status || '').toLowerCase();

        if (hasAcceptedQuote || rawStatusLower === 'completed' || rawStatusLower === 'accepted' || rawStatusLower === 'awarded' || rawStatusLower === 'won') {
            finalStatus = 'Completed';
            canonicalRawStatus = 'completed';
        } else if (rawStatusLower === 'cancelled' || rawStatusLower === 'expired' || rawStatusLower === 'closed' || rawStatusLower === 'rejected') {
            finalStatus = 'Cancelled';
            canonicalRawStatus = 'cancelled';
        } else if (rawStatusLower === 'pending' || rawStatusLower === 'processing' || rawStatusLower === 'draft') {
            finalStatus = 'Processing';
            canonicalRawStatus = 'pending';
        } else if (rawStatusLower === 'in_progress' || rawStatusLower === 'in progress' || rawStatusLower === 'active' || rawStatusLower === 'bidding') {
            finalStatus = 'In Progress';
            canonicalRawStatus = 'in_progress';
        } else if (q.status) {
            finalStatus = String(q.status);
            canonicalRawStatus = rawStatusLower;
        }

        return {
            id: q.request_id || q.formatted_id || (q.id ? (String(q.id).startsWith('REQ-') ? q.id : `REQ-${String(q.id).padStart(4, '0')}`) : 'REQ-0000'),
            rawId: q.id,
            slug: String(q.slug || q.id),
            title: titleStr,
            request_title: titleStr,
            requestTitle: titleStr,
            date: dateStr,
            pickup: cleanAddressWithoutZip((q.pickup_address || q.pickup_city || '—').trim()),
            delivery: cleanAddressWithoutZip((q.delivery_address || q.delivery_city || '—').trim()),
            distance: distanceStr,
            budget: budgetStr,
            priority: q.priority || 'Normal',
            status: finalStatus,
            rawStatus: canonicalRawStatus,
            badgeColor: q.badge_color || (canonicalRawStatus === "in_progress" ? "blue" : (canonicalRawStatus === "pending" ? "amber" : (canonicalRawStatus === "completed" ? "emerald" : "rose"))),
            hasAcceptedQuote: hasAcceptedQuote,
            quotesReceived: qCount,
            type: q.shipment_type || 'FTL',
            load: q.load_type || q.type_of_pallets || 'Pallets',
            vehicle: q.vehicle_type || 'Covered Van',
            weight: q.weight ? `${q.weight} KG` : '—',
            rawData: q,
        };
    });
};
