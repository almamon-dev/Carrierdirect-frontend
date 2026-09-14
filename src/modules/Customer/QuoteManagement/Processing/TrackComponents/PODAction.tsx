import React, { useState } from 'react';
import Button from '@/components/ui/button';
import { FileText, Check, ShieldCheck, X, AlertCircle, Clock } from 'lucide-react';
import apiClient from '@/lib/axios';

interface PODActionProps {
    isPodAccepted: boolean;
    setIsPodAccepted: (val: boolean) => void;
    order?: any;
}

export default function PODAction({
    isPodAccepted,
    setIsPodAccepted,
    order
}: PODActionProps) {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAccept = async () => {
        setIsSubmitting(true);
        try {
            if (order?.rawId || order?.id) {
                const cleanId = String(order.rawId || order.id).replace('ORD-', '');
                await apiClient.post(`/customer/orders/${cleanId}/pod-approve`);
            }
        } catch (err) {
            console.error('Failed to approve POD via API:', err);
        } finally {
            setIsPodAccepted(true);
            setIsOpenModal(false);
            setIsSubmitting(false);
        }
    };

    // State 1: POD Accepted & Completed
    if (isPodAccepted || order?.isPodAccepted) {
        return (
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-lg p-3 sm:p-3.5 shadow-2xs font-sans">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                    <div>
                        <h4 className="text-[13px] font-bold leading-tight">Proof of Delivery Approved</h4>
                        <p className="text-[11.5px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-snug">
                            Delivery verified and Escrow payment successfully released to carrier.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // State 2: POD Uploaded & Ready for Customer Review/Approval
    if (order?.isPodAvailable) {
        return (
            <>
                <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-slate-200 dark:border-slate-800 border border-slate-200 dark:border-slate-800-amber-200 dark:border border-slate-200 dark:border-slate-800-amber-800/80 rounded-lg p-3 sm:p-3.5 shadow-2xs space-y-2.5 font-sans">
                    <div className="flex items-center gap-2">
                        <FileText size={18} className="text-amber-600 shrink-0" />
                        <div>
                            <h4 className="text-[13px] font-bold text-amber-900 dark:text-amber-300 leading-tight">Proof of Delivery (POD) Received</h4>
                            <p className="text-[11.5px] text-amber-800 dark:text-amber-400/90 mt-0.5 leading-snug">
                                Carrier uploaded the delivery receipt. Review and confirm to release Escrow funds.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 pt-0.5">
                        <Button
                            variant="outline"
                            className="flex-1 h-7.5 text-xs font-semibold text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40 bg-white dark:bg-[#1e2329] rounded-[4px] cursor-pointer"
                            onClick={() => setIsOpenModal(true)}
                        >
                            View Document
                        </Button>
                        <Button
                            variant="primary"
                            disabled={isSubmitting}
                            className="flex-1 h-7.5 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[4px] cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                            onClick={handleAccept}
                        >
                            <Check size={13} />
                            <span>{isSubmitting ? 'Confirming...' : 'Accept Delivery'}</span>
                        </Button>
                    </div>
                </div>

                {/* POD Document Modal */}
                {isOpenModal && (
                    <PODDocModal
                        order={order}
                        isPodAccepted={isPodAccepted}
                        isSubmitting={isSubmitting}
                        onClose={() => setIsOpenModal(false)}
                        onAccept={handleAccept}
                    />
                )}
            </>
        );
    }

    // State 3: Active In-Progress Shipment (Before POD upload)
    return (
        <div className="bg-sky-50/60 dark:bg-sky-950/25 border border-slate-200 dark:border-slate-800 border border-slate-200 dark:border-slate-800-sky-200 dark:border border-slate-200 dark:border-slate-800-sky-800/60 rounded-lg p-3 sm:p-3.5 shadow-2xs font-sans">
            <div className="flex items-center gap-2.5 text-sky-900 dark:text-sky-300">
                <Clock size={18} className="text-sky-600 dark:text-sky-400 shrink-0" />
                <div>
                    <h4 className="text-[13px] font-bold leading-tight">Active Shipment in Progress</h4>
                    <p className="text-[11.5px] text-sky-800 dark:text-sky-400 mt-0.5 leading-snug">
                        Carrier is coordinating dispatch. Signed Proof of Delivery (POD) will appear here upon arrival.
                    </p>
                </div>
            </div>
        </div>
    );
}

function PODDocModal({
    order,
    isPodAccepted,
    isSubmitting,
    onClose,
    onAccept
}: {
    order?: any;
    isPodAccepted: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    onAccept: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-sans animate-in fade-in duration-150">
            <div
    className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-[8px] max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div
    className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-[#ff4a1f]" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            Proof of Delivery Document (POD)
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Simulated Official POD Slip */}
                <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
                    <div
    className="border border-slate-200 dark:border-slate-700 rounded-[6px] p-4 bg-slate-50/40 dark:bg-slate-900/30 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
                            <div>
                                <span className="text-[10px] font-bold text-slate-400  tracking-wider">CarrierDirect Freight Note</span>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Delivery Receipt #{order?.id || 'ORD-0001'}</h4>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                Delivered
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-[11.5px]">
                            <div>
                                <span className="text-slate-400 block text-[10px]">Carrier / Driver</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{order?.supplier?.name || 'Carrier Fleet'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px]">Vehicle License</span>
                                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{order?.vehicle?.number || 'DE-TR-8821'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px]">Origin Pickup</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{order?.from || 'Dhaka'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px]">Destination Delivered</span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{order?.to || 'Chittagong'}</span>
                            </div>
                        </div>

                        {/* Consignee Signature Stamp */}
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] text-slate-400 block">Receiver Signature & Stamp</span>
                                <span className="font-serif italic font-bold text-slate-800 dark:text-slate-200 text-sm">Signed: Verified Receiver</span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block flex items-center gap-1 mt-0.5 font-medium">
                                    <ShieldCheck size={11} /> Verified on-site delivery
                                </span>
                            </div>
                            <div className="w-16 h-16 border border-dashed border-slate-300 dark:border-slate-600 rounded flex items-center justify-center text-[9px] text-slate-400 text-center font-bold">
                                OFFICIAL STAMP
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Actions */}
                <div
    className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between gap-2">
                    <button
                        onClick={onClose}
                        className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                        Close
                    </button>
                    {!isPodAccepted && (
                        <Button
                            variant="primary"
                            size="sm"
                            disabled={isSubmitting}
                            className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white font-bold h-7 px-3 text-[11px] rounded-[4px] cursor-pointer flex items-center gap-1"
                            onClick={onAccept}
                        >
                            <Check size={13} />
                            <span>{isSubmitting ? 'Processing...' : 'Confirm POD & Release Escrow'}</span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
