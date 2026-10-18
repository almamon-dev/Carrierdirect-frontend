import { CustomerChatItem, CustomerChatMessage } from '../../types';

export function calculateQuoteRates(msg: CustomerChatMessage, activeChat: CustomerChatItem | null) {
    const extraCharges = (activeChat?.extraCharges && activeChat.extraCharges.length > 0)
        ? activeChat.extraCharges
        : (activeChat?.raw?.extra_charges || activeChat?.raw?.extraCharges || []);
    const totalExtras = extraCharges.reduce((acc: number, c: any) => acc + Number(c.amount || 0), 0);
    const rawTotal = Number(msg.newTotal || activeChat?.currentPrice || activeChat?.raw?.amount || 0);
    const rawBase = activeChat?.baseFreightAmount ?? (
        activeChat?.raw?.base_amount_raw ??
        (activeChat?.raw?.base_amount ? parseFloat(String(activeChat.raw.base_amount).replace(/[^0-9.]/g, "")) : null)
    );

    let baseFreightRate = 0;
    let totalQuotationAmount = 0;

    if (totalExtras > 0) {
        if (rawBase !== null && rawBase > 0 && Math.abs(rawBase + totalExtras - rawTotal) < 0.01) {
            baseFreightRate = rawBase;
            totalQuotationAmount = rawTotal;
        } else if (rawTotal > totalExtras) {
            baseFreightRate = rawTotal - totalExtras;
            totalQuotationAmount = rawTotal;
        } else {
            baseFreightRate = Math.max(0, rawTotal - totalExtras);
            totalQuotationAmount = rawTotal;
        }
    } else {
        baseFreightRate = rawTotal;
        totalQuotationAmount = rawTotal;
    }

    return {
        extraCharges,
        totalExtras,
        baseFreightRate,
        totalQuotationAmount,
    };
}
