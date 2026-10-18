import apiClient from "@/lib/axios";
import { formatDisplayDate } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { NegotiationItem } from "../types";
import { resolveQuoteDistance } from "@/utils/geoDistance";

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
                res = await apiClient.get('/supplier/negotiations');
            } catch {
                res = await apiClient.get('/negotiations');
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
                    const idFormatted = n.quote_id_formatted || (n.id ? `QT-${String(n.id).padStart(4, '0')}` : `QT-0000`);
                    const reqId = n.request_id || (n.quote_request_id ? `REQ-${String(n.quote_request_id).padStart(4, '0')}` : 'REQ-0000');
                    const reqTitle = n.request_title || n.quote_request?.request_title || reqId;
                    const customerName = n.customer_name || n.client_name || n.customer?.name || n.customer?.company_name || n.sender_name || 'Shipper';
                    const avatarUrl = n.customer_avatar || n.profile_picture || n.customer?.profile_picture || '';

                    const rawExtraCharges = Array.isArray(n.extra_charges)
                        ? n.extra_charges.map((c: any) => ({
                            id: c.id,
                            type: c.type || c.custom_name || "Extra Service",
                            custom_name: c.custom_name || c.customName || c.type || "Extra Service",
                            label: c.type === "Custom" ? (c.custom_name || "Extra Service") : (c.type || "Extra Service"),
                            amount: Number(c.amount || 0)
                        })).filter((c: any) => c.amount > 0)
                        : (Array.isArray(n.extraCharges) ? n.extraCharges : []);
                    const totalExtras = rawExtraCharges.reduce((sum: number, c: any) => sum + (Number(c.amount) || 0), 0);
                    const origPrice = Number(n.amount_raw ?? n.amount ?? (n.base_amount_raw ? Number(n.base_amount_raw) + totalExtras : 0));
                    const currentPrice = Number(n.revised_amount_raw ?? n.revised_amount ?? origPrice);
                    const baseFreight = Number(n.base_amount_raw ?? (origPrice > totalExtras && totalExtras > 0 ? origPrice - totalExtras : origPrice));

                    const pickupLoc = n.origin || n.pickup_address || n.pickup || '-';
                    const deliveryLoc = n.destination || n.delivery_address || n.delivery || '-';
                    const distStr = resolveQuoteDistance({ ...n, ...(n.quote_request || {}), ...(n.quoteRequest || {}), origin: pickupLoc, destination: deliveryLoc }).distanceStr;
                    const dateFormatted = formatDisplayDate(n.created_at || n.request_date || n.date);

                    let statusLabel = n.status || 'Active';
                    const statusRawLower = String(n.status_raw || n.status || '').toLowerCase();

                    // Check if validity has passed
                    const expiryField = n.valid_until || n.expires_at || n.expiry_date || n.validity_date || n.quote_request?.expires_at;
                    const isDateExpired = expiryField ? (!isNaN(new Date(expiryField).getTime()) && new Date(expiryField).getTime() < Date.now()) : false;

                    const isCompleted = Boolean(
                        statusRawLower === 'completed' ||
                        String(n.status || '').toLowerCase() === 'completed' ||
                        n.order_status === 'completed' ||
                        n.is_completed === true ||
                        (n.order as any)?.status === 'completed' ||
                        n.pod_status === 'confirmed' ||
                        (n.order as any)?.pod_status === 'confirmed'
                    );

                    const ost = String(n.order_status || n.order?.status || '').toLowerCase();
                    const isOrderActive = ost && ['booked', 'confirmed', 'in_progress', 'completed', 'delivered', 'pod_accepted'].includes(ost) && !['cancelled', 'rejected'].includes(ost);

                    const isBooked = !isCompleted && Boolean(
                        statusRawLower === 'booked' ||
                        statusRawLower === 'confirmed' ||
                        (statusRawLower === 'accepted' && (n.is_paid || isOrderActive))
                    );

                    if (isCompleted) {
                        statusLabel = 'Completed';
                    } else if (isBooked) {
                        statusLabel = 'Booked';
                    } else if (statusRawLower === 'accepted' || String(statusLabel).toLowerCase().includes('accept')) {
                        statusLabel = 'Accepted';
                    } else if (statusRawLower === 'closed' || statusRawLower === 'rejected' || statusRawLower === 'expired' || statusRawLower === 'declined' || statusRawLower === 'cancelled' || isDateExpired) {
                        statusLabel = 'Closed';
                    } else if (n.revision_status === 'pending' || n.revised_amount || (statusRawLower.includes('counter') && !statusRawLower.includes('negotiat'))) {
                        statusLabel = 'Counter Received';
                    } else if (statusRawLower === 'negotiating' || statusRawLower === 'negotiation' || n.is_negotiating) {
                        statusLabel = 'Negotiating';
                    } else {
                        statusLabel = 'Open';
                    }

                    const isMyOffer = Boolean(n.is_my_offer ?? (n.current_offer_sender_id && n.current_offer_sender_id === (n.supplier_id || n.raw?.user_id)));
                    const hasPendingRevision = n.revision_status === 'pending' || Boolean(n.revisionStatus === 'pending');
                    const canAccept = Boolean(n.can_accept ?? (!isMyOffer && (statusRawLower === 'negotiating' || hasPendingRevision || statusRawLower === 'pending')));
                    const canCounter = Boolean(n.can_counter ?? (!isMyOffer && (statusRawLower === 'negotiating' || hasPendingRevision || statusRawLower === 'pending')));
                    const canDecline = Boolean(n.can_decline ?? (!isMyOffer && (statusRawLower === 'negotiating' || hasPendingRevision || statusRawLower === 'pending')));
                    const canWithdraw = Boolean(n.can_withdraw ?? (isMyOffer && hasPendingRevision));
                    const waitingForResponse = Boolean(n.waiting_for_response ?? (isMyOffer && hasPendingRevision));

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
                        distance: distStr && distStr !== '—' ? distStr : (n.distance || n.est_distance || '—'),
                        budget: `€ ${Number(origPrice || currentPrice).toLocaleString()}`,
                        originalAmount: origPrice,
                        currentOffer: currentPrice,
                        baseFreight: baseFreight,
                        extraCharges: rawExtraCharges,
                        totalExtras: totalExtras,
                        currency: "€",
                        priority: n.priority || (statusLabel === "Counter Received" ? "Urgent" : "Normal"),
                        lastUpdated: n.time_ago || "Recently",
                        requestDate: dateFormatted,
                        status: statusLabel,
                        statusRaw: isCompleted ? 'completed' : (isBooked ? 'booked' : (n.status_raw || 'pending')),
                        isCompleted: isCompleted,
                        isBooked: isBooked,
                        order_status: n.order_status || n.order?.status || '',
                        podStatus: n.pod_status || n.order?.pod_status || '',
                        pod_status: n.pod_status || n.order?.pod_status || '',
                        revisionStatus: n.revision_status || "none",
                        unreadCount: typeof n.unread_count === "number" ? Number(n.unread_count) : (n.is_read === false ? 1 : 0),
                        palletType: n.pallet_type || '-',
                        vehicleType: n.vehicle_type || "Curtainsider (13.6m)",
                        pickupDate: n.pickup_date,
                        deliveryDate: n.delivery_date,
                        notes: n.message_snippet || n.notes,
                        declineReason: n.decline_reason || n.declineReason,
                        isOnline: Boolean(n.is_online),
                        lastSeenHuman: n.last_seen_human || (n.is_online ? "Active now" : "Offline"),
                        lastSeenAt: n.last_seen_at,
                        isVerified: Boolean(n.is_verified ?? true),
                        can_accept: canAccept,
                        can_counter: canCounter,
                        can_decline: canDecline,
                        can_withdraw: canWithdraw,
                        is_my_offer: isMyOffer,
                        waiting_for_response: waitingForResponse,
                        hasOrder: Boolean(n.has_order || n.order || n.order_id),
                        isPaid: Boolean(n.is_paid || (n.order && n.order.status === 'in_progress') || (n.invoice && n.invoice.status === 'paid') || (n.invoice && n.invoice.invoice_type === 'pay_later')),
                        orderNumber: n.order_number || n.order?.order_number,
                        orderId: n.order_id || n.order?.id,
                        orderStatus: n.order_status || n.order?.status,
                        invoice: n.invoice || n.order?.invoice,
                        order: n.order,
                        raw: n,
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

export const SAMPLE_NEGOTIATIONS: NegotiationItem[] = [];
