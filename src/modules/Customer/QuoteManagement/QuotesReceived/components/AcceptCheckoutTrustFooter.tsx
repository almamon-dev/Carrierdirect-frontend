import React from 'react';
import { ShieldCheck, Lock, RotateCcw } from 'lucide-react';

export const AcceptCheckoutTrustFooter: React.FC = () => {
    return (
        <div className="space-y-4">
            {/* What happens next */}
            <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    What happens next?
                </p>
                <div className="space-y-2">
                    {[
                        "Payment authorization is safely locked in Escrow.",
                        "The carrier is notified and route is scheduled.",
                        "Live GPS tracking is activated once driver is en route.",
                        "Escrow released upon your proof of delivery sign-off.",
                    ].map((text, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full bg-[#ff4a1f] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                                <span className="text-[9px] font-bold text-white leading-none">{i + 1}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight pt-0.5">
                                {text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trust Badges Footer */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="space-y-1">
                    <ShieldCheck size={15} className="text-[#ff4a1f] mx-auto" />
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block">
                        Secure Escrow
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                        Guaranteed hold
                    </span>
                </div>

                <div className="space-y-1">
                    <Lock size={15} className="text-[#ff4a1f] mx-auto" />
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block">
                        256-Bit TLS
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                        Bank-grade security
                    </span>
                </div>

                <div className="space-y-1">
                    <RotateCcw size={15} className="text-[#ff4a1f] mx-auto" />
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block">
                        Dispute Cover
                    </span>
                    <span className="text-[9px] text-slate-400 block">
                        100% Refund guarantee
                    </span>
                </div>
            </div>

            {/* Legal Disclaimer */}
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
                By confirming, you agree to our{" "}
                <a href="/terms" target="_blank" className="underline hover:text-slate-600 dark:hover:text-slate-300">
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" target="_blank" className="underline hover:text-slate-600 dark:hover:text-slate-300">
                    Carrier Direct Escrow Agreement
                </a>
                .
            </p>
        </div>
    );
};
