/**
 * WonRowActions Component
 * 3-dot dropdown action menu for Won Quotes using React Portal and rounded-[2px] buttons.
 */

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Eye, Truck, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/button';
import { WonQuoteItem } from '../types';

interface WonRowActionsProps {
    row: WonQuoteItem;
}

export const WonRowActions: React.FC<WonRowActionsProps> = ({ row }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

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

    return (
        <div className="relative flex items-center justify-end w-full">
            <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-auto flex items-center justify-center"
                onClick={handleToggle}
            >
                <MoreVertical size={15} />
            </Button>

            {isOpen && createPortal(
                <div
                    className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left"
                    style={{ top: dropdownPos.top, left: dropdownPos.left }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* View Details */}
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            handleClose();
                            navigate(`/supplier/quotes/requests/${row.slug}`);
                        }}
                    >
                        <Eye size={14} className="text-slate-400" />
                        <span>View Details</span>
                    </button>

                    {/* Track / View Job */}
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            handleClose();
                            navigate('/supplier/orders/active-jobs');
                        }}
                    >
                        <Truck size={14} className="text-emerald-500" />
                        <span>Active Job / Dispatch</span>
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    {/* Chat / Negotiation */}
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={() => {
                            handleClose();
                            navigate('/supplier/quotes/negotiation');
                        }}
                    >
                        <MessageSquare size={14} className="text-[#ff4a1f]" />
                        <span>Message Shipper</span>
                    </button>
                </div>,
                document.body
            )}

            {/* Backdrop to dismiss menu */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-[9998] cursor-default" 
                    onClick={handleClose} 
                />
            )}
        </div>
    );
};
