import { resolveQuoteDistance } from "@/utils/geoDistance";
import { QuoteRequest } from "../../data/quoteRequestsData";
import { resolveSupplierQuoteStatus } from "../../utils/requestStatusTracker";


export function formatTime12h(timeStr?: string | null): string {
    if (!timeStr) return "";
    const clean = String(timeStr).trim();
    if (!clean || clean === "—" || clean === "-") return "";

    if (/^\d{1,2}:\d{2}\s*(?:AM|PM)$/i.test(clean)) {
        return clean.toUpperCase();
    }

    const match = clean.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
    if (match) {
        let hour = parseInt(match[1], 10);
        const minute = match[2];
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12;
        if (hour === 0) hour = 12;
        const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
        return `${hourStr}:${minute} ${ampm}`;
    }

    return clean;
}


export function formatDeliveryTime(timeFrom?: string | null, timeTill?: string | null, fallback?: string | null, singleTime?: string | null): string {
    const from12 = formatTime12h(timeFrom);
    const till12 = formatTime12h(timeTill);
    const single12 = formatTime12h(singleTime);

    if (single12) return single12;
    if (till12) return till12;
    if (from12) return from12;
    if (fallback) {
        const cleanWin = String(fallback).trim();
        if (cleanWin.includes("–") || cleanWin.includes("-") || cleanWin.toLowerCase().includes(" to ")) {
            const parts = cleanWin.split(/–|-|\bto\b/i);
            if (parts.length === 2) {
                const p2 = formatTime12h(parts[1].trim());
                if (p2) return p2;
            }
        }
        return formatTime12h(cleanWin);
    }
    return "";
}

export function formatTimeSlotWindow(timeFrom?: string | null, timeTill?: string | null, fallbackWindow?: string | null, singleTime?: string | null): string {
    const from12 = formatTime12h(timeFrom);
    const till12 = formatTime12h(timeTill);

    if (from12 && till12 && from12 !== till12) {
        return `${from12} – ${till12}`;
    }
    if (from12) return from12;
    if (till12) return till12;
    if (singleTime) return formatTime12h(singleTime);
    if (fallbackWindow) {
        const cleanWin = String(fallbackWindow).trim();
        if (cleanWin.includes("–") || cleanWin.includes("-") || cleanWin.toLowerCase().includes(" to ")) {
            const parts = cleanWin.split(/–|-|\bto\b/i);
            if (parts.length === 2) {
                const p1 = formatTime12h(parts[0].trim());
                const p2 = formatTime12h(parts[1].trim());
                if (p1 && p2 && p1 !== p2) return `${p1} – ${p2}`;
                if (p1) return p1;
            }
        }
        return formatTime12h(cleanWin);
    }
    return "";
}

export function mapSubmitQuoteDetail(raw: any, cleanId: string): { requestDetails: QuoteRequest; apiData: Record<string, any> } {
    const d = raw.quote_details || {};
    const apiData = { ...d, id: raw.id, quote_submitted: raw.quote_submitted };

    const isWon = Boolean(
        raw.is_won ||
        raw.status === "Won" ||
        raw.supplier_status === "Won" ||
        raw.quote_submitted?.status === "accepted" ||
        raw.quote_submitted?.status === "won" ||
        (raw.status === "completed" && raw.quote_submitted)
    );

    const isExpired = !isWon && Boolean(
        raw.is_expired ||
        raw.status === "Expired" ||
        raw.supplier_status === "Expired"
    );

    const computedStatus = isWon ? "Won" : resolveSupplierQuoteStatus({
        id: raw.id || cleanId,
        rawId: raw.id || cleanId,
        status: raw.status || d.status,
        supplier_status: raw.supplier_status || d.supplier_status,
        quote_submitted: Boolean(raw.quote_submitted || raw.is_quoted),
        is_booked: Boolean(raw.is_booked || isWon),
        is_won: isWon,
        is_expired: isExpired,
    });

    const rawItems = Array.isArray(d.items) ? d.items : (Array.isArray(raw.items) ? raw.items : []);

    const weightVal = d.total_weight || d.weight || raw.weight || (d.weight_kg ? `${d.weight_kg} kg` : null);
    const isWeightZero = !weightVal || weightVal === 0 || weightVal === "0" || weightVal === "0 kg" || weightVal === "0.00" || weightVal === "0.00 kg";

    let formattedWeight = !isWeightZero ? (String(weightVal).includes("kg") ? String(weightVal) : `${weightVal} kg`) : "—";
    if ((!weightVal || formattedWeight === "—" || isWeightZero) && rawItems.length > 0) {
        const totalKg = rawItems.reduce((acc: number, item: any) => acc + ((Number(item.weight) || 0) * (Number(item.quantity) || 1)), 0);
        if (totalKg > 0) formattedWeight = `${totalKg.toLocaleString()} kg`;
    }

    let volumeVal = d.total_volume || d.volume || raw.volume || (d.volume_cbm ? `${d.volume_cbm} m³` : null);
    const isVolumeZero = !volumeVal || volumeVal === 0 || volumeVal === "0" || volumeVal === "0.00" || volumeVal === "—";
    if (isVolumeZero && rawItems.length > 0) {
        const totalCbm = rawItems.reduce((acc: number, item: any) => {
            const l = Number(item.length) || 0;
            const w = Number(item.width) || 0;
            const h = Number(item.height) || 0;
            const q = Number(item.quantity) || 1;
            return (l && w && h) ? acc + ((l * w * h * q) / 1000000) : acc;
        }, 0);
        if (totalCbm > 0) volumeVal = `${totalCbm.toFixed(2)} m³`;
    }
    const formattedVolume = (volumeVal && !["—", 0, "0", "0.00", "0 m³", "0.00 m³"].includes(volumeVal))
        ? (String(volumeVal).includes("m³") || String(volumeVal).includes("CBM") || String(volumeVal).includes("cm") ? String(volumeVal) : `${volumeVal} m³`)
        : "—";

    // Clean items_summary if it contains raw dimension units like "2 CM"
    let rawSummary = d.items_summary || raw.items_summary || "";
    if (rawSummary) {
        rawSummary = rawSummary.replace(/\b(cm|mm|m|in|inch|inches|ft|feet)\b/gi, "Items").trim();
    }
    const totalQty = rawItems.length > 0 ? rawItems.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0) : (raw.items_count || d.items_count || 0);
    const itemsCountSummary = (rawSummary && !["—", "0 Items", "0 Item", "0"].includes(rawSummary))
        ? rawSummary
        : (totalQty > 0 ? `${totalQty} ${totalQty === 1 ? "Item" : "Items"}` : "—");

    // Fix Load Type: Prevent dimension units (CM, cm, etc.) from appearing as load type
    const invalidLoadUnits = ["cm", "m", "mm", "in", "inch", "inches", "ft", "feet", "n/a", "—", "-", "null", "undefined"];
    let resolvedLoadType = d.load_type || raw.load_type || d.loadType || raw.loadType;
    if (!resolvedLoadType || invalidLoadUnits.includes(String(resolvedLoadType).toLowerCase().trim())) {
        if (d.pallet_type && !invalidLoadUnits.includes(String(d.pallet_type).toLowerCase().trim())) {
            resolvedLoadType = d.pallet_type;
        } else if (d.type_of_pallets && !invalidLoadUnits.includes(String(d.type_of_pallets).toLowerCase().trim())) {
            resolvedLoadType = d.type_of_pallets;
        } else {
            resolvedLoadType = "Standard Cargo";
        }
    }

    const requestDetails: QuoteRequest = {
        id: `REQ-${raw.id || cleanId}`,
        slug: String(raw.id || cleanId),
        status: computedStatus,
        is_won: isWon,
        is_expired: isExpired,
        quote_submitted: raw.quote_submitted,
        customer: d.client_name || d.customer_name || raw.customer?.name || raw.user?.name || raw.customer_name || "Verified Shipper",
        customerAvatar: d.client_avatar || d.customer_avatar || raw.customer_avatar || raw.customerAvatar || raw.customer?.avatar || raw.customer?.profile_picture || raw.user?.avatar || raw.user?.avatar_url || "",
        customerPhone: d.client_phone || raw.customer?.phone || raw.user?.phone || "",
        customerRating: Number(d.client_rating || raw.customer?.rating || raw.user?.rating || 4.9),
        customerOrdersCount: d.client_orders_count ?? raw.customer?.orders_count ?? raw.user?.orders_count ?? 1,
        requestDate: d.request_created_at || d.requested_date || raw.requested_date || raw.created_at || "",
        pickup: d.origin || d.pickup || raw.pickup || "—",
        pickupFullAddress: d.origin_full_address || d.origin || d.pickup_address || raw.pickup_address || "",
        pickupTimeWindow: formatTimeSlotWindow(d.pickup_time_from, d.pickup_time_till, raw.pickup_time_window, raw.pickup_time || d.pickup_time),
        delivery: d.destination || d.delivery || raw.delivery || "—",
        deliveryFullAddress: d.destination_full_address || d.destination || d.delivery_address || raw.delivery_address || "",
        deliveryTimeWindow: formatDeliveryTime(d.delivery_time_from, d.delivery_time_till, raw.delivery_time_window || raw.delivery_time || d.delivery_time, d.delivery_time || raw.delivery_time || d.delivery_time_till),
        distance: resolveQuoteDistance({ ...raw, ...d }).distanceStr,
        pickupDate: d.pickup_date || raw.pickup_date || "",
        deliveryDate: d.delivery_date || raw.delivery_date || "",
        weight: formattedWeight,
        volume: formattedVolume,
        notes: d.additional_notes || raw.notes || "",
        budget: d.budget ? (String(d.budget).includes("€") ? String(d.budget) : `€${d.budget}`) : (raw.budget ? (String(raw.budget).includes("€") ? String(raw.budget) : `€${raw.budget}`) : "Open / Flexible"),
        vehicleType: d.vehicle_type || d.vehicleType || raw.vehicle_type || raw.vehicleType || "—",
        loadType: resolvedLoadType,
        itemsCount: itemsCountSummary,
        dimensions: rawItems.map((item: any, i: number) => ({
            id: item.id ?? i + 1,
            length: item.length != null ? String(item.length) : "—",
            width: item.width != null ? String(item.width) : "—",
            height: item.height != null ? String(item.height) : "—",
            qty: String(item.quantity ?? "—"),
            unit: item.unit || "cm",
        })),
        cargoItems: rawItems.map((item: any, i: number) => {
            const rawItemType = item.item_type && !invalidLoadUnits.includes(String(item.item_type).toLowerCase().trim()) ? item.item_type : "Package";
            return {
                id: item.id ?? i + 1,
                name: rawItemType,
                category: rawItemType,
                qty: String(item.quantity ?? "—"),
                weight: (item.weight != null && Number(item.weight) > 0) ? `${item.weight} kg` : "—",
                dimensions: (item.length && item.width && item.height) ? `${item.length} × ${item.width} × ${item.height} cm` : "—",
            };
        }),
        documents: [
            ...(d.attachment_url ? [{ id: 1, name: "Attachment", size: "", type: "PDF", url: d.attachment_url }] : []),
            ...(d.packing_list_url ? [{ id: 2, name: "Packing List", size: "", type: "PDF", url: d.packing_list_url }] : []),
            ...(d.invoice_url ? [{ id: 3, name: "Invoice", size: "", type: "PDF", url: d.invoice_url }] : []),
        ],
        stackable: !!d.stackable,
        fragile: !!d.fragile,
        hazardous: !!d.hazardous,
        tempControlled: !!d.temp_controlled,
        oversized: !!d.oversized,
        perishable: !!d.perishable,
        loadingRequired: !!d.loading_required,
        unloadingRequired: !!d.unloading_required,
        packaging: !!d.packaging,
        insurance: !!d.insurance,
        liftGate: !!d.lift_gate,
        whiteGlove: !!d.white_glove,
        assembly: !!d.assembly,
        insideDelivery: !!d.inside_delivery,
        storage: !!d.storage,
        pickupInstructions: d.pickup_instructions || "",
        deliveryInstructions: d.delivery_instructions || "",
    } as unknown as QuoteRequest;

    return { requestDetails, apiData };
}
