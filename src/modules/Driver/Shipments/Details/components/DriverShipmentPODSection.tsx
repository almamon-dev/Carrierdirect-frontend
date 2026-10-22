import React, { useState } from 'react';
import { FileCheck, CheckCircle2, Camera, Eye, X, FileText } from 'lucide-react';
import { ShipmentItem } from '../../../types';
import { requireDriverCompliance } from '../../../Compliance';
import { StatusBadge } from '@/components/common/StatusBadge';

interface Props {
    shipment: ShipmentItem;
    onOpenPOD: () => void;
}

export const DriverShipmentPODSection: React.FC<Props> = ({ shipment, onOpenPOD }) => {
    const pod = shipment.podData;
    const [viewDocUrl, setViewDocUrl] = useState<string | null>(null);

    const handleUploadClick = () => {
        requireDriverCompliance(() => {
            onOpenPOD();
        }, 'Upload Proof of Delivery');
    };

    return (
        <div className="bg-white dark:bg-[#1e2329] p-3.5 sm:p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                    <FileCheck size={14} className="text-[#FF4A1F]" />
                    <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-slate-100">
                        Proof of Delivery (POD)
                    </h3>
                </div>
                <StatusBadge 
                    status={pod ? "Verified Sign-off" : "Pending Sign-off"} 
                    category={pod ? "success" : "pending"} 
                />
            </div>

            {pod ? (
                <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 rounded-lg space-y-2">
                        <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-[11.5px]">
                            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                            <span>Receiver Signature & Sign-Off Captured</span>
                        </div>

                        <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-700 dark:text-slate-300">
                            {pod.receiverName && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Signed By:</span>
                                    <span className="font-bold text-slate-900 dark:text-slate-100">{pod.receiverName}</span>
                                </div>
                            )}
                            {pod.uploadedAt && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-slate-400">Timestamp:</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-200">
                                        {new Date(pod.uploadedAt).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Signature Preview */}
                        {pod.signatureUrl && (
                            <div className="mt-1.5 p-2 bg-white dark:bg-slate-900 rounded border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={pod.signatureUrl}
                                        alt="Receiver Signature"
                                        className="h-8 max-w-[120px] object-contain border border-slate-200 dark:border-slate-800 rounded bg-white px-1"
                                    />
                                    <span className="text-[10px] text-slate-500">Receiver Signature</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setViewDocUrl(pod.signatureUrl!)}
                                    className="px-2 py-1 text-[10.5px] font-semibold text-[#FF4A1F] hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                    <Eye size={12} />
                                    <span>View</span>
                                </button>
                            </div>
                        )}

                        {/* Document Photo Preview */}
                        {pod.documentPhotos && pod.documentPhotos[0] && (
                            <div className="mt-1.5 p-2 bg-white dark:bg-slate-900 rounded border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0">
                                    <img
                                        src={pod.documentPhotos[0]}
                                        alt="Signed BOL Document"
                                        className="w-9 h-9 object-cover rounded border border-slate-200 dark:border-slate-800 shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                                            Signed Paper BOL / Cargo Photo
                                        </p>
                                        <p className="text-[10px] text-slate-400">Attached Delivery Proof</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setViewDocUrl(pod.documentPhotos![0])}
                                    className="px-2 py-1 text-[10.5px] font-semibold text-[#FF4A1F] hover:bg-orange-50 dark:hover:bg-orange-950/30 rounded flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                                >
                                    <Eye size={12} />
                                    <span>View Photo</span>
                                </button>
                            </div>
                        )}

                        {pod.notes && (
                            <div className="text-[10.5px] text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 p-1.5 rounded">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">Notes:</span> {pod.notes}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleUploadClick}
                        className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <Camera size={13} className="text-[#FF4A1F]" />
                        <span>Update / Re-upload POD</span>
                    </button>
                </div>
            ) : (
                <div className="space-y-2.5">
                    <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-snug">
                        Obtain the receiver's digital signature or snap a photo of the signed Bill of Lading (BOL) upon delivery.
                    </p>

                    <button
                        type="button"
                        onClick={handleUploadClick}
                        className="w-full py-1.5 px-3 bg-[#FF4A1F] hover:bg-[#e03d15] text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                        <Camera size={13} />
                        <span>Upload POD / Signature</span>
                    </button>
                </div>
            )}

            {/* Document / Photo View Lightbox */}
            {viewDocUrl && (
                <div
                    className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setViewDocUrl(null)}
                >
                    <div
                        className="relative max-w-4xl max-h-[90vh] bg-[#12161c] rounded-[4px] border border-slate-800 overflow-hidden flex flex-col shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white">
                            <span className="text-xs font-bold flex items-center gap-2">
                                <FileCheck size={15} className="text-emerald-500" />
                                Proof of Delivery Sign-Off Document
                            </span>
                            <button
                                type="button"
                                onClick={() => setViewDocUrl(null)}
                                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-3 flex-1 overflow-auto flex items-center justify-center max-h-[calc(90vh-50px)]">
                            <img
                                src={viewDocUrl}
                                alt="POD Document"
                                className="max-w-full max-h-[80vh] object-contain rounded"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
