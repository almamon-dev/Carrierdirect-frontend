import React from 'react';
import { createPortal } from 'react-dom';
import { Eye, Download, CreditCard, Star, Package, Copy, Check } from 'lucide-react';
import { CustomerBillingItem } from '../types';

interface BillingActionsMenuProps {
    isOpen: boolean;
    dropdownPos: { top: number; left: number };
    copied: boolean;
    row: CustomerBillingItem;
    onClose: () => void;
    onViewDetails: () => void;
    onDownloadInvoice: () => void;
    onPayInvoice?: () => void;
    onViewOrder: () => void;
    onOpenRating?: () => void;
    onCopyId: () => void;
}

export const BillingActionsMenu: React.FC<BillingActionsMenuProps> = ({
    isOpen,
    dropdownPos,
    copied,
    row,
    onClose,
    onViewDetails,
    onDownloadInvoice,
    onPayInvoice,
    onViewOrder,
    onOpenRating,
    onCopyId,
}) => {
    if (!isOpen) return null;

    const rawStatus = String(row?.raw_status || row?.status || '').toLowerCase().trim();
    const isDue = rawStatus === 'due' || rawStatus === 'overdue' || rawStatus === 'pending' || rawStatus === 'unpaid';
    const isPaid = rawStatus === 'paid' || rawStatus === 'settled' || rawStatus === 'succeeded';

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
                    Billing Actions
                </div>

                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        onViewDetails();
                    }}
                    className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer font-medium"
                >
                    <Eye size={13} className="text-slate-500" />
                    <span>View Details</span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        onClose();
                        onDownloadInvoice();
                    }}
                    className="w-full px-3 py-1.5 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer font-medium"
                >
                    <Download size={13} className="text-slate-500" />
                    <span>Download PDF</span>
                </button>

                {isDue && onPayInvoice && (
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onPayInvoice();
                        }}
                        className="w-full px-3 py-1.5 text-left text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2 cursor-pointer font-bold"
                    >
                        <CreditCard size={13} className="text-[#ff4a1f]" />
                        <span>Pay Invoice Now</span>
                    </button>
                )}

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

                {isPaid && !row.is_rated && onOpenRating && (
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onOpenRating();
                        }}
                        className="w-full px-3 py-1.5 text-left text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 flex items-center gap-2 cursor-pointer font-medium"
                    >
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>Rate Carrier Service</span>
                    </button>
                )}

                <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                <button
                    type="button"
                    onClick={onCopyId}
                    className="w-full px-3 py-1.5 text-left text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-2 cursor-pointer font-medium"
                >
                    {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="text-slate-400" />}
                    <span>{copied ? 'Copied Number!' : 'Copy Invoice #'}</span>
                </button>
            </div>
        </>,
        document.body
    );
};

export default BillingActionsMenu;
