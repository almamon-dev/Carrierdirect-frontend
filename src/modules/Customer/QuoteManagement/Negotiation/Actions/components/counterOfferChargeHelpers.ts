import { ExtraChargeItem, DEFAULT_FALLBACK_CHARGES, getServiceIcon } from './counterOfferModalConstants';
import { Plus, ReceiptText, Fuel, FileText } from 'lucide-react';

export function buildMergedAvailableCharges(allServices: any[]) {
    if (!allServices || allServices.length === 0) {
        return DEFAULT_FALLBACK_CHARGES;
    }

    const baseSurcharges = [
        { type: 'Toll', label: 'Toll Charges', defaultAmount: 60, icon: ReceiptText, aliases: ['toll', 'toll fee', 'toll charges', 'tolls'] },
        { type: 'Fuel Surcharge', label: 'Fuel Surcharge', defaultAmount: 50, icon: Fuel, aliases: ['fuel', 'fuel surcharge', 'diesel'] },
        { type: 'Customs Clearance', label: 'Customs Clearance', defaultAmount: 75, icon: FileText, aliases: ['customs', 'customs clearance', 'customs fee', 'customs declaration'] },
    ];

    const dbList = allServices.map(s => ({
        type: s.label,
        label: s.label,
        defaultAmount: 50,
        icon: getServiceIcon(s.key || s.label),
        aliases: [
            s.key.toLowerCase(),
            s.label.toLowerCase(),
            s.key.replace(/_/g, ' ').toLowerCase(),
            s.key.replace(/_/g, '/').toLowerCase(),
        ]
    }));

    const merged = [...baseSurcharges];
    dbList.forEach(item => {
        if (!merged.some(m => m.label.toLowerCase() === item.label.toLowerCase())) {
            merged.push(item);
        }
    });

    merged.push({
        type: 'Custom',
        label: 'Custom Service / Fee',
        defaultAmount: 50,
        icon: Plus,
        aliases: ['custom', 'other']
    });

    return merged;
}

export function isChargeActive(chargeDef: any, supplierExtras: ExtraChargeItem[]): boolean {
    return supplierExtras.some(e => {
        const eType = (e.type || '').toLowerCase().trim();
        const eName = (e.customName || '').toLowerCase().trim();
        const targetType = chargeDef.type.toLowerCase().trim();
        const targetLabel = chargeDef.label.toLowerCase().trim();
        return (
            eType === targetType ||
            eName === targetLabel ||
            eType === targetLabel ||
            eName === targetType ||
            chargeDef.aliases.some((a: string) => a === eType || a === eName || eType.includes(a) || eName.includes(a))
        );
    });
}

export function getChargeMeta(extra: ExtraChargeItem, availableCharges: any[]) {
    const match = availableCharges.find(c => {
        const eType = (extra.type || '').toLowerCase().trim();
        const eName = (extra.customName || '').toLowerCase().trim();
        return (
            eType === c.type.toLowerCase().trim() ||
            eName === c.label.toLowerCase().trim() ||
            c.aliases.some((a: string) => a === eType || a === eName || eType.includes(a) || eName.includes(a))
        );
    });
    return match || {
        type: extra.type || 'Custom',
        label: extra.customName || extra.type || 'Custom Charge',
        defaultAmount: 50,
        icon: getServiceIcon(extra.customName || extra.type),
        aliases: []
    };
}

export function toggleCommonCharge(prev: ExtraChargeItem[], chargeDef: any): ExtraChargeItem[] {
    const active = isChargeActive(chargeDef, prev);

    if (active) {
        return prev.filter(e => {
            const eType = (e.type || '').toLowerCase().trim();
            const eName = (e.customName || '').toLowerCase().trim();
            const targetType = chargeDef.type.toLowerCase().trim();
            const targetLabel = chargeDef.label.toLowerCase().trim();
            const match = (
                eType === targetType ||
                eName === targetLabel ||
                eType === targetLabel ||
                eName === targetType ||
                chargeDef.aliases.some((a: string) => a === eType || a === eName || eType.includes(a) || eName.includes(a))
            );
            return !match;
        });
    }

    return [
        ...prev,
        { type: chargeDef.type, customName: chargeDef.label, amount: chargeDef.defaultAmount }
    ];
}

export function formatCounterOfferNote(
    notes: string,
    isSupplier: boolean,
    supplierExtras: ExtraChargeItem[],
    currency: string,
    proposedPrice: string
): string {
    let formattedNote = notes.trim();
    if (isSupplier && supplierExtras.length > 0) {
        const breakdownStr = supplierExtras
            .map(e => `${e.customName || e.type}: ${currency} ${Number(e.amount).toLocaleString()}`)
            .join(', ');
        formattedNote = formattedNote
            ? `${formattedNote} [Extras: ${breakdownStr}]`
            : `Base: ${currency} ${Number(proposedPrice).toLocaleString()} + Extras: ${breakdownStr}`;
    }
    return formattedNote;
}
