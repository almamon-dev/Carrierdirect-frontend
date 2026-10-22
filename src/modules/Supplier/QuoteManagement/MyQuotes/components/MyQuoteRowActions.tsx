import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Eye, Bell, RotateCcw, FileText, MessageSquare, Edit3, XCircle, Truck, FileDown, Copy, Check } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { MyQuoteItem } from '../hooks/useSupplierMyQuotes';
import apiClient from '@/lib/axios';
import { useToastStore } from '@/stores/useToastStore';
import { toast } from '@/hooks/use-toast';
import { ConfirmModal } from '@/components/modals';

interface MyQuoteRowActionsProps {
    row: MyQuoteItem;
    onRefresh?: () => void;
}

export const MyQuoteRowActions: React.FC<MyQuoteRowActionsProps> = ({ row, onRefresh }) => {
    const navigate = useNavigate();
    const showToast = useToastStore(state => state.showToast);
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isSendingReminder, setIsSendingReminder] = useState(false);
    const [isReleasing, setIsReleasing] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [showReleaseModal, setShowReleaseModal] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 200)
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

    const rawId = String(row.rawId || row.slug || row.id).replace('REQ-', '').trim();
    const quoteRawId = row.quoteRawId || (row.my_quote?.id || row.myQuote?.id || rawId);
    const st = (row.supplierStatus || row.status || '').toLowerCase().trim();
    const isAwaitingPayment = Boolean(
        row.isAwaitingPayment ||
        st === 'awaiting_payment' ||
        (st === 'accepted' && !row.isPaid)
    );

    const isTerminal = ['accepted', 'booked', 'won', 'completed', 'rejected', 'declined', 'cancelled', 'lost', 'expired'].includes(st);
    const hasNegotiation = Boolean(row.hasNegotiation || st === 'negotiation' || st === 'negotiating' || row.revisionStatus === 'pending' || (row as any).revision_status === 'pending');
    const apiEditable = (row as any).is_editable ?? (row as any).can_edit ?? (row.my_quote as any)?.is_editable ?? (row.my_quote as any)?.can_edit ?? (row as any).myQuote?.is_editable ?? (row as any).myQuote?.can_edit;
    const isEditable = apiEditable !== undefined
        ? Boolean(apiEditable)
        : (!isTerminal && !hasNegotiation && (st === 'draft' || st === 'submitted' || st === 'pending' || st === 'quoted' || st === 'active' || st === 'open'));
    const isWithdrawable = !isTerminal && (st === 'submitted' || st === 'pending' || st === 'quoted' || st === 'negotiation' || st === 'negotiating');
    const hasOrder = Boolean((row.orderId || row.order?.id) && (st === 'booked' || st === 'completed' || Boolean(row.orderId || row.order?.id)));

    const handleViewQuote = () => {
        handleClose();
        navigate(`/supplier/quotes/my-quotes/${encryptId(rawId)}`, { state: { from: 'my-quotes' } });
    };

    const handleViewRequest = () => {
        handleClose();
        navigate(`/supplier/quotes/requests/${encryptId(rawId)}`);
    };

    const handleViewNegotiation = () => {
        handleClose();
        navigate(`/supplier/quotes/negotiation/conversation/${encryptId(quoteRawId)}`);
    };

    const handleEditQuote = () => {
        handleClose();
        navigate(`/supplier/quotes/my-quotes/${encryptId(rawId)}`, { state: { from: 'my-quotes', editMode: true } });
    };

    const handleWithdrawQuote = async () => {
        handleClose();
        if (window.confirm('Are you sure you want to withdraw this quote offer?')) {
            try {
                let res;
                try {
                    res = await apiClient.post(`/supplier/negotiations/${quoteRawId}/withdraw`, { reason: 'Withdrawn by supplier' });
                } catch {
                    res = await apiClient.post(`/negotiations/${quoteRawId}/withdraw`, { reason: 'Withdrawn by supplier' });
                }
                toast({ title: 'Success', description: 'Quote withdrawn successfully.' });
                if (onRefresh) onRefresh();
            } catch (err: any) {
                toast({
                    title: 'Error',
                    description: err?.response?.data?.message || 'Failed to withdraw quote.',
                    variant: 'destructive',
                });
            }
        }
    };

    const handleViewOrder = () => {
        handleClose();
        const ordId = row.orderId || row.order?.id;
        if (ordId) {
            navigate(`/supplier/orders/${encryptId(ordId)}`);
        } else {
            navigate('/supplier/orders/active-jobs');
        }
    };

    const handleSendReminder = () => {
        handleClose();
        setShowReminderModal(true);
    };

    const executeSendReminder = async () => {
        setIsSendingReminder(true);
        try {
            const res = await apiClient.post(`/supplier/quotes/${quoteRawId}/send-reminder`);
            const msg = res.data?.message || 'Payment reminder sent to customer. You can send another reminder in 5 minutes.';
            toast({
                title: 'Reminder Sent',
                description: msg,
            });
            setShowReminderModal(false);
            if (onRefresh) onRefresh();
        } catch (err: any) {
            const errMsg = err?.response?.data?.message || 'Please wait 5 minutes between sending payment reminders.';
            toast({
                title: err?.response?.status === 429 ? 'Reminder Cooldown Active' : 'Unable to Send Reminder',
                description: errMsg,
                variant: 'destructive',
            });
        } finally {
            setIsSendingReminder(false);
        }
    };

    const handleReleaseAcceptance = () => {
        handleClose();
        setShowReleaseModal(true);
    };

    const executeReleaseAcceptance = async () => {
        setIsReleasing(true);
        try {
            await apiClient.post(`/supplier/quotes/${quoteRawId}/cancel-acceptance`);
            toast({
                title: 'Acceptance Released',
                description: 'Quote acceptance released. The quote is now back to open status.',
            });
            setShowReleaseModal(false);
            if (onRefresh) onRefresh();
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err?.response?.data?.message || 'Failed to release acceptance.',
                variant: 'destructive',
            });
        } finally {
            setIsReleasing(false);
        }
    };

    const handleDownloadPdf = async () => {
        handleClose();
        const reqId = String((row as any).requestId || (row as any).quoteRequest?.id || (row as any).quote_request_id || (row as any).request_id || row.id || '').replace(/[^0-9]/g, '').trim();
        if (!reqId) return;

        setIsDownloading(true);
        try {
            const blob = await apiClient.getBlob(`/supplier/requests/${reqId}/download-pdf`);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `QuoteRequest-REQ-${reqId.padStart(4, '0')}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
            showToast('Quote PDF downloaded successfully!', 'success');
        } catch (err) {
            console.error('Failed to download quote PDF:', err);
            showToast('Failed to download Quote PDF.', 'error');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(row.quoteId || String(row.id));
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            handleClose();
        }, 1200);
    };

    return (
        <div className="relative flex items-center justify-end w-full">
            {/* Three-dot Button */}
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center shrink-0"
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
                        className="fixed w-52 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Awaiting Payment Actions */}
                        {isAwaitingPayment && (
                            <>
                                <button
                                    type="button"
                                    disabled={isSendingReminder}
                                    className="w-full text-left px-3.5 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2.5 transition-colors font-medium cursor-pointer disabled:opacity-50"
                                    onClick={handleSendReminder}
                                >
                                    <Bell size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                                    <span>Send Payment Reminder</span>
                                </button>
                                <button
                                    type="button"
                                    disabled={isReleasing}
                                    className="w-full text-left px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/20 flex items-center gap-2.5 transition-colors font-medium cursor-pointer disabled:opacity-50"
                                    onClick={handleReleaseAcceptance}
                                >
                                    <RotateCcw size={14} className="text-rose-500 shrink-0" />
                                    <span>Release Acceptance</span>
                                </button>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                            </>
                        )}

                        {/* 1. View Quote */}
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={handleViewQuote}
                        >
                            <Eye size={14} className="text-slate-400 shrink-0" />
                            <span>View Details</span>
                        </button>

                        {/* 2. View Request */}
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={handleViewRequest}
                        >
                            <FileText size={14} className="text-slate-400 shrink-0" />
                            <span>View Request</span>
                        </button>

                        {/* 3. Edit Quote — only while editing is allowed */}
                        {isEditable && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={handleEditQuote}
                            >
                                <Edit3 size={14} className="text-slate-400 shrink-0" />
                                <span>Edit Quote</span>
                            </button>
                        )}

                        {/* 4. Withdraw Quote — only when permitted */}
                        {isWithdrawable && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50/70 dark:hover:bg-rose-950/20 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={handleWithdrawQuote}
                            >
                                <XCircle size={14} className="text-rose-500 shrink-0" />
                                <span>Withdraw Quote</span>
                            </button>
                        )}

                        {/* 5. View Negotiation — when negotiation exists */}
                        {hasNegotiation && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={handleViewNegotiation}
                            >
                                <MessageSquare size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                                <span>View Negotiation</span>
                            </button>
                        )}

                        {/* 6. View Order — when valid related order exists */}
                        {hasOrder && (
                            <button
                                type="button"
                                className="w-full text-left px-3.5 py-2 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                                onClick={handleViewOrder}
                            >
                                <Truck size={14} className="text-emerald-500 shrink-0" />
                                <span>View Order</span>
                            </button>
                        )}

                        {/* 7. Download Quote PDF */}
                        <button
                            type="button"
                            disabled={isDownloading}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer disabled:opacity-50"
                            onClick={handleDownloadPdf}
                        >
                            <FileDown size={14} className="text-slate-400 shrink-0" />
                            <span>{isDownloading ? 'Downloading PDF...' : 'Download Quote PDF'}</span>
                        </button>

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        {/* Copy ID */}
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
                                    <span>Copy Quote ID</span>
                                </>
                            )}
                        </button>
                    </div>
                </>,
                document.body
            )}
            {/* Confirm Send Reminder Modal */}
            <ConfirmModal
                isOpen={showReminderModal}
                onClose={() => setShowReminderModal(false)}
                onConfirm={executeSendReminder}
                isLoading={isSendingReminder}
                title="Send Payment Reminder?"
                description="Send a real-time notification and negotiation chat alert reminding the customer to complete payment for this accepted quote?"
                confirmText="Send Reminder"
                cancelText="Cancel"
                icon={<Bell size={20} className="text-amber-600 dark:text-amber-400" />}
            />

            {/* Confirm Release Acceptance Modal */}
            <ConfirmModal
                isOpen={showReleaseModal}
                onClose={() => setShowReleaseModal(false)}
                onConfirm={executeReleaseAcceptance}
                isLoading={isReleasing}
                isDestructive={true}
                title="Release Quote Acceptance?"
                description="Are you sure you want to release this quote acceptance? The customer's pending booking will be cancelled and the quote will return to open status so your vehicle slot is freed."
                confirmText="Release Acceptance"
                cancelText="Keep Reserved"
                icon={<RotateCcw size={20} className="text-rose-600 dark:text-rose-400" />}
            />
        </div>
    );
};
