import { formatStandardAddress } from "@/utils/addressFormatter";
import { formatDisplayDate } from '@/lib/utils';
import { resolveQuoteDistance } from '@/utils/geoDistance';
import { CustomerQuoteRequestItem } from '../types';

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

        let finalStatus = 'Pending';
        let canonicalRawStatus = 'pending';
        const rawStatusLower = String(q.raw_status || q.status_raw || q.status || '').toLowerCase();

        const hasCompletedQuote = matchingQuotes.some(item => {
            const s = String(item.status_raw || item.status || '').toLowerCase();
            const ost = String(item.order_status || item.order?.status || '').toLowerCase();
            return s === 'completed' || ost === 'completed';
        });

        const hasNegotiatingQuote = matchingQuotes.some(item => {
            const s = String(item.status_raw || item.status || '').toLowerCase().trim();
            const rev = String(item.revision_status || item.revisionStatus || '').toLowerCase().trim();
            return s.includes('counter') || s.includes('negotiat') || rev === 'pending' || Boolean(item.is_negotiating || item.isNegotiating || item.has_negotiation_messages || item.hasNegotiationMessages);
        });

        const hasNegotiation = Boolean(q.has_negotiation || q.is_negotiating || hasNegotiatingQuote || rawStatusLower.includes('negotiat') || rawStatusLower === 'review');

        const isRequestCompleted = rawStatusLower === 'completed' || hasCompletedQuote || String(q.order_status || '').toLowerCase() === 'completed';

        if (isRequestCompleted) {
            finalStatus = 'Completed';
            canonicalRawStatus = 'completed';
        } else if (rawStatusLower === 'draft') {
            finalStatus = 'Draft';
            canonicalRawStatus = 'draft';
        } else if (hasAcceptedQuote || rawStatusLower === 'accepted' || rawStatusLower === 'awarded' || rawStatusLower === 'won' || rawStatusLower === 'booked') {
            finalStatus = 'Booked';
            canonicalRawStatus = 'booked';
        } else if (rawStatusLower === 'cancelled' || rawStatusLower === 'expired' || rawStatusLower === 'closed' || rawStatusLower === 'rejected') {
            finalStatus = 'Expired';
            canonicalRawStatus = 'expired';
        } else if (hasNegotiation) {
            finalStatus = 'Negotiation';
            canonicalRawStatus = 'negotiation';
        } else if (qCount > 0) {
            finalStatus = 'Quotes Received';
            canonicalRawStatus = 'quotes_received';
        } else {
            finalStatus = 'Pending';
            canonicalRawStatus = 'pending';
        }

        return {
            id: q.request_id || q.formatted_id || (q.id ? (String(q.id).startsWith('REQ-') ? q.id : `REQ-${String(q.id).padStart(4, '0')}`) : 'REQ-0000'),
            rawId: q.id,
            slug: String(q.slug || q.id),
            title: titleStr,
            request_title: titleStr,
            requestTitle: titleStr,
            date: dateStr,
            pickup: formatStandardAddress(q, "pickup"),
            delivery: formatStandardAddress(q, "delivery"),
            distance: distanceStr,
            budget: budgetStr,
            priority: q.priority || 'Normal',
            status: finalStatus,
            rawStatus: canonicalRawStatus,
            badgeColor: q.badge_color || (canonicalRawStatus === "won" ? "emerald" : (canonicalRawStatus === "quotes_received" ? "blue" : (canonicalRawStatus === "negotiation" ? "purple" : (canonicalRawStatus === "expired" ? "rose" : "amber")))),
            hasAcceptedQuote: hasAcceptedQuote,
            isCompleted: isRequestCompleted,
            isNegotiating: hasNegotiation,
            hasNegotiation: hasNegotiation,
            quotesReceived: qCount,
            type: q.shipment_type || 'FTL',
            load: q.load_type || q.type_of_pallets || 'Pallets',
            vehicle: q.vehicle_type || 'Covered Van',
            weight: q.weight ? `${q.weight} KG` : '—',
            rawData: q,
        };
    });
};
