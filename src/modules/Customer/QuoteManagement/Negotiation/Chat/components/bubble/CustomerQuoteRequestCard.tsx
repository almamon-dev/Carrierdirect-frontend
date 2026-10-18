import React, { useState } from 'react';
import { ChevronRight, Truck, RefreshCw } from 'lucide-react';
import { DeclineOfferModal } from '../DeclineOfferModal';
import { CustomerChatItem, CustomerChatMessage } from '../../types';
import { CustomerQuoteRequestCardDetails } from './CustomerQuoteRequestCardDetails';
import { CustomerQuoteRequestCardActions } from './CustomerQuoteRequestCardActions';
import { calculateQuoteRates } from './customerQuoteRateUtils';
import { CustomerQuoteCardMenu } from './CustomerQuoteCardMenu';
import { CustomerQuoteCardPricingRoute } from './CustomerQuoteCardPricingRoute';
import { CustomerQuoteActivitySpeechBubble } from './CustomerQuoteActivitySpeechBubble';

interface CustomerQuoteRequestCardProps {
    msg: CustomerChatMessage;
    activeChat: CustomerChatItem | null;
    spacingClass: string;
    onAcceptOffer: (msg: CustomerChatMessage) => void;
    onRejectOffer: (msg: CustomerChatMessage, reason?: string) => void;
    onOpenCounterOffer?: () => void;
    onTogglePinMessage?: (id: string | number) => void;
    onDeleteMessage?: (id: string | number) => void;
}

export const CustomerQuoteRequestCard: React.FC<CustomerQuoteRequestCardProps> = ({
    msg,
    activeChat,
    spacingClass,
    onAcceptOffer,
    onRejectOffer,
    onOpenCounterOffer,
    onTogglePinMessage,
    onDeleteMessage,
}) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);

    const quoteNum = msg.quoteNo || activeChat?.quoteNo || 'QT-0001';
    const pickupLoc = activeChat?.origin || '-';
    const deliveryLoc = activeChat?.destination || '-';
    const dist = activeChat?.distance || '—';
    const vehicle = activeChat?.vehicleType || 'Covered Van (20ft)';
    const initialOffer = Number(msg.newTotal || activeChat?.currentPrice || 0);

    const { extraCharges, baseFreightRate, totalQuotationAmount } = calculateQuoteRates(msg, activeChat);

    const pickupDate = (activeChat as any)?.pickupDate || activeChat?.raw?.pickup_date || 'Flexible / Today';
    const deliveryDate = (activeChat as any)?.deliveryDate || activeChat?.raw?.delivery_date || 'Standard Delivery';
    const palletType = (activeChat as any)?.palletType || activeChat?.raw?.pallet_type || '-';
    const transitTime = activeChat?.raw?.transitTime || activeChat?.raw?.estimated_time || '1 - 2 Business Days';
    const notes = (activeChat as any)?.notes || activeChat?.raw?.notes || activeChat?.raw?.message_snippet || '';

    const supplierDisplayName = activeChat?.carrier || activeChat?.company || activeChat?.name || 'Supplier Co 1';
    const avatarInitials = supplierDisplayName
        .split(' ')
        .map((w: string) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'S1';

    const handleCopyDetails = () => {
        const textToCopy = `Quote Request ${quoteNum}\nPickup: ${pickupLoc}\nDelivery: ${deliveryLoc}\nDistance: ${dist}\nEst. Transit: ${transitTime}\nRate: € ${initialOffer.toLocaleString()}\nCargo: ${palletType} • ${vehicle}\nNotes: ${notes}`;
        navigator.clipboard.writeText(textToCopy);
    };

    const isSentByMe = Boolean(
        (msg as any).is_my_offer !== undefined ? (msg as any).is_my_offer :
            (msg as any).is_me !== undefined ? (msg as any).is_me :
                (msg as any).isSent !== undefined ? (msg as any).isSent :
                    msg.type === 'sent' ? true :
                        msg.type === 'received' ? false :
                            true
    );

    return (
        <div className={`space-y-2 w-full ${spacingClass}`}>
            <CustomerQuoteActivitySpeechBubble
                msg={msg}
                activeChat={activeChat}
                isSentByMe={isSentByMe}
                supplierDisplayName={supplierDisplayName}
                quoteNum={quoteNum}
                pickupLoc={pickupLoc}
                deliveryLoc={deliveryLoc}
                dist={dist}
                avatarInitials={avatarInitials}
            />

            {/* 2. Quote Details Card */}
            <div className={`flex items-center ${isSentByMe ? 'justify-end' : 'justify-start pl-[42px]'} w-full my-1.5`}>
                <div className="relative w-[440px] sm:w-[460px] max-w-full group">
                    <div
                        id={`msg-bubble-${msg.id}`}
                        className="bg-white dark:bg-[#12161c] border border-slate-200/90 dark:border-slate-800 rounded-[4px] p-3.5 w-full text-left shadow-2xs space-y-2.5 font-sans"
                    >
                        {/* Card Header */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 min-w-0">
                                <div className="w-6 h-6 rounded-[4px] bg-orange-50 dark:bg-orange-950/40 text-[#FF6A00] flex items-center justify-center shrink-0 border border-orange-200/60 dark:border-orange-900/40">
                                    <RefreshCw className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-[12.5px] font-bold text-slate-800 dark:text-slate-100 leading-tight truncate">Quote Details</h3>
                                    <p className="text-[10px] text-slate-400 font-medium truncate">{msg.time || '-'}</p>
                                </div>
                            </div>

                            <span className="text-[11px] font-semibold text-[#FF6A00] bg-orange-50/70 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-[4px] border border-[#FF6A00]/40 shrink-0">
                                #{String(quoteNum).replace(/^#+/, '')}
                            </span>
                        </div>

                        {/* Route & Pricing Breakdown */}
                        <CustomerQuoteCardPricingRoute
                            pickupLoc={pickupLoc}
                            deliveryLoc={deliveryLoc}
                            dist={dist}
                            baseFreightRate={baseFreightRate}
                            extraCharges={extraCharges}
                            totalQuotationAmount={totalQuotationAmount}
                        />

                        {/* Cargo & Expandable Details */}
                        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 min-w-0 truncate">
                                <Truck size={13} className="text-slate-500 shrink-0" />
                                <span className="truncate">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">Cargo: </span>
                                    {palletType} • {vehicle}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                                className="font-semibold text-[#FF6A00] hover:underline cursor-pointer flex items-center gap-0.5 shrink-0 ml-2"
                            >
                                <span>{isDetailsOpen ? "Close Details" : "View Details"}</span>
                                <ChevronRight size={13} className={`transition-transform duration-150 ${isDetailsOpen ? 'rotate-90' : ''}`} />
                            </button>
                        </div>

                        {isDetailsOpen && (
                            <div className="pt-1.5 space-y-1.5">
                                <CustomerQuoteRequestCardDetails
                                    pickupDate={pickupDate}
                                    deliveryDate={deliveryDate}
                                    palletType={palletType}
                                    vehicle={vehicle}
                                    notes={notes}
                                />
                            </div>
                        )}

                        <CustomerQuoteRequestCardActions
                            isAccepted={msg.status === 'accepted'}
                            isDeclined={msg.status === 'rejected'}
                            msg={msg}
                            activeChat={activeChat}
                            onAcceptOffer={onAcceptOffer}
                            onShowDeclineModal={() => setShowDeclineModal(true)}
                            onOpenCounterOffer={onOpenCounterOffer}
                        />

                        {/* Floating Three-Dot Button on Hover */}
                        <CustomerQuoteCardMenu
                            msg={msg}
                            isSentByMe={isSentByMe}
                            onCopyDetails={handleCopyDetails}
                            onTogglePinMessage={onTogglePinMessage}
                            onDeleteMessage={onDeleteMessage}
                        />
                    </div>
                </div>
            </div>

            <DeclineOfferModal
                isOpen={showDeclineModal}
                onClose={() => setShowDeclineModal(false)}
                offerAmount={initialOffer}
                currency="€"
                onConfirm={(reason) => onRejectOffer(msg, reason)}
            />
        </div>
    );
};

export default CustomerQuoteRequestCard;
