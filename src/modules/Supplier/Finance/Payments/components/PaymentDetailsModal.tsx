import React from "react";
import { 
  Receipt, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  MapPin, 
  ArrowRight,
  Download,
  ExternalLink
} from "lucide-react";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { formatDisplayDate } from "@/lib/utils";

interface PaymentDetailsModalProps {
  payment: any;
  onClose: () => void;
  onDownload: (row: any) => void;
}

export const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  payment,
  onClose,
  onDownload,
}) => {
  if (!payment) return null;

  const stage = (payment.payment_stage || "").toLowerCase();
  const isCleared = payment.is_cleared || stage === "cleared";
  const isInEscrow = payment.is_in_escrow || stage === "in_escrow";
  const isPayLater = payment.is_pay_later || stage === "pay_later";
  const daysLeft = payment.days_remaining_in_escrow;

  const invNumber = payment.invoice_number || (payment.id ? `INV-${String(payment.id).padStart(4, "0")}` : "INV-0001");
  const ordNumber = payment.order_number || payment.orderId || (payment.order_id ? `ORD-${String(payment.order_id).padStart(4, "0")}` : null);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
      <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg max-w-lg w-full overflow-hidden shadow-2xl space-y-4">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-[#ff4a1f]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Payment & Settlement Details
              </h3>
              <p className="text-[11px] text-slate-500">
                {invNumber} • {ordNumber || "Order"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-1 space-y-3.5 text-xs">
          {/* Status Banner */}
          <div className={`p-3 rounded-md border flex items-center gap-2.5 ${
            isCleared ? "bg-emerald-50/70 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800/60 dark:text-emerald-300" :
            isInEscrow ? "bg-sky-50/70 border-sky-200 text-sky-900 dark:bg-sky-950/30 dark:border-sky-800/60 dark:text-sky-300" :
            "bg-amber-50/70 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800/60 dark:text-amber-300"
          }`}>
            {isCleared && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
            {isInEscrow && <ShieldCheck size={16} className="text-sky-600 shrink-0" />}
            {isPayLater && <Clock size={16} className="text-amber-600 shrink-0" />}
            <div>
              <p className="font-bold text-xs">{payment.payment_stage_label || (isCleared ? "Cleared & Available" : isInEscrow ? "Held in Escrow" : "Pending")}</p>
              <p className="text-[10.5px] opacity-80">
                {isCleared ? "Funds are settled and ready in your balance for immediate withdrawal." :
                 isInEscrow ? `Funds are secured by CarrierDirect escrow. ${daysLeft > 0 ? `${daysLeft} days remaining before auto-clearing.` : "Pending auto-clearance."}` :
                 "Customer payment is under Pay Later (30-day net terms) or direct bank transfer."}
              </p>
            </div>
          </div>

          {/* Client & Route Breakdown */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-md border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Customer / Client</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{payment.customer_company || payment.customer_name || "Direct Customer"}</p>
              <p className="text-[11px] text-slate-500">{payment.customer_name || payment.customer_email || "Customer"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Route & Timing</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate">{payment.route || "Direct Transit"}</p>
              <p className="text-[11px] text-slate-500">Issued: {formatDisplayDate(payment.issue_date || payment.date || payment.created_at)}</p>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-1.5 p-3 rounded-md border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Financial Breakdown</p>
            <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <span>Gross Freight Fare:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{payment.gross_amount_formatted || (payment.gross_amount ? `€ ${Number(payment.gross_amount).toFixed(2)}` : "€ 0.00")}</span>
            </div>
            <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <span>Platform Fee (5%):</span>
              <span className="font-medium text-rose-600">- {payment.platform_fee_formatted || (payment.platform_fee ? `€ ${Number(payment.platform_fee).toFixed(2)}` : "€ 0.00")}</span>
            </div>
            <div className="flex justify-between py-1.5 text-slate-900 dark:text-slate-100 font-bold bg-slate-50 dark:bg-slate-900/60 px-2 rounded">
              <span className="text-emerald-600 dark:text-emerald-400">Net Supplier Earnings:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">{payment.supplier_amount_formatted || payment.net_amount_formatted || (payment.supplier_amount ? `€ ${Number(payment.supplier_amount).toFixed(2)}` : "€ 0.00")}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 bg-slate-50/70 dark:bg-slate-900/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload(payment)}
            className="text-xs font-semibold gap-1.5 cursor-pointer"
          >
            <Download size={13} />
            <span>Download PDF</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold px-4 bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
