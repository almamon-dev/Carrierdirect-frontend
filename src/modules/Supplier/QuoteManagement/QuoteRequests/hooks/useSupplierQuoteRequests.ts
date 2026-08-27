/**
 * useSupplierQuoteRequests Hook
 * Manages fetching, caching, and state synchronization for supplier quote requests.
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { resolveAddress } from '../utils/addressHelpers';

const CACHE_KEY = 'supplier_quote_requests_cache';

export function useSupplierQuoteRequests() {
    // Initialize from local cache for instant zero-flash rendering on browser refresh
    const [requests, setRequests] = useState<QuoteRequest[]>(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {}
        return [];
    });

    // Loading flag: starts false if cache exists, otherwise true to show skeleton
    const [isLoading, setIsLoading] = useState<boolean>(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) return false;
            }
        } catch {}
        return true;
    });

    /**
     * Fetch available quote requests from server
     * @param showSkeleton - Whether to show the skeleton during re-fetching
     */
    const fetchRequests = useCallback(async (showSkeleton = false) => {
        if (showSkeleton) setIsLoading(true);
        try {
            const res = await apiClient.get(ENDPOINTS.SUPPLIER.AVAILABLE_REQUESTS);
            const raw = res.data?.data?.requests || res.data?.data || res.data || res;
            const resArray = Array.isArray(raw) ? raw : (Array.isArray(raw?.requests) ? raw.requests : []);
            const sourceList = resArray;
            const mapped: QuoteRequest[] = sourceList.map((q: any) => ({
                id: q.id ? (String(q.id).startsWith('REQ-') || String(q.id).startsWith('QR-') ? q.id : `REQ-${q.id}`) : `REQ-000`,
                rawId: q.id || q.rawId,
                slug: String(q.slug || q.id),
                requestDate: q.pickup_date ? new Date(q.pickup_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : (q.requestDate || 'Today'),
                customer: q.user?.name || q.customer?.name || q.client_name || q.customer_name || q.pickup_company || q.pickup_contact_name || q.customer || 'Verified Shipper',
                customerAvatar: q.user?.avatar || q.user?.avatar_url || q.user?.profile_photo_url || q.user?.profile_photo_path || q.customer?.avatar || q.customer_avatar || q.customerAvatar || q.avatar || '',
                customerRating: q.user?.average_rating ?? q.user?.rating ?? q.customer_rating ?? q.customerRating ?? q.rating ?? 4.8,
                pickup: resolveAddress(q, 'pickup'),
                delivery: resolveAddress(q, 'delivery'),
                distance: q.est_distance || q.distance_miles ? `${q.est_distance || q.distance_miles} km` : (q.distance || '—'),
                budget: q.budget ? (String(q.budget).includes('€') || String(q.budget).includes('$') ? q.budget : `${q.currency || '€'}${q.budget}`) : 'Negotiable',
                priority: q.priority || 'Normal',
                status: q.status === 'active' ? 'New' : (q.status || 'New'),
                vehicleType: q.vehicle_type || q.vehicleType || 'Covered Van',
                loadType: q.load_type || q.loadType || 'Pallets',
                weight: q.weight ? (String(q.weight).includes('kg') ? q.weight : `${q.weight} kg`) : '2500 kg',
                volume: q.volume ? (String(q.volume).includes('m³') ? q.volume : `${q.volume} m³`) : '15 m³',
                notes: q.customer_notes || q.additional_notes || q.notes || '',
            }));
            setRequests(mapped);
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

    return {
        requests,
        setRequests,
        isLoading,
        fetchRequests,
    };
}
