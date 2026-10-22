import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MoreVertical, FileText, ArrowRight, CreditCard } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { apiClient } from '@/lib/axios';

interface GroupedQuotesReceivedRowActionsProps {
  row: any;
}

export const GroupedQuotesReceivedRowActions: React.FC<GroupedQuotesReceivedRowActionsProps> = ({ row }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const rawReqId = row.rawRequestId || row.quote_request_id || row.rawId;
  const quotesCount = row.quotesCount || (row.quotes ? row.quotes.length : 1);

  const quotes: any[] = row.quotes || [];
  const awaitingPaymentQuote = quotes.find((q: any) => {
    const rawStatus = (q.status || '').toLowerCase().trim();
    const rawStatusRaw = (q.status_raw || '').toLowerCase().trim();
    const isBooked = rawStatus === 'booked' || rawStatusRaw === 'booked' || Boolean(q.is_booked || q.isBooked);
    return Boolean(
      q.is_awaiting_payment ||
      q.isAwaitingPayment ||
      rawStatus === 'awaiting_payment' ||
      rawStatusRaw === 'awaiting_payment' ||
      ((rawStatus === 'accepted' || rawStatusRaw === 'accepted') && !isBooked && !q.is_paid && !q.isPaid)
    );
  }) || (Boolean(row.is_awaiting_payment || row.isAwaitingPayment) ? row : null);

  const checkoutQuoteId = awaitingPaymentQuote ? (awaitingPaymentQuote.rawId || awaitingPaymentQuote.id) : null;

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: Math.max(10, rect.right - 192),
      });
      setIsOpen(true);
    }
  };

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    const handleScroll = () => handleClose();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  return (
    <div className="relative flex items-center justify-end gap-1 shrink-0">
      {checkoutQuoteId && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/customer/quotes/received/checkout/${encryptId(checkoutQuoteId)}`);
          }}
          title="Complete Payment for Accepted Quote"
          className="h-7 px-2 rounded-[3px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
        >
          <CreditCard size={12.5} className="shrink-0" />
          <span className="leading-none whitespace-nowrap">Pay Now</span>
        </button>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/customer/quotes/received/${encryptId(rawReqId)}`);
        }}
        title="View and Compare All Carrier Quotes"
        className="h-7 px-2 rounded-[3px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs cursor-pointer group shrink-0 whitespace-nowrap"
      >
        <span className="leading-none whitespace-nowrap">View Bids ({quotesCount})</span>
        <ChevronRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </button>

      <Button
        variant="ghost"
        size="sm"
        title="More Options"
        className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
        onClick={handleToggle}
      >
        <MoreVertical size={15} />
      </Button>

      {isOpen && (
        <div
          style={{ position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, zIndex: 9999 }}
          onClick={(e) => e.stopPropagation()}
          className="w-48 bg-white dark:bg-[#1e2329] rounded-[3px] shadow-lg border border-slate-200 dark:border-slate-700 py-1 text-xs animate-in fade-in-50 zoom-in-95 duration-100"
        >
          {checkoutQuoteId && (
            <button
              type="button"
              onClick={() => {
                handleClose();
                navigate(`/customer/quotes/received/checkout/${encryptId(checkoutQuoteId)}`);
              }}
              className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-2 font-bold cursor-pointer"
            >
              <CreditCard size={13} className="text-emerald-600" />
              <span>Complete Payment</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              handleClose();
              navigate(`/customer/quotes/received/${encryptId(rawReqId)}`);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 font-semibold cursor-pointer"
          >
            <ArrowRight size={13} className="text-[#ff4a1f]" />
            <span>Track & Compare Bids</span>
          </button>

          <button
            type="button"
            onClick={() => {
              handleClose();
              const cleanReqId = String(rawReqId).replace('REQ-', '');
              navigate(`/customer/quotes/create/view/${cleanReqId}`);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
          >
            <FileText size={13} className="text-slate-400" />
            <span>View Specifications</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              handleClose();
              const cleanReqId = String(rawReqId).replace(/[^0-9]/g, '').trim();
              if (!cleanReqId) return;
              try {
                const blob = await apiClient.getBlob(`/customer/quote-requests/${cleanReqId}/download-pdf`);
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `QuoteRequest-REQ-${cleanReqId.padStart(4, '0')}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                setTimeout(() => window.URL.revokeObjectURL(url), 1000);
              } catch (err) {
                console.error('Failed to download PDF:', err);
              }
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-2 cursor-pointer"
          >
            <FileText size={13} className="text-slate-400" />
            <span>Download Request PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};
