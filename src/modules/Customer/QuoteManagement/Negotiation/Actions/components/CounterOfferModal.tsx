import React, { useState, useEffect } from 'react';
import { DollarSign, Calculator, Plus, Trash2, Receipt } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Modal from '@/components/modals/modal';

export interface CustomCharge {
    id: number;
    label: string;
    description?: string;
    amount: string;
}

interface CounterOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSupplier?: boolean;
    initialBaseFreight?: number | string;
    currency?: string;
    onSubmit: (amount: number, note: string) => void;
}

export function CounterOfferModal({
    isOpen,
    onClose,
    isSupplier = false,
    initialBaseFreight,
    currency = '€',
    onSubmit
}: CounterOfferModalProps) {
    const [counterOfferAmount, setCounterOfferAmount] = useState('');
    const [counterOfferNote, setCounterOfferNote] = useState('');
    const [baseFreight, setBaseFreight] = useState(initialBaseFreight ? String(initialBaseFreight) : '3500');

    useEffect(() => {
        if (initialBaseFreight) setBaseFreight(String(initialBaseFreight));
    }, [initialBaseFreight]);

    const [customCharges, setCustomCharges] = useState<CustomCharge[]>([
        { id: 1, label: 'Load / Unload Fee', description: '2 helpers included', amount: '350' },
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
            if (counterOfferNote.trim()) lines.push(`Notes: ${counterOfferNote.trim()}`);
            note = lines.join('\n');
        }

        onSubmit(totalAmount, note);
        onClose();
        setCounterOfferAmount('');
        setCounterOfferNote('');
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isSupplier ? 'Submit Revised Quotation' : 'Submit Counter Offer'}
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                {isSupplier ? (
                    <div className="space-y-4">
                        <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Base Freight Rate ({currency}) *
                            </label>
                            <Input
                                type="number"
                                required
                                value={baseFreight}
                                onChange={e => setBaseFreight(e.target.value)}
                                placeholder="0.00"
                                className="font-bold text-base"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Custom / Accessorial Charges</span>
                                <Button type="button" variant="outline" size="sm" onClick={addCustomCharge} className="h-7 text-[11px] gap-1">
                                    <Plus size={13} /> Add Fee
                                </Button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {customCharges.map(charge => (
                                    <div key={charge.id} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <Input
                                            value={charge.label}
                                            onChange={e => updateCustomCharge(charge.id, 'label', e.target.value)}
                                            placeholder="Charge name"
                                            className="text-xs h-8 flex-1"
                                        />
                                        <Input
                                            type="number"
                                            value={charge.amount}
                                            onChange={e => updateCustomCharge(charge.id, 'amount', e.target.value)}
                                            placeholder="0.00"
                                            className="text-xs h-8 w-24 text-right font-bold"
                                        />
                                        <button type="button" onClick={() => removeCustomCharge(charge.id)} className="text-red-500 hover:text-red-600 p-1">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-orange-50 dark:bg-orange-950/30 p-3 rounded-xl border border-orange-200 dark:orange-900/50 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Total Calculated Rate</span>
                            <span className="text-base font-extrabold text-[#ff4a1f]">{currency} {supplierTotal.toLocaleString()}</span>
                        </div>
                    </div>
                ) : (
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                            Target Rate ({currency}) *
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">{currency}</span>
                            <Input
                                type="number"
                                required
                                value={counterOfferAmount}
                                onChange={e => setCounterOfferAmount(e.target.value)}
                                placeholder="0.00"
                                className="pl-8 font-bold text-base"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Offer Note / Message
                    </label>
                    <Textarea
                        rows={3}
                        value={counterOfferNote}
                        onChange={e => setCounterOfferNote(e.target.value)}
                        placeholder="Add terms or details regarding your rate..."
                        className="text-xs"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button type="button" variant="outline" size="sm" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" size="sm" className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white">
                        Submit Rate
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
