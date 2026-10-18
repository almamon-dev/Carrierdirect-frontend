import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MoreVertical } from 'lucide-react';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { encryptId } from '@/lib/encryption';
import { QuoteReceivedActionsMenu } from './QuoteReceivedActionsMenu';

interface TrackBidsRowActionsProps {
    row: any;
    isAccepting?: boolean;
    onAccept: (quoteId: number) => void;
    onReject: (row: any) => void;
}

export const TrackBidsRowActions: React.FC<TrackBidsRowActionsProps> = ({
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

    const isExpired = Boolean(
        row.is_expired ||
        (row.status || '').toLowerCase() === 'expired' ||
        (row.status_raw || '').toLowerCase() === 'expired' ||
        (row.status || '').toLowerCase() === 'rejected' ||
        (row.status || '').toLowerCase() === 'cancelled'
    );
    const isPending = !isExpired && (row.status_raw || row.status || '').toLowerCase() === 'pending';
    const isNegotiating = !isExpired && (row.revision_status === 'pending' || (row.status || '').toLowerCase() === 'negotiating');

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

    const rawId = row.rawId || row.id;

    const handleOpenChat = () => {
        handleClose();
        navigate(`/customer/quotes/negotiation/conversation/${encryptId(rawId)}`);
    };

    const handleViewDetails = () => {
        handleClose();
        navigate(`/customer/quotes/received/view/${encryptId(rawId)}`);
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

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };

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
        <div className="relative flex items-center justify-center w-full">
            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                title="More Options"
                className="h-7 w-7 p-0 rounded-[4px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer mx-auto flex items-center justify-center"
                onClick={handleToggle}
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
                onViewDetails={handleViewDetails}
                onOpenChat={handleOpenChat}
                onAccept={() => {
                    handleClose();
                    onAccept(rawId);
                }}
                onReject={() => {
                    handleClose();
                    onReject(row);
                }}
            />
        </div>
    );
};
