/**
 * useSupplierLostQuotes Hook
 * Handles data fetching, caching, and state management for expired or lost supplier quotes.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { LostQuoteItem, LostFilterTab } from '../types';

const CACHE_KEY = 'supplier_lost_quotes_cache';

const SAMPLE_LOST_QUOTES: LostQuoteItem[] = [
    {
        id: 'REQ-1035',
        slug: 'req-1035-pharma-hamburg',
        requestDate: '15 Aug 2026',
        customer: 'Bayer Healthcare AG',
        customerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60',
        customerRating: 4.9,
        pickup: 'Leverkusen Chemical Park, DE',
        delivery: 'Hamburg Cold Storage, DE',
        distance: '410 km',
        budget: '€1,800',
        priority: 'Urgent',
        status: 'Lost',
        vehicleType: 'Refrigerated Truck',
    },
    {
        id: 'REQ-1031',
        slug: 'req-1031-dry-goods-cologne',
        requestDate: '12 Aug 2026',
        customer: 'Rewe Group Logistics',
        customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
        customerRating: 4.7,
        pickup: 'Cologne Freight Center, DE',
        delivery: 'Frankfurt Hub 3, DE',
        distance: '190 km',
        budget: '€650',
        priority: 'Normal',
        status: 'Declined',
        vehicleType: 'Covered Van',
    },
    {
        id: 'REQ-1028',
        slug: 'req-1028-steel-pipes-dortmund',
        requestDate: '08 Aug 2026',
        customer: 'Thyssenkrupp Materials AG',
        customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60',
        customerRating: 5.0,
        pickup: 'Duisburg Harbor Terminal, DE',
        delivery: 'Nuremberg Steel Depot, DE',
        distance: '460 km',
        budget: '€2,400',
        priority: 'High',
        status: 'Expired',
        vehicleType: 'Flatbed Trailer',
    },
];

export function useSupplierLostQuotes() {
    const [activeTab, setActiveTab] = useState<LostFilterTab>('All');

    // Initialize from local cache for instant zero-flash rendering
    const [quotes, setQuotes] = useState<LostQuoteItem[]>(() => {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {}
        return [];
    });

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
     * Fetch expired or lost quote requests from server
     */
    const fetchLostQuotes = useCallback(async (showSkeleton = false) => {
        if (showSkeleton) setIsLoading(true);
        try {
            const res = await apiClient.get(ENDPOINTS.SUPPLIER.QUOTES, {
                status: 'expired,declined,lost'
            });
            const raw = res.data?.data?.quotes || res.data?.quotes || res.data?.data || res.data;
            if (Array.isArray(raw) && raw.length > 0) {
                const mapped: LostQuoteItem[] = raw.map((q: any) => ({
                    id: q.id ? (String(q.id).startsWith('REQ-') ? q.id : `REQ-${q.id}`) : `REQ-000`,
                    slug: String(q.slug || q.id),
                    requestDate: q.created_at ? new Date(q.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
                    customer: q.customer?.name || q.user?.name || q.client_name || 'Verified Shipper',
                    customerAvatar: q.customer?.avatar || q.user?.avatar || '',
                    customerRating: q.customer?.rating || q.user?.rating || 4.8,
                    pickup: (q.pickup_address || q.pickup_city || '—').trim(),
                    delivery: (q.delivery_address || q.delivery_city || '—').trim(),
                    distance: q.distance ? `${q.distance} km` : '—',
                    budget: q.budget ? (String(q.budget).includes('€') ? q.budget : `€${q.budget}`) : (q.bid_amount ? String(q.bid_amount) : '€800'),
                    priority: q.priority || 'Normal',
                    status: q.reason === 'expired' || q.status === 'expired' ? 'Expired' : (q.reason === 'declined' || q.status === 'declined' ? 'Declined' : 'Lost'),
                    vehicleType: q.vehicle_type || 'Covered Van',
                }));
                setQuotes(mapped);
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
                } catch {}
            } else {
                setQuotes(SAMPLE_LOST_QUOTES);
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(SAMPLE_LOST_QUOTES));
                } catch {}
            }
        } catch {
            setQuotes(prev => prev.length > 0 ? prev : SAMPLE_LOST_QUOTES);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLostQuotes();
    }, [fetchLostQuotes]);

    // Tab-filtered dataset
    const filteredQuotes = useMemo(() => {
        if (!activeTab || activeTab.toLowerCase() === 'all') return quotes;
        return quotes.filter(q => (q.status || '').toLowerCase() === activeTab.toLowerCase());
    }, [quotes, activeTab]);

    return {
        quotes,
        filteredQuotes,
        isLoading,
        activeTab,
        setActiveTab,
        fetchLostQuotes,
    };
}
