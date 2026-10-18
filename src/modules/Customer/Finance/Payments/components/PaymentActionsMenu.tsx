import React from 'react';
import { createPortal } from 'react-dom';
import { Eye, Download, FileText, Package, Copy, Check, ShieldCheck, RotateCcw } from 'lucide-react';
import { CustomerPaymentItem } from '../types';

interface PaymentActionsMenuProps {
    isOpen: boolean;
    dropdownPos: { top: number; left: number };
    copied: boolean;
    row: CustomerPaymentItem;
    onClose: () => void;
    onViewReceipt: () => void;
    onDownloadReceipt: () => void;
    onViewInvoice: () => void;
    onViewOrder: () => void;
    onCopyId: () => void;
}

export const PaymentActionsMenu: React.FC<PaymentActionsMenuProps> = ({
    isOpen,
    dropdownPos,
    copied,
    row,
    onClose,
    onViewReceipt,
    onDownloadReceipt,
    onViewInvoice,
    onViewOrder,
    onCopyId,
}) => {
    if (!isOpen) return null;

    const hasInvoice = Boolean((row as any).invoice_id || (row as any).invoice_number || (row as any).invoice_url);
    const hasEscrow = Boolean((row as any).escrow || (row as any).escrow_id || (row as any).has_escrow || (row as any).escrow_status);
    const hasRefund = Boolean((row as any).refund || (row as any).refund_id || (row as any).refund_amount || (row as any).refund_status);

    return createPortal(
        <>
            <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            />
            <div
                style={{ top: dropdownPos.top, left: dropdownPos.left }}
                className="fixed z-50 w-52 bg-white dark:bg-[#1a1f26] border border-slate-200 dark:border-slate-700 rounded-md shadow-xl py-1 text-xs animate-in fade-in zoom-in-95 duration-100 font-sans"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400">
                    Payment Actions
                </div>

                {/* 1. View Payment Details */}
                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        onViewReceipt();
                    }}
                    className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer font-medium"
                >
                    <Eye size={13} className="text-slate-500" />
                    <span>View Payment Details</span>
                </button>

                {/* 2. Download Receipt — when available */}
                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        onDownloadReceipt();
                    }}
                    className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer font-medium"
                >
                    <Download size={13} className="text-slate-500" />
                    <span>Download Receipt</span>
                </button>

                {/* 3. View Invoice — when available */}
                {hasInvoice && (
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onViewInvoice();
                        }}
                        className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer font-medium"
                    >
                        <FileText size={13} className="text-slate-500" />
                        <span>View Invoice</span>
                    </button>
                )}

                {/* 4. View Escrow Details — when an escrow record exists */}
                {hasEscrow && (
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onViewReceipt();
                        }}
                        className="w-full px-3 py-1.5 text-left text-emerald-600 dark:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer font-medium"
                    >
                        <ShieldCheck size={13} className="text-emerald-500" />
                        <span>View Escrow Details</span>
                    </button>
                )}

                {/* 5. View Refund Details — when a refund exists */}
                {hasRefund && (
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onViewReceipt();
                        }}
                        className="w-full px-3 py-1.5 text-left text-amber-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer font-medium"
                    >
                        <RotateCcw size={13} className="text-amber-500" />
                        <span>View Refund Details</span>
                    </button>
                )}

                {/* View Related Order */}
                {row.order_id && (
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onViewOrder();
                        }}
                        className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer font-medium"
                    >
                        <Package size={13} className="text-slate-500" />
                        <span>View Related Order</span>
                    </button>
                )}

                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                <button
                    type="button"
                    onClick={onCopyId}
                    className="w-full px-3 py-1.5 text-left text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer font-medium"
                >
                    {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-slate-400" />}
                    <span>{copied ? 'Copied ID!' : 'Copy Transaction ID'}</span>
                </button>
            </div>
        </>,
        document.body
    );
};

export default PaymentActionsMenu;
