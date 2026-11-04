import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, FileText, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/button';
import { SubcontractorCostItem } from '../types/subcontractor.types';

interface AdminInvoiceVerificationModalProps {
    isOpen: boolean;
    costItem: SubcontractorCostItem | null;
    orderNumber: string;
    onClose: () => void;
    onApproveAsAccrued: (costId: string) => void;
    onReject: (costId: string) => void;
}

export const AdminInvoiceVerificationModal: React.FC<AdminInvoiceVerificationModalProps> = ({
    isOpen,
    costItem,
    orderNumber,
    onClose,
    onApproveAsAccrued,
    onReject,
}) => {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen || !costItem) return null;

    const handleApprove = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onApproveAsAccrued(costItem.id);
            setIsProcessing(false);
            onClose();
        }, 400);
    };

    const handleRejectClick = () => {
        setIsProcessing(true);
        setTimeout(() => {
            onReject(costItem.id);
            setIsProcessing(false);
            onClose();
        }, 400);
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 font-sans">
            <div className="bg-white dark:bg-[#1e2329] rounded-[6px] max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-slate-800 dark:text-slate-200">
                {/* Modal Header (Step 4: Order #CD-1025 Admin View) */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                    Invoice Verification
                                </h3>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                    Admin View
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Order: <strong className="font-mono text-slate-800 dark:text-slate-200">{orderNumber}</strong>
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

                {/* Verification Detail Grid (Step 4 in Mockup) */}
                <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-[4px] border border-slate-200 dark:border-slate-700 text-xs">
                    <div className="grid grid-cols-[130px_1fr] gap-y-2.5">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Subcontractor:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            {costItem.subcontractor_name}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Journey Leg:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {costItem.journey_leg}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Agreed Cost:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                            €{Number(costItem.agreed_cost).toFixed(2)}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Invoice Number:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                            {costItem.invoice_number || 'INV-789'}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Invoice Date:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {costItem.invoice_date || '15 Sep 2024'}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Invoice Amount:</span>
                        <span className="font-bold text-[#ff4a1f]">
                            €{Number(costItem.invoice_amount || costItem.agreed_cost).toFixed(2)}
                        </span>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Invoice File:</span>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded">
                                <FileText size={12} className="text-[#ff4a1f]" />
                                <span>{costItem.invoice_file_name || 'abc-invoice-789.pdf'}</span>
                                <span className="text-slate-400 text-[10px]">({costItem.invoice_file_size || '2.1 MB'})</span>
                            </span>
                            <button
                                type="button"
                                onClick={() => alert(`Viewing file: ${costItem.invoice_file_name || 'abc-invoice-789.pdf'}`)}
                                className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer flex items-center gap-0.5"
                            >
                                <span>View</span>
                                <ExternalLink size={10} />
                            </button>
                        </div>

                        <span className="text-slate-500 dark:text-slate-400 font-medium">Verification Status:</span>
                        <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                <span>Pending Verification</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons (Reject vs Approve as Accrued - Step 4 in Mockup) */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isProcessing}
                        onClick={handleRejectClick}
                        className="h-8.5 px-4 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 dark:border-rose-900/60"
                    >
                        Reject
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        disabled={isProcessing}
                        onClick={handleApprove}
                        className="h-8.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[4px] shadow-2xs flex items-center gap-1.5"
                    >
                        <CheckCircle2 size={13} />
                        <span>{isProcessing ? 'Approving...' : 'Approve as Accrued'}</span>
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AdminInvoiceVerificationModal;

