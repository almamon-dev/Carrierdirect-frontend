import React from 'react';
import { createPortal } from 'react-dom';
import { CreditCard, X, ShieldCheck, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import { CustomerPayLaterItem } from '../types';

interface PayLaterSettleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedInvoice: CustomerPayLaterItem | null;
  payLaterDays: number;
  isSubmitting: boolean;
  onConfirm: () => Promise<void>;
}

export const PayLaterSettleModal: React.FC<PayLaterSettleModalProps> = ({
  isOpen,
  onClose,
  selectedInvoice,
  payLaterDays,
  isSubmitting,
  onConfirm,
}) => {
  if (!isOpen || !selectedInvoice) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
      <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] max-w-sm w-full overflow-hidden shadow-2xl space-y-3">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <CreditCard size={14} className="text-[#ff4a1f]" /> Settle Invoice{' '}
            {selectedInvoice.invoice_number || selectedInvoice.id}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 rounded p-1 cursor-pointer disabled:opacity-50"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 space-y-2.5 text-xs">
          <div className="flex justify-between items-center p-2.5 rounded bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px]">Amount Due</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100">
                {selectedInvoice.gross_amount_formatted ||
                  selectedInvoice.total_amount_formatted ||
                  selectedInvoice.amount}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Order Ref</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                {selectedInvoice.order_number || selectedInvoice.orderId || '-'}
              </span>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-700 rounded p-2.5 space-y-1.5 bg-white dark:bg-[#12161c]">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block text-[11px]">
              Payment Facility
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 text-xs">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>Corporate Pay Later ({payLaterDays}-Day Credit)</span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                Auto Settle
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-8 px-4 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="h-8 px-4 text-xs font-semibold bg-[#ff4a1f] hover:bg-[#e03d15] text-white cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Check size={13} />
            <span>Confirm & Settle</span>
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PayLaterSettleModal;
