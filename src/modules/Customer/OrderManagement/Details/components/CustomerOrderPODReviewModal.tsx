import React from 'react';
import { FileText, Check, X, CheckCircle2, UserCheck, ExternalLink, Clock, MapPin, Truck } from 'lucide-react';
import Button from '@/components/ui/button';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';

interface CustomerOrderPODReviewModalProps {
    isOpen: boolean;
    order: NormalizedCustomerOrder;
    isSubmitting: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export const CustomerOrderPODReviewModal: React.FC<CustomerOrderPODReviewModalProps> = ({
    isOpen,
    order,
    isSubmitting,
    onClose,
    onAccept,
}) => {
    if (!isOpen) return null;

    const receiverName = order.pod.receiverName || (order.delivery as any)?.contactName || '';
    const carrierDriver = order.driver?.name
        ? `${order.driver.name}${order.vehicle?.number ? ' (' + order.vehicle.number + ')' : ''}`
        : order.supplier?.name || '';
    const deliveryAddress = order.delivery?.address || order.delivery?.city || '';
    const uploadedAt = order.pod.uploadedAt || '';
    const fileUrl = order.pod.fileUrl || '';
    const isPdf = fileUrl.toLowerCase().includes('.pdf');
    const isImage = /\.(jpg|jpeg|png|webp|gif)/i.test(fileUrl);
    const fileName = order.pod.fileName || (fileUrl ? fileUrl.split('/').pop() : '') || '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150 font-sans">
            <div className="bg-white dark:bg-[#1e2329] border border-slate-200 dark:border-slate-800 rounded-xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                <div className="p-3 sm:p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[#ff4a1f] shrink-0">
                            <FileText size={15} />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                Proof of Delivery Verification
                            </h3>
                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                                Order: <strong className="font-mono text-slate-700 dark:text-slate-300">{order.id}</strong>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                        <X size={15} />
                    </button>
                </div>

                <div className="p-3.5 sm:p-4 space-y-3 overflow-y-auto font-sans text-xs">
                    {fileUrl && (
                        <div className="border border-slate-200 dark:border-slate-700/80 rounded-lg overflow-hidden">
                            <div className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <FileText size={12} className="text-[#ff4a1f] shrink-0" />
                                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">{fileName || 'POD Document'}</span>
                                </div>
                                <a href={fileUrl} target="_blank" rel="noreferrer" className="ml-2 shrink-0 text-[11px] font-semibold text-[#ff4a1f] hover:underline flex items-center gap-0.5">
                                    <ExternalLink size={10} />
                                    <span>Open</span>
                                </a>
                            </div>
                            {isImage ? (
                                <img src={fileUrl} alt="Proof of Delivery" className="w-full h-auto max-h-[280px] object-contain bg-slate-50 dark:bg-slate-900/50" />
                            ) : isPdf ? (
                                <iframe src={fileUrl} title="POD Document" className="w-full h-[280px] bg-slate-50 dark:bg-slate-900/50" />
                            ) : (
                                <div className="p-6 flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-900/50">
                                    <FileText size={32} className="text-[#ff4a1f]" />
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">{fileName || 'POD Document attached'}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="border border-slate-200 dark:border-slate-700/80 rounded-lg p-3 bg-slate-50/70 dark:bg-slate-900/40 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <UserCheck size={13} className="text-emerald-600" />
                                <span>Consignee Handover Signature</span>
                            </span>
                            <span className="text-[9.5px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.5 rounded">Verified</span>
                        </div>
                        {order.pod.signatureUrl ? (
                            <div className="border border-dashed border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-[#12161c] p-2 flex flex-col items-center justify-center">
                                <img src={order.pod.signatureUrl} alt="Receiver Signature" className="max-h-20 object-contain" />
                                {receiverName && <p className="text-[10px] text-slate-400 mt-1">Signed by: <strong className="text-slate-700 dark:text-slate-300">{receiverName}</strong></p>}
                            </div>
                        ) : (
                            <div className="border border-dashed border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-[#12161c] p-2.5 flex items-center justify-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{receiverName ? `Electronic Delivery Confirmed by ${receiverName}` : 'Electronic Delivery Confirmed'}</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50/50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 space-y-1.5 text-[11.5px]">
                        {deliveryAddress && (
                            <div className="flex items-start gap-2">
                                <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                                <div className="min-w-0"><span className="text-slate-500">Delivery Point: </span><span className="font-semibold text-slate-800 dark:text-slate-200">{deliveryAddress}</span></div>
                            </div>
                        )}
                        {receiverName && (
                            <div className="flex items-start gap-2">
                                <UserCheck size={12} className="text-slate-400 shrink-0 mt-0.5" />
                                <div><span className="text-slate-500">Recipient: </span><span className="font-semibold text-slate-800 dark:text-slate-200">{receiverName}</span></div>
                            </div>
                        )}
                        {carrierDriver && (
                            <div className="flex items-start gap-2">
                                <Truck size={12} className="text-slate-400 shrink-0 mt-0.5" />
                                <div><span className="text-slate-500">Carrier / Driver: </span><span className="font-semibold text-slate-800 dark:text-slate-200">{carrierDriver}</span></div>
                            </div>
                        )}
                        {uploadedAt && (
                            <div className="flex items-start gap-2">
                                <Clock size={12} className="text-slate-400 shrink-0 mt-0.5" />
                                <div><span className="text-slate-500">Submitted: </span><span className="font-semibold text-slate-800 dark:text-slate-200">{uploadedAt}</span></div>
                            </div>
                        )}
                        <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/60 mt-1">
                            <span className="text-slate-500">Escrow Payout:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{order.pricing?.totalFormatted || '€ 0.00'}</span>
                        </div>
                        {order.pod.note && (
                            <div className="flex items-start gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/60">
                                <span className="text-slate-500">Remarks: </span>
                                <span className="font-medium text-slate-700 dark:text-slate-300 italic">"{order.pod.note}"</span>
                            </div>
                        )}
                    </div>

                    <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>Approving will complete the order and immediately disburse payout to the carrier.</span>
                    </div>
                </div>

                <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50 dark:bg-slate-800/40">
                    <Button variant="outline" size="sm" onClick={onClose} className="h-8 px-3.5 text-xs font-semibold cursor-pointer">
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" disabled={isSubmitting} onClick={onAccept} className="h-8 px-4 text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 cursor-pointer shadow-2xs">
                        <Check size={13} />
                        <span>{isSubmitting ? 'Accepting...' : 'Accept'}</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CustomerOrderPODReviewModal;
