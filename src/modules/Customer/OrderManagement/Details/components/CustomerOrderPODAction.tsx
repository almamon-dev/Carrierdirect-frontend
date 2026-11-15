import React, { useState } from 'react';
import { FileText, Check, ShieldCheck, Clock, ExternalLink, AlertTriangle, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';
import CustomerOrderPODReviewModal from './CustomerOrderPODReviewModal';

interface CustomerOrderPODActionProps {
    order: NormalizedCustomerOrder;
    onApprovePOD: () => Promise<void>;
    onRejectPOD?: (reason: string) => Promise<void>;
}

export const CustomerOrderPODAction: React.FC<CustomerOrderPODActionProps> = ({
    order,
    onApprovePOD,
    onRejectPOD,
}) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // State 3: POD Uploaded & Ready for Customer Review/Approval
    if (order.pod.isAvailable) {
        const uploadedAt = order.pod.uploadedAt || '';

        return (
            <>
                <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-[4px] p-3 sm:p-3.5 shadow-2xs space-y-2.5 font-sans">
                    <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText size={14} />
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-1">
                            <h4 className="text-xs sm:text-[13px] font-bold text-amber-900 dark:text-amber-300 leading-tight">
                                Proof of Delivery (POD) Received
                            </h4>
                            <p className="text-[11px] text-amber-800/90 dark:text-amber-400 leading-snug">
                                Driver submitted delivery confirmation & signature. Please review to release escrow.
                            </p>
                            {uploadedAt && (
                                <div className="flex items-center gap-1 text-[10.5px] text-amber-700/80 dark:text-amber-500">
                                    <Clock size={10} className="shrink-0" />
                                    <span>Submitted: {uploadedAt}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#1e2329] cursor-pointer shadow-2xs"
                            onClick={() => setIsOpenModal(true)}
                        >
                            Review Details & POD
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            disabled={isSubmitting}
                            className="flex-1 h-8 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-2xs flex items-center justify-center gap-1"
                            onClick={handleAccept}
                        >
                            <Check size={12} />
                            <span>{isSubmitting ? 'Confirming...' : 'Accept & Release'}</span>
                        </Button>
                    </div>
                </div>

                <CustomerOrderPODReviewModal
                    isOpen={isOpenModal}
                    order={order}
                    isSubmitting={isSubmitting}
                    onClose={() => setIsOpenModal(false)}
                    onAccept={handleAccept}
                    onReject={handleReject}
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
