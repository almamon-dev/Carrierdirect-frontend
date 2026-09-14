import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '@/components/ui/button';
import { FileText, X, Loader2, Upload } from 'lucide-react';

interface OrderPODModalProps {
    isOpen: boolean;
    onSubmit: (e: React.FormEvent) => Promise<void> | void;
    onClose: () => void;
}

export const OrderPODModal: React.FC<OrderPODModalProps> = ({
    isOpen,
    onSubmit,
    onClose,
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1e2329] rounded-[8px] max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[#ff4a1f]">
                            <FileText size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Upload Proof of Delivery</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Attach signed delivery receipt or CMR note.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1 cursor-pointer disabled:opacity-50"
                    >
                        <X size={16} />
                    </button>
                </div>
                
                <input
                    type="file"
                    disabled={isSubmitting}
                    className="text-xs border border-slate-200 dark:border-slate-700 rounded p-2.5 w-full bg-slate-50 dark:bg-[#12161c]"
                    required
                />
                
                <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        disabled={isSubmitting}
                        onClick={onClose}
                        className="rounded-[4px] text-xs cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#ff4a1f] hover:bg-[#e03e15] text-white cursor-pointer rounded-[4px] text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Uploading POD...</span>
                            </>
                        ) : (
                            <>
                                <Upload size={13} />
                                <span>Confirm & Upload POD</span>
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>,
        document.body
    );
};

export default OrderPODModal;
