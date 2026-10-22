import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Copy, FileDown, XCircle, Trash2, FileText } from 'lucide-react';
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';
import { CustomerQuoteRequestItem } from '../types';
import apiClient from '@/lib/axios';

interface RowActionsMenuProps {
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    dropdownPos: { top: number; left: number };
    row: CustomerQuoteRequestItem;
    isRepeating: boolean;
    onClose: () => void;
    onRepeatRequest: (row: CustomerQuoteRequestItem) => void;
    onDeleteRequest: (row: CustomerQuoteRequestItem) => void;
    onMoveToDraft?: (row: CustomerQuoteRequestItem) => void;
}

export const RowActionsMenu: React.FC<RowActionsMenuProps> = ({
    dropdownRef,
    dropdownPos,
    row,
    isRepeating,
    onClose,
    onRepeatRequest,
    onDeleteRequest,
    onMoveToDraft,
}) => {
    const navigate = useNavigate();

    const rawStatus = String(row.status || '').toLowerCase().trim();
    const isDraft = rawStatus === 'draft';
    const quotesCount = Number(row.quotesReceived || row.quotesCount || (row as any).bidsCount || (row as any).quotes_count || 0);
    const isTerminal = ['won', 'booked', 'accepted', 'completed', 'expired', 'cancelled'].includes(rawStatus);
    const hasNegotiation = rawStatus === 'negotiating' || rawStatus === 'negotiation' || Boolean((row as any).hasNegotiation || (row as any).has_negotiation);
    const apiEditable = (row as any).is_editable ?? (row as any).can_edit;
    const isEditable = apiEditable !== undefined
        ? Boolean(apiEditable)
        : (isDraft || (!isTerminal && quotesCount === 0 && !hasNegotiation));
    const canCancel = !isDraft && !['cancelled', 'expired', 'won', 'booked', 'completed'].includes(rawStatus);
    const canMoveToDraft = !isDraft && !isTerminal && quotesCount === 0 && !hasNegotiation;

    const pdfUrl = (row as any).pdf_url || (row as any).pdf_path || (row as any).attachment_url || (row as any).pdfUrl || (row as any).pdf_document_url || (row as any).packingList?.url || (row as any).commercialInvoice?.url || '';
    const hasPdf = Boolean(pdfUrl);

    return (
        <div 
            ref={dropdownRef}
            className="fixed w-44 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* 1. View Details */}
            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer" 
                onClick={() => { 
                    onClose(); 
                    navigate(buildSecureQuoteUrl('view', row.rawId || row.id)); 
                }}
            >
                <Eye size={14} className="text-slate-400 shrink-0" />
                <span>View Details</span>
            </button>

            {/* 2. View Received Quotes / Bids */}
            {quotesCount > 0 && (
                <button 
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] dark:text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-orange-950/40 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer" 
                    onClick={() => { 
                        onClose(); 
                        navigate(`/customer/quotes/received/${row.rawId || row.id}`); 
                    }}
                >
                    <FileText size={14} className="text-[#ff4a1f] shrink-0" />
                    <span>View Bids ({quotesCount})</span>
                </button>
            )}
            {/* 3. Edit Request — only when the request is editable */}
            {isEditable && (
                <button 
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer" 
                    onClick={() => { 
                        onClose(); 
                        navigate(buildSecureQuoteUrl('edit', row.rawId || row.id)); 
                    }}
                >
                    <Edit size={14} className="text-indigo-500 shrink-0" />
                    <span>Edit Request</span>
                </button>
            )}

            {/* 4. Duplicate Request */}
            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 font-medium disabled:opacity-50 transition-colors cursor-pointer" 
                disabled={isRepeating}
                onClick={() => {
                    onClose();
                    onRepeatRequest(row);
                }}
            >
                {isRepeating ? (
                    <svg className="animate-spin w-3.5 h-3.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                ) : (
                    <Copy size={14} className="text-blue-500 shrink-0" />
                )}
                <span>{isRepeating ? 'Duplicating...' : 'Duplicate Request'}</span>
            </button>

            {/* 5. Download PDF */}
            <button 
                type="button"
                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer" 
                onClick={async () => {
                    onClose();
                    if (pdfUrl && typeof pdfUrl === 'string' && pdfUrl.startsWith('http')) {
                        window.open(pdfUrl, '_blank');
                        return;
                    }
                    const cleanId = String(row.rawId || row.id || '').replace(/[^0-9]/g, '').trim();
                    if (!cleanId) return;
                    try {
                        const blob = await apiClient.getBlob(`/customer/quote-requests/${cleanId}/download-pdf`);
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `QuoteRequest-REQ-${cleanId.padStart(4, '0')}.pdf`);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
                    } catch (err) {
                        console.error('Failed to download PDF:', err);
                    }
                }}
            >
                <FileDown size={14} className="text-slate-400 shrink-0" />
                <span>Download PDF</span>
            </button>

            {/* Move to Draft — only for open/pending requests without carrier bids */}
            {canMoveToDraft && (
                <button 
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer" 
                    onClick={() => {
                        onClose();
                        if (onMoveToDraft) {
                            onMoveToDraft(row);
                        }
                    }}
                >
                    <FileText size={14} className="text-amber-500 shrink-0" />
                    <span>Move to Draft</span>
                </button>
            )}

            {/* Divider if action below */}
            {(canCancel || isDraft || canMoveToDraft) && <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />}

            {/* 6. Cancel Request — only when cancellation is permitted */}
            {canCancel && (
                <button 
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-2.5 cursor-pointer font-medium transition-colors" 
                    onClick={() => {
                        onClose();
                        onDeleteRequest(row);
                    }}
                >
                    <XCircle size={14} className="text-red-500 shrink-0" />
                    <span>Cancel Request</span>
                </button>
            )}

            {/* 7. Delete Draft — only for draft requests */}
            {isDraft && (
                <button 
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 flex items-center gap-2.5 cursor-pointer font-medium transition-colors" 
                    onClick={() => {
                        onClose();
                        onDeleteRequest(row);
                    }}
                >
                    <Trash2 size={14} className="text-red-500 shrink-0" />
                    <span>Delete Draft</span>
                </button>
            )}
        </div>
    );
};
