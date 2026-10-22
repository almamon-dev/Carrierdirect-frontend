import { useMemo } from "react";
import {
    isQuoteCompleted,
    isQuoteReviewed,
    isQuoteNew,
} from "../components/QuotesReceivedFilterTabs";

interface UseFilteredQuotesReceivedProps {
    quotes: any[];
    activeFilterTab: string;
    supplierFilter?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    statusFilter?: string;
    vehicleFilter?: string;
    ratingFilter?: string;
    startDate?: string;
    endDate?: string;
}

export function useFilteredQuotesReceived({
    quotes,
    activeFilterTab,
    supplierFilter = "",
    minPrice = "",
    maxPrice = "",
    statusFilter = "all",
    vehicleFilter = "all",
    ratingFilter = "all",
    startDate = "",
    endDate = "",
}: UseFilteredQuotesReceivedProps) {
    return useMemo(() => {
        const parsedMin = minPrice !== "" && !isNaN(Number(minPrice)) ? Number(minPrice) : null;
        const parsedMax = maxPrice !== "" && !isNaN(Number(maxPrice)) ? Number(maxPrice) : null;
        const normSupplier = (supplierFilter || "").trim().toLowerCase();

        return (quotes || []).filter((item) => {
            if (!item) return false;

            // Completed quotes belong strictly in Quote History / Completed
            if (isQuoteCompleted(item)) return false;

            const tab = (activeFilterTab || "all").toLowerCase();
            if (tab === "all") {
                // Return all non-completed
            } else if (tab === "new" || tab === "new_quotes" || tab === "new quotes") {
                if (!isQuoteNew(item)) return false;
            } else if (tab === "reviewed") {
                if (!isQuoteReviewed(item)) return false;
            }

            // Advanced Filter: Supplier
            if (normSupplier) {
                const itemSupplier = String(item.supplier || item.supplier_name || item.customer || "").toLowerCase();
                const hasMatchingSupplier = itemSupplier.includes(normSupplier) || (
                    Array.isArray(item.quotes) && item.quotes.some((q: any) => 
                        String(q.supplier || q.supplier_name || "").toLowerCase().includes(normSupplier)
                    )
                );
                if (!hasMatchingSupplier) return false;
            }

            // Advanced Filter: Price Range (Min / Max)
            if (parsedMin !== null || parsedMax !== null) {
                const getPrices = (obj: any): number[] => {
                    if (Array.isArray(obj.quotes) && obj.quotes.length > 0) {
                        return obj.quotes.map((q: any) => Number(q.amount_raw ?? q.amount ?? 0)).filter((p: number) => p > 0);
                    }
                    const val = Number(obj.amount_raw ?? obj.amount ?? obj.lowestAmount ?? 0);
                    return val > 0 ? [val] : [];
                };

                const prices = getPrices(item);
                if (prices.length > 0) {
                    const minFound = Math.min(...prices);
                    const maxFound = Math.max(...prices);

                    if (parsedMin !== null && maxFound < parsedMin) return false;
                    if (parsedMax !== null && minFound > parsedMax) return false;
                }
            }

            if (statusFilter && statusFilter !== "all") {
                const normStatus = String(item.status || item.status_raw || "").toLowerCase();
                if (!normStatus.includes(statusFilter.toLowerCase())) return false;
            }

            if (vehicleFilter && vehicleFilter !== "all") {
                const normVehicle = String(item.vehicleType || item.vehicle_type || "").toLowerCase();
                if (!normVehicle.includes(vehicleFilter.toLowerCase())) return false;
            }

            if (ratingFilter && ratingFilter !== "all") {
                const r = parseFloat(item.supplierRating || item.supplier_rating || item.rating || 0);
                const minR = parseFloat(ratingFilter);
                if (!isNaN(minR) && r < minR) return false;
            }

            if (startDate || endDate) {
                const dateVal = item.created_at || item.createdAt || item.date;
                if (dateVal) {
                    const time = new Date(dateVal).getTime();
                    if (!isNaN(time)) {
                        if (startDate && time < new Date(startDate).setHours(0, 0, 0, 0)) return false;
                        if (endDate && time > new Date(endDate).setHours(23, 59, 59, 999)) return false;
                    }
                }
            }

            return true;
        });
    }, [quotes, activeFilterTab, supplierFilter, minPrice, maxPrice, statusFilter, vehicleFilter, ratingFilter, startDate, endDate]);
}
