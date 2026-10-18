import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { DeclineOfferModal } from '@/modules/Customer/QuoteManagement/Negotiation/Chat/components/DeclineOfferModal';
import { NegotiationItem } from '../../../types';
import { ChatMessage } from '../../types';
import { useQuoteBubblePricing } from './useQuoteBubblePricing';
import { QuoteBubbleActionButtons } from './QuoteBubbleActionButtons';
import { QuoteBubbleActionMenu } from './QuoteBubbleActionMenu';
import { QuoteBubblePriceBreakdown } from './QuoteBubblePriceBreakdown';
import { QuoteBubbleActivityRow } from './QuoteBubbleActivityRow';
import { QuoteBubbleRoute } from './QuoteBubbleRoute';
import { QuoteBubbleCargoFooter } from './QuoteBubbleCargoFooter';

interface QuoteRequestBubbleCardProps {
    msg: ChatMessage;
    activeNegotiation: NegotiationItem;
    handleAcceptOffer: (msg: any) => void;
    handleRejectOffer: (msg: any, reason?: string) => void;
    handleTogglePinMessage?: (id: number | string) => void;
    handleDeleteMessage?: (id: number | string) => void;
    highlightedMsgId?: number | string | null;
}

export const QuoteRequestBubbleCard: React.FC<QuoteRequestBubbleCardProps> = ({
    msg,
    activeNegotiation,
    handleAcceptOffer,
    handleRejectOffer,
    handleTogglePinMessage,
    handleDeleteMessage,
    highlightedMsgId,
}) => {
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const customerName = msg.sender || activeNegotiation.customer || 'Customer';
    const quoteNum = activeNegotiation.quoteId || activeNegotiation.id || 'QT-0003';
    const pickupLoc = activeNegotiation.origin || activeNegotiation.pickup || '-';
    const deliveryLoc = activeNegotiation.destination || activeNegotiation.delivery || '-';
    const distanceStr = activeNegotiation.distance || '230 km (Air)';
    const pickupDate = activeNegotiation.pickupDate || 'Flexible / Today';
    const deliveryDate = activeNegotiation.deliveryDate || 'Standard Delivery';
    const palletType = activeNegotiation.palletType || '-';
    const vehicleType = activeNegotiation.vehicleType || 'Covered Van (20ft)';

    const {
        initialOffer,
        isAccepted,
        isDeclined,
        isSentByMe,
        canAccept,
        extraList,
        basePrice,
        totalQuotationAmount,
        notesText,
    } = useQuoteBubblePricing(msg, activeNegotiation);

    const avatarInitials = (customerName || 'Supplier Co 1')
        .split(' ')
        .map((w: string) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'S1';

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleCopyDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        const copySummary = `Quote Request #${quoteNum}\nCustomer: ${customerName}\nRoute: ${pickupLoc} → ${deliveryLoc} (${distanceStr})\nAmount: € ${initialOffer.toLocaleString()}\nSchedule: ${pickupDate} → ${deliveryDate}\nCargo: ${palletType} • ${vehicleType}\nNotes: ${notesText}`;
        navigator.clipboard.writeText(copySummary);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
            setIsMenuOpen(false);
        }, 1200);
    };

    return (
        <div className="space-y-2 w-full my-1.5">
            <QuoteBubbleActivityRow
                isSentByMe={isSentByMe}
                customerName={customerName}
                quoteNum={quoteNum}
                pickupLoc={pickupLoc}
                deliveryLoc={deliveryLoc}
                distanceStr={distanceStr}
                time={msg.time}
                totalQuotationAmount={totalQuotationAmount}
                activeNegotiation={activeNegotiation}
                avatarInitials={avatarInitials}
            />

            <div className={`flex items-center ${isSentByMe ? 'justify-end' : 'justify-start pl-10.5'} w-full my-1.5`}>
                <div className="relative w-[440px] sm:w-[460px] max-w-full group">
                    <div
                        id={`msg-bubble-${msg.id}`}
                        className={`bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[4px] p-3.5 w-full text-left shadow-2xs space-y-2.5 font-sans transition-all duration-300 ${
                            highlightedMsgId === msg.id ? 'ring-2 ring-[#FF4A1F] ring-offset-2' : ''
                        }`}
                    >
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-6 h-6 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 text-[#FF6A00] flex items-center justify-center shrink-0 border border-orange-200/60 dark:border-orange-900/40">
                                    <RefreshCw className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-[12.5px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                                        {canAccept ? 'Counter Offer Received' : 'Revised Offer Details'}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{msg.time || '-'}</p>
                                </div>
                            </div>
                            <span className="text-[11px] font-semibold text-[#FF6A00] bg-orange-50/70 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-[4px] border border-[#FF6A00]/40 shrink-0">
                                #{String(quoteNum).replace(/^#+/, '')}
                            </span>
                        </div>

                        <QuoteBubbleRoute pickupLoc={pickupLoc} deliveryLoc={deliveryLoc} distanceStr={distanceStr} />

                        <QuoteBubblePriceBreakdown
                            basePrice={basePrice}
                            extraList={extraList}
                            totalQuotationAmount={totalQuotationAmount}
                            canAccept={canAccept}
                        />

                        <QuoteBubbleCargoFooter
                            palletType={palletType}
                            vehicleType={vehicleType}
                            pickupDate={pickupDate}
                            deliveryDate={deliveryDate}
                            notesText={notesText}
                        />

                        <QuoteBubbleActionButtons
                            isAccepted={isAccepted}
                            isDeclined={isDeclined}
                            canAccept={canAccept}
                            totalQuotationAmount={totalQuotationAmount}
                            isAccepting={isAccepting}
                            onAccept={async () => {
                                setIsAccepting(true);
                                try {
                                    await handleAcceptOffer(msg);
                                } finally {
                                    setTimeout(() => setIsAccepting(false), 800);
                                }
                            }}
                            onOpenDeclineModal={() => setShowDeclineModal(true)}
                        />

                        <QuoteBubbleActionMenu
                            isSentByMe={isSentByMe}
                            isMenuOpen={isMenuOpen}
                            setIsMenuOpen={setIsMenuOpen}
                            menuRef={menuRef}
                            handleCopyDetails={handleCopyDetails}
                            copied={copied}
                            handleTogglePinMessage={handleTogglePinMessage}
                            handleDeleteMessage={handleDeleteMessage}
                            msgId={msg.id}
                            isPinned={msg.isPinned}
                        />
                    </div>
                </div>
            </div>

            <DeclineOfferModal
                isOpen={showDeclineModal}
                onClose={() => setShowDeclineModal(false)}
                offerAmount={initialOffer}
                currency="€"
                onConfirm={(reason) => handleRejectOffer(msg, reason)}
            />
        </div>
    );
};

export default QuoteRequestBubbleCard;
