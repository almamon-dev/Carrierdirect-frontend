import React from 'react';
import { Building2, Info } from 'lucide-react';
import Input from '@/components/ui/input';

interface WithdrawFundsDestinationSectionProps {
    method: 'stripe' | 'bank';
    setMethod: (m: 'stripe' | 'bank') => void;
    isStripeConnected: boolean;
    stripeAccount: any;
    iban: string;
    setIban: (val: string) => void;
    accountHolder: string;
    setAccountHolder: (val: string) => void;
    bankName: string;
    setBankName: (val: string) => void;
}

export function WithdrawFundsDestinationSection({
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
}: WithdrawFundsDestinationSectionProps) {
    return (
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                2. Select Disbursement Destination <span className="text-rose-500">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Stripe Express Option */}
                <div
                    onClick={() => setMethod('stripe')}
                    className={`p-2.5 sm:p-3 rounded-[4px] border cursor-pointer transition flex flex-col justify-between ${method === 'stripe'
                        ? 'border-[#ea580c] bg-orange-50/40 dark:bg-orange-950/20 ring-1 ring-[#ea580c]'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-[#1a202c]'
                    }`}
                >
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#635BFF]"></span>
                            <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                                Stripe Express Payout
                            </span>
                        </div>
                        <input
                            type="radio"
                            name="withdraw_method"
                            checked={method === 'stripe'}
                            onChange={() => setMethod('stripe')}
                            className="accent-[#ea580c]"
                        />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 leading-snug">
                        Automated bank transfer directly via your verified connected Stripe account.
                    </p>
                    <div className="text-[10.5px] font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span>Status:</span>
                        {isStripeConnected ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                                <span>Connected ({stripeAccount?.account_id || 'Active'})</span>
                            </span>
                        ) : (
                            <span className="text-amber-600 font-bold">Not Connected</span>
                        )}
                    </div>
                </div>

                {/* Direct Bank Transfer Option */}
                <div
                    onClick={() => setMethod('bank')}
                    className={`p-2.5 sm:p-3 rounded-[4px] border cursor-pointer transition flex flex-col justify-between ${method === 'bank'
                        ? 'border-[#ea580c] bg-orange-50/40 dark:bg-orange-950/20 ring-1 ring-[#ea580c]'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-[#1a202c]'
                    }`}
                >
                    <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                            <Building2 size={14} className="text-emerald-600" />
                            <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                                Bank Wire (SEPA Transfer)
                            </span>
                        </div>
                        <input
                            type="radio"
                            name="withdraw_method"
                            checked={method === 'bank'}
                            onChange={() => setMethod('bank')}
                            className="accent-[#ea580c]"
                        />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 leading-snug">
                        Manual wire transfer directly to your company IBAN by the finance team.
                    </p>
                    <div className="text-[10.5px] font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span>Processing:</span>
                        <span className="text-slate-600 dark:text-slate-400 font-semibold">Manual SEPA Wire</span>
                    </div>
                </div>
            </div>

            {/* Additional bank inputs when method is bank */}
            {method === 'bank' && (
                <div className="p-2.5 sm:p-3 rounded-[4px] bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-2 mt-1.5">
                    <div>
                        <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                            IBAN / Account Number <span className="text-rose-500">*</span>
                        </label>
                        <Input
                            value={iban}
                            onChange={(e) => setIban(e.target.value)}
                            placeholder="e.g. GB29 NWBK 6016 1331 9268 19"
                            className="h-8 text-xs font-mono"
                            required={method === 'bank'}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                                Account Holder Name
                            </label>
                            <Input
                                value={accountHolder}
                                onChange={(e) => setAccountHolder(e.target.value)}
                                placeholder="Company or Beneficiary Name"
                                className="h-8 text-xs"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                                Bank Name
                            </label>
                            <Input
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="Barclays, Revolut, Santander, etc."
                                className="h-8 text-xs"
                            />
                        </div>
                    </div>
                    <div className="p-2 rounded-[4px] bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] flex items-start gap-1.5 leading-snug">
                        <Info size={13} className="shrink-0 text-amber-600 mt-0.5" />
                        <span>
                            <strong>Admin Escrow Hold & Verification:</strong> Once requested, the funds are immediately deducted from your Available Balance and held. Admin will review your IBAN and release the wire transfer.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
