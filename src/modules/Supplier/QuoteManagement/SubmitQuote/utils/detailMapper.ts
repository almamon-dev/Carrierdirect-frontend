import { QuoteRequest } from '../../data/quoteRequestsData';
import { resolveSupplierQuoteStatus } from '../../utils/requestStatusTracker';

export function mapSubmitQuoteDetail(raw: any, cleanId: string): { requestDetails: QuoteRequest; apiData: Record<string, any> } {
    const d = raw.quote_details || {};
    const apiData = { ...d, id: raw.id, quote_submitted: raw.quote_submitted };

    const computedStatus = resolveSupplierQuoteStatus({
        id: raw.id || cleanId,
        rawId: raw.id || cleanId,
        status: raw.status || d.status,
        quote_submitted: raw.quote_submitted || raw.is_quoted,
        is_booked: raw.is_booked,
    });
    
    const rawItems = Array.isArray(d.items) ? d.items : (Array.isArray(raw.items) ? raw.items : []);
    
    const weightVal = d.total_weight || d.weight || raw.weight || (d.weight_kg ? `${d.weight_kg} kg` : null);
    let formattedWeight = weightVal ? (String(weightVal).includes('kg') ? String(weightVal) : `${weightVal} kg`) : '—';
    if ((!weightVal || formattedWeight === '—') && rawItems.length > 0) {
        const totalKg = rawItems.reduce((acc: number, item: any) => acc + ((Number(item.weight) || 0) * (Number(item.quantity) || 1)), 0);
        if (totalKg > 0) formattedWeight = `${totalKg.toLocaleString()} kg`;
    }

    let volumeVal = d.total_volume || d.volume || raw.volume || (d.volume_cbm ? `${d.volume_cbm} m³` : null);
    if ((!volumeVal || volumeVal === '—') && rawItems.length > 0) {
        const totalCbm = rawItems.reduce((acc: number, item: any) => {
            const l = Number(item.length) || 0;
            const w = Number(item.width) || 0;
            const h = Number(item.height) || 0;
            const q = Number(item.quantity) || 1;
            return (l && w && h) ? acc + ((l * w * h * q) / 1000000) : acc;
        }, 0);
        if (totalCbm > 0) volumeVal = `${totalCbm.toFixed(2)} m³`;
    }
    const formattedVolume = volumeVal && volumeVal !== '—'
        ? (String(volumeVal).includes('m³') || String(volumeVal).includes('CBM') || String(volumeVal).includes('cm') ? String(volumeVal) : `${volumeVal} m³`)
        : '—';

    const itemsCountSummary = d.items_summary || raw.items_summary || (rawItems.length > 0 ? `${rawItems.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 1), 0)} Items` : '—');

    const requestDetails: QuoteRequest = {
        id: `REQ-${raw.id || cleanId}`,
        slug: String(raw.id || cleanId),
        status: computedStatus,
        customer: d.client_name || d.customer_name || raw.customer?.name || raw.user?.name || raw.customer_name || 'Verified Shipper',
        customerAvatar: raw.customer?.profile_picture || raw.user?.avatar || raw.user?.avatar_url || '',
        customerPhone: d.client_phone || raw.customer?.phone || raw.user?.phone || '',
        customerRating: Number(d.client_rating || raw.customer?.rating || raw.user?.rating || 4.9),
        customerOrdersCount: d.client_orders_count ?? raw.customer?.orders_count ?? raw.user?.orders_count ?? 1,
        requestDate: d.request_created_at || d.requested_date || raw.requested_date || raw.created_at || '',
        pickup: d.origin || d.pickup || raw.pickup || '—',
        pickupFullAddress: d.origin_full_address || d.origin || d.pickup_address || raw.pickup_address || '',
        pickupTimeWindow: d.pickup_time_from && d.pickup_time_till ? `${d.pickup_time_from} – ${d.pickup_time_till}` : (raw.pickup_time_window || ''),
        delivery: d.destination || d.delivery || raw.delivery || '—',
        deliveryFullAddress: d.destination_full_address || d.destination || d.delivery_address || raw.delivery_address || '',
        deliveryTimeWindow: d.delivery_time_from && d.delivery_time_till ? `${d.delivery_time_from} – ${d.delivery_time_till}` : (raw.delivery_time_window || ''),
        distance: d.distance_miles ? `${d.distance_miles} km` : (d.est_distance ? `${d.est_distance} km` : (d.distance || raw.distance ? `${d.distance || raw.distance} km` : '—')),
        pickupDate: d.pickup_date || raw.pickup_date || '',
        deliveryDate: d.delivery_date || raw.delivery_date || '',
        weight: formattedWeight,
        volume: formattedVolume,
        notes: d.additional_notes || raw.notes || '',
        budget: d.budget ? (String(d.budget).includes('€') ? String(d.budget) : `€${d.budget}`) : (raw.budget ? (String(raw.budget).includes('€') ? String(raw.budget) : `€${raw.budget}`) : 'Open / Flexible'),
        vehicleType: d.vehicle_type || d.vehicleType || raw.vehicle_type || raw.vehicleType || '—',
        loadType: d.pallet_type || d.load_type || d.loadType || raw.load_type || '—',
        itemsCount: itemsCountSummary,
        dimensions: rawItems.map((item: any, i: number) => ({
            id: item.id ?? i + 1,
            length: item.length != null ? String(item.length) : '—',
            width:  item.width  != null ? String(item.width)  : '—',
            height: item.height != null ? String(item.height) : '—',
            qty:    String(item.quantity ?? '—'),
            unit:   'CM',
        })),
        cargoItems: rawItems.map((item: any, i: number) => ({
            id: item.id ?? i + 1,
            name: item.item_type || 'Item',
            category: item.item_type || '—',
            qty: String(item.quantity ?? '—'),
            weight: item.weight != null ? `${item.weight} kg` : '—',
            dimensions: (item.length && item.width && item.height) ? `${item.length} × ${item.width} × ${item.height} cm` : '—',
        })),
        documents: [
            ...(d.attachment_url   ? [{ id: 1, name: 'Attachment',   size: '', type: 'PDF', url: d.attachment_url  }] : []),
            ...(d.packing_list_url ? [{ id: 2, name: 'Packing List', size: '', type: 'PDF', url: d.packing_list_url }] : []),
            ...(d.invoice_url      ? [{ id: 3, name: 'Invoice',      size: '', type: 'PDF', url: d.invoice_url      }] : []),
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
        pickupInstructions: d.pickup_instructions || '',
        deliveryInstructions: d.delivery_instructions || '',
    } as unknown as QuoteRequest;

    return { requestDetails, apiData };
}
