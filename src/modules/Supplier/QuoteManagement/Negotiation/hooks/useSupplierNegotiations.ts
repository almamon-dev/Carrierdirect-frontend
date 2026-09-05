import { apiClient } from "@/lib/axios";
import { formatDisplayDate } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { NegotiationItem } from "../types";

export const SAMPLE_NEGOTIATIONS: NegotiationItem[] = [];

export const useSupplierNegotiations = () => {
    const [negotiations, setNegotiations] = useState<NegotiationItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchNegotiations = useCallback(async (showSkeleton = true) => {
        if (showSkeleton) {
            setIsLoading(true);
        }

        try {
            let res;
            try {
                res = await apiClient.get("/supplier/negotiations");
            } catch {
                res = await apiClient.get("/negotiations");
            }

            const raw =
                (Array.isArray(res?.data?.data?.negotiations?.data) && res.data.data.negotiations.data) ||
                (Array.isArray(res?.data?.data?.negotiations) && res.data.data.negotiations) ||
                (Array.isArray(res?.data?.negotiations?.data) && res.data.negotiations.data) ||
                (Array.isArray(res?.data?.negotiations) && res.data.negotiations) ||
                (Array.isArray(res?.data?.data) && res.data.data) ||
                (Array.isArray(res?.data) && res.data) ||
                (Array.isArray(res) && res) ||
                [];
            const resArray = Array.isArray(raw) ? raw : [];

            if (resArray.length > 0) {
                const mapped: NegotiationItem[] = resArray.map((n: any) => {
                    const idFormatted = n.quote_id_formatted || (n.id ? `QT-${String(n.id).padStart(4, "0")}` : `QT-0000`);
                    const reqId = n.request_id || (n.quote_request_id ? `REQ-${String(n.quote_request_id).padStart(4, "0")}` : "REQ-0000");
                    const reqTitle = n.request_title || n.quote_request?.request_title || reqId;
                    const customerName = n.sender_name || n.customer_name || n.customer?.name || n.company_name || "Shipper Partner";
                    const avatarUrl = n.profile_picture || n.customer?.profile_picture || "";

                    const origPrice = Number(n.base_amount_raw ?? n.base_amount ?? n.amount_raw ?? n.amount ?? 0);
                    const currentPrice = Number(n.revised_amount_raw ?? n.revised_amount ?? n.amount_raw ?? n.amount ?? origPrice);

                    const pickupLoc = n.origin || n.pickup_address || n.pickup || "Pickup Location";
                    const deliveryLoc = n.destination || n.delivery_address || n.delivery || "Delivery Destination";
                    const distStr = n.distance || `${n.distance_km || 450} km`;
                    const dateFormatted = formatDisplayDate(n.created_at || n.request_date || n.date);

                    let statusLabel = n.status || "Active";
                    if (n.status_raw === "accepted" || String(statusLabel).toLowerCase().includes("accept")) {
                        statusLabel = "Accepted";
                    } else if (n.status_raw === "rejected" || String(statusLabel).toLowerCase().includes("reject")) {
                        statusLabel = "Declined";
                    } else if (n.revision_status === "pending" || n.revised_amount) {
                        statusLabel = "Counter Received";
                    }

                    return {
                        id: idFormatted,
                        rawId: n.id || n.quote_id,
                        sessionKey: n.session_key || `ses-${n.id || n.quote_id}`,
                        slug: n.slug || String(n.id || n.quote_id),
                        quoteId: idFormatted,
                        requestId: reqId,
                        requestTitle: reqTitle,
                        customer: customerName,
                        customerAvatar: avatarUrl,
                        pickup: pickupLoc,
                        delivery: deliveryLoc,
                        distance: distStr,
                        budget: `€ ${Number(origPrice || currentPrice).toLocaleString()}`,
                        originalAmount: origPrice,
                        currentOffer: currentPrice,
                        currency: "€",
                        priority: n.priority || (statusLabel === "Counter Received" ? "Urgent" : "Normal"),
                        lastUpdated: n.time_ago || "Recently",
                        requestDate: dateFormatted,
                        status: statusLabel,
                        statusRaw: n.status_raw || "pending",
                        revisionStatus: n.revision_status || "none",
                        unreadCount: Number(n.unread_count ?? (statusLabel.includes("Counter") ? 1 : 0)),
                        palletType: n.pallet_type || "Standard Euro Pallet",
                        vehicleType: n.vehicle_type || "Curtainsider (13.6m)",
                        pickupDate: n.pickup_date,
                        deliveryDate: n.delivery_date,
                        notes: n.message_snippet || n.notes,
                        declineReason: n.decline_reason || n.declineReason,
                    };
                });

                setNegotiations(mapped);
            } else {
                setNegotiations([]);
            }
        } catch (err) {
            console.error("Failed to fetch supplier negotiations:", err);
            setNegotiations([]);
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
