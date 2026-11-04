import { StatusBadge } from '@/components/common/StatusBadge';
import Button from '@/components/ui/button';
import { ArrowLeft, Box, MessageSquare, MoreVertical, RefreshCw } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';
import SupplierOrderHeaderMenu from './SupplierOrderHeaderMenu';

interface SupplierOrderHeaderProps {
    order: NormalizedSupplierOrder;
    isPodAccepted?: boolean;
    onOpenAssignDriver?: () => void;
    onOpenUploadPOD?: () => void;
    onOpenUpdateStatus?: () => void;
    onUpdateStatus?: () => void;
    onDownloadInvoice: () => void;
    onPrint: () => void;
    onOpenChat?: () => void;
}

export const SupplierOrderHeader: React.FC<SupplierOrderHeaderProps> = ({
    order,
    isPodAccepted = false,
    onOpenUpdateStatus,
    onUpdateStatus,
    onDownloadInvoice,
    onPrint,
    onOpenChat,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    const handleCopyId = () => {
        navigator.clipboard.writeText(order.orderNumber || order.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleToggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isMenuOpen) {
            setIsMenuOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 180),
            });
            setIsMenuOpen(true);
        }
    };

    const handleCloseMenu = useCallback(() => setIsMenuOpen(false), []);

    useEffect(() => {
        if (!isMenuOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleCloseMenu();
        };
        const handleScroll = () => handleCloseMenu();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isMenuOpen, handleCloseMenu]);

    const isCompleted = order.status === 'Completed' || isPodAccepted;
    const isTransit =
        order.status === 'In Transit' ||
        order.status === 'Picked Up' ||
        order.status === 'Driver Assigned' ||
        order.status === 'In Progress';
    const isPaid = order.pricing?.isPaid || isCompleted;
    const isPayLater = order.pricing?.isPayLater;

    const extractShortLocation = (loc: string) => {
        if (!loc) return 'Location';
        const parts = loc.split(',');
        if (parts.length >= 2) {
            return `${parts[parts.length - 2].trim().replace(/\d+/g, '')}, ${parts[parts.length - 1].trim().replace(/\d+/g, '')}`.trim();
        }
        return loc.trim();
    };

    const shortFrom = extractShortLocation(order.from || order.pickupFullAddress);
    const shortTo = extractShortLocation(order.to || order.deliveryFullAddress);
    const navigate = useNavigate();
    const triggerUpdateStatus = onOpenUpdateStatus || onUpdateStatus;
    const rawOrderNo = order.orderNumber || order.id || 'ORD-2026-10001';
    const displayOrderNumber = rawOrderNo.startsWith('#') ? rawOrderNo : `#${rawOrderNo}`;

    return (
        <div className="flex flex-col gap-1.5 pb-0.5 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                    {/* Left arrow Back button */}
                    <button
                        type="button"
                        onClick={() => navigate('/supplier/orders')}
                        className="w-8.5 h-8.5 rounded-[4px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e2329] flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shadow-2xs shrink-0 transition-colors"
                        title="Back to Orders"
                    >
                        <ArrowLeft size={16} />
                    </button>

                    {/* Order icon (package / box inside rounded orange container) */}
                    <div className="w-8.5 h-8.5 rounded-[4px] bg-[#fff5f2] dark:bg-[#2a1c18] border border-[#ffd5cc] dark:border-[#52291d] flex items-center justify-center text-[#ff4a1f] shrink-0 shadow-2xs">
                        <Box size={18} />
                    </div>

                    {/* Title: Order #ORD-... */}
                    <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1">
                        <span>Order</span>
                        <span className="font-mono text-slate-900 dark:text-slate-100 font-extrabold">
                            {displayOrderNumber}
                        </span>
                    </h1>

                    {/* Status Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <StatusBadge status={order.status} />

                        <StatusBadge
                            status={order.pricing?.paymentStatus || (isPaid ? 'Paid' : isPayLater ? 'Pay Later (Net-30)' : 'In Escrow')}
                            category={isPaid ? 'success' : isPayLater ? 'financial_hold' : 'financial_hold'}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap sm:justify-end shrink-0">
                    {onOpenChat && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onOpenChat}
                            className="h-8.5 px-3 text-xs font-semibold bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5 shadow-2xs rounded-[4px]"
                        >
                            <MessageSquare size={13} className="text-[#ff4a1f]" />
                            <span>Chat Customer</span>
                        </Button>
                    )}

                    {triggerUpdateStatus && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={triggerUpdateStatus}
                            className="h-8.5 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs rounded-[4px] transition-all"
                        >
                            <RefreshCw size={13} />
                            <span>Update Status</span>
                        </Button>
                    )}

                    <Button
                        ref={triggerRef}
                        variant="outline"
                        size="sm"
                        className="h-8.5 w-8.5 p-0 flex items-center justify-center shrink-0 bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shadow-2xs rounded-[4px]"
                        onClick={handleToggleMenu}
                        title="More options"
                    >
                        <MoreVertical size={14} />
                    </Button>

                    <SupplierOrderHeaderMenu
                        isOpen={isMenuOpen}
                        dropdownPos={dropdownPos}
                        order={order}
                        copied={copied}
                        onClose={handleCloseMenu}
                        onDownloadInvoice={onDownloadInvoice}
                        onPrint={onPrint}
                        onCopyId={handleCopyId}
                    />
                </div>
            </div>
        </div>
    );
};

export default SupplierOrderHeader;
