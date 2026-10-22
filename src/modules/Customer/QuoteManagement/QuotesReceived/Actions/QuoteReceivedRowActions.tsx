import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, MoreVertical, CreditCard, Layers } from 'lucide-react';
import Button from '@/components/ui/button';
import { encryptId } from '@/lib/encryption';
import { buildSecureQuoteUrl } from '@/utils/urlSecurity';
import { apiClient } from '@/lib/axios';
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

    const rawStatus = (row.status || '').toLowerCase().trim();
    const rawStatusRaw = (row.status_raw || '').toLowerCase().trim();

    const isExpired = Boolean(
        row.is_expired ||
        rawStatus === 'expired' ||
        rawStatusRaw === 'expired' ||
        rawStatus === 'rejected' ||
        rawStatus === 'cancelled'
    );
    const isBooked = rawStatus === 'booked' || rawStatusRaw === 'booked';
    const isAwaitingPayment = Boolean(
        row.is_awaiting_payment ||
        row.isAwaitingPayment ||
        rawStatus === 'awaiting_payment' ||
        rawStatusRaw === 'awaiting_payment' ||
        ((rawStatus === 'accepted' || rawStatusRaw === 'accepted') && !isBooked)
    );
    const isPending = !isExpired && !isBooked && (rawStatusRaw === 'pending' || rawStatus === 'pending');
    const isNegotiating = !isExpired && !isBooked && (row.revision_status === 'pending' || rawStatus === 'negotiating' || rawStatus === 'negotiation');

    const validOrderId = row.order_id || row.orderId || row.order?.id;
    const hasOrder = Boolean(validOrderId && isBooked);

    const canNegotiate = !isExpired && !isBooked;
    const canCounter = canNegotiate && (isPending || isNegotiating);
    const canAccept = canNegotiate && (isPending || isNegotiating) && !hasOrder;
    const canDecline = canNegotiate && (isPending || isNegotiating);

    const rawId = row.rawId || row.id;
    const reqId = row.quote_request_id || row.quoteRequestId || row.request_id || row.requestId || (row.quote_request && row.quote_request.id);
    const hasRequest = Boolean(reqId);

    const pdfUrl = row.pdf_url || row.pdf_path || row.quote_pdf || row.attachment_url || row.pdfUrl || '';
    const hasPdf = Boolean(pdfUrl || reqId);

    const handleClose = () => setIsOpen(false);

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

    const handleOpenChat = () => {
        handleClose();
        navigate(`/customer/quotes/negotiation/conversation/${encryptId(rawId)}`);
    };

    const handleViewRequest = () => {
        handleClose();
        if (reqId) {
            navigate(buildSecureQuoteUrl('view', reqId));
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

    return (
        <div className="relative flex items-center justify-end gap-1.5 w-full">
            {isAwaitingPayment ? (
                <button
                    type="button"
                    onClick={() => navigate(`/customer/quotes/received/checkout/${encryptId(rawId)}`)}
                    title="Proceed to Payment"
                    className="h-7 px-2.5 rounded-[3px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer group shrink-0"
                >
                    <CreditCard size={12.5} className="shrink-0" />
                    <span className="leading-none">Pay Now</span>
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handleOpenChat}
                    title="Open Negotiation Chat"
                    className="h-7 px-2.5 rounded-[3px] bg-[#ff4a1f] hover:bg-[#e03e15] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer group shrink-0"
                >
                    <MessageSquare size={12.5} className="shrink-0" />
                    <span className="leading-none">Chat</span>
                </button>
            )}

            <Button
                variant="ghost"
                size="sm"
                title="More Options"
                className="h-7 w-7 p-0 rounded-[2px] text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                onClick={handleToggle}
            >
                <MoreVertical size={15} />
            </Button>

            <QuoteReceivedActionsMenu
                isOpen={isOpen}
                dropdownPos={dropdownPos}
                dropdownRef={{ current: null }}
                isPending={isPending}
                isNegotiating={isNegotiating}
                canNegotiate={canNegotiate}
                canCounter={canCounter}
                canAccept={canAccept}
                canDecline={canDecline}
                isAccepting={isAccepting}
                hasOrder={hasOrder}
                hasRequest={hasRequest}
                hasPdf={hasPdf}
                pdfUrl={pdfUrl}
                onClose={handleClose}
                onViewQuote={() => navigate(`/customer/quotes/received/view/${encryptId(rawId)}`)}
                onCompareQuotes={() => navigate(`/customer/quotes/received/view/${encryptId(rawId)}?tab=suppliers`)}
                onViewRequest={handleViewRequest}
                onOpenChat={handleOpenChat}
                onCounterOffer={() => navigate(`/customer/quotes/negotiation/conversation/${encryptId(rawId)}`, { state: { autoOpenCounter: true } })}
                onViewOrder={() => navigate(`/customer/orders/${encryptId(validOrderId || rawId)}`)}
                onAccept={() => onAccept(rawId)}
                onReject={() => onReject(row)}
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
