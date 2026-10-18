import React from 'react';
import { Loader2, ArrowUpRight } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { MIN_WITHDRAWAL_AMOUNT } from '../hooks/useWithdrawFundsState';
import { WithdrawFundsAmountSection } from './WithdrawFundsAmountSection';
import { WithdrawFundsDestinationSection } from './WithdrawFundsDestinationSection';

interface WithdrawFundsFormCardProps {
    amount: string;
    setAmount: (val: string) => void;
    method: 'stripe' | 'bank';
    setMethod: (m: 'stripe' | 'bank') => void;
    bankName: string;
    setBankName: (val: string) => void;
    accountHolder: string;
    setAccountHolder: (val: string) => void;
    iban: string;
    setIban: (val: string) => void;
    notes: string;
    setNotes: (val: string) => void;
    agreedTerms: boolean;
    setAgreedTerms: (val: boolean) => void;
    isSubmitting: boolean;
    setError: (val: string | null) => void;
    availableBalance: number;
    stripeAccount: any;
    isStripeConnected: boolean;
    numAmount: number;
    isBelowMin: boolean;
    isOverBalance: boolean;
    isValidAmount: boolean;
    handleSelectPreset: (preset: number) => void;
    handleSetMax: () => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export function WithdrawFundsFormCard({
    amount,
    setAmount,
    method,
    setMethod,
    bankName,
    setBankName,
    accountHolder,
    setAccountHolder,
    iban,
    setIban,
    notes,
    setNotes,
    agreedTerms,
    setAgreedTerms,
    isSubmitting,
    setError,
    availableBalance,
    stripeAccount,
    isStripeConnected,
    numAmount,
    isBelowMin,
    isOverBalance,
    isValidAmount,
    handleSelectPreset,
    handleSetMax,
    handleSubmit,
}: WithdrawFundsFormCardProps) {
    return (
        <form onSubmit={handleSubmit} className="p-3.5 sm:p-4 rounded-[4px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#12161c] shadow-2xs space-y-3.5">
            <WithdrawFundsAmountSection
                amount={amount}
                setAmount={setAmount}
                availableBalance={availableBalance}
                numAmount={numAmount}
                isBelowMin={isBelowMin}
                isOverBalance={isOverBalance}
                setError={setError}
                handleSelectPreset={handleSelectPreset}
                handleSetMax={handleSetMax}
            />

            <WithdrawFundsDestinationSection
                method={method}
                setMethod={setMethod}
                isStripeConnected={isStripeConnected}
                stripeAccount={stripeAccount}
                iban={iban}
                setIban={setIban}
                accountHolder={accountHolder}
                setAccountHolder={setAccountHolder}
                bankName={bankName}
                setBankName={setBankName}
            />

            {/* Section 3: Notes (Optional) */}
            <div className="space-y-1 pt-1.5 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    3. Withdrawal Reference / Notes (Optional)
                </label>
                <Input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. October Week 2 Delivery Settlements"
                    className="h-8 text-xs"
                />
            </div>

            {/* Section 4: Terms & Conditions Checkbox */}
            <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-start gap-2 p-2.5 rounded-[4px] bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-orange-50/30 transition">
                    <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => {
                            setAgreedTerms(e.target.checked);
                            setError(null);
                        }}
                        className="mt-0.5 w-3.5 h-3.5 rounded text-[#ea580c] focus:ring-[#ea580c] accent-[#ea580c] cursor-pointer"
                    />
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal font-normal">
                        I confirm that the destination details provided are accurate. I have read and agree to the{' '}
                        <strong className="text-slate-900 dark:text-white font-semibold">CarrierDirect Withdrawal Policy</strong>.
                    </span>
                </label>
            </div>

            {/* Action Submit Button */}
            <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    10% platform processing fee applies • Processed within 24h
                </span>
                <Button
                    type="submit"
                    disabled={isSubmitting || !isValidAmount || !agreedTerms || availableBalance < MIN_WITHDRAWAL_AMOUNT}
                    className="w-full sm:w-auto h-8 px-5 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs rounded-[4px]"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Submitting Request...</span>
                        </>
                    ) : (
                        <>
                            <ArrowUpRight size={14} />
                            <span>Request Withdrawal (€{(numAmount * 0.90).toFixed(2)} Net)</span>
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
