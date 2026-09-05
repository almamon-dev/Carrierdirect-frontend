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
    { label: 'Tail-lift Assistance', amount: '50' },
    { label: 'Inside Delivery Helper', amount: '120' },
    { label: 'Goods Insurance Coverage', amount: '150' },
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
        // Check if already exists
        const exists = customCharges.find(c => c.label.toLowerCase() === label.toLowerCase());
        if (exists) return;
        const newId = Date.now();
        // Replace empty charge or append
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
        <div className="space-y-2.5">
            {/* Base Freight Rate */}
            <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 font-sans mb-1">
                    Base Freight Rate ({currency}) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-medium text-xs">
                        {currency}
                    </div>
                    <Input
                        type="number"
                        required
                        value={baseFreight}
                        onChange={e => setBaseFreight(e.target.value)}
                        placeholder="0.00"
                        className="!pl-6 pr-10 font-medium text-xs !h-8 rounded-[5px] text-slate-800 dark:text-slate-200"
                    />
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 text-[10.5px] font-normal">
                        EUR
                    </div>
                </div>
            </div>

            {/* Custom Charges Section */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        Itemized Surcharges & Accessorial Fees
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addCustomCharge}
                        className="h-6 text-[10.5px] px-2 rounded-[5px] gap-1 font-normal text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    >
                        <Plus size={11} /> Add Custom Fee
                    </Button>
                </div>

                {/* Quick Preset Chips */}
                <div className="flex flex-wrap gap-1 mb-2">
                    {COMMON_PRESET_FEES.map((preset) => {
                        const isAdded = customCharges.some(c => c.label.toLowerCase() === preset.label.toLowerCase());
                        return (
                            <button
                                key={preset.label}
                                type="button"
                                disabled={isAdded}
                                onClick={() => handleAddPreset(preset.label, preset.amount)}
                                className={`text-[10px] px-1.5 py-0.5 rounded-[5px] font-normal border transition-colors cursor-pointer flex items-center gap-0.5 ${
                                    isAdded
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-800 opacity-60 cursor-default'
                                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                <span>+ {preset.label}</span>
                                <span className="opacity-70 font-mono text-[9px]">({currency}{preset.amount})</span>
                            </button>
                        );
                    })}
                </div>

                {/* Charges List */}
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {customCharges.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-1">No additional charges added. Flat base freight applies.</p>
                    ) : (
                        customCharges.map((charge) => (
                            <div key={charge.id} className="flex items-center gap-1.5 bg-slate-50/70 dark:bg-slate-800/40 p-1.5 rounded-[5px] border border-slate-200/60 dark:border-slate-800">
                                <Input
                                    value={charge.label}
                                    onChange={e => updateCustomCharge(charge.id, 'label', e.target.value)}
                                    placeholder="Charge description (e.g. Tail-lift)"
                                    className="text-xs !h-7 flex-1 rounded-[5px] font-normal"
                                />
                                <div className="relative w-24 flex items-center">
                                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-slate-400 text-[11px] font-normal">
                                        {currency}
                                    </div>
                                    <Input
                                        type="number"
                                        value={charge.amount}
                                        onChange={e => updateCustomCharge(charge.id, 'amount', e.target.value)}
                                        placeholder="0.00"
                                        className="text-xs !h-7 !pl-5 pr-2 text-right font-medium rounded-[5px]"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCustomCharge(charge.id)}
                                    className="text-slate-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                                    title="Remove surcharge"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Total Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/60 py-2 px-3 rounded-[5px] border border-slate-200/80 dark:border-slate-800 flex justify-between items-center text-xs">
                <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300 block">Total Revised Quotation</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Includes base freight + {customCharges.filter(c => Number(c.amount) > 0).length} surcharges</span>
                </div>
                <span className="text-sm font-bold text-[#ff4a1f] font-mono">{currency} {supplierTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
        </div>
    );
};
