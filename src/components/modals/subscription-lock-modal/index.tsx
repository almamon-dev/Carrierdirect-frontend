import React from 'react';
import { createPortal } from 'react-dom';
import { Lock, Check, ArrowRight, X } from 'lucide-react';
import Button from '@/components/ui/button';
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
}

export default function SubscriptionLockModal({
  isOpen,
  onClose,
  title = "Subscription Upgrade Required",
  description = "This feature requires an active subscription plan to post RFQs and access commercial tools.",
  featureName = "RFQ Posting Quota",
  userType = 'supplier',
  requiredPlan = "Business Plan (€39/mo)",
  benefits = [
    "Unlimited Monthly Freight RFQ Postings",
    "Corporate Pay Later Credit Line (30-Day Terms)",
    "Priority Placement for Verified Carriers",
    "Unlimited Saved Locations & Warehouses"
  ]
}: SubscriptionLockModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    onClose();
    const targetPath = userType === 'customer' ? '/customer/subscription' : '/supplier/subscription';
    navigate(targetPath);
  };

  return createPortal(
    <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-[99999] animate-fade-in font-sans">
      <div className="bg-white rounded-md max-w-md w-full border border-slate-200 shadow-xl overflow-hidden relative">

        {/* Clean Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">

          {/* Minimal Plan Info Box */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 font-medium block">Locked feature:</span>
              <span className="font-bold text-slate-900 mt-0.5 block">{featureName}</span>
            </div>
            <Badge className="bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-2.5 py-1">
              {requiredPlan}
            </Badge>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">Plan benefits include:</span>
            <div className="space-y-1.5">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-1/3 h-9 text-xs font-semibold text-slate-600 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpgradeClick}
              className="w-2/3 h-9 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Upgrade Plan Now</span>
              <ArrowRight size={14} />
            </Button>
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
}
