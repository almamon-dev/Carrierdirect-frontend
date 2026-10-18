import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

interface WithdrawFundsSummarySideProps {
    numAmount: number;
    method: 'stripe' | 'bank';
}

export function WithdrawFundsSummarySide({ numAmount, method }: WithdrawFundsSummarySideProps) {
    return (
        <div className="lg:col-span-5 space-y-3">
            {/* 1. Live Payout Summary Card */}
            <div className="rounded-[4px] border border-orange-200/90 dark:border-orange-950/60 bg-gradient-to-br from-orange-50/60 to-amber-50/30 dark:from-orange-950/20 dark:to-slate-900/40 p-3 sm:p-3.5 shadow-2xs space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-orange-200/50 dark:border-orange-900/40">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <FileText size={13} className="text-[#ea580c]" />
                        <span>Payout Disbursement Summary</span>
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded-[3px]">
                        0% Fee (Free Payout)
                    </span>
                </div>

                <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11.5px]">
                        <span>Requested Gross Amount:</span>
                        <span className="font-bold text-slate-900 dark:text-white">€{numAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11.5px]">
                        <span>Platform Processing Fee:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">€0.00 (Free)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11.5px]">
                        <span>Disbursement Method:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {method === 'stripe' ? 'Stripe Express Payout' : 'SEPA Bank Wire'}
                        </span>
                    </div>
                    <div className="pt-1.5 border-t border-orange-200/60 dark:border-orange-900/40 flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">Net Disbursement:</span>
                        <span className="text-base font-bold text-[#ea580c]">€{numAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="p-1.5 rounded-[4px] bg-white/80 dark:bg-slate-900/60 border border-orange-100 dark:border-orange-900/40 text-[10.5px] text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock size={12} className="text-[#ea580c] shrink-0" />
                    <span>Estimated transfer arrival: <strong>1–2 business days</strong></span>
                </div>
            </div>

            {/* 2. Comprehensive Withdrawal Terms & Conditions Card */}
            <div className="rounded-[4px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#12161c] p-3 sm:p-3.5 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-100 dark:border-slate-800">
                    <ShieldCheck size={14} className="text-[#ea580c]" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Withdrawal Terms & Policy
                    </h3>
                </div>

                <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    <li className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-1 shrink-0"></span>
                        <div>
                            <strong className="text-slate-800 dark:text-slate-200">Free Standard Payout:</strong> 0% fee is deducted from your withdrawal (100% of your earnings are disbursed directly to your bank account).
                        </div>
                    </li>
                    <li className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-1 shrink-0"></span>
                        <div>
                            <strong className="text-slate-800 dark:text-slate-200">Minimum Limit:</strong> Minimum withdrawal threshold is <strong>€50.00</strong>.
                        </div>
                    </li>
                    <li className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-1 shrink-0"></span>
                        <div>
                            <strong className="text-slate-800 dark:text-slate-200">Immediate Balance Lock:</strong> Funds are deducted immediately upon request to prevent overdrafts.
                        </div>
                    </li>
                    <li className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-1 shrink-0"></span>
                        <div>
                            <strong className="text-slate-800 dark:text-slate-200">Compliance Review:</strong> Requests undergo review within <strong>24–48 business hours</strong>.
                        </div>
                    </li>
                    <li className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] mt-1 shrink-0"></span>
                        <div>
                            <strong className="text-slate-800 dark:text-slate-200">Transfer Speed:</strong> Stripe Express deposits in 1–2 days; SEPA wires take 2–3 days.
                        </div>
                    </li>
                </ul>
            </div>

            {/* 3. Need Help Card */}
            <div className="p-2.5 rounded-[4px] bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <HelpCircle size={14} className="text-slate-500 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400">Questions about your earnings payout?</span>
                </div>
                <Link to="/support/tickets" className="text-[#ea580c] hover:underline font-bold text-xs shrink-0">
                    Contact Support
                </Link>
            </div>
        </div>
    );
}
