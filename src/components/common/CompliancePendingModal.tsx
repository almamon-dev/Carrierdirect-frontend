import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, FileText, ArrowRight, X, Clock } from 'lucide-react';
import Button from '@/components/ui/button';

interface CompliancePendingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export const CompliancePendingModal: React.FC<CompliancePendingModalProps> = ({
    isOpen,
    onClose,
    title = 'Verification Required',
    description = 'Your compliance documents (Insurance & Carrier License) are currently being reviewed by our admin team. Submitting commercial quotes and executing jobs will be unlocked once approved.',
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div 
                className="fixed inset-0 cursor-default"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-white dark:bg-[#181a20] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 space-y-5 animate-in zoom-in-95 duration-150 text-left font-sans">
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <X size={16} />
                </button>

                {/* Header with Icon */}
                <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 shadow-xs">
                        <ShieldAlert size={22} />
                    </div>
                    <div className="space-y-1 min-w-0 pr-6">
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            {title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Verification Steps Card */}
                <div className="bg-slate-50 dark:bg-[#12161c] rounded-lg p-3.5 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                            <FileText size={14} className="text-slate-400" />
                            <span>Insurance Policy</span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                            <Clock size={11} /> Under Review
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                            <FileText size={14} className="text-slate-400" />
                            <span>Carrier Operating License</span>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                            <Clock size={11} /> Under Review
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-1">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 text-xs font-semibold rounded-[4px] border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        className="h-9 px-4 text-xs font-semibold rounded-[4px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                        onClick={() => {
                            onClose();
                            navigate('/supplier/settings');
                        }}
                    >
                        <span>View Compliance Status</span>
                        <ArrowRight size={13} />
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CompliancePendingModal;
