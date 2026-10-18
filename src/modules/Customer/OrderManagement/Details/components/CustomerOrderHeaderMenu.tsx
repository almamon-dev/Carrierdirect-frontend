import React from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, FileText, Printer, Star } from 'lucide-react';
import { NormalizedCustomerOrder } from '../utils/customerOrderDetailsUtils';

interface CustomerOrderHeaderMenuProps {
    isOpen: boolean;
    dropdownPos: { top: number; left: number };
    order: NormalizedCustomerOrder;
    copied: boolean;
    onClose: () => void;
    onDownloadInvoice: () => void;
    onPrint: () => void;
    onOpenRating: () => void;
    onCopyId: () => void;
}

export const CustomerOrderHeaderMenu: React.FC<CustomerOrderHeaderMenuProps> = ({
    isOpen,
    dropdownPos,
    order,
    copied,
    onClose,
    onDownloadInvoice,
    onPrint,
    onOpenRating,
    onCopyId,
}) => {
    if (!isOpen) return null;

    const isCompleted = order.status === 'Completed';

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                onClick={onClose}
            />
            <div
                className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left font-sans"
                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium cursor-pointer"
                    onClick={() => {
                        onClose();
                        onDownloadInvoice();
                    }}
                >
                    <FileText size={13} className="text-[#ff4a1f]" />
                    <span>Download Invoice PDF</span>
                </button>

                <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium cursor-pointer"
                    onClick={() => {
                        onClose();
                        onPrint();
                    }}
                >
                    <Printer size={13} className="text-slate-500" />
                    <span>Print Order Details</span>
                </button>

                {isCompleted && !order.isRated && (
                    <button
                        type="button"
                        className="w-full text-left px-3 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 font-semibold cursor-pointer"
                        onClick={() => {
                            onClose();
                            onOpenRating();
                        }}
                    >
                        <Star size={13} className="fill-amber-500 text-amber-500" />
                        <span>Rate Carrier</span>
                    </button>
                )}

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium cursor-pointer"
                    onClick={() => {
                        onCopyId();
                        onClose();
                    }}
                >
                    {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} className="text-slate-400" />}
                    <span>{copied ? 'Order ID Copied' : 'Copy Order ID'}</span>
                </button>
            </div>
        </>,
        document.body
    );
};

export default CustomerOrderHeaderMenu;
