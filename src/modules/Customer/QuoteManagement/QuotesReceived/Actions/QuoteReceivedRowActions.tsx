import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, MessageSquare, Check, Loader2, MoreVertical } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { QuoteReceivedActionsMenu } from './QuoteReceivedActionsMenu';

interface QuoteReceivedRowActionsProps {
    row: any;
    isAccepting?: boolean;
    onAccept: (quoteId: number) => void;
    onReject: (row: any) => void;
}

export const QuoteReceivedRowActions: React.FC<QuoteReceivedRowActionsProps> = ({
    row,
    isAccepting,
    onAccept,
    onReject,
}) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isPending = (row.status_raw || row.status || '').toLowerCase() === 'pending';
    const isNegotiating = row.revision_status === 'pending' || (row.status || '').toLowerCase() === 'negotiating';

    const handleClose = useCallback(() => setIsOpen(false), []);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (isOpen) {
            setIsOpen(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 4,
                left: Math.max(10, rect.right - 180)
            });
            setIsOpen(true);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        const handleMouseDown = (e: MouseEvent) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
                triggerRef.current && !triggerRef.current.contains(e.target as Node)
            ) {
                handleClose();
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        const handleScroll = () => handleClose();

        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [isOpen, handleClose]);

    return (
        <div className="flex items-center justify-end gap-1.5 w-full min-h-[26px]">
            <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/customer/quotes/negotiation/conversation/${encryptId(row.id)}`);
                }}
                className="h-7 px-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[5px] cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1 shrink-0"
                title="Chat with Supplier"
            >
                <MessageSquare size={12.5} className="shrink-0 text-slate-500 dark:text-slate-400" />
                <span>Chat</span>
            </Button>

            {(isPending || isNegotiating) ? (
                <Button
                    variant="primary"
                    size="sm"
                    disabled={isAccepting}
                    onClick={(e) => {
                        e.stopPropagation();
                        onAccept(row.id);
                    }}
                    className="h-7 px-2.5 text-xs font-bold text-white bg-[#ff4a1f] hover:bg-[#e03e15] rounded-[5px] cursor-pointer shadow-2xs whitespace-nowrap disabled:opacity-50 flex items-center gap-1 shrink-0"
                    title="Accept Quote Offer"
                >
                    {isAccepting ? <Loader2 size={12.5} className="animate-spin text-white shrink-0" /> : <Check size={13} className="shrink-0 text-white stroke-[2.5]" />}
                    <span>Accept</span>
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/customer/quotes/received/view/${encryptId(row.id)}`);
                    }}
                    className="h-7 px-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-[5px] cursor-pointer shadow-2xs whitespace-nowrap flex items-center gap-1 shrink-0"
                    title="View Details"
                >
                    <Eye size={12.5} className="shrink-0 text-slate-500 dark:text-slate-400" />
                    <span>View</span>
                </Button>
            )}

            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-[5px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleToggle}
                title="More actions"
            >
                <MoreVertical size={15} />
            </Button>

            <QuoteReceivedActionsMenu
                isOpen={isOpen}
                dropdownPos={dropdownPos}
                dropdownRef={dropdownRef}
                isPending={isPending}
                isNegotiating={isNegotiating}
                isAccepting={isAccepting}
                onClose={handleClose}
                onViewDetails={() => navigate(`/customer/quotes/received/view/${encryptId(row.id)}`)}
                onOpenChat={() => navigate(`/customer/quotes/negotiation/conversation/${encryptId(row.id)}`)}
                onAccept={() => onAccept(row.id)}
                onReject={() => onReject(row)}
            />
        </div>
    );
};
