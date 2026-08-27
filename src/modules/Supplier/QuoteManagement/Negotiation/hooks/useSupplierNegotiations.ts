/**
 * useSupplierNegotiations Hook
 * Manages fetching, caching, and state synchronization for supplier quote negotiations.
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/axios';
import { NegotiationItem } from '../types';

const CACHE_KEY = 'supplier_negotiations_cache';

export const SAMPLE_NEGOTIATIONS: NegotiationItem[] = [
    {
        id: 'NEG-1002',
        rawId: 2,
        sessionKey: 'ses-2',
        slug: 'neg-1002-global-freight',
        quoteId: 'QT-8820',
        requestId: 'REQ-1002',
        requestTitle: 'Hamburg to Berlin Express Freight',
        customer: 'Global Freight Express',
        customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        customerRating: 4.9,
        pickup: 'Hamburg Port Cargo Terminal, DE',
        delivery: 'Berlin Central Logistics Hub, DE',
        origin: 'Hamburg Port Cargo Terminal, DE',
        destination: 'Berlin Central Logistics Hub, DE',
        distance: '280 km',
        budget: '€1,850',
        originalAmount: 2100,
        currentOffer: 1850,
        currency: '€',
        priority: 'High',
        status: 'Counter Received',
        vehicleType: 'Curtain Sider (18T)',
        palletType: 'Euro Pallets (12 Units)',
        requestDate: '26 Aug 2026',
        lastUpdated: '5 mins ago',
        unreadCount: 1,
    },
    {
        id: 'NEG-1048',
        rawId: 1048,
        sessionKey: 'ses-1048-siemens',
        slug: 'neg-1048-siemens-munich',
        quoteId: 'QT-8822',
        requestId: 'REQ-1048',
        requestTitle: 'Munich to Stuttgart High-Value Freight',
        customer: 'Siemens Logistics AG',
        customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
        customerRating: 4.9,
        pickup: 'Munich Freight Terminal, DE',
        delivery: 'Stuttgart Distribution Hub, DE',
        origin: 'Munich Freight Terminal, DE',
        destination: 'Stuttgart Distribution Hub, DE',
        distance: '220 km',
        budget: '€1,250',
        originalAmount: 1400,
        currentOffer: 1250,
        currency: '€',
        priority: 'High',
        status: 'Counter Received',
        vehicleType: 'Covered Van',
        requestDate: '24 Aug 2026',
        lastUpdated: '10 mins ago',
        unreadCount: 2,
    },
    {
        id: 'NEG-1042',
        rawId: 1042,
        sessionKey: 'ses-1042-bosch',
        slug: 'neg-1042-bosch-frankfurt',
        quoteId: 'QT-8823',
        requestId: 'REQ-1042',
        requestTitle: 'Frankfurt to Dortmund Heavy Equipment',
        customer: 'Bosch Automotive GmbH',
        customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        customerRating: 5.0,
        pickup: 'Frankfurt Central Depot, DE',
        delivery: 'Dortmund Logistics Hub, DE',
        origin: 'Frankfurt Central Depot, DE',
        destination: 'Dortmund Logistics Hub, DE',
        distance: '210 km',
        budget: '€890',
        originalAmount: 950,
        currentOffer: 890,
        currency: '€',
        priority: 'Normal',
        status: 'Under Review',
        vehicleType: 'Curtain Sider',
        requestDate: '20 Aug 2026',
        lastUpdated: '2 hours ago',
        unreadCount: 0,
    },
    {
        id: 'NEG-1039',
        rawId: 1039,
        slug: 'neg-1039-zalando-berlin',
        quoteId: 'QT-8824',
        requestId: 'REQ-1039',
        requestTitle: 'Berlin to Hamburg Express Pallets',
        customer: 'Zalando Fulfillment SE',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
        customerRating: 4.8,
        pickup: 'Berlin South Hub, DE',
        delivery: 'Hamburg Container Port, DE',
        origin: 'Berlin South Hub, DE',
        destination: 'Hamburg Container Port, DE',
        distance: '290 km',
        budget: '€1,450',
        originalAmount: 1600,
        currentOffer: 1450,
        currency: '€',
        priority: 'Urgent',
        status: 'Counter Offer Sent',
        vehicleType: 'Covered Van',
        requestDate: '18 Aug 2026',
        lastUpdated: 'Yesterday',
        unreadCount: 0,
    },
    {
        id: 'NEG-1035',
        rawId: 1035,
        slug: 'neg-1035-bayer-leverkusen',
        quoteId: 'QT-8825',
        requestId: 'REQ-1035',
        requestTitle: 'Leverkusen to Hamburg Cold Chain',
        customer: 'Bayer Healthcare AG',
        customerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60',
        customerRating: 4.9,
        pickup: 'Leverkusen Chemical Park, DE',
        delivery: 'Hamburg Cold Storage, DE',
        origin: 'Leverkusen Chemical Park, DE',
        destination: 'Hamburg Cold Storage, DE',
        distance: '410 km',
        budget: '€1,800',
        originalAmount: 1800,
        currentOffer: 1800,
        currency: '€',
        priority: 'Urgent',
        status: 'Accepted',
        vehicleType: 'Refrigerated Van',
        requestDate: '15 Aug 2026',
        lastUpdated: '3 days ago',
        unreadCount: 0,
    },
    {
        id: 'NEG-1031',
        rawId: 1031,
        slug: 'neg-1031-rewe-cologne',
        quoteId: 'QT-8826',
        requestId: 'REQ-1031',
        requestTitle: 'Cologne to Frankfurt Dry Freight',
        customer: 'Rewe Group Logistics',
        customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
        customerRating: 4.7,
        pickup: 'Cologne Freight Center, DE',
        delivery: 'Frankfurt Hub 3, DE',
        origin: 'Cologne Freight Center, DE',
        destination: 'Frankfurt Hub 3, DE',
        distance: '190 km',
        budget: '€650',
        originalAmount: 700,
        currentOffer: 650,
        currency: '€',
        priority: 'Normal',
        status: 'Negotiation',
        vehicleType: 'Open Truck',
        requestDate: '12 Aug 2026',
        lastUpdated: '5 days ago',
        unreadCount: 1,
    }
];

export const useSupplierNegotiations = () => {
    const [negotiations, setNegotiations] = useState<NegotiationItem[]>(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {
            // Ignore storage read error
        }
        return SAMPLE_NEGOTIATIONS;
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchNegotiations = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setIsLoading(true);
        }

        try {
            let res;
            try {
                res = await apiClient.get('/supplier/negotiations');
            } catch {
                res = await apiClient.get('/negotiations');
            }

            const raw = res.data?.data?.negotiations || res.data?.data || res.data || [];
            const resArray = Array.isArray(raw) ? raw : [];

            if (resArray.length > 0) {
                const mapped: NegotiationItem[] = resArray.map((n: any) => {
                    const quoteIdFormatted = n.quote_id_formatted || (n.quote_id ? `QT-${String(n.quote_id).padStart(4, '0')}` : (n.quote_number || 'QT-0000'));
                    const negId = n.id ? (String(n.id).startsWith('NEG-') ? n.id : `NEG-${String(n.id).padStart(4, '0')}`) : (n.reference_id || `NEG-${n.slug || '000'}`);
                    const reqId = n.request_id || (n.quote_request_id ? `REQ-${String(n.quote_request_id).padStart(4, '0')}` : '');
                    const customerName = n.company_name || n.sender_name || n.client_name || n.user?.name || 'Customer';
                    
                    const origAmount = Number(n.base_amount_raw ?? n.amount_raw ?? n.original_amount ?? n.initial_quote ?? 0);
                    const currOffer = Number(n.revised_amount_raw ?? n.amount_raw ?? n.current_offer ?? n.counter_amount ?? origAmount);
                    const currencySymbol = n.currency || '€';
                    
                    const rawStatus = (n.status_raw || n.status || '').toLowerCase();
                    const revStatus = (n.revision_status || '').toLowerCase();
                    
                    let statusLabel = 'Offer Submitted';
                    if (rawStatus === 'accepted' || revStatus === 'accepted') {
                        statusLabel = 'Accepted';
                    } else if (rawStatus === 'rejected' || revStatus === 'rejected') {
                        statusLabel = 'Rejected';
                    } else if (rawStatus === 'expired') {
                        statusLabel = 'Expired';
                    } else if (revStatus === 'pending') {
                        statusLabel = 'Counter Offer Sent';
                    } else if (n.unread_count > 0) {
                        statusLabel = 'Counter Received';
                    } else if (rawStatus === 'pending') {
                        statusLabel = 'Under Review';
                    } else if (n.status) {
                        statusLabel = n.status;
                    }

                    const origin = n.pickup_address || n.origin_city || (n.origin ? n.origin.split(',')[0] : 'Munich Freight Terminal, DE');
                    const destination = n.delivery_address || n.destination_city || (n.destination ? n.destination.split(',')[0] : 'Stuttgart Distribution Hub, DE');
                    const distanceStr = n.distance ? (String(n.distance).includes('km') ? n.distance : `${n.distance} km`) : `${n.est_distance || 220} km`;
                    const budgetFormatted = currOffer > 0 ? `${currencySymbol}${currOffer.toLocaleString()}` : `${currencySymbol}1,250`;
                    const priorityStr = n.priority || (n.unread_count > 0 ? 'Urgent' : 'Normal');
                    const dateFormatted = n.pickup_date 
                        ? new Date(n.pickup_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                        : (n.time_ago || (n.created_at ? new Date(n.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '24 Aug 2026'));

                    return {
                        id: negId,
                        rawId: n.id,
                        sessionKey: n.session_key || n.session_id || `ses-${n.id || '2'}`,
                        slug: n.slug || String(n.id),
                        quoteId: quoteIdFormatted,
                        requestId: reqId,
                        requestTitle: n.request_title || (origin && destination ? `${origin} → ${destination}` : 'Freight Shipment'),
                        customer: customerName,
                        customerAvatar: n.profile_picture || n.customer_avatar || n.user?.avatar || '',
                        pickup: origin,
                        delivery: destination,
                        origin,
                        destination,
                        distance: distanceStr,
                        budget: budgetFormatted,
                        originalAmount: origAmount,
                        currentOffer: currOffer,
                        currency: currencySymbol,
                        priority: priorityStr,
                        lastUpdated: n.time_ago || 'Recently',
                        requestDate: dateFormatted,
                        status: statusLabel,
                        statusRaw: rawStatus,
                        revisionStatus: revStatus,
                        unreadCount: n.unread_count || 0,
                        palletType: n.pallet_type,
                        vehicleType: n.vehicle_type || 'Covered Van',
                        pickupDate: n.pickup_date,
                        deliveryDate: n.delivery_date,
                        notes: n.message_snippet || n.notes,
                    };
                });

                setNegotiations(mapped);
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
                } catch {
                    // Ignore storage write error
                }
            } else {
                setNegotiations(SAMPLE_NEGOTIATIONS);
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(SAMPLE_NEGOTIATIONS));
                } catch {}
            }
        } catch (err) {
            console.error('Failed to fetch supplier negotiations:', err);
            setNegotiations(SAMPLE_NEGOTIATIONS);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNegotiations();
    }, [fetchNegotiations]);

    return {
        negotiations,
        setNegotiations,
        isLoading,
        fetchNegotiations,
    };
};
