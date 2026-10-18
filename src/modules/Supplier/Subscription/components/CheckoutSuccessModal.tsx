import React, { useState } from "react";
import { CheckCircle2, Download, Rocket, Loader2 } from "lucide-react";
import Modal from "@/components/modals/modal";
import Button from "@/components/ui/button";
import apiClient from "@/lib/axios";
import { useToastStore } from "@/stores/useToastStore";

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  planName?: string;
  onGoToDashboard: () => void;
}

export function CheckoutSuccessModal({
  isOpen,
  onClose,
  data,
  planName,
  onGoToDashboard,
}: CheckoutSuccessModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  const handleDownloadInvoice = async () => {
    const invId = data?.invoice_id || data?.id;
    if (!invId) return;
    setIsDownloading(true);
    try {
      const blob = await apiClient.getBlob(`/subscription/invoices/${invId}/download`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${data?.invoice_number || invId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast("Invoice downloaded successfully", "success");
    } catch {
      showToast("Failed to download invoice", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
          <CheckCircle2 size={26} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Subscription Activated!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            You are now subscribed to <span className="font-bold text-slate-800 dark:text-slate-200">{planName || "the plan"}</span>.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 text-left font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Transaction ID:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{data?.payment_intent_id?.slice(-8) || "TXN-OK"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Invoice Ref:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{data?.invoice_number || "INV-LATEST"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Amount Paid:</span>
            <span className="font-bold text-emerald-600">{data?.amount ? `€${Number(data.amount).toFixed(2)}` : "Paid"}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          {data?.invoice_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadInvoice}
              disabled={isDownloading}
              className="w-full h-8.5 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              {isDownloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              <span>Download Tax Invoice</span>
            </Button>
          )}

          <Button
            size="sm"
            onClick={onGoToDashboard}
            className="w-full h-8.5 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center justify-center gap-1.5"
          >
            <Rocket size={13} />
            <span>Go to Supplier Dashboard</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
}
export default CheckoutSuccessModal;
