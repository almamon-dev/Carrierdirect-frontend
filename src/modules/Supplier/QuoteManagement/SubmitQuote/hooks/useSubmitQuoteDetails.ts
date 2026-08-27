/**
 * useSubmitQuoteDetails Hook
 * Fetches quote request details for carrier bid submission, normalizing backend payload.
 */

import { useState, useEffect } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { QuoteRequest } from '../../data/quoteRequestsData';

export function useSubmitQuoteDetails(slug?: string) {
    const [loading, setLoading] = useState(true);
    const [requestDetails, setRequestDetails] = useState<QuoteRequest>({
        id: '', slug: '', requestDate: '', customer: '', pickup: '', delivery: '',
        distance: '', budget: 'Open', status: 'active', priority: 'Normal',
        dimensions: [], cargoItems: [], documents: []
    } as unknown as QuoteRequest);
    const [apiData, setApiData] = useState<Record<string, any>>({});

    useEffect(() => {
        let isMounted = true;
        const cleanId = slug ? slug.replace('REQ-', '') : '';
        if (!cleanId) { 
            setLoading(false); 
            return; 
        }

        apiClient.get(ENDPOINTS.SUPPLIER.REQUEST_DETAIL(cleanId))
            .then(res => {
                const raw = res.data?.data || res.data || res;
                const d = raw.quote_details || {};
                if (!isMounted) return;

                setApiData({ ...d, id: raw.id, quote_submitted: raw.quote_submitted });
                setRequestDetails(prev => ({
                    ...prev,
                    id: `REQ-${raw.id || cleanId}`,
                    slug: String(raw.id || cleanId),
                    customer: d.client_name || 'Verified Shipper',
                    customerPhone: d.client_phone || '',
                    customerOrdersCount: d.client_orders_count ?? 0,
                    requestDate: d.request_created_at || d.requested_date || '',
                    pickup: d.origin || '—',
                    pickupFullAddress: d.origin || '',
                    pickupTimeWindow: d.pickup_time_from && d.pickup_time_till
                        ? `${d.pickup_time_from} – ${d.pickup_time_till}`
                        : '',
                    delivery: d.destination || '—',
                    deliveryFullAddress: d.destination || '',
                    deliveryTimeWindow: d.delivery_time_from && d.delivery_time_till
                        ? `${d.delivery_time_from} – ${d.delivery_time_till}`
                        : '',
                    distance: d.distance_miles ? `${d.distance_miles} km` : '—',
                    pickupDate: d.pickup_date || '',
                    deliveryDate: d.delivery_date || '',
                    weight: d.total_weight || '—',
                    notes: d.additional_notes || '',
                    budget: d.budget ? `€${d.budget}` : 'Open / Flexible',
                    vehicleType: d.vehicle_type || '—',
                    loadType: d.pallet_type || d.load_type || '—',
                    itemsCount: d.items_summary || '—',
                    dimensions: Array.isArray(d.items) ? d.items.map((item: any, i: number) => ({
                        id: item.id ?? i + 1,
                        length: item.length != null ? String(item.length) : '—',
                        width:  item.width  != null ? String(item.width)  : '—',
                        height: item.height != null ? String(item.height) : '—',
                        qty:    String(item.quantity ?? '—'),
                        unit:   'CM',
                    })) : [],
                    cargoItems: Array.isArray(d.items) ? d.items.map((item: any, i: number) => ({
                        id: item.id ?? i + 1,
                        name: item.item_type || 'Item',
                        category: item.item_type || '—',
                        qty: String(item.quantity ?? '—'),
                        weight: item.weight != null ? `${item.weight} kg` : '—',
                        dimensions: (item.length && item.width && item.height)
                            ? `${item.length} × ${item.width} × ${item.height} cm`
                            : '—',
                    })) : [],
                    documents: [
                        ...(d.attachment_url   ? [{ id: 1, name: 'Attachment',   size: '', type: 'PDF', url: d.attachment_url  }] : []),
                        ...(d.packing_list_url ? [{ id: 2, name: 'Packing List', size: '', type: 'PDF', url: d.packing_list_url }] : []),
                        ...(d.invoice_url      ? [{ id: 3, name: 'Invoice',      size: '', type: 'PDF', url: d.invoice_url      }] : []),
                    ],
                    stackable: !!d.stackable,
                    fragile: !!d.fragile,
                    hazardous: !!d.hazardous,
                    tempControlled: !!d.temp_controlled,
                    oversized: !!d.oversized,
                    perishable: !!d.perishable,
                    loadingRequired: !!d.loading_required,
                    unloadingRequired: !!d.unloading_required,
                    packaging: !!d.packaging,
                    insurance: !!d.insurance,
                    liftGate: !!d.lift_gate,
                    whiteGlove: !!d.white_glove,
                    assembly: !!d.assembly,
                    insideDelivery: !!d.inside_delivery,
                    storage: !!d.storage,
                    pickupInstructions: d.pickup_instructions || '',
                    deliveryInstructions: d.delivery_instructions || '',
                }));
            })
            .catch(err => {
                console.error('Failed to load supplier request detail', err);
            })
            .finally(() => { 
                if (isMounted) setLoading(false); 
            });

        return () => { isMounted = false; };
    }, [slug]);

    return {
        loading,
        requestDetails,
        apiData,
    };
}
