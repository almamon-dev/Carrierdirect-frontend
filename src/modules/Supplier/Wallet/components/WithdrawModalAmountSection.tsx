import React from 'react';
import Button from '@/components/ui/button';
import { Info, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MIN_WITHDRAWAL_AMOUNT } from '../hooks/useWithdrawModalState';

interface WithdrawModalAmountSectionProps {
    availableBalance: number;
    amount: string;
    setAmount: (val: string) => void;
    error: string | null;
    setError: (val: string | null) => void;
    successMessage: string | null;
    numAmount: number;
    isBelowMin: boolean;
    isOverBalance: boolean;
    handleSetMax: () => void;
    handlePresetAmount: (val: number) => void;
}

const SUGGESTION_PRESETS = [50, 100, 250, 500];

export function WithdrawModalAmountSection({
    availableBalance,
    amount,
    setAmount,
    error,
    setError,
    successMessage,
    numAmount,
    isBelowMin,
    isOverBalance,
    handleSetMax,
    handlePresetAmount,
}: WithdrawModalAmountSectionProps) {
    return (
        <div className="space-y-4">
            {/* Available Balance Banner */}
            <div className="p-3.5 rounded-[6px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-0.5">
                        Available Balance
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        €{availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSetMax}
                    disabled={availableBalance < MIN_WITHDRAWAL_AMOUNT}
                    className="text-xs font-bold text-[#ea580c] hover:text-[#c2410c] border-[#ea580c]/30 hover:bg-orange-50 dark:hover:bg-orange-950/20 cursor-pointer h-7 px-2.5 disabled:opacity-50"
                >
                    Withdraw All
                </Button>
            </div>

            {availableBalance < MIN_WITHDRAWAL_AMOUNT && (
                <div className="p-3 rounded-[4px] bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                    <Info size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                        A minimum balance of <strong>€{MIN_WITHDRAWAL_AMOUNT.toFixed(2)}</strong> is required to request a withdrawal. Your current balance is €{availableBalance.toFixed(2)}.
                    </span>
                </div>
            )}

            {error && (
                <div className="p-3 rounded-[4px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="p-3 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 size={15} className="shrink-0" />
                    <span>{successMessage}</span>
                </div>
            )}

            {/* Amount Input */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Withdrawal Amount (€) <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Min: €{MIN_WITHDRAWAL_AMOUNT.toFixed(2)} • Max: €{availableBalance.toFixed(2)}
                    </span>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 dark:text-slate-400 font-bold text-base">
                        €
                    </div>
                    <input
                        type="number"
                        step="0.01"
                        min={MIN_WITHDRAWAL_AMOUNT}
                        max={availableBalance}
                        value={amount}
                        onChange={(e) => {
                            setAmount(e.target.value);
                            setError(null);
                        }}
                        placeholder="50.00"
                        className={`w-full pl-8 pr-16 py-2 rounded-[4px] border text-base font-bold text-slate-900 dark:text-white bg-white dark:bg-[#1e2329] focus:outline-none transition ${isOverBalance || isBelowMin
                            ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-400'
                            : 'border-slate-200 dark:border-slate-700 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]'
                        }`}
                        required
                    />
                    <button
                        type="button"
                        onClick={handleSetMax}
                        disabled={availableBalance < MIN_WITHDRAWAL_AMOUNT}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#ea580c] hover:underline cursor-pointer px-1 py-0.5 disabled:opacity-50"
                    >
                        MAX
                    </button>
                </div>

                {isBelowMin && (
                    <p className="text-[11px] text-rose-500 font-medium">
                        Minimum withdrawal amount is €{MIN_WITHDRAWAL_AMOUNT.toFixed(2)}.
                    </p>
                )}
                {isOverBalance && (
                    <p className="text-[11px] text-rose-500 font-medium">
                        Amount cannot exceed your available balance (€{availableBalance.toFixed(2)}).
                    </p>
                )}

                {/* Quick Amount Suggestion Chips */}
                <div className="pt-1.5 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                        Quick Amount Suggestions:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                        {SUGGESTION_PRESETS.map((presetVal) => {
                            const isSelected = Math.abs(numAmount - presetVal) < 0.001;
                            const isApplicable = availableBalance >= presetVal;
                            return (
                                <button
                                    key={presetVal}
                                    type="button"
                                    onClick={() => handlePresetAmount(presetVal)}
                                    disabled={availableBalance < MIN_WITHDRAWAL_AMOUNT}
                                    className={`px-2.5 py-1 rounded-[4px] text-xs font-bold transition cursor-pointer ${isSelected
                                        ? 'bg-[#ea580c] text-white shadow-2xs'
                                        : isApplicable
                                            ? 'bg-slate-100 hover:bg-orange-50 hover:text-[#ea580c] hover:border-orange-300 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                                            : 'bg-slate-50 text-slate-400 dark:bg-slate-900/40 dark:text-slate-600 border border-slate-100 dark:border-slate-800'
                                    }`}
                                >
                                    €{presetVal}{presetVal === MIN_WITHDRAWAL_AMOUNT ? ' (Min)' : ''}
                                </button>
                            );
                        })}
                        <button
                            type="button"
                            onClick={handleSetMax}
                            disabled={availableBalance < MIN_WITHDRAWAL_AMOUNT}
                            className={`px-2.5 py-1 rounded-[4px] text-xs font-bold transition cursor-pointer ${availableBalance >= MIN_WITHDRAWAL_AMOUNT && Math.abs(numAmount - availableBalance) < 0.001
                                ? 'bg-[#ea580c] text-white shadow-2xs'
                                : availableBalance >= MIN_WITHDRAWAL_AMOUNT
                                    ? 'bg-orange-50 hover:bg-orange-100 text-[#ea580c] border border-orange-200 dark:bg-orange-950/30 dark:border-orange-900/50'
                                    : 'bg-slate-50 text-slate-400 dark:bg-slate-900/40 dark:text-slate-600 border border-slate-100 dark:border-slate-800 opacity-60 cursor-not-allowed'
                            }`}
                        >
                            Max (€{availableBalance.toFixed(2)})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
