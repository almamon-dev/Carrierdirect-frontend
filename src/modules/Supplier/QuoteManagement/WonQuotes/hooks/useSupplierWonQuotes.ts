/**
 * useSupplierWonQuotes Hook
 * Manages fetching and state synchronization for supplier won/accepted quotes.
 */

import apiClient from "@/lib/axios";
import { formatDisplayDate } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { resolveAddress } from "../../QuoteRequests/utils/addressHelpers";
import { WonFilterTab, WonQuoteItem } from "../types";

export function useSupplierWonQuotes() {
    const [activeTab, setActiveTab] = useState<WonFilterTab>("All");
    const [quotes, setQuotes] = useState<WonQuoteItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    /**
     * Fetch won quotes from the backend API
     */
    const fetchWonQuotes = useCallback(async (showSkeleton = true) => {
        if (showSkeleton) setIsLoading(true);
        try {
            const res = await apiClient.get("/supplier/quotes/won");
            const raw =
                (Array.isArray(res.data?.data?.quotes?.data) && res.data.data.quotes.data) ||
                (Array.isArray(res.data?.data?.quotes) && res.data.data.quotes) ||
                (Array.isArray(res.data?.quotes?.data) && res.data.quotes.data) ||
                (Array.isArray(res.data?.quotes) && res.data.quotes) ||
                (Array.isArray(res.data?.data) && res.data.data) ||
                (Array.isArray(res.data) && res.data) ||
                [];

            if (Array.isArray(raw)) {
                const mapped: WonQuoteItem[] = raw.map((q: any) => {
                    const reqObj = q.quote_request || {};
                    const reqId = q.quote_request_id || reqObj.id || q.id;
                    const pickupFormatted = resolveAddress(reqObj.pickup_address ? reqObj : q, 'pickup');
                    const deliveryFormatted = resolveAddress(reqObj.delivery_address ? reqObj : q, 'delivery');

                    const formattedAmount = q.amount
                        ? (String(q.amount).includes('€') ? String(q.amount) : `€${Number(q.amount).toLocaleString()}`)
                        : (reqObj.budget ? String(reqObj.budget) : "€0");

                    return {
                        id: reqId ? (String(reqId).startsWith("REQ-") ? reqId : `REQ-${reqId}`) : "REQ-000",
                        rawId: reqId,
                        slug: String(reqObj.slug || q.slug || reqId),
                        requestDate: formatDisplayDate(q.requested_date || reqObj.requested_date || q.created_at || reqObj.created_at),
                        pickupDate: reqObj.pickup_date || q.pickup_date,
                        pickupDateRaw: reqObj.pickup_date_raw || q.pickup_date_raw,
                        deliveryDate: reqObj.delivery_date || q.delivery_date,
                        deliveryDateRaw: reqObj.delivery_date_raw || q.delivery_date_raw,
                        customer: reqObj.customer?.name || reqObj.client_name || q.customer?.name || "Verified Shipper",
                        customerAvatar: reqObj.customer?.profile_picture || reqObj.customer?.avatar || q.customer?.avatar || "",
                        customerRating: reqObj.customer?.rating || q.customer?.rating || 4.9,
                        pickup: pickupFormatted || "—",
                        delivery: deliveryFormatted || "—",
                        distance: reqObj.distance || (q.distance ? `${q.distance} km` : "—"),
                        budget: formattedAmount,
                        priority: reqObj.priority || q.priority || "Normal",
                        status: q.order_status === "in_transit" ? "In Transit" : (q.order_status === "delivered" ? "Delivered" : "Won"),
                        vehicleType: reqObj.vehicle_type || q.vehicle_type || "Covered Van",
                    };
                });

                setQuotes(mapped);
            } else {
                setQuotes([]);
            }
        } catch (error) {
            console.error("Failed to fetch won quotes:", error);
            setQuotes([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWonQuotes();
    }, [fetchWonQuotes]);

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
        fetchWonQuotes,
    };
}
