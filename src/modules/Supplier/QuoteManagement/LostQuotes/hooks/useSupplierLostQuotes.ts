/**
 * useSupplierLostQuotes Hook
 * Handles data fetching, caching, and state management for expired or lost supplier quotes.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import apiClient from "@/lib/axios";
import { LostQuoteItem, LostFilterTab } from "../types";

import { formatDisplayDate } from "@/lib/utils";

const CACHE_KEY = "supplier_lost_quotes_cache";

export function useSupplierLostQuotes() {
    const [activeTab, setActiveTab] = useState<LostFilterTab>("All");

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
        setIsLoading(true);
        try {
            const res = await apiClient.get("/supplier/quotes/lost");
            const raw =
                (Array.isArray(res.data?.data?.quotes?.data) && res.data.data.quotes.data) ||
                (Array.isArray(res.data?.data?.quotes) && res.data.data.quotes) ||
                (Array.isArray(res.data?.quotes?.data) && res.data.quotes.data) ||
                (Array.isArray(res.data?.quotes) && res.data.quotes) ||
                (Array.isArray(res.data?.data) && res.data.data) ||
                (Array.isArray(res.data) && res.data) ||
                [];
            if (Array.isArray(raw)) {
                const mapped: LostQuoteItem[] = raw.map((q: any) => ({
                    id: q.id ? (String(q.id).startsWith("REQ-") ? q.id : `REQ-${q.quote_request_id || q.id}`) : "REQ-000",
                    slug: String(q.slug || q.id),
                    requestDate: formatDisplayDate(q.requested_date || q.created_at || q.date || q.created_at_formatted),
                    customer: q.customer?.name || q.quote_request?.customer?.name || q.quote_request?.client_name || "Verified Shipper",
                    customerAvatar: q.customer?.avatar || q.quote_request?.customer?.profile_picture || "",
                    customerRating: q.customer?.rating || 4.8,
                    pickup: (q.quote_request?.pickup_address || q.pickup_address || "—").trim(),
                    delivery: (q.quote_request?.delivery_address || q.delivery_address || "—").trim(),
                    distance: q.quote_request?.distance || (q.distance ? `${q.distance} km` : "—"),
                    budget: q.amount ? `€${Number(q.amount).toLocaleString()}` : (q.budget ? String(q.budget) : "€0"),
                    priority: q.quote_request?.priority || q.priority || "Normal",
                    status: q.status === "expired" ? "Expired" : (q.status === "rejected" || q.status === "declined" ? "Declined" : "Lost"),
                    vehicleType: q.vehicle_type || "Covered Van",
                }));
                setQuotes(mapped);
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
                } catch {}
            } else {
                setQuotes([]);
                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify([]));
                } catch {}
            }
        } catch (error) {
            console.error("Failed to fetch lost quotes:", error);
            setQuotes([]);
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify([]));
            } catch {}
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLostQuotes();
    }, [fetchLostQuotes]);

    // Tab-filtered dataset
    const filteredQuotes = useMemo(() => {
        if (!activeTab || activeTab.toLowerCase() === "all") return quotes;
        return quotes.filter(q => (q.status || "").toLowerCase() === activeTab.toLowerCase());
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
