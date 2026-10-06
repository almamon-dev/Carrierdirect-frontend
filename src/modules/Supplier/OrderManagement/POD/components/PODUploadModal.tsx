import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';
import { PODOrderItem } from '../types';

interface PODUploadModalProps {
    isOpen: boolean;
    orders: PODOrderItem[];
    initialOrder: PODOrderItem | null;
    isSubmitting: boolean;
    onClose: () => void;
    onUpload: (orderId: string | number, file: File) => Promise<boolean>;
}

export const PODUploadModal: React.FC<PODUploadModalProps> = ({
    isOpen,
    orders,
    initialOrder,
    isSubmitting,
    onClose,
    onUpload,
}) => {
    const [selectedOrderId, setSelectedOrderId] = useState<string>(
        initialOrder ? String(initialOrder.slug || initialOrder.id) : ''
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string>('');

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 20 * 1024 * 1024) {
                setErrorMsg('File size must be under 20MB.');
                return;
            }
            setSelectedFile(file);
            setErrorMsg('');
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.size > 20 * 1024 * 1024) {
                setErrorMsg('File size must be under 20MB.');
                return;
            }
            setSelectedFile(file);
            setErrorMsg('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrderId) {
            setErrorMsg('Please select an order reference.');
            return;
        }
        if (!selectedFile) {
            setErrorMsg('Please attach a signed POD document.');
            return;
        }

        const success = await onUpload(selectedOrderId, selectedFile);
        if (success) {
            onClose();
        } else {
            setErrorMsg('Failed to upload POD document. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-100 font-sans">
            <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-[#1e2329] rounded-xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 text-left"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Upload Proof of Delivery (POD)
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {errorMsg && (
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-md">
                        {errorMsg}
                    </div>
                )}

                {/* Order Selector */}
                <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Select Order Reference
                    </label>
                    <Select
                        showSearch={false}
                        className="text-xs w-full"
                        value={selectedOrderId}
                        onChange={(val) => {
                            const v = typeof val === 'object' && val?.target ? val.target.value : val;
                            setSelectedOrderId(v);
                        }}
                    >
                        <option value="">Select an order to upload POD</option>
                        {orders.map((o) => (
                            <option key={o.id} value={o.slug || o.id}>
                                {o.order_id || o.id} - {o.customer_name} ({o.route})
                            </option>
                        ))}
                    </Select>
                </div>

                {/* Drag and Drop File Upload Area */}
                <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Attach Signed Challan / Delivery Note (PDF, JPG, PNG)
                    </label>
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                            dragActive
                                ? 'border-[#ff4a1f] bg-orange-50/40 dark:bg-[#ff4a1f]/10'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
                        }`}
                    >
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {selectedFile ? (
                            <div className="space-y-1">
                                <CheckCircle2 size={32} className="mx-auto text-emerald-500" />
                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs mx-auto">
                                    {selectedFile.name}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <Upload size={28} className="mx-auto text-slate-400" />
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    Click or drag & drop signed POD here
                                </p>
                                <p className="text-[11px] text-slate-400">
                                    Supports PDF, JPG, PNG up to 20MB
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-2 justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
                    <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={onClose}
                        className="text-xs font-semibold cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        disabled={isSubmitting}
                        className="text-xs font-bold bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                        {isSubmitting ? (
                            <>
                                <span className="animate-spin text-white">⟳</span>
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload size={13} />
                                <span>Upload POD</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PODUploadModal;
