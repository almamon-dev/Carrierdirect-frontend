import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    ArrowRightLeft,
    ReceiptText,
    Plus,
    Trash2,
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
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
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

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

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

    const initialExtrasSum = useMemo(() => {
        return (propExtraCharges && propExtraCharges.length > 0)
            ? propExtraCharges.reduce((sum, c) => sum + (Number(c.amount) || 0), 0)
            : 0;
    }, [propExtraCharges]);

    const origBaseNum = useMemo(() => {
        if (initialBaseFreight !== undefined && initialBaseFreight !== null) {
            const parsed = typeof initialBaseFreight === 'number' ? initialBaseFreight : parseFloat(String(initialBaseFreight).replace(/[^0-9.]/g, '')) || 0;
            if (parsed > 0 && initialExtrasSum > 0 && parsed < origTotalNum) {
                return parsed;
            }
            if (parsed > 0 && initialExtrasSum === 0) {
                return parsed;
            }
        }
        if (initialExtrasSum > 0 && origTotalNum > initialExtrasSum) {
            return origTotalNum - initialExtrasSum;
        }
        return origTotalNum;
    }, [initialBaseFreight, origTotalNum, initialExtrasSum]);

    const [proposedPrice, setProposedPrice] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    // Supplier mode: Extra charges state
    const [supplierExtras, setSupplierExtras] = useState<ExtraChargeItem[]>([]);
    const [showAddCustom, setShowAddCustom] = useState(false);
    const [customChargeName, setCustomChargeName] = useState('');
    const [customChargeAmount, setCustomChargeAmount] = useState('');

    const prevIsOpenRef = useRef(false);

    useEffect(() => {
        // Only initialize form values when modal transitions from closed to open
        if (isOpen && !prevIsOpenRef.current) {
            const initialExtras: ExtraChargeItem[] = (propExtraCharges && propExtraCharges.length > 0)
                ? propExtraCharges.map(c => ({
                    id: c.id,
                    type: c.type || c.label || c.name || c.customName || c.custom_name || 'Custom',
                    customName: c.customName || c.custom_name || c.label || c.title || c.type,
                    amount: Number(c.amount || 0)
                }))
                : [];

            setSupplierExtras(initialExtras);
            const initialPrice = isSupplier ? origBaseNum : origTotalNum;
            setProposedPrice(initialPrice > 0 ? String(initialPrice) : '');
            setNotes('');
            setShowAddCustom(false);
            setCustomChargeName('');
            setCustomChargeAmount('');
        }
        prevIsOpenRef.current = isOpen;
    }, [isOpen, propExtraCharges, origTotalNum, origBaseNum, isSupplier]);

    const totalExtrasAmount = useMemo(() => {
        return supplierExtras.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    }, [supplierExtras]);

    const finalAmountNum = isSupplier
        ? (Number(proposedPrice) || 0) + totalExtrasAmount
        : (Number(proposedPrice) || 0);

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

    const activeTypesForSelect = useMemo(() => {
        return availableCharges
            .filter(c => isChargeActive(c))
            .map(c => c.type);
    }, [availableCharges, supplierExtras]);

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
        if (finalAmountNum <= 0) return;

        let formattedNote = notes.trim();
        if (isSupplier && supplierExtras.length > 0) {
            const breakdownStr = supplierExtras
                .map(e => `${e.customName || e.type}: ${currency} ${Number(e.amount).toLocaleString()}`)
                .join(', ');
            formattedNote = formattedNote
                ? `${formattedNote} [Extras: ${breakdownStr}]`
                : `Base: ${currency} ${Number(proposedPrice).toLocaleString()} + Extras: ${breakdownStr}`;
        }

        const proposedBase = isSupplier
            ? (Number(proposedPrice) || 0)
            : (totalExtrasAmount > 0 && finalAmountNum > totalExtrasAmount ? finalAmountNum - totalExtrasAmount : finalAmountNum);
        onSubmit(finalAmountNum, formattedNote, supplierExtras, proposedBase);
        onClose();
    };

    if (!isOpen) return null;

    const displayCarrier = carrierName || 'Partner Carrier';

    return createPortal(
        <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-[410px] z-[999999] font-sans antialiased animate-in slide-in-from-top-5 fade-in duration-200">
            {/* Sleek & Compact Modal Card with rounded-md & subtle border shadow */}
            <div className="relative w-full bg-white dark:bg-[#12161c] rounded-md border border-slate-200/90 dark:border-slate-700/80 shadow-xl p-3 sm:p-3.5 text-left space-y-2.5">
                
                {/* Top Section: Icon + Description + Close Button */}
                <div className="flex items-start gap-2.5">
                    {/* Outline Circular Icon */}
                    <div className="w-8 h-8 min-w-[32px] min-h-[32px] aspect-square rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5 bg-slate-50 dark:bg-slate-800">
                        <ArrowRightLeft size={14} strokeWidth={2.2} className="text-[#ff4a1f] shrink-0" />
                    </div>

                    {/* Main Description Text */}
                    <div className="flex-1 min-w-0 pr-1">
                        <p className="text-[11.5px] sm:text-[12px] text-slate-700 dark:text-slate-300 leading-snug font-normal">
                            {isSupplier ? (
                                <>
                                    Propose a revised offer to <strong className="font-bold text-slate-900 dark:text-white">{displayCarrier}</strong> (Current: <strong className="font-semibold text-slate-900 dark:text-white">{currency} {origTotalNum.toLocaleString()}</strong>).
                                </>
                            ) : (
                                <>
                                    Submit a counter offer to <strong className="font-bold text-slate-900 dark:text-white">{displayCarrier}</strong> for quote <strong className="font-semibold text-slate-900 dark:text-white">{currency} {origTotalNum.toLocaleString()}</strong>.
                                </>
                            )}
                        </p>
                    </div>

                    {/* Top Right Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-0.5 transition-colors shrink-0 -mr-1 -mt-1 cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={14} strokeWidth={2} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="space-y-2">
                    {/* Proposed Amount Input */}
                    <div>
                        <Input
                            label={isSupplier ? `Base Freight Rate (${currency}) *` : `Proposed Counter Rate (${currency}) *`}
                            type="number"
                            min="1"
                            step="any"
                            required
                            value={proposedPrice}
                            onChange={e => setProposedPrice(e.target.value)}
                            placeholder="0.00"
                            icon={<span className="text-slate-400 font-bold text-xs">{currency}</span>}
                            className="!h-[32px] text-xs font-bold"
                            autoFocus
                        />
                    </div>

                    {/* Supplier Mode: Extra Charges */}
                    {isSupplier && (
                        <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                    Additional Services
                                </span>
                                {!showAddCustom && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAddCustom(true)}
                                        className="text-[10.5px] font-semibold text-[#ff4a1f] hover:underline cursor-pointer flex items-center gap-0.5"
                                    >
                                        <Plus size={11} />
                                        <span>Add Custom</span>
                                    </button>
                                )}
                            </div>

                            <Select
                                value={activeTypesForSelect}
                                multiple={true}
                                onChange={handleSelectDropdownService}
                                placeholder="Select additional services..."
                                options={selectOptions}
                                showSearch={false}
                                size="sm"
                                className="text-[11px] !h-[30px] rounded"
                            />

                            {showAddCustom && (
                                <div className="flex items-center gap-1 p-1.5 bg-slate-50 dark:bg-slate-800/80 rounded border border-slate-200 dark:border-slate-700">
                                    <input
                                        type="text"
                                        placeholder="Service Name"
                                        value={customChargeName}
                                        onChange={e => setCustomChargeName(e.target.value)}
                                        className="flex-1 min-w-0 h-[26px] px-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px]"
                                        autoFocus
                                    />
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={customChargeAmount}
                                        onChange={e => setCustomChargeAmount(e.target.value)}
                                        className="w-16 h-[26px] px-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-[11px] font-bold text-right"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCustomCharge}
                                        className="h-[26px] px-2 rounded bg-[#ff4a1f] text-white text-[10.5px] font-bold hover:bg-[#e03e15] cursor-pointer shrink-0"
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddCustom(false)}
                                        className="h-[26px] px-1 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                            {supplierExtras.length > 0 && (
                                <div className="space-y-1 pt-0.5 max-h-[100px] overflow-y-auto custom-scrollbar">
                                    {supplierExtras.map((extra, idx) => {
                                        const meta = getChargeMeta(extra);
                                        const ChargeIcon = meta.icon || getServiceIcon(extra.customName || extra.type);
                                        return (
                                            <div
                                                key={extra.id ? `extra-${extra.id}` : `extra-${extra.type}-${idx}`}
                                                className="flex items-center justify-between gap-1.5 px-2 py-1 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px]"
                                            >
                                                <div className="flex items-center gap-1.5 truncate flex-1 min-w-0" title={meta.label}>
                                                    <ChargeIcon size={12} className="text-[#ff4a1f] shrink-0" />
                                                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                                                        {meta.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="any"
                                                        value={extra.amount || ''}
                                                        onChange={e => handleUpdateExtraAmount(idx, e.target.value)}
                                                        className="w-16 h-[22px] px-1 text-right font-bold text-[11px] rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExtra(idx)}
                                                        className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-rose-500 rounded cursor-pointer shrink-0"
                                                        title="Remove"
                                                    >
                                                        <Trash2 size={11} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Optional Note Input */}
                    <div>
                        <Input
                            placeholder="Add a reason or condition (optional)..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="!h-[32px] text-xs"
                        />
                    </div>

                    {/* Bottom Action Buttons: Compact Equal Height Grid matching Payment Modal */}
                    <div className="grid grid-cols-2 gap-2 pt-1 w-full">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full h-[26px] px-2 rounded-[4px] border border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10.5px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
                        >
                            <span>Cancel</span>
                        </button>

                        <button
                            type="submit"
                            disabled={finalAmountNum <= 0}
                            className="w-full h-[26px] px-2 rounded-[4px] border border-[#ff4a1f] bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-[10.5px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span>{isSupplier ? 'Submit Offer' : 'Send Counter'}</span>
                            {finalAmountNum > 0 && (
                                <span>({currency} {finalAmountNum.toLocaleString()})</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

export default CounterOfferModal;
