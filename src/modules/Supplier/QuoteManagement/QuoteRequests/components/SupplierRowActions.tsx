import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Eye, Copy, Send, CheckCircle2, FileDown, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { encryptId } from '@/lib/encryption';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';

interface SupplierRowActionsProps {
    row: QuoteRequest;
    onQuoteAction: (row: QuoteRequest) => void;
}

export const SupplierRowActions: React.FC<SupplierRowActionsProps> = ({
    row,
    onQuoteAction,
}) => {
    const navigate = useNavigate();
    const showToast = useToastStore(state => state.showToast);
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 192)
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        const handleScroll = () => handleClose();

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    const isQuoted = Boolean(
        (row as any).has_quoted ||
        (row as any).quote_submitted ||
        (row as any).is_quoted ||
        (row as any).quote_id ||
        (row as any).my_quote ||
        row.isQuoted ||
        row.hasQuoted ||
        (row.status || '').toLowerCase() === 'quoted' ||
        (row.status || '').toLowerCase() === 'done' ||
        (row as any).supplier_status?.toLowerCase() === 'quoted'
    );
    const isBooked = (row.status || '').toLowerCase() === 'booked' || (row.status || '').toLowerCase() === 'won';
    const isExpired = Boolean(
        (row as any).is_expired ||
        (row.status || '').toLowerCase() === 'expired' ||
        (row.status || '').toLowerCase() === 'cancelled' ||
        (row.status || '').toLowerCase() === 'completed'
    );

    const rawId = String(row.rawId || row.slug || row.id).replace('REQ-', '').trim();
    const quoteId = (row as any).quote_id || (row as any).my_quote?.id || (row as any).myQuote?.id;

    const handleViewRequest = () => {
        handleClose();
        navigate(`/supplier/quotes/requests/${encryptId(rawId)}`);
    };

    const handleSubmitQuote = () => {
        handleClose();
        onQuoteAction(row);
    };

    const handleViewMyQuote = () => {
        handleClose();
        if (quoteId) {
            navigate(`/supplier/quotes/my-quotes/${encryptId(quoteId)}`, { state: { from: 'requests' } });
        } else {
            navigate(`/supplier/quotes/my-quotes`);
        }
    };

    const handleDownloadPdf = async () => {
        handleClose();
        const cleanId = String(row.rawId || (row as any).slug || row.id || '').replace(/[^0-9]/g, '').trim();
        if (!cleanId) return;

        setIsDownloading(true);
        try {
            const blob = await apiClient.getBlob(`/supplier/requests/${cleanId}/download-pdf`);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `QuoteRequest-REQ-${cleanId.padStart(4, '0')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
            showToast('Quote Request PDF downloaded successfully!', 'success');
        } catch (err) {
            console.error('Failed to download request PDF:', err);
            showToast('Failed to download Quote Request PDF.', 'error');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(row.id);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            handleClose();
        }, 1200);
    };

    return (
        <div className="relative flex items-center justify-end w-full">
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center"
                onClick={handleToggle}
            >
                <MoreVertical size={15} />
            </Button>

            {isOpen && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                        onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    />

                    <div
                        className="fixed w-52 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 1. View Request */}
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={handleViewRequest}
                        >
                            <Eye size={14} className="text-slate-400 shrink-0" />
                            <span>View Request</span>
                        </button>

                        {/* 2. Submit Quote — available when eligible and not already quoted */}
                        {!isQuoted && !isExpired && !isBooked && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                                onClick={handleSubmitQuote}
                            >
                                <Send size={14} className="text-[#ff4a1f] shrink-0" />
                                <span>Submit Quote</span>
                            </button>
                        )}

                        {/* 3. View My Quote — available if supplier already submitted a quote */}
                        {isQuoted && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={handleViewMyQuote}
                            >
                                <CheckCircle2 size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                                <span>View My Quote</span>
                            </button>
                        )}

                        {/* 4. Download Request PDF */}
                        <button
                            type="button"
                            disabled={isDownloading}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer disabled:opacity-50"
                            onClick={handleDownloadPdf}
                        >
                            <FileDown size={14} className="text-slate-400 shrink-0" />
                            <span>{isDownloading ? 'Downloading PDF...' : 'Download Request PDF'}</span>
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        {/* Copy Request ID */}
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={handleCopyId}
                        >
                            {copied ? (
                                <>
                                    <Check size={14} className="text-emerald-500 shrink-0" />
                                    <span className="text-emerald-600 font-semibold">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} className="text-slate-400 shrink-0" />
                                    <span>Copy Request ID</span>
                                </>
                            )}
                        </button>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};
