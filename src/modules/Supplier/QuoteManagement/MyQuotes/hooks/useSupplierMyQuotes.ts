import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { formatDisplayDate } from '@/lib/utils';
import { resolveAddress } from '../../QuoteRequests/utils/addressHelpers';
import { resolveQuoteDistance } from '@/utils/geoDistance';

export interface MyQuoteItem {
    id: string;
    rawId: number | string;
    quoteId: string;
    quoteRawId: number | string;
    slug: string;
    customer: string;
    customerAvatar?: string;
    pickup: string;
    delivery: string;
    distance: string;
    budget?: string;
    amount?: number | string;
    revisedAmount?: number | string;
    revisionStatus?: string;
    my_quote?: {
        id?: number;
        amount?: number | string;
        status?: string;
    };
    myQuote?: {
        id?: number;
        amount?: number | string;
        status?: string;
    };
    status: string;
    supplierStatus: string;
    requestDate: string;
    lastUpdated?: string;
    created_at?: string;
    hasQuoted: boolean;
    vehicleType?: string;
    priority: string;
    order?: any;
    orderId?: string | number;
    orderStatus?: string;
    hasOrder?: boolean;
    hasNegotiation?: boolean;
    isExpired?: boolean;
}

export function useSupplierMyQuotes() {
    const [quotes, setQuotes] = useState<MyQuoteItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchMyQuotes = useCallback(async (isManual = false) => {
        if (isManual) setIsRefreshing(true);
        else setIsLoading(true);

        try {
            const res = await apiClient.get(ENDPOINTS.SUPPLIER.QUOTES || '/supplier/quotes');
            const rawList = 
                (Array.isArray(res.data?.data?.quotes?.data) && res.data.data.quotes.data) ||
                (Array.isArray(res.data?.data?.quotes) && res.data.data.quotes) ||
                (Array.isArray(res.data?.quotes?.data) && res.data.quotes.data) ||
                (Array.isArray(res.data?.quotes) && res.data.quotes) ||
                (Array.isArray(res.data?.data) && res.data.data) ||
                (Array.isArray(res.data) && res.data) ||
                [];

            const mapped: MyQuoteItem[] = rawList.map((q: any) => {
                const reqObj = q.quote_request || {};
                const reqId = q.quote_request_id || reqObj.id || q.id;
                const reqFormattedId = reqObj.request_id || reqObj.formatted_id || (reqId ? (String(reqId).startsWith('REQ-') ? reqId : `REQ-${String(reqId).padStart(4, '0')}`) : 'REQ-0000');
                const quoteFormattedId = q.quote_id || (q.id ? `QT-${String(q.id).padStart(4, '0')}` : 'QT-0000');

                const pickupFormatted = resolveAddress(reqObj.pickup_address ? reqObj : q, 'pickup');
                const deliveryFormatted = resolveAddress(reqObj.delivery_address ? reqObj : q, 'delivery');

                const ost = String(q.order_status || q.order?.status || '').toLowerCase().trim();
                const statusRaw = String(q.status || q.supplier_status || 'submitted').toLowerCase().trim();

                const expiryField = q.valid_until || q.expires_at || reqObj.expires_at;
                const isDateExpired = expiryField ? (!isNaN(new Date(expiryField).getTime()) && new Date(expiryField).getTime() < Date.now()) : false;
                const isOrderActive = ost && ['booked', 'confirmed', 'in_progress', 'completed', 'delivered', 'pod_accepted'].includes(ost) && !['cancelled', 'rejected'].includes(ost);

                let canonicalStatus = 'submitted';
                if (ost === 'completed' || statusRaw === 'completed') {
                    canonicalStatus = 'completed';
                } else if (statusRaw === 'booked' || (statusRaw === 'accepted' && (q.is_paid || isOrderActive))) {
                    canonicalStatus = 'booked';
                } else if (statusRaw === 'accepted' || statusRaw === 'won') {
                    canonicalStatus = 'accepted';
                } else if (statusRaw === 'rejected' || statusRaw === 'lost' || statusRaw === 'declined' || statusRaw === 'cancelled') {
                    canonicalStatus = 'rejected';
                } else if (statusRaw === 'expired' || isDateExpired) {
                    canonicalStatus = 'expired';
                } else if (statusRaw === 'negotiation' || statusRaw === 'negotiating' || q.revision_status === 'pending') {
                    canonicalStatus = 'negotiation';
                } else {
                    canonicalStatus = 'submitted';
                }

                const hasNegotiation = Boolean(statusRaw === 'negotiation' || statusRaw === 'negotiating' || q.revision_status === 'pending' || q.chat_id);
                const hasOrder = Boolean(q.order || q.order_id);

                return {
                    id: reqFormattedId,
                    rawId: reqId,
                    quoteId: quoteFormattedId,
                    quoteRawId: q.id,
                    slug: String(reqObj.slug || reqId),
                    customer: reqObj.customer?.company_name || reqObj.customer?.name || reqObj.client_name || 'Verified Customer',
                    customerAvatar: reqObj.customer?.profile_picture || null,
                    pickup: pickupFormatted || '-',
                    delivery: deliveryFormatted || 'Delivery Location',
                    distance: resolveQuoteDistance(reqObj || q).distanceStr || '—',
                    budget: q.amount ? `€${Number(q.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR` : 'Negotiable',
                    amount: q.amount,
                    revisedAmount: q.revised_amount,
                    revisionStatus: q.revision_status,
                    my_quote: {
                        id: q.id,
                        amount: q.amount,
                        status: q.status
                    },
                    myQuote: {
                        id: q.id,
                        amount: q.amount,
                        status: q.status
                    },
                    status: canonicalStatus,
                    supplierStatus: canonicalStatus,
                    requestDate: formatDisplayDate(q.created_at || reqObj.created_at),
                    lastUpdated: formatDisplayDate(q.updated_at || q.created_at || reqObj.created_at),
                    created_at: q.created_at,
                    hasQuoted: true,
                    vehicleType: reqObj.vehicle_type || 'Covered Van',
                    priority: reqObj.priority || 'Normal',
                    order: q.order || null,
                    orderId: q.order?.id || q.order_id,
                    orderStatus: q.order?.status || null,
                    hasOrder,
                    hasNegotiation,
                    isExpired: isDateExpired || statusRaw === 'expired',
                };
            });

            setQuotes(mapped);
        } catch (error) {
            console.error('Failed to fetch supplier my quotes:', error);
            setQuotes([]);
        } finally {
            setIsLoading(false);
            if (isManual) {
                setTimeout(() => setIsRefreshing(false), 300);
            }
        }
    }, []);

    useEffect(() => {
        fetchMyQuotes();
    }, [fetchMyQuotes]);

    return {
        quotes,
        isLoading,
        isRefreshing,
        fetchMyQuotes
    };
}
