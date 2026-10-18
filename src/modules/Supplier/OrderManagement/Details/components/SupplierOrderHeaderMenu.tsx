import React from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, FileText, Printer } from 'lucide-react';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';

interface SupplierOrderHeaderMenuProps {
    isOpen: boolean;
    dropdownPos: { top: number; left: number };
    order: NormalizedSupplierOrder;
    copied: boolean;
    onClose: () => void;
    onDownloadInvoice: () => void;
    onPrint: () => void;
    onCopyId: () => void;
}

export const SupplierOrderHeaderMenu: React.FC<SupplierOrderHeaderMenuProps> = ({
    isOpen,
    dropdownPos,
    order,
    copied,
    onClose,
    onDownloadInvoice,
    onPrint,
    onCopyId,
}) => {
    if (!isOpen) return null;

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

export default SupplierOrderHeaderMenu;
