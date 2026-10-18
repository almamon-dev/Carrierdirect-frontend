import React from 'react';
import { createPortal } from 'react-dom';
import { Eye, MessageSquare, Copy, Check, Navigation, FileCheck, Star, FileText, RotateCcw, ShieldCheck, CreditCard } from 'lucide-react';

interface OrderActionsMenuProps {
    isOpen: boolean;
    dropdownPos: { top: number; left: number };
    copied: boolean;
    row: any;
    onClose: () => void;
    onViewDetails: () => void;
    onTrackOrder: () => void;
    onOpenChat: () => void;
    onOpenRating: () => void;
    onDownloadInvoice: () => void;
    onRepeatOrder: () => void;
    onCopyId: () => void;
    onOpenPodReview?: () => void;
    onViewPaymentDetails?: () => void;
}

export const OrderActionsMenu: React.FC<OrderActionsMenuProps> = ({
    isOpen,
    dropdownPos,
    copied,
    row,
    onClose,
    onViewDetails,
    onTrackOrder,
    onOpenChat,
    onOpenRating,
    onDownloadInvoice,
    onRepeatOrder,
    onCopyId,
    onOpenPodReview,
    onViewPaymentDetails,
}) => {
    if (!isOpen) return null;

    const rawStatus = String(row?.status_raw || row?.status || '').toLowerCase().trim();
    const isCompleted = rawStatus === 'completed' || rawStatus === 'pod accepted' || rawStatus === 'pod_accepted';
    const isTransit = !isCompleted && (rawStatus.includes('transit') || rawStatus.includes('progress') || rawStatus.includes('confirmed') || rawStatus.includes('picked') || rawStatus.includes('driver'));
    const canTrack = isTransit || (!['cancelled', 'expired'].includes(rawStatus) && !isCompleted);

    const rawPod = String(row?.pod_status || row?.pod?.status || '').toLowerCase().trim();
    const hasPodDoc = Boolean(
        row?.pod_document_url || row?.proof_of_delivery || row?.proof || row?.pod_url || row?.pod_file || row?.pod?.file_url || row?.pod?.proof || row?.pod?.is_uploaded
    );

    const isPodPending = !isCompleted && (
        rawStatus === 'delivered' || rawStatus === 'pod_uploaded' || rawStatus === 'pod_review' || rawStatus === 'pod_received' || rawPod === 'pending' || rawPod === 'uploaded' || rawPod === 'pod_uploaded' || (hasPodDoc && rawStatus !== 'cancelled')
    );

    const podDownloadUrl = row?.pod_document_url || row?.proof_of_delivery || row?.pod_url || row?.pod_file || row?.pod?.file_url || row?.pod?.proof || '';

    const hasPayment = Boolean(
        row?.payment_status || row?.payment_method || row?.amount || row?.total_amount || row?.gross_amount || row?.isPaid || row?.pricing
    );

    const btnClass = "w-full text-left px-3.5 py-2 text-xs flex items-center gap-2.5 transition-colors cursor-pointer whitespace-nowrap";

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
            />
            <div
                className="fixed min-w-[230px] w-max max-w-[calc(100vw-16px)] bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans overflow-hidden"
                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 1. Review & Accept POD — Required approval action shown separately */}
                {isPodPending && onOpenPodReview && (
                    <button
                        type="button"
                        className={`${btnClass} text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 font-bold border-b border-emerald-100 dark:border-emerald-800/60`}
                        onClick={() => { onClose(); onOpenPodReview(); }}
                    >
                        <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Approve POD</span>
                    </button>
                )}

                {/* 2. View Order */}
                <button
                    type="button"
                    className={`${btnClass} text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium`}
                    onClick={() => { onClose(); onViewDetails(); }}
                >
                    <Eye size={14} className="text-slate-400 shrink-0" />
                    <span>View Order</span>
                </button>

                {/* 3. Track Delivery — when tracking is available */}
                {canTrack && (
                    <button
                        type="button"
                        className={`${btnClass} text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 font-bold`}
                        onClick={() => { onClose(); onTrackOrder(); }}
                    >
                        <Navigation size={14} className="text-[#ff4a1f] shrink-0" />
                        <span>Track Delivery</span>
                    </button>
                )}

                {/* 4. Chat with Carrier */}
                <button
                    type="button"
                    className={`${btnClass} text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium`}
                    onClick={() => { onClose(); onOpenChat(); }}
                >
                    <MessageSquare size={14} className="text-slate-400 shrink-0" />
                    <span>Chat with Carrier</span>
                </button>

                {/* 5. View POD — when a proof of delivery exists */}
                {hasPodDoc && (
                    <button
                        type="button"
                        className={`${btnClass} text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-semibold`}
                        onClick={() => {
                            onClose();
                            if (podDownloadUrl) window.open(podDownloadUrl, '_blank');
                            else if (onOpenPodReview) onOpenPodReview();
                            else onViewDetails();
                        }}
                    >
                        <FileCheck size={14} className="text-emerald-500 shrink-0" />
                        <span>View POD</span>
                    </button>
                )}

                {/* 6. View Payment Details — when payment information exists */}
                {hasPayment && (
                    <button
                        type="button"
                        className={`${btnClass} text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium`}
                        onClick={() => {
                            onClose();
                            if (onViewPaymentDetails) onViewPaymentDetails();
                            else onViewDetails();
                        }}
                    >
                        <CreditCard size={14} className="text-slate-400 shrink-0" />
                        <span>View Payment Details</span>
                    </button>
                )}

                {/* Rate Carrier (when completed) */}
                {isCompleted && (
                    <button
                        type="button"
                        className={`${btnClass} text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 font-semibold`}
                        onClick={() => { onClose(); onOpenRating(); }}
                    >
                        <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />
                        <span>Rate Carrier & Service</span>
                    </button>
                )}

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                {/* Download Invoice */}
                <button
                    type="button"
                    className={`${btnClass} text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium`}
                    onClick={() => { onClose(); onDownloadInvoice(); }}
                >
                    <FileText size={14} className="text-slate-400 shrink-0" />
                    <span>Download Order Documents</span>
                </button>

                {/* Repeat Order */}
                <button
                    type="button"
                    className={`${btnClass} text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium`}
                    onClick={() => { onClose(); onRepeatOrder(); }}
                >
                    <RotateCcw size={14} className="text-slate-400 shrink-0" />
                    <span>Repeat Order</span>
                </button>

                {/* Copy Order ID */}
                <button
                    type="button"
                    className={`${btnClass} text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 font-medium`}
                    onClick={onCopyId}
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-emerald-500 shrink-0" />
                            <span className="text-emerald-600 font-semibold">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} className="text-slate-400 shrink-0" />
                            <span>Copy Order ID</span>
                        </>
                    )}
                </button>
            </div>
        </>,
        document.body
    );
};

export default OrderActionsMenu;
