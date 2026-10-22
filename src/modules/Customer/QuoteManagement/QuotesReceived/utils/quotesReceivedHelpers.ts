import { formatStandardAddress } from "@/utils/addressFormatter";
import { formatDisplayDate } from "@/lib/utils";
import { resolveQuoteDistance } from "@/utils/geoDistance";

export const normalizeQuoteItem = (n: any) => {
    const rawId = n.rawId || n.id || n.quote_id;
    const idFormatted = n.quote_id_formatted || (rawId ? (String(rawId).startsWith('QT-') ? rawId : `QT-${String(rawId).padStart(4, '0')}`) : 'QT-0000');
    const reqIdVal = n.quote_request_id || n.quote_request?.id || n.rawId;
    const reqId = n.request_id || (reqIdVal ? (String(reqIdVal).startsWith('REQ-') ? reqIdVal : `REQ-${String(reqIdVal).padStart(4, '0')}`) : 'REQ-0000');
    const reqTitle = n.request_title || n.quote_request?.request_title || reqId;
    const supplierName = n.supplier?.full_name || n.supplier?.name || n.supplier_full_name || n.sender_name || n.supplier_name || n.supplier?.company_name || n.carrier_name || n.company_name || n.customer || n.supplier || 'Supplier';
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

    const pickupLoc = formatStandardAddress(n, "pickup");
    const deliveryLoc = formatStandardAddress(n, "delivery");
    const distStr = resolveQuoteDistance({ ...n, ...(n.quote_request || {}), ...(n.quoteRequest || {}), origin: pickupLoc, destination: deliveryLoc }).distanceStr;
    const dateFormatted = formatDisplayDate(n.created_at || n.request_date || n.date || n.received_at || n.quote_request?.created_at);

    let statusLabel = n.status || 'Active';
    const statusRawLower = String(n.status_raw || n.status || '').toLowerCase();

    // Check if validity has passed
    const expiryField = n.valid_until || n.expires_at || n.expiry_date || n.validity_date || n.quote_request?.expires_at;
    const isDateExpired = expiryField ? (!isNaN(new Date(expiryField).getTime()) && new Date(expiryField).getTime() < Date.now()) : false;

    const orderStatusLower = String(n.order_status || n.orderStatus || n.order?.status || '').toLowerCase().trim();
    const isOrderCompleted = orderStatusLower === 'completed' || statusRawLower === 'completed';

    const isBooked = !isOrderCompleted && Boolean(
        statusRawLower === 'booked' ||
        statusRawLower === 'confirmed' ||
        statusRawLower === 'in_progress' ||
        String(statusLabel).toLowerCase().includes('book') ||
        n.is_paid ||
        n.has_order ||
        n.order_id ||
        (n.order && n.order.id)
    );

    if (isOrderCompleted) {
        statusLabel = 'Completed';
    } else if (isBooked) {
        statusLabel = 'Booked';
    } else if (statusRawLower === 'accepted' || String(statusLabel).toLowerCase().includes('accept')) {
        statusLabel = 'Accepted';
    } else if (statusRawLower === 'expired' || isDateExpired || String(statusLabel).toLowerCase().includes('expire')) {
        statusLabel = 'Expired';
    } else if (statusRawLower === 'rejected' || String(statusLabel).toLowerCase().includes('reject') || String(statusLabel).toLowerCase().includes('decline')) {
        statusLabel = 'Rejected';
    } else if (n.revision_status === 'pending') {
        statusLabel = 'Counter Received';
    } else if (statusRawLower === 'negotiating' || statusRawLower === 'negotiation' || n.is_negotiating || n.isNegotiating || n.has_negotiation_messages || n.hasNegotiationMessages) {
        statusLabel = 'Negotiating';
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
        rating: Number(n.rating ?? n.supplier_rating ?? n.supplier?.rating ?? 5.0),
        supplierRating: Number(n.rating ?? n.supplier_rating ?? n.supplier?.rating ?? 5.0),
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
        is_negotiating: Boolean(n.is_negotiating || statusRawLower === 'negotiating' || statusRawLower === 'negotiation' || n.has_negotiation_messages),
        isNegotiating: Boolean(n.is_negotiating || statusRawLower === 'negotiating' || statusRawLower === 'negotiation' || n.has_negotiation_messages),
        has_negotiation_messages: Boolean(n.has_negotiation_messages),
        hasNegotiationMessages: Boolean(n.has_negotiation_messages),
        unreadCount: typeof n.unread_count === 'number' ? Number(n.unread_count) : (n.is_read === false ? 1 : 0),
        palletType: n.pallet_type || '-',
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
        is_reviewed: Boolean(n.is_reviewed || n.reviewed_at || (typeof window !== "undefined" && localStorage.getItem("carrierdirect_quote_reviewed_" + rawId))),
        isReviewed: Boolean(n.is_reviewed || n.reviewed_at || (typeof window !== "undefined" && localStorage.getItem("carrierdirect_quote_reviewed_" + rawId))),
        reviewed_at: n.reviewed_at || null,
        reviewedAt: n.reviewed_at || null,
        raw: n,
    };
};


export const isQuoteReviewed = (item: any): boolean => {
    if (!item) return false;
    if (Array.isArray(item.quotes) && item.quotes.length > 0) {
        return item.quotes.some((q: any) => isQuoteReviewed(q));
    }
    const rawId = item.rawId || item.id || item.quote_id;
    const isLocal = typeof window !== "undefined" && Boolean(localStorage.getItem('carrierdirect_quote_reviewed_' + rawId));
    return Boolean(item.is_reviewed || item.isReviewed || item.reviewed_at || item.reviewedAt || isLocal);
};

export const isQuoteNew = (item: any): boolean => {
    if (!item) return false;
    if (Array.isArray(item.quotes) && item.quotes.length > 0) {
        return item.quotes.some((q: any) => !isQuoteReviewed(q));
    }
    return !isQuoteReviewed(item);
};

export const markQuoteAsReviewed = async (quoteId: number | string) => {
    if (!quoteId) return;
    const numId = String(quoteId).replace(/[^0-9]/g, "");
    const targetId = numId || quoteId;
    if (typeof window !== "undefined") {
        localStorage.setItem('carrierdirect_quote_reviewed_' + targetId, "true");
        window.dispatchEvent(new CustomEvent("carrierdirect_quote_reviewed", { detail: { quoteId: targetId } }));
    }
    try {
        const apiClient = (await import("@/lib/axios")).default;
        await apiClient.post(`/customer/quotes/${targetId}/review`);
    } catch (e) {
        // Safe silent fail
    }
};
