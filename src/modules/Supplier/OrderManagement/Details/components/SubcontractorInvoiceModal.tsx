import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import FormLabel from '@/components/ui/label';
import { SubcontractorCostItem } from '../types/subcontractor.types';

interface SubcontractorInvoiceModalProps {
    isOpen: boolean;
    costItem: SubcontractorCostItem | null;
    onClose: () => void;
    onSaveInvoice: (
        costId: string,
        invoiceData: {
            invoice_number: string;
            invoice_date: string;
            invoice_amount: number;
            notes?: string;
            file_name?: string;
            file_size?: string;
            file?: File;
        }
    ) => void;
}

export const SubcontractorInvoiceModal: React.FC<SubcontractorInvoiceModalProps> = ({
    isOpen,
    costItem,
    onClose,
    onSaveInvoice,
}) => {
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
    const [invoiceAmount, setInvoiceAmount] = useState(
        costItem ? String(costItem.agreed_cost) : ''
    );
    const [notes, setNotes] = useState('');
    const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
    const [fileObject, setFileObject] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronize initial amount when cost item changes
    React.useEffect(() => {
        if (costItem) {
            setInvoiceAmount(String(costItem.agreed_cost || ''));
            setInvoiceNumber(costItem.invoice_number || '');
            setInvoiceDate(costItem.invoice_date || new Date().toISOString().slice(0, 10));
            setNotes(costItem.notes || '');
            if (costItem.invoice_file_name) {
                setUploadedFile({
                    name: costItem.invoice_file_name,
                    size: costItem.invoice_file_size || '2.1 MB',
                });
            } else {
                setUploadedFile(null);
            }
        }
    }, [costItem]);

    if (!isOpen || !costItem) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileObject(file);
            const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
            setUploadedFile({
                name: file.name,
                size: `${sizeMb} MB`,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoiceNumber.trim()) return;

        setIsSubmitting(true);
        setTimeout(() => {
            onSaveInvoice(costItem.id, {
                invoice_number: invoiceNumber.trim(),
                invoice_date: invoiceDate,
                invoice_amount: parseFloat(invoiceAmount) || costItem.agreed_cost,
                notes: notes.trim(),
                file_name: uploadedFile?.name || `${costItem.subcontractor_name.toLowerCase().replace(/\s+/g, '-')}-invoice.pdf`,
                file_size: uploadedFile?.size || '1.8 MB',
                file: fileObject || undefined,
            });
            setIsSubmitting(false);
            onClose();
        }, 400);
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
            <div className="bg-white dark:bg-[#1e2329] rounded-[6px] max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-slate-800 dark:text-slate-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[#ff4a1f]">
                            <FileText size={17} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                Upload Subcontractor Invoice
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {costItem.subcontractor_name} • {costItem.journey_leg}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Invoice Number *
                            </FormLabel>
                            <Input
                                type="text"
                                required
                                value={invoiceNumber}
                                onChange={(e) => setInvoiceNumber(e.target.value)}
                                placeholder="e.g. INV-789"
                                className="h-8.5 text-xs font-semibold"
                            />
                        </div>

                        <div className="space-y-1">
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Invoice Date *
                            </FormLabel>
                            <Input
                                type="date"
                                required
                                value={invoiceDate}
                                onChange={(e) => setInvoiceDate(e.target.value)}
                                className="h-8.5 text-xs font-semibold"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Invoice Amount (€) *
                        </FormLabel>
                        <Input
                            type="number"
                            step="0.01"
                            required
                            value={invoiceAmount}
                            onChange={(e) => setInvoiceAmount(e.target.value)}
                            placeholder="e.g. 200.00"
                            className="h-8.5 text-xs font-semibold"
                        />
                    </div>

                    {/* File Upload Box */}
                    <div className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Upload Invoice File (PDF or Image)
                        </FormLabel>

                        {uploadedFile ? (
                            <div className="flex items-center justify-between p-2.5 rounded-[4px] border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 text-xs">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {uploadedFile.name}
                                    </span>
                                    <span className="text-slate-400">({uploadedFile.size})</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setUploadedFile(null)}
                                    className="text-slate-400 hover:text-red-500 cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#ff4a1f] rounded-[4px] p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30">
                                <UploadCloud size={20} className="text-slate-400" />
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Click to select invoice file
                                </span>
                                <span className="text-[11px] text-slate-400">
                                    PDF, PNG, JPG up to 10MB
                                </span>
                                <input
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    <div className="space-y-1">
                        <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Notes (Optional)
                        </FormLabel>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            placeholder="e.g. Final delivery by external carrier"
                            className="w-full text-xs font-normal bg-slate-50 dark:bg-[#14181f] border border-slate-300 dark:border-slate-700 rounded-[4px] p-2 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#ff4a1f]"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onClose}
                            className="h-8.5 px-4 text-xs font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSubmitting}
                            className="h-8.5 px-5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold rounded-[4px] shadow-2xs"
                        >
                            {isSubmitting ? 'Uploading...' : 'Upload Invoice'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default SubcontractorInvoiceModal;

