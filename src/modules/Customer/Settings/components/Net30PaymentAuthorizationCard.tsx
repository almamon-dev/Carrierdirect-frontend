import React from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, CreditCard } from "lucide-react";

interface Net30PaymentAuthorizationCardProps {
  hasLinkedCard: boolean;
  onLinkCard: () => void;
  primaryCardLast4?: string;
}

export const Net30PaymentAuthorizationCard: React.FC<Net30PaymentAuthorizationCardProps> = ({
  hasLinkedCard,
  onLinkCard,
  primaryCardLast4,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-[4px] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
      {/* Header matching screenshot */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-[4px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
          <ShieldCheck size={15} />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
            Net-30 Payment Authorization
          </h3>
          <p className="text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
            Link and authorize a card for Pay Later / Net-30 bookings.
          </p>
        </div>
      </div>

      {/* Body: Not Linked vs Linked */}
      {!hasLinkedCard ? (
        <div className="bg-[#fffdf7] dark:bg-amber-950/20 border border-[#fef3c7] dark:border-amber-900/50 rounded-[4px] p-2.5 sm:px-3 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <h4 className="text-xs font-bold text-[#78350f] dark:text-amber-200 leading-tight">
                No Pay Later Card Linked
              </h4>
              <p className="text-[10.5px] text-[#92400e] dark:text-amber-300/80 mt-0.5 leading-snug">
                You need to link and authorize a card for Net-30 bookings and instant escrow dispatches.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLinkCard}
            className="h-[30px] px-3 bg-white dark:bg-slate-900 border border-[#ff4a1f] text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-orange-950/30 text-xs font-semibold rounded-[4px] inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <CreditCard size={13} />
            <span>Link Pay Later Card</span>
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 rounded-[4px] p-2.5 sm:px-3 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-100 leading-tight">
                Pay Later Card Authorized
              </h4>
              <p className="text-[10.5px] text-emerald-700 dark:text-emerald-300/80 mt-0.5 leading-snug">
                {primaryCardLast4
                  ? `Card ending in •••• ${primaryCardLast4} is authorized as backup guarantee for Net-30 bookings.`
                  : "Your primary card is authorized as backup guarantee for Net-30 bookings."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLinkCard}
            className="h-[30px] px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-[4px] inline-flex items-center justify-center gap-1.5 shadow-2xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <CreditCard size={13} />
            <span>Change Linked Card</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Net30PaymentAuthorizationCard;
