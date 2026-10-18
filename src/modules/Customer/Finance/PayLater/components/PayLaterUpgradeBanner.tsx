import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import Button from '@/components/ui/button';

interface PayLaterUpgradeBannerProps {
  onUpgrade: () => void;
}

export const PayLaterUpgradeBanner: React.FC<PayLaterUpgradeBannerProps> = ({ onUpgrade }) => {
  return (
    <div className="bg-gradient-to-r from-purple-500/10 via-amber-500/10 to-orange-500/5 border border-purple-300/50 dark:border-purple-800/40 rounded-[4px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5 border border-purple-200/50 dark:border-purple-800/50">
          <Lock size={16} />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Corporate Pay-Later Requires Growth Logistics Plan
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60">
              Growth / Enterprise
            </span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed max-w-3xl">
            Corporate Net-30 credit terms, monthly consolidated invoicing, and instant booking without
            upfront card charges are exclusively available on Growth Logistics (€79/mo) and Enterprise
            plans. Upgrade to unlock your corporate credit line.
          </p>
        </div>
      </div>
      <Button
        size="sm"
        onClick={onUpgrade}
        className="shrink-0 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold px-4 h-8 flex items-center gap-1.5 cursor-pointer shadow-2xs ml-auto sm:ml-0"
      >
        <Sparkles size={13} />
        <span>Upgrade Plan</span>
      </Button>
    </div>
  );
};

export default PayLaterUpgradeBanner;
