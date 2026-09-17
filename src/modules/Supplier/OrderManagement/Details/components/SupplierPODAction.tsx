import React, { useState } from 'react';
import { FileText, CheckCircle2, Upload, Eye, UserPlus, RefreshCw, X, Truck, Navigation } from 'lucide-react';
import Button from '@/components/ui/button';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';

interface SupplierPODActionProps {
    isPodAccepted: boolean;
    podUploaded: boolean;
    onOpenUploadModal: () => void;
    onOpenStatusModal: () => void;
    onOpenAssignDriver: () => void;
    order: NormalizedSupplierOrder;
}

export const SupplierPODAction: React.FC<SupplierPODActionProps> = ({
    isPodAccepted,
    podUploaded,
    onOpenUploadModal,
    onOpenStatusModal,
    onOpenAssignDriver,
    order,
}) => {
    const [isOpenPreviewModal, setIsOpenPreviewModal] = useState<boolean>(false);

    const isDriverAssigned = Boolean(
        order.driver?.name &&
        order.driver.name !== 'Unassigned' &&
        order.driver.name !== 'Assigned Fleet Driver' &&
        order.driver.name !== 'Assigned Driver'
    );

    const rawStatus = (order.rawStatus || order.status || '').toLowerCase().trim();

    // State 1: POD Accepted & Escrow Released
    if (isPodAccepted || rawStatus === 'completed') {
        return (
            <>
                <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-3.5 space-y-2.5 font-sans shadow-2xs">
                    <div className="flex items-start gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 size={15} />
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-1">
                            <h4 className="text-xs sm:text-[13px] font-bold text-emerald-900 dark:text-emerald-300 leading-tight">
                                POD Approved • Payout Released
                            </h4>
                            <p className="text-[11px] text-emerald-800/90 dark:text-emerald-400 leading-snug">
                                The delivery receipt was verified by the customer. Carrier payout has been disbursed.
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-8 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 bg-white dark:bg-[#1e2329] cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                        onClick={() => setIsOpenPreviewModal(true)}
                    >
                        <Eye size={12} />
                        <span>View Verified POD</span>
                    </Button>
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

    // State 2: Driver not assigned yet
    if (!isDriverAssigned) {
        return (
            <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/80 rounded-xl p-3.5 space-y-2.5 font-sans shadow-2xs">
                <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <UserPlus size={14} />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                        <h4 className="text-xs sm:text-[13px] font-bold text-blue-900 dark:text-blue-300 leading-tight">
                            Driver Assignment Required
                        </h4>
                        <p className="text-[11px] text-blue-800/90 dark:text-blue-400 leading-snug">
                            Assign a driver and vehicle plate to dispatch this shipment for pickup.
                        </p>
                    </div>
                </div>

                <Button
                    variant="primary"
                    size="sm"
                    className="w-full h-8 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                    onClick={onOpenAssignDriver}
                >
                    <UserPlus size={13} />
                    <span>Assign Fleet Driver</span>
                </Button>
            </div>
        );
    }

    // State 3: POD Uploaded & Under Review
    if (podUploaded || order.podUploaded) {
        return (
            <>
                <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-2.5 font-sans shadow-2xs">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center shrink-0 mt-0.5">
                                <FileText size={14} />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                    POD Submitted & Under Review
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                                    Delivery note receipt is awaiting customer verification before payout release.
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
                            size="sm"
                            className="flex-1 h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#1e2329] cursor-pointer flex items-center justify-center gap-1.5"
                            onClick={() => setIsOpenPreviewModal(true)}
                        >
                            <Eye size={12} />
                            <span>Preview POD</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#1e2329] cursor-pointer flex items-center justify-center gap-1.5"
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

    // State 4: Shipment in Transit (Driver Assigned, Picked Up, In Transit) - NOT ready for POD yet
    const isReadyForPod = rawStatus === 'arrived' || rawStatus === 'delivered' || rawStatus === 'destination reached';

    if (!isReadyForPod) {
        return (
            <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/80 rounded-xl p-3.5 space-y-2.5 font-sans shadow-2xs">
                <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Truck size={14} />
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                        <h4 className="text-xs sm:text-[13px] font-bold text-blue-900 dark:text-blue-300 leading-tight">
                            Shipment In Progress
                        </h4>
                        <p className="text-[11px] text-blue-800/90 dark:text-blue-400 leading-snug">
                            Driver {order.driver?.name || 'assigned'} is executing the haulage. Update shipment status as milestones are reached.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-0.5">
                    <Button
                        variant="primary"
                        size="sm"
                        className="w-full h-8 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                        onClick={onOpenStatusModal}
                    >
                        <RefreshCw size={12} />
                        <span>Update Shipment Status</span>
                    </Button>
                </div>
            </div>
        );
    }

    // State 5: Reached Destination / Delivered -> Now Proof of Delivery Required
    return (
        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-xl p-3.5 space-y-2.5 font-sans shadow-2xs">
            <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={14} />
                </div>
                <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-[13px] font-bold text-amber-900 dark:text-amber-300 leading-tight">
                        Proof of Delivery Required
                    </h4>
                    <p className="text-[11px] text-amber-800/90 dark:text-amber-400 leading-snug">
                        Shipment arrived at destination. Upload signed delivery receipt from customer to complete order and release payout.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 pt-0.5">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-[#1e2329] cursor-pointer flex items-center justify-center gap-1.5"
                    onClick={onOpenStatusModal}
                >
                    <RefreshCw size={12} />
                    <span>Update Status</span>
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 h-8 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
                    onClick={onOpenUploadModal}
                >
                    <Upload size={12} />
                    <span>Upload POD</span>
                </Button>
            </div>
        </div>
    );
};

function SupplierPODDocModal({ order, onClose }: { order: NormalizedSupplierOrder; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <FileText size={17} className="text-[#ff4a1f]" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            Proof of Delivery Document
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-2.5 min-h-[180px]">
                        <div className="w-13 h-13 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff4a1f] flex items-center justify-center border border-orange-200 dark:border-orange-800/60">
                            <FileText size={26} />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                CarrierDirect_Signed_POD_{order.id}.pdf
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                Verified Carrier Haulage Receipt
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end bg-slate-50 dark:bg-slate-800/30">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="h-8 px-4 text-xs font-semibold"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SupplierPODAction;
