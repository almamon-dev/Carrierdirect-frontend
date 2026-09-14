import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Modal from '@/components/modals/modal';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Button from '@/components/ui/button';

export interface CounterOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number, note: string) => void;
    initialAmount?: number | string;
    initialBaseFreight?: number | string;
    originalOfferAmount?: number | string;
    targetBudget?: number | string;
    carrierName?: string;
    currency?: string;
    isSupplier?: boolean;
}

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
}: CounterOfferModalProps) {
    const rawAmt = initialAmount ?? initialBaseFreight ?? originalOfferAmount;
    const origAmtNum = rawAmt
        ? typeof rawAmt === 'number'
            ? rawAmt
            : parseFloat(String(rawAmt).replace(/[^0-9.]/g, '')) || 0
        : 0;

    const rawBudget = targetBudget;
    const budgetNum = rawBudget
        ? typeof rawBudget === 'number'
            ? rawBudget
            : parseFloat(String(rawBudget).replace(/[^0-9.]/g, '')) || 0
        : 0;

    const [counterOfferAmount, setCounterOfferAmount] = useState<string>('');
    const [counterOfferNote, setCounterOfferNote] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            setCounterOfferAmount(origAmtNum > 0 ? String(origAmtNum) : '');
            setCounterOfferNote('');
        }
    }, [isOpen, origAmtNum]);

    const proposedNum = Number(counterOfferAmount) || 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (proposedNum <= 0) return;
        onSubmit(proposedNum, counterOfferNote.trim());
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isSupplier ? 'Revise Quote Rate' : 'Submit Counter Offer'}
            description={
                isSupplier
                    ? 'Propose an updated rate to the customer'
                    : 'Propose a revised rate to negotiate with the carrier'
            }
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                {/* Rate Overview Card */}
                <div
    className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-lg p-3 flex items-center justify-between text-xs">
                    <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Current Offer</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                            {currency} {origAmtNum > 0 ? origAmtNum.toLocaleString() : '0.00'}
                        </span>
                    </div>

                    {budgetNum > 0 && (
                        <div className="text-center">
                            <span className="text-slate-400 block text-[11px] font-medium">Budget</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                                {currency} {budgetNum.toLocaleString()}
                            </span>
                        </div>
                    )}

                    {carrierName && (
                        <div className="text-right">
                            <span className="text-slate-400 block text-[11px] font-medium">
                                {isSupplier ? 'Customer' : 'Carrier'}
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs truncate max-w-[140px] inline-block">
                                {carrierName}
                            </span>
                        </div>
                    )}
                </div>

                {/* Counter Rate Input */}
                <Input
                    label={`Your Proposed Rate (${currency}) *`}
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={counterOfferAmount}
                    onChange={e => setCounterOfferAmount(e.target.value)}
                    placeholder="0.00"
                    icon={<span className="font-bold text-sm text-slate-500 select-none">{currency}</span>}
                    className="font-bold text-sm tabular-nums"
                    autoFocus
                />

                {/* Optional Message / Notes */}
                <Textarea
                    label="Notes or Conditions (Optional)"
                    rows={3}
                    value={counterOfferNote}
                    onChange={e => setCounterOfferNote(e.target.value)}
                    placeholder="Add special terms, commitments, or notes..."
                />

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="!h-9 px-4 rounded-md text-xs font-semibold border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={proposedNum <= 0}
                        className="!h-9 px-4 rounded-md text-xs font-bold disabled:opacity-50 flex items-center gap-1.5 bg-[#FF4A1F] hover:bg-[#E03E15] text-white shadow-2xs transition-all cursor-pointer"
                    >
                        <span>Send Counter Offer</span>
                        {proposedNum > 0 && (
                            <span className="font-semibold opacity-95">
                                ({currency} {proposedNum.toLocaleString()})
                            </span>
                        )}
                        <ArrowRight size={14} />
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default CounterOfferModal;
