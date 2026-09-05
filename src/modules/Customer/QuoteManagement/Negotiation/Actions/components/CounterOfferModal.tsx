import React, { useState, useEffect, useMemo } from 'react';
import {
    TrendingDown, TrendingUp, ShieldCheck, Clock, Check,
    Sparkles, ArrowRight, MessageSquare, AlertCircle, HelpCircle, Layers
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Textarea from '@/components/ui/textarea';
import Modal from '@/components/modals/modal';
import { SupplierCustomChargesSection, CustomCharge } from './SupplierCustomChargesSection';

export { type CustomCharge } from './SupplierCustomChargesSection';

export interface CounterOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSupplier?: boolean;
    initialBaseFreight?: number | string;
    originalOfferAmount?: number | string;
    targetBudget?: number | string;
    carrierName?: string;
    currency?: string;
    onSubmit: (amount: number, note: string, validity?: string) => void;
}

const QUICK_MESSAGE_PRESETS = [
    "Ready for immediate booking at this rate.",
    "Aligned with regular volume schedule.",
    "Flexible on pickup time if accepted.",
];

const VALIDITY_OPTIONS = [
    { id: '24h', label: '24 Hours (Urgent)' },
    { id: '48h', label: '48 Hours (Standard)' },
    { id: '72h', label: '72 Hours' },
    { id: 'pickup', label: 'Until Scheduled Pickup' },
];

export function CounterOfferModal({
    isOpen,
    onClose,
    isSupplier = false,
    initialBaseFreight,
    originalOfferAmount,
    targetBudget,
    carrierName,
    currency = '€',
    onSubmit
}: CounterOfferModalProps) {
    const origAmtNum = useMemo(() => {
        if (!originalOfferAmount) return 0;
        return typeof originalOfferAmount === 'number'
            ? originalOfferAmount
            : parseFloat(String(originalOfferAmount).replace(/[^0-9.]/g, '')) || 0;
    }, [originalOfferAmount]);

    const targetBudgetNum = useMemo(() => {
        if (!targetBudget) return 0;
        return typeof targetBudget === 'number'
            ? targetBudget
            : parseFloat(String(targetBudget).replace(/[^0-9.]/g, '')) || 0;
    }, [targetBudget]);

    // Initial offer: start with target budget or 90% of original offer or empty
    const defaultStartAmount = useMemo(() => {
        if (targetBudgetNum > 0) return String(targetBudgetNum);
        if (origAmtNum > 0) return String(Math.round(origAmtNum * 0.9));
        if (initialBaseFreight) return String(initialBaseFreight);
        return '';
    }, [targetBudgetNum, origAmtNum, initialBaseFreight]);

    const [counterOfferAmount, setCounterOfferAmount] = useState<string>(defaultStartAmount);
    const [counterOfferNote, setCounterOfferNote] = useState<string>('');
    const [validityPeriod, setValidityPeriod] = useState<string>('48h');
    const [baseFreight, setBaseFreight] = useState(initialBaseFreight ? String(initialBaseFreight) : '3500');

    useEffect(() => {
        if (isOpen) {
            setCounterOfferAmount(defaultStartAmount);
            if (initialBaseFreight) setBaseFreight(String(initialBaseFreight));
        }
    }, [isOpen, defaultStartAmount, initialBaseFreight]);

    const [customCharges, setCustomCharges] = useState<CustomCharge[]>([
        { id: 1, label: 'Load / Unload Fee', description: '2 helpers included', amount: '120' },
        { id: 2, label: 'Insurance Fee', description: 'Full goods coverage', amount: '150' }
    ]);

    const addCustomCharge = () => {
        setCustomCharges(prev => [...prev, { id: Date.now(), label: '', description: '', amount: '' }]);
    };

    const updateCustomCharge = (id: number, field: 'label' | 'description' | 'amount', value: string) => {
        setCustomCharges(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const removeCustomCharge = (id: number) => {
        setCustomCharges(prev => prev.filter(c => c.id !== id));
    };

    const customTotal = customCharges.reduce((acc, c) => acc + (parseFloat(c.amount) || 0), 0);
    const supplierTotal = (parseFloat(baseFreight) || 0) + customTotal;

    // Customer Proposed Rate Calculations
    const proposedNum = parseFloat(counterOfferAmount) || 0;
    const diffFromOriginal = origAmtNum > 0 ? proposedNum - origAmtNum : 0;
    const percentDiff = origAmtNum > 0 ? ((diffFromOriginal / origAmtNum) * 100) : 0;
    const isSaving = diffFromOriginal < 0;

    // Preset Chip Click handler
    const applyDiscountPreset = (pct: number) => {
        if (origAmtNum <= 0) return;
        const discounted = Math.round(origAmtNum * (1 - pct / 100));
        setCounterOfferAmount(String(discounted));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const totalAmount = isSupplier ? supplierTotal : parseFloat(counterOfferAmount);
        if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) return;

        let note = counterOfferNote.trim();
        if (isSupplier) {
            const lines = [`Revised Total Offer: ${currency} ${totalAmount.toLocaleString()}`];
            lines.push(`• Base Freight: ${currency} ${parseFloat(baseFreight || '0').toLocaleString()}`);
            customCharges.forEach(c => {
                if (c.label && c.amount) {
                    lines.push(`• ${c.label}: ${currency} ${parseFloat(c.amount).toLocaleString()}`);
                }
            });
            if (validityPeriod) {
                const valLabel = VALIDITY_OPTIONS.find(v => v.id === validityPeriod)?.label || '48 Hours';
                lines.push(`• Offer Validity: ${valLabel}`);
            }
            if (counterOfferNote.trim()) lines.push(`Notes: ${counterOfferNote.trim()}`);
            note = lines.join('\n');
        } else {
            const valLabel = VALIDITY_OPTIONS.find(v => v.id === validityPeriod)?.label || '48 Hours';
            const intro = `Counter Offer: ${currency} ${totalAmount.toLocaleString()} (${valLabel})`;
            note = note ? `${intro}\n${note}` : intro;
        }

        onSubmit(totalAmount, note, validityPeriod);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isSupplier ? 'Submit Revised Quotation' : 'Submit Counter Offer'}
            size="lg"
            className="max-w-[500px]"
        >
            <form onSubmit={handleSubmit} className="space-y-2.5 pt-0.5 font-sans">
                {/* Compact Header Context Bar */}
                <div className="flex items-center justify-between py-1.5 px-3 bg-slate-50 dark:bg-slate-800/40 rounded-[5px] text-[11px]">
                    <div className="flex items-center gap-1.5">
                        <span className="text-slate-400">Partner:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200">{carrierName || (isSupplier ? 'Direct Shipper' : 'Freight Carrier')}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck size={11} /> Escrow Protected
                    </span>
                </div>

                {isSupplier ? (
                    <SupplierCustomChargesSection
                        currency={currency}
                        baseFreight={baseFreight}
                        setBaseFreight={setBaseFreight}
                        customCharges={customCharges}
                        addCustomCharge={addCustomCharge}
                        updateCustomCharge={updateCustomCharge}
                        removeCustomCharge={removeCustomCharge}
                        supplierTotal={supplierTotal}
                    />
                ) : (
                    <div className="space-y-2.5">
                        {/* Ultra-Compact Single Row Snapshot Card */}
                        {origAmtNum > 0 && (
                            <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-[5px] border border-slate-100 dark:border-slate-800/80 text-[11px]">
                                <div className="flex items-center gap-1">
                                    <span className="text-slate-400">Carrier:</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-200">{currency}{origAmtNum.toLocaleString()}</span>
                                </div>
                                {targetBudgetNum > 0 && (
                                    <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                                        <span className="text-slate-400">Budget:</span>
                                        <span className="font-medium text-slate-700 dark:text-slate-200">{currency}{targetBudgetNum.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
                                    <span className="text-slate-400">Delta:</span>
                                    {proposedNum > 0 ? (
                                        <span className={`font-medium flex items-center gap-0.5 ${
                                            isSaving ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'
                                        }`}>
                                            {isSaving ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                                            <span>{isSaving ? `Save ${currency}${Math.abs(diffFromOriginal).toLocaleString()} (${Math.abs(percentDiff).toFixed(0)}%)` : `${currency}${diffFromOriginal.toLocaleString()}`}</span>
                                        </span>
                                    ) : (
                                        <span className="text-slate-400">—</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Rate Input Component with UI Input */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 font-sans mb-1">
                                Target Counter Rate ({currency}) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 font-medium text-xs">
                                    {currency}
                                </div>
                                <Input
                                    type="number"
                                    required
                                    min="1"
                                    step="any"
                                    value={counterOfferAmount}
                                    onChange={e => setCounterOfferAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="!pl-6 pr-10 font-medium text-xs !h-8 rounded-[5px] text-slate-800 dark:text-slate-200"
                                />
                                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 text-[10.5px] font-normal">
                                    EUR
                                </div>
                            </div>
                        </div>

                        {/* Quick Smart Discount Presets */}
                        {origAmtNum > 0 && (
                            <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
                                {[5, 10, 15, 20].map((pct) => {
                                    const calculated = Math.round(origAmtNum * (1 - pct / 100));
                                    const isCurrent = proposedNum === calculated;
                                    return (
                                        <button
                                            key={pct}
                                            type="button"
                                            onClick={() => applyDiscountPreset(pct)}
                                            className={`text-[10.5px] px-2 py-0.5 rounded-[5px] border transition-all cursor-pointer flex items-center gap-1 ${
                                                isCurrent
                                                    ? 'bg-[#ff4a1f] text-white border-[#ff4a1f] font-medium shadow-2xs'
                                                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[#ff4a1f] hover:text-[#ff4a1f]'
                                            }`}
                                        >
                                            <span>-{pct}%</span>
                                            <span className="opacity-80 font-mono text-[9.5px]">({currency}{calculated.toLocaleString()})</span>
                                        </button>
                                    );
                                })}

                                {targetBudgetNum > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setCounterOfferAmount(String(targetBudgetNum))}
                                        className={`text-[10.5px] px-2 py-0.5 rounded-[5px] border transition-all cursor-pointer ${
                                            proposedNum === targetBudgetNum
                                                ? 'bg-[#ff4a1f] text-white border-[#ff4a1f] font-medium shadow-2xs'
                                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[#ff4a1f] hover:text-[#ff4a1f]'
                                        }`}
                                    >
                                        Match Budget ({currency}{targetBudgetNum.toLocaleString()})
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Offer Validity using UI Select */}
                <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 font-sans mb-1">
                        Offer Validity Period
                    </label>
                    <Select
                        value={validityPeriod}
                        onChange={(val) => {
                            const v = typeof val === 'object' && val?.target ? val.target.value : val;
                            setValidityPeriod(v);
                        }}
                        showSearch={false}
                        icon={Clock}
                        placeholder="Select validity..."
                        className="rounded-[5px] text-xs h-[32px] font-normal"
                    >
                        {VALIDITY_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {opt.label}
                            </option>
                        ))}
                    </Select>
                </div>

                {/* Offer Note / Message */}
                <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 font-sans mb-1">
                        Message / Conditions (Optional)
                    </label>
                    <Textarea
                        rows={2}
                        value={counterOfferNote}
                        onChange={e => setCounterOfferNote(e.target.value)}
                        placeholder="Add special terms, commitments, or notes..."
                        className="text-xs rounded-[5px] font-normal text-slate-800 dark:text-slate-200"
                    />

                    {/* Quick Phrases */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                        {QUICK_MESSAGE_PRESETS.map((phrase, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setCounterOfferNote(prev => prev ? `${prev} ${phrase}` : phrase)}
                                className="text-[10.5px] px-2 py-0.5 rounded-[5px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-normal cursor-pointer transition-colors"
                            >
                                + {phrase}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 font-normal">
                        {isSupplier ? 'Updates in chat.' : 'Carrier notified instantly.'}
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            className="!h-8 min-w-[70px] px-3.5 rounded-[5px] text-xs font-normal border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            size="sm"
                            disabled={isSupplier ? supplierTotal <= 0 : proposedNum <= 0}
                            className="!h-8 px-4 rounded-[5px] text-xs font-medium disabled:opacity-50 flex items-center gap-1.5 shadow-2xs transition-all"
                        >
                            <span>Propose Rate</span>
                            <span className="font-mono font-normal">({currency}{isSupplier ? supplierTotal.toLocaleString() : proposedNum.toLocaleString()})</span>
                            <ArrowRight size={13} />
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
