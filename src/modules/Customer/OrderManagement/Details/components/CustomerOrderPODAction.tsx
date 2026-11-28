import React, { useEffect, useState } from 'react';
import { FileText, Check, ShieldCheck, Clock, ExternalLink, AlertTriangle, ShieldAlert, Flag } from 'lucide-react';
import Button from '@/components/ui/button';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';
import CustomerOrderPODReviewModal from './CustomerOrderPODReviewModal';

interface CustomerOrderPODActionProps {
    order: NormalizedCustomerOrder;
    onApprovePOD: () => Promise<void>;
    onRejectPOD?: (reason: string) => Promise<void>;
    onReportIssue?: (reason: string, description: string) => Promise<void>;
}

const formatCountdown = (totalSeconds: number): string => {
    const safe = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const seconds = safe % 60;
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
};

export const CustomerOrderPODAction: React.FC<CustomerOrderPODActionProps> = ({
    order,
    onApprovePOD,
    onRejectPOD,
    onReportIssue,
}) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [initialModalMode, setInitialModalMode] = useState<'review' | 'dispute'>('review');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState<number | null>(
        order.pod.secondsUntilAutoApproval ?? null
    );

    useEffect(() => {
        setSecondsLeft(order.pod.secondsUntilAutoApproval ?? null);
    }, [order.pod.secondsUntilAutoApproval]);

    useEffect(() => {
        if (secondsLeft === null || secondsLeft <= 0) return;
        const timer = window.setInterval(() => {
            setSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => window.clearInterval(timer);
    }, [secondsLeft]);

    const handleAccept = async () => {
        setIsSubmitting(true);
        try {
            await onApprovePOD();
            setIsOpenModal(false);
        } catch (err) {
            console.error('Failed to approve POD:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async (reason: string) => {
        if (!onRejectPOD) return;
        setIsSubmitting(true);
        try {
            await onRejectPOD(reason);
            setIsOpenModal(false);
        } catch (err) {
            console.error('Failed to reject POD:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReportDispute = async (reason: string, description: string) => {
        if (!onReportIssue) return;
        setIsSubmitting(true);
        try {
            await onReportIssue(reason, description);
            setIsOpenModal(false);
        } catch (err) {
            console.error('Failed to report issue:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // State 0: Active Dispute Open — Transfer Held
    if (order.activeDispute || order.pod.status === 'disputed') {
        return (
            <div className="bg-rose-50/90 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 rounded-[4px] p-3 sm:p-3.5 shadow-2xs font-sans">
                <div className="flex items-start gap-2.5 text-rose-800 dark:text-rose-300">
                    <AlertTriangle size={17} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-[13px] font-bold leading-tight">
                                Payment Dispute Open {order.activeDispute?.dispute_number ? `(${order.activeDispute.dispute_number})` : ''} • Carrier Payout Held
                            </h4>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded">
                                Payout Held
                            </span>
                        </div>
                        <p className="text-[11px] text-rose-700 dark:text-rose-400 leading-snug">
                            48-hour auto-approval is cancelled and carrier payout (or Net-30 auto-charge) is frozen pending administrator review.
                        </p>
                        {order.activeDispute?.reason && (
                            <p className="text-[11px] font-semibold text-rose-900 dark:text-rose-200">
                                Reported Issue: {order.activeDispute.reason}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // State 1: POD Accepted & Approved
    if (order.pod.isAccepted) {
        return (
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-[4px] p-3 sm:p-3.5 shadow-2xs font-sans">
                <div className="flex items-start gap-2.5 text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck size={17} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5 flex-1 min-w-0">
                        <h4 className="text-xs sm:text-[13px] font-bold leading-tight">
                            Proof of Delivery Approved • Escrow Released
                        </h4>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 leading-snug">
                            Delivery verified and signed. Escrow funds released to the carrier.
                        </p>
                        {order.pod.uploadedAt && (
                            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
                                <Clock size={11} className="shrink-0" />
                                <span>Submitted: {order.pod.uploadedAt}</span>
                            </div>
                        )}
                        {order.pod.fileUrl && (
                            <div className="pt-1">
                                <a
                                    href={order.pod.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
                                >
                                    <FileText size={11} />
                                    <span>View POD Document</span>
                                    <ExternalLink size={10} />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // State 2: POD Rejected / Replacement Requested
    if (order.pod.isRejected || order.pod.replacementRequested) {
        return (
            <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 rounded-[4px] p-3 sm:p-3.5 shadow-2xs font-sans">
                <div className="flex items-start gap-2.5 text-rose-800 dark:text-rose-300">
                    <AlertTriangle size={17} className="text-rose-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs sm:text-[13px] font-bold leading-tight">
                                Proof of Delivery Rejected • Replacement Requested
                            </h4>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 rounded">
                                On Hold
                            </span>
                        </div>
                        <p className="text-[11px] text-rose-700 dark:text-rose-400 leading-snug">
                            You requested a replacement Proof of Delivery from the carrier. Escrow payout remains safely held until a valid replacement is approved.
                        </p>
                        {order.pod.rejectionReason && (
                            <div className="p-2 rounded bg-white/70 dark:bg-[#12161c]/70 border border-rose-200/80 dark:border-rose-900/60 text-[11px] text-rose-900 dark:text-rose-200">
                                <span className="font-semibold text-rose-700 dark:text-rose-400">Reason reported: </span>
                                <span>{order.pod.rejectionReason}</span>
                            </div>
                        )}
                        {order.pod.fileUrl && (
                            <div className="pt-0.5">
                                <a
                                    href={order.pod.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400 hover:underline"
                                >
                                    <FileText size={11} />
                                    <span>View Previously Uploaded Document</span>
                                    <ExternalLink size={10} />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // State 3: POD Uploaded & Ready for Customer Review/Approval (or Flagged for Admin Review)
    if (order.pod.isAvailable) {
        const uploadedAt = order.pod.uploadedAt || '';
        const isFlagged = Boolean(order.pod.isFlagged || order.pod.status === 'flagged');

        return (
            <>
                <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-[4px] p-3 sm:p-3.5 shadow-2xs space-y-2.5 font-sans">
                    <div className="flex items-start justify-between gap-2.5 flex-wrap">
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                                {isFlagged ? <ShieldAlert size={14} /> : <FileText size={14} />}
                            </div>
                            <div className="space-y-0.5 min-w-0 flex-1">
                                <h4 className="text-xs sm:text-[13px] font-bold text-amber-900 dark:text-amber-300 leading-tight">
                                    {isFlagged
                                        ? 'Proof of Delivery Flagged for Admin GPS Compliance Review'
                                        : 'Proof of Delivery (POD) Received'}
                                </h4>
                                <p className="text-[11px] text-amber-800/90 dark:text-amber-400 leading-snug">
                                    {isFlagged
                                        ? (order.pod.flagReason || 'Delivery GPS was outside the 200m geofence. Auto-approval is paused until verified by administration.')
                                        : (order.isPayLater
                                            ? 'Driver submitted POD & signature (Net-30 invoice clock started). Approve delivery or report an issue within 48 hours.'
                                            : 'Driver submitted delivery confirmation & signature. Approve to release escrow or report an issue within 48 hours.')}
                                </p>
                                {uploadedAt && (
                                    <div className="flex items-center gap-1 text-[10.5px] text-amber-700/80 dark:text-amber-500">
                                        <Clock size={10} className="shrink-0" />
                                        <span>Submitted: {uploadedAt}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!isFlagged && secondsLeft !== null && secondsLeft > 0 && (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-white dark:bg-[#1e2329] border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-[11px] font-bold shrink-0">
                                <Clock size={12} className="text-[#ff4a1f]" />
                                <span>Auto-approves in {formatCountdown(secondsLeft)}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 min-w-[140px] h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#1e2329] cursor-pointer shadow-2xs"
                            onClick={() => {
                                setInitialModalMode('review');
                                setIsOpenModal(true);
                            }}
                        >
                            Review Details & POD
                        </Button>

                        {onReportIssue && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 text-xs font-bold text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-100 cursor-pointer flex items-center gap-1"
                                onClick={() => {
                                    setInitialModalMode('dispute');
                                    setIsOpenModal(true);
                                }}
                            >
                                <Flag size={12} />
                                <span>Report Issue</span>
                            </Button>
                        )}

                        {!isFlagged && (
                            <Button
                                variant="primary"
                                size="sm"
                                disabled={isSubmitting}
                                className="flex-1 min-w-[150px] h-8 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                                onClick={handleAccept}
                            >
                                <Check size={12} />
                                <span>{isSubmitting ? 'Confirming...' : 'Accept & Release'}</span>
                            </Button>
                        )}
                    </div>
                </div>

                <CustomerOrderPODReviewModal
                    isOpen={isOpenModal}
                    order={order}
                    isSubmitting={isSubmitting}
                    initialMode={initialModalMode}
                    onClose={() => setIsOpenModal(false)}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onReportIssue={onReportIssue ? handleReportDispute : undefined}
                />
            </>
        );
    }

    // State 4: Pending Carrier Delivery
    return (
        <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[4px] p-3 shadow-2xs font-sans">
            <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-400">
                <FileText size={16} className="text-[#ff4a1f] shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        Proof of Delivery (POD) Pending
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        Carrier will upload the signed delivery note upon arrival at destination for your review.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderPODAction;
