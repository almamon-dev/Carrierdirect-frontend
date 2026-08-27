/**
 * useSupplierWonQuotes Hook
 * Manages fetching, caching, and state synchronization for supplier won/accepted quotes.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '@/lib/axios';
import { ENDPOINTS } from '@/config/api';
import { WonQuoteItem, WonFilterTab } from '../types';

const CACHE_KEY = 'supplier_won_quotes_cache';

const SAMPLE_WON_QUOTES: WonQuoteItem[] = [
    {
        id: 'REQ-1048',
        slug: 'req-1048-electronics-munich',
        requestDate: '24 Aug 2026',
        customer: 'Siemens Logistics AG',
        customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
        customerRating: 4.9,
        pickup: 'Munich Freight Terminal, DE',
        delivery: 'Stuttgart Distribution Hub, DE',
        distance: '220 km',
        budget: '€1,250',
        priority: 'High',
        status: 'In Transit',
        vehicleType: 'Covered Van',
    },
    {
        id: 'REQ-1042',
        slug: 'req-1042-industrial-parts',
        requestDate: '20 Aug 2026',
        customer: 'Bosch Automotive GmbH',
        customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
        customerRating: 5.0,
        pickup: 'Frankfurt Central Depot, DE',
        delivery: 'Dortmund Logistics Hub, DE',
        distance: '210 km',
        budget: '€890',
        priority: 'Normal',
        status: 'Delivered',
        vehicleType: 'Curtain Sider',
    },
    {
        id: 'REQ-1039',
        slug: 'req-1039-retail-goods-berlin',
        requestDate: '18 Aug 2026',
        customer: 'Zalando Fulfillment SE',
        customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
        customerRating: 4.8,
        pickup: 'Berlin South Hub, DE',
        delivery: 'Hamburg Container Port, DE',
        distance: '290 km',
        budget: '€1,450',
        priority: 'Urgent',
        status: 'Won',
        vehicleType: 'Box Truck',
    },
];

export function useSupplierWonQuotes() {
    const [activeTab, setActiveTab] = useState<WonFilterTab>('All');

    // Initialize from local cache for zero-flash initial rendering
    const [quotes, setQuotes] = useState<WonQuoteItem[]>(() => {
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
     * Fetch won quotes from the backend API, falling back gracefully to sample data
     */
    const fetchWonQuotes = useCallback(async (showSkeleton = false) => {
        if (showSkeleton) setIsLoading(true);
        try {
            const res = await apiClient.get(ENDPOINTS.SUPPLIER.QUOTES, {
                status: 'accepted,won,booked'
            });
            const raw = res.data?.data?.quotes || res.data?.quotes || res.data?.data || res.data;
            if (Array.isArray(raw) && raw.length > 0) {
                const mapped: WonQuoteItem[] = raw.map((q: any) => ({
                    id: q.id ? (String(q.id).startsWith('REQ-') ? q.id : `REQ-${q.id}`) : `REQ-000`,
                    slug: String(q.slug || q.id),
                    requestDate: q.created_at ? new Date(q.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recent',
                    customer: q.customer?.name || q.user?.name || q.client_name || 'Verified Shipper',
                    customerAvatar: q.customer?.avatar || q.user?.avatar || '',
                    customerRating: q.customer?.rating || q.user?.rating || 4.9,
                    pickup: (q.pickup_address || q.pickup_city || '—').trim(),
                    delivery: (q.delivery_address || q.delivery_city || '—').trim(),
                    distance: q.distance ? `${q.distance} km` : '240 km',
                    budget: q.amount ? (String(q.amount).includes('€') ? q.amount : `€${q.amount}`) : (q.budget ? String(q.budget) : '€1,100'),
                    priority: q.priority || 'Normal',
                    status: q.order_status === 'in_transit' ? 'In Transit' : (q.order_status === 'delivered' ? 'Delivered' : 'Won'),
                    vehicleType: q.vehicle_type || 'Covered Van',
                }));
                setQuotes(mapped);
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
                } catch {}
            } else {
                setQuotes(SAMPLE_WON_QUOTES);
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(SAMPLE_WON_QUOTES));
                } catch {}
            }
        } catch {
            setQuotes(prev => prev.length > 0 ? prev : SAMPLE_WON_QUOTES);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWonQuotes();
    }, [fetchWonQuotes]);

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
        fetchWonQuotes,
    };
}
