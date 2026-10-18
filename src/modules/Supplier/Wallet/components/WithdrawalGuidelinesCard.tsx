import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, ArrowRight } from 'lucide-react';

interface WithdrawalGuidelinesCardProps {
    availableBalanceNum: number;
}

export function WithdrawalGuidelinesCard({ availableBalanceNum }: WithdrawalGuidelinesCardProps) {
    const navigate = useNavigate();

    return (
        <div className="lg:col-span-5 flex flex-col justify-between rounded-[4px] border border-orange-200/90 dark:border-orange-950/60 bg-gradient-to-br from-orange-50/50 to-amber-50/30 dark:from-orange-950/20 dark:to-slate-900/40 p-3.5 sm:p-4 shadow-2xs h-full">
            <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-orange-200/60 dark:border-orange-900/50">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#ea580c]/15 text-[#ea580c] flex items-center justify-center shrink-0">
                            <Wallet size={12} />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                            Withdrawal Guidelines
                        </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-[#059669] dark:text-emerald-300 border border-[#a7f3d0] dark:border-emerald-800/60 text-[10.5px] font-semibold">
                        On Demand
                    </span>
                </div>

                {/* Instruction Guidelines */}
                <ul className="space-y-1.5 py-1 text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    <li className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-1.5 shrink-0"></span>
                        <span><strong className="text-slate-800 dark:text-slate-200">Minimum Threshold:</strong> Request withdrawal anytime your Available Balance reaches <strong>€50.00</strong>.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-1.5 shrink-0"></span>
                        <span><strong className="text-slate-800 dark:text-slate-200">Payout Destinations:</strong> Direct payout to your connected Stripe account or SEPA bank wire.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-1.5 shrink-0"></span>
                        <span><strong className="text-slate-800 dark:text-slate-200">Processing Speed:</strong> Verified in 24–48h; funds credited to your bank in 1–2 business days.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-1.5 shrink-0"></span>
                        <span><strong className="text-slate-800 dark:text-slate-200">10% Platform Fee:</strong> A 10% processing fee is deducted from the payout amount upon disbursement.</span>
                    </li>
                </ul>

                <div className="mt-2.5 p-2 rounded-[4px] bg-white/80 dark:bg-slate-900/60 border border-orange-100 dark:border-orange-900/40 flex items-center justify-between">
                    <span className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400">Ready to withdraw:</span>
                    <div className="text-right">
                        <span className="text-sm font-black text-[#ea580c]">
                            €{availableBalanceNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-orange-200/50 dark:border-orange-900/40 flex items-center justify-between">
                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">
                    {availableBalanceNum < 50 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Min €50.00 required</span>
                    ) : (
                        'No auto-payout deductions'
                    )}
                </span>
                {availableBalanceNum < 50 ? (
                    <button
                        type="button"
                        onClick={() => navigate('/supplier/wallet/withdraw')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-bold text-[#ea580c] hover:text-white bg-white hover:bg-[#ea580c] dark:bg-[#1e2329] dark:hover:bg-[#ea580c] border border-orange-200 dark:border-orange-800 transition cursor-pointer shadow-2xs"
                        title="Learn more about withdrawal terms & guidelines"
                    >
                        <span>Learn More</span>
                        <ArrowRight size={13} />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => navigate('/supplier/wallet/withdraw')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-bold text-white bg-[#ea580c] hover:bg-[#c2410c] dark:text-white transition cursor-pointer shadow-2xs"
                    >
                        <span>Withdraw Funds</span>
                        <ArrowRight size={13} />
                    </button>
                )}
            </div>
        </div>
    );
}
