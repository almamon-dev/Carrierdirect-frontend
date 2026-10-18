import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Eye, MessageSquare, MoreVertical, Truck } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { CustomerWonQuoteItem } from '../types';

interface CustomerWonRowActionsProps {
    row: CustomerWonQuoteItem;
    onView?: (row: CustomerWonQuoteItem) => void;
}

export const CustomerWonRowActions: React.FC<CustomerWonRowActionsProps> = ({ row, onView }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const rawId = row.rawId || row.id;

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 180),
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    const handleViewDetails = () => {
        handleClose();
        if (onView) {
            onView(row);
        } else {
            navigate(`/customer/quotes/received/view/${encryptId(rawId)}`);
        }
    };

    const handleOpenChat = () => {
        handleClose();
        navigate(`/customer/quotes/negotiation/conversation/${encryptId(rawId)}`);
    };

    const handleViewOrder = () => {
        handleClose();
        if (row.order_id || row.orderId) {
            navigate(`/customer/orders/${row.order_id || row.orderId}`);
        } else {
            navigate('/customer/orders');
        }
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
    }, [isOpen]);

    const hasOrder = Boolean(
        row.order_id ||
        row.orderId ||
        row.is_paid ||
        row.has_order ||
        row.historyStatus === 'Booked' ||
        row.historyStatus === 'Completed' ||
        String(row.status).toLowerCase().includes('book') ||
        String(row.status).toLowerCase().includes('confirm')
    );

    return (
        <div className="relative flex items-center justify-end gap-1.5 w-full">
            <button
                type="button"
                onClick={handleViewDetails}
                title="View Quote Details"
                className="h-7 px-2.5 rounded-[3px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer group shrink-0"
            >
                <Eye size={12.5} className="shrink-0" />
                <span className="leading-none">View</span>
            </button>

            <Button
                variant="ghost"
                size="sm"
                title="More Options"
                className="h-7 w-7 p-0 rounded-[3px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleToggle}
            >
                <MoreVertical size={15} />
            </Button>

            {isOpen && createPortal(
                <div
                    className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-[3px] shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left"
                    style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer rounded-[3px]"
                        onClick={handleViewDetails}
                    >
                        <Eye size={14} className="text-slate-400" />
                        <span>View Details</span>
                    </button>

                    {hasOrder && (
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer rounded-[3px]"
                            onClick={handleViewOrder}
                        >
                            <Truck size={14} className="text-emerald-500" />
                            <span>Track Order</span>
                        </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer rounded-[3px]"
                        onClick={handleOpenChat}
                    >
                        <MessageSquare size={14} className="text-[#ff4a1f]" />
                        <span>Message Carrier</span>
                    </button>
                </div>,
                document.body
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-[9998] cursor-default"
                    onClick={handleClose}
                />
            )}
        </div>
    );
};
