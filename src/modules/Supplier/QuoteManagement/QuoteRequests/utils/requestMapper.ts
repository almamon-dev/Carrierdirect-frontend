import { QuoteRequest } from '../../data/quoteRequestsData';
import { resolveSupplierQuoteStatus } from '../../utils/requestStatusTracker';
import { formatDisplayDate } from '@/lib/utils';
import { resolveAddress } from './addressHelpers';

export function mapRawQuoteRequest(q: any): QuoteRequest {
    return {
        id: q.request_id || q.formatted_id || (q.id ? (String(q.id).startsWith('REQ-') ? q.id : `REQ-${String(q.id).padStart(4, '0')}`) : 'REQ-0000'),
        rawId: q.rawId || q.id,
        slug: String(q.slug || q.id),
        requestDate: q.requestDate || formatDisplayDate(q.requested_date || q.pickup_date || q.created_at),
        pickupDate: q.pickupDate || (q.pickup_date ? String(q.pickup_date).replace('Pickup: ', '') : undefined),
        pickupDateRaw: q.pickupDateRaw || q.pickup_date_raw,
        deliveryDate: q.deliveryDate || (q.delivery_date ? String(q.delivery_date).replace('Delivery: ', '') : undefined),
        deliveryDateRaw: q.deliveryDateRaw || q.delivery_date_raw,
        customer: q.customer?.name || q.customer || q.client_name || q.user?.name || 'Verified Shipper',
        customerAvatar: q.customerAvatar || q.customer?.profile_picture || q.user?.avatar || '',
        customerRating: q.customerRating ?? q.customer?.rating ?? q.user?.rating ?? 4.8,
        pickup: q.pickup || resolveAddress(q, 'pickup'),
        delivery: q.delivery || resolveAddress(q, 'delivery'),
        distance: q.distance || (q.est_distance ? `${q.est_distance} km` : '—'),
        budget: q.budget ? (String(q.budget).includes('€') ? String(q.budget) : `€${String(q.budget).replace(/[^0-9.,]/g, '')}`) : 'Negotiable',
        priority: q.priority || 'Normal',
        status: resolveSupplierQuoteStatus({
            ...q,
            status_raw: q.status,
            status: q.supplier_status || q.status,
            has_quoted: Boolean(q.has_quoted || q.quote_submitted || (q.supplier_status && q.supplier_status.toLowerCase() === 'quoted')),
        }),
        quotesCount: Number(q.quotes_count ?? q.quotesCount ?? q.quotes_received ?? 0),
        quotesReceived: Number(q.quotes_count ?? q.quotesCount ?? q.quotes_received ?? 0),
        isQuoted: Boolean(q.has_quoted || q.quote_submitted || (q.supplier_status && q.supplier_status.toLowerCase() === 'quoted')),
        hasQuoted: Boolean(q.has_quoted || q.quote_submitted || (q.supplier_status && q.supplier_status.toLowerCase() === 'quoted')),
        supplierStatus: q.supplier_status,
        vehicleType: q.vehicleType || q.vehicle_type || 'Covered Van',
        loadType: q.loadType || q.load_type || 'Pallets',
        weight: q.weight ? (String(q.weight).includes('kg') ? q.weight : `${q.weight} kg`) : '—',
        volume: q.volume ? (String(q.volume).includes('m³') ? q.volume : `${q.volume} m³`) : '—',
        notes: q.notes || q.customer_notes || '',
        isToday: q.isToday ?? q.is_today,
        isUpcoming: q.isUpcoming ?? q.is_upcoming,
        isUrgent: q.isUrgent ?? q.is_urgent,
    };
}
