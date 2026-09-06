import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Navigation, MessageSquare, MoreVertical, Star } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { OrderActionsMenu } from './OrderActionsMenu';
import { CustomerOrderItem } from '../types';

interface OrderRowActionsProps {
    row: CustomerOrderItem;
    onOpenRating: (target: { id: string; supplier: string; route: string }) => void;
}

export const OrderRowActions: React.FC<OrderRowActionsProps> = ({
    row,
    onOpenRating,
}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    const rawStatus = (row?.status_raw || row?.status || '').toLowerCase();
    const isCompleted = rawStatus === 'completed' || rawStatus === 'pod accepted';
    const isTransit = rawStatus.includes('transit') || rawStatus.includes('progress') || rawStatus.includes('confirmed') || rawStatus.includes('picked');
    const displayId = row.order_id || row.order_number || (row.id ? `ORD-${String(row.id).padStart(4, '0')}` : 'ORD-0001');
    const supplierName = row.supplier_name || row.supplier?.company_name || row.supplier?.name || 'Carrier Partner';
    const routeDisplay = row.route || `${row.pickup_city || 'Origin'} → ${row.delivery_city || 'Destination'}`;

    const handleClose = useCallback(() => setIsOpen(false), []);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 208)
            });
            setIsOpen(true);
        }
    };

    const handleViewDetails = () => {
        navigate(`/customer/orders/${row.id}`, { state: { orderData: row } });
    };

    const handleTrackOrder = () => {
        navigate(`/customer/quotes/processing/track/${row.id}`, { state: { order: row } });
    };

    const handleOpenChat = () => {
        const quoteTargetId = row.quote_id || row.quote_request_id || row.id;
        navigate(`/customer/quotes/negotiation/conversation/${encryptId(quoteTargetId)}`);
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(displayId);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            handleClose();
        }, 1200);
    };

    const handleRepeatOrder = () => {
        navigate('/customer/quotes/create/new', { state: { repeatData: row } });
    };

    const handleDownloadInvoice = () => {
        alert(`Invoice for Order #${displayId} downloaded.`);
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
        <div className="relative flex items-center justify-end gap-1.5 w-full min-h-[26px]">
            {/* Quick Primary Button */}
            {isTransit ? (
                <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleTrackOrder();
                    }}
                    className="h-7 px-2.5 bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-semibold rounded-[4px] cursor-pointer shadow-2xs flex items-center gap-1 shrink-0"
                    title="Live Tracking"
                >
                    <Navigation size={12} className="shrink-0" />
                    <span>Track</span>
                </Button>
            ) : isCompleted && !row.is_rated ? (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenRating({
                            id: String(row.id),
                            supplier: supplierName,
                            route: routeDisplay
                        });
                    }}
                    className="h-7 px-2 text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100 font-bold text-xs rounded-[4px] cursor-pointer shadow-2xs flex items-center gap-1 shrink-0"
                    title="Rate Carrier"
                >
                    <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
                    <span>Rate</span>
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails();
                    }}
                    className="h-7 px-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[4px] cursor-pointer shadow-2xs flex items-center gap-1 shrink-0"
                    title="View Order Details"
                >
                    <Eye size={12.5} className="text-slate-500 shrink-0" />
                    <span>View</span>
                </Button>
            )}



            {/* Three Dots Button */}
            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[4px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleToggle}
                title="More Actions"
            >
                <MoreVertical size={15} />
            </Button>

            {/* Dropdown Menu Portal */}
            <OrderActionsMenu
                isOpen={isOpen}
                dropdownPos={dropdownPos}
                copied={copied}
                row={row}
                onClose={handleClose}
                onViewDetails={handleViewDetails}
                onTrackOrder={handleTrackOrder}
                onOpenChat={handleOpenChat}
                onOpenRating={() => onOpenRating({
                    id: String(row.id),
                    supplier: supplierName,
                    route: routeDisplay
                })}
                onDownloadInvoice={handleDownloadInvoice}
                onRepeatOrder={handleRepeatOrder}
                onCopyId={handleCopyId}
            />
        </div>
    );
};

export default OrderRowActions;
