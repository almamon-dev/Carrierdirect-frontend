import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, MoreVertical, Eye, History, DollarSign, CheckCircle2, XCircle, FileText, Copy, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { NegotiationItem } from '../types';
import apiClient from '@/lib/axios';
import { toast } from '@/hooks/use-toast';

interface NegotiationRowActionsProps {
    row: NegotiationItem;
    onAction?: (row: NegotiationItem) => void;
    onQuoteAction?: (row: NegotiationItem) => void;
    onRefresh?: () => void;
}

export const NegotiationRowActions: React.FC<NegotiationRowActionsProps> = ({
    row,
    onAction,
    onQuoteAction,
    onRefresh,
}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const rawId = String(row.rawId || row.id).replace('NEG-', '').replace('QT-', '');
    const quoteRawId = (row as any).quoteRawId || (row as any).quote_id || rawId;

    const isActive = row.status !== 'Closed' && row.status !== 'Agreed' && (row as any).statusRaw !== 'closed' && (row as any).statusRaw !== 'agreed';
    const canAccept = isActive && Boolean((row as any).canAccept ?? ((row as any).isCustomerOffer && (row as any).statusRaw !== 'closed'));
    const canCounter = isActive && Boolean((row as any).canCounter ?? ((row as any).isCustomerOffer && (row as any).statusRaw !== 'closed'));
    const canClose = isActive;

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 208)
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    const handleOpenChat = () => {
        handleClose();
        const actionHandler = onAction || onQuoteAction;
        if (row.priority === 'Urgent' && actionHandler) {
            actionHandler(row);
        } else {
            navigate(`/supplier/quotes/negotiation/conversation/${encryptId(quoteRawId)}`);
        }
    };

    const handleViewHistory = () => {
        handleClose();
        navigate(`/supplier/quotes/negotiation/conversation/${encryptId(quoteRawId)}`, { state: { initialTab: 'history' } });
    };

    const handleSendCounter = () => {
        handleClose();
        navigate(`/supplier/quotes/negotiation/conversation/${encryptId(quoteRawId)}`, { state: { autoOpenCounter: true } });
    };

    const handleAcceptOffer = async () => {
        handleClose();
        if (window.confirm('Are you sure you want to accept this customer offer?')) {
            try {
                let res;
                try {
                    res = await apiClient.post(`/supplier/negotiations/${quoteRawId}/accept`);
                } catch {
                    res = await apiClient.post(`/negotiations/${quoteRawId}/accept`);
                }
                toast({ title: 'Success', description: 'Customer offer accepted successfully.' });
                if (onRefresh) onRefresh();
                else navigate(`/supplier/quotes/negotiation/conversation/${encryptId(quoteRawId)}`);
            } catch (err: any) {
                toast({
                    title: 'Error',
                    description: err?.response?.data?.message || 'Failed to accept offer. Please try again.',
                    variant: 'destructive',
                });
            }
        }
    };

    const handleCloseNegotiation = async () => {
        handleClose();
        if (window.confirm('Are you sure you want to close this negotiation?')) {
            try {
                let res;
                try {
                    res = await apiClient.post(`/supplier/negotiations/${quoteRawId}/decline`, { reason: 'Closed by supplier' });
                } catch {
                    res = await apiClient.post(`/negotiations/${quoteRawId}/decline`, { reason: 'Closed by supplier' });
                }
                toast({ title: 'Success', description: 'Negotiation closed successfully.' });
                if (onRefresh) onRefresh();
            } catch (err: any) {
                toast({
                    title: 'Error',
                    description: err?.response?.data?.message || 'Failed to close negotiation.',
                    variant: 'destructive',
                });
            }
        }
    };

    const handleViewQuote = () => {
        handleClose();
        navigate(`/supplier/quotes/my-quotes/${encryptId(quoteRawId)}`);
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText((row as any).quoteId || row.id);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            handleClose();
        }, 1200);
    };

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

    const unreadCount = row.unreadCount && row.unreadCount > 0 ? row.unreadCount : (row.priority === 'Urgent' ? 1 : 0);

    return (
        <div className="relative flex items-center justify-end gap-1.5 w-full">
            {/* Primary Action Button (Chat) */}
            <button
                type="button"
                onClick={handleOpenChat}
                title="Open Negotiation Chat"
                className="h-7 px-2.5 rounded-[3px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer group shrink-0"
            >
                <MessageSquare size={12.5} className="shrink-0" />
                <span className="leading-none">Chat</span>
                {unreadCount > 0 ? (
                    <span className="flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white bg-emerald-500 rounded-full leading-none text-center shadow-xs">
                        {unreadCount}
                    </span>
                ) : null}
            </button>

            {/* Three-dot Button */}
            <Button
                variant="ghost"
                size="sm"
                title="More Options"
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleToggle}
            >
                <MoreVertical size={15} />
            </Button>

            {isOpen && createPortal(
                <>
                    <div className="fixed inset-0 z-[9998] cursor-default bg-transparent" onClick={(e) => { e.stopPropagation(); handleClose(); }} />
                    <div
                        className="fixed w-52 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 1. View Conversation */}
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={handleOpenChat}
                        >
                            <Eye size={14} className="text-slate-400 shrink-0" />
                            <span>View Conversation</span>
                        </button>

                        {/* 2. View Offer History */}
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={handleViewHistory}
                        >
                            <History size={14} className="text-slate-400 shrink-0" />
                            <span>View Offer History</span>
                        </button>

                        {/* 3. Send Counter Offer — when it is the supplier's turn */}
                        {canCounter && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                                onClick={handleSendCounter}
                            >
                                <DollarSign size={14} className="text-[#ff4a1f] shrink-0" />
                                <span>Send Counter Offer</span>
                            </button>
                        )}

                        {/* 4. Accept Customer Offer — when a valid customer offer is available */}
                        {canAccept && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/20 flex items-center gap-2.5 transition-colors font-semibold cursor-pointer"
                                onClick={handleAcceptOffer}
                            >
                                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                <span>Accept Customer Offer</span>
                            </button>
                        )}

                        {/* 5. Close Negotiation — only when permitted by the existing workflow */}
                        {canClose && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/20 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={handleCloseNegotiation}
                            >
                                <XCircle size={14} className="text-rose-500 shrink-0" />
                                <span>Close Negotiation</span>
                            </button>
                        )}

                        {/* 6. View Quote */}
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={handleViewQuote}
                        >
                            <FileText size={14} className="text-slate-400 shrink-0" />
                            <span>View Quote</span>
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        {/* Copy ID */}
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={handleCopyId}
                        >
                            {copied ? (
                                <><Check size={14} className="text-emerald-500 shrink-0" /><span className="text-emerald-600 font-semibold">Copied!</span></>
                            ) : (
                                <><Copy size={14} className="text-slate-400 shrink-0" /><span>Copy Negotiation ID</span></>
                            )}
                        </button>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};

export default NegotiationRowActions;
