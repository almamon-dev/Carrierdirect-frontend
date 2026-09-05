import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Eye, Copy } from 'lucide-react';
import Button from '@/components/ui/button';
import { QuoteRequest } from '../../data/quoteRequestsData';
import { encryptId } from '@/lib/encryption';
import { SupplierActionButton } from './SupplierActionMenuItem';

interface SupplierRowActionsProps {
    row: QuoteRequest;
    onQuoteAction: (row: QuoteRequest) => void;
}

export const SupplierRowActions: React.FC<SupplierRowActionsProps> = ({
    row,
    onQuoteAction,
}) => {
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
                left: Math.max(10, rect.right - 192)
            });
            setIsOpen(true);
        }
    };

    const handleClose = () => setIsOpen(false);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        const handleScroll = () => handleClose();

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen]);

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
                <>
                    <div
                        className="fixed inset-0 z-[9998] cursor-default bg-transparent"
                        onClick={(e) => { e.stopPropagation(); handleClose(); }}
                    />

                    <div
                        className="fixed w-48 bg-white dark:bg-[#1e2329] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700/80 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100 text-left"
                        style={{ top: dropdownPos.top, left: dropdownPos.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                const rawId = String(row.rawId || row.slug || row.id).replace('REQ-', '').trim();
                                navigate(`/supplier/quotes/requests/${encryptId(rawId)}`);
                            }}
                        >
                            <Eye size={14} className="text-slate-400 shrink-0" />
                            <span>View Details</span>
                        </button>

                        <SupplierActionButton
                            row={row}
                            onQuoteAction={onQuoteAction}
                            onClose={handleClose}
                        />

                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                        <button
                            type="button"
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2.5 transition-colors font-medium cursor-pointer"
                            onClick={() => {
                                handleClose();
                                navigator.clipboard.writeText(row.id);
                            }}
                        >
                            <Copy size={14} className="text-slate-400 shrink-0" />
                            <span>Copy Request ID</span>
                        </button>
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};
