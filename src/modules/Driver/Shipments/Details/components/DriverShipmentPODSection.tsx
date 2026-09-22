import React from 'react';
import { FileCheck, CheckCircle2, User, Clock, FileText, Camera } from 'lucide-react';
import { ShipmentItem } from '../../../types';
import { requireDriverCompliance } from '../../../Compliance';

interface Props {
    shipment: ShipmentItem;
    onOpenPOD: () => void;
}

export const DriverShipmentPODSection: React.FC<Props> = ({ shipment, onOpenPOD }) => {
    const pod = shipment.podData;

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
                {pod ? (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                        Verified Sign-off
                    </span>
                ) : (
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        Pending Sign-off
                    </span>
                )}
            </div>

            {pod ? (
                <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 rounded-lg space-y-2">
                        <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-[11.5px]">
                            <CheckCircle2 size={14} className="text-emerald-600" />
                            <span>Receiver Signature & Sign-Off Captured</span>
                        </div>

                        <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-700 dark:text-slate-300">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Signed By:</span>
                                <span className="font-bold text-slate-900 dark:text-slate-100">{pod.receiverName}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500 dark:text-slate-400">Timestamp:</span>
                                <span className="font-medium text-slate-800 dark:text-slate-200">{new Date(pod.uploadedAt).toLocaleString()}</span>
                            </div>
                        </div>

                        {pod.signatureUrl && (
                            <div className="mt-1.5 p-1.5 bg-white dark:bg-slate-900 rounded border border-emerald-200 dark:border-emerald-900/40">
                                <span className="text-[10px] text-slate-400 block mb-0.5">Digital Signature:</span>
                                <img
                                    src={pod.signatureUrl}
                                    alt="Receiver Signature"
                                    className="max-h-16 w-auto object-contain mx-auto"
                                />
                            </div>
                        )}

                        {pod.notes && (
                            <div className="text-[10.5px] text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 p-1.5 rounded">
                                <span className="font-semibold text-slate-800 dark:text-slate-200">Notes:</span> {pod.notes}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-2.5">
                    <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-snug">
                        Obtain the receiver's digital signature or snap a photo of the signed Bill of Lading (BOL) upon delivery.
                    </p>

                    <button
                        type="button"
                        onClick={handleUploadClick}
                        className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <Camera size={13} className="text-[#FF4A1F]" />
                        <span>Upload POD / Signature</span>
                    </button>
                </div>
            )}
        </div>
    );
};
