import React from 'react';
import { createPortal } from 'react-dom';
import { Check, ArrowRight, X } from 'lucide-react';
import Badge from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

export interface SubscriptionLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  featureName?: string;
  userType?: 'supplier' | 'customer';
  requiredPlan?: string;
  benefits?: string[];
  onUpgrade?: () => void;
}

export default function SubscriptionLockModal({
  isOpen,
  onClose,
  title = "Subscription Upgrade Required",
  description = "This feature requires an active subscription plan to post RFQs and access commercial tools.",
  featureName = "Quote Request Quota",
  userType = 'customer',
  requiredPlan = "Starter Shipper (€29/mo)",
  benefits = [
    "Unlimited Single Quote Requests & RFQs",
    "Multi-Carrier Quote Comparison & Price Breakdown",
    "Direct Carrier Live Chat & Negotiation",
    "Real-time Order Tracking & Digital POD (Challan)",
    "Secure Stripe Escrow Payments & Card Checkout"
  ],
  onUpgrade
}: SubscriptionLockModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    onClose();
    if (onUpgrade) {
      onUpgrade();
    } else {
      const targetPath = userType === 'customer' ? '/customer/subscription' : '/supplier/subscription';
      navigate(targetPath);
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-[99999] animate-fade-in font-sans"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1e2329] rounded-[4px] max-w-[420px] w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden relative transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Compact Clean Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3 bg-gradient-to-r from-orange-50/40 via-amber-50/15 to-transparent dark:from-orange-950/20">
          <div>
            <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-snug">{title}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-snug">{description}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-[3px] transition-colors cursor-pointer shrink-0 mt-0.5"
          >
            <X size={15} />
          </button>
        </div>

        {/* Compact Modal Body */}
        <div className="p-3.5 sm:p-4 space-y-3">

          {/* Minimal Plan Info Box */}
          <div className="p-2.5 bg-slate-50/90 dark:bg-[#161a1f] border border-slate-200/70 dark:border-slate-800 rounded-[4px] flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block">Locked Feature:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block text-[11.5px]">{featureName}</span>
            </div>
            <Badge className="bg-orange-50 dark:bg-orange-950/60 text-[#ff4a1f] border border-orange-200 dark:border-orange-800 text-[10.5px] font-bold px-2 py-0.5 rounded-[3px]">
              {requiredPlan}
            </Badge>
          </div>

          {/* Benefits */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">Plan benefits include:</span>
            <div className="space-y-1">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Check size={9.5} strokeWidth={3} />
                  </div>
                  <span className="leading-tight">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hyperlink Actions */}
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleUpgradeClick}
              className="text-[11.5px] font-semibold text-slate-600 dark:text-slate-400 hover:text-[#ff4a1f] dark:hover:text-[#ff4a1f] hover:underline inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Learn more & all packages</span>
              <ArrowRight size={11} />
            </button>
            <button
              type="button"
              onClick={handleUpgradeClick}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff4a1f] hover:text-[#e03e15] hover:underline cursor-pointer transition-colors py-1 px-1.5 rounded-[3px]"
            >
              <span>Upgrade Plan Now</span>
              <ArrowRight size={13} className="shrink-0" />
            </button>
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
}
