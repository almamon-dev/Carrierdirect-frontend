import React from "react";
import { CreditCard, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/button";

export const PaymentModalTitle: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 rounded-[3px] bg-[#ff4a1f]/10 text-[#ff4a1f] flex items-center justify-center shrink-0">
      <CreditCard size={18} />
    </div>
    <div>
      <h3 className="text-base font-bold text-slate-900 leading-tight">Add Payment Method</h3>
      <p className="text-xs font-medium text-slate-500 mt-0.5">
        Add a new credit or debit card for instant bookings.
      </p>
    </div>
  </div>
);

interface PaymentModalFooterProps {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PaymentModalFooter: React.FC<PaymentModalFooterProps> = ({
  isSubmitting,
  onClose,
  onSubmit,
}) => (
  <div className="w-full flex items-center justify-between">
    <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
      <ShieldCheck size={15} className="text-emerald-600" />
      <span>256-bit Encrypted</span>
    </div>

    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClose}
        className="h-8 px-3 text-xs font-semibold cursor-pointer"
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="primary"
        size="sm"
        isLoading={isSubmitting}
        disabled={isSubmitting}
        onClick={onSubmit}
        className="h-8 px-4 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
      >
        Save Card
      </Button>
    </div>
  </div>
);

export const PaymentTermsGuidelines: React.FC = () => (
  <div className="border-b border-slate-100 pb-3.5 space-y-2 text-xs">
    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
      <ShieldCheck size={16} className="text-[#ff4a1f]" />
      <span>Payment Terms & Guidelines</span>
    </div>
    <ul className="text-slate-600 font-medium space-y-2 text-xs leading-normal">
      <li className="flex items-start gap-2">
        <span className="text-[#ff4a1f] font-bold text-sm leading-none">•</span>
        <span>
          <strong>No Upfront Fees:</strong> Posting quote requests is 100% free. Your card will only
          be charged when you accept a carrier quote.
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-[#ff4a1f] font-bold text-sm leading-none">•</span>
        <span>
          <strong>Escrow Protection:</strong> Payments are securely held in escrow and released to
          the carrier only after Proof of Delivery (POD) is uploaded.
        </span>
      </li>
      <li className="flex items-start gap-2">
        <span className="text-[#ff4a1f] font-bold text-sm leading-none">•</span>
        <span>
          <strong>Supported Cards:</strong> We accept Visa, Mastercard, and American Express with 3D
          Secure 2.0 verification.
        </span>
      </li>
    </ul>
  </div>
);
