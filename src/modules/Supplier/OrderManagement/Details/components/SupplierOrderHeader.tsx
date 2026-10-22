import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquare, MoreVertical, RefreshCw } from 'lucide-react';
import { StatusBadge } from '@/components/common/StatusBadge';
import Button from '@/components/ui/button';
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
    const triggerUpdateStatus = onOpenUpdateStatus || onUpdateStatus;

    return (
        <div className="flex flex-col gap-1.5 pb-0.5 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                            <span>Order Details</span>
                            <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold">
                                {order.orderNumber || order.id}
                            </span>
                        </h1>

                        <StatusBadge status={order.status} />

                        <StatusBadge
                            status={order.pricing?.paymentStatus || (isPaid ? 'Paid' : isPayLater ? 'Pay Later (Net-30)' : 'In Escrow')}
                            category={isPaid ? 'success' : isPayLater ? 'financial_hold' : 'financial_hold'}
                        />
                    </div>

                    <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex-wrap">
                        <span>Route:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{shortFrom}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{shortTo}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span>Delivery: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{order.deliveryDate}</strong></span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap sm:justify-end shrink-0">
                    {onOpenChat && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onOpenChat}
                            className="h-8 px-3 text-xs font-semibold bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                            <MessageSquare size={12} className="text-[#ff4a1f]" />
                            <span>Chat Customer</span>
                        </Button>
                    )}

                    {triggerUpdateStatus && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={triggerUpdateStatus}
                            className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                            <RefreshCw size={12} />
                            <span>Update Status</span>
                        </Button>
                    )}

                    <Button
                        ref={triggerRef}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 flex items-center justify-center shrink-0 bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shadow-2xs"
                        onClick={handleToggleMenu}
                        title="More options"
                    >
                        <MoreVertical size={13} />
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
