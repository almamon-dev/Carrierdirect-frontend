import { resolveQuoteDistance } from "@/utils/geoDistance";
import { QuoteRequest } from "../../data/quoteRequestsData";
import { resolveSupplierQuoteStatus } from "../../utils/requestStatusTracker";


import { formatTime12h, formatDeliveryTime, formatTimeSlotWindow } from './timeFormatters';
export { formatTime12h, formatDeliveryTime, formatTimeSlotWindow };

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

    const rawVolume = d.total_volume ?? d.volume ?? d.volume_cbm ?? raw.total_volume ?? raw.volume ?? raw.volume_cbm ?? null;
    const volNum = (rawVolume !== null && rawVolume !== undefined && rawVolume !== "" && rawVolume !== "—")
        ? parseFloat(String(rawVolume).replace(/[^0-9.]/g, ""))
        : NaN;
    let formattedVolume = (!isNaN(volNum) && volNum > 0)
        ? (String(rawVolume).includes("m³") ? String(rawVolume) : `${volNum.toFixed(2)} m³`)
        : "—";

    if (formattedVolume === "—" && rawItems.length > 0) {
        const totalCbm = rawItems.reduce((acc: number, item: any) => {
            const l = Number(item.length) || 0;
            const w = Number(item.width) || 0;
            const h = Number(item.height) || 0;
            const q = Number(item.quantity) || 1;
            if (l > 0 && w > 0 && h > 0) {
                return acc + ((l * w * h * q) / 1000000);
            }
            return acc;
        }, 0);
        if (totalCbm > 0) {
            formattedVolume = `${totalCbm.toFixed(2)} m³`;
        }
    }

    const rawPallets = d.pallets_count ?? raw.pallets_count ?? raw.palletsCount ?? d.palletsCount;
    const formattedPallets = (rawPallets !== null && rawPallets !== undefined && rawPallets !== '' && rawPallets !== '—')
        ? (String(rawPallets).includes('Pallet') ? String(rawPallets) : `${rawPallets} Pallets`)
        : '—';

    const rawItemsCount = d.items_count ?? raw.items_count ?? raw.itemsCount ?? d.itemsCount;
    const formattedItemsCount = (rawItemsCount !== null && rawItemsCount !== undefined && rawItemsCount !== '' && rawItemsCount !== '—')
        ? (String(rawItemsCount).includes('Item') ? String(rawItemsCount) : `${rawItemsCount} Items`)
        : '—';

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
        is_paid: Boolean(raw.is_paid || raw.quote_submitted?.is_paid),
        is_awaiting_payment: Boolean(raw.is_awaiting_payment || raw.quote_submitted?.is_awaiting_payment),
        payment_status: raw.payment_status || raw.quote_submitted?.payment_status || 'Pending',
        quote_submitted: raw.quote_submitted,
        order: raw.order || raw.quote_submitted?.order || null,
        customer: d.client_name || d.customer_name || raw.customer?.name || raw.user?.name || raw.customer_name || '-',
        customerAvatar: d.client_avatar || d.customer_avatar || raw.customer_avatar || raw.customerAvatar || raw.customer?.avatar || raw.customer?.profile_picture || raw.user?.avatar || raw.user?.avatar_url || "",
        customerPhone: d.client_phone || raw.customer?.phone || raw.user?.phone || "",
        customerRating: Number(d.client_rating ?? raw.customer?.rating ?? raw.user?.rating ?? 5.0),
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
        itemsCount: formattedItemsCount,
        palletsCount: formattedPallets,
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
