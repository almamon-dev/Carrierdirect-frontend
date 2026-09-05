/**
 * useSupplierLostQuotes Hook
 * Handles data fetching and state management for expired or lost supplier quotes.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import apiClient from "@/lib/axios";
import { LostQuoteItem, LostFilterTab } from "../types";
import { isLostItemToday } from "../components/FilterTabs";
import { formatDisplayDate } from "@/lib/utils";

export interface LostQuoteStats {
    total: number;
    all: number;
    today: number;
}

export function useSupplierLostQuotes() {
    const [activeTab, setActiveTab] = useState<LostFilterTab>("all");
    const [stats, setStats] = useState<LostQuoteStats>({ total: 0, all: 0, today: 0 });
    const [quotes, setQuotes] = useState<LostQuoteItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    /**
     * Fetch expired or lost quote requests from server
     */
    const fetchLostQuotes = useCallback(async (showSkeleton = true) => {
        if (showSkeleton) setIsLoading(true);
        try {
            const res = await apiClient.get("/supplier/quotes/expired");
            const responseData = res.data?.data || res.data;

            if (responseData?.stats) {
                setStats({
                    total: responseData.stats.total ?? responseData.stats.all ?? 0,
                    all: responseData.stats.all ?? responseData.stats.total ?? 0,
                    today: responseData.stats.today ?? 0,
                });
            }

            const raw =
                (Array.isArray(responseData?.quotes?.data) && responseData.quotes.data) ||
                (Array.isArray(responseData?.quotes) && responseData.quotes) ||
                (Array.isArray(responseData?.data) && responseData.data) ||
                (Array.isArray(responseData) && responseData) ||
                [];

            if (Array.isArray(raw)) {
                const mapped: LostQuoteItem[] = raw.map((q: any) => {
                    const pickupDateStr = q.pickup_date_raw || q.pickup_date || q.requested_date || q.created_at;
                    return {
                        id: q.id ? (String(q.id).startsWith("REQ-") ? q.id : `REQ-${q.quote_request_id || q.id}`) : "REQ-000",
                        rawId: q.id || q.quote_request_id,
                        slug: String(q.slug || q.quote_request?.slug || q.id),
                        requestDate: formatDisplayDate(q.requested_date || q.created_at || q.date || q.created_at_formatted),
                        pickupDate: q.pickup_date ? String(q.pickup_date).replace('Pickup: ', '') : undefined,
                        pickupDateRaw: q.pickup_date_raw || (pickupDateStr ? String(pickupDateStr) : undefined),
                        deliveryDate: q.delivery_date ? String(q.delivery_date).replace('Delivery: ', '') : undefined,
                        deliveryDateRaw: q.delivery_date_raw,
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
                        isToday: q.is_today !== undefined ? Boolean(q.is_today) : undefined,
                        isExpired: true,
                    };
                });

                setQuotes(mapped);

                if (!responseData?.stats) {
                    let todayCount = 0;
                    mapped.forEach(item => {
                        if (isLostItemToday(item)) todayCount++;
                    });
                    setStats({
                        total: mapped.length,
                        all: mapped.length,
                        today: todayCount,
                    });
                }
            } else {
                setQuotes([]);
            }
        } catch (error) {
            console.error("Failed to fetch lost quotes:", error);
            setQuotes([]);
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
        if (activeTab.toLowerCase() === "today") {
            return quotes.filter(q => isLostItemToday(q));
        }
        return quotes.filter(q => (q.status || "").toLowerCase() === activeTab.toLowerCase());
    }, [quotes, activeTab]);

    return {
        quotes,
        filteredQuotes,
        stats,
        isLoading,
        activeTab,
        setActiveTab,
        fetchLostQuotes,
    };
}
