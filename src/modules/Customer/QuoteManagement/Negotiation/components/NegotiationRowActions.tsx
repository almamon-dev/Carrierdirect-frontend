import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, MoreVertical } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { CustomerNegotiationItem } from '../types';
import { NegotiationActionsMenu } from './NegotiationActionsMenu';

interface CustomerNegotiationRowActionsProps {
    row: CustomerNegotiationItem;
    onQuoteAction?: (row: CustomerNegotiationItem) => void;
}

export const NegotiationRowActions: React.FC<CustomerNegotiationRowActionsProps> = ({
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
            navigate(`/customer/quotes/negotiation/conversation/${encryptId(row.rawId || row.id)}`);
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
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        const handleScroll = () => handleClose();
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

            <Button
                variant="ghost"
                size="sm"
                title="More Options"
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleToggle}
            >
                <MoreVertical size={15} />
            </Button>

            <NegotiationActionsMenu
                isOpen={isOpen}
                dropdownPos={dropdownPos}
                copied={copied}
                onClose={handleClose}
                onViewDetails={() => {
                    handleClose();
                    navigate(`/customer/quotes/negotiation/conversation/${encryptId(row.rawId || row.id)}`);
                }}
                onOpenChat={handleOpenChat}
                onCopyId={handleCopyId}
            />
        </div>
    );
};
