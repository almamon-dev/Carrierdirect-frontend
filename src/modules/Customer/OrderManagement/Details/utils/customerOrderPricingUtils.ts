import { ExtraChargeItem, OrderPricingDetails } from '../types/orderDetail.types';

export interface PricingCalculationResult {
    totalAmount: number;
    extraChargesList: ExtraChargeItem[];
    extraTotalCalculated: number;
    platformFee: number;
    platformFeePercent: number;
    basePrice: number;
    advancePaid: number;
    dueBalance: number;
    pricing: OrderPricingDetails;
}

export function calculateOrderPricing(
    foundOrder: any,
    isPaid: boolean,
    isPayLater: boolean
): PricingCalculationResult {
    let extraChargesList: ExtraChargeItem[] = [];
    const rawExtraCharges = foundOrder?.extra_charges || foundOrder?.extraCharges || foundOrder?.quote?.extra_charges;
    if (Array.isArray(rawExtraCharges) && rawExtraCharges.length > 0) {
        extraChargesList = rawExtraCharges.map((ch: any, idx: number) => {
            const amount = Number(ch.amount ?? ch.price ?? 0);
            const name = ch.custom_name || ch.customName || ch.name || ch.title || ch.type || `Extra Service #${idx + 1}`;
            return {
                id: ch.id || idx,
                name: name,
                amount: amount,
                amountFormatted: `+€ ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            };
        });
    }

    const extraTotalCalculated = extraChargesList.reduce((acc, c) => acc + c.amount, 0);

    const rawPlatformFee = Number(
        foundOrder?.platform_fee ??
        foundOrder?.platformFee ??
        foundOrder?.platform_charge ??
        foundOrder?.platformCharge ??
        foundOrder?.quote?.platform_fee ??
        foundOrder?.quote?.platformFee ??
        foundOrder?.quote?.platform_charge ??
        foundOrder?.quote?.platformCharge ??
        0
    );

    const platformFeePercent = Number(
        foundOrder?.platform_charge_percent ??
        foundOrder?.platform_fee_percent ??
        foundOrder?.platformFeePercent ??
        foundOrder?.quote?.platform_fee_percent ??
        foundOrder?.quote?.platform_charge_percent ??
        0
    );

    const rawTotalFromPayload = Number(
        foundOrder?.total_amount_raw ??
        (foundOrder?.total_amount
            ? parseFloat(String(foundOrder.total_amount).replace(/[^0-9.]/g, ''))
            : 0)
    );

    // Determine base freight price (without extra charges or platform fee)
    const explicitBasePrice = Number(
        foundOrder?.base_price ??
        foundOrder?.base_amount ??
        foundOrder?.base_rate ??
        foundOrder?.base ??
        foundOrder?.quote?.base_amount ??
        foundOrder?.quote?.base_price ??
        0
    );

    const quoteSubtotal = Number(
        foundOrder?.subtotal ??
        foundOrder?.amount_raw ??
        foundOrder?.quote?.amount ??
        foundOrder?.quote?.quote_amount ??
        0
    );

    let basePrice = 0;
    if (explicitBasePrice > 0) {
        basePrice = explicitBasePrice;
    } else if (quoteSubtotal > 0) {
        basePrice = Math.max(0, quoteSubtotal - extraTotalCalculated);
    } else if (rawTotalFromPayload > 0) {
        basePrice = Math.max(0, rawTotalFromPayload - rawPlatformFee - extraTotalCalculated);
    } else {
        basePrice = 0;
    }

    const quoteAmount = (quoteSubtotal > 0 && explicitBasePrice <= 0)
        ? quoteSubtotal
        : (basePrice + extraTotalCalculated);

    let platformFee = rawPlatformFee;
    // If admin set 0% customer platform charge or target is not customer, do not force a platform fee
    if (platformFeePercent <= 0) {
        platformFee = 0;
    } else if (rawTotalFromPayload > 0 && rawTotalFromPayload <= quoteAmount) {
        // Customer was charged only the quote amount without platform fee
        platformFee = 0;
    } else if (platformFee <= 0 && rawTotalFromPayload > quoteAmount && platformFeePercent > 0) {
        platformFee = Math.round((rawTotalFromPayload - quoteAmount) * 100) / 100;
    } else if (platformFee <= 0 && platformFeePercent > 0 && quoteAmount > 0) {
        platformFee = Math.round((quoteAmount * (platformFeePercent / 100)) * 100) / 100;
    }

    const totalAmount = rawTotalFromPayload > 0 && rawTotalFromPayload >= (quoteAmount + platformFee)
        ? rawTotalFromPayload
        : (quoteAmount + platformFee);
    const effectivePercent = platformFee > 0 ? (platformFeePercent || (quoteAmount > 0 ? Math.round((platformFee / quoteAmount) * 100) : 0)) : 0;

    const advancePaid = isPaid ? totalAmount : isPayLater ? 0 : Math.round(totalAmount * 0.30);
    const dueBalance = isPaid ? 0 : isPayLater ? totalAmount : totalAmount - advancePaid;

    const pricing: OrderPricingDetails = {
        base: basePrice,
        extra: extraTotalCalculated,
        extraCharges: extraChargesList,
        platformFee: platformFee,
        platformFeeFormatted: `+€ ${platformFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        platformFeePercent: effectivePercent,
        quoteAmount: quoteAmount,
        quoteFormatted: `€ ${quoteAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        total: totalAmount,
        baseFormatted: `€ ${basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        extraFormatted: `€ ${extraTotalCalculated.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        totalFormatted: `€ ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        advancePaid: advancePaid,
        due: dueBalance,
        advanceFormatted: `€ ${advancePaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        dueFormatted: `€ ${dueBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    };

    return {
        totalAmount,
        extraChargesList,
        extraTotalCalculated,
        platformFee,
        platformFeePercent: effectivePercent,
        basePrice,
        advancePaid,
        dueBalance,
        pricing,
    };
}

export function calculatePayLaterDaysLeft(dueDateStr?: string): number {
    if (!dueDateStr) return 23;
    try {
        const due = new Date(dueDateStr);
        if (isNaN(due.getTime())) return 23;
        const now = new Date();
        const diffMs = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return Math.max(0, diffDays);
    } catch {
        return 23;
    }
}
