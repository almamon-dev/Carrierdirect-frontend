import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Eye, Download, CreditCard } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { exportInvoicePdf } from '@/utils/exportInvoicePdf';
import { PayLaterActionsMenu } from './PayLaterActionsMenu';
import { CustomerPayLaterItem } from '../types';

interface PayLaterRowActionsProps {
    row: CustomerPayLaterItem;
    onViewDetails?: (inv: CustomerPayLaterItem) => void;
    onPayInvoice?: (inv: CustomerPayLaterItem) => void;
}

export const PayLaterRowActions: React.FC<PayLaterRowActionsProps> = ({
    row,
    onViewDetails,
    onPayInvoice,
}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    const rawStatus = (row?.raw_status || row?.status || '').toLowerCase().trim();
    const isDue = rawStatus === 'due' || rawStatus === 'overdue' || rawStatus === 'pending' || rawStatus === 'unpaid';
    const invoiceNum = row.invoice_number || (row.id ? `INV-${String(row.id).padStart(4, '0')}` : 'INV-0001');
    const orderTargetId = row.order_id || row.raw_id || row.id || 1;

    const handleClose = useCallback(() => setIsOpen(false), []);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const menuWidth = 210;
            const menuHeight = 240;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const left = Math.max(8, Math.min(rect.right - menuWidth, viewportWidth - menuWidth - 8));
            const spaceBelow = viewportHeight - rect.bottom;
            const top = spaceBelow < menuHeight && rect.top > menuHeight
                ? rect.top - menuHeight - 4
                : rect.bottom + 4;

            setDropdownPos({
                top: Math.max(8, top),
                left: Math.max(8, left)
            });
            setIsOpen(true);
        }
    };

    const handleView = () => {
        if (onViewDetails) {
            onViewDetails(row);
        } else {
            navigate('/customer/finance/invoices');
        }
    };

    const handleDownload = () => {
        handleClose();
        exportInvoicePdf(row);
    };

    const handleViewOrder = () => {
        navigate(`/customer/orders/${encryptId(orderTargetId)}`);
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(invoiceNum);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            handleClose();
        }, 1200);
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        const handleScroll = () => handleClose();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen, handleClose]);

    return (
        <div className="relative flex items-center justify-end gap-1 w-full min-h-[22px]">
            {/* Quick Primary Button */}
            {isDue ? (
                <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onPayInvoice) onPayInvoice(row);
                    }}
                    className="h-[25px] px-2 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-[11.5px] font-semibold rounded-[3px] cursor-pointer shadow-2xs flex items-center gap-1 shrink-0"
                    title="Settle Invoice"
                >
                    <CreditCard size={11} className="shrink-0" />
                    <span>Settle</span>
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleView();
                    }}
                    className="h-[25px] px-2 text-[11.5px] font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[3px] cursor-pointer shadow-2xs flex items-center gap-1 shrink-0"
                    title="View Invoices"
                >
                    <Eye size={11.5} className="text-slate-500 shrink-0" />
                    <span>View</span>
                </Button>
            )}

            {/* Three Dots Button */}
            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="h-[25px] w-[25px] p-0 rounded-[3px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleToggle}
                title="More Actions"
            >
                <MoreVertical size={14} />
            </Button>

            {/* Actions Menu Dropdown */}
            <PayLaterActionsMenu
                isOpen={isOpen}
                dropdownPos={dropdownPos}
                copied={copied}
                row={row}
                onClose={handleClose}
                onViewDetails={handleView}
                onDownloadInvoice={handleDownload}
                onPayInvoice={onPayInvoice ? () => onPayInvoice(row) : undefined}
                onViewOrder={handleViewOrder}
                onCopyId={handleCopyId}
            />
        </div>
    );
};

export default PayLaterRowActions;
