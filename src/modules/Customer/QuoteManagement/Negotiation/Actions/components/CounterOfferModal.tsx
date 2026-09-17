import React, { useState, useEffect, useMemo } from 'react';
import {
    ArrowRight,
    Plus,
    Trash2,
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
    LucideIcon
} from 'lucide-react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import { useCargoServices } from '@/hooks/useCargoServices';

export interface ExtraChargeItem {
    id?: string | number;
    type: string;
    customName?: string;
    amount: number;
}

export interface CounterOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number, note: string, extraCharges?: ExtraChargeItem[]) => void;
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

const DEFAULT_FALLBACK_CHARGES = [
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

export function CounterOfferModal({
    isOpen,
    onClose,
    onSubmit,
    initialAmount,
    initialBaseFreight,
    originalOfferAmount,
    targetBudget,
    carrierName,
    currency = '€',
    isSupplier = false,
    extraCharges: propExtraCharges = [],
}: CounterOfferModalProps) {
    const { allServices } = useCargoServices();

    // Dynamically build available charges from Database with Lucide React Icons
    const availableCharges = useMemo(() => {
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
    }, [allServices]);

    const origTotalNum = useMemo(() => {
        const raw = originalOfferAmount ?? initialAmount;
        if (!raw) return 0;
        return typeof raw === 'number' ? raw : parseFloat(String(raw).replace(/[^0-9.]/g, '')) || 0;
    }, [originalOfferAmount, initialAmount]);

    const origBaseNum = useMemo(() => {
        if (initialBaseFreight) {
            return typeof initialBaseFreight === 'number' ? initialBaseFreight : parseFloat(String(initialBaseFreight).replace(/[^0-9.]/g, '')) || 0;
        }
        return origTotalNum;
    }, [initialBaseFreight, origTotalNum]);

    const budgetNum = useMemo(() => {
        if (!targetBudget) return 0;
        return typeof targetBudget === 'number' ? targetBudget : parseFloat(String(targetBudget).replace(/[^0-9.]/g, '')) || 0;
    }, [targetBudget]);

    // Customer mode: 'lump_sum' vs 'itemized'
    const [customerMode, setCustomerMode] = useState<'lump_sum' | 'itemized'>('lump_sum');
    const [baseFreightInput, setBaseFreightInput] = useState<string>('');
    const [lumpSumInput, setLumpSumInput] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    // Supplier mode: Extra charges state
    const [supplierExtras, setSupplierExtras] = useState<ExtraChargeItem[]>([]);
    const [customChargeName, setCustomChargeName] = useState('');
    const [customChargeAmount, setCustomChargeAmount] = useState('');
    const [showAddCustom, setShowAddCustom] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const initialExtras: ExtraChargeItem[] = (propExtraCharges && propExtraCharges.length > 0)
                ? propExtraCharges.map(c => ({
                    id: c.id,
                    type: c.type || c.label || c.name || c.customName || c.custom_name || 'Custom',
                    customName: c.customName || c.custom_name || c.label || c.title || c.type,
                    amount: Number(c.amount || 0)
                }))
                : [];

            setSupplierExtras(initialExtras);
            const totalExistingExtras = initialExtras.reduce((acc, c) => acc + Number(c.amount || 0), 0);

            if (isSupplier) {
                const baseVal = origBaseNum > 0 && origBaseNum !== origTotalNum
                    ? origBaseNum
                    : (origTotalNum > totalExistingExtras && totalExistingExtras > 0 ? origTotalNum - totalExistingExtras : origTotalNum);
                setBaseFreightInput(baseVal > 0 ? String(baseVal) : '');
            } else {
                setLumpSumInput(origTotalNum > 0 ? String(origTotalNum) : '');
                setBaseFreightInput(origBaseNum > 0 ? String(origBaseNum) : '');
            }
            setNotes('');
            setShowAddCustom(false);
            setCustomChargeName('');
            setCustomChargeAmount('');
        }
    }, [isOpen, propExtraCharges, origTotalNum, origBaseNum, isSupplier]);

    const totalExtrasAmount = useMemo(() => {
        return supplierExtras.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    }, [supplierExtras]);

    const supplierBaseNum = Number(baseFreightInput) || 0;
    const supplierTotalQuotation = supplierBaseNum + totalExtrasAmount;

    const customerProposedTotal = useMemo(() => {
        if (customerMode === 'lump_sum') {
            return Number(lumpSumInput) || 0;
        } else {
            return (Number(baseFreightInput) || 0) + totalExtrasAmount;
        }
    }, [customerMode, lumpSumInput, baseFreightInput, totalExtrasAmount]);

    const finalProposedAmount = isSupplier ? supplierTotalQuotation : customerProposedTotal;

    const isChargeActive = (chargeDef: typeof availableCharges[0]) => {
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
                chargeDef.aliases.some(a => a === eType || a === eName || eType.includes(a) || eName.includes(a))
            );
        });
    };

    // Active types list for Dropdown highlighting
    const activeTypesForSelect = useMemo(() => {
        return availableCharges
            .filter(c => isChargeActive(c))
            .map(c => c.type);
    }, [availableCharges, supplierExtras]);

    // Select options prepared with icons
    const selectOptions = useMemo(() => {
        return availableCharges.map(item => ({
            id: item.type,
            value: item.type,
            name: item.label,
            label: item.label,
            icon: item.icon || getServiceIcon(item.label || item.type),
        }));
    }, [availableCharges]);

    const getChargeMeta = (extra: ExtraChargeItem) => {
        const match = availableCharges.find(c => {
            const eType = (extra.type || '').toLowerCase().trim();
            const eName = (extra.customName || '').toLowerCase().trim();
            return (
                eType === c.type.toLowerCase().trim() ||
                eName === c.label.toLowerCase().trim() ||
                c.aliases.some(a => a === eType || a === eName || eType.includes(a) || eName.includes(a))
            );
        });
        return match || {
            type: extra.type || 'Custom',
            label: extra.customName || extra.type || 'Custom Charge',
            defaultAmount: 50,
            icon: getServiceIcon(extra.customName || extra.type),
            aliases: []
        };
    };

    const handleToggleCommonCharge = (chargeDef: typeof availableCharges[0]) => {
        setSupplierExtras(prev => {
            const active = prev.some(e => {
                const eType = (e.type || '').toLowerCase().trim();
                const eName = (e.customName || '').toLowerCase().trim();
                const targetType = chargeDef.type.toLowerCase().trim();
                const targetLabel = chargeDef.label.toLowerCase().trim();
                return (
                    eType === targetType ||
                    eName === targetLabel ||
                    eType === targetLabel ||
                    eName === targetType ||
                    chargeDef.aliases.some(a => a === eType || a === eName || eType.includes(a) || eName.includes(a))
                );
            });

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
                        chargeDef.aliases.some(a => a === eType || a === eName || eType.includes(a) || eName.includes(a))
                    );
                    return !match;
                });
            } else {
                return [
                    ...prev,
                    { type: chargeDef.type, customName: chargeDef.label, amount: chargeDef.defaultAmount }
                ];
            }
        });
    };

    const handleSelectDropdownService = (selectedVal: any) => {
        let valStr = '';
        if (Array.isArray(selectedVal?.value)) {
            const lastItem = selectedVal.value[selectedVal.value.length - 1];
            valStr = String(lastItem || '');
        } else if (typeof selectedVal === 'object') {
            valStr = selectedVal?.target?.value || selectedVal?.value || '';
        } else {
            valStr = String(selectedVal || '');
        }
        
        if (!valStr) return;

        if (valStr === 'Custom') {
            setShowAddCustom(true);
            return;
        }

        const match = availableCharges.find(c => c.type === valStr || c.label === valStr);
        if (match) {
            handleToggleCommonCharge(match);
        }
    };

    const handleUpdateExtraAmount = (index: number, newAmount: string) => {
        const val = parseFloat(newAmount);
        setSupplierExtras(prev => prev.map((e, idx) => (idx === index) ? { ...e, amount: isNaN(val) ? 0 : val } : e));
    };

    const handleRemoveExtra = (index: number) => {
        setSupplierExtras(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleAddCustomCharge = () => {
        if (!customChargeName.trim() || !customChargeAmount) return;
        const amt = parseFloat(customChargeAmount) || 0;
        setSupplierExtras(prev => [
            ...prev,
            { type: `Custom-${Date.now()}`, customName: customChargeName.trim(), amount: amt }
        ]);
        setCustomChargeName('');
        setCustomChargeAmount('');
        setShowAddCustom(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (finalProposedAmount <= 0) return;

        let formattedNote = notes.trim();
        if (isSupplier && supplierExtras.length > 0) {
            const breakdownStr = supplierExtras
                .map(e => `${e.customName || e.type}: ${currency} ${Number(e.amount).toLocaleString()}`)
                .join(', ');
            formattedNote = formattedNote
                ? `${formattedNote} [Extras: ${breakdownStr}]`
                : `Base: ${currency} ${supplierBaseNum.toLocaleString()} + Extras: ${breakdownStr}`;
        } else if (!isSupplier && customerMode === 'lump_sum') {
            formattedNote = formattedNote
                ? `${formattedNote} (All-Inclusive Rate)`
                : `All-inclusive rate of ${currency} ${customerProposedTotal.toLocaleString()}`;
        }

        onSubmit(finalProposedAmount, formattedNote, isSupplier ? supplierExtras : undefined);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isSupplier ? 'Revise Offer Rate' : 'Submit Counter Offer'}
            description={
                isSupplier
                    ? 'Propose updated freight rate and additional services'
                    : 'Propose a revised rate to negotiate'
            }
            size="xl"
            className="max-w-[620px] md:max-w-[650px]"
        >
            <form onSubmit={handleSubmit} className="space-y-3 font-sans pt-0.5">
                {/* Overview Strip */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-lg p-2 text-xs">
                    <div>
                        <span className="text-slate-400 block text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Base Rate</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                            {currency} {origBaseNum > 0 ? origBaseNum.toLocaleString() : origTotalNum.toLocaleString()}
                        </span>
                    </div>

                    <div className="text-center border-x border-slate-200/80 dark:border-slate-700/80 px-1">
                        <span className="text-slate-400 block text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">Current Total</span>
                        <span className="font-black text-[#FF4A1F] text-xs sm:text-sm">
                            {currency} {origTotalNum > 0 ? origTotalNum.toLocaleString() : '0.00'}
                        </span>
                    </div>

                    <div className="text-right">
                        <span className="text-slate-400 block text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                            {budgetNum > 0 ? 'Customer Budget' : 'Pricing Model'}
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                            {budgetNum > 0 ? `${currency} ${budgetNum.toLocaleString()}` : 'Fixed Rate'}
                        </span>
                    </div>
                </div>

                {/* CUSTOMER MODE */}
                {!isSupplier && (
                    <div className="space-y-2.5">
                        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg text-xs font-semibold">
                            <button
                                type="button"
                                onClick={() => setCustomerMode('lump_sum')}
                                className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    customerMode === 'lump_sum'
                                        ? 'bg-white dark:bg-[#12161c] text-[#FF4A1F] shadow-xs font-bold'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                <span>All-Inclusive Total</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setCustomerMode('itemized')}
                                className={`flex-1 py-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    customerMode === 'itemized'
                                        ? 'bg-white dark:bg-[#12161c] text-[#FF4A1F] shadow-xs font-bold'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                <ReceiptText size={12} />
                                <span>Itemized Base</span>
                            </button>
                        </div>

                        {customerMode === 'lump_sum' ? (
                            <Input
                                label={`Proposed Total Rate (${currency}) *`}
                                type="number"
                                min="1"
                                step="any"
                                required
                                value={lumpSumInput}
                                onChange={e => setLumpSumInput(e.target.value)}
                                placeholder="0.00"
                                icon={<span className="text-slate-400 font-bold text-xs">€</span>}
                                className="font-bold text-sm"
                                autoFocus
                            />
                        ) : (
                            <div className="space-y-2">
                                <Input
                                    label={`Proposed Base Freight (${currency}) *`}
                                    type="number"
                                    min="1"
                                    step="any"
                                    required
                                    value={baseFreightInput}
                                    onChange={e => setBaseFreightInput(e.target.value)}
                                    placeholder="0.00"
                                    icon={<span className="text-slate-400 font-bold text-xs">€</span>}
                                    className="font-bold text-sm"
                                    autoFocus
                                />
                                {totalExtrasAmount > 0 && (
                                    <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                                        <span>Retained Extra Fees:</span>
                                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                                            +{currency} {totalExtrasAmount.toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* SUPPLIER MODE: Base Rate + Extra Charges & Services */}
                {isSupplier && (
                    <div className="space-y-2.5">
                        {/* Standard Base Price using UI Input */}
                        <Input
                            label={`Base Freight Price (${currency}) *`}
                            type="number"
                            min="1"
                            step="any"
                            required
                            value={baseFreightInput}
                            onChange={e => setBaseFreightInput(e.target.value)}
                            placeholder="0.00"
                            icon={<span className="text-slate-400 font-bold text-xs">€</span>}
                            className="font-bold text-sm"
                            autoFocus
                        />

                        {/* Extra Fees Section */}
                        <div className="space-y-2 pt-0.5 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    Additional Services & Fees
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    Select from dropdown to add/toggle
                                </span>
                            </div>

                            {/* Dropdown Selector using UI Select with React Icons */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 min-w-0">
                                    <Select
                                        value={activeTypesForSelect}
                                        multiple={true}
                                        onChange={handleSelectDropdownService}
                                        placeholder="Select / Add Additional Services..."
                                        options={selectOptions}
                                        showSearch={false}
                                        size="sm"
                                        className="text-xs !h-[34px] rounded-md"
                                    />
                                </div>

                                {!showAddCustom && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAddCustom(true)}
                                        className="h-[34px] px-2.5 rounded-md text-[11.5px] font-semibold flex items-center gap-1 border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:border-slate-400 bg-slate-50 dark:bg-slate-800 cursor-pointer shrink-0"
                                    >
                                        <Plus size={11} />
                                        <span>Custom Fee</span>
                                    </button>
                                )}
                            </div>

                            {/* Custom Fee Adder Row */}
                            {showAddCustom && (
                                <div className="flex items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/80 rounded-md border border-slate-200 dark:border-slate-700 animate-in fade-in-0 duration-150">
                                    <div className="flex-1 min-w-0">
                                        <Input
                                            placeholder="Service Name (e.g. Weekend Delivery)"
                                            value={customChargeName}
                                            onChange={e => setCustomChargeName(e.target.value)}
                                            className="!h-[32px] text-xs"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="w-24 shrink-0">
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={customChargeAmount}
                                            onChange={e => setCustomChargeAmount(e.target.value)}
                                            icon={<span className="text-slate-400 font-bold text-[11px]">€</span>}
                                            className="!h-[32px] text-right font-bold text-xs"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddCustomCharge}
                                        className="h-[32px] px-3 rounded-md bg-[#FF4A1F] text-white text-xs font-bold hover:bg-[#E03E15] cursor-pointer shrink-0"
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddCustom(false)}
                                        className="h-[32px] px-1.5 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            {/* Active Extra Charges: Compact 2-Column Grid with Lucide React Icons */}
                            {supplierExtras.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5 max-h-[160px] overflow-y-auto custom-scrollbar pr-0.5">
                                    {supplierExtras.map((extra, idx) => {
                                        const meta = getChargeMeta(extra);
                                        const ChargeIcon = meta.icon || getServiceIcon(extra.customName || extra.type);
                                        return (
                                            <div
                                                key={extra.id ? `extra-${extra.id}` : `extra-${extra.type}-${idx}`}
                                                className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/90 text-xs shadow-2xs"
                                            >
                                                <div className="flex items-center gap-1.5 truncate flex-1 min-w-0" title={meta.label}>
                                                    <ChargeIcon size={13} className="text-[#FF4A1F] shrink-0" />
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11.5px] truncate">
                                                        {meta.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <div className="w-24">
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="any"
                                                            value={extra.amount || ''}
                                                            onChange={e => handleUpdateExtraAmount(idx, e.target.value)}
                                                            icon={<span className="text-slate-400 font-bold text-[10.5px]">€</span>}
                                                            className="!h-[30px] text-right font-bold text-xs"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExtra(idx)}
                                                        className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors cursor-pointer shrink-0"
                                                        title="Remove charge"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Ultra-Compact & Clean Payment Breakdown */}
                <div className="rounded-lg bg-slate-50/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 p-2 text-xs">
                    <div className="flex items-center justify-between text-[11px] pb-1 border-b border-slate-200/60 dark:border-slate-700/60">
                        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 text-xs">
                            <ReceiptText size={11} className="text-[#FF4A1F]" /> Payment Breakdown
                        </span>
                        <span className="text-[10px] text-slate-400">Currency: {currency}</span>
                    </div>

                    <div className="py-1 space-y-0.5 text-[11px]">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                            <span>Base Freight Rate</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                {currency} {isSupplier 
                                    ? supplierBaseNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    : (customerMode === 'lump_sum' 
                                        ? customerProposedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : (Number(baseFreightInput) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    )
                                }
                            </span>
                        </div>

                        {((isSupplier && supplierExtras.length > 0) || (!isSupplier && customerMode === 'itemized' && totalExtrasAmount > 0)) && (
                            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                <span>Additional Services ({isSupplier ? supplierExtras.length : 'retained'} items)</span>
                                <span className="font-semibold text-[#FF4A1F]">
                                    +{currency} {totalExtrasAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Compact Total Row */}
                    <div className="pt-1.5 border-t border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between bg-orange-50/70 dark:bg-orange-950/35 -mx-2 -mb-2 px-2.5 py-1.5 rounded-b-lg">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                            {isSupplier ? 'Total Offer Amount' : 'Total Proposed Rate'}
                        </span>
                        <span className="text-sm sm:text-base font-black text-[#FF4A1F]">
                            {currency} {finalProposedAmount > 0 ? finalProposedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                        </span>
                    </div>
                </div>

                {/* Notes & Terms Section using UI Textarea */}
                <Textarea
                    label="Notes or Conditions (Optional)"
                    rows={2}
                    placeholder={
                        isSupplier
                            ? 'e.g. Valid for 48 hours, includes priority delivery...'
                            : 'e.g. Ready to confirm load immediately at this rate...'
                    }
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="min-h-[55px] text-xs resize-none"
                />

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="!h-8 px-4 rounded-md text-xs font-semibold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={finalProposedAmount <= 0}
                        className="!h-8 px-4 rounded-md text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 bg-[#FF4A1F] hover:bg-[#E03E15] text-white shadow-2xs transition-all cursor-pointer"
                    >
                        <span>{isSupplier ? 'Submit Offer' : 'Send Counter'}</span>
                        {finalProposedAmount > 0 && (
                            <span className="font-semibold opacity-95">
                                ({currency} {finalProposedAmount.toLocaleString()})
                            </span>
                        )}
                        <ArrowRight size={13} />
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default CounterOfferModal;
