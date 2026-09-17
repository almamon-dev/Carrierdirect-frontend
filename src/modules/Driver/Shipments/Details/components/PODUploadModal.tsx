import React, { useState } from 'react';
import { X, FileCheck, Check, Camera, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import { DigitalSignaturePad } from './DigitalSignaturePad';

interface Props {
    isOpen: boolean;
    orderNumber: string;
    onClose: () => void;
    onSubmitPOD: (podData: { receiverName: string; signatureUrl?: string; documentPhotos?: string[]; notes?: string }) => Promise<void>;
}

export const PODUploadModal: React.FC<Props> = ({ isOpen, orderNumber, onClose, onSubmitPOD }) => {
    const [receiverName, setReceiverName] = useState('');
    const [signatureUrl, setSignatureUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [photoUploaded, setPhotoUploaded] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPhotoUploaded(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receiverName.trim()) return;
        setIsSubmitting(true);
        try {
            await onSubmitPOD({
                receiverName,
                signatureUrl: signatureUrl || undefined,
                documentPhotos: photoUploaded ? [photoUploaded] : undefined,
                notes,
            });
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[3px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                            <FileCheck size={16} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Proof of Delivery (POD)</h2>
                            <p className="text-[11px] text-slate-500">Order #{orderNumber} • Complete delivery sign-off</p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[3px] transition-colors cursor-pointer">
                        <X size={17} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 max-h-[75vh] overflow-y-auto font-sans text-xs">
                    {/* Receiver Name */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Receiver Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={receiverName}
                            onChange={(e) => setReceiverName(e.target.value)}
                            placeholder="e.g. Warehouse Lead / Consignee Agent"
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                            required
                        />
                    </div>

                    {/* Digital Signature Pad */}
                    <DigitalSignaturePad onSignatureCaptured={setSignatureUrl} />

                    {/* Paper BOL / Freight Photo Upload */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Signed Paper BOL or Cargo Photo (Optional)
                        </label>
                        <label className="border border-dashed border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] rounded-[4px] p-3 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/30">
                            {photoUploaded ? (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                    <Check size={14} />
                                    <span>Photo attached ready for upload</span>
                                </div>
                            ) : (
                                <>
                                    <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center">
                                        <Camera size={14} />
                                    </div>
                                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Take photo or upload image
                                    </div>
                                    <div className="text-[10px] text-slate-400">JPG, PNG up to 10MB</div>
                                </>
                            )}
                            <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                        </label>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Delivery Notes (Optional)
                        </label>
                        <textarea
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. Dock #12, All pallets received in good condition."
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-slate-700 rounded-[4px] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#FF4A1F]"
                        />
                    </div>

                    {/* Submit footer */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[4px] transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !receiverName.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-[4px] text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                        >
                            {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                            <span>Confirm & Finish Delivery</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
