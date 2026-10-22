import React from 'react';
import Modal from '@/components/modals/modal';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { ArrowUpRight, Loader2, Wallet } from 'lucide-react';
import { useWithdrawModalState, MIN_WITHDRAWAL_AMOUNT } from '../hooks/useWithdrawModalState';
import { WithdrawModalAmountSection } from './WithdrawModalAmountSection';
import { WithdrawModalMethodSection } from './WithdrawModalMethodSection';

export { MIN_WITHDRAWAL_AMOUNT };

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableBalance: number;
    initialAmount?: number | string;
    stripeAccount?: {
        is_connected: boolean;
        account_id?: string | null;
        country?: string;
    };
    onSuccess: () => void;
}

export default function WithdrawModal({
    isOpen,
    onClose,
    availableBalance = 0,
    initialAmount,
    stripeAccount,
    onSuccess,
}: WithdrawModalProps) {
    const isStripeConnected = Boolean(stripeAccount?.is_connected);

    const {
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
        isSubmitting,
        error,
        setError,
        successMessage,
        numAmount,
        isBelowMin,
        isOverBalance,
        isValidAmount,
        handleSetMax,
        handlePresetAmount,
        handleSubmit,
    } = useWithdrawModalState({
        isOpen,
        availableBalance,
        initialAmount,
        stripeAccount,
        onSuccess,
        onClose,
    });

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-base sm:text-lg">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#ea580c] flex items-center justify-center shrink-0">
                        <Wallet size={18} />
                    </div>
                    <span>Withdraw Funds</span>
                </div>
            }
            description="Transfer your cleared delivery earnings to your connected Stripe account or bank."
            size="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                <WithdrawModalAmountSection
                    availableBalance={availableBalance}
                    amount={amount}
                    setAmount={setAmount}
                    error={error}
                    setError={setError}
                    successMessage={successMessage}
                    numAmount={numAmount}
                    isBelowMin={isBelowMin}
                    isOverBalance={isOverBalance}
                    handleSetMax={handleSetMax}
                    handlePresetAmount={handlePresetAmount}
                />

                <WithdrawModalMethodSection
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

                {/* Notes (Optional) */}
                <div className="space-y-1">
                    <label className="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 block">
                        Withdrawal Reference / Notes (Optional)
                    </label>
                    <Input
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Weekly Earnings Payout"
                        className="h-8 text-xs"
                    />
                </div>

                {/* Summary Box */}
                <div className="p-3 rounded-[4px] bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>Requested Gross Amount:</span>
                        <span className="font-bold text-slate-900 dark:text-white">€{numAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span>Withdrawal Fee:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">€0.00 (Free)</span>
                    </div>
                    <div className="pt-1.5 border-t border-orange-200/60 dark:border-orange-900/40 flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>Net Disbursement:</span>
                        <span className="text-base text-[#ea580c] font-black">€{numAmount.toFixed(2)}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="h-8 px-3 text-xs"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || !isValidAmount || availableBalance < MIN_WITHDRAWAL_AMOUNT}
                        className="h-8 px-4 text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <ArrowUpRight size={14} />
                                <span>Request Withdrawal (€{numAmount.toFixed(2)} Net)</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
