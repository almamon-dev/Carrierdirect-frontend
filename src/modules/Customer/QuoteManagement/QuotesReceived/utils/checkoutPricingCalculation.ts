import { resolveQuoteDistance } from "@/utils/geoDistance";

export const formatQuoteId = (idStr?: string | number): string => {
    if (!idStr) return "QT-0001";
    const str = String(idStr).trim();
    const cleanNum = str.replace(/[^0-9]/g, "");
    return cleanNum ? `QT-${cleanNum.padStart(4, "0")}` : str;
};

export const formatReqId = (idStr?: string | number): string => {
    if (!idStr) return "REQ-0001";
    const str = String(idStr).trim();
    const cleanNum = str.replace(/[^0-9]/g, "");
    return cleanNum ? `REQ-${cleanNum.padStart(4, "0")}` : str;
};

export const parseAmount = (val: any): number => {
    if (val === null || val === undefined) return 0;
    if (typeof val === "number") return isNaN(val) ? 0 : val;
    const str = String(val).replace(/[^0-9.-]/g, "").trim();
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
};

export const extractCharges = (rawQuote: any, stateQuote: any, req: any): Array<{ type: string; custom_name: string; amount: number }> => {
    let source =
        rawQuote?.extra_charges ??
        rawQuote?.extraCharges ??
        rawQuote?.extra_fees ??
        rawQuote?.extraFeeItems ??
        rawQuote?.surcharges ??
        rawQuote?.pricing?.extra_charges ??
        rawQuote?.pricing?.extraCharges ??
        stateQuote?.extra_charges ??
        stateQuote?.extraCharges ??
        req?.extra_charges ??
        [];

    if (typeof source === "string") {
        try {
            source = JSON.parse(source);
        } catch {
            source = [];
        }
    }
    if (!Array.isArray(source)) source = [];

    return source
        .map((item: any) => {
            const type = item?.type || item?.custom_name || item?.customName || item?.name || "Extra Service";
            const custom_name = item?.custom_name || item?.customName || item?.name || item?.type || "Extra Charge";
            const amount = parseAmount(item?.amount ?? item?.price ?? item?.fee);
            return { type, custom_name, amount };
        })
        .filter((item: any) => item.amount > 0);
};

export const computeCheckoutQuoteDetails = (rawQuote: any, stateQuote: any, req: any, cleanQuoteId: string) => {
    const supplierName =
        rawQuote?.supplier?.company_name ||
        rawQuote?.supplier_name ||
        rawQuote?.carrier ||
        rawQuote?.supplier?.name ||
        rawQuote?.name ||
        "Carrier Direct Partner";

    const supplierRating =
        rawQuote?.supplier?.rating
            ? `${rawQuote.supplier.rating} ★`
            : rawQuote?.rating
                ? `${rawQuote.rating} ★`
                : "5.0 ★";

    const extraCharges = extractCharges(rawQuote, stateQuote, req);
    const extraTotal = extraCharges.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

    const platformFee = parseAmount(
        rawQuote?.platform_fee ??
        rawQuote?.platformFee ??
        rawQuote?.platform_charge ??
        rawQuote?.platformCharge ??
        rawQuote?.pricing?.platform_fee ??
        rawQuote?.pricing?.platformFee ??
        rawQuote?.pricing?.platform_charge ??
        stateQuote?.platform_fee ??
        stateQuote?.platformFee
    );

    const platformFeePercent = Number(
        rawQuote?.platform_charge_percent ??
        rawQuote?.platform_fee_percent ??
        rawQuote?.platformFeePercent ??
        0
    );

    const totalRaw = parseAmount(
        rawQuote?.totalAmount ??
        rawQuote?.total_amount ??
        rawQuote?.amount_raw ??
        rawQuote?.amount ??
        rawQuote?.revised_amount_raw ??
        rawQuote?.revised_amount ??
        rawQuote?.proposed_amount ??
        rawQuote?.newTotal ??
        (rawQuote as any)?.currentPrice ??
        stateQuote?.amount_raw ??
        stateQuote?.amount
    );

    const rawBase = parseAmount(
        rawQuote?.baseFreightAmount ??
        rawQuote?.base_amount_raw ??
        rawQuote?.base_amount ??
        rawQuote?.baseFreight ??
        rawQuote?.basePrice ??
        rawQuote?.base_price ??
        stateQuote?.baseFreightAmount ??
        stateQuote?.base_amount_raw
    );

    let baseFreightAmount = 0;
    let totalAmount = 0;

    if (totalRaw > 0) {
        totalAmount = totalRaw;
        const totalDeductions = extraTotal + platformFee;
        if (totalDeductions > 0 && totalRaw > totalDeductions) {
            baseFreightAmount = totalRaw - totalDeductions;
        } else if (rawBase > 0) {
            baseFreightAmount = rawBase;
        } else if (extraTotal > 0 && totalRaw > extraTotal) {
            baseFreightAmount = totalRaw - extraTotal;
        } else {
            baseFreightAmount = totalRaw;
        }
    } else if (rawBase > 0) {
        baseFreightAmount = rawBase;
        totalAmount = rawBase + extraTotal + platformFee;
    } else {
        baseFreightAmount = 0;
        totalAmount = extraTotal + platformFee;
    }

    const insuranceAmount = parseAmount(rawQuote?.insuranceAmount ?? rawQuote?.insurance_amount ?? rawQuote?.pricing?.insurance);
    const loadingUnloadingAmount = parseAmount(rawQuote?.loadingUnloadingAmount ?? rawQuote?.loading_unloading_amount ?? rawQuote?.pricing?.loadingUnloading);
    const discountAmount = parseAmount(rawQuote?.discount_amount ?? rawQuote?.discount);

    if (discountAmount > 0) {
        totalAmount = Math.max(0, totalAmount - discountAmount);
    }

    const distanceRes = resolveQuoteDistance({
        ...(req || {}),
        ...(rawQuote || {}),
        pickup_address: rawQuote?.pickup_address || req?.pickup_address || rawQuote?.origin_city || req?.pickup_city,
        delivery_address: rawQuote?.delivery_address || req?.delivery_address || rawQuote?.destination_city || req?.delivery_city,
        pickup_city: rawQuote?.origin_city || req?.pickup_city,
        delivery_city: rawQuote?.destination_city || req?.delivery_city,
        pickup_lat: rawQuote?.pickup_lat || req?.pickup_lat || rawQuote?.pickupLat || req?.pickupLat,
        pickup_lng: rawQuote?.pickup_lng || req?.pickup_lng || rawQuote?.pickupLng || req?.pickupLng,
        delivery_lat: rawQuote?.delivery_lat || req?.delivery_lat || rawQuote?.deliveryLat || req?.deliveryLat,
        delivery_lng: rawQuote?.delivery_lng || req?.delivery_lng || rawQuote?.deliveryLng || req?.deliveryLng,
        distance_km: rawQuote?.distance_km || req?.distance_km,
        distance: rawQuote?.distance || req?.distance,
    });

    return {
        quote: {
            id: formatQuoteId(rawQuote?.quote_id || rawQuote?.id || cleanQuoteId),
            requestId: formatReqId(rawQuote?.request_id || rawQuote?.quote_request_id || req?.id),
            supplier: supplierName,
            rating: supplierRating,
            pickupCity: rawQuote?.origin_city || req?.pickup_city || rawQuote?.pickup_address || rawQuote?.pickupCity || rawQuote?.pickup?.city || "Origin Port",
            deliveryCity: rawQuote?.destination_city || req?.delivery_city || rawQuote?.delivery_address || rawQuote?.deliveryCity || rawQuote?.delivery?.city || "Destination Port",
            pickupAddress: rawQuote?.pickup_address || req?.pickup_address || req?.pickup || rawQuote?.pickupCity || "Dhaka, Bangladesh",
            deliveryAddress: rawQuote?.delivery_address || req?.delivery_address || req?.delivery || rawQuote?.deliveryCity || "Chittagong, Bangladesh",
            pickupDate: rawQuote?.pickup_date || req?.pickup_date || "As scheduled",
            deliveryDate: rawQuote?.delivery_date || req?.delivery_date || rawQuote?.estimated_delivery || "Standard Delivery",
            vehicleType: rawQuote?.vehicle || rawQuote?.vehicle_type || req?.vehicle_type || "Covered Van (Standard)",
            palletType: rawQuote?.pallet_type || req?.pallet_type || req?.type_of_pallets || '-',
            weight: rawQuote?.cargo?.weight || rawQuote?.weight || req?.weight || req?.total_weight || "Standard Load (500 KG)",
            distance: distanceRes?.distanceStr && distanceRes.distanceStr !== "—" ? distanceRes.distanceStr : (rawQuote?.distance || (rawQuote?.distance_km ? `${rawQuote.distance_km} km` : (req?.distance || (req?.distance_km ? `${req.distance_km} km` : "—")))),
            transitTime: rawQuote?.transit_time || rawQuote?.estimated_time || req?.transit_time || "1 - 2 Business Days",
            handlingServices: rawQuote?.handling_services || req?.handling_services || ["Tail-lift assistance", "GPS Live Tracking", "Loading Support"],
            notes: rawQuote?.notes || req?.additional_notes || req?.notes || rawQuote?.special_instructions || "Direct dock-to-dock transport with carrier direct escrow verification.",
            baseFreightAmount,
            extraCharges,
            extraTotal,
            platformFee,
            platformFeePercent,
            insuranceAmount,
            loadingUnloadingAmount,
            discountAmount,
            totalAmount,
        },
        discountAmount,
    };
};
