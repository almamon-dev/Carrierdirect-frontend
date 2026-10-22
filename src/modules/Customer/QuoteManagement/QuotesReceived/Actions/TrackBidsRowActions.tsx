import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MoreVertical, CreditCard } from 'lucide-react';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { encryptId } from '@/lib/encryption';
import { apiClient } from '@/lib/axios';
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

    const rawStatus = (row.status || '').toLowerCase().trim();
    const rawStatusRaw = (row.status_raw || '').toLowerCase().trim();

    const isExpired = Boolean(
        row.is_expired ||
        rawStatus === 'expired' ||
        rawStatusRaw === 'expired' ||
        rawStatus === 'rejected' ||
        rawStatus === 'cancelled'
    );
    const isBooked = rawStatus === 'booked' || rawStatusRaw === 'booked' || Boolean(row.is_booked || row.isBooked);
    const isAwaitingPayment = Boolean(
        row.is_awaiting_payment ||
        row.isAwaitingPayment ||
        rawStatus === 'awaiting_payment' ||
        rawStatusRaw === 'awaiting_payment' ||
        ((rawStatus === 'accepted' || rawStatusRaw === 'accepted') && !isBooked && !row.is_paid && !row.isPaid)
    );
    const isAccepted = Boolean(
        rawStatus === 'accepted' ||
        rawStatusRaw === 'accepted' ||
        row.is_accepted ||
        row.isAccepted ||
        isBooked ||
        isAwaitingPayment
    );
    const isPending = !isExpired && !isAccepted && (rawStatusRaw === 'pending' || rawStatus === 'pending' || rawStatusRaw === 'new' || rawStatus === 'new');
    const isNegotiating = !isExpired && !isAccepted && (row.revision_status === 'pending' || rawStatus === 'negotiating' || rawStatus === 'negotiation');

    const canNegotiate = !isExpired;
    const canAccept = !isExpired && !isAccepted && (isPending || isNegotiating);
    const canDecline = !isExpired && !isAccepted;

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
    const reqId = row.quote_request_id || row.quoteRequestId || row.request_id || row.requestId || (row.quote_request && row.quote_request.id);
    const pdfUrl = row.pdf_url || row.pdf_path || row.quote_pdf || row.attachment_url || row.pdfUrl || '';
    const hasPdf = Boolean(pdfUrl || reqId);

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
        <div className="relative flex items-center justify-end gap-1.5 w-full">
            {isAwaitingPayment && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAccept(rawId);
                    }}
                    title="Complete Payment"
                    className="h-7 px-2.5 rounded-[3px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
                >
                    <CreditCard size={12.5} className="shrink-0" />
                    <span className="leading-none whitespace-nowrap">Pay Now</span>
                </button>
            )}

            <Button
                ref={triggerRef}
                variant="ghost"
                size="sm"
                title="More Options"
                className="h-7 w-7 p-0 rounded-[4px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
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
                isAwaitingPayment={isAwaitingPayment}
                canNegotiate={canNegotiate}
                canAccept={canAccept}
                canDecline={canDecline}
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
                hasPdf={hasPdf}
                pdfUrl={pdfUrl}
                onDownloadPdf={async () => {
                    if (pdfUrl && typeof pdfUrl === 'string' && pdfUrl.startsWith('http')) {
                        window.open(pdfUrl, '_blank');
                        return;
                    }
                    const cleanReqId = String(reqId || '').replace(/[^0-9]/g, '').trim();
                    if (!cleanReqId) return;
                    try {
                        const blob = await apiClient.getBlob(`/customer/quote-requests/${cleanReqId}/download-pdf`);
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `QuoteRequest-REQ-${cleanReqId.padStart(4, '0')}.pdf`);
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
                    } catch (err) {
                        console.error('Failed to download PDF:', err);
                    }
                }}
            />
        </div>
    );
};
