import { CustomerQuoteRequestItem } from '../types';
import { formatDisplayDate } from '@/lib/utils';

export const mapCustomerQuoteRequestItems = (rawItems: any[], allReceivedQuotes: any[]): CustomerQuoteRequestItem[] => {
    return rawItems.map((q: any) => {
        const matchedFromAllQuotes = allReceivedQuotes.filter(item => {
            const quoteReqId = item.quote_request_id || item.request_id || item.quote_request?.id;
            return String(quoteReqId) === String(q.id);
        }).length;

        const qCount = Number(
            q.quotes_count ??
            q.quotes_received_count ??
            q.bids_count ??
            (Array.isArray(q.quotes_request) && q.quotes_request.length > 0 ? q.quotes_request.length :
             Array.isArray(q.quotes) && q.quotes.length > 0 ? q.quotes.length :
             matchedFromAllQuotes)
        );

        const dateStr = formatDisplayDate(q.requested_date || q.request_date || q.pickup_date || q.created_at || q.created_at_formatted || q.date);

        const budgetStr = q.budget 
            ? (String(q.budget).includes('€') || String(q.budget).includes('$') || String(q.budget).includes('৳') ? String(q.budget) : `€${q.budget}`)
            : 'Negotiable';

        const distanceStr = q.est_distance || q.distance_miles 
            ? `${q.est_distance || q.distance_miles} km` 
            : '245 km';

        const titleStr = (
            q.request_title ||
            q.title ||
            q.requestTitle ||
            (q.pickup_city && q.delivery_city ? `${q.pickup_city} to ${q.delivery_city}` :
             q.pickup_address && q.delivery_address ? `${q.pickup_address.split(',')[0]} to ${q.delivery_address.split(',')[0]}` :
             'Logistics Request')
        );

        return {
            id: q.request_id || q.formatted_id || (q.id ? (String(q.id).startsWith('REQ-') ? q.id : `REQ-${String(q.id).padStart(4, '0')}`) : 'REQ-0000'),
            rawId: q.id,
            slug: String(q.slug || q.id),
            title: titleStr,
            request_title: titleStr,
            requestTitle: titleStr,
            date: dateStr,
            pickup: (q.pickup_address || q.pickup_city || '—').trim(),
            delivery: (q.delivery_address || q.delivery_city || '—').trim(),
            distance: distanceStr,
            budget: budgetStr,
            priority: q.priority || 'Normal',
            status: q.status === 'active' ? 'Active' : (q.status === 'pending' ? 'Draft' : (q.status || 'Active')),
            quotesReceived: qCount,
            type: q.shipment_type || 'FTL',
            load: q.load_type || q.type_of_pallets || 'Pallets',
            vehicle: q.vehicle_type || 'Covered Van',
            weight: q.weight ? `${q.weight} KG` : '—',
            rawData: q,
        };
    });
};
