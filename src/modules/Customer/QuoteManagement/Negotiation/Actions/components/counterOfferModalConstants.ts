import {
    ReceiptText,
    Fuel,
    FileText,
    PackageCheck,
    ShieldCheck,
    Truck,
    AlertTriangle,
    Warehouse,
    DoorOpen,
    Sparkles,
    Package,
    Layers,
    Wine,
    Thermometer,
    Maximize2,
    Clock,
    Wrench,
    Boxes,
    Plus,
    LucideIcon
} from 'lucide-react';

export interface ExtraChargeItem {
    id?: string | number;
    type: string;
    customName?: string;
    amount: number;
}

export interface CounterOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number, note: string, extraCharges?: ExtraChargeItem[], baseFreight?: number) => void;
    initialAmount?: number | string;
    initialBaseFreight?: number | string;
    originalOfferAmount?: number | string;
    targetBudget?: number | string;
    carrierName?: string;
    currency?: string;
    isSupplier?: boolean;
    extraCharges?: any[];
}

export const getServiceIcon = (keyOrLabel: string): LucideIcon => {
    const k = (keyOrLabel || '').toLowerCase().trim();
    if (k.includes('toll')) return ReceiptText;
    if (k.includes('fuel') || k.includes('diesel')) return Fuel;
    if (k.includes('customs') || k.includes('declaration')) return FileText;
    if (k.includes('loading') || k.includes('unloading')) return PackageCheck;
    if (k.includes('insurance') || k.includes('transit')) return ShieldCheck;
    if (k.includes('lift') || k.includes('tail-lift') || k.includes('tail lift') || k.includes('gate')) return Truck;
    if (k.includes('hazard') || k.includes('adr') || k.includes('dangerous')) return AlertTriangle;
    if (k.includes('storage') || k.includes('warehouse')) return Warehouse;
    if (k.includes('inside') || k.includes('indoor')) return DoorOpen;
    if (k.includes('white glove')) return Sparkles;
    if (k.includes('packag') || k.includes('pallet')) return Package;
    if (k.includes('assembly') || k.includes('installation')) return Wrench;
    if (k.includes('stack')) return Layers;
    if (k.includes('fragile') || k.includes('glass')) return Wine;
    if (k.includes('temp') || k.includes('reefer') || k.includes('cold') || k.includes('chill') || k.includes('frozen')) return Thermometer;
    if (k.includes('oversize') || k.includes('heavy') || k.includes('dimension')) return Maximize2;
    if (k.includes('perish') || k.includes('express') || k.includes('urgent')) return Clock;
    if (k.includes('custom') || k.includes('other')) return Plus;
    return Boxes;
};

export const DEFAULT_FALLBACK_CHARGES = [
    { type: 'Toll', label: 'Toll Charges', defaultAmount: 60, icon: ReceiptText, aliases: ['toll', 'toll fee', 'toll charges', 'tolls'] },
    { type: 'Fuel Surcharge', label: 'Fuel Surcharge', defaultAmount: 50, icon: Fuel, aliases: ['fuel', 'fuel surcharge', 'diesel'] },
    { type: 'Loading Required', label: 'Loading / Unloading', defaultAmount: 80, icon: PackageCheck, aliases: ['loading/unloading', 'loading', 'loading & unloading', 'unloading', 'loading required', 'unloading required'] },
    { type: 'Cargo Insurance', label: 'Cargo Insurance', defaultAmount: 40, icon: ShieldCheck, aliases: ['insurance', 'cargo insurance', 'transit insurance'] },
    { type: 'Lift Gate Needed', label: 'Tail-lift / Liftgate', defaultAmount: 50, icon: Truck, aliases: ['lift gate', 'liftgate', 'tail-lift', 'tail lift', 'tail-lift vehicle', 'lift gate needed'] },
    { type: 'Hazardous Material (ADR)', label: 'Hazardous Material (ADR)', defaultAmount: 90, icon: AlertTriangle, aliases: ['hazardous', 'hazardous material', 'adr', 'hazardous handling'] },
    { type: 'Storage Facility', label: 'Storage Fee', defaultAmount: 45, icon: Warehouse, aliases: ['storage', 'storage fee', 'storage facility'] },
    { type: 'Customs Clearance', label: 'Customs Clearance', defaultAmount: 75, icon: FileText, aliases: ['customs', 'customs clearance', 'customs fee', 'customs declaration'] },
    { type: 'Inside Delivery', label: 'Inside Delivery', defaultAmount: 35, icon: DoorOpen, aliases: ['inside delivery', 'white glove', 'white glove service'] },
    { type: 'Packaging Required', label: 'Packaging / Palletizing', defaultAmount: 30, icon: Package, aliases: ['packaging', 'packaging required', 'palletizing'] },
    { type: 'Custom', label: 'Custom Service / Fee', defaultAmount: 50, icon: Plus, aliases: ['custom', 'other'] },
];
