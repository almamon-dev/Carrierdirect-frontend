import React from "react";
import { createPortal } from "react-dom";
import { ArrowRight, CheckCircle2, Download, Loader2 } from "lucide-react";
import Button from "@/components/ui/button";

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  successData: any;
  selectedPlan: any;
  totalAmount: number;
  isDownloadingInvoice: boolean;
  onDownloadInvoice: () => void;
  onGoToDashboard: () => void;
}

export const CheckoutSuccessModal: React.FC<CheckoutSuccessModalProps> = ({
  isOpen,
  successData,
  selectedPlan,
  totalAmount,
  isDownloadingInvoice,
  onDownloadInvoice,
  onGoToDashboard,
}) => {
  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-fade-in font-sans">
      <div className="bg-white dark:bg-[#1e2329] rounded-[4px] max-w-[390px] w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-5 text-center space-y-3.5 relative overflow-hidden animate-in fade-in zoom-in-95">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center border-4 border-emerald-50 dark:border-emerald-900/40 shadow-inner">
          <CheckCircle2 size={26} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
        </div>

        <div>
          <span className="inline-block bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10.5px] font-bold mb-1 px-2.5 py-0.5 rounded-[3px]">
            Payment Confirmed
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
            Subscription Activated!
          </h3>
          <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
            Welcome to <span className="font-bold text-slate-900 dark:text-slate-100">{successData?.plan_name || selectedPlan?.name}</span>. Your tools and quota are now active.
          </p>
        </div>

        {/* Receipt Summary Box */}
        <div className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-[4px] border border-slate-200/80 dark:border-slate-700/60 text-left text-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Invoice Number:</span>
            <span className="font-mono font-bold text-[11px] text-slate-900 dark:text-slate-100 truncate text-right">
              {successData?.invoice_number || "SUB-2026-9871"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Amount Paid:</span>
            <span className="font-mono font-bold text-[11.5px] text-emerald-600 dark:text-emerald-400 text-right">
              {successData?.amount_formatted || `€${totalAmount.toFixed(2)}`}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Payment Method:</span>
            <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 text-right">
              {successData?.payment_method || "Credit Card"}
            </span>
          </div>
          {successData?.expires_at && (
            <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">Next Renewal:</span>
              <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 text-right">
                {(() => {
                  try {
                    const d = new Date(successData.expires_at);
                    if (!isNaN(d.getTime())) {
                      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    }
                  } catch {}
                  return String(successData.expires_at).split(" ")[0] || successData.expires_at;
                })()}
              </span>
            </div>
          )}
        </div>

        <div className="pt-2 grid grid-cols-2 gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={isDownloadingInvoice}
            onClick={onDownloadInvoice}
            className="h-9 px-2 text-xs font-semibold border border-slate-300 dark:border-slate-700 rounded-[3px] hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors truncate"
          >
            {isDownloadingInvoice ? (
              <Loader2 size={13} className="shrink-0 animate-spin text-[#2563eb]" />
            ) : (
              <Download size={13} className="shrink-0" />
            )}
            <span className="truncate">
              {isDownloadingInvoice ? "Downloading..." : "Tax Invoice"}
            </span>
          </Button>
          <Button
            variant="primary"
            className="h-9 px-2 text-xs font-bold bg-[#2563eb] hover:bg-[#1d4ed8] text-white cursor-pointer shadow-xs flex items-center justify-center gap-1.5 rounded-[3px] truncate"
            onClick={onGoToDashboard}
          >
            <span className="truncate">Dashboard</span>
            <ArrowRight size={13} className="shrink-0" />
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CheckoutSuccessModal;
