import React from 'react';
import {
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Info,
} from 'lucide-react';
import PageHeader from '@/components/common/page-header';
import Button from '@/components/ui/button';
import { useWithdrawFundsState, MIN_WITHDRAWAL_AMOUNT } from './hooks/useWithdrawFundsState';
import { WithdrawFundsFormCard } from './components/WithdrawFundsFormCard';
import { WithdrawFundsSummarySide } from './components/WithdrawFundsSummarySide';

export { MIN_WITHDRAWAL_AMOUNT };

export default function WithdrawFundsPage() {
    const {
        navigate,
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
        error,
        setError,
        successMessage,
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
    } = useWithdrawFundsState();

    return (
        <div className="p-3 sm:p-4 md:p-5 w-full mx-auto space-y-3.5 min-h-screen font-sans antialiased bg-[#f8fafc] dark:bg-[#12161c]">
            {/* Top Navigation & Page Header */}
            <div>
                <PageHeader
                    title="Withdraw Funds"
                    description="Transfer your cleared delivery earnings to your connected Stripe account or business bank via SEPA wire."
                    className="mb-0"
                    actions={
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/supplier/wallet')}
                            className="h-7.5 px-2.5 text-xs font-semibold flex items-center gap-1.5 cursor-pointer bg-white dark:bg-[#1e2329] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-[4px]"
                        >
                            <ArrowLeft size={13} />
                            <span>Back to Wallet</span>
                        </Button>
                    }
                />
            </div>

            {/* Error or Success notification banner */}
            {error && (
                <div className="p-2.5 rounded-[4px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="p-2.5 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
                    <CheckCircle2 size={15} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{successMessage} Redirecting back to your wallet...</span>
                </div>
            )}

            {/* Main 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
                {/* Left Column (7 cols): The Withdrawal Form */}
                <div className="lg:col-span-7 space-y-3.5">
                    {/* Available Balance Header Card */}
                    <div className="p-3 sm:p-3.5 rounded-[4px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#12161c] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                                Available Balance for Withdrawal
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                    €{availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    Cleared & Ready
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:items-end gap-1">
                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                Limits: <strong className="text-slate-700 dark:text-slate-300">Min €50.00</strong> • Max €{availableBalance.toFixed(2)}
                            </span>
                            {availableBalance < MIN_WITHDRAWAL_AMOUNT ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-semibold">
                                    Below €50.00 Min Threshold
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-emerald-50 dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60 text-[10px] font-semibold">
                                    Eligible for Withdrawal
                                </span>
                            )}
                        </div>
                    </div>

                    {availableBalance < MIN_WITHDRAWAL_AMOUNT && (
                        <div className="p-2.5 rounded-[4px] bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                            <Info size={15} className="shrink-0 text-amber-600" />
                            <span>
                                Your available balance is currently <strong>€{availableBalance.toFixed(2)}</strong>. A minimum balance of <strong>€{MIN_WITHDRAWAL_AMOUNT.toFixed(2)}</strong> is required to request a withdrawal.
                            </span>
                        </div>
                    )}

                    {/* Main Withdrawal Form Container */}
                    <WithdrawFundsFormCard
                        amount={amount}
                        setAmount={setAmount}
                        method={method}
                        setMethod={setMethod}
                        bankName={bankName}
                        setBankName={setBankName}
                        accountHolder={accountHolder}
                        setAccountHolder={setAccountHolder}
                        iban={iban}
                        setIban={setIban}
                        notes={notes}
                        setNotes={setNotes}
                        agreedTerms={agreedTerms}
                        setAgreedTerms={setAgreedTerms}
                        isSubmitting={isSubmitting}
                        setError={setError}
                        availableBalance={availableBalance}
                        stripeAccount={stripeAccount}
                        isStripeConnected={isStripeConnected}
                        numAmount={numAmount}
                        isBelowMin={isBelowMin}
                        isOverBalance={isOverBalance}
                        isValidAmount={isValidAmount}
                        handleSelectPreset={handleSelectPreset}
                        handleSetMax={handleSetMax}
                        handleSubmit={handleSubmit}
                    />
                </div>

                {/* Right Column (5 cols): Payout Summary, Terms & Conditions, and Help */}
                <WithdrawFundsSummarySide numAmount={numAmount} method={method} />
            </div>
        </div>
    );
}
