import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import {
    Check,
    Copy,
    FileText,
    MoreVertical,
    Printer,
    RefreshCw,
    Upload,
    UserPlus
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { NormalizedSupplierOrder } from '../utils/supplierOrderTrackUtils';

interface SupplierOrderHeaderProps {
    order: NormalizedSupplierOrder;
    isPodAccepted: boolean;
    onOpenAssignDriver: () => void;
    onOpenUploadPOD: () => void;
    onOpenUpdateStatus: () => void;
    onDownloadInvoice: () => void;
    onPrint: () => void;
}

export const SupplierOrderHeader: React.FC<SupplierOrderHeaderProps> = ({
    order,
    isPodAccepted,
    onOpenAssignDriver,
    onOpenUploadPOD,
    onOpenUpdateStatus,
    onDownloadInvoice,
    onPrint,
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
                left: Math.max(10, rect.right - 180)
            });
            setIsMenuOpen(true);
        }
    };

    const handleCloseMenu = useCallback(() => setIsMenuOpen(false), []);

    useEffect(() => {
        if (!isMenuOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleCloseMenu(); };
        const handleScroll = () => handleCloseMenu();
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isMenuOpen, handleCloseMenu]);

    const isCompleted = order.status === 'Completed' || isPodAccepted;
    const isTransit = order.status === 'In Transit' || order.status === 'Picked Up' || order.status === 'Driver Assigned' || order.status === 'In Progress';
    const isPaid = order.pricing?.isPaid || isCompleted;
    const isPayLater = order.pricing?.isPayLater;
    const isEscrow = order.pricing?.isEscrow;

    // Format clean short city names for the subtitle
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

    return (
        <div className="flex flex-col gap-1.5 pb-0.5 font-sans">
            {/* Main Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
                {/* Left Side: Title & Clean Subtitle */}
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5">
                            <span>Order Details</span>
                            <span className="font-mono text-slate-600 dark:text-slate-400 font-semibold">
                                {order.orderNumber || order.id}
                            </span>
                        </h1>

                        <Badge
                            className={`px-2 py-0.25 text-[11px] font-semibold rounded-full border ${
                                isCompleted
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                                    : isTransit
                                    ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800'
                                    : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
                            }`}
                        >
                            {order.status}
                        </Badge>

                        <Badge
                            className={`px-2 py-0.25 text-[11px] font-semibold rounded-full border flex items-center gap-1 ${
                                isPaid
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                                    : isPayLater
                                    ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800'
                                    : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
                            }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : isPayLater ? 'bg-purple-500' : 'bg-blue-500'}`} />
                            <span>{order.pricing?.paymentStatus || (isPaid ? 'Paid' : isPayLater ? 'Pay Later (Net-30)' : 'In Escrow')}</span>
                        </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        <span>Route:</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{shortFrom}</span>
                        <span className="text-slate-400">➔</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{shortTo}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span>ETA: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{order.estArrival}</strong></span>
                    </div>
                </div>

                {/* Right Side: Clean Action Buttons & More Dropdown */}
                <div className="flex items-center gap-1.5 flex-wrap sm:justify-end shrink-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        onClick={onOpenAssignDriver}
                    >
                        <UserPlus size={12} />
                        <span>{order.driver?.name && order.driver.name !== 'Unassigned' ? 'Re-assign Driver' : 'Assign Driver'}</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold bg-white dark:bg-[#1e2329] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        onClick={onOpenUploadPOD}
                    >
                        <Upload size={12} />
                        <span>Upload POD</span>
                    </Button>

                    <Button
                        variant="primary"
                        size="sm"
                        className="h-8 px-3.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        onClick={onOpenUpdateStatus}
                    >
                        <RefreshCw size={12} />
                        <span>Update Status</span>
                    </Button>

                    {/* Clean 3-dots Menu for Invoice, Print & Copy */}
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

                    {/* Portal Menu Dropdown */}
                    {isMenuOpen && createPortal(
                        <>
                            <div
                                className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                                onClick={handleCloseMenu}
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
                                        handleCloseMenu();
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
                                        handleCloseMenu();
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
                                        handleCopyId();
                                        handleCloseMenu();
                                    }}
                                >
                                    {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} className="text-slate-400" />}
                                    <span>{copied ? 'Order ID Copied' : 'Copy Order ID'}</span>
                                </button>
                            </div>
                        </>,
                        document.body
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupplierOrderHeader;
