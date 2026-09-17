import React, { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { 
  Eye, 
  Download, 
  MoreVertical, 
  Copy, 
  Check, 
  ExternalLink,
  Receipt
} from "lucide-react";
import Button from "@/components/ui/button";

interface PaymentRowActionsProps {
  row: any;
  onViewDetails: (row: any) => void;
  onDownload: (row: any) => void;
}

export const PaymentRowActions: React.FC<PaymentRowActionsProps> = ({
  row,
  onViewDetails,
  onDownload,
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [copiedInv, setCopiedInv] = useState(false);
  const [copiedOrder, setCopiedOrder] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const invNumber = row.invoice_number || (row.id ? `INV-${String(row.id).padStart(4, "0")}` : "INV-0001");
  const ordNumber = row.order_number || row.orderId || (row.order_id ? `ORD-${String(row.order_id).padStart(4, "0")}` : null);
  const ordId = row.order_id || ordNumber;

  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: Math.max(10, rect.right - 210)
      });
      setIsOpen(true);
    }
  };

  const handleCopyInv = () => {
    navigator.clipboard.writeText(invNumber);
    setCopiedInv(true);
    setTimeout(() => {
      setCopiedInv(false);
      handleClose();
    }, 1200);
  };

  const handleCopyOrder = () => {
    if (!ordNumber) return;
    navigator.clipboard.writeText(ordNumber);
    setCopiedOrder(true);
    setTimeout(() => {
      setCopiedOrder(false);
      handleClose();
    }, 1200);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    const handleScroll = () => handleClose();
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, handleClose]);

  return (
    <div className="relative flex items-center justify-end w-full min-h-[22px]">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="sm"
        className="h-[25px] w-[25px] p-0 rounded-[3px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
        onClick={handleToggle}
        title="More Actions"
      >
        <MoreVertical size={14} />
      </Button>

      {isOpen && createPortal(
        <>
          <div
            className="fixed inset-0 z-[9998] cursor-default bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
          />
          <div
            className="fixed w-52 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Settlement Actions</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 truncate text-xs">{invNumber}</p>
            </div>

            <button
              type="button"
              className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
              onClick={() => {
                handleClose();
                onViewDetails(row);
              }}
            >
              <Eye size={14} className="text-slate-400 shrink-0" />
              <span>View Payment Details</span>
            </button>

            <button
              type="button"
              className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
              onClick={() => {
                handleClose();
                onDownload(row);
              }}
            >
              <Download size={14} className="text-[#ff4a1f] shrink-0" />
              <span>Download Receipt</span>
            </button>

            {ordId && (
              <button
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                onClick={() => {
                  handleClose();
                  navigate(`/supplier/orders/${ordId}`);
                }}
              >
                <ExternalLink size={14} className="text-slate-400 shrink-0" />
                <span>Go to Order Details</span>
              </button>
            )}

            <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

            <button
              type="button"
              className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
              onClick={handleCopyInv}
            >
              {copiedInv ? (
                <>
                  <Check size={14} className="text-emerald-500 shrink-0" />
                  <span className="text-emerald-600 font-semibold">Copied ID!</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-slate-400 shrink-0" />
                  <span>Copy Invoice ID</span>
                </>
              )}
            </button>

            {ordNumber && (
              <button
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                onClick={handleCopyOrder}
              >
                {copiedOrder ? (
                  <>
                    <Check size={14} className="text-emerald-500 shrink-0" />
                    <span className="text-emerald-600 font-semibold">Copied Order!</span>
                  </>
                ) : (
                  <>
                    <Receipt size={14} className="text-slate-400 shrink-0" />
                    <span>Copy Order Ref</span>
                  </>
                )}
              </button>
            )}
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default PaymentRowActions;
