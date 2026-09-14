import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/button';
import { Upload, RefreshCw, Eye, CheckCircle2, FileText, Download, X, ShieldCheck, UserPlus } from 'lucide-react';

interface SupplierPODActionProps {
    isPodAccepted: boolean;
    podUploaded: boolean;
    onOpenUploadModal: () => void;
    onOpenStatusModal: () => void;
    onOpenAssignDriver?: () => void;
    order?: any;
}

export default function SupplierPODAction({
    isPodAccepted,
    podUploaded,
    onOpenUploadModal,
    onOpenStatusModal,
    onOpenAssignDriver,
    order,
}: SupplierPODActionProps) {
    const [isOpenPreviewModal, setIsOpenPreviewModal] = useState(false);
    const rawStatus = (order?.raw_status || order?.status_raw || order?.status || 'confirmed').toLowerCase().trim();
    const isConfirmed = rawStatus === 'confirmed' || rawStatus === 'pending' || rawStatus === 'scheduled';
    const isDriverPending = isConfirmed || order?.driver?.name === 'Unassigned' || !order?.driver?.name;

    // State 1: POD Accepted & Completed
    if (isPodAccepted) {
        return (
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-lg p-3 sm:p-3.5 shadow-2xs font-sans">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <div>
                        <h4 className="text-[13px] font-bold leading-tight">Order Completed & Payment Settled</h4>
                        <p className="text-[11.5px] text-emerald-700 dark:text-emerald-400 mt-0.5 leading-snug">
                            Customer approved the Proof of Delivery. Escrow payout is processed.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // State 2: Driver Assignment Pending (Actionable Notice)
    if (isDriverPending) {
        return (
            <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-lg p-3 sm:p-3.5 shadow-2xs space-y-2.5 font-sans">
                <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <UserPlus size={14} />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 leading-tight">Driver Assignment Required</h4>
                        <p className="text-[11px] text-amber-800 dark:text-amber-400/90 mt-0.5 leading-snug">
                            Assign an active driver and vehicle plate to dispatch this shipment.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                    {onOpenAssignDriver && (
                        <Button
                            variant="primary"
                            className="w-full h-7.5 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[4px] cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                            onClick={onOpenAssignDriver}
                        >
                            <UserPlus size={13} />
                            <span>Assign Fleet Driver</span>
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    // State 3: POD Already Uploaded (Pending Review)
    if (podUploaded) {
        return (
            <>
                <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-lg p-3 sm:p-3.5 shadow-2xs space-y-2.5 font-sans">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center shrink-0 mt-0.5">
                                <FileText size={14} />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">Proof of Delivery (POD) Submitted</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                                    Delivery note receipt is under shipper verification.
                                </p>
                            </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
                            Under Review
                        </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <Button
                            variant="outline"
                            className="flex-1 h-7.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-[#1e2329] rounded-[4px] cursor-pointer flex items-center justify-center gap-1.5"
                            onClick={() => setIsOpenPreviewModal(true)}
                        >
                            <Eye size={12} />
                            <span>Preview POD Receipt</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 h-7.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-[#1e2329] rounded-[4px] cursor-pointer flex items-center justify-center gap-1.5"
                            onClick={onOpenUploadModal}
                        >
                            <Upload size={12} />
                            <span>Re-upload</span>
                        </Button>
                    </div>
                </div>

                {isOpenPreviewModal && (
                    <SupplierPODDocModal
                        order={order}
                        onClose={() => setIsOpenPreviewModal(false)}
                    />
                )}
            </>
        );
    }

    // State 4: POD Action Required
    return (
        <>
            <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-lg p-3 sm:p-3.5 shadow-2xs space-y-2.5 font-sans">
                <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText size={14} />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 leading-tight">Proof of Delivery (POD) Action</h4>
                        <p className="text-[11px] text-amber-800 dark:text-amber-400/90 mt-0.5 leading-snug">
                            Upload the signed bill of lading or delivery receipt to request Escrow payout release.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                    <Button
                        variant="outline"
                        className="flex-1 h-7.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-[#1e2329] rounded-[4px] cursor-pointer flex items-center justify-center gap-1.5"
                        onClick={onOpenStatusModal}
                    >
                        <RefreshCw size={12} />
                        <span>Update Status</span>
                    </Button>
                    <Button
                        variant="primary"
                        className="flex-1 h-7.5 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white rounded-[4px] cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                        onClick={onOpenUploadModal}
                    >
                        <Upload size={13} />
                        <span>Upload Signed POD</span>
                    </Button>
                </div>
            </div>

            {isOpenPreviewModal && (
                <SupplierPODDocModal
                    order={order}
                    onClose={() => setIsOpenPreviewModal(false)}
                />
            )}
        </>
    );
}

function SupplierPODDocModal({
    order,
    onClose,
}: {
    order?: any;
    onClose: () => void;
}) {
    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200 font-sans">
            <div className="bg-white dark:bg-[#181d24] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden flex flex-col font-sans">
                {/* Modal Header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-[#1e2329]">
                    <div className="flex items-center gap-2">
                        <FileText size={15} className="text-[#ff4a1f]" />
                        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            Signed Delivery Note / POD • {order?.id || 'ORD-0001'}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1">
                        <X size={16} />
                    </button>
                </div>

                {/* Modal Document Preview */}
                <div className="p-4 space-y-3">
                    <div className="border border-slate-200 dark:border-slate-700/80 rounded-[4px] p-4 bg-slate-50/50 dark:bg-[#12161c]/60 space-y-3">
                        <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-700/60 pb-2.5">
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">PROOF OF DELIVERY RECEIPT</h4>
                                <p className="text-[10.5px] text-slate-500">Carrier Direct Standard CMR Form</p>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                SIGNED & RECEIVED
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div>
                                <span className="text-slate-400 text-[10px] block">Consignee Receiver:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{order?.customer?.name || 'Customer'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 text-[10px] block">Receiver Contact:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">+880 1712 345678</span>
                            </div>
                            <div>
                                <span className="text-slate-400 text-[10px] block">Delivery Location:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{order?.to || 'Manchester, UK'}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 text-[10px] block">Carrier Driver:</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{order?.driver?.name || 'Assigned Driver'}</span>
                            </div>
                        </div>

                        {/* Visual Signature Strip */}
                        <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={16} className="text-emerald-600" />
                                <div>
                                    <p className="text-[10.5px] font-bold text-slate-900 dark:text-slate-100">Electronic E-Signature Timestamped</p>
                                    <p className="text-[9.5px] text-slate-400 font-mono">HASH: SHA256-8F0E9A12B4C5D6E7</p>
                                </div>
                            </div>
                            <span className="font-serif italic text-sm text-slate-700 dark:text-slate-300 px-2">Verified Sign</span>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50 dark:bg-[#1e2329]">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] font-medium text-slate-600 dark:text-slate-300 cursor-pointer"
                        onClick={() => alert(`Downloading signed POD document for ${order?.id || 'Shipment'}...`)}
                    >
                        <Download size={12} className="mr-1" />
                        Download PDF
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-[11px] font-semibold cursor-pointer"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
}
