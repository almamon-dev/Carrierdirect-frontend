import React, { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import Modal from "@/components/modals/modal";
import Button from "@/components/ui/button";

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  planName?: string;
  daysRemaining?: number;
}

export const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  planName = "your plan",
  daysRemaining = 0,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Cancel Subscription
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to cancel your {planName}?
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          You will retain full access to quote requests, cargo tracking, and billing receipts until your current billing cycle ends ({daysRemaining} days remaining). Auto-renewal will be turned off.
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-8 px-3 text-xs font-semibold"
          >
            Keep Plan
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="h-8 px-3 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={13} className="animate-spin mr-1.5" />
                <span>Cancelling...</span>
              </>
            ) : (
              "Yes, Cancel Subscription"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelSubscriptionModal;
