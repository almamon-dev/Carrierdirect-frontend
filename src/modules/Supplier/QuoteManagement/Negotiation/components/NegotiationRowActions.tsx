/**
 * Supplier Negotiation Row Actions Menu
 * Matches SupplierRowActions style with single 3-dots dropdown menu using React Portal.
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Eye, MessageSquare, Copy, Check, Lock } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { NegotiationItem } from '../types';

interface NegotiationRowActionsProps {
    row: NegotiationItem;
    onQuoteAction?: (row: NegotiationItem) => void;
}

export const NegotiationRowActions: React.FC<NegotiationRowActionsProps> = ({
    row,
    onQuoteAction,
}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 192)
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    const handleOpenChat = () => {
        handleClose();
        if (row.priority === 'Urgent' && onQuoteAction) {
            onQuoteAction(row);
        } else {
            const encId = encryptId(row.rawId || row.id);
            const sKey = row.sessionKey || `ses-${row.rawId || row.id}`;
            navigate(`/supplier/quotes/negotiation/conversation/${encId}/${sKey}`);
        }
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(row.quoteId || row.id);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            handleClose();
        }, 1200);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        const handleScroll = () => {
            handleClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

    const unreadCount = row.unreadCount && row.unreadCount > 0 ? row.unreadCount : (row.priority === 'Urgent' ? 1 : 0);

    return (
        <div className="relative flex items-center justify-end gap-1.5 w-full">
            {/* Direct 1-Click Chat Button */}
            <button
                type="button"
                onClick={handleOpenChat}
                title="Open Negotiation Chat"
                className="h-7 px-2.5 rounded-[3px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer group shrink-0"
            >
                <MessageSquare size={12.5} className="shrink-0" />
                <span className="leading-none">Chat</span>
                {unreadCount > 0 ? (
                    <span className="flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-bold text-white bg-emerald-500 rounded-full leading-none text-center shadow-xs">
                        {unreadCount}
                    </span>
                ) : null}
            </button>

            {/* Secondary 3-Dots Dropdown */}
            <Button
                variant="ghost"
                size="sm"
                title="More Options"
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleToggle}
            >
                <MoreVertical size={15} />
            </Button>

            {isOpen && createPortal(
                <>
                    {/* Transparent Click-Outside Backdrop */}
                    <div
                        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                        }}
                    />

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
                            const encId = encryptId(row.rawId || row.id);
                            const sKey = row.sessionKey || `ses-${row.rawId || row.id}`;
                            navigate(`/supplier/quotes/negotiation/conversation/${encId}/${sKey}`);
                        }}
                    >
                        <Eye size={14} className="text-slate-400 dark:text-slate-400 shrink-0" />
                        <span>View Details</span>
                    </button>

                    {/* Open Chat Channel / Reply */}
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-[#ff4a1f] hover:bg-orange-50 dark:hover:bg-[#ff4a1f]/10 flex items-center gap-2.5 transition-colors font-bold cursor-pointer"
                        onClick={handleOpenChat}
                    >
                        <MessageSquare size={14} className="text-[#ff4a1f] shrink-0" />
                        <span>Open Chat Channel</span>
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                    {/* Copy Negotiation ID */}
                    <button
                        type="button"
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                        onClick={handleCopyId}
                    >
                        {copied ? (
                            <>
                                <Check size={14} className="text-emerald-500 shrink-0" />
                                <span className="text-emerald-600 font-semibold">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={14} className="text-slate-400 shrink-0" />
                                <span>Copy Negotiation ID</span>
                            </>
                        )}
                    </button>
                </div>
            </>,
            document.body
            )}
        </div>
    );
};
