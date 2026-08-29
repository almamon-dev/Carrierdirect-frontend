/**
 * useSupplierQuoteRequests Hook
 * Manages fetching, caching, and state synchronization for supplier quote requests.
 * Fully integrated with backend stats and filter parameters.
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { resolveAddress } from '../utils/addressHelpers';
import { formatDisplayDate } from '@/lib/utils';
import { resolveSupplierQuoteStatus, STATUS_CHANGE_EVENT } from '../../utils/requestStatusTracker';

const CACHE_KEY = 'supplier_quote_requests_cache_v3';

export interface SupplierTabStats {
    total: number;
    all: number;
    today: number;
    upcoming: number;
    urgent: number;
    expired: number;
}

export function useSupplierQuoteRequests() {
    const [requests, setRequests] = useState<QuoteRequest[]>(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map((item: any) => ({
                        ...item,
                        status: resolveSupplierQuoteStatus(item),
                    }));
                }
            }
        } catch {}
        return [];
    });

    const [stats, setStats] = useState<SupplierTabStats>({
        total: 0,
        all: 0,
        today: 0,
        upcoming: 0,
        urgent: 0,
        expired: 0,
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * Fetch available quote requests from server
     * @param showSkeleton - Whether to show the skeleton during re-fetching
     * @param params - Optional query filters for the backend
     */
    const fetchRequests = useCallback(async (showSkeleton = false, params?: Record<string, any>) => {
        if (showSkeleton) setIsLoading(true);
        try {
            const res = await apiClient.get(ENDPOINTS.SUPPLIER.AVAILABLE_REQUESTS, { params });
            const responseData = res.data?.data || res.data;

            // Extract backend-calculated stats
            if (responseData?.stats) {
                setStats({
                    total: responseData.stats.total ?? responseData.stats.all ?? 0,
                    all: responseData.stats.all ?? responseData.stats.total ?? 0,
                    today: responseData.stats.today ?? 0,
                    upcoming: responseData.stats.upcoming ?? 0,
                    urgent: responseData.stats.urgent ?? 0,
                    expired: responseData.stats.expired ?? 0,
                });
            }

            const raw = 
                (Array.isArray(responseData?.requests?.data) && responseData.requests.data) ||
                (Array.isArray(responseData?.requests) && responseData.requests) ||
                (Array.isArray(responseData?.data) && responseData.data) ||
                (Array.isArray(responseData) && responseData) ||
                [];

            const resArray = Array.isArray(raw) ? raw : [];

            const mapped: QuoteRequest[] = resArray.map((q: any) => {
                const pickupDateStr = q.pickup_date_raw || q.pickup_date || q.pickupDate;
                const requestDateFormatted = formatDisplayDate(q.requested_date || q.pickup_date || q.created_at || q.requestDate);
                const computedStatus = resolveSupplierQuoteStatus(q);

                return {
                    id: q.id ? (String(q.id).startsWith('REQ-') || String(q.id).startsWith('QR-') ? q.id : `REQ-${q.id}`) : `REQ-000`,
                    rawId: q.id || q.rawId,
                    slug: String(q.slug || q.id),
                    requestDate: requestDateFormatted,
                    pickupDate: q.pickup_date ? String(q.pickup_date).replace('Pickup: ', '') : undefined,
                    pickupDateRaw: q.pickup_date_raw || (pickupDateStr ? String(pickupDateStr).replace('Pickup: ', '') : undefined),
                    deliveryDate: q.delivery_date ? String(q.delivery_date).replace('Delivery: ', '') : undefined,
                    deliveryDateRaw: q.delivery_date_raw,
                    customer: q.customer?.name || q.client_name || q.customer_name || q.user?.name || q.pickup_company || q.pickup_contact_name || (typeof q.customer === 'string' ? q.customer : null) || 'Verified Shipper',
                    customerAvatar: q.customer?.profile_picture || q.user?.avatar || q.user?.avatar_url || q.user?.profile_photo_url || q.customerAvatar || q.avatar || '',
                    customerRating: q.user?.average_rating ?? q.user?.rating ?? q.customer_rating ?? q.customerRating ?? q.rating ?? 4.8,
                    pickup: resolveAddress(q, 'pickup'),
                    delivery: resolveAddress(q, 'delivery'),
                    distance: q.distance || (q.est_distance ? `${q.est_distance} km` : (q.distance_miles ? `${q.distance_miles} km` : '—')),
                    budget: q.budget ? (String(q.budget).includes('€') ? String(q.budget) : `€${String(q.budget).replace(/[^0-9.,]/g, '')}`) : 'Negotiable',
                    priority: q.priority || 'Normal',
                    status: computedStatus,
                    vehicleType: q.vehicle_type || q.vehicleType || 'Covered Van',
                    loadType: q.load_type || q.loadType || 'Pallets',
                    weight: q.weight ? (String(q.weight).includes('kg') ? q.weight : `${q.weight} kg`) : '2500 kg',
                    volume: q.volume ? (String(q.volume).includes('m³') ? q.volume : `${q.volume} m³`) : '15 m³',
                    notes: q.customer_notes || q.additional_notes || q.notes || '',
                    isToday: q.is_today !== undefined ? Boolean(q.is_today) : undefined,
                    isUpcoming: q.is_upcoming !== undefined ? Boolean(q.is_upcoming) : undefined,
                    isExpired: q.is_expired !== undefined ? Boolean(q.is_expired) : (computedStatus.toLowerCase() === 'expired'),
                    isUrgent: q.is_urgent !== undefined ? Boolean(q.is_urgent) : (String(q.priority || '').toLowerCase() === 'urgent'),
                };
            });

            setRequests(mapped);

            // Update stats from client mapped count if not returned from backend
            if (!responseData?.stats) {
                let todayCount = 0;
                let upcomingCount = 0;
                let urgentCount = 0;
                let expiredCount = 0;

                mapped.forEach(item => {
                    if (item.isToday) todayCount++;
                    if (item.isUpcoming) upcomingCount++;
                    if (item.isUrgent) urgentCount++;
                    if (item.isExpired) expiredCount++;
                });

                setStats({
                    total: mapped.length,
                    all: mapped.length,
                    today: todayCount,
                    upcoming: upcomingCount,
                    urgent: urgentCount,
                    expired: expiredCount,
                });
            }

            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
            } catch {}
        } catch (err) {
            console.error('Failed to fetch available requests', err);
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    // Real-time listener for live status transitions (Viewed, Quoted, Booked)
    useEffect(() => {
        const handleStatusChange = (e: any) => {
            const { id, status } = e.detail || {};
            if (!id || !status) return;

            setRequests(prev => {
                const next = prev.map(r => {
                    const cleanRId = String(r.rawId || r.slug || r.id).replace('REQ-', '').trim();
                    const cleanTargetId = String(id).replace('REQ-', '').trim();
                    if (cleanRId === cleanTargetId) {
                        return { ...r, status };
                    }
                    return r;
                });
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(next));
                } catch {}
                return next;
            });
        };

        window.addEventListener(STATUS_CHANGE_EVENT, handleStatusChange);
        return () => window.removeEventListener(STATUS_CHANGE_EVENT, handleStatusChange);
    }, []);

    return {
        requests,
        setRequests,
        stats,
        isLoading,
        fetchRequests,
    };
}
