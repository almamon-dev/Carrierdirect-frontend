import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/axios";
import { ENDPOINTS } from "@/config/api";
import { useToastStore } from "@/stores/useToastStore";
import { encryptId } from "@/lib/encryption";
import { formatDisplayDate } from "@/lib/utils";
import { resolveQuoteDistance } from "@/utils/geoDistance";

export const normalizeQuoteItem = (n: any) => {
    const rawId = n.rawId || n.id || n.quote_id;
    const idFormatted = n.quote_id_formatted || (rawId ? (String(rawId).startsWith('QT-') ? rawId : `QT-${String(rawId).padStart(4, '0')}`) : 'QT-0000');
    const reqIdVal = n.quote_request_id || n.quote_request?.id || n.rawId;
    const reqId = n.request_id || (reqIdVal ? (String(reqIdVal).startsWith('REQ-') ? reqIdVal : `REQ-${String(reqIdVal).padStart(4, '0')}`) : 'REQ-0000');
    const reqTitle = n.request_title || n.quote_request?.request_title || reqId;
    const supplierName = n.sender_name || n.supplier_name || n.supplier?.company_name || n.supplier?.name || n.carrier_name || n.company_name || n.customer || n.supplier || 'Supplier';
    const avatarUrl = n.profile_picture || n.supplier?.profile_picture || n.supplier_avatar || n.customerAvatar || n.supplierAvatar || '';

    const extraCharges = Array.isArray(n.extra_charges) ? n.extra_charges.map((c: any) => ({
        id: c.id,
        type: c.type || c.custom_name || "Extra Service",
        custom_name: c.custom_name || c.customName || c.type || "Extra Service",
        label: c.type === "Custom" ? (c.custom_name || "Extra Service") : (c.type || "Extra Service"),
        amount: Number(c.amount || 0)
    })).filter((c: any) => c.amount > 0) : [];
    const totalExtras = extraCharges.reduce((sum: number, c: any) => sum + (Number(c.amount) || 0), 0);
    const origPrice = Number(n.amount_raw ?? n.amount ?? (n.base_amount_raw ? Number(n.base_amount_raw) + totalExtras : 0));
    const currentPrice = Number(n.revised_amount_raw ?? n.revised_amount ?? origPrice);
    const baseFreightAmount = Number(
        n.base_amount_raw ??
        (n.base_amount ? parseFloat(String(n.base_amount).replace(/[^0-9.]/g, "")) : (origPrice > totalExtras && totalExtras > 0 ? origPrice - totalExtras : origPrice))
    );

    const pickupLoc = n.origin || n.pickup_address || n.pickup || n.quote_request?.pickup_city || 'Pickup Location';
    const deliveryLoc = n.destination || n.delivery_address || n.delivery || n.quote_request?.delivery_city || 'Delivery Destination';
    const distStr = resolveQuoteDistance({ ...n, ...(n.quote_request || {}), ...(n.quoteRequest || {}), origin: pickupLoc, destination: deliveryLoc }).distanceStr;
    const dateFormatted = formatDisplayDate(n.created_at || n.request_date || n.date || n.received_at || n.quote_request?.created_at);

    let statusLabel = n.status || 'Active';
    const statusRawLower = String(n.status_raw || n.status || '').toLowerCase();

    // Check if validity has passed
    const expiryField = n.valid_until || n.expires_at || n.expiry_date || n.validity_date || n.quote_request?.expires_at;
    const isDateExpired = expiryField ? (!isNaN(new Date(expiryField).getTime()) && new Date(expiryField).getTime() < Date.now()) : false;

    const isBooked = Boolean(
        statusRawLower === 'booked' ||
        statusRawLower === 'confirmed' ||
        statusRawLower === 'in_progress' ||
        statusRawLower === 'completed' ||
        String(statusLabel).toLowerCase().includes('book') ||
        n.is_paid ||
        n.has_order ||
        n.order_id
    );

    if (isBooked) {
        statusLabel = 'Booked';
    } else if (statusRawLower === 'accepted' || String(statusLabel).toLowerCase().includes('accept')) {
        statusLabel = 'Accepted';
    } else if (statusRawLower === 'expired' || isDateExpired || String(statusLabel).toLowerCase().includes('expire')) {
        statusLabel = 'Expired';
    } else if (statusRawLower === 'rejected' || String(statusLabel).toLowerCase().includes('reject') || String(statusLabel).toLowerCase().includes('decline')) {
        statusLabel = 'Rejected';
    } else if (n.revision_status === 'pending' || n.revised_amount) {
        statusLabel = 'Counter Received';
    }

    const deliveryDateFormatted = n.delivery_date ? formatDisplayDate(n.delivery_date) : (n.estimated_delivery || n.estimated_time || n.transit_time || n.deliveryDate || '48h');

    return {
        id: idFormatted,
        rawId: rawId,
        sessionKey: n.session_key || `ses-${rawId}`,
        slug: n.slug || String(rawId),
        quoteId: idFormatted,
        quote_id: idFormatted,
        requestId: reqId,
        request_id: reqId,
        quote_request_id: n.quote_request_id || n.quote_request?.id,
        requestTitle: reqTitle,
        customer: supplierName,
        supplier: supplierName,
        supplier_name: supplierName,
        customerAvatar: avatarUrl,
        supplierAvatar: avatarUrl,
        supplier_avatar: avatarUrl,
        pickup: pickupLoc,
        pickup_address: pickupLoc,
        delivery: deliveryLoc,
        delivery_address: deliveryLoc,
        distance: distStr && distStr !== '—' ? distStr : (n.distance || n.est_distance || '—'),
        budget: (origPrice === 0 && currentPrice === 0) ? 'Negotiable' : `€ ${Number(origPrice || currentPrice).toLocaleString()}`,
        amount: origPrice || currentPrice,
        amount_raw: origPrice || currentPrice,
        originalAmount: origPrice,
        currentOffer: currentPrice,
        baseFreightAmount: baseFreightAmount,
        extraCharges: extraCharges,
        totalExtras: totalExtras,
        currency: '€',
        priority: n.priority || (statusLabel === 'Counter Received' ? 'Urgent' : 'Normal'),
        lastUpdated: n.time_ago || 'Recently',
        requestDate: dateFormatted,
        created_at: n.created_at || n.request_date || n.date,
        status: statusLabel,
        status_raw: n.status_raw || statusRawLower || 'pending',
        statusRaw: n.status_raw || statusRawLower || 'pending',
        revision_status: n.revision_status || 'none',
        revisionStatus: n.revision_status || 'none',
        unreadCount: typeof n.unread_count === 'number' ? Number(n.unread_count) : (n.is_read === false ? 1 : 0),
        palletType: n.pallet_type || 'Standard Euro Pallet',
        vehicleType: n.vehicle_type || n.truck_type || n.vehicle || n.quote_request?.vehicle_type || 'Covered Van (20ft)',
        vehicle_type: n.vehicle_type || n.truck_type || n.vehicle || n.quote_request?.vehicle_type || 'Covered Van (20ft)',
        vehicle: n.vehicle_type || n.truck_type || n.vehicle || n.quote_request?.vehicle_type || 'Covered Van (20ft)',
        pickupDate: n.pickup_date,
        deliveryDate: deliveryDateFormatted,
        estimated_delivery: deliveryDateFormatted,
        transit: deliveryDateFormatted,
        transit_time: deliveryDateFormatted,
        notes: n.message_snippet || n.notes,
        declineReason: n.decline_reason || n.declineReason,
        isOnline: Boolean(n.is_online),
        lastSeenHuman: n.last_seen_human || (n.is_online ? "Active now" : "Offline"),
        lastSeenAt: n.last_seen_at,
        baseFreight: baseFreightAmount,
        isPaid: isBooked || Boolean(n.is_paid),
        hasOrder: isBooked || Boolean(n.has_order || n.order_id),
        orderId: n.order_id,
        orderNumber: n.order_number,
        raw: n,
    };
};

export function useCustomerQuotesReceived() {
    const navigate = useNavigate();
    const showToast = useToastStore((state) => state.showToast);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const [rejectModalQuote, setRejectModalQuote] = useState<any>(null);

    const fetchQuotes = useCallback(async (isManualRefresh = false) => {
        if (isManualRefresh) setIsRefreshing(true);
        else setLoading(true);

        try {
            const endpoint = ENDPOINTS.CUSTOMER.QUOTES || "/customer/quotes";
            const [quotesRes, negotRes] = await Promise.allSettled([
                apiClient.get(endpoint),
                apiClient.get('/customer/negotiations').catch(() => apiClient.get('/negotiations')),
            ]);

            const allItems: any[] = [];
            const seenIds = new Set<string | number>();

            const processList = (raw: any) => {
                const list = Array.isArray(raw)
                    ? raw
                    : (raw?.data?.data?.negotiations?.data ||
                       raw?.data?.data?.negotiations ||
                       raw?.data?.negotiations?.data ||
                       raw?.data?.negotiations ||
                       raw?.data?.data ||
                       raw?.data?.quotes ||
                       raw?.data ||
                       []);
                if (Array.isArray(list)) {
                    list.forEach((item) => {
                        const uniqueKey = item?.id || item?.quote_id || item?.rawId;
                        if (uniqueKey && !seenIds.has(uniqueKey)) {
                            seenIds.add(uniqueKey);
                            allItems.push(normalizeQuoteItem(item));
                        }
                    });
                }
            };

            if (quotesRes.status === 'fulfilled') {
                processList(quotesRes.value);
            }
            if (negotRes.status === 'fulfilled') {
                processList(negotRes.value);
            }

            setQuotes(allItems);
            if (isManualRefresh) {
                showToast("Quotes refreshed successfully", "success");
            }
        } catch (error: any) {
            console.error("Failed to fetch received quotes:", error);
            try {
                const altRes = await apiClient.get("/customer/received-quotes");
                const altData = altRes?.data?.data;
                const altList = Array.isArray(altData) ? altData : (altData?.data || []);
                const mapped = (Array.isArray(altList) ? altList : []).map(normalizeQuoteItem);
                setQuotes(mapped);
            } catch {
                setQuotes([]);
            }
        } finally {
            setLoading(false);
            if (isManualRefresh) {
                setTimeout(() => setIsRefreshing(false), 300);
            }
        }
    }, [showToast]);

    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    const handleAccept = (quoteId: number, quoteObj?: any) => {
        const foundQuote = quoteObj || quotes.find((q) => q.id === quoteId || q.rawId === quoteId);
        navigate(`/customer/quotes/received/checkout/${encryptId(quoteId)}`, {
            state: { quote: foundQuote }
        });
    };

    const handleConfirmReject = async (reason: string) => {
        if (!rejectModalQuote) return;
        const targetId = rejectModalQuote.rawId || rejectModalQuote.id;
        setActionLoading(targetId);
        try {
            await apiClient.post(`/customer/quotes/${targetId}/reject`, { reason });
            showToast("Quote rejected.", "info");
            window.dispatchEvent(new CustomEvent("carrierdirect_notif_update"));
            await fetchQuotes();
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.message || "Failed to reject quote.";
            showToast(msg, "error");
        } finally {
            setActionLoading(null);
            setRejectModalQuote(null);
        }
    };

    return {
        quotes,
        loading,
        isRefreshing,
        actionLoading,
        rejectModalQuote,
        setRejectModalQuote,
        fetchQuotes,
        handleAccept,
        handleConfirmReject,
    };
}
