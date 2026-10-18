import React from 'react';
import { Info } from 'lucide-react';

const HOW_IT_WORKS_STEPS = [
    {
        num: 1,
        title: 'Customer makes payment',
        desc: 'Customer pays for the order on CarrierDirect.',
        bg: 'bg-amber-500 text-white',
    },
    {
        num: 2,
        title: 'Delivery & POD approval',
        desc: 'Once delivery is completed and POD is approved, your earnings are released.',
        bg: 'bg-blue-600 text-white',
    },
    {
        num: 3,
        title: 'Automatic transfer to your Stripe account',
        desc: 'When you request a withdrawal, your funds can be transferred to your connected Stripe account.',
        bg: 'bg-purple-600 text-white',
    },
    {
        num: 4,
        title: 'Stripe payout to your bank',
        desc: 'Funds are disbursed directly to your connected bank account upon manual withdrawal.',
        bg: 'bg-indigo-600 text-white',
    },
];

export function HowItWorksCard() {
    return (
        <div className="lg:col-span-5 rounded-[4px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#12161c] p-3.5 sm:p-4 shadow-2xs">
            <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                    <Info size={13} />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                    How it works?
                </h3>
            </div>

            <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:left-2.5 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                {HOW_IT_WORKS_STEPS.map((step) => (
                    <div key={step.num} className="flex items-start gap-3 relative z-10 text-xs">
                        <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10.5px] font-bold shadow-2xs ${step.bg}`}>
                            {step.num}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {step.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                {step.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
