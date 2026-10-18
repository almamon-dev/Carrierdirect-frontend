import React from 'react';
import { Building2 } from 'lucide-react';
import Input from '@/components/ui/input';

interface WithdrawModalMethodSectionProps {
    method: 'stripe' | 'bank';
    setMethod: (m: 'stripe' | 'bank') => void;
    isStripeConnected: boolean;
    stripeAccount?: {
        account_id?: string | null;
    };
    iban: string;
    setIban: (val: string) => void;
    accountHolder: string;
    setAccountHolder: (val: string) => void;
    bankName: string;
    setBankName: (val: string) => void;
}

export function WithdrawModalMethodSection({
    method,
    setMethod,
    isStripeConnected,
    stripeAccount,
    iban,
    setIban,
    accountHolder,
    setAccountHolder,
    bankName,
    setBankName,
}: WithdrawModalMethodSectionProps) {
    return (
        <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Payout Destination <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Stripe Option */}
                <div
                    onClick={() => setMethod('stripe')}
                    className={`p-3 rounded-[4px] border cursor-pointer transition flex flex-col justify-between ${
                        method === 'stripe'
                            ? 'border-[#ea580c] bg-orange-50/40 dark:bg-orange-950/20 ring-1 ring-[#ea580c]'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-[#1a202c]'
                    }`}
                >
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#635BFF]"></span>
                            <span>Stripe Connected</span>
                        </span>
                        <input
                            type="radio"
                            name="withdraw_method"
                            checked={method === 'stripe'}
                            onChange={() => setMethod('stripe')}
                            className="accent-[#ea580c]"
                        />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {isStripeConnected
                            ? `Direct to bank (${stripeAccount?.account_id || 'Active'})`
                            : 'Stripe Express Connected Account'}
                    </p>
                </div>

                {/* Direct Bank Option */}
                <div
                    onClick={() => setMethod('bank')}
                    className={`p-3 rounded-[4px] border cursor-pointer transition flex flex-col justify-between ${
                        method === 'bank'
                            ? 'border-[#ea580c] bg-orange-50/40 dark:bg-orange-950/20 ring-1 ring-[#ea580c]'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-[#1a202c]'
                    }`}
                >
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                            <Building2 size={14} className="text-emerald-600" />
                            <span>Bank Transfer (SEPA)</span>
                        </span>
                        <input
                            type="radio"
                            name="withdraw_method"
                            checked={method === 'bank'}
                            onChange={() => setMethod('bank')}
                            className="accent-[#ea580c]"
                        />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Direct wire to your business IBAN
                    </p>
                </div>
            </div>

            {/* Additional fields for direct bank transfer */}
            {method === 'bank' && (
                <div className="p-3 rounded-[4px] bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2 mt-2">
                    <div>
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                            IBAN / Account Number <span className="text-rose-500">*</span>
                        </label>
                        <Input
                            value={iban}
                            onChange={(e) => setIban(e.target.value)}
                            placeholder="GB29 NWBK 6016 1331 9268 19"
                            className="h-8 text-xs font-mono"
                            required={method === 'bank'}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                                Account Holder Name
                            </label>
                            <Input
                                value={accountHolder}
                                onChange={(e) => setAccountHolder(e.target.value)}
                                placeholder="Company / Personal Name"
                                className="h-8 text-xs"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                                Bank Name
                            </label>
                            <Input
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="Barclays / Revolut / etc."
                                className="h-8 text-xs"
                            />
                        </div>
                    </div>
                    <div className="p-2 rounded-[4px] bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10.5px] leading-snug">
                        <strong>Admin Review:</strong> Funds are deducted immediately and held in escrow. Admin will verify your bank details before releasing the SEPA transfer.
                    </div>
                </div>
            )}
        </div>
    );
}
