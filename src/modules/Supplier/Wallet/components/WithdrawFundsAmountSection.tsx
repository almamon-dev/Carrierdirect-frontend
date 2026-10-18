import React from 'react';
import { MIN_WITHDRAWAL_AMOUNT } from '../hooks/useWithdrawFundsState';

interface WithdrawFundsAmountSectionProps {
    amount: string;
    setAmount: (val: string) => void;
    availableBalance: number;
    numAmount: number;
    isBelowMin: boolean;
    isOverBalance: boolean;
    setError: (val: string | null) => void;
    handleSelectPreset: (preset: number) => void;
    handleSetMax: () => void;
}

const SUGGESTIONS = [50, 100, 250, 500];

export function WithdrawFundsAmountSection({
    amount,
    setAmount,
    availableBalance,
    numAmount,
    isBelowMin,
    isOverBalance,
    setError,
    handleSelectPreset,
    handleSetMax,
}: WithdrawFundsAmountSectionProps) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span>1. Withdrawal Amount (€)</span>
                    <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Min: €50.00
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
                    disabled={availableBalance < MIN_WITHDRAWAL_AMOUNT}
                    className={`w-full pl-8 pr-14 py-2 rounded-[4px] border text-base font-bold text-slate-900 dark:text-white bg-white dark:bg-[#1e2329] focus:outline-none transition ${isOverBalance || isBelowMin
                        ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-400'
                        : 'border-slate-200 dark:border-slate-700 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]'
                    } disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900`}
                    required
                />
                <button
                    type="button"
                    onClick={handleSetMax}
                    disabled={availableBalance < MIN_WITHDRAWAL_AMOUNT}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#ea580c] hover:underline cursor-pointer px-1 py-0.5 disabled:opacity-50"
                >
                    Max
                </button>
            </div>

            {isBelowMin && (
                <p className="text-[11px] text-rose-500 font-medium">
                    Minimum withdrawal amount is €{MIN_WITHDRAWAL_AMOUNT.toFixed(2)}.
                </p>
            )}
            {isOverBalance && (
                <p className="text-[11px] text-rose-500 font-medium">
                    Requested amount cannot exceed your available balance of €{availableBalance.toFixed(2)}.
                </p>
            )}

            {/* Quick Amount Suggestion Buttons */}
            <div className="pt-0.5 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                    Quick Amount Suggestions:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                    {SUGGESTIONS.map((val) => {
                        const isSelected = Math.abs(numAmount - val) < 0.001;
                        const canAfford = availableBalance >= val;
                        return (
                            <button
                                key={val}
                                type="button"
                                onClick={() => handleSelectPreset(val)}
                                disabled={availableBalance < MIN_WITHDRAWAL_AMOUNT}
                                className={`px-2.5 py-1 rounded-[4px] text-xs font-semibold transition cursor-pointer ${isSelected
                                    ? 'bg-[#ea580c] text-white shadow-2xs'
                                    : canAfford
                                        ? 'bg-slate-100 hover:bg-orange-50 hover:text-[#ea580c] hover:border-orange-300 text-slate-700 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                                        : 'bg-slate-50 text-slate-400 dark:bg-slate-900/40 dark:text-slate-600 border border-slate-100 dark:border-slate-800 opacity-60'
                                }`}
                            >
                                €{val}{val === MIN_WITHDRAWAL_AMOUNT ? ' (Min)' : ''}
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={handleSetMax}
                        disabled={availableBalance < MIN_WITHDRAWAL_AMOUNT}
                        className={`px-2.5 py-1 rounded-[4px] text-xs font-semibold transition cursor-pointer ${availableBalance >= MIN_WITHDRAWAL_AMOUNT && Math.abs(numAmount - availableBalance) < 0.001
                            ? 'bg-[#ea580c] text-white shadow-2xs'
                            : availableBalance >= MIN_WITHDRAWAL_AMOUNT
                                ? 'bg-orange-50 hover:bg-orange-100 text-[#ea580c] border border-orange-200 dark:bg-orange-950/30 dark:border-orange-900/50'
                                : 'bg-slate-50 text-slate-400 dark:bg-slate-900/40 dark:text-slate-600 border border-slate-100 dark:border-slate-800 opacity-60 cursor-not-allowed'
                        }`}
                    >
                        Max (€{availableBalance.toFixed(2)})
                    </button>
                </div>
                {numAmount > 0 && (
                    <div className="mt-2 flex items-center justify-between text-[11px] px-2.5 py-1.5 bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 rounded-[4px] text-slate-700 dark:text-slate-300">
                        <span>Withdrawal Fee: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">€0.00 (Free)</strong></span>
                        <span>Net Payout: <strong className="text-[#ea580c] font-bold">€{numAmount.toFixed(2)}</strong></span>
                    </div>
                )}
            </div>
        </div>
    );
}
