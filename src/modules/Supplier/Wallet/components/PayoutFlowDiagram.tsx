import React from 'react';
import { CreditCard, PackageCheck, Wallet, Building2, CheckCircle2 } from 'lucide-react';

export default function PayoutFlowDiagram() {
    const steps = [
        {
            num: 1,
            title: '1. Customer Payment',
            desc: 'Customer pays for the order securely on CarrierDirect.',
            icon: CreditCard,
            color: 'bg-orange-50 text-[#ea580c] border-orange-200',
        },
        {
            num: 2,
            title: '2. Delivery & POD Approval',
            desc: 'Once POD is confirmed, net earnings clear into your Available Balance.',
            icon: PackageCheck,
            color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        },
        {
            num: 3,
            title: '3. Request Manual Withdrawal',
            desc: 'You manually request a withdrawal whenever you want to payout.',
            icon: Wallet,
            color: 'bg-blue-50 text-blue-600 border-blue-200',
        },
        {
            num: 4,
            title: '4. Bank / Stripe Payout',
            desc: 'Funds are disbursed directly to your connected bank or Stripe account.',
            icon: Building2,
            color: 'bg-purple-50 text-purple-600 border-purple-200',
        },
    ];

    return (
        <div className="bg-white dark:bg-[#12161c] rounded-[6px] border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 md:p-6 shadow-2xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 text-center">
                Manual Withdrawal Flow
            </h3>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                {steps.map((s, idx) => {
                    const Icon = s.icon;
                    return (
                        <div
                            key={s.num}
                            className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 transition-all hover:shadow-xs relative"
                        >
                            {/* Connector indicator for larger screens */}
                            {idx < steps.length - 1 && (
                                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-600 font-bold text-lg select-none">
                                    →
                                </div>
                            )}

                            <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-3 border ${s.color}`}>
                                <Icon size={20} />
                            </div>

                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-1">
                                {s.title}
                            </h4>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                {s.desc}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Footer Note */}
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/40 text-orange-950 dark:text-orange-300 text-xs">
                <CheckCircle2 size={16} className="text-[#ea580c] shrink-0" />
                <div>
                    <span className="font-bold">Manual On-Demand Withdrawal:</span>{' '}
                    <span>
                        Your earnings accumulate in your CarrierDirect Available Balance. You have complete control to manually withdraw your balance whenever you wish.
                    </span>
                </div>
            </div>
        </div>
    );
}
