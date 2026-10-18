import React from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { 
    Eye, 
    Tag, 
    CreditCard, 
    MessageSquare,
    XCircle,
    FileDown 
} from "lucide-react";
import { buildSecureQuoteUrl } from "@/utils/urlSecurity";
import { encryptId } from "@/lib/encryption";

interface ProcessingRowActionsMenuProps {
    isOpen: boolean;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    dropdownPos: { top: number; left: number };
    row: any;
    onClose: () => void;
    onTrack?: () => void;
    onDelete?: (row: any) => void;
}

export const ProcessingRowActionsMenu: React.FC<ProcessingRowActionsMenuProps> = ({
    isOpen,
    dropdownRef,
    dropdownPos,
    row,
    onClose,
    onDelete,
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const rawId = String(row.rawId || row.id || "").replace("REQ-", "").replace("ORD-", "");
    const quotesCount = Number(row.bidsCount || row.quotesCount || row.quotesReceived || 0);
    const s = String(row.rawStatus || row.status || "").toLowerCase();
    const canCancel = !["booked", "completed", "cancelled", "expired"].includes(s);
    const isBookingInProgress = s === "booking_in_progress" || s === "payment_pending" || Boolean(row.accepted_quote_id);
    const hasNegotiation = Boolean(
        row.hasNegotiation ||
        row.has_negotiation ||
        row.negotiation_id ||
        row.negotiationId ||
        row.negotiation ||
        s.includes("negotiat")
    );

    const pdfUrl = (row as any).pdf_url || (row as any).pdf_path || (row as any).attachment_url || (row as any).pdfUrl || (row as any).pdf_document_url || (row as any).packingList?.url || (row as any).commercialInvoice?.url || "";
    const hasPdf = Boolean(pdfUrl);

    return createPortal(
        <div 
            ref={dropdownRef}
            className="fixed min-w-[200px] w-max max-w-[calc(100vw-16px)] bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans overflow-hidden"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* 1. View Details */}
            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer whitespace-nowrap" 
                onClick={() => { 
                    onClose(); 
                    navigate(buildSecureQuoteUrl(rawId || row.id, "view")); 
                }}
            >
                <Eye size={14} className="text-slate-400 shrink-0" />
                <span className="whitespace-nowrap">View Details</span>
            </button>

            {/* 2. View Quotes — when quotes are available */}
            {quotesCount > 0 && (
                <button 
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer whitespace-nowrap"
                    onClick={() => {
                        onClose();
                        navigate(`/customer/quotes/received?requestId=${rawId || row.id}`);
                    }}
                >
                    <Tag size={14} className="text-emerald-600 shrink-0" />
                    <span className="whitespace-nowrap">View Quotes ({quotesCount})</span>
                </button>
            )}

            {/* 3. View Negotiation — when a negotiation exists */}
            {hasNegotiation && (
                <button 
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2.5 font-semibold transition-colors cursor-pointer whitespace-nowrap" 
                    onClick={() => {
                        onClose();
                        const targetId = row.negotiation_id || row.negotiationId || row.quote_id || rawId;
                        navigate(`/customer/quotes/negotiation/conversation/${encryptId(targetId)}`);
                    }}
                >
                    <MessageSquare size={14} className="text-indigo-500 shrink-0" />
                    <span className="whitespace-nowrap">View Negotiation</span>
                </button>
            )}

            {/* 4. Continue Booking — when booking is incomplete */}
            {isBookingInProgress && (
                <button 
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-2.5 font-bold transition-colors cursor-pointer whitespace-nowrap" 
                    onClick={() => {
                        onClose();
                        const qId = row.accepted_quote_id || row.quote_id || rawId;
                        navigate(`/customer/checkout/${encryptId(qId)}`);
                    }}
                >
                    <CreditCard size={14} className="text-blue-500 shrink-0" />
                    <span className="whitespace-nowrap">Continue Booking</span>
                </button>
            )}

            {/* 5. Download PDF — when available */}
            {hasPdf && (
                <button 
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer whitespace-nowrap" 
                    onClick={() => {
                        onClose();
                        window.open(pdfUrl, "_blank");
                    }}
                >
                    <FileDown size={14} className="text-slate-400 shrink-0" />
                    <span className="whitespace-nowrap">Download PDF</span>
                </button>
            )}

            {canCancel && <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />}

            {/* 6. Cancel Request — only when permitted by the workflow */}
            {canCancel && (
                <button 
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-2.5 cursor-pointer font-medium transition-colors whitespace-nowrap" 
                    onClick={() => {
                        onClose();
                        if (onDelete) onDelete(row);
                    }}
                >
                    <XCircle size={14} className="text-red-500 shrink-0" />
                    <span className="whitespace-nowrap">Cancel Request</span>
                </button>
            )}
        </div>,
        document.body
    );
};
