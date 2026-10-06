import React from 'react';
import { Plus, Trash2, Tag, ShieldCheck, DollarSign } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

export interface CustomCharge {
    id: number;
    label: string;
    description?: string;
    amount: string;
}

interface SupplierCustomChargesSectionProps {
    currency: string;
    baseFreight: string;
    setBaseFreight: (val: string) => void;
    customCharges: CustomCharge[];
    addCustomCharge: () => void;
    updateCustomCharge: (id: number, field: 'label' | 'description' | 'amount', value: string) => void;
    removeCustomCharge: (id: number) => void;
    supplierTotal: number;
}

const COMMON_PRESET_FEES = [
    { label: 'Tail-lift', amount: '50' },
    { label: 'Inside Helper', amount: '120' },
    { label: 'Insurance', amount: '150' },
    { label: 'Fuel Surcharge', amount: '85' },
];

export const SupplierCustomChargesSection: React.FC<SupplierCustomChargesSectionProps> = ({
    currency,
    baseFreight,
    setBaseFreight,
    customCharges,
    addCustomCharge,
    updateCustomCharge,
    removeCustomCharge,
    supplierTotal,
}) => {
    const handleAddPreset = (label: string, amount: string) => {
        const exists = customCharges.find(c => c.label.toLowerCase() === label.toLowerCase());
        if (exists) return;
        const newId = Date.now();
        const emptyIdx = customCharges.findIndex(c => !c.label && !c.amount);
        if (emptyIdx !== -1) {
            updateCustomCharge(customCharges[emptyIdx].id, 'label', label);
            updateCustomCharge(customCharges[emptyIdx].id, 'amount', amount);
        } else {
            addCustomCharge();
            setTimeout(() => {
                updateCustomCharge(newId, 'label', label);
                updateCustomCharge(newId, 'amount', amount);
            }, 0);
        }
    };

    return (
        <div className="space-y-2.5 font-sans">
            {/* Base Freight Rate */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Base Freight Rate <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">EUR</span>
                </div>
                <Input
                    icon={<span className="text-slate-400 font-bold text-xs">{currency}</span>}
                    type="number"
                    required
                    value={baseFreight}
                    onChange={e => setBaseFreight(e.target.value)}
                    placeholder="0.00"
                    className="pr-3 font-bold text-xs !h-8 rounded-[3px] text-slate-900 dark:text-slate-100 tabular-nums shadow-none border-slate-200 dark:border-slate-800"
                />
            </div>

            {/* Surcharges Section */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Surcharges & Accessorials
                    </span>
                    <button
                        type="button"
                        onClick={addCustomCharge}
                        className="text-[11px] font-semibold text-[#ff4a1f] hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                        <Plus size={11} /> Add Fee
                    </button>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1 mb-1.5">
                    {COMMON_PRESET_FEES.map((preset) => {
                        const isAdded = customCharges.some(c => c.label.toLowerCase() === preset.label.toLowerCase());
                        return (
                            <button
                                key={preset.label}
                                type="button"
                                disabled={isAdded}
                                onClick={() => handleAddPreset(preset.label, preset.amount)}
                                className={`text-[10px] px-1.5 py-0.5 rounded-[3px] font-medium transition-all cursor-pointer flex items-center gap-0.5 ${
                                    isAdded
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200/60 dark:border-slate-800 opacity-50 cursor-default'
                                        : 'bg-white dark:bg-[#181d24] text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700 hover:border-[#ff4a1f] hover:text-[#ff4a1f]'
                                }`}
                            >
                                <span>+ {preset.label}</span>
                                <span className="opacity-70 font-mono text-[9px]">({currency}{preset.amount})</span>
                            </button>
                        );
                    })}
                </div>

                {/* Charges List */}
                {customCharges.length > 0 && (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                        {customCharges.map((charge) => (
                            <div key={charge.id} className="flex items-center gap-1.5">
                                <Input
                                    value={charge.label}
                                    onChange={e => updateCustomCharge(charge.id, 'label', e.target.value)}
                                    placeholder="Fee description"
                                    className="text-xs !h-8 flex-1 rounded-[3px] font-medium shadow-none border-slate-200 dark:border-slate-800 bg-white dark:bg-[#181d24]"
                                />
                                <div className="w-22 sm:w-24 shrink-0 flex items-center">
                                    <Input
                                        icon={<span className="text-slate-400 text-[11px] font-bold">{currency}</span>}
                                        type="number"
                                        value={charge.amount}
                                        onChange={e => updateCustomCharge(charge.id, 'amount', e.target.value)}
                                        placeholder="0"
                                        className="text-xs !h-8 pr-2 text-right font-bold rounded-[3px] tabular-nums shadow-none border-slate-200 dark:border-slate-800 bg-white dark:bg-[#181d24]"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCustomCharge(charge.id)}
                                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-[3px] shrink-0 cursor-pointer transition-colors"
                                    title="Remove fee"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Slim Total Summary */}
            <div
    className="flex justify-between items-center px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200/70 dark:border-slate-800 text-xs">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    Total Revised Quote
                </span>
                <span className="text-xs font-bold text-[#ff4a1f] tabular-nums font-mono">
                    {currency} {supplierTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
        </div>
    );
};
