import React from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

interface CustomerCancelModalProps {
  isOpen: boolean;
  isCanceling: boolean;
  confirmationText: string;
  onConfirmationTextChange: (text: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export const CustomerCancelModal: React.FC<CustomerCancelModalProps> = ({
  isOpen,
  isCanceling,
  confirmationText,
  onConfirmationTextChange,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || typeof document === "undefined") return null;

  const isConfirmed = confirmationText.trim().toUpperCase() === "CANCEL";

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="fixed inset-0" onClick={() => !isCanceling && onClose()} />
      <div className="relative z-10 bg-white dark:bg-[#181d24] rounded-lg max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4 font-sans animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900/40">
            <AlertTriangle size={18} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Cancel Subscription?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to cancel your subscription? Your access will remain active until the end of your current billing period.
            </p>
          </div>
        </div>

        <div>
          <Input
            label='To confirm, please type "CANCEL" *'
            autoFocus
            value={confirmationText}
            onChange={(e) => onConfirmationTextChange(e.target.value)}
            placeholder='Type "CANCEL" to confirm'
            className="font-semibold uppercase tracking-wider"
            rightIcon={
              isConfirmed ? (
                <CheckCircle2 size={15} className="text-emerald-500" />
              ) : undefined
            }
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            disabled={isCanceling}
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[4px] cursor-pointer transition-colors"
          >
            Keep Subscription
          </button>
          <Button
            type="button"
            disabled={!isConfirmed || isCanceling}
            isLoading={isCanceling}
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-[4px] cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs"
          >
            <span>Confirm Cancellation</span>
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CustomerCancelModal;
