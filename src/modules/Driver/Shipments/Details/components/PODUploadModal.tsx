import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    X,
    FileCheck,
    Check,
    Camera,
    Loader2,
    Eye,
    Trash2,
    RefreshCw,
    FileText,
    ExternalLink,
    UploadCloud,
    Maximize2
} from 'lucide-react';
import { DigitalSignaturePad } from './DigitalSignaturePad';

interface Props {
    isOpen: boolean;
    orderNumber: string;
    onClose: () => void;
    onSubmitPOD: (podData: {
        receiverName: string;
        signatureUrl?: string;
        documentPhotos?: string[];
        file?: File | null;
        notes?: string;
    }) => Promise<void>;
}

export const PODUploadModal: React.FC<Props> = ({ isOpen, orderNumber, onClose, onSubmitPOD }) => {
    const [receiverName, setReceiverName] = useState('');
    const [signatureUrl, setSignatureUrl] = useState('');
    const [notes, setNotes] = useState('');
    
    // File upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Clean up object URLs on unmount
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    if (!isOpen) return null;

    const handleFile = (file: File) => {
        if (file.size > 25 * 1024 * 1024) {
            setErrorMsg('File size must be under 25MB.');
            return;
        }
        setErrorMsg(null);

        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleRemoveFile = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const isPdf = selectedFile?.type === 'application/pdf' || selectedFile?.name.toLowerCase().endsWith('.pdf');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!receiverName.trim()) return;
        setIsSubmitting(true);
        setErrorMsg(null);
        try {
            await onSubmitPOD({
                receiverName: receiverName.trim(),
                signatureUrl: signatureUrl || undefined,
                documentPhotos: previewUrl ? [previewUrl] : undefined,
                file: selectedFile || undefined,
                notes: notes.trim(),
            });
            onClose();
        } catch (err: any) {
            console.error('POD submit error:', err);
            setErrorMsg(err?.response?.data?.message || err?.message || 'Failed to submit Proof of Delivery. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-[#1e2329] rounded-[4px] border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-[#161a22]/50">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-[3px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
                            <FileCheck size={16} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Proof of Delivery (POD)</h2>
                            <p className="text-[11px] text-slate-500">Order #{orderNumber} • Complete delivery sign-off</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[3px] transition-colors cursor-pointer"
                    >
                        <X size={17} />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 overflow-y-auto font-sans text-xs">
                    {errorMsg && (
                        <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
                            {errorMsg}
                        </div>
                    )}

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

                    {/* Paper BOL / Cargo Photo Upload & Live Preview Section */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                Signed Paper BOL or Cargo Photo (Optional)
                            </label>
                            {selectedFile && (
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <Check size={11} strokeWidth={3} /> Ready to Upload
                                </span>
                            )}
                        </div>

                        {selectedFile && previewUrl ? (
                            /* Uploaded File Preview Card */
                            <div className="border border-slate-200 dark:border-slate-700 rounded-[4px] p-2.5 bg-slate-50/70 dark:bg-[#161a22] space-y-2">
                                <div className="flex items-center gap-3">
                                    {/* Thumbnail Preview / PDF Icon */}
                                    <div
                                        onClick={() => {
                                            if (isPdf) {
                                                window.open(previewUrl, '_blank');
                                            } else {
                                                setIsLightboxOpen(true);
                                            }
                                        }}
                                        className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-[3px] overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0 cursor-pointer flex items-center justify-center"
                                        title="Click to view full preview"
                                    >
                                        {isPdf ? (
                                            <div className="flex flex-col items-center justify-center p-1 text-center">
                                                <FileText size={28} className="text-rose-500 mb-0.5" />
                                                <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">PDF</span>
                                            </div>
                                        ) : (
                                            <>
                                                <img
                                                    src={previewUrl}
                                                    alt="BOL Preview"
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                    <Maximize2 size={16} />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* File Information */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate" title={selectedFile.name}>
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                                                    {formatFileSize(selectedFile.size)} • {isPdf ? 'PDF Document' : 'Photo Image'}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveFile}
                                                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded cursor-pointer transition-colors"
                                                title="Remove file"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* Action Buttons to View & Replace */}
                                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (isPdf) {
                                                        window.open(previewUrl, '_blank');
                                                    } else {
                                                        setIsLightboxOpen(true);
                                                    }
                                                }}
                                                className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-[3px] text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                                {isPdf ? <ExternalLink size={12} className="text-[#FF4A1F]" /> : <Eye size={12} className="text-[#FF4A1F]" />}
                                                <span>{isPdf ? 'Open PDF Preview' : 'Preview Full Image'}</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="px-2 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-[3px] text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                                <RefreshCw size={11} className="text-slate-400" />
                                                <span>Replace</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Dropzone / Upload Area */
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`border border-dashed rounded-[4px] p-4 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer transition-all ${
                                    isDragActive
                                        ? 'border-[#FF4A1F] bg-orange-50/70 dark:bg-orange-950/20'
                                        : 'border-slate-300 dark:border-slate-700 hover:border-[#FF4A1F] bg-slate-50/50 dark:bg-slate-900/30'
                                }`}
                            >
                                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/40 text-[#FF4A1F] flex items-center justify-center">
                                    <Camera size={16} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                        Take photo or upload Signed BOL / Cargo Photo
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-0.5">
                                        Drag & drop or click to browse (JPG, PNG, WEBP, PDF up to 25MB)
                                    </div>
                                </div>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handlePhotoSelect}
                            className="hidden"
                        />
                    </div>

                    {/* Delivery Notes */}
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
                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="h-8 px-3.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[4px] transition-colors cursor-pointer inline-flex items-center justify-center disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !receiverName.trim()}
                            className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[4px] text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors disabled:opacity-60"
                        >
                            {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                            <span>{isSubmitting ? 'Uploading & Finishing...' : 'Confirm & Finish Delivery'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Lightbox Full Size Document / Photo Preview Modal */}
            {isLightboxOpen && previewUrl && !isPdf && (
                <div
                    className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <div
                        className="relative max-w-4xl max-h-[90vh] bg-[#12161c] rounded-[4px] border border-slate-800 overflow-hidden flex flex-col shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2 text-xs font-bold truncate">
                                <FileCheck size={15} className="text-emerald-500" />
                                <span className="truncate">{selectedFile?.name || 'Attached POD Document'}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsLightboxOpen(false)}
                                className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="p-2 flex-1 overflow-auto flex items-center justify-center max-h-[calc(90vh-50px)]">
                            <img
                                src={previewUrl}
                                alt="Full BOL / Photo Preview"
                                className="max-w-full max-h-[80vh] object-contain rounded"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};
