import React from "react";
import { Lock, RotateCcw, ShieldCheck } from "lucide-react";

export const CheckoutTrustBadges: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-3 gap-1.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-center">
        <div className="space-y-0.5">
          <ShieldCheck size={14} className="text-blue-600 mx-auto" />
          <span className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 block leading-none">Secure payment</span>
          <span className="text-[8.5px] text-slate-400 block leading-none">Stripe 256-bit</span>
        </div>
        <div className="space-y-0.5">
          <Lock size={14} className="text-blue-600 mx-auto" />
          <span className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 block leading-none">Data protected</span>
          <span className="text-[8.5px] text-slate-400 block leading-none">SSL Encrypted</span>
        </div>
        <div className="space-y-0.5">
          <RotateCcw size={14} className="text-blue-600 mx-auto" />
          <span className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 block leading-none">Cancel anytime</span>
          <span className="text-[8.5px] text-slate-400 block leading-none">No lock-in</span>
        </div>
      </div>

      <p className="text-[9.5px] text-slate-400 dark:text-slate-500 text-center leading-normal">
        By subscribing, you agree to our{" "}
        <a href="/terms" target="_blank" className="underline hover:text-slate-600 dark:hover:text-slate-300">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" target="_blank" className="underline hover:text-slate-600 dark:hover:text-slate-300">
          Privacy Policy
        </a>
        .
      </p>
    </>
  );
};

export default CheckoutTrustBadges;
